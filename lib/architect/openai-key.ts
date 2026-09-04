import { dataFetch } from "@/lib/fractera/data-service"

// КЛЮЧ OPENAI — СОСТОЯНИЕ, ЗАПИСЬ И ПРОВЕРКА (77-8, 2026-09-01).
//
// 🔒 ОДИН КЛЮЧ — ТРИ ПОТРЕБИТЕЛЯ, ТРИ ОТДЕЛЬНЫЕ ПРАВДЫ. Закон перенесён из панели
// вместе с причиной, которую она оплатила днём отладки: «ключ, доехавший до графа
// и не доехавший до слота, — ровно тот случай, когда „задан“ было бы ложью».
// Отказ у второго потребителя МОЛЧАЛИВЫЙ: приём документа отвечает 200 и не
// встраивает ничего. Поэтому здесь читаются все три файла по отдельности, а не
// один индикатор «ключ есть».
//
// 🔒 ЗНАЧЕНИЕ КЛЮЧА НАРУЖУ НЕ ВЫХОДИТ НИКОГДА — ни в состоянии, ни в ответе на
// сохранение. Наружу едет `configured` и хвост из четырёх символов: его хватает,
// чтобы человек узнал свой ключ, и не хватает, чтобы им воспользоваться.
//
// 🪦 ЗДЕСЬ СТОЯЛО: «ПИСАТЕЛЬ ОДИН — env-writer.ts… три файла читаются по
// отдельности». ОТМЕНЕНО ШАГОМ 109-2 (2026-09-04): этот файл больше не пишет и не
// читает env вовсе — он ЗВОНИТ В ДВЕРЬ `POST/GET /platform/openai-key` службы
// данных. Прежняя правда о построчной атомарной записи не исчезла, она переехала
// туда вместе с писателем.
//
// ✗ ЧЕМ ОПЛАЧЕН ПЕРЕЕЗД. Ключ вводится в ТРЁХ местах — панель, этот экран, чат, —
// и каждое держало СВОЙ список имён потребителей. Они разошлись молча: этот файл
// писал графу `OPENAI_API_KEY`, которую LightRAG не читает (ему нужны
// `LLM_BINDING_API_KEY` и `EMBEDDING_BINDING_API_KEY`), а чат не писал графу вовсе.
// Плашка зеленела, граф оставался слепым, отказ у него молчаливый. Владелец назвал
// симптом словами «раньше всегда подключалось автоматически».
//
// 🔒 ЛЕЧЕНИЕ — НЕ «ПОПРАВИТЬ ТРИ СПИСКА», А УБРАТЬ ДВА. Кто потребляет ключ и
// какими именами его читает — знает ОДНА служба данных. Здесь этого знания нет
// намеренно: вернув сюда список путей или имён, вы вернёте и дефект.
//
// 🔒 ПОЧЕМУ ДВЕРЬ ЖИВЁТ НЕ ЗДЕСЬ. Гостевой слот в покое пуст и сменяем, а панель
// обязана уметь ставить ключ и тогда; при этом гостевое приложение не имеет права
// зависеть от панели в рантайме. Служба данных есть всегда.

export type Consumer = {
  /** Ключ найден в файле этого потребителя. */
  configured: boolean
  /** Файл существует вообще: служба может быть не установлена, и это НЕ отказ. */
  present: boolean
}

export type OpenAiKeyState = {
  /** Гостевое приложение: голос, разбор записей, ответы бота. */
  app: Consumer
  /** Слой данных: векторный поиск и встраивание. */
  data: Consumer
  /** Служба графа знаний. Может быть не установлена. */
  graph: Consumer
  /** Хвост ключа приложения — для узнавания, не для использования. */
  tail: string | null
}

/**
 * 🔒 «НЕТ ФАЙЛА» И «ЕСТЬ ФАЙЛ БЕЗ КЛЮЧА» — РАЗНЫЕ СОСТОЯНИЯ, И ЛЕЧЕНИЕ У НИХ
 * РАЗНОЕ: первое означает, что служба не установлена (и требовать от неё ключ
 * бессмысленно), второе — что ключ ей не доехал.
 *
 * 🔒 СОСТОЯНИЕ СПРАШИВАЕТСЯ У ДВЕРИ, А НЕ ЧИТАЕТСЯ ИЗ ФАЙЛОВ (109-2). Файлы читает
 * служба данных — она же их и пишет. Второй читатель тех же файлов разошёлся бы с
 * писателем на первой правке имён, что этим шагом и лечится.
 */
export async function readOpenAiKeyState(): Promise<OpenAiKeyState> {
  const empty = { configured: false, present: false }
  try {
    const r = await dataFetch("/platform/openai-key", { cache: "no-store" })
    if (!r.ok) return { app: empty, data: empty, graph: empty, tail: null }
    const d = (await r.json()) as {
      state: Record<"app" | "data" | "graph", { configured: boolean; present: boolean }>
      tail: string | null
    }
    return { app: d.state.app, data: d.state.data, graph: d.state.graph, tail: d.tail }
  } catch {
    // 🔒 СЛОЙ ДАННЫХ НЕДОСТУПЕН — ЭТО НЕ «КЛЮЧА НЕТ». Отдаём «служб не видно»,
    // и экран скажет это словами, а не покрасит всё в красный.
    return { app: empty, data: empty, graph: empty, tail: null }
  }
}

/**
 * Записать ключ всем живым потребителям.
 *
 * 🔒 ПИШЕМ ТОЛЬКО ТУДА, ГДЕ ФАЙЛ ЕСТЬ. Создать `.env` несуществующей службы
 * значило бы завести файл, который никто не читает, и потом объяснять, почему
 * «ключ задан», а граф молчит.
 */
export async function writeOpenAiKey(value: string): Promise<{ written: string[]; failed: string[] }> {
  const written: string[] = []
  const failed: string[] = []
  // 🔒 ПИШЕТ ДВЕРЬ, А НЕ ЭТОТ ФАЙЛ (109-2). Список имён потребителей живёт в одном
  // месте на всю платформу — в службе данных. Здесь его копии больше нет: именно
  // три расходящиеся копии и были дефектом, ради которого шаг заведён.
  try {
    const r = await dataFetch("/platform/openai-key", {
      method: "POST",
      body: JSON.stringify({ key: value }),
    })
    if (!r.ok) return { written: [], failed: ["door"] }
    const d = (await r.json()) as { written?: string[]; failed?: string[] }
    written.push(...(d.written ?? []))
    failed.push(...(d.failed ?? []))
  } catch {
    return { written: [], failed: ["door"] }
  }
  return { written, failed }
}

export type KeyCheck = {
  /** Ключ принят OpenAI. */
  valid: boolean
  /** На счёте есть деньги: самый дешёвый настоящий вызов не упёрся в квоту. */
  funded: boolean | null
  /**
   * Остаток по счёту. 🛑 ВСЕГДА `null` ДЛЯ ПРОЕКТНОГО КЛЮЧА, И ЭТО НЕ ДЕФЕКТ:
   * OpenAI отдаёт баланс только браузерной сессии кабинета либо админскому ключу
   * `sk-admin-…` с правом `api.usage.read`. Проверено тремя запросами 2026-09-01:
   * `credit_grants` и `subscription` отвечают 403 «must be made with a session
   * key», `organization/costs` — 403 «Missing scopes».
   */
  balance: null
  /** Причина отказа словами, когда есть. */
  reason: string | null
}

/**
 * Проверить ключ двумя вопросами, на которые есть честные ответы.
 *
 * 🔒 «КЛЮЧ ВЕРНЫЙ» И «ДЕНЬГИ ЕСТЬ» — РАЗНЫЕ ВОПРОСЫ, И ВТОРОЙ НЕ ПРОВЕРЯЕТСЯ
 * СПИСКОМ МОДЕЛЕЙ. `GET /v1/models` отвечает `200` и на счёте с нулём: список
 * моделей не стоит денег. Пустой счёт виден только настоящему вызову — он
 * возвращает `429 insufficient_quota`. Поэтому проверок две, и вторая тратит
 * минимум: одно встраивание одного слова.
 */
export async function checkOpenAiKey(key: string): Promise<KeyCheck> {
  if (!key.trim()) return { valid: false, funded: null, balance: null, reason: "empty" }

  try {
    const r = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    })
    if (r.status === 401) return { valid: false, funded: null, balance: null, reason: "unauthorized" }
    if (!r.ok) return { valid: false, funded: null, balance: null, reason: `models-${r.status}` }
  } catch {
    return { valid: false, funded: null, balance: null, reason: "unreachable" }
  }

  try {
    const r = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "text-embedding-3-small", input: "ok" }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    })
    if (r.ok) return { valid: true, funded: true, balance: null, reason: null }
    if (r.status === 429) return { valid: true, funded: false, balance: null, reason: "insufficient_quota" }
    // Ключ верный, но вызов не прошёл по другой причине — не выдаём это за
    // приговор счёту: «не знаю» честнее, чем «денег нет».
    return { valid: true, funded: null, balance: null, reason: `embeddings-${r.status}` }
  } catch {
    return { valid: true, funded: null, balance: null, reason: "unreachable" }
  }
}
