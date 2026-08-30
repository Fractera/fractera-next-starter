import type { SectionRenderer } from '@/sections/contract'
import { H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// СЕТКА ПЛОЩАДОК — ПЕРЕНОС ИЗ `platforms-grid.tsx` ВИТРИНЫ (2026-08-30, последний
// источник партии по слову владельца: «final from FES … platforms-grid.tsx for
// type benefits»).
//
// 🔒 ГЛАВНОЕ В ФОРМЕ — ШОВ, А НЕ КАРТОЧКА. Ячейки лежат вплотную, промежуток
// между ними ровно два пикселя, и в этот промежуток светит подложка: у сетки
// радиальная заливка от центра, а сами ячейки непрозрачны. Получается решётка,
// которая ярче в середине и гаснет к краям. Ни рамок, ни теней — свечение идёт
// ИЗ ЩЕЛЕЙ.
//
// 🔒 ЧИСЛО ЯЧЕЕК КРАТНО ШЕСТИ. Колонок две на телефоне и три на мониторе, и
// только кратное шести заполняет обе раскладки без обрубка. Пять ячеек оставят
// дыру в одной из двух, и увидит её тот, кто смотрит с другого устройства, — то
// есть не автор. Тот же закон уже оплачен дважды у `cards` и `metrics`.
//
// 🔒 ПОДСВЕТКА ЯЧЕЙКИ СМОТРИТ В ЦЕНТР СЕТКИ ПО ОБЕИМ ОСЯМ. Владелец перечислил
// все шесть направлений образца 2026-08-30: верх слева — правый нижний угол,
// верх центр — понизу, верх справа — левый нижний угол, низ слева — правый
// верхний угол, низ центр — поверху, низ справа — левый верхний угол.
//
// ✗ ОПЛАЧЕНО ТЕМ ЖЕ ДНЁМ: сначала я перенёс только горизонтальную составляющую,
// а вертикальную отбросил — «число строк разметке неизвестно». Число строк и
// правда неизвестно, но первая строка это `nth-child(-n+N)`, последняя —
// `nth-last-child(-n+N)`, и этого достаточно. Направления живут в
// `styles/globals.css`, ячейка не знает своего номера.
export const platformGrid: SectionRenderer<'platformGrid'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-6">
    <SectionHead
      id={`${k}-t`}
      badge={b.badge}
      title={b.title}
      note={b.note ? inline(b.note, `${k}-n`) : undefined}
    />

    <div data-platform-grid className="pg-grid grid grid-cols-2 gap-[2px] md:grid-cols-3">
      {b.cards.map((card, i) => (
        <div key={`${k}-c-${i}`} className="pg-cell relative flex size-full flex-col justify-between bg-background p-6 sm:p-8">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <H4>{inline(card.title, `${k}-c-${i}-t`)}</H4>
              <Small className="mt-2 block text-muted-foreground">{inline(card.subtitle, `${k}-c-${i}-s`)}</Small>
            </div>
            {card.company && (
              <Small className="mt-4 block text-muted-foreground/70">{card.company}</Small>
            )}
          </div>
          {/* Подсветка — отдельный слой поверх ячейки: она не должна перехватывать
              нажатия и не должна читаться вслух. */}
          <span aria-hidden className="pg-glow pointer-events-none absolute inset-px opacity-0 transition-opacity duration-300" />
        </div>
      ))}
    </div>

    {/* Оговорка мелким шрифтом под сеткой: в источнике здесь названы чужие
        торговые марки и сказано, чьи они. Строка обязательна, когда
        сетка перечисляет чужие продукты. */}
    {b.disclaimer && (
      <P className="text-[length:var(--fs-small)] text-muted-foreground">{inline(b.disclaimer, `${k}-d`)}</P>
    )}
  </section>
)
