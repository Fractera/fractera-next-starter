import type { SectionRenderer } from '@/sections/contract'

// Ряд ярлыков возможностей.
//
// 🔒 ЦВЕТ ЗДЕСЬ РАБОТАЕТ, А НЕ УКРАШАЕТ: одиннадцать слов делятся на четыре
// группы, которые глаз читает без чтения — данные, охват, доступ, код.
//
// 🔒 ТОНА — ТОКЕНЫ ТЕМЫ, А НЕ ЦВЕТА ПАЛИТРЫ TAILWIND (шаг 508). Раньше здесь
// стояли `bg-emerald-500/15`, `bg-sky-500/15` и подобные: одинаковые в обеих
// темах по определению, то есть подобранные под одну и сломанные в другой.
// Токен `--tone-*` объявлен в теме проекта дважды — для светлой и тёмной, —
// поэтому смысл группы сохраняется, а читаемость перестаёт зависеть от того,
// какую тему выбрал посетитель.
const TONE: Record<string, string> = {
  data: 'bg-tone-data/15 text-tone-data',
  reach: 'bg-tone-reach/15 text-tone-reach',
  access: 'bg-tone-access/15 text-tone-access',
  code: 'bg-tone-code/15 text-tone-code',
  muted: 'bg-muted text-muted-foreground',
}

export const badges: SectionRenderer<'badges'> = (b, { key: k }) => (
  <div key={k} className="mt-8 flex flex-wrap justify-center gap-2">
    {b.items.map((item, i) => (
      <span
        key={`${k}-${i}`}
        className={`rounded-full px-3 py-1 text-xs font-medium ${TONE[item.tone] ?? TONE.muted}`}
      >
        {item.label}
      </span>
    ))}
  </div>
)
