// @api link the owner Telegram chat and poll that handshake
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { CHANNELS_URL } from "@/lib/architect/channels"

// ДВЕРЬ ПРИВЯЗКИ ЧАТА — ПЕРЕНЕСЕНА ИЗ ПАНЕЛИ (77-3, 2026-09-01).
//
// 🔒 ПРИВЯЗКА — РУКОПОЖАТИЕ В ДВА ЗВОНКА, И ЧЕЛОВЕК ХОДИТ МЕЖДУ НИМИ. `POST`
// начинает и отдаёт ссылку с одноразовым кодом; `GET ?code=` спрашивает, дошёл ли
// именно этот код до бота. Идентификатор чата читается из САМОГО сообщения с
// кодом — поэтому привязка точная, а не догадка «последний, кто написал».
//
// 🔒 КОД ОДНОРАЗОВЫЙ И ЖИВЁТ 10 МИНУТ (`LINK_TTL_MS` службы), И ЭТО НЕ АККУРАТНОСТЬ,
// А ЗАЩИТА: ссылка открывается в мессенджере, где её видно, и переиспользуемый код
// позволил бы привязать чужую учётную запись к боту владельца.
//
// 🔒 ОПРОС, НЕ ДОЖДАВШИЙСЯ СЛУЖБЫ, ОТВЕЧАЕТ «ЖДЁМ», А НЕ ОШИБКОЙ. Один пропущенный
// такт при живом рукопожатии — обычное дело; показать отказ значило бы оборвать
// человека посреди действия, которое на самом деле идёт.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  try {
    const r = await fetch(`${CHANNELS_URL}/telegram/link/start`, {
      method: "POST",
      signal: AbortSignal.timeout(15000),
    })
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, {
      status: r.status,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (e) {
    return NextResponse.json(
      { error: `channels-unreachable: ${String((e as Error).message ?? e)}` },
      { status: 503 },
    )
  }
}

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const code = req.nextUrl.searchParams.get("code") ?? ""
  try {
    const r = await fetch(
      `${CHANNELS_URL}/telegram/link/poll?code=${encodeURIComponent(code)}`,
      { cache: "no-store", signal: AbortSignal.timeout(10000) },
    )
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, {
      status: r.status,
      headers: { "Cache-Control": "no-store" },
    })
  } catch {
    return NextResponse.json(
      { status: "waiting" },
      { headers: { "Cache-Control": "no-store" } },
    )
  }
}
