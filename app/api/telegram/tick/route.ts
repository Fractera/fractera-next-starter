// @api fire calendar reminders whose time has come
import { NextRequest, NextResponse } from "next/server"
import { fireDue } from "@/lib/products/telegram-desk/calendar"

// ЧАСОВАЯ СТРЕЛКА ПРОДУКТА. Служба каналов стучит сюда по расписанию, которое
// владелец задаёт в панели; что именно наступило, решает продукт.
//
// 🔒 ТОТ ЖЕ СЕКРЕТ, ЧТО У hook, И ТА ЖЕ ПРИЧИНА: звонит служба, а не человек.
// Пустой секрет закрывает дверь наглухо, а не открывает её всем — иначе любой
// желающий мог бы разослать владельцу его же напоминания в три часа ночи.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_HOOK_SECRET ?? ""
  if (!secret) return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 })
  if (req.headers.get("x-channel-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 })
  }

  const result = await fireDue()
  return NextResponse.json({ ok: true, ...result })
}
