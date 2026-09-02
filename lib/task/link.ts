import { generateText, Output } from "ai"
import { z } from "zod"
import { createOpenAI } from "@ai-sdk/openai"
import { openAiKey } from "@/lib/openai-key"
import { taskModelName } from "./agent"
import { LINK_FINDER } from "./actors"
import { nowMs } from "./store"
import type { TaskRow } from "./types"

// НАСТОЯЩИЙ ИНСТРУМЕНТ ПОИСКА СВЯЗИ С ПРЕДЫДУЩИМ СООБЩЕНИЕМ (правка владельца
// 2026-09-02).
//
// 🔒 ЭТО ПРАВИЛО, КОТОРОЕ ИСПОЛНЯЕТСЯ ВСЕГДА, ЧТО БЫ НИ ПРИШЛО. Его слова:
// «всегда во всех случаях будет действие, которое будет исследовать, было ли в
// тексте сообщения прямое или косвенное указание на то, что это сообщение нужно
// исследовать в контексте с каким-то другим».
//
// 🔒 СВЯЗЬ ИЩЕТСЯ ПО ТРЁМ ПРИЗНАКАМ СРАЗУ, А НЕ ПО ОДНОМУ: общий предмет
// («магазин», «покупка»), прямая ссылка словами («то, что я просил») и разрыв
// во времени. Одного времени мало — подряд идут и несвязанные реплики; одного
// предмета мало — про магазин человек говорит и через месяц.
//
// 🛑 НАЙДЕННАЯ СВЯЗЬ НАЗЫВАЕТСЯ ПОИМЁННО: номер сообщения в базе и его текст.
// «Связь найдена» без имени проверить нельзя, а ошибиться здесь дорого — две
// чужие истории склеиваются молча.

export type Candidate = { id: number; at: string; text: string }

export type LinkResult = {
  linked: boolean
  /** Номера связанных сообщений, от самого близкого по смыслу. */
  ids: number[]
  /** Почему связаны — короткой фразой человека, а не терминами. */
  why: string
  failed?: string
}

const SCHEMA = z.object({
  linked: z.boolean().describe("Продолжает ли новое сообщение какое-то из прежних"),
  ids: z.array(z.number()).describe("Номера связанных сообщений; пусто, если связи нет"),
  why: z.string().describe("Короткое объяснение: общий предмет, прямая ссылка, разрыв во времени"),
})

/**
 * Спросить у модели, связано ли сообщение с прежними.
 *
 * 🔒 СХЕМА ПРОВЕРЯЕТСЯ НАМИ, А НЕ ОБЕЩАЕТСЯ МОДЕЛЬЮ (закон `socials-ai`): ответ,
 * не прошедший проверку, отбрасывается ЦЕЛИКОМ — половина разобранной связи
 * хуже, чем её отсутствие.
 * 🔒 НОМЕРА, КОТОРЫХ НЕ БЫЛО В СПИСКЕ КАНДИДАТОВ, ОТБРАСЫВАЮТСЯ: модель охотно
 * называет правдоподобный номер, которого не существует.
 */
export async function findLink(
  text: string,
  candidates: Candidate[],
  timeZone = "",
): Promise<LinkResult> {
  if (!candidates.length) return { linked: false, ids: [], why: "прежних сообщений нет" }

  const list = candidates
    .map(c => `#${c.id} (${c.at}): ${c.text.slice(0, 300)}`)
    .join(String.fromCharCode(10))

  try {
    const { output } = await generateText({
      model: createOpenAI({ apiKey: openAiKey() })(taskModelName("cheap")),
      output: Output.object({ schema: SCHEMA }),
      prompt: [
        "Ты решаешь ОДИН вопрос: продолжает ли новое сообщение человека какое-то из прежних.",
        "Связь бывает трёх родов, и любого достаточно: общий предмет разговора;",
        "прямая ссылка словами («то, что я просил», «про это же»); малый разрыв во времени",
        "при близкой теме. Совпадение одних только слов связью не является.",
        timeZone ? `Часовой пояс человека: ${timeZone}.` : "",
        "",
        "ПРЕЖНИЕ СООБЩЕНИЯ:",
        list,
        "",
        `НОВОЕ СООБЩЕНИЕ: ${text}`,
        "",
        "Верни linked, ids связанных сообщений и why — короткое объяснение по-русски.",
      ].join(String.fromCharCode(10)),
    })

    const known = new Set(candidates.map(c => c.id))
    const ids = (output.ids ?? []).filter(id => known.has(id))
    return { linked: Boolean(output.linked && ids.length), ids, why: output.why ?? "" }
  } catch (e) {
    // 🛑 ОТКАЗ МОДЕЛИ — ЗАКОННЫЙ ИСХОД: строка честно скажет, что связь не
    // проверена, вместо того чтобы объявить её отсутствующей.
    return { linked: false, ids: [], why: "", failed: e instanceof Error ? e.message.slice(0, 120) : "failed" }
  }
}

/** Строка таблицы по результату поиска связи. */
export function linkRow(r: LinkResult, candidates: Candidate[], id: number): TaskRow {
  const named = r.ids
    .map(i => {
      const c = candidates.find(x => x.id === i)
      return c ? `#${c.id} «${c.text.slice(0, 120)}»` : `#${i}`
    })
    .join("; ")

  return {
    id,
    kind: "resolve",
    phrase: r.failed
      ? `Связь проверить не удалось: ${r.failed}`
      : r.linked
        ? `Связь с предыдущим сообщением установлена: ${named}. Основание: ${r.why}`
        : "Связь с предыдущим сообщением не обнаружена.",
    source: "model",
    tool: LINK_FINDER.name,
    toolWhat: LINK_FINDER.what,
    instruction: LINK_FINDER.ownInstruction,
    // 🔒 СЛЕДУЮЩЕЕ ДЕЙСТВИЕ ЕСТЬ ТОЛЬКО КОГДА ЕСТЬ СВЯЗЬ. Слово владельца: если
    // связь найдена, следующим действием мы дописываем её в строку поиска
    // признаков — «данное сообщение связано с предыдущими», и перечисляем их
    // номером и текстом. Нет связи — нет и следующего действия.
    next: r.linked
      ? `Добавить связь в строку поиска признаков: сообщение связано с ${named}.`
      : undefined,
    payload: r.ids.length ? { linkedTo: r.ids } : undefined,
    at: nowMs(),
  }
}
