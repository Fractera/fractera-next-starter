// @api read the fact registry, add a fact, edit or disable one
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { allFacts, addFact, updateFact, disableFact } from "@/lib/facts/registry"
import { ensureFactTables } from "@/lib/facts/ensure"
import { factTableName } from "@/lib/facts/table"
import { FACT_LEVELS, FACT_ON_MISSING, FACT_VALUE_TYPES } from "@/lib/facts/types"

// ДВЕРЬ РЕЕСТРА ПРИЗНАКОВ (81-4).
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ. Через дверь заводится описание, из
// которого рождается ТАБЛИЦА В БАЗЕ: проверку в браузере в браузере же и
// отключают, а таблица остаётся навсегда.
//
// 🔒 ТАБЛИЦА СОЗДАЁТСЯ В ТОЙ ЖЕ ОПЕРАЦИИ, ЧТО И ЗАПИСЬ РЕЕСТРА, И ЭТО НЕ
// УДОБСТВО. Признак, у которого описание есть, а таблицы нет, выглядит рабочим и
// молча теряет значения; человек узнаёт об этом по пустоте через неделю. Либо
// признак заведён целиком, либо не заведён.
//
// 🔒 ВСТРОЕННЫЙ ПРИЗНАК ДВЕРЬ ПРАВИТЬ ОТКАЗЫВАЕТСЯ — отказом, а не молчанием.
// Правка, которая никуда не доедет, хуже отсутствующей: человек уверен, что
// настроил.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const no = (error: string, status = 400) =>
  NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } })

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied
  const facts = await allFacts()
  return NextResponse.json({ ok: true, facts }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return no("bad-json")

  const key = String(body.key ?? "").trim().toLowerCase()
  const title = String(body.title ?? "").trim()
  const howToFind = String(body.howToFind ?? "").trim()

  // 🔒 ПРОВЕРЯЕМ ДО ЗАПИСИ, А НЕ ПОСЛЕ, И КАЖДОЕ ПОЛЕ ОТДЕЛЬНО: человеку надо
  // сказать, ЧТО именно не так, а не «форма неверна».
  if (!factTableName(key)) return no("bad-key")
  if (!title) return no("no-title")
  // Инструкция узнавания — то, ради чего реестр существует. Признак без неё
  // будет колонкой, которую никто не заполняет.
  if (!howToFind) return no("no-how-to-find")

  const level = String(body.level ?? "field")
  const valueType = String(body.valueType ?? "text")
  const onMissing = String(body.onMissing ?? "silent")
  if (!FACT_LEVELS.includes(level as never)) return no("bad-level")
  if (!FACT_VALUE_TYPES.includes(valueType as never)) return no("bad-value-type")
  if (!FACT_ON_MISSING.includes(onMissing as never)) return no("bad-on-missing")

  const added = await addFact({
    key,
    level: level as never,
    title,
    description: String(body.description ?? "").trim(),
    valueType: valueType as never,
    howToFind,
    onMissing: onMissing as never,
  })
  if (!added.ok) return no(added.error ?? "refused", added.error === "builtin-exists" ? 409 : 400)

  // Описание записано — теперь ему нужно место. Отчёт возвращаем наружу: если
  // таблица не создалась, человек обязан узнать об этом сейчас.
  const report = await ensureFactTables(await allFacts())

  return NextResponse.json(
    { ok: true, key, table: factTableName(key), created: report.created, failed: report.failed },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function PATCH(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return no("bad-json")
  const key = String(body.key ?? "").trim().toLowerCase()
  if (!key) return no("no-key")

  // 🔒 ВЫКЛЮЧЕНИЕ — ОТДЕЛЬНОЕ ДЕЙСТВИЕ, А НЕ ПОЛЕ ПРАВКИ. Иначе «поправил
  // описание» и «убрал из разбора» становятся одним запросом, и второе
  // происходит случайно.
  if (body.disable === true) {
    const res = await disableFact(key)
    return res.ok
      ? NextResponse.json({ ok: true, key, disabled: true }, { headers: { "Cache-Control": "no-store" } })
      : no(res.error ?? "refused", res.error === "builtin-readonly" ? 409 : 400)
  }

  const onMissing = body.onMissing === undefined ? undefined : String(body.onMissing)
  if (onMissing !== undefined && !FACT_ON_MISSING.includes(onMissing as never)) {
    return no("bad-on-missing")
  }

  const res = await updateFact(key, {
    title: body.title === undefined ? undefined : String(body.title).trim(),
    description: body.description === undefined ? undefined : String(body.description).trim(),
    howToFind: body.howToFind === undefined ? undefined : String(body.howToFind).trim(),
    onMissing: onMissing as never,
  })
  return res.ok
    ? NextResponse.json({ ok: true, key }, { headers: { "Cache-Control": "no-store" } })
    : no(res.error ?? "refused", res.error === "builtin-readonly" ? 409 : 400)
}
