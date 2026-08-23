// @api pull messages the product missed while it was down
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"
import { backfill } from "@/lib/products/telegram-desk/backfill"

// ДОБОРКА ПРОПУЩЕННОГО — кнопка владельца, а не автоматика.
//
// 🔒 РОЛЬ ЗДЕСЬ ПРОВЕРЯЕТСЯ, В ОТЛИЧИЕ ОТ СОСЕДНЕЙ ДВЕРИ. В hook стучится служба
// без сессии, и её пускает общий секрет; сюда стучится человек из панели, и у
// него сессия есть. Разные звонящие — разные замки; одинаковых по виду дверей с
// разной защитой быть не должно, поэтому причина названа здесь.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.admin)
  if (denied) return denied

  const result = await backfill()
  return NextResponse.json({ ok: !result.error, ...result })
}
