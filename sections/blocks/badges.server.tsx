import type { SectionRenderer } from '@/sections/contract'
import { badgeClass } from '@/sections/tone'

// Ряд ярлыков возможностей.
//
// 🔒 ЦВЕТ ЗДЕСЬ РАБОТАЕТ, А НЕ УКРАШАЕТ: одиннадцать слов делятся на четыре
// группы, которые глаз читает без чтения — данные, охват, доступ, код.
//
// 🔒 КАРТА ЦВЕТОВ ПЕРЕЕХАЛА В `sections/tone.ts` (2026-08-16). Она стояла здесь,
// а второй вид (`noBill`) начал показывать ярлыки под зачёркнутыми именами —
// значит копия карты разошлась бы с оригиналом на первой же правке, и «данные»
// на одной полосе стали бы другого цвета, чем «данные» на соседней. Размер
// ярлыка там же и взят из шкалы (`--fs-eyebrow`), а не из лестницы Tailwind:
// иначе он не двинется, когда владелец меняет `--type-scale` в панели.
export const badges: SectionRenderer<'badges'> = (b, { key: k }) => (
  <div key={k} className="mt-8 flex flex-wrap justify-center gap-2">
    {b.items.map((item, i) => (
      <span key={`${k}-${i}`} className={badgeClass(item.tone)}>
        {item.label}
      </span>
    ))}
  </div>
)
