import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { H2, Lead, Metric, Small } from '@/components/ui/typography'

// Счета, которых не будет: чужое имя, перечёркнутое, и фраза при нём.
//
// 🔒 ЗАЧЕРКНУТО ИМЕННО ИМЯ, А НЕ ФРАЗА ЦЕЛИКОМ. Перечёркнутая строка «вы не
// платите Vercel» читается как отменённое утверждение — то есть ровно наоборот
// задуманному. Отменён здесь СЧЁТ, и знаком отмены помечено то, за что его
// выставляют: имя поставщика.
//
// 🔒 ВЫВОД СТОИТ ПОСЛЕ ПЕРЕЧНЯ, И ЭТО ПОРЯДОК ДОВОДА, А НЕ НЕБРЕЖНОСТЬ. Три
// зачёркнутых имени — доказательства; фраза «вы никому не платите» — то, что из
// них следует. Поставь её сверху — и читатель получит вывод раньше основания,
// то есть просьбу поверить на слово.
//
// 🔒 ИМЯ ПОСТАВЩИКА НЕ ПЕРЕВОДИТСЯ НИКОГДА. Оно приходит отдельным полем
// (`vendor`) именно затем: переводчику видно, что трогать здесь нечего, а
// рендереру видно, какое слово зачёркивать.
//
// 🔒 ЗАГОЛОВОК И РАЗМЕРЫ — ИЗ ПРИМИТИВА (исправлено 2026-08-16). Здесь стояли
// `variant="ui"` у заголовка и `text-2xl md:text-3xl` у имени поставщика.
// Первое — вариант рабочих экранов на странице-витрине; второе — размер вне
// шкалы `--type-scale`. Разбор обоих — в `flow.server.tsx` и в `typography.tsx`.
//
// Имя поставщика намеренно того же размера, что число в ряду мер: обе полосы —
// «одна строка, три ячейки», и стоят они на противоположных концах страницы.
// Одинаковый знак связывает их в пару, а не делает похожими случайно.
export const noBill: SectionRenderer<'noBill'> = (b, { key: k }) => (
  <section
    key={k}
    aria-labelledby={`${k}-t`}
    className="my-10 overflow-hidden rounded-2xl border border-border"
  >
    <ul className="grid list-none divide-y divide-border p-0 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {b.items.map((item, i) => (
        <li key={`${k}-${i}`} className="flex flex-col items-center gap-1.5 px-5 py-7 text-center">
          <Small>{item.text}</Small>
          {/* Толщина черты задана явно: тонкая линия по крупному слову на
              телефоне пропадает вовсе, и знак отмены перестаёт читаться. */}
          <Metric className="text-muted-foreground line-through decoration-2">{item.vendor}</Metric>
        </li>
      ))}
    </ul>

    <div className="border-t border-border bg-muted/40 px-6 py-8 text-center">
      <H2 id={`${k}-t`}>{b.title}</H2>
      <Lead className="mx-auto mt-3 max-w-2xl">{inline(b.text, `${k}-b`)}</Lead>
    </div>
  </section>
)
