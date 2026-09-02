import { tool, type ToolSet } from "ai"
import { z } from "zod"
import type { Fact } from "@/lib/facts/types"

// ПРИЗНАК РЕЕСТРА СТАНОВИТСЯ ИНСТРУМЕНТОМ МОДЕЛИ (91-4).
//
// 🔒 ЭТО ОТВЕТ НА ВОПРОС ВЛАДЕЛЬЦА «ЧТОБЫ АГЕНТ МОГ НАТИВНО ВЫЗЫВАТЬ». Модель
// выбирает инструмент САМА, по его описанию, — мы не перебираем признаки в
// цикле и не спрашиваем «есть ли здесь деньги?» по одному. Описание инструмента
// это `howToFind` признака: та самая инструкция узнавания, ради которой реестр и
// заведён. Признак без неё — колонка, которую никто не заполняет.
//
// 🔒 ЭТО ПРОЕКЦИЯ, А НЕ ДЕЛЕНИЕ ЗАПРОСА НА КУСКИ. Запрос предъявляется каждому
// инструменту ЦЕЛИКОМ, и каждый берёт столько, сколько его касается. Один и тот
// же фрагмент попадает в три строки; строка может не иметь фрагмента вовсе —
// «самые вкусные» есть предпочтение, а не отрезок текста.

/** Что инструмент нашёл в запросе. Сырое значение, без назначения и без фразы. */
export type Finding = {
  /** Ключ признака реестра. */
  fact: string
  /** Значения по слотам. Признак без `produces` кладёт одно — под ключом `value`. */
  values: Record<string, string>
  confidence?: number
}

/**
 * Имя инструмента из ключа признака.
 *
 * 🔒 ТОЧКА В ИМЕНИ ФУНКЦИИ ПРОВАЙДЕРОМ НЕ ПРИНИМАЕТСЯ, а ключи реестра почти все
 * с точкой (`intent.capture`). Перевод механический и обратимый: обратно ищем по
 * списку, а не разбираем строку — второй разбор разошёлся бы с первым.
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
    // Связь с прошлым сообщением ищется временем и разрешением ссылки (91-9),
    // а не догадкой модели: выдуманная связь необратимо путает две истории.
    if (f.valueType === "link") return false
    return true
  })
}

/** Слоты признака: несколько именованных значений или одно безымянное. */
function slotsOf(fact: Fact): { name: string; title: string; unit?: string }[] {
  if (fact.produces?.length) {
    return fact.produces.map(p => ({ name: p.slot, title: p.title, unit: p.unit }))
  }
  return [{ name: "value", title: fact.title }]
}

/**
 * Набор инструментов из признаков.
 *
 * 🔒 НАЙДЕННОЕ УХОДИТ В `take`, А НЕ ВОЗВРАЩАЕТСЯ МОДЕЛИ ОБРАТНО. Инструмент
 * отвечает коротким «принято»: верни он значение целиком, модель принялась бы
 * его пересказывать и уточнять, а нам нужен факт вызова, а не разговор о нём.
 *
 * 🛑 ЗДЕСЬ НИЧЕГО НЕ СОХРАНЯЕТСЯ В ТАБЛИЦЫ ПРИЗНАКОВ. Строка называет, что
 * найдено; куда это ляжет — 91-6. Модель ПРЕДЛАГАЕТ, человек применяет.
 */
export function factTools(facts: Fact[], take: (f: Finding) => void): ToolSet {
  const set: ToolSet = {}

  for (const fact of facts) {
    const slots = slotsOf(fact)
    const shape: Record<string, z.ZodTypeAny> = {}
    for (const s of slots) {
      shape[s.name] = z
        .string()
        .optional()
        .describe(s.unit ? `${s.title} (${s.unit})` : s.title)
    }
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
      inputSchema: z.object(shape),
      execute: async (input: Record<string, unknown>) => {
        const values: Record<string, string> = {}
        for (const s of slots) {
          const v = input[s.name]
          if (v !== undefined && v !== null && String(v).trim() !== "") {
            values[s.name] = String(v).trim()
          }
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
