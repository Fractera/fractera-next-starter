import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { brand } from "@/lib/brand"
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config"
import { productSitemapIds, sitemapChunkSize } from "@/lib/catalogue"
import { urlFor } from "@/lib/seo/alternates"

// КАРТА ТОВАРОВ — отдельная от главной и РАЗБИТАЯ НА ПОРЦИИ.
//
// Почему она вообще нужна. Витрина отдаёт первую партию товаров в разметке, а
// остальные подгружаются кнопкой и в HTML не попадают — перейти на них
// поисковику неоткуда. Карта сайта единственный канал, по которому он узнаёт о
// них, и строится она из базы, поэтому товар, созданный после сборки, попадает
// сюда сам.
//
// 🔒 ПОЧЕМУ ПОРЦИИ, А НЕ ОДИН ФАЙЛ. Предел одного файла — 50 000 адресов
// (документация Next говорит дословно: «Google's limit is 50,000 URLs per
// sitemap»), и Next НЕ разбивает файл сам. Адресов у нас товары × языки: на
// 10 000 товарах и двух языках это 20 000, на десяти языках — 100 000.
// Превышение не «часть товаров выпадет», а отказ от файла ЦЕЛИКОМ.
//
// Файлы доступны как `/products/sitemap/0.xml`, `/products/sitemap/1.xml`, …
// и перечислены в `robots.txt` — счёт им ведёт `lib/catalogue.ts`, один на обоих.
//
// Главная карта (`app/sitemap.ts`) остаётся за страницами и постами: там
// множество конечное и авторское.

export const revalidate = 3600

export async function generateSitemaps() {
  return (await productSitemapIds(SUPPORTED_LANGUAGES.length)).map(id => ({ id }))
}

// В Next 16 `id` приходит ПРОМИСОМ (изменение версии 16.0.0) — не строкой, как
// было раньше. Забыть `await` значит подставить в SQL «[object Promise]».
export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const site = brand().siteUrl
  if (!site) return []

  const index = Number(await id) || 0
  const size = sitemapChunkSize(SUPPORTED_LANGUAGES.length)

  const rows = (await db.prepare(
    "SELECT id, created_at FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).all(size, index * size)) as unknown as { id: string; created_at: string }[]

  // Адрес — тем же `urlFor`, что и канонический адрес самой карточки (шаг 503):
  // в одноязычном режиме языкового сегмента нет, и склеенный вручную путь вёл бы
  // на 301 для каждого товара разом.
  const out: MetadataRoute.Sitemap = []
  for (const r of rows) {
    for (const lang of SUPPORTED_LANGUAGES) {
      out.push({
        url: urlFor(lang, `/products/${r.id}`),
        lastModified: r.created_at ? new Date(`${r.created_at}Z`) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    }
  }
  return out
}
