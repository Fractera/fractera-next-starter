import type { MetadataRoute } from "next"
import { brand } from "@/lib/brand"
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config"

// ГЛАВНАЯ КАРТА САЙТА — страницы, множество которых конечно и авторское.
//
// 🔒 ТОВАРОВ ЗДЕСЬ НЕТ НАМЕРЕННО. Их множество растёт в рантайме и умножается на
// языки, поэтому один файл его не вмещает: предел — 50 000 адресов, и при
// превышении поисковик отбрасывает файл ЦЕЛИКОМ, вместе со страницами и постами.
// Товары живут в собственной карте, разбитой на порции: `app/products/sitemap.ts`
// (`/products/sitemap/0.xml`, `/1.xml`, …).
export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const site = brand().siteUrl
  if (!site) return []

  const out: MetadataRoute.Sitemap = []
  for (const lang of SUPPORTED_LANGUAGES) {
    out.push({ url: `${site}/${lang}`, changeFrequency: "daily", priority: 1 })
    out.push({ url: `${site}/${lang}/products`, changeFrequency: "daily", priority: 0.8 })
  }
  return out
}
