import { dataFetch } from "@/lib/fractera/data-service"
import { activeFacts } from "./registry"
import { factTableName, factIdentifier, needsTable } from "./table"
import { runFactFn } from "./run-fn"
import type { FactFn } from "./fn-types"

// СБОР ЗНАЧЕНИЙ ПРИЗНАКОВ С ОПИСАННЫМИ ФУНКЦИЯМИ (81-8).
//
// 🔒 ТОЛЬКО ПРИЗНАКИ С ФУНКЦИЕЙ. Признак без неё извлекается из самого сообщения
// — это работа разбора, и она уже есть. Функция нужна для того, чего в сообщении
// НЕТ: погода в момент отправки, курс на дату события, адрес по координатам.
//
// 🔒 ОТКАЗ ИСТОЧНИКА НЕ РОНЯЕТ РАЗБОР И ЗАПИСЫВАЕТСЯ. Погода не ответила —
// сообщение принято целиком, а причина легла в заметки: диагностика, которую
// видно только в момент отказа, не существует.
//
// 🔒 ЗНАЧЕНИЕ ЛОЖИТСЯ В СВОЮ ТАБЛИЦУ, И `source` НАЗЫВАЕТ ПРОИСХОЖДЕНИЕ. Пришло
// из внешнего источника — это не то же, что извлечено моделью из слов человека, и
// различать их придётся в тот день, когда два источника разойдутся.

/** Что собрано и что не вышло. */
export type CollectReport = {
  stored: string[]
  failed: { key: string; reason: string }[]
}

function parseFn(raw: unknown): FactFn | null {
  if (typeof raw !== "string" || !raw.trim()) return null
  try {
    const fn = JSON.parse(raw) as FactFn
    return fn && typeof fn === "object" && typeof fn.kind === "string" ? fn : null
  } catch {
    // 🔒 НЕЧИТАЕМОЕ ОПИСАНИЕ — НЕ ПОЛОМКА, А ОТСУТСТВИЕ ФУНКЦИИ. Признак
    // продолжает работать без неё.
    return null
  }
}

async function store(
  table: string,
  messageId: number,
  value: string,
  slot?: string,
): Promise<boolean> {
  try {
    // 🔒 КОЛОНКИ НАЗЫВАЮТСЯ ПОИМЁННО ВСЕГДА. Позиционный `INSERT` работает на
    // чистой машине и путает значения на поднятой лестницей: там порядок колонок
    // другой (83-2), и ломается это только у того, у кого система поработала.
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({
        sql: `INSERT INTO ${table} (message_id, value_text, slot, source) VALUES (?, ?, ?, 'fn')`,
        params: [messageId, value, slot ?? null],
      }),
    })
    if (!r.ok) return false
    const d = (await r.json()) as { ok?: boolean }
    return d.ok === true
  } catch {
    return false
  }
}

/**
 * Пройти признаки с функциями и сложить добытое.
 *
 * 🔒 ВЫЗОВЫ ИДУТ ПОСЛЕДОВАТЕЛЬНО, А НЕ ВЕЕРОМ. Их единицы, а параллельный веер к
 * чужим службам с одного адреса выглядит как атака и ловит ограничение частоты
 * ровно тогда, когда сообщений станет много.
 */
export async function collectFactValues(
  messageId: number,
  ctx: Record<string, string>,
): Promise<CollectReport> {
  const report: CollectReport = { stored: [], failed: [] }

  for (const fact of await activeFacts()) {
    // `fn` живёт только у добавленных признаков: встроенные порождаются из кода,
    // и описанной функции у них нет по устройству.
    const fn = parseFn(fact.fn)
    if (!fn || fn.when !== "ingest") continue
    if (!needsTable(fact)) continue

    const res = await runFactFn(fn, ctx)
    if (!res.ok) {
      report.failed.push({ key: fact.key, reason: res.reason })
      continue
    }
    const table = factTableName(fact.key)
    if (!table) {
      report.failed.push({ key: fact.key, reason: "bad-key" })
      continue
    }

    // 🔒 НЕСКОЛЬКО ЗНАЧЕНИЙ — N СТРОК, РАЗЛИЧИМЫХ ПО `slot` (83-3). Из «трёх
    // пирожков по 25» нужны ккал, белки, жиры и углеводы: четыре числа ОДНОГО
    // факта еды. Свернуть их в одну строку значило бы хранить объект в текстовом
    // поле — и складывать белки за неделю стало бы нечем.
    if ("values" in res) {
      let ok = 0
      for (const [slot, value] of Object.entries(res.values)) {
        // 🛑 СЛОТ ПРОХОДИТ БЕЛЫЙ СПИСОК ПЕРЕД ЗАПИСЬЮ. Он приезжает из описания,
        // которое человек составил через модель, и попадает в значение колонки.
        const safe = factIdentifier(slot)
        if (!safe) {
          report.failed.push({ key: `${fact.key}#${slot}`, reason: "bad-slot" })
          continue
        }
        if (await store(table, messageId, value, safe)) ok++
        else report.failed.push({ key: `${fact.key}#${safe}`, reason: "store-failed" })
      }
      if (ok) report.stored.push(`${fact.key} (${ok})`)
      continue
    }

    if (await store(table, messageId, res.value)) report.stored.push(fact.key)
    else report.failed.push({ key: fact.key, reason: "store-failed" })
  }

  return report
}
