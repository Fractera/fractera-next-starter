// 🔒 КЛЮЧ БЕРЁТСЯ У ОБЩЕГО РЕШАТЕЛЯ, А НЕ ИЗ `process.env` НАПРЯМУЮ
// (найдено проверкой живого сервера 2026-08-17).
//
// Здесь стояло `process.env.DATA_API_KEY!`. Такой переменной в окружении сервера
// НЕТ — установщик пишет `DATA_SECRET`, — поэтому ключ выходил пустым, условие
// выбора хранилища в `index.ts` не срабатывало, и приложение молча писало в
// локальный SQLite мимо слоя данных. Не только шаги: товары, настройки сайта,
// всё. «Единственная дверь» существовала и не использовалась.
//
// Ровно эта правка уже сделана в трёх маршрутах медиа, в `lib/media/by-name.ts`
// и в `scripts/seed-media.mjs` (разбор — в шапке `app/api/media/upload/route.ts`,
// 2026-08-13). До базы она не доехала: два файла из шести остались с прежним
// именем, и увидеть это по коду было нельзя — оба варианта выглядят исправными.
//
// Второй переменной здесь не заводится. Два имени одного секрета и есть причина
// этой ошибки; лечится она возвратом к одному имени, а не третьим.
import { dataService } from '@/lib/fractera/data-service'

async function migrate(sql: string, params: unknown[] = []) {
  const { url, key } = dataService()
  const res = await fetch(`${url}/db/migrate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Data-Secret': key,
    },
    body: JSON.stringify({ sql, params }),
  })
  if (!res.ok) throw new Error(`Data service ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{ ok: boolean; rows?: unknown[]; changes?: number }>
}

export const remoteDb = {
  prepare(sql: string) {
    return {
      async all(...args: unknown[]) {
        const data = await migrate(sql, args)
        return (data.rows ?? []) as Record<string, unknown>[]
      },
      async get(...args: unknown[]) {
        const data = await migrate(sql, args)
        return ((data.rows ?? [])[0] ?? null) as Record<string, unknown> | null
      },
      async run(...args: unknown[]) {
        return migrate(sql, args)
      },
    }
  },
  async exec(sql: string) {
    await migrate(sql)
  },
}
