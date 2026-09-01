import { dataFetch } from "@/lib/fractera/data-service"
import { builtinFacts } from "./builtin"
import { factTableName } from "./table"
import type { Fact, FactLevel, FactOnMissing, FactValueType } from "./types"

// РЕЕСТР ЦЕЛИКОМ — встроенные плюс добавленные человеком (81-2).
//
// 🔒 ВСТРОЕННЫЕ НЕ ХРАНЯТСЯ В БАЗЕ, И ЭТО НЕ ЭКОНОМИЯ. Они ПОРОЖДАЮТСЯ из кода
// (81-1), потому что описывают то, что система делает по устройству. Запиши их
// строками — и появится вторая правда, которая разойдётся с первой на первом же
// изменении кода, причём молча: строка в базе останется прежней, а поведение
// изменится.
//
// 🔒 ОТСЮДА ЖЕ ЗАПРЕТ ПРАВИТЬ ВСТРОЕННЫЙ ПРИЗНАК. Дверь отвечает отказом, а не
// молчанием: правка, которая никуда не доедет, хуже отсутствующей — человек
// уверен, что настроил.

/** Строка таблицы реестра, как её отдаёт слой данных. */
type Row = {
  key: string
  level: string
  title: string
  description: string
  value_type: string
  how_to_find: string
  on_missing: string
  fn: string | null
  enabled: number
}

async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({ sql, params }),
    })
    if (!r.ok) return []
    const d = (await r.json()) as { rows?: T[] }
    return d.rows ?? []
  } catch {
    return []
  }
}

async function write(sql: string, params: unknown[] = []): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({ sql, params }),
    })
    if (!r.ok) return { ok: false, error: `http-${r.status}` }
    const d = (await r.json()) as { ok?: boolean; error?: string }
    return d.ok ? { ok: true } : { ok: false, error: d.error ?? "refused" }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.name : "failed" }
  }
}

function fromRow(r: Row): Fact {
  return {
    key: r.key,
    level: r.level as FactLevel,
    title: r.title,
    description: r.description,
    valueType: r.value_type as FactValueType,
    howToFind: r.how_to_find,
    storedIn: factTableName(r.key) || "имя недопустимо: таблицы нет",
    onMissing: r.on_missing as FactOnMissing,
    // Описание внешнего вызова едет как есть: разбирает его исполнитель,
    // а читателю реестра знать его форму незачем.
    fn: r.fn ?? undefined,
    builtin: false,
    enabled: r.enabled === 1,
  }
}

/**
 * Весь реестр: сначала встроенные, затем добавленные.
 *
 * 🔒 ПОРЯДОК ЗНАЧИМ. Встроенные описывают устройство и потому идут первыми; на
 * экране человек читает сверху вниз и должен сперва увидеть, что уже умеет
 * система, а потом — что он к этому добавил.
 * 🔒 СЛОЙ ДАННЫХ МОЖЕТ НЕ ОТВЕТИТЬ, И ЭТО ЗАКОННО (ноутбук без ключа): тогда
 * реестр состоит из одних встроенных, а не рушится. Пустой ответ базы читается
 * как «добавленных нет», потому что так оно и есть чаще всего.
 */
export async function allFacts(): Promise<Fact[]> {
  const rows = await query<Row>(
    "SELECT key, level, title, description, value_type, how_to_find, on_missing, fn, enabled FROM fact_registry ORDER BY id",
  )
  return [...builtinFacts(), ...rows.map(fromRow)]
}

/** Только те, что участвуют в разборе: выключенные не участвуют. */
export async function activeFacts(): Promise<Fact[]> {
  return (await allFacts()).filter(f => f.enabled)
}

export type NewFact = {
  key: string
  level: FactLevel
  title: string
  description: string
  valueType: FactValueType
  howToFind: string
  onMissing: FactOnMissing
  /** Описание внешнего вызова, строкой JSON. Проверено дверью (81-8). */
  fn?: string
}

/**
 * Добавить признак.
 *
 * 🔒 ИМЯ ПРОВЕРЯЕТСЯ ДО ЗАПИСИ, А НЕ ПОСЛЕ. Ключ, из которого нельзя собрать имя
 * таблицы, — это признак без хранилища; записав его, мы завели бы описание,
 * которому некуда складывать значения, и человек узнал бы об этом по пустоте
 * через неделю.
 * 🔒 СТОЛКНОВЕНИЕ СО ВСТРОЕННЫМ ОТВЕРГАЕТСЯ ОТДЕЛЬНО от столкновения с
 * добавленным: причины разные, и человеку надо сказать, какая именно.
 */
export async function addFact(fact: NewFact): Promise<{ ok: boolean; error?: string }> {
  const key = fact.key.trim().toLowerCase()
  if (!factTableName(key)) return { ok: false, error: "bad-key" }
  if (builtinFacts().some(f => f.key === key)) return { ok: false, error: "builtin-exists" }

  return write(
    `INSERT INTO fact_registry (key, level, title, description, value_type, how_to_find, on_missing, fn)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [key, fact.level, fact.title, fact.description, fact.valueType, fact.howToFind, fact.onMissing, fact.fn ?? null],
  )
}

/** Правка добавленного признака. Встроенный сюда не попадает — он не в базе. */
export async function updateFact(
  key: string,
  patch: Partial<Pick<NewFact, "title" | "description" | "howToFind" | "onMissing">>,
): Promise<{ ok: boolean; error?: string }> {
  if (builtinFacts().some(f => f.key === key)) return { ok: false, error: "builtin-readonly" }
  const sets: string[] = []
  const params: unknown[] = []
  if (patch.title !== undefined) { sets.push("title = ?"); params.push(patch.title) }
  if (patch.description !== undefined) { sets.push("description = ?"); params.push(patch.description) }
  if (patch.howToFind !== undefined) { sets.push("how_to_find = ?"); params.push(patch.howToFind) }
  if (patch.onMissing !== undefined) { sets.push("on_missing = ?"); params.push(patch.onMissing) }
  if (!sets.length) return { ok: false, error: "empty-patch" }
  params.push(key)
  return write(`UPDATE fact_registry SET ${sets.join(", ")} WHERE key = ?`, params)
}

/**
 * Выключить признак.
 *
 * 🔒 ВЫКЛЮЧАЕМ, А НЕ УДАЛЯЕМ, И ТАБЛИЦУ НЕ ТРОГАЕМ. За признаком стоят
 * накопленные значения; удалить описание значит оставить их без имени. Выключенный
 * признак не участвует в разборе — этого достаточно.
 */
export async function disableFact(key: string): Promise<{ ok: boolean; error?: string }> {
  if (builtinFacts().some(f => f.key === key)) return { ok: false, error: "builtin-readonly" }
  return write("UPDATE fact_registry SET enabled = 0 WHERE key = ?", [key])
}
