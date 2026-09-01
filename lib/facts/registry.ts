import { dataFetch } from "@/lib/fractera/data-service"
import { builtinFacts } from "./builtin"
import { factTableName } from "./table"
import {
  FACT_AGGREGATE,
  FACT_MODEL,
  FACT_SCHEDULES,
  FACT_SUBJECT,
} from "./types"
import type {
  Fact,
  FactAggregate,
  FactLevel,
  FactLifecycle,
  FactModel,
  FactOnMissing,
  FactProduces,
  FactSchedules,
  FactSubject,
  FactValueType,
} from "./types"

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
  // Второй слой (83-1). Слой данных может отдать `undefined`, если лестница
  // колонок ещё не прошла, — читаем это как «настройка не задана», а не как сбой.
  produces: string | null
  derived_from: string | null
  derived_slot: string | null
  aggregate: string | null
  unit: string | null
  subject: string | null
  lifecycle: string | null
  schedules: string | null
  model: string | null
}

/**
 * Разобрать колонку-JSON второго слоя.
 *
 * 🔒 НЕЧИТАЕМОЕ ЗНАЧЕНИЕ — ЭТО ОТСУТСТВИЕ НАСТРОЙКИ, А НЕ ПАДЕНИЕ РЕЕСТРА. Тот
 * же закон, по которому живёт нечитаемое описание функции в `collect.ts`: одна
 * испорченная строка не имеет права утащить за собой весь экран признаков.
 */
function parseJson<T>(raw: string | null): T | undefined {
  if (!raw) return undefined
  try {
    const v = JSON.parse(raw) as T
    return v ?? undefined
  } catch {
    return undefined
  }
}

/** Значение из закрытого списка — или ничего. Чужое в реестре не живёт. */
function fromList<T extends string>(raw: string | null, list: readonly T[]): T | undefined {
  return raw && (list as readonly string[]).includes(raw) ? (raw as T) : undefined
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
    // ── Второй слой (83-1)
    produces: parseJson<FactProduces[]>(r.produces),
    derivedFrom: r.derived_from ?? undefined,
    derivedSlot: r.derived_slot ?? undefined,
    aggregate: fromList(r.aggregate, FACT_AGGREGATE),
    unit: r.unit ?? undefined,
    subject: fromList(r.subject, FACT_SUBJECT),
    lifecycle: parseJson<FactLifecycle>(r.lifecycle),
    schedules: fromList(r.schedules, FACT_SCHEDULES),
    model: fromList(r.model, FACT_MODEL),
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
    `SELECT key, level, title, description, value_type, how_to_find, on_missing, fn, enabled,
            produces, derived_from, derived_slot, aggregate, unit, subject, lifecycle, schedules, model
       FROM fact_registry ORDER BY id`,
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
  // ── Второй слой (83-1). Дверь проверила их до нас: сюда приходит уже годное.
  produces?: FactProduces[]
  derivedFrom?: string
  derivedSlot?: string
  aggregate?: FactAggregate
  unit?: string
  subject?: FactSubject
  lifecycle?: FactLifecycle
  schedules?: FactSchedules
  model?: FactModel
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
    `INSERT INTO fact_registry
       (key, level, title, description, value_type, how_to_find, on_missing, fn,
        produces, derived_from, derived_slot, aggregate, unit, subject, lifecycle, schedules, model)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      key, fact.level, fact.title, fact.description, fact.valueType, fact.howToFind, fact.onMissing,
      fact.fn ?? null,
      // 🔒 УМОЛЧАНИЯ ПИШУТСЯ ЯВНО, А НЕ ОСТАВЛЯЮТСЯ БАЗЕ. Умолчание колонки
      // действует только на строку, где колонку не назвали; назвав её со
      // значением `null`, мы бы получили NOT NULL-отказ на ровном месте.
      fact.produces?.length ? JSON.stringify(fact.produces) : null,
      fact.derivedFrom ?? null,
      fact.derivedSlot ?? null,
      fact.aggregate ?? "none",
      fact.unit ?? null,
      fact.subject ?? "none",
      fact.lifecycle ? JSON.stringify(fact.lifecycle) : null,
      fact.schedules ?? "none",
      fact.model ?? "cheap",
    ],
  )
}

/** Правка добавленного признака. Встроенный сюда не попадает — он не в базе. */
export async function updateFact(
  key: string,
  patch: Partial<
    Pick<
      NewFact,
      | "title" | "description" | "howToFind" | "onMissing"
      | "produces" | "derivedFrom" | "derivedSlot" | "aggregate"
      | "unit" | "subject" | "lifecycle" | "schedules" | "model"
    >
  >,
): Promise<{ ok: boolean; error?: string }> {
  if (builtinFacts().some(f => f.key === key)) return { ok: false, error: "builtin-readonly" }
  const sets: string[] = []
  const params: unknown[] = []
  if (patch.title !== undefined) { sets.push("title = ?"); params.push(patch.title) }
  if (patch.description !== undefined) { sets.push("description = ?"); params.push(patch.description) }
  if (patch.howToFind !== undefined) { sets.push("how_to_find = ?"); params.push(patch.howToFind) }
  if (patch.onMissing !== undefined) { sets.push("on_missing = ?"); params.push(patch.onMissing) }
  // ── Второй слой (83-1)
  //
  // 🔒 ЗАПЛАТА, А НЕ СНИМОК: не названная настройка остаётся какой была. Тот же
  // закон, по которому живут конфиги проекта, и та же причина — в реестр пишет
  // не один экран, и снимок затирал бы соседнее при каждой галочке.
  if (patch.produces !== undefined) {
    sets.push("produces = ?"); params.push(patch.produces.length ? JSON.stringify(patch.produces) : null)
  }
  if (patch.derivedFrom !== undefined) { sets.push("derived_from = ?"); params.push(patch.derivedFrom || null) }
  if (patch.derivedSlot !== undefined) { sets.push("derived_slot = ?"); params.push(patch.derivedSlot || null) }
  if (patch.aggregate !== undefined) { sets.push("aggregate = ?"); params.push(patch.aggregate) }
  if (patch.unit !== undefined) { sets.push("unit = ?"); params.push(patch.unit || null) }
  if (patch.subject !== undefined) { sets.push("subject = ?"); params.push(patch.subject) }
  if (patch.lifecycle !== undefined) {
    sets.push("lifecycle = ?"); params.push(patch.lifecycle ? JSON.stringify(patch.lifecycle) : null)
  }
  if (patch.schedules !== undefined) { sets.push("schedules = ?"); params.push(patch.schedules) }
  if (patch.model !== undefined) { sets.push("model = ?"); params.push(patch.model) }
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
