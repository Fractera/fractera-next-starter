import { dataFetch } from "@/lib/fractera/data-service"
import { REQUEST_CHANNELS, TASK_ROW_KINDS, TASK_SOURCES } from "./types"
import type { TaskObject } from "./types"

// ХРАНИЛИЩЕ ОБЪЕКТА РАЗБОРА — ОДНА СТРОКА, ОДИН ЧИТАТЕЛЬ, ОДИН ПИСАТЕЛЬ (91-2).
//
// 🔒 ТАБЛИЦА В `SCHEMA`, А НЕ ПОРОЖДЁННАЯ. В отличие от таблиц признаков, эта не
// зависит от того, что человек завёл в реестре: она есть всегда и у всех, и
// потому объявляется там же, где остальные постоянные таблицы проекта.

/** Сколько времени объект живёт, прежде чем его сочтут брошенным. */
const STALE_MS = 30 * 60 * 1000

/**
 * Время с миллисекундами.
 *
 * 🔒 СТАВИТ КОД, А НЕ БАЗА, И ЭТО ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ОНО БЕРЁТСЯ. Умолчание
 * проекта печатает секунды; прямое требование владельца — миллисекунды. Второй
 * источник времени в этом слое разошёлся бы с первым молча.
 */
export function nowMs(): string {
  return new Date().toISOString()
}

async function ask<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({ sql, params }),
    })
    if (!r.ok) return []
    const d = (await r.json()) as { rows?: T[] }
    return d.rows ?? []
  } catch {
    // 🔒 СЛОЙ ДАННЫХ МОЖЕТ НЕ ОТВЕТИТЬ, И ЭТО ЗАКОННО (ноутбук без ключа): тогда
    // разбора «нет», а не «всё сломалось». Тот же закон, что у реестра.
    return []
  }
}

/**
 * Прочитать текущий объект. `null` — разбора нет или он не читается.
 *
 * 🔒 НЕЧИТАЕМЫЙ JSON — ЭТО ОТСУТСТВИЕ ОБЪЕКТА, А НЕ ПАДЕНИЕ ЭКРАНА. Одна
 * испорченная строка не имеет права утащить за собой весь вид: человек увидит
 * честное «разбора нет» и напишет боту снова.
 */
export async function readTask(): Promise<TaskObject | null> {
  const rows = await ask<{ payload: string }>("SELECT payload FROM task_current WHERE id = 1")
  const raw = rows[0]?.payload
  if (!raw) return null
  try {
    const o = JSON.parse(raw) as TaskObject
    return isTaskObject(o) ? o : null
  } catch {
    return null
  }
}

/**
 * Форма пришедшего проверяется, а не предполагается.
 *
 * 🔒 ОБЪЕКТ ЛЕЖИТ В БАЗЕ СТРОКОЙ, И ЗА ВРЕМЯ ЖИЗНИ ПРОЕКТА ЕГО ФОРМА ИЗМЕНИТСЯ.
 * Старая запись, прочитанная новым кодом как своя, даёт `undefined` в местах,
 * где тип обещает значение, — и падает не здесь, а на экране, далеко от причины.
 */
function isTaskObject(o: unknown): o is TaskObject {
  if (!o || typeof o !== "object") return false
  const t = o as TaskObject
  if (!t.intake || typeof t.intake.at !== "string") return false
  if (!(REQUEST_CHANNELS as readonly string[]).includes(t.intake.channel)) return false
  if (!Array.isArray(t.rows) || !Array.isArray(t.decisions)) return false
  return t.rows.every(
    r =>
      (TASK_ROW_KINDS as readonly string[]).includes(r.kind) &&
      (TASK_SOURCES as readonly string[]).includes(r.source),
  )
}

/**
 * Записать объект. Заменяет прежний — второй строке появиться негде.
 *
 * 🔒 `ON CONFLICT DO UPDATE`, А НЕ «УДАЛИТЬ И ВСТАВИТЬ». Между удалением и
 * вставкой существует миг, когда разбора нет вовсе, и открытый в этот миг экран
 * покажет пустоту вместо работы. Одной операцией такого мига не бывает.
 */
export async function writeTask(task: TaskObject): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({
        sql: `INSERT INTO task_current (id, payload, updated_at) VALUES (1, ?, ?)
              ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
        params: [JSON.stringify(task), nowMs()],
      }),
    })
    if (!r.ok) return { ok: false, error: `http-${r.status}` }
    const d = (await r.json()) as { ok?: boolean; error?: string }
    return d.ok ? { ok: true } : { ok: false, error: d.error ?? "refused" }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.name : "failed" }
  }
}

/**
 * Брошен ли объект — то есть разбор начат и не кончился давно.
 *
 * 🔒 ЭТО НЕ УБОРКА, А ЧЕСТНОСТЬ ЭКРАНА. Разбор, оборванный падением процесса,
 * остаётся с `done: false` навсегда, и экран будет вечно показывать «идёт
 * работа». Признак старости отвечает на это словами, а запись не трогает:
 * удалять сырьё разбора мы не вправе — оно ещё не разъехалось по таблицам.
 */
export function isStale(task: TaskObject): boolean {
  if (task.done) return false
  return Date.now() - Date.parse(task.intake.at) > STALE_MS
}
