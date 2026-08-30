// @api create a pre-step request from the block catalogue
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { writePreStep, countPending } from "@/lib/architect/pre-step-writer"

// ДВЕРЬ ЗАЯВКИ (шаг 61-2, 2026-08-30).
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ. Заявка создаёт РАБОТУ для агента.
// Открытая дверь означала бы, что задачи агенту может ставить кто угодно, кто
// нашёл адрес, — а права даёт владелец, и только он.
//
// 🔒 ДВЕРЬ ТОЛЬКО ПИШЕТ. Чтения заявок здесь нет намеренно: их читает агент с
// диска, по своему закону и в свой момент. Дверь чтения превратила бы приёмную в
// экран очереди, а очередь на экране требует кнопки «выполнить» — то есть ровно
// того, что запрещено: заявка не исполняется по нажатию.
//
// Динамическая по природе: меняет состояние машины.
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 })
  }

  const result = writePreStep(body)

  if (!result.ok) {
    const status = result.reason === "bad-body" ? 400 : 500
    return NextResponse.json({ ok: false, error: result.reason, detail: result.detail }, { status })
  }

  // Число ожидающих уезжает вместе с ответом: тост скажет человеку не только
  // «создано», но и сколько заявок уже ждёт разбора. «Готово» без этого числа
  // звучит как «сделано», а сделано будет позже и не само.
  return NextResponse.json({ ok: true, file: result.file, path: result.path, pending: countPending() })
}
