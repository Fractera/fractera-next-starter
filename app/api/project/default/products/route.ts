import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"
import { CATALOGUE_TAG } from "@/lib/catalogue"
import { getSession } from "@/lib/auth/get-session"
import { requireRoles } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"
import { entityId } from "@/lib/ids"

// Каталог — данные защищённого слоя, поэтому роль проверяется ЗДЕСЬ, а не только
// на странице. Маршрутизатор требует лишь наличие сессии, то есть пускает к этим
// данным любого вошедшего; проверка на странице отключается в браузере, а адрес
// маршрута виден в любой вкладке разработчика.
// Шаги страницы — закрытый перечень. Число из адреса идёт в SQL, поэтому оно
// обязано быть одним из этих, а не «любым, что прислали»: `perPage=100000`
// превращает страницу в выгрузку всей базы одним запросом.
const PAGE_SIZES = [10, 20, 50, 100]
const DEFAULT_PAGE_SIZE = 10

// Список читают ВСЕ ЧЕТЫРЕ группы: персонал ведёт карточки, финансы правят цены,
// администратор выбирает, что удалить, покупатель — что заказать. Право ПИСАТЬ
// этим не расширяется: создание ниже и правка полей в `[id]` решают это отдельно
// и по-своему. Видеть список и менять его — разные способности, и покупателю из
// набора изменений не досталось ни одной: его заказ живёт в его браузере.
export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, [
    ...PROTECTED_GROUP_ROLES.account,
    ...PROTECTED_GROUP_ROLES.staff,
    ...PROTECTED_GROUP_ROLES.finance,
    ...PROTECTED_GROUP_ROLES.admin,
  ])
  if (denied) return denied

  const url = new URL(req.url)
  const q = (url.searchParams.get("q") ?? "").trim()
  const asked = Number(url.searchParams.get("perPage"))
  const perPage = PAGE_SIZES.includes(asked) ? asked : DEFAULT_PAGE_SIZE
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1)

  // 🔒 ПОИСК И СТРАНИЦЫ СЧИТАЕТ СЕРВЕР. Забрать всё и отфильтровать в браузере
  // работает ровно до первой тысячи строк, а потом страница везёт мегабайты
  // ради десяти видимых записей — и везёт их каждому.
  //
  // Ищем по названию, описанию и по КОЛОНКЕ ПЕРЕВОДОВ: переведённое название
  // лежит в JSON, и без него поиск по-русски не нашёл бы «Яблоко», хотя оно на
  // экране. Это не полнотекстовый поиск, а честное подстрочное совпадение.
  const where = q ? "WHERE name LIKE ? OR description LIKE ? OR i18n LIKE ?" : ""
  const like = `%${q}%`
  const args = q ? [like, like, like] : []

  const totalRow = await db.prepare(`SELECT COUNT(*) AS n FROM products ${where}`).get(...args)
  const total = Number((totalRow as { n?: number } | null)?.n ?? 0)
  const pages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(page, pages)

  const products = await db.prepare(
    `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...args, perPage, (current - 1) * perPage)

  return NextResponse.json({ products, total, page: current, pages, perPage })
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
  // Идентификатор читаемый: он попадает в адрес страницы, а адрес читают люди.
  // Голый UUID делает все ссылки на свете одинаковыми на вид.
  const id = entityId(String(name))
  await db.prepare(
    "INSERT INTO products (id, name, price, media_id, media_url, created_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, String(name).trim(), Number(price), media_id ?? null, media_url ?? null, createdBy)

  // Публичные страницы обязаны увидеть новый товар сразу, а не через час:
  // сбрасываем метку каталога, и ISR пересоберёт их при следующем обращении.
  revalidateTag(CATALOGUE_TAG, { expire: 0 })

  const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  return NextResponse.json({ product }, { status: 201 })
}
