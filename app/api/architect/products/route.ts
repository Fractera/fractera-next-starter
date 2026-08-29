// @api list this project's products, create one, and save a dossier patch
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { createProduct, writeProductPatch, readRawDossier, productIds } from "@/lib/architect/products-writer"

// ДВЕРЬ ПРОДУКТОВ СЛОЯ АРХИТЕКТОРА (34-1, 2026-08-29).
//
// 🔒 РОЛЬ ПРОВЕРЯЕТСЯ ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ. Замок в браузере в браузере
// же и отключают, а адрес двери виден в любой вкладке разработчика. Настоящий
// замок — этот.
//
// 🔒 ТРИ ДЕЙСТВИЯ, ОДНА ДВЕРЬ, И ЭТО НЕ ЛЕНЬ. Все три работают с одной папкой и
// одним писателем; развести их по трём маршрутам значило бы завести три места, где
// надо помнить про вечный `id` и про заплату вместо снимка.
//
// 🔒 ЧИТАЕТСЯ СЫРОЕ ДОСЬЕ, А НЕ СЛИТОЕ С УМОЛЧАНИЯМИ. Форма правит файл и шлёт
// обратно заплату; покажи ей слитое — и первое же сохранение заморозило бы все
// умолчания шаблона в файле как «решения владельца», а следующая версия шаблона
// уже не смогла бы поменять ни одного.

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  // Список — обход папки: он и есть правда о том, какие продукты существуют.
  const items = productIds()
    .map(id => readRawDossier(id))
    .filter((d): d is Record<string, unknown> => d !== null)

  return NextResponse.json({ ok: true, items })
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  let body: { title?: unknown; id?: unknown; patch?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // Заплата по существующему продукту: `id` обязателен и в саму заплату не входит.
  if (typeof body.id === "string") {
    const result = writeProductPatch(body.id, body.patch)
    if (!result.ok) {
      const status = result.reason === "not-found" ? 404 : result.reason === "bad-body" ? 400 : 500
      return NextResponse.json({ ok: false, reason: result.reason, detail: result.detail }, { status })
    }
    return NextResponse.json({ ok: true, product: result.product })
  }

  // Иначе — создание. Пустое имя законно: `id` станет заголовком, пока владелец
  // не назвал продукт своими словами.
  const title = typeof body.title === "string" ? body.title : ""
  const result = createProduct(title)
  if (!result.ok) return NextResponse.json({ ok: false, reason: result.reason, detail: result.detail }, { status: 500 })
  return NextResponse.json({ ok: true, product: result.product })
}
