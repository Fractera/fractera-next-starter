import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"
import type { Product } from "@/app/[lang]/(protectedLayer)/(staff)/manage/products/_components/types"

// Чтение каталога для ПУБЛИЧНЫХ страниц.
//
// 🔒 `unstable_cache`, А НЕ ПРОСТО ЗАПРОС. Документация Next 16 предписывает
// именно его для данных, которые приходят НЕ через `fetch`: у нас SQLite
// напрямую, и без обёртки Next не знает, что результат можно кешировать, —
// страница осталась бы динамической, сколько ни ставь `revalidate`.
//
// 🔒 ТЕГ — ЧТОБЫ СБРАСЫВАТЬ ТОЧЕЧНО. Создали или изменили товар — зовём
// `revalidateTag(CATALOGUE_TAG)`, и публичные страницы пересобираются со
// свежими данными, не дожидаясь истечения срока. Без тега новый товар ждал бы
// час — ровно та беда, из-за которой каталоги и уезжают в динамику.

export const CATALOGUE_TAG = "catalogue"

/** Сколько товаров уезжает в СТАТИЧЕСКИЙ HTML первой страницы. */
export const FIRST_BATCH = 24

/** Сколько добавляет каждое нажатие «показать ещё». */
export const NEXT_BATCH = 24

export type CatalogueRow = Pick<Product, "id" | "name" | "description" | "i18n" | "price" | "media_url">

const COLUMNS = "id, name, description, i18n, price, media_url"

/** Первая партия — то, что видит поисковик и человек с выключенным JS. */
export const firstProducts = unstable_cache(
  async (limit: number = FIRST_BATCH) =>
    (await db.prepare(
      `SELECT ${COLUMNS} FROM products ORDER BY created_at DESC LIMIT ?`
    ).all(limit)) as unknown as CatalogueRow[],
  ["catalogue-first"],
  { revalidate: 3600, tags: [CATALOGUE_TAG] },
)

/** Всего товаров — нужно, чтобы знать, есть ли что подгружать. */
export const productsTotal = unstable_cache(
  async () => Number(((await db.prepare("SELECT COUNT(*) AS n FROM products").get()) as { n?: number } | null)?.n ?? 0),
  ["catalogue-total"],
  { revalidate: 3600, tags: [CATALOGUE_TAG] },
)

/** Один товар для его страницы. */
export const productById = unstable_cache(
  async (id: string) =>
    (await db.prepare(`SELECT ${COLUMNS}, created_at FROM products WHERE id = ?`).get(id)) as unknown as Product | null,
  ["catalogue-product"],
  { revalidate: 3600, tags: [CATALOGUE_TAG] },
)

/**
 * Слаги для `generateStaticParams`.
 *
 * НЕ «все товары»: срез свежих. Время сборки перестаёт зависеть от размера
 * каталога, а товар вне среза рождается при первом обращении и дальше живёт
 * статикой (ISR). Товара, которого нет в базе, страница не выдумает — вернёт
 * 404, и это по документации Next: «if the post does not exist, then 404 is
 * returned».
 */
export const prerenderSlugs = unstable_cache(
  async (limit = 200) =>
    ((await db.prepare("SELECT id FROM products ORDER BY created_at DESC LIMIT ?").all(limit)) as unknown as { id: string }[])
      .map(r => r.id),
  ["catalogue-slugs"],
  { revalidate: 3600, tags: [CATALOGUE_TAG] },
)
