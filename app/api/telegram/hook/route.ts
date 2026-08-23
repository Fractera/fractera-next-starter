// @api receive one telegram message pushed by the channel service
import { NextRequest, NextResponse } from "next/server"
import { ingest, recordOutgoing } from "@/lib/products/telegram-desk/ingest"
import { answer } from "@/lib/products/telegram-desk/answer"
import { dataFetch } from "@/lib/fractera/data-service"

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

/** Короткое подтверждение: что записано и как понято. Модель здесь не нужна. */
function confirm(r: { understood: boolean; artifacts: { kind: string }[] }): string {
  if (!r.understood) return "Записал. Разобрать не смог — сохранил как есть."
  const searchable = r.artifacts.some((a) => a.kind === "vector")
  return searchable ? "Записал — найдётся по смыслу." : "Записал."
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
  if (!text || !chatId) {
    return NextResponse.json({ ok: false, error: "text and chatId are required" }, { status: 400 })
  }

  const result = await ingest({
    externalId: String(body.id ?? ""),
    at: String(body.at ?? ""),
    chatId,
    who: String(body.who ?? ""),
    kind: String(body.kind ?? "text"),
    text,
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
    const reply = result.isQuestion ? await answer(text) : confirm(result)
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
