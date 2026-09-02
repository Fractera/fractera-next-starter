import { tool, type ToolSet } from "ai"
import { z } from "zod"
import type { Fact, FactValueType } from "@/lib/facts/types"

// ПРИЗНАК РЕЕСТРА СТАНОВИТСЯ ИНСТРУМЕНТОМ МОДЕЛИ (91-4), А ЕГО ЗНАЧЕНИЯ —
// ТИПИЗИРОВАННОЙ НАЧИНКОЙ (91-5).
//
// 🔒 ЭТО ОТВЕТ НА ВОПРОС ВЛАДЕЛЬЦА «ЧТОБЫ АГЕНТ МОГ НАТИВНО ВЫЗЫВАТЬ». Модель
// выбирает инструмент САМА, по его описанию, — мы не перебираем признаки в
// цикле. Описание инструмента это `howToFind` признака: та самая инструкция
// узнавания, ради которой реестр и заведён.
//
// 🔒 ЭТО ПРОЕКЦИЯ, А НЕ ДЕЛЕНИЕ ЗАПРОСА НА КУСКИ. Запрос предъявляется каждому
// инструменту ЦЕЛИКОМ, и каждый берёт столько, сколько его касается.
//
// 🔒 ПРОЗА — НЕ ДАННЫЕ, И ЭТО ГЛАВНОЕ ТРЕБОВАНИЕ 91-5. «Расход 40 рублей, четыре
// пирожка по 10» — предложение; в колонку `value_num` его не записать, и
// следующему шагу писать будет нечего. Поэтому форма значения берётся из
// признака: число просится числом, дата — датой, признак-флаг — да или нет.

/** Значение слота после проверки схемой. Проза сюда не попадает. */
export type TaskValue = string | number | boolean | string[] | { lat: number; lon: number }

/** Что инструмент нашёл в запросе. Типизированная начинка, без фразы и назначения. */
export type Finding = {
  /** Ключ признака реестра. */
  fact: string
  /** Значения по слотам. Признак без `produces` кладёт одно — под ключом `value`. */
  values: Record<string, TaskValue>
  confidence?: number
}

/**
 * Имя инструмента из ключа признака.
 *
 * 🔒 ТОЧКА В ИМЕНИ ФУНКЦИИ ПРОВАЙДЕРОМ НЕ ПРИНИМАЕТСЯ, а ключи реестра почти все
 * с точкой (`intent.capture`). Перевод механический; обратно ищем по списку, а
 * не разбираем строку — второй разбор разошёлся бы с первым.
 */
export function toolNameOf(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60)
}

/**
 * Какие признаки вообще становятся инструментами.
 *
 * 🔒 НЕ ВСЕ, И КАЖДОЕ ИСКЛЮЧЕНИЕ НАЗВАНО ПРИЧИНОЙ, А НЕ ВКУСОМ. Инструмент — это
 * вопрос «есть ли это В ЗАПРОСЕ»; признак, чьё значение известно механически до
 * модели или после доставки, таким вопросом не выражается, а предложенный модели
 * приглашает её выдумать то, что и так известно точно.
 */
export function toolableFacts(facts: Fact[]): Fact[] {
  return facts.filter(f => {
    // Считается ИЗ другого признака, а не ищется в тексте (83-1).
    if (f.derivedFrom) return false
    // Чем сообщение ПРИШЛО — свойство канала: текст против голоса известен до
    // всякой модели, и спрашивать об этом значит платить за известное.
    if (f.level === "material") return false
    // Куда ушло — отметка НАШЕЙ доставки, ставится после ответа. В запросе
    // человека её нет и быть не может.
    if (f.level === "destination") return false
    // Связь с прошлым сообщением ищет ОТДЕЛЬНЫЙ инструмент, а не признак: она
    // не значение, а отношение между двумя сообщениями, и выдуманная связь
    // необратимо путает две истории.
    if (f.valueType === "relation") return false
    return true
  })
}

export type Slot = { name: string; title: string; valueType: FactValueType; unit?: string }

/** Слоты признака: несколько именованных значений или одно безымянное. */
export function slotsOf(fact: Fact): Slot[] {
  if (fact.produces?.length) {
    return fact.produces.map(p => ({
      name: p.slot,
      title: p.title,
      valueType: p.valueType,
      unit: p.unit,
    }))
  }
  return [{ name: "value", title: fact.title, valueType: fact.valueType, unit: fact.unit }]
}

/**
 * Схема одного слота — ПО ФОРМЕ ЗНАЧЕНИЯ ПРИЗНАКА, а не «строка на всё».
 *
 * 🔒 ЭТО И ЕСТЬ ПРОВЕРКА ЗАКРЫТОГО СПИСКА, ТОЛЬКО ПО ТИПУ. Модель вернёт «сорок»
 * там, где ждут число, и выглядеть это будет правдоподобно; схема отвергает
 * такой вызов ЦЕЛИКОМ, потому что наполовину разобранное сохранят (закон
 * `socials-ai`, оплаченный `fact-draft`).
 */
function slotSchema(s: Slot): z.ZodTypeAny {
  const label = s.unit ? `${s.title} (${s.unit})` : s.title
  switch (s.valueType) {
    case "flag":
      return z.boolean().describe(`${label}. Да или нет.`)
    case "number":
    case "money":
      return z.number().describe(`${label}. Только число, без слов и знаков валюты.`)
    case "date":
      return z
        .string()
        .describe(`${label}. Дата видом ГГГГ-ММ-ДД или ГГГГ-ММ-ДДTЧЧ:ММ, а не словами.`)
    case "geo":
      return z
        .object({ lat: z.number(), lon: z.number() })
        .describe(`${label}. Широта и долгота числами.`)
    case "list":
      return z.array(z.string()).describe(`${label}. Список коротких значений.`)
    default:
      return z.string().describe(label)
  }
}

/**
 * Привести значение к тому, что можно записать в колонку.
 *
 * 🔒 ДАТА СТАНОВИТСЯ МЕТКОЙ ВРЕМЕНИ ЗДЕСЬ, А НЕ ПРИ ЗАПИСИ. Слова «в воскресенье»
 * схему не проходят вовсе; но и «2026-13-45» разобрать нельзя, а выглядит оно как
 * дата. Неразобранное возвращает `null`, и находка отбрасывается ЦЕЛИКОМ.
 */
function normalise(s: Slot, v: unknown): TaskValue | null {
  if (v === undefined || v === null) return null
  if (s.valueType === "date") {
    const ms = Date.parse(String(v))
    if (!Number.isFinite(ms)) return null
    return Math.floor(ms / 1000)
  }
  if (typeof v === "string") {
    const t = v.trim()
    return t === "" ? null : t
  }
  if (Array.isArray(v)) {
    const list = v.map(String).filter(x => x.trim() !== "")
    return list.length ? list : null
  }
  if (typeof v === "number" || typeof v === "boolean") return v
  if (typeof v === "object" && "lat" in v && "lon" in v) {
    const g = v as { lat: unknown; lon: unknown }
    if (typeof g.lat === "number" && typeof g.lon === "number") return { lat: g.lat, lon: g.lon }
  }
  return null
}

/**
 * Набор инструментов из признаков.
 *
 * 🔒 НАЙДЕННОЕ УХОДИТ В `take`, А НЕ ВОЗВРАЩАЕТСЯ МОДЕЛИ ОБРАТНО. Инструмент
 * отвечает коротким «принято»: верни он значение целиком, модель принялась бы
 * его пересказывать, а нам нужен факт вызова, а не разговор о нём.
 *
 * 🔒 СХЕМА СТРОГАЯ: ЛИШНЕЕ ПОЛЕ ОТВЕРГАЕТ ВЫЗОВ, А НЕ ОТБРАСЫВАЕТСЯ МОЛЧА. Так
 * закрыт единственный путь, которым фраза могла бы приехать от модели отдельным
 * полем и разойтись с начинкой: поля просто нет в схеме (91-5).
 *
 * 🛑 ЗДЕСЬ НИЧЕГО НЕ СОХРАНЯЕТСЯ В ТАБЛИЦЫ ПРИЗНАКОВ. Строка называет, что
 * найдено; куда это ляжет — 91-6. Модель ПРЕДЛАГАЕТ, человек применяет.
 */
export function factTools(facts: Fact[], take: (f: Finding) => void): ToolSet {
  const set: ToolSet = {}

  for (const fact of facts) {
    const slots = slotsOf(fact)
    const shape: Record<string, z.ZodTypeAny> = {}
    for (const s of slots) shape[s.name] = slotSchema(s).optional()
    shape.confidence = z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe("Насколько уверены: 1 — сказано прямо, 0.5 — выведено из смысла.")

    set[toolNameOf(fact.key)] = tool({
      // 🔒 ОПИСАНИЕ — ЭТО `howToFind`, А НЕ ПЕРЕСКАЗ НАЗВАНИЯ. По нему модель и
      // выбирает; заголовок без инструкции узнавания не отличает «деньги» от
      // «числа». Заголовок и назначение идут рядом — они дают контекст.
      description: `${fact.title}. ${fact.description} КАК УЗНАВАТЬ: ${fact.howToFind}`,
      inputSchema: z.strictObject(shape),
      execute: async (input: Record<string, unknown>) => {
        const values: Record<string, TaskValue> = {}
        for (const s of slots) {
          if (!(s.name in input)) continue
          const raw = input[s.name]
          const v = normalise(s, raw)
          // 🛑 НЕРАЗОБРАННОЕ ЗНАЧЕНИЕ РОНЯЕТ ВСЮ НАХОДКУ, А НЕ ОДИН СЛОТ. Запись
          // «покупка на неизвестную сумму» в таблице неотличима от покупки за
          // ноль, и разбираться в этом будут через месяц по итогам.
          if (v === null && raw !== undefined && raw !== null) {
            return { recorded: false, reason: `значение слота ${s.name} не разобрано` }
          }
          if (v !== null) values[s.name] = v
        }
        // 🔒 ПУСТОЙ ВЫЗОВ — ЭТО НЕ НАХОДКА. Модель зовёт инструмент «на всякий
        // случай» и не кладёт ни одного значения; записав такой вызов, экран
        // показал бы признак, которого в запросе нет.
        if (!Object.keys(values).length) return { recorded: false, reason: "пусто" }

        const c = typeof input.confidence === "number" ? input.confidence : undefined
        take({ fact: fact.key, values, confidence: c })
        return { recorded: true }
      },
    })
  }

  return set
}
