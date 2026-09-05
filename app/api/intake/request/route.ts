// @api file a development request from the messenger conversation as pre-step
import { NextRequest, NextResponse } from "next/server"
import { writePreStep, countPending } from "@/lib/architect/pre-step-writer"

// ДВЕРЬ ЗАЯВКИ ОТ АГЕНТА (133, 2026-09-05).
//
// 🔒 ПОЧЕМУ НЕ СОСЕДНЯЯ `api/architect/pre-step`. Та закрыта РОЛЬЮ: стучится
// человек из браузера, у него есть сессия. Сюда стучится машина — предзагрузчик
// MCP, — и сессии у неё нет и быть не может. Замок другой по природе: общий
// секрет, тот же, что у `api/intake` рядом.
//
// 🔒 ПОЧЕМУ ОТДЕЛЬНАЯ ДВЕРЬ, А НЕ ПОЛЕ У `api/intake`. Приём и заявка — разные
// события: одно сохраняет сказанное, другое заводит РАБОТУ. Слив их, мы получили
// бы дверь, которая иногда создаёт задачи, а иногда нет, и решает это по полю в
// теле. Обязанность обязана быть видна из имени.
//
// 🔒 ЗАЧЕМ ЭТА ДВЕРЬ СУЩЕСТВУЕТ — РЕШЕНИЕ ВЛАДЕЛЬЦА 2026-09-05: агенту
// автоматизации разрабатывать **категорически запрещено**. Просьбу «сделай мне
// страницу» он не исполняет и не отклоняет — кладёт сюда и возвращает человеку
// имя файла. **Заявка — единственный законный путь из разговора в код.**
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_HOOK_SECRET ?? ""
  if (!secret) {
    return NextResponse.json({ ok: false, error: "intake-not-configured" }, { status: 503 })
  }
  if (req.headers.get("x-channel-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 })

  const result = writePreStep({
    text: String(body.text ?? ""),
    who: String(body.who ?? ""),
    channel: String(body.channel ?? "Telegram"),
    // 🔒 РОД ЗАДАЁТСЯ ЗДЕСЬ, А НЕ ПРИХОДИТ ИЗ ТЕЛА. Иначе звонящий мог бы
    // притвориться формой каталога блоков, и заявка потеряла бы свой строгий
    // закон вместе с источником.
    fromAgent: true,
    page: "разговор в мессенджере",
  })

  if (!result.ok) {
    const status = result.reason === "bad-body" ? 400 : 500
    return NextResponse.json({ ok: false, error: result.reason, detail: result.detail }, { status })
  }

  // 🔒 ИМЯ ФАЙЛА УЕЗЖАЕТ НАРУЖУ — РАДИ НЕГО ДВЕРЬ И ЗАВЕДЕНА. Человек называет
  // его боту агента разработки, и тот находит заявку. Ответ без имени превратил
  // бы «записал» в обещание, которое нечем проверить.
  return NextResponse.json({ ok: true, file: result.file, pending: countPending() })
}
