import type { Fact } from "./types"

// ПРОИЗВОДНЫЙ ПРИЗНАК — ЗНАЧЕНИЕ СЧИТАЕТСЯ ИЗ ДРУГОГО, А НЕ ИЩЕТСЯ В ТЕКСТЕ (83-4).
//
// 🔒 ЗАЧЕМ. «Три пирожка по 25» даёт количество и цену; произведение 75 в тексте
// не встречается ни одной цифрой, и вынуть его разбором нельзя — только посчитать.
// То же с калорийностью: она берётся из справочника по названию еды.
//
// 🔒 ЦЕПОЧКА КОНЕЧНА, И ЭТО ДЕРЖИТ КОД, А НЕ ДИСЦИПЛИНА. Признак, производный сам
// от себя, или кольцо из трёх — описание, которое человек однажды напишет. Кольцо
// отклоняется ПРИ СОХРАНЕНИИ, а не в момент разбора: отказ на экране заведения
// дешевле молчаливого зацикливания на живом сообщении.

/** Дальше этого цепочка не считается: столько шагов уже означает ошибку описания. */
export const MAX_DERIVED_DEPTH = 4

export type ChainProblem =
  | { ok: true; depth: number }
  | { ok: false; reason: "self-reference" | "cycle" | "too-deep" | "missing-source"; path: string[] }

/**
 * Проверить цепочку производности ДО записи признака.
 *
 * 🔒 ПРОВЕРЯЕТСЯ ПУТЬ ЦЕЛИКОМ, А НЕ ОДИН ШАГ. `a → b` выглядит безобидно, пока не
 * окажется, что `b → c → a`; увидеть это можно только пройдя цепочку до конца.
 *
 * 🔒 ОТСУТСТВУЮЩИЙ ИСТОЧНИК — ОТДЕЛЬНЫЙ ИСХОД, А НЕ ОШИБКА КОЛЬЦА. Человек может
 * описать производный признак раньше того, из которого он считается: это законный
 * порядок работы, и путать его с зацикливанием значит запретить законное.
 */
export function checkChain(candidate: Fact, all: Fact[]): ChainProblem {
  if (!candidate.derivedFrom) return { ok: true, depth: 0 }

  const byKey = new Map(all.map(f => [f.key, f]))
  const path: string[] = [candidate.key]
  let current = candidate.derivedFrom

  for (let depth = 1; depth <= MAX_DERIVED_DEPTH; depth++) {
    if (current === candidate.key) {
      return { ok: false, reason: path.length === 1 ? "self-reference" : "cycle", path: [...path, current] }
    }
    if (path.includes(current)) return { ok: false, reason: "cycle", path: [...path, current] }

    path.push(current)
    const source = byKey.get(current)

    // Источника ещё нет — цепочка на этом кончается, и это законно.
    if (!source) return { ok: false, reason: "missing-source", path }
    if (!source.derivedFrom) return { ok: true, depth }

    current = source.derivedFrom
  }

  return { ok: false, reason: "too-deep", path }
}

/**
 * Значение источника для подстановки.
 *
 * 🔒 ПОДСТАНОВКА ИМЕНОВАННАЯ, КАК И ВЕЗДЕ В ЭТОМ СЛОЕ. `{источник}` — и ничего
 * больше: позволь я произвольное выражение, описание снова стало бы кодом,
 * который исполняется на нашем сервере (закон 81-8).
 */
export function fillFromSource(template: string, sourceValue: string): string {
  return template.replace(/\{source\}/g, encodeURIComponent(sourceValue))
}
