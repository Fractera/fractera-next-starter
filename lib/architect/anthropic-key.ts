import "server-only"
import { readEnvValue, writeEnvValue } from "@/lib/architect/env-writer"

// КЛЮЧ ANTHROPIC — СОСТОЯНИЕ, ЗАПИСЬ И ПРОВЕРКА (113-1, 2026-09-04).
//
// 🔒 ПОТРЕБИТЕЛЬ РОВНО ОДИН — ЧАТ, И ЭТО ГЛАВНОЕ ОТЛИЧИЕ ОТ КЛЮЧА OPENAI. У того
// потребителей трое (приложение · слой данных · граф знаний), каждый со своими
// именами переменных, и поэтому знание о них живёт в ОДНОЙ двери службы данных —
// закон шага 109, оплаченный слепым графом. Здесь потребитель один и имя одно,
// поэтому дверь службы данных не нужна: заводить её значило бы отвечать на
// вопрос, которого никто не задал.
//
// 🔒 ФАЙЛ ТОТ ЖЕ, ЧТО У КЛЮЧА OPENAI, — `.env.local` СЛОТА. Один дом у секретов
// проекта: чат уже читает оттуда `OPENAI_API_KEY`, и второй адрес означал бы, что
// половина ключей живёт в одном месте, половина в другом, и никто не помнит, в
// каком именно.
//
// 🔒 ПИСАТЕЛЬ СУЩЕСТВУЮЩИЙ, СВОЕГО НЕ ЗАВОДИТСЯ. `env-writer.ts` правит ОДНУ
// названную строку атомарно, сохраняя комментарии, порядок и переводы строк. В
// этом файле живут ключи доступа к серверу и состояние мастера запуска — второй
// писатель разошёлся бы с первым на первой же правке формата, и разошёлся бы молча.
//
// 🔒 «СОХРАНЕНО» ЗДЕСЬ РАВНО «ПРИМЕНЕНО», И ЭТО РЕДКИЙ СЛУЧАЙ, КОТОРЫЙ НАДО
// СКАЗАТЬ ВСЛУХ. Ключ OpenAI требует перезапуска слота: тот читает окружение при
// старте. Ключ Anthropic не требует ничего — чат читает файл при каждом
// обращении и подаёт значение полем `env` самому SDK. Измерено по документации:
// «The SDK reads the key from the environment of the process that runs your
// agent; it doesn't load `.env` files automatically».

/** Имя переменной — то, которое читает сам SDK. Второго имени у неё нет. */
export const ANTHROPIC_KEY_VAR = "ANTHROPIC_API_KEY"

export type AnthropicKeyState = {
  /** Ключ лежит в файле проекта. */
  configured: boolean
  /** Хвост из четырёх символов — для узнавания, не для использования. */
  tail: string | null
}

/**
 * 🔒 ЗНАЧЕНИЕ КЛЮЧА НАРУЖУ НЕ ВЫХОДИТ НИКОГДА — ни отсюда, ни из двери. Наружу
 * едет признак «задан» и хвост: его хватает, чтобы человек узнал свой ключ, и не
 * хватает, чтобы им воспользоваться.
 */
export function readAnthropicKeyState(): AnthropicKeyState {
  const key = readEnvValue(ANTHROPIC_KEY_VAR) ?? ""
  return { configured: Boolean(key), tail: key ? key.slice(-4) : null }
}

/**
 * 🔒 ФОРМА ПРОВЕРЯЕТСЯ ДО ЗАПИСИ. Ключ, не похожий на ключ, — это опечатка или
 * вставленный не тот буфер обмена; записанный, он ломает не эту страницу, а
 * первый же ответ агента через час. Префикс взят из документации Anthropic
 * (`sk-ant-api03-…`) и намеренно проверяется до `sk-ant-`, а не целиком: линейка
 * префиксов у них уже менялась, и слишком точная проверка отвергла бы годный ключ.
 */
export function looksLikeAnthropicKey(key: string): boolean {
  return key.startsWith("sk-ant-") && key.length >= 20
}

export function writeAnthropicKey(key: string): { ok: boolean; detail?: string } {
  const res = writeEnvValue(ANTHROPIC_KEY_VAR, key)
  return res.ok ? { ok: true } : { ok: false, detail: res.detail }
}

export type AnthropicCheck = {
  /** Ключ принят Anthropic. */
  valid: boolean
  /**
   * Деньги на счёте есть.
   *
   * 🔒 `null` ЗНАЧИТ «НЕ УЗНАЛИ», А НЕ «НЕТ», и это отдельное состояние. Тот же
   * закон, что у ключа OpenAI: «работает» и «оплачено» — разные измерения, и
   * второе видно только настоящему вызову.
   */
  funded: boolean | null
  /** Причина отказа дословно от Anthropic — человеку, а не в лог. */
  reason: string | null
}

/**
 * Проверить ключ, КОТОРЫЙ УЖЕ ЛЕЖИТ НА СЕРВЕРЕ.
 *
 * 🔒 КЛЮЧ НЕ ПРИСЫЛАЕТСЯ С КЛИЕНТА. Иначе кнопка «Проверить» стала бы способом
 * гонять чужие ключи через наш сервер, а секрет ездил бы по проводу без нужды.
 *
 * 🔒 ВОПРОСА ДВА, И ОТВЕТЫ НА НИХ РАЗНЫЕ. Список моделей отвечает `200` и на
 * пустом счёте — он ничего не стоит. Поэтому вторым идёт НАСТОЯЩИЙ вызов на один
 * токен: только он отличает «ключ живой» от «ключом можно пользоваться».
 * ✗ У ключа OpenAI это уже оплачено днём отладки: плашка зеленела, бот молчал.
 */
export async function checkAnthropicKey(): Promise<AnthropicCheck> {
  const key = readEnvValue(ANTHROPIC_KEY_VAR) ?? ""
  if (!key) return { valid: false, funded: null, reason: "ключ не задан" }

  const headers = {
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
    "x-api-key": key,
  }

  let models: Response
  try {
    models = await fetch("https://api.anthropic.com/v1/models?limit=1", { cache: "no-store", headers })
  } catch (e) {
    // 🛑 СЕТЬ И КЛЮЧ — РАЗНЫЕ ОТКАЗЫ. Назвать недоступность сети «неверным
    // ключом» значит отправить человека менять годный ключ.
    return { valid: false, funded: null, reason: `сеть недоступна: ${String(e)}` }
  }
  if (!models.ok) {
    const body = (await models.json().catch(() => null)) as { error?: { message?: string } } | null
    return { valid: false, funded: null, reason: body?.error?.message ?? `HTTP ${models.status}` }
  }

  // 🔒 САМЫЙ ДЕШЁВЫЙ ИЗ ВОЗМОЖНЫХ НАСТОЯЩИХ ВЫЗОВОВ: одна модель, один токен.
  // Имя модели берётся из ответа `/v1/models`, а не из памяти агента, — закон
  // чужого навыка: список моделей через месяц другой.
  const list = (await models.json().catch(() => null)) as { data?: { id?: string }[] } | null
  const modelId = list?.data?.[0]?.id
  if (!modelId) return { valid: true, funded: null, reason: "список моделей пуст" }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      body: JSON.stringify({
        max_tokens: 1,
        messages: [{ content: "hi", role: "user" }],
        model: modelId,
      }),
      cache: "no-store",
      headers,
      method: "POST",
    })
    if (r.ok) return { valid: true, funded: true, reason: null }
    const body = (await r.json().catch(() => null)) as { error?: { message?: string; type?: string } } | null
    const type = body?.error?.type ?? ""
    // 🔒 «КРЕДИТ КОНЧИЛСЯ» — ЭТО НЕ «КЛЮЧ ПЛОХОЙ», И ЧЕЛОВЕКУ ЭТО ЛЕЧИТЬ ПО-РАЗНОМУ.
    if (r.status === 400 && /credit|billing|quota/i.test(body?.error?.message ?? "")) {
      return { valid: true, funded: false, reason: body?.error?.message ?? null }
    }
    if (r.status === 429) return { valid: true, funded: false, reason: body?.error?.message ?? "лимит исчерпан" }
    return { valid: true, funded: null, reason: body?.error?.message ?? type ?? `HTTP ${r.status}` }
  } catch (e) {
    return { valid: true, funded: null, reason: `сеть недоступна: ${String(e)}` }
  }
}
