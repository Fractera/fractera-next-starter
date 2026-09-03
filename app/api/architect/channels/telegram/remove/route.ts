// @api remove one telegram bot from the channels service
import { type NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { CHANNELS_URL } from "@/lib/architect/channels"

// УДАЛЕНИЕ БОТА (99-4, 2026-09-03).
//
// 🔒 ОТДЕЛЬНАЯ ДВЕРЬ, А НЕ ПУСТОЙ ТОКЕН В НАСТРОЙКЕ. Пустой токен означает
// «бот пока без токена» — законное состояние только что добавленной строки;
// удаление — другое намерение, и путать их нельзя.
//
// 🛑 ПЕРЕПИСКА НЕ ТРОГАЕТСЯ, И ЭТО ГОВОРИТСЯ ЧЕЛОВЕКУ СЛОВАМИ НА ЭКРАНЕ.
// Разговоры и сообщения живут в базе чата — единственном хранилище, — и
// удаление подключения к ним отношения не имеет. Молчание здесь заставило бы
// человека думать, что он стёр переписку.
//
// 🔒 ЗАМОК ТОТ ЖЕ, ЧТО У СОСЕДНИХ ДВЕРЕЙ СЛОЯ: роль архитектора.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) {
    return denied
  }

  const bot = req.nextUrl.searchParams.get("bot") ?? ""
  if (!bot) {
    return NextResponse.json({ error: "bot-required" }, { status: 400 })
  }

  try {
    const r = await fetch(
      `${CHANNELS_URL}/telegram/remove?bot=${encodeURIComponent(bot)}`,
      { method: "POST", signal: AbortSignal.timeout(15_000) },
    )
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
      status: r.status,
    })
  } catch (e) {
    return NextResponse.json(
      { error: `channels-unreachable: ${String((e as Error).message ?? e)}` },
      { status: 503 },
    )
  }
}
