// КОНТРАСТ ЦВЕТОВОЙ ПАРЫ — расчёт, перенесённый из панели дословно (шаг 42).
//
// 🔒 СЧИТАЕТСЯ В МОМЕНТ ВЫБОРА, А НЕ ПРОВЕРЯЕТСЯ ПОТОМ. У проекта есть сторож
// палитры (`npm run check:contrast`), но он смотрит ФАЙЛ ТЕМЫ на сборке — а
// выбор владельца живёт в настройках и до сборки не доходит вовсе. Экран выбора
// — единственное место, где нечитаемое сочетание можно поймать до того, как его
// увидит посетитель.
//
// 🔒 ПОРОГИ — СТАНДАРТ ДОСТУПНОСТИ, А НЕ ВКУС: 4.5:1 обычный текст, 3:1 крупный.
// Числа названы здесь, чтобы разметка их не выдумывала заново.

/** Относительная яркость по стандарту. `null` — цвет не в форме `#rgb`/`#rrggbb`. */
export function luminance(hex: string): number | null {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map(c => c + c).join("") : m[1]
  const chan = [0, 2, 4].map(i => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2]
}

/** Отношение контраста: от 1 до 21. */
export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a)
  const lb = luminance(b)
  if (la === null || lb === null) return null
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastVerdict = "ok" | "low" | "bad"

export function verdictOf(ratio: number): ContrastVerdict {
  return ratio >= 4.5 ? "ok" : ratio >= 3 ? "low" : "bad"
}

/**
 * Чёрным или белым писать поверх цвета.
 *
 * 🔒 ТОТ ЖЕ ПОРОГ, ЧТО В ПРИЛОЖЕНИИ (`lib/design-css.ts`). Предпросмотр,
 * считающий иначе, показывал бы кнопку, которой не будет.
 */
export function onColor(hex: string): string {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return "#ffffff"
  const h = m[1].length === 3 ? m[1].split("").map(c => c + c).join("") : m[1]
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6 ? "#252525" : "#fbfbfb"
}
