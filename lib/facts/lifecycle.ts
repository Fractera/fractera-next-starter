import { dataFetch } from "@/lib/fractera/data-service"
import { factTableName, factIdentifier } from "./table"
import type { Fact, FactLifecycle } from "./types"

// ЖИЗНЕННЫЙ ЦИКЛ ПРИЗНАКА-СУЩНОСТИ (83-6).
//
// 🔒 ИСТОРИЯ, А НЕ ПЕРЕЗАПИСЬ, И ПРИЧИНА НЕ В АККУРАТНОСТИ. Сценарий владельца —
// «проверить работу по таймеру зафиксировать результат»: вопрос «когда задание
// стало проверенным» без истории не имеет ответа вовсе. Перезапись статуса
// стирает единственный факт, ради которого сущность заведена.
//
// 🔒 ЭТО ВТОРОЕ ИСКЛЮЧЕНИЕ ПО ПРИРОДЕ, И ОНО НАЗЫВАЕТСЯ ВСЛУХ. Первым была связь
// сообщений — отношение между двумя, а не факт об одном (81-2). Здесь — факт, у
// которого есть время жизни. **Единый стандарт хранения при этом не нарушается:**
// форма таблицы та же, добавляется колонка, а не особая таблица под задачи.

/** Переход состоялся или отклонён — и почему. */
export type Transition =
  | { ok: true; from: string | null; to: string }
  | { ok: false; reason: "no-lifecycle" | "unknown-status" | "no-subject" | "store-failed" }

async function ask<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const r = await dataFetch("/db/migrate", { method: "POST", body: JSON.stringify({ sql, params }) })
    if (!r.ok) return []
    return ((await r.json()) as { rows?: T[] }).rows ?? []
  } catch {
    return []
  }
}

/**
 * Текущее состояние — ПОСЛЕДНЯЯ ПО ВРЕМЕНИ СТРОКА, а не отдельное поле.
 *
 * 🔒 ОТДЕЛЬНОЕ ПОЛЕ «ТЕКУЩИЙ СТАТУС» БЫЛО БЫ ВТОРОЙ ПРАВДОЙ. Оно разошлось бы с
 * историей на первом же сбое записи, и разошлось бы молча: обе величины выглядят
 * исправными по отдельности.
 *
 * 🔒 СОРТИРУЕМ ПО `id`, А НЕ ПО `created_at`. Умолчание времени в базе печатает
 * СЕКУНДЫ (измерено 91-2), и два перехода внутри одной секунды дали бы одинаковую
 * метку — порядок между ними стал бы случайным. `id` монотонен по устройству.
 */
export async function currentStatus(
  fact: Fact,
  subjectKey: string | null,
): Promise<string | null> {
  const table = factTableName(fact.key)
  if (!table || !fact.lifecycle) return null

  const rows = await ask<{ status: string | null }>(
    `SELECT status FROM ${table}
      WHERE status IS NOT NULL AND (subject_key IS ? OR subject_key = ?)
      ORDER BY id DESC LIMIT 1`,
    [subjectKey, subjectKey],
  )
  return rows[0]?.status ?? null
}

/** Допустим ли статус по объявлению признака. */
export function statusAllowed(lifecycle: FactLifecycle, status: string): boolean {
  const s = factIdentifier(status)
  return Boolean(s) && lifecycle.statuses.includes(s)
}

/**
 * Перевести сущность в новое состояние.
 *
 * 🔒 ПЕРЕХОД ПИШЕТСЯ НОВОЙ СТРОКОЙ. Не `UPDATE`: обновление стёрло бы предыдущее
 * состояние вместе с его временем, а это и есть то, ради чего цикл объявляют.
 *
 * 🛑 СТАТУС ВНЕ ОБЪЯВЛЕННОГО СПИСКА ОТКЛОНЯЕТСЯ ДО ЗАПИСИ. Он приезжает из
 * разбора сообщения, то есть от модели, и «проверенно» вместо «проверено» она
 * вернёт правдоподобно. Записанный, он стал бы состоянием, из которого нет
 * перехода никуда.
 */
export async function moveTo(
  fact: Fact,
  subjectKey: string | null,
  status: string,
  messageId: number,
): Promise<Transition> {
  if (!fact.lifecycle) return { ok: false, reason: "no-lifecycle" }

  const to = factIdentifier(status)
  if (!to || !fact.lifecycle.statuses.includes(to)) return { ok: false, reason: "unknown-status" }

  const table = factTableName(fact.key)
  if (!table) return { ok: false, reason: "store-failed" }

  const from = await currentStatus(fact, subjectKey)

  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({
        sql: `INSERT INTO ${table} (message_id, value_text, subject_key, status, source)
              VALUES (?, ?, ?, ?, 'model')`,
        params: [messageId, fact.title, subjectKey, to],
      }),
    })
    if (!r.ok) return { ok: false, reason: "store-failed" }
    const ok = ((await r.json()) as { ok?: boolean }).ok === true
    return ok ? { ok: true, from, to } : { ok: false, reason: "store-failed" }
  } catch {
    return { ok: false, reason: "store-failed" }
  }
}

/**
 * Вся история состояний — по возрастанию.
 *
 * 🔒 ИМЕННО ЭТО И ЕСТЬ ОТВЕТ НА ВОПРОС «КОГДА ЗАДАНИЕ СТАЛО ПРОВЕРЕННЫМ», ради
 * которого цикл объявлен. Без неё сущность со статусом ничем не лучше поля.
 */
export async function statusHistory(
  fact: Fact,
  subjectKey: string | null,
): Promise<{ status: string; at: string; messageId: number }[]> {
  const table = factTableName(fact.key)
  if (!table || !fact.lifecycle) return []

  const rows = await ask<{ status: string; created_at: string; message_id: number }>(
    `SELECT status, created_at, message_id FROM ${table}
      WHERE status IS NOT NULL AND (subject_key IS ? OR subject_key = ?)
      ORDER BY id ASC`,
    [subjectKey, subjectKey],
  )
  return rows.map(r => ({ status: r.status, at: r.created_at, messageId: r.message_id }))
}
