// @api receive one message into all stores and return the text summary, no answer
import { NextRequest, NextResponse } from "next/server"
import { ingest, type Incoming } from "@/lib/products/telegram-desk/ingest"

// ДВЕРЬ ПРИЁМА — ПЕРВАЯ ВОЛНА И ТОЛЬКО ОНА (133, 2026-09-05).
//
// 🔒 ЗДЕСЬ НЕТ ОТВЕТА, И ЭТО ГЛАВНОЕ ОТЛИЧИЕ ОТ СОСЕДНЕЙ `api/telegram/hook`.
// Та принимает сообщение И сочиняет ответ (`answer`, `compose`, календарь,
// подтверждения). Слово владельца про этот шаг дословно: «мы ещё не ожидаем от
// него никакого ответа, никакой обработки, никакого результата — это следующий
// шаг». Дверь, умеющая отвечать, соблазняет ответить.
//
// 🔒 ВТОРАЯ ДВЕРЬ, А НЕ ФЛАГ У ПЕРВОЙ. Флаг `?silent=1` на `hook` означал бы, что
// один обработчик несёт две противоположные обязанности и решает по параметру,
// кем ему быть сегодня. Здесь обязанность одна и видна из имени.
//
// 🔒 ТОТ ЖЕ СЕКРЕТ, ЧТО У `hook`, И ЭТО НАМЕРЕННО. Второй секрет означал бы
// второе место, где его надо не потерять при переносе; а стучится сюда та же
// сторона — машина, у которой сессии нет и быть не может.
//
// 🛑 ПРЕФИКС ОБЯЗАН СТОЯТЬ В `PUBLIC_API_PREFIXES` (`proxy.ts`), иначе гейт
// закроет `/api/*` целиком и дверь ответит `401` самой платформе — ровно то, что
// уже оплачено соседней дверью.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Текст для агента — то, ради чего дверь существует.
 *
 * 🔒 АГЕНТ ПОЛУЧАЕТ САММАРИ, А НЕ ФАЙЛ И НЕ СЫРЬЁ. Решение владельца: «Claude Code
 * получает только саммари от OpenAI». Форма фразы — его же: «пользователь загрузил
 * аудио, которое после транскрибации внешней моделью вернуло такой текст…».
 *
 * 🛑 ЧТО СОХРАНИЛОСЬ, НАЗЫВАЕТСЯ ЧИСЛОМ, А НЕ ОБЕЩАНИЕМ. «Сохранено в трёх
 * хранилищах» без перечисления читается как успех даже тогда, когда два из трёх
 * отказали.
 */
function forAgent(kind: string, r: Awaited<ReturnType<typeof ingest>>, text: string): string {
  const lines: string[] = []
  // 🔒 ТЕКСТ ИЗ ФАЙЛА ЖИВЁТ В `fileText`, А НЕ В `text`. Второе — то, что человек
  // НАПИСАЛ своими руками; первое — то, что внешняя модель прочитала на снимке
  // или расслышала в записи. Слить их значило бы приписать человеку слова, которых
  // он не говорил, — тот же класс, что «автор слов и приславший» в конверте графа.
  const fromFile = r.fileText || ""

  if (kind === "voice" || kind === "audio") {
    lines.push("Пользователь загрузил аудио. После транскрибации внешней моделью получен текст:")
    lines.push(fromFile || "(речь не распознана)")
  } else if (kind === "photo" || kind === "image") {
    lines.push("Пользователь загрузил изображение. После изучения внешней моделью получено описание:")
    lines.push(fromFile || "(описание не получено)")
  } else if (kind === "document") {
    lines.push("Пользователь загрузил документ. Извлечённое содержимое:")
    lines.push(fromFile || "(содержимое не извлечено)")
  } else {
    lines.push("Сообщение пользователя:")
    lines.push(text)
  }

  // Подпись к файлу — отдельная строка: человек мог и приложить снимок, и сказать
  // о нём словами, и это разные сведения.
  if (fromFile && text) lines.push("", "Своими словами человек добавил: " + text)

  if (r.summary && r.summary !== text && r.summary !== fromFile) {
    lines.push("", "Суть: " + r.summary)
  }

  // 🔒 ЧТО ИМЕННО ЛЕГЛО — ПОИМЁННО. Агент по этой строке знает, можно ли уже
  // спрашивать граф (нельзя: он строится в фоне) и есть ли файл, к которому
  // вторая волна сможет вернуться.
  const where = r.artifacts.map(a => a.kind).join(", ")
  lines.push("", `Сохранено: сообщение #${r.messageId}` + (where ? ` · ${where}` : " · только текст"))

  if (r.duplicate) lines.push("Это повторная подача того же сообщения — новых записей не создано.")

  return lines.join("\n")
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_HOOK_SECRET ?? ""
  // 🔒 ПУСТОЙ СЕКРЕТ ЗАКРЫВАЕТ ДВЕРЬ, А НЕ ОТКРЫВАЕТ ЕЁ. Незаданный секрет,
  // прочитанный как «проверять нечего», сделал бы её входом в чужую базу.
  if (!secret) {
    return NextResponse.json({ ok: false, error: "intake-not-configured" }, { status: 503 })
  }
  if (req.headers.get("x-channel-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 })

  const text = String(body.text ?? "").trim()
  const chatId = String(body.chatId ?? "")
  const fileId = String(body.fileId ?? "")
  // Текст ИЛИ файл — одного достаточно: снимок без подписи несёт смысл на себе.
  if ((!text && !fileId) || !chatId) {
    return NextResponse.json(
      { ok: false, error: "text or fileId, and chatId, are required" },
      { status: 400 },
    )
  }

  const msg: Incoming = {
    externalId: String(body.externalId ?? `intake-${Date.now()}`),
    at: String(body.at ?? new Date().toISOString()),
    chatId,
    who: String(body.who ?? ""),
    kind: String(body.kind ?? (fileId ? "document" : "text")),
    text,
    forwardedFrom: body.forwardedFrom ? String(body.forwardedFrom) : undefined,
    objectType: body.objectType ? String(body.objectType) : undefined,
    fileId: fileId || undefined,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lon: typeof body.lon === "number" ? body.lon : undefined,
  }

  try {
    const r = await ingest(msg)
    return NextResponse.json({
      ok: true,
      forAgent: forAgent(msg.kind, r, text),
      messageId: r.messageId,
      duplicate: r.duplicate,
      artifacts: r.artifacts,
      intent: r.intent,
      summary: r.summary,
      // 🛑 КАНДИДАТ В РЕЕСТР ОТДАЁТСЯ НАРУЖУ, А НЕ ПРЯЧЕТСЯ: эволюция реестра
      // работает только тогда, когда предложение доходит до человека.
      candidate: r.candidate,
    })
  } catch (e) {
    // 🔒 ПРИЧИНА НАЗЫВАЕТСЯ, А НЕ ЗАМЕНЯЕТСЯ НА «НЕ ПОЛУЧИЛОСЬ». Вызывающий —
    // машина, и разбираться с отказом будет человек по этой строке.
    const reason = String((e as Error)?.message ?? e).slice(0, 300)
    return NextResponse.json({ ok: false, error: "intake-failed", reason }, { status: 500 })
  }
}
