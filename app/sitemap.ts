import type { MetadataRoute } from "next"
import { brand } from "@/lib/brand"
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config"
import { urlFor } from "@/lib/seo/alternates"

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

  // 🔒 АДРЕСА СТРОЯТСЯ ТЕМ ЖЕ `urlFor`, ЧТО И КАНОНИЧЕСКИЕ (шаг 503). Здесь стояла
  // своя склейка `${site}/${lang}${путь}` — второй источник правды об адресах, и он
  // разошёлся с первым ровно там, где это дороже всего: в одноязычном режиме прокси
  // убирает языковой сегмент, и каждая строка этой карты вела на 301. Карта сайта,
  // перечисляющая редиректы, обесценивает сама себя, а расхождение с каноническим
  // адресом поисковик читает как противоречие в сигналах.
  const out: MetadataRoute.Sitemap = []
  for (const lang of SUPPORTED_LANGUAGES) {
    out.push({ url: urlFor(lang, ""), changeFrequency: "daily", priority: 1 })
    out.push({ url: urlFor(lang, "/products"), changeFrequency: "daily", priority: 0.8 })
  }
  // В одноязычном режиме `urlFor` для каждого языка даёт один и тот же адрес — но
  // язык там ровно один, так что дубликатов не возникает. Страховка на случай
  // будущей правки: карта обязана быть множеством, а не списком.
  return out.filter((row, i) => out.findIndex(r => r.url === row.url) === i)
}
