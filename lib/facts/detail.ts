import type { Fact } from "./types"
import type { FactFn } from "./fn-types"

// РАСКРЫТИЕ КАРТОЧКИ ПРИЗНАКА — ПЯТЬ СТРОК (81-9).
//
// 🔒 ЗАЧЕМ ОНО ЕСТЬ, СЛОВАМИ ВЛАДЕЛЬЦА 2026-09-02: «если честно я не понимаю
// насколько много мы извлекли из этого с тобой понимание». Реестр показывает
// двадцать пять встроенных записей ОДИНАКОВО, как будто все они одинаково живые.
// Раскрытие показывает разницу: за одними стоит промпт и запись в колонку, за
// другими — только имя.
//
// 🔒 ТРИ СТРОКИ ПОРОЖДАЮТСЯ, ДВЕ ПИШУТСЯ РУКАМИ, И ГРАНИЦА ПРОВЕДЕНА ЗАРАНЕЕ.
// Порождаемое следует за кодом само; рукописное — знание, которого в коде нет
// вовсе (см. `example` и `lost` в `types.ts`).

/** Пять строк раскрытия. Пустая строка значит «нечего сказать», а не «забыли». */
export type FactDetail = {
  /** ✍️ Как человек это говорит. */
  example: string
  /** 🤖 Что признак вынимает и где это оказывается. */
  extracts: string[]
  /** 🤖 Чем добывается: разбором сообщения, внешним адресом, моделью, графом. */
  tools: string[]
  /** 🤖 Какой код за этим стоит. */
  functions: string[]
  /** ✍️ Что вынимается и НЕ сохраняется. */
  lost: string
}

/**
 * Откуда родом встроенный признак.
 *
 * 🔒 ВЫВОДИТСЯ ИЗ ПРЕФИКСА КЛЮЧА, А НЕ ХРАНИТСЯ ОТДЕЛЬНЫМ ПОЛЕМ. Встроенные
 * порождаются семействами (`materialFacts`, `intentFacts`, …), и семейство
 * однозначно определяет модуль-источник: второе поле рядом с ключом разошлось бы
 * с ним при первом же переносе.
 */
const ORIGIN: Record<string, string[]> = {
  material: ["services/channels — расшифровка голоса", "lib/products/telegram-desk/ingest.ts"],
  intent: ["lib/products/telegram-desk/route-intent.ts → routeIntent(), INTENTS"],
  entity: ["lib/products/telegram-desk/branches/capture.ts → capture(), ENTRY_KINDS"],
  destination: ["lib/products/telegram-desk/ingest.ts — доставка в склады"],
  field: ["lib/products/telegram-desk/branches/* — разбор по ветвям"],
}

function parseFn(raw: string | undefined): FactFn | null {
  if (!raw) return null
  try {
    const fn = JSON.parse(raw) as FactFn
    return fn && typeof fn === "object" && typeof fn.kind === "string" ? fn : null
  } catch {
    return null
  }
}

/** Что признак вынимает — из типа, а не из описания словами. */
function extractsOf(fact: Fact): string[] {
  const out: string[] = []

  // 🔒 НЕСКОЛЬКО ЗНАЧЕНИЙ ПОКАЗЫВАЮТСЯ ПОИМЁННО, А НЕ ЧИСЛОМ. «Даёт 4 значения»
  // не отвечает на вопрос человека, какие именно; а весь смысл строки в этом.
  if (fact.produces?.length) {
    for (const p of fact.produces) {
      out.push(`${p.title} (${p.slot}${p.unit ? `, ${p.unit}` : ""}) → ${fact.storedIn}`)
    }
  } else {
    out.push(`${fact.title} → ${fact.storedIn}`)
  }

  if (fact.derivedFrom) {
    out.push(`считается из признака «${fact.derivedFrom}», а не ищется в тексте`)
  }
  if (fact.aggregate && fact.aggregate !== "none") {
    out.push(`накапливается: ${fact.aggregate}${fact.unit ? ` (${fact.unit})` : ""}`)
  }
  if (fact.subject && fact.subject !== "none") {
    out.push(fact.subject === "self" ? "факт о самом владельце" : "факт о названном человеке")
  }
  if (fact.lifecycle?.statuses.length) {
    out.push(`состояния: ${fact.lifecycle.statuses.join(" → ")}`)
  }
  return out
}

/** Чем добывается. Отвечает на вопрос владельца «какие применены инструменты». */
function toolsOf(fact: Fact): string[] {
  const fn = parseFn(fact.fn)
  if (!fn) {
    // 🔒 ОТСУТСТВИЕ ВНЕШНЕГО ВЫЗОВА — ЭТО ТОЖЕ ОТВЕТ, А НЕ ПУСТОТА. Признак без
    // функции берётся из самого сообщения, и человеку надо это сказать, иначе
    // пустая строка читается как «инструмент неизвестен».
    return ["извлекается разбором самого сообщения; внешних вызовов нет"]
  }
  const said: Record<string, string> = {
    http: `внешний адрес: ${fn.url ?? "не указан"}`,
    model: "вопрос модели заданным промптом",
    rag: "вопрос графу знаний",
    web: "внешний веб-источник (исполнитель приезжает шагом 87)",
  }
  const out = [said[fn.kind] ?? fn.kind]
  if (fn.pick) out.push(`берётся поле ответа: ${fn.pick}`)
  out.push(fn.onFail === "note" ? "при отказе — пометка человеку" : "при отказе — тишина и запись причины")
  return out
}

/** Какой код за этим стоит. */
function functionsOf(fact: Fact): string[] {
  if (!fact.builtin) {
    const fn = parseFn(fact.fn)
    return fn
      ? ["lib/facts/run-fn.ts → runFactFn() — исполнитель описанных функций", "lib/facts/collect.ts → collectFactValues()"]
      : ["lib/facts/collect.ts — значение кладётся при разборе сообщения"]
  }
  const family = fact.key.split(".")[0]
  return [...(ORIGIN[family] ?? []), "lib/facts/builtin.ts — здесь эта карточка и порождается"]
}

/**
 * Собрать раскрытие.
 *
 * 🔒 РУКОПИСНОЕ БЕРЁТСЯ КАК ЕСТЬ И НЕ ДОСОЧИНЯЕТСЯ. Пустое поле возвращается
 * пустым: экран скажет «не описано», и это честнее любой подстановки.
 */
export function factDetail(fact: Fact): FactDetail {
  return {
    example: fact.example ?? "",
    extracts: extractsOf(fact),
    tools: toolsOf(fact),
    functions: functionsOf(fact),
    lost: fact.lost ?? "",
  }
}
