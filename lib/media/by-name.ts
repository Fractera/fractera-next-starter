// Поиск картинки в хранилище ПО ИМЕНИ (шаг 506.3, требование владельца 2026-08-13).
//
// 🔒 ЗАЧЕМ ИМЯ, А НЕ ИДЕНТИФИКАТОР. Идентификатор записи рождается в момент
// загрузки и на каждом сервере СВОЙ. Материал же лежит в репозитории и одинаков
// у всех, поэтому вписать в него идентификатор нельзя: на втором сервере он
// указывал бы в пустоту. Имя файла мы задаём сами и держим постоянным — это и
// есть единственный устойчивый способ сослаться из содержимого на хранилище.
//
// Отсюда правило для автора материала: `src: "media:<имя-файла>"`. Всё, что не
// начинается с `media:`, считается обычным путём и работает как раньше.
//
// ЗАПРОС КЭШИРУЕТСЯ. Страница со статьёй заранее собрана; поход в слой данных на
// каждый показ превратил бы её в вычисляемую. Список хранилища меняется редко —
// час жизни кэша здесь честнее, чем запрос на каждого читателя.

import { unstable_cache } from "next/cache"

const DATA_URL = process.env.REMOTE_DATA_URL ?? "http://localhost:3300"
const DATA_SECRET = process.env.DATA_SECRET || process.env.DATA_API_KEY || ""

export type MediaRow = {
  id: string
  name: string
  width?: number | null
  height?: number | null
  blur?: string | null
}

/** Префикс ссылки на хранилище в данных материала. */
export const MEDIA_PREFIX = "media:"

export function isMediaRef(src: string): boolean {
  return src.startsWith(MEDIA_PREFIX)
}

export function mediaRefName(src: string): string {
  return src.slice(MEDIA_PREFIX.length)
}

const loadIndex = unstable_cache(
  async (): Promise<Record<string, MediaRow>> => {
    try {
      const res = await fetch(`${DATA_URL}/media`, {
        headers: DATA_SECRET ? { "X-Data-Secret": DATA_SECRET } : {},
        cache: "no-store",
      })
      if (!res.ok) return {}
      const data = await res.json()
      const items: MediaRow[] = Array.isArray(data.items) ? data.items : []
      const index: Record<string, MediaRow> = {}
      for (const item of items) if (item?.name) index[item.name] = item
      return index
    } catch {
      // Хранилище недоступно — материал обязан открыться без картинки, а не
      // упасть целиком. Пустой указатель ведёт к честному запасному варианту.
      return {}
    }
  },
  ["media-by-name"],
  { revalidate: 3600, tags: ["media-index"] },
)

/** Запись хранилища по имени файла, либо `null`, если её там нет. */
export async function mediaByName(name: string): Promise<MediaRow | null> {
  const index = await loadIndex()
  return index[name] ?? null
}

/** Адрес файла записи — свой origin, поэтому оптимизатор считает его местным. */
export function mediaFileUrl(row: MediaRow): string {
  return `/api/media/${row.id}/file`
}
