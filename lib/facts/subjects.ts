import { dataFetch } from "@/lib/fractera/data-service"
import { factIdentifier } from "./table"

// ХОЗЯИН ФАКТА (83-5).
//
// 🔒 СЦЕНАРИЙ ВЛАДЕЛЬЦА: «Мише дали задание сделать то-то… Миша молодец, Петя не
// молодец». Факт принадлежит не сообщению, а человеку, и без хозяина вопрос «как
// дела у Миши» не формулируется вовсе.
//
// 🔒 МИША ТОЛЬКО УПОМИНАЕТСЯ — ЭТО РЕШЕНИЕ ВЛАДЕЛЬЦА 2026-09-01, ДОСЛОВНО. Он не
// пишет боту; автор сообщений один. Значит хозяина у СООБЩЕНИЯ мы не заводим и
// таблицы по людям не делим — субъект есть свойство ЗНАЧЕНИЯ, и только его.
// Обратное прочтение переложило бы скелет продукта.

/** Нормализованный ключ человека: `self` либо машинное имя. */
export const SELF = "self"

/**
 * Таблица людей.
 *
 * 🔒 БЕЗ ПРОДУКТОВОГО ПРЕФИКСА, КАК И РЕЕСТР: люди понадобятся любому продукту,
 * а `tgdesk_` заперло бы их внутри бота.
 */
export const SUBJECTS_TABLE = "fact_subjects"

export type Subject = {
  key: string
  /** Как его зовут — то, что видит человек. */
  title: string
  /** Подтверждён владельцем или пока только предложен опознанием. */
  confirmed: boolean
}

async function ask<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const r = await dataFetch("/db/migrate", { method: "POST", body: JSON.stringify({ sql, params }) })
    if (!r.ok) return []
    const d = (await r.json()) as { rows?: T[] }
    return d.rows ?? []
  } catch {
    return []
  }
}

async function run(sql: string, params: unknown[] = []): Promise<boolean> {
  try {
    const r = await dataFetch("/db/migrate", { method: "POST", body: JSON.stringify({ sql, params }) })
    if (!r.ok) return false
    return ((await r.json()) as { ok?: boolean }).ok === true
  } catch {
    return false
  }
}

/**
 * Свести имя к ключу.
 *
 * 🛑 ЗДЕСЬ НЕТ И НЕ БУДЕТ УМНОГО СВЕДЕНИЯ «МИША → МИХАИЛ». Слияние двух людей в
 * одного НЕОБРАТИМО портит данные, а разделение одного на троих делает вопрос
 * «как дела у Миши» бессмысленным. Правило простое и проверяемое: буквы латиницы
 * в нижнем регистре; всё прочее — новый человек, предложенный владельцу.
 *
 * 🔒 КИРИЛЛИЦА ПЕРЕВОДИТСЯ В ЛАТИНИЦУ ТАБЛИЦЕЙ, А НЕ УГАДЫВАЕТСЯ. Ключ попадает
 * в значение колонки и в условие запроса; белый список `factIdentifier` кириллицу
 * не пропускает, и без перевода ни один русский имени не получил бы ключа вовсе.
 */
const RU_TO_LAT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
}

export function subjectKeyOf(name: string): string {
  const lowered = name.trim().toLowerCase()
  if (!lowered) return ""
  const latin = [...lowered].map(c => RU_TO_LAT[c] ?? c).join("")
  return factIdentifier(latin.replace(/[^a-z0-9]/g, ""))
}

/**
 * Найти человека или предложить нового.
 *
 * 🔒 ОПОЗНАНИЕ ПРЕДЛАГАЕТ, А НЕ РЕШАЕТ — тот же закон, что у кандидатов в реестр
 * (81-7). Незнакомое имя заводится с `confirmed = false`, и это видно: система,
 * один раз слившая двух людей тихо, отравляет доверие ко всем своим числам.
 */
export async function resolveSubject(
  name: string,
): Promise<{ key: string; created: boolean; similar: Subject[] } | null> {
  const key = subjectKeyOf(name)
  if (!key) return null

  const have = await ask<{ key: string }>(`SELECT key FROM ${SUBJECTS_TABLE} WHERE key = ?`, [key])
  if (have.length) return { key, created: false, similar: [] }

  // 🔒 ПОХОЖИЕ ИЩУТСЯ ДО ЗАПИСИ, А НЕ ПОСЛЕ. После записи новый человек попал бы
  // в собственный список похожих, и разбирать это пришлось бы вычитанием.
  const similar = await similarSubjects(key)

  const ok = await run(
    `INSERT INTO ${SUBJECTS_TABLE} (key, title, confirmed) VALUES (?, ?, 0)`,
    [key, name.trim()],
  )
  return ok ? { key, created: true, similar } : null
}

/** Все известные люди. Неподтверждённые идут наравне и помечены. */
export async function allSubjects(): Promise<Subject[]> {
  const rows = await ask<{ key: string; title: string; confirmed: number }>(
    `SELECT key, title, confirmed FROM ${SUBJECTS_TABLE} ORDER BY title`,
  )
  return rows.map(r => ({ key: r.key, title: r.title, confirmed: r.confirmed === 1 }))
}

/**
 * КТО ИЗ ЗАВЕДЁННЫХ ПОХОЖ НА ЭТОГО — ВОПРОС ЧЕЛОВЕКУ, А НЕ РЕШЕНИЕ КОДА (83-5).
 *
 * ✗ **ИЗМЕРЕНО 2026-09-02, И ЭТО НАСТОЯЩИЙ ДЕФЕКТ, А НЕ ТЕОРИЯ:** «Мише дали
 * задание» и «Миша молодец» — фраза владельца из его же сценария — дают ключи
 * `mishe` и `misha`. Русские падежи разводят одного человека на двоих, и половина
 * его заданий уезжает к двойнику.
 *
 * 🛑 ПОЧЕМУ НЕ ЧИНИТСЯ «УМНЫМ СВЕДЕНИЕМ». Правило «Миша = Михаил = Мишка» пишется
 * легко и ошибается необратимо: слитые данные не разделить обратно. Здесь
 * предлагается СХОДСТВО, а решает владелец — тот же закон, по которому опознание
 * заводит кандидата, а не готового человека.
 *
 * **Как считается сходство:** общее начало ключа. Приём грубый намеренно — он
 * ловит падежи (`mish|e` · `mish|a`) и не претендует на большее; всё, что тоньше,
 * есть попытка угадать за человека.
 */
const SIMILAR_PREFIX = 4

export async function similarSubjects(key: string): Promise<Subject[]> {
  if (key.length < SIMILAR_PREFIX || key === SELF) return []
  const head = key.slice(0, SIMILAR_PREFIX)
  const rows = await ask<{ key: string; title: string; confirmed: number }>(
    `SELECT key, title, confirmed FROM ${SUBJECTS_TABLE} WHERE key <> ? AND substr(key, 1, ?) = ?`,
    [key, SIMILAR_PREFIX, head],
  )
  return rows.map(r => ({ key: r.key, title: r.title, confirmed: r.confirmed === 1 }))
}
