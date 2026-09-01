import { dataFetch } from "@/lib/fractera/data-service"
import { allFacts } from "./registry"

// КАНДИДАТЫ В РЕЕСТР — система сама говорит, чего ей не хватает (81-7).
//
// 🔒 ТРЕБОВАНИЕ ВЛАДЕЛЬЦА 2026-09-01, ДОСЛОВНО: «когда пользователь будет
// отправлять сообщения, которые будут иметь сноску или прецедент на какую-то
// новую сущность, которая не указана в реестре признаков, система должна прямо
// ему сказать: вы говорите о параметрах, которые не занесены в реестр».
//
// 🔒 ЭТО ПОЛОВИНА ЗАМЫСЛА, А НЕ ОТДЕЛЬНАЯ ФУНКЦИЯ. Агент вынес кандидатов из
// плана как «правку разбора» и был поправлен: без них реестр остаётся ручным
// справочником, а владелец просил эволюционирующую архитектуру.
//
// 🔒 СЫРЬЁ УЖЕ ЕСТЬ И ВЫБРАСЫВАЕТСЯ. Модель при каждом разборе возвращает
// `facets` — «два-шесть коротких тегов, о чём это, словами человека», — и они
// уезжают ТОЛЬКО в текст конверта графа. Подшаг не изобретает извлечение, он
// подбирает уже извлечённое.

/** Сколько раз тег должен встретиться, прежде чем его предложат. */
const TIMES_BEFORE_OFFER = 3

/** Слишком короткое или слишком длинное — не признак, а обрывок. */
const MIN_LEN = 3
const MAX_LEN = 40

async function sql<T>(query: string, params: unknown[] = []): Promise<T[]> {
  try {
    const r = await dataFetch("/db/migrate", {
      method: "POST",
      body: JSON.stringify({ sql: query, params }),
    })
    if (!r.ok) return []
    const d = (await r.json()) as { rows?: T[] }
    return d.rows ?? []
  } catch {
    return []
  }
}

/**
 * Учесть теги сообщения и вернуть кандидата, которого стоит предложить.
 *
 * 🔒 ТРИ ПРАВИЛА ПРОТИВ ШУМА — решение агента, согласованное владельцем.
 *
 * 1. **Не с первого раза.** «Пушкин» тоже незнаком реестру, но признак под него
 *    не нужен. Предлагается то, что встретилось несколько раз: это привычка
 *    человека, а не случайное слово.
 * 2. **Одно предложение за раз, отклонённое не повторяется.** Иначе бот
 *    напоминает про одно и то же каждым сообщением — тот же закон, что «один
 *    цвет тревоги на шаг, и лучше ни одного».
 * 3. **Отдельной строкой в конце, а не вместо ответа** — это уже дело двери.
 *
 * Возвращает имя кандидата или пусто. Пусто — обычное состояние, а не отказ.
 */
export async function noteFacets(facets: string[]): Promise<string> {
  if (!facets.length) return ""

  // Реестр читается ОДИН раз на сообщение.
  //
  // ✗ 🛑 ТОЧНОГО СОВПАДЕНИЯ НЕДОСТАТОЧНО, И ЭТО ИЗМЕРЕНО, А НЕ ПРЕДУГАДАНО
  // (81-7, живой прогон). Признак «Тут про деньги» существует, а модель прислала
  // тег «деньги» — и он стал кандидатом на то, что уже есть. Сверка знала
  // `money`, `field.money` и «тут про деньги», но не отдельное слово из названия.
  //
  // 🔒 СЛОВА НАЗВАНИЯ ТОЖЕ СЧИТАЮТСЯ ЗНАКОМЫМИ, И ЭТО ЛЕЧИТ КЛАСС, А НЕ СЛУЧАЙ:
  // тег приходит от модели свободной формой — «деньги», «расходы», «трата», — и
  // ждать от неё точного имени признака значит завести кандидатов на всё, что уже
  // умеет система. Ошибиться в эту сторону дешевле: лишний раз промолчать лучше,
  // чем предложить завести существующее.
  const known = new Set<string>()
  const add = (s: string) => {
    const v = s.trim().toLowerCase()
    if (v.length >= MIN_LEN) known.add(v)
  }
  for (const f of await allFacts()) {
    add(f.key)
    add(f.key.split(".").pop()!)
    add(f.title)
    // Отдельные слова названия: «Тут про деньги» → «деньги».
    for (const w of f.title.split(/[\s,;·—-]+/)) add(w)
  }

  const fresh = facets
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length >= MIN_LEN && t.length <= MAX_LEN && !known.has(t))

  if (!fresh.length) return ""

  for (const tag of fresh) {
    await sql(
      `INSERT INTO fact_candidates (tag, seen, last_at)
       VALUES (?, 1, strftime('%Y-%m-%dT%H:%M:%SZ','now'))
       ON CONFLICT(tag) DO UPDATE SET
         seen = seen + 1,
         last_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')`,
      [tag],
    )
  }

  // 🔒 ПРЕДЛАГАЕМ ОДНОГО — САМОГО ЧАСТОГО ИЗ СОЗРЕВШИХ, И ТОЛЬКО ОДИН РАЗ.
  // `offered` ставится сразу: человек уже увидел предложение, и повторять его
  // на каждом следующем сообщении значит приучить не читать подсказки.
  const ripe = await sql<{ tag: string }>(
    `SELECT tag FROM fact_candidates
      WHERE seen >= ? AND offered = 0 AND dismissed = 0
      ORDER BY seen DESC, id ASC LIMIT 1`,
    [TIMES_BEFORE_OFFER],
  )
  const pick = ripe[0]?.tag ?? ""
  if (pick) await sql("UPDATE fact_candidates SET offered = 1 WHERE tag = ?", [pick])
  return pick
}

/** Кандидаты для экрана: что система заметила и сколько раз. */
export async function listCandidates(): Promise<
  { tag: string; seen: number; offered: number; dismissed: number; lastAt: string }[]
> {
  return sql(
    `SELECT tag, seen, offered, dismissed, last_at AS lastAt
       FROM fact_candidates WHERE dismissed = 0 ORDER BY seen DESC, id ASC LIMIT 50`,
  )
}

/**
 * Отклонить кандидата.
 *
 * 🔒 ОТКЛОНЁННЫЙ НЕ УДАЛЯЕТСЯ, А ПОМЕЧАЕТСЯ. Удали мы строку — тег встретится
 * снова, дорастёт до порога и будет предложен второй раз, хотя человек уже
 * сказал «нет». Отметка и есть его ответ.
 */
export async function dismissCandidate(tag: string): Promise<void> {
  await sql("UPDATE fact_candidates SET dismissed = 1 WHERE tag = ?", [tag.trim().toLowerCase()])
}
