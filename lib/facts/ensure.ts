import { dataFetch } from "@/lib/fractera/data-service"
import { factTableName, factTableSql, needsTable, FACT_TABLE_COLUMNS } from "./table"
import type { Fact } from "./types"

// ТАБЛИЦЫ ПРИЗНАКОВ ПОРОЖДАЮТСЯ ИЗ РЕЕСТРА (81-2).
//
// 🔒 ПОЧЕМУ ИХ НЕТ В СХЕМЕ ПРОЕКТА. Схема исполняется при старте и перечисляет
// то, что известно заранее. Признак заводит ЧЕЛОВЕК в работающей системе — его
// таблицы в схеме быть не может, потому что в момент сборки её никто не
// придумал. Значит порождать: реестр говорит, что должно существовать, и
// недостающее досоздаётся.
//
// 🔒 И ЭТО ЖЕ ОТВЕЧАЕТ НА ВОПРОС «А ЧТО НА НОВОМ СЕРВЕРЕ». Созданная в рантайме
// таблица в схему не попадает, а записи реестра приедут вместе с базой. Без
// порождения новый сервер получил бы описания признаков и ни одной таблицы под
// них — состояние, которое выглядит как поломка и ею не является.
//
// ✗ ЭТОТ ПУТЬ ИЗМЕРЕН, А НЕ ПРЕДПОЛОЖЕН (2026-09-01): слой данных выполняет DDL
// через `POST /db/migrate` — таблица создана, строка записана, прочитана,
// таблица убрана, и всё это без единой пересборки. Прежнее утверждение агента
// «своя таблица на признак означает деплой» было НЕВЕРНЫМ.

/** Что сделал вызов: чего не хватало и что удалось создать. */
export type EnsureReport = {
  checked: number
  created: string[]
  /** Ключи, которым таблицу создать нельзя: имя не прошло белый список. */
  rejected: string[]
  failed: { table: string; error: string }[]
}

async function migrate(sql: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await dataFetch("/db/migrate", { method: "POST", body: JSON.stringify({ sql }) })
    if (!r.ok) return { ok: false, error: `http-${r.status}` }
    const d = (await r.json()) as { ok?: boolean; error?: string }
    return d.ok ? { ok: true } : { ok: false, error: d.error ?? "refused" }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.name : "failed" }
  }
}

/** Какие таблицы признаков уже есть на этой машине. */
export async function existingFactTables(): Promise<Set<string>> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({
        sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'fact\\_%' ESCAPE '\\'",
      }),
    })
    if (!r.ok) return new Set()
    const d = (await r.json()) as { rows?: { name: string }[] }
    return new Set((d.rows ?? []).map(x => x.name))
  } catch {
    return new Set()
  }
}

/**
 * Досоздать таблицы признаков по реестру.
 *
 * 🔒 ОТКАЗ ПО ИМЕНИ — НЕ ОШИБКА ВЫЗОВА, А ЗАКОННЫЙ ИСХОД. Ключ, не прошедший
 * белый список, попадает в `rejected` и не доходит до SQL вовсе. Молча пропустить
 * его значило бы завести признак, у которого никогда не будет хранилища, — и
 * узнал бы об этом человек по пустоте через неделю.
 */
export async function ensureFactTables(facts: Fact[]): Promise<EnsureReport> {
  const report: EnsureReport = { checked: 0, created: [], rejected: [], failed: [] }
  const have = await existingFactTables()

  for (const fact of facts) {
    if (!needsTable(fact)) continue
    report.checked++
    const table = factTableName(fact.key)
    if (!table) {
      report.rejected.push(fact.key)
      continue
    }
    if (have.has(table)) continue
    const res = await migrate(factTableSql(table))
    if (res.ok) report.created.push(table)
    else report.failed.push({ table, error: res.error ?? "failed" })
  }
  return report
}

/**
 * Проверить, что таблица построена ПО ОБРАЗЦУ.
 *
 * 🔒 СТАНДАРТ, КОТОРЫЙ НЕЧЕМ ПРОВЕРИТЬ, ЖИВЁТ ДО ПЕРВОГО ОТКЛОНЕНИЯ. Таблица,
 * созданная руками или прежней версией кода, выглядит рабочей и молча ведёт себя
 * иначе; сверка колонок ловит это одним запросом.
 */
export async function factTableMatchesStandard(table: string): Promise<boolean> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({ sql: `PRAGMA table_info(${table})` }),
    })
    if (!r.ok) return false
    const d = (await r.json()) as { rows?: { name: string }[] }
    const cols = (d.rows ?? []).map(x => x.name)
    return (
      cols.length === FACT_TABLE_COLUMNS.length &&
      FACT_TABLE_COLUMNS.every(c => cols.includes(c))
    )
  } catch {
    return false
  }
}
