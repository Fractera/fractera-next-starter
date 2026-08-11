import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"
import { CATALOGUE_TAG } from "@/lib/catalogue"
import { requireRoles } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"

// PATCH — правка полей карточки. Обновляются ТОЛЬКО присланные поля: карточка
// сохраняет по одному полю за раз, и запрос вида «вот весь объект» затирал бы
// чужую правку, сделанную секундой раньше в соседней вкладке.
//
// Переводы приходят как { field, lang, value } и ложатся в колонку i18n тем же
// способом, что и в APP-CONFIG. Базовое значение и перевод — разные поля одного
// запроса, поэтому правка русского названия не трогает английское.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const { id } = await params
  const body = await req.json().catch(() => null) as
    | { name?: string; price?: number; description?: string | null; i18n?: { field: string; lang: string; value: string } }
    | null
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const row = await db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (typeof body.name === "string") {
    const name = body.name.trim()
    if (!name) return NextResponse.json({ error: "name cannot be empty" }, { status: 400 })
    await db.prepare("UPDATE products SET name = ? WHERE id = ?").run(name, id)
  }
  if (body.price != null) {
    const price = Number(body.price)
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "price must be a non-negative number" }, { status: 400 })
    }
    await db.prepare("UPDATE products SET price = ? WHERE id = ?").run(price, id)
  }
  if (body.description !== undefined) {
    await db.prepare("UPDATE products SET description = ? WHERE id = ?").run(body.description || null, id)
  }
  if (body.i18n) {
    // Читаем-меняем-пишем один ключ: класть присланный объект целиком значило бы
    // стирать переводы на других языках, которых правящий сейчас не видит.
    const { field, lang, value } = body.i18n
    let all: Record<string, Record<string, string>> = {}
    try { all = JSON.parse(String((row as { i18n?: string }).i18n ?? "{}")) || {} } catch { all = {} }
    all[field] = { ...(all[field] ?? {}) }
    if (value.trim()) all[field][lang] = value.trim()
    else delete all[field][lang]
    await db.prepare("UPDATE products SET i18n = ? WHERE id = ?").run(JSON.stringify(all), id)
  }

  // Публичные страницы обязаны увидеть правку сразу, а не через час:
  // сбрасываем метку каталога, и ISR пересоберёт их при следующем обращении.
  revalidateTag(CATALOGUE_TAG)
  const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  return NextResponse.json({ product })
}

// Карточка одного продукта. Отсутствие товара — 404, и это ЗАКОННЫЙ исход, а не
// ошибка: страница показывает его собственным состоянием и даёт дорогу назад.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const { id } = await params
  // Публичные страницы обязаны увидеть правку сразу, а не через час:
  // сбрасываем метку каталога, и ISR пересоберёт их при следующем обращении.
  revalidateTag(CATALOGUE_TAG)
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
  revalidateTag(CATALOGUE_TAG)
  return NextResponse.json({ ok: true })
}
