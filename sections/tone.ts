import type { Tone } from '@/lib/content/blocks/types'

// КАРТА «СМЫСЛОВАЯ ГРУППА → КЛАССЫ» — ОДНА НА СЛОЙ СЕКЦИЙ.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ ФАЙЛ. Карту читают уже два вида: ряд возможностей
// (`badges`) и ряд отменённых счетов (`noBill`). Скопируй её во второй — и она
// разойдётся с первой на первой же правке цвета, причём молча: обе половины
// собираются, обе выглядят правдоподобно, и «данные» на одной полосе станут
// другого цвета, чем «данные» на соседней.
//
// 🔒 ЛЕЖИТ В КОРНЕ `sections/`, А НЕ В `sections/blocks/`. В `blocks/` живут
// РЕНДЕРЕРЫ, по файлу на вид, и сторож `check:sections` считает их именно там:
// файл-не-рендерер рядом с ними сбил бы счёт «видов столько же, сколько
// рендереров» — проверку, которая ловит забытый вид.
//
// 🔒 ТОКЕНЫ ТЕМЫ, А НЕ ЦВЕТА ПАЛИТРЫ. `bg-emerald-500/15` одинаков в обеих темах
// по определению, то есть подобран под одну и сломан в другой. `--tone-*`
// объявлен в теме проекта дважды — для светлой и для тёмной.
export const TONE_CLASS: Record<Tone, string> = {
  data: 'bg-tone-data/15 text-tone-data',
  reach: 'bg-tone-reach/15 text-tone-reach',
  access: 'bg-tone-access/15 text-tone-access',
  code: 'bg-tone-code/15 text-tone-code',
  muted: 'bg-muted text-muted-foreground',
}

/** Классы ярлыка целиком: форма и размер общие, цвет — от смысловой группы. */
export function badgeClass(tone: Tone): string {
  return `rounded-full px-3 py-1 text-[length:var(--fs-eyebrow)] font-medium ${TONE_CLASS[tone]}`
}
