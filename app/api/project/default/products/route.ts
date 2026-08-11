import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth/get-session"
import { requireRoles } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"

// Каталог — данные защищённого слоя, поэтому роль проверяется ЗДЕСЬ, а не только
// на странице. Маршрутизатор требует лишь наличие сессии, то есть пускает к этим
// данным любого вошедшего; проверка на странице отключается в браузере, а адрес
// маршрута виден в любой вкладке разработчика.
export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const products = await db.prepare(
    "SELECT * FROM products ORDER BY created_at DESC"
  ).all()
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const { name, price, media_id, media_url } = await req.json()

  if (!name?.trim() || price == null) {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 })
  }

  const session = await getSession(req)
  const createdBy = session?.email ?? 'unknown'
  const id = crypto.randomUUID()
  await db.prepare(
    "INSERT INTO products (id, name, price, media_id, media_url, created_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, String(name).trim(), Number(price), media_id ?? null, media_url ?? null, createdBy)

  const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  return NextResponse.json({ product }, { status: 201 })
}
