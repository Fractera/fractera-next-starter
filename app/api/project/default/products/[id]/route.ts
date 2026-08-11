import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"
import { CATALOGUE_TAG } from "@/lib/catalogue"
import { requireRoles, groupsOf } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"

// PATCH — правка полей карточки. Обновляются ТОЛЬКО присланные поля: карточка
// сохраняет по одному полю за раз, и запрос вида «вот весь объект» затирал бы
// чужую правку, сделанную секундой раньше в соседней вкладке.
//
// Переводы приходят как { field, lang, value } и ложатся в колонку i18n тем же
// способом, что и в APP-CONFIG. Базовое значение и перевод — разные поля одного
// запроса, поэтому правка русского названия не трогает английское.
// 🔒 ДВЕ ГРУППЫ, РАЗНЫЕ ПРАВА НА ПОЛЯ — И РЕШАЕТСЯ ЭТО ЗДЕСЬ, НА СЕРВЕРЕ.
//
// Персонал правит карточку целиком. Финансист правит ТОЛЬКО цену: у него своя
// страница, где остальные поля даже не показаны. Но интерфейс, который чего-то
// не показывает, — не ограничение: адрес маршрута виден в любой вкладке
// разработчика, и запрос с `name` отправляется вручную за десять секунд.
// Единственное место, где «только цена» становится правдой, — вот эта проверка.
//
// Отказ ЯВНЫЙ, а не тихое игнорирование лишнего поля: молча выполненный
// наполовину запрос выглядит как успех, и расхождение с базой обнаружится
// не сразу и не тем, кто его создал.
// Администратора здесь нет НАМЕРЕННО, а не по забывчивости: его единственное
// право — удалить товар (см. `DELETE` ниже), править содержимое он не может.
// Пустой набор полей означает 403 на любое поле, включая цену.
const FIELDS_BY_GROUP: Record<string, readonly string[]> = {
  staff: ["name", "price", "description", "i18n"],
  finance: ["price"],
  admin: [],
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const groups = await groupsOf(req)
  const allowedFields = new Set(groups.flatMap(g => FIELDS_BY_GROUP[g] ?? []))
  if (allowedFields.size === 0) {
    // Никакая группа не даёт полей: аноним, посторонняя роль — или АДМИНИСТРАТОР,
    // который правку и не должен мочь. Анонима до сюда не пускает и `proxy.ts`,
    // но маршрут обязан отвечать сам: он единственный, кто знает про поля.
    // `requireRoles` отдаёт `null`, когда доступ ЕСТЬ, — сюда мы попадаем только
    // когда его нет, но возвращать `null` из обработчика нельзя, поэтому исход
    // без отказа закрывается явным 403.
    const allowed = [...PROTECTED_GROUP_ROLES.staff, ...PROTECTED_GROUP_ROLES.finance]
    const denied = await requireRoles(req, allowed)
    return denied ?? NextResponse.json({ error: "Forbidden", requires: allowed }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json().catch(() => null) as
    | { name?: string; price?: number; description?: string | null; i18n?: { field: string; lang: string; value: string } }
    | null
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const asked = Object.keys(body).filter(k => body[k as keyof typeof body] !== undefined)
  const refused = asked.filter(k => !allowedFields.has(k))
  if (refused.length) {
    return NextResponse.json(
      { error: "Forbidden", fields: refused, allowed: [...allowedFields] },
      { status: 403 },
    )
  }

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
  revalidateTag(CATALOGUE_TAG, { expire: 0 })
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
  revalidateTag(CATALOGUE_TAG, { expire: 0 })
  const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ product })
}

// 🔒 УДАЛЕНИЕ — ПРАВО АДМИНИСТРАТОРА, И ТОЛЬКО ЕГО (решение владельца 2026-08-11).
//
// Персонал ведёт карточки и больше НЕ удаляет: у правки есть «отменить», у
// удаления — нет, и разводить эти две способности по разным ролям значит требовать
// второго человека там, где ошибка необратима. Администратор при этом не правит
// ничего (см. `FIELDS_BY_GROUP` выше): его единственное действие здесь — снести
// строку.
//
// Замок на разрушающем методе оговорён отдельно потому, что забыть его легче
// всего: он пишется последним и «и так же очевидно, что его никто не вызовет».
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.admin)
  if (denied) return denied

  const { id } = await params
  await db.prepare("DELETE FROM products WHERE id = ?").run(id)
  revalidateTag(CATALOGUE_TAG, { expire: 0 })
  return NextResponse.json({ ok: true })
}
