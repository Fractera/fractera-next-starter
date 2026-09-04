import { readEnvValue, writeEnvValue } from "@/lib/architect/env-writer"

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
// 🔒 ПИСАТЕЛЬ ОДИН — `env-writer.ts`, построчный и атомарный. Второго писателя
// `.env` в этом проекте нет и не будет: два места, пишущих один файл, расходятся
// на первой же правке формата.

/** Файлы окружения трёх потребителей ключа. Пути — параметром окружения, чтобы работа проверялась на временной папке. */
const SLOT_ENV = process.env.SLOT_ENV_PATH ?? "/opt/fractera/app/.env.local"
const DATA_ENV = process.env.DATA_ENV_PATH ?? "/opt/fractera/services/data/.env"
const RAG_ENV = process.env.RAG_ENV_PATH ?? "/opt/fractera/services/rag/.env"

const KEY = "OPENAI_API_KEY"

// 🔒 ИМЯ ПЕРЕМЕННОЙ ПРИНАДЛЕЖИТ ПОТРЕБИТЕЛЮ, А НЕ НАМ (шаг 107, 2026-09-04).
//
// ✗ ЧЕМ ОПЛАЧЕНО. Этот файл писал графу `OPENAI_API_KEY` — переменную, которой
// LightRAG НЕ ЧИТАЕТ: он читает `LLM_BINDING_API_KEY` и `EMBEDDING_BINDING_API_KEY`.
// Ключ доезжал под чужим именем, плашка зеленела, а граф оставался слепым, и отказ
// у него молчаливый: приём документа отвечает `200` и не встраивает ничего.
// Владелец заметил это словами «раньше всегда подключалось автоматически»: панель
// (`bridges/app/app/api/config/embeddings`) пишет верные имена с самого начала, а
// этот экран — нет. Измерено на боевом сервере 2026-09-03.
//
// 🔒 ПОЭТОМУ ИМЕНА ПЕРЕМЕННЫХ — СВОЙСТВО ПОТРЕБИТЕЛЯ, ОБЪЯВЛЕННОЕ ЗДЕСЬ ЯВНО.
// Третий потребитель завтра прочтёт своё имя, и писатель, знающий одно имя на всех,
// сломается на нём так же молча.
const VARS: Record<"app" | "data" | "graph", readonly string[]> = {
  app: [KEY],
  data: [KEY],
  // Обе: LightRAG берёт ключ модели и ключ встраивания по отдельности.
  graph: ["LLM_BINDING_API_KEY", "EMBEDDING_BINDING_API_KEY"],
}

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
 * Прочитать ключ у одного потребителя ЕГО ИМЕНАМИ.
 *
 * 🔒 «ЗАДАН» ЗНАЧИТ «ЗАПОЛНЕНЫ ВСЕ ЕГО ПЕРЕМЕННЫЕ, А НЕ ХОТЯ БЫ ОДНА». У графа их
 * две, и заполненная половина — это работающая генерация при слепом встраивании,
 * то есть ровно тот молчаливый отказ, ради которого шаг и заведён.
 */
function readOne(path: string, names: readonly string[]): { value: string | null; present: boolean } {
  try {
    const values = names.map((n) => {
      const v = readEnvValue(n, path)
      return v && v.trim() ? v.trim() : null
    })
    return { value: values.every(Boolean) ? values[0] : null, present: true }
  } catch {
    return { value: null, present: false }
  }
}

/**
 * 🔒 «НЕТ ФАЙЛА» И «ЕСТЬ ФАЙЛ БЕЗ КЛЮЧА» — РАЗНЫЕ СОСТОЯНИЯ, И ЛЕЧЕНИЕ У НИХ
 * РАЗНОЕ: первое означает, что служба не установлена (и требовать от неё ключ
 * бессмысленно), второе — что ключ ей не доехал.
 */
export function readOpenAiKeyState(): OpenAiKeyState {
  const app = readOne(SLOT_ENV, VARS.app)
  const data = readOne(DATA_ENV, VARS.data)
  const graph = readOne(RAG_ENV, VARS.graph)
  const tail = app.value ? app.value.slice(-4) : null
  return {
    app: { configured: Boolean(app.value), present: app.present },
    data: { configured: Boolean(data.value), present: data.present },
    graph: { configured: Boolean(graph.value), present: graph.present },
    tail,
  }
}

/**
 * Записать ключ всем живым потребителям.
 *
 * 🔒 ПИШЕМ ТОЛЬКО ТУДА, ГДЕ ФАЙЛ ЕСТЬ. Создать `.env` несуществующей службы
 * значило бы завести файл, который никто не читает, и потом объяснять, почему
 * «ключ задан», а граф молчит.
 */
export function writeOpenAiKey(value: string): { written: string[]; failed: string[] } {
  const written: string[] = []
  const failed: string[] = []
  for (const [name, path] of [
    ["app", SLOT_ENV],
    ["data", DATA_ENV],
    ["graph", RAG_ENV],
  ] as const) {
    const { present } = readOne(path, VARS[name])
    if (!present) continue
    // 🔒 ПИШЕМ ИМЕНАМИ ПОТРЕБИТЕЛЯ. У графа их две, и записаны обязаны быть обе:
    // одна из двух — это работающая генерация при слепом встраивании.
    const results = VARS[name].map((n) => writeEnvValue(n, value, path))
    if (results.every((r) => r.ok)) written.push(name)
    else failed.push(name)
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
