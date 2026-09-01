// @api read what the Telegram bot has heard, by cursor
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readInbox } from "@/lib/architect/channels"

// ДВЕРЬ СКЛАДА ВХОДЯЩИХ (77-5, 2026-09-01).
//
// 🔒 ЭТО НЕ ПЕРЕНОС: В ПАНЕЛИ ТАКОГО ЭКРАНА НЕТ ВОВСЕ. Служба хранит последние
// 500 сообщений с самого начала, и до сих пор их читал только код. Способность
// не новая — новой стала поверхность, на которой её видно.
//
// 🔒 ТОЛЬКО ЧТЕНИЕ И ТОЛЬКО ПО КУРСОРУ. `after` — идентификатор последнего
// известного сообщения; так лента дочитывает новое, а не перекачивает пятьсот
// записей каждые несколько секунд.
//
// 🔒 ПРЕДЕЛ ЗАЖИМАЕТ СЛУЖБА (не больше 200), И ВТОРОГО ПРЕДЕЛА ЗДЕСЬ НЕТ: две
// копии одного правила расходятся молча.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const after = Number(req.nextUrl.searchParams.get("after") ?? 0)
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50)

  return NextResponse.json(
    await readInbox(Number.isFinite(after) ? after : 0, Number.isFinite(limit) ? limit : 50),
    { headers: { "Cache-Control": "no-store" } },
  )
}
