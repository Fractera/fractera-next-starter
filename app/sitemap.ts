import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { brand } from "@/lib/brand"
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config"

// КАРТА САЙТА — без неё каталог наполовину невидим.
//
// Витрина показывает первую партию товаров; остальные подгружаются по кнопке и в
// разметку не попадают, значит перейти на них поисковику неоткуда. Карта сайта —
// единственный канал, по которому он узнаёт о них. Строится из базы, поэтому
// товар, созданный после сборки, попадает сюда сам.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = brand().siteUrl
  if (!site) return []

  const rows = (await db.prepare(
    "SELECT id, created_at FROM products ORDER BY created_at DESC LIMIT 50000"
  ).all()) as unknown as { id: string; created_at: string }[]

  const out: MetadataRoute.Sitemap = []
  for (const lang of SUPPORTED_LANGUAGES) {
    out.push({ url: `${site}/${lang}/products`, changeFrequency: "daily", priority: 0.8 })
    for (const r of rows) {
      out.push({
        url: `${site}/${lang}/products/${r.id}`,
        lastModified: r.created_at ? new Date(`${r.created_at}Z`) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    }
  }
  return out
}
