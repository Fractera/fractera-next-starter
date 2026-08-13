import type { MetadataRoute } from "next"
import { brand } from "@/lib/brand"
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config"
import { urlFor } from "@/lib/seo/alternates"
import { POSTS } from "./[lang]/blog/_list.generated"

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
    // 🔒 БЛОГ И ЕГО ПОСТЫ — ЗДЕСЬ, А НЕ В КАРТЕ ТОВАРОВ (найдено 2026-08-13).
    //
    // Карта перечисляла главную и товары, а блога не знала вовсе: раздел
    // отдавал 200, посты были написаны и переведены — и ни один поисковик не
    // узнавал о них из карты. Это ровно то множество, ради которого карта и
    // существует: конечное, авторское, известное на сборке. Товары вынесены
    // отдельно из-за роста в рантайме, посты — нет, их пишет человек.
    //
    // Список берётся из `_list.generated.ts` — того же файла, что питает саму
    // страницу блога. Второго источника правды о постах нет: новый пост
    // попадает в карту фактом своего появления, без правки этого файла.
    out.push({ url: urlFor(lang, "/blog"), changeFrequency: "daily", priority: 0.8 })
    for (const post of POSTS) {
      out.push({
        url: urlFor(lang, `/blog/${post.meta.slug}`),
        lastModified: post.meta.date,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }
  }
  // В одноязычном режиме `urlFor` для каждого языка даёт один и тот же адрес — но
  // язык там ровно один, так что дубликатов не возникает. Страховка на случай
  // будущей правки: карта обязана быть множеством, а не списком.
  return out.filter((row, i) => out.findIndex(r => r.url === row.url) === i)
}
