import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { NEXT_BATCH } from "@/lib/catalogue"
import { localizeProduct } from "@/lib/products/localize"
import type { Product } from "@/lib/products/types"

// Догрузка каталога — ПУБЛИЧНАЯ дверь, роль не проверяется: витрина открыта
// всем, и то, что она отдаёт, уже лежит в статическом HTML первой страницы.
//
// Отдаёт готовые к показу поля на языке запроса: разбирать переводы в браузере
// значило бы везти туда колонку `i18n` целиком со всеми языками.
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const lang = (url.searchParams.get("lang") ?? "en").slice(0, 5)
  // Смещение из адреса идёт в SQL: держим его числом и в разумных границах.
  const offset = Math.max(0, Math.min(100_000, Number(url.searchParams.get("offset")) || 0))

  const rows = (await db.prepare(
    "SELECT id, name, description, i18n, price, media_url, media_width, media_height, media_blur FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).all(NEXT_BATCH, offset)) as unknown as Product[]

  const products = rows.map(r => {
    const p = localizeProduct(r, lang)
    // Подложка и размеры едут дальше вместе со строкой: догруженная карточка обязана
    // выглядеть так же, как та, что приехала в первом HTML.
    return { id: p.id, name: p.localizedName, price: p.price, media_url: p.media_url,
             media_width: p.media_width, media_height: p.media_height, media_blur: p.media_blur }
  })
  return NextResponse.json({ products })
}
