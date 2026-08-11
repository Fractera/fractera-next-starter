import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireRoles } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"

// Карточка одного продукта. Отсутствие товара — 404, и это ЗАКОННЫЙ исход, а не
// ошибка: страница показывает его собственным состоянием и даёт дорогу назад.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const { id } = await params
  const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ product })
}

// Удаление — та же роль, что и чтение. Отдельно оговорено потому, что забыть
// замок легче всего на разрушающем методе: он пишется последним и «и так же
// очевидно, что его никто не вызовет».
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const { id } = await params
  await db.prepare("DELETE FROM products WHERE id = ?").run(id)
  return NextResponse.json({ ok: true })
}
