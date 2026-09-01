// @api read the state of the Telegram channel from the channels service
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readChannels } from "@/lib/architect/channels"

// ДВЕРЬ СОСТОЯНИЯ КАНАЛА — ПЕРЕНЕСЕНА ИЗ ПАНЕЛИ (77-3, 2026-09-01).
//
// 🔒 ДВЕРЬ ТОНКАЯ НАМЕРЕННО, И ЭТО ПЕРЕНОС, А НЕ УПРОЩЕНИЕ. В панели она такая же:
// спросить права и переслать вопрос службе. Логика бота живёт в `:3500` — второй
// её экземпляр здесь разошёлся бы с первым на первой же правке службы.
//
// 🔒 ЗАМОК — РОЛИ СЛОЯ, А НЕ `requireAuth` ПАНЕЛИ. Источник проверял «вошёл ли
// вообще»; здесь вход открыт посетителям сайта, и «вошёл» не значит «имеет право
// править бота». Тот же замок, что у пяти соседних дверей слоя.
//
// Динамическая по природе: состояние службы и привязки — живые.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  return NextResponse.json(await readChannels(), {
    headers: { "Cache-Control": "no-store" },
  })
}
