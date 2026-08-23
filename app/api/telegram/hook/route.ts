// @api receive one telegram message pushed by the channel service
import { NextRequest, NextResponse } from "next/server"
import { ingest, recordOutgoing } from "@/lib/products/telegram-desk/ingest"
import { answer } from "@/lib/products/telegram-desk/answer"
import { dataFetch } from "@/lib/fractera/data-service"
import {
  propose, speak, confirm, cancel,
  waitingNow, confirmEntry, cancelEntry,
} from "@/lib/products/telegram-desk/calendar"
import { card } from "@/lib/products/telegram-desk/card"
import { GREETING } from "@/lib/products/telegram-desk/persona"
import { meta } from "@/lib/products/telegram-desk/branches/meta"

// ДВЕРЬ, В КОТОРУЮ СЛУЖБА КАНАЛОВ ТОЛКАЕТ СООБЩЕНИЕ.
//
// 🔒 РОЛЬ ЗДЕСЬ НЕ ПРОВЕРЯЕТСЯ, И ЭТО НЕ ДЫРА. Стучится не человек, а служба с
// соседнего порта: сессии у неё нет и быть не может. Вместо роли — общий секрет,
// и он же причина, по которой префикс стоит в PUBLIC_API_PREFIXES: гейт закрывает
// /api/* целиком, и без записи дверь отвечала бы 401 самой платформе.
//
// 🔒 СЕКРЕТ ОБЯЗАТЕЛЕН. Пусто в окружении — дверь закрыта наглухо (503), а не
// открыта всем: незаданный секрет, читаемый как «проверять нечего», превратил бы
// её в бесплатный вход в чужую базу и в чужой ключ модели.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ЧТО ОТВЕТИТЬ — четыре разных случая, и путать их дорого.
//
// 🔒 ПОДТВЕРЖДЕНИЕ ПРОВЕРЯЕТСЯ ПЕРВЫМ. Человек, сказавший «да», отвечает на
// последний вопрос продукта, а не заводит новую заметку с текстом «да».
async function compose(
  text: string,
  chatId: string,
  r: Awaited<ReturnType<typeof ingest>>,
): Promise<string> {
  switch (r.intent) {
    case "command":
      return GREETING

    // О себе отвечает личность, а не поиск по чужим заметкам.
    case "meta":
      return await meta(text)

    case "confirm": {
      const waiting = await waitingNow(chatId)
      // Подтверждать нечего — человек согласился с воздухом. Сказать это
      // честно дешевле, чем промолчать: иначе он ждёт напоминания, которого нет.
      if (!waiting) return "Сейчас нечего подтверждать."
      if (r.confirmation === "no") {
        if (waiting.what === "calendar") {
          await cancel(waiting.id)
          return "Отменил. Назовите другое время, если нужно."
        }
        await cancelEntry(waiting.id)
        return "Отменил. Напишите, как правильно."
      }
      if (waiting.what === "calendar") {
        await confirm(waiting.id)
        return `Поставил: ${waiting.title}.`
      }
      await confirmEntry(waiting.id)
      return `Подтвердил: ${waiting.title}.`
    }

    case "schedule": {
      // Время ПРОИЗНОСИТСЯ вслух и ждёт согласия — модель ошибается в датах,
      // а цена ошибки здесь не «неточность», а пропущенная встреча.
      if (r.schedule) {
        await propose(chatId, r.messageId, r.schedule)
        return speak(r.schedule)
      }
      // Ветвь угадана, время — нет. Просить уточнить честнее, чем молча
      // превратить просьбу в заметку: так это и терялось четыре раза подряд.
      return "Записал. Когда напомнить? Назовите дату и время."
    }

    case "question":
      return await answer(text)

    default:
      // 🔒 Один ответ на любой род: карточка показывает ТУ САМУЮ сводку,
      // что легла в базу. Ответ — расписка в понимании, а не вежливость.
      return card(r)
  }
}
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_HOOK_SECRET ?? ""
  if (!secret) {
    return NextResponse.json({ ok: false, error: "hook-not-configured" }, { status: 503 })
  }
  if (req.headers.get("x-channel-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 })

  const text = String(body.text ?? "").trim()
  const chatId = String(body.chatId ?? "")
  const fileId = String(body.fileId ?? "")
  // Текст ИЛИ файл — одного достаточно. Снимок без подписи несёт смысл на себе.
  if ((!text && !fileId) || !chatId) {
    return NextResponse.json({ ok: false, error: "text or fileId, and chatId, are required" }, { status: 400 })
  }

  const result = await ingest({
    externalId: String(body.id ?? ""),
    at: String(body.at ?? ""),
    chatId,
    who: String(body.who ?? ""),
    kind: String(body.kind ?? "text"),
    text,
    fileId: fileId || undefined,
    objectType: body.objectType ? String(body.objectType) : undefined,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lon: typeof body.lon === "number" ? body.lon : undefined,
  })

  // Повтор доставки: строка уже есть, отвечать человеку второй раз не за что.
  if (result.duplicate) {
    return NextResponse.json({ ok: true, messageId: result.messageId, duplicate: true })
  }

  // Ответ человеку. Он идёт через службу — своего клиента Telegram здесь нет и
  // не будет: читатель бота один, и это она.
  // 🔒 РАССКАЗ И ВОПРОС — РАЗНЫЕ ОТВЕТЫ, И ЭТО НЕ ВЕЖЛИВОСТЬ.
  // Первый живой прогон показал: на фразу «вчера купил ноутбук» ассистент
  // пересказал её же, исправив пунктуацию. Формально правил он не нарушил —
  // ничего не выдумал; полезного тоже не сказал. Человеку, который делится
  // фактом, нужно подтверждение, что факт записан и КАК он понят; ответ на
  // вопрос строится по всей истории и стоит дороже — задавать его на каждое
  // утверждение значит платить за эхо.
  let replied = false
  try {
    const reply = await compose(text, chatId, result)
    const res = await dataFetch("/service/channels/telegram/send", {
      method: "POST",
      body: JSON.stringify({ chatId, text: reply }),
    })
    replied = res.ok
    if (replied) await recordOutgoing(chatId, reply)
  } catch {
    // Ответ не ушёл — сообщение всё равно принято. Служба не должна повторять
    // доставку из-за того, что мы не смогли поговорить.
  }

  return NextResponse.json({
    ok: true,
    messageId: result.messageId,
    artifacts: result.artifacts.length,
    understood: result.understood,
    replied,
    notes: result.notes,
  })
}
