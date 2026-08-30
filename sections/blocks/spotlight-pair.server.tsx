import type { SectionRenderer } from '@/sections/contract'
import { H4, P } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// ПАРА С ПОДВИЖНОЙ ПОДСВЕТКОЙ — ПЕРЕНОС ИЗ `double-presentation.tsx` ВИТРИНЫ
// (шаг 57, 2026-08-30). Две карточки рядом: активная занимает 7/10 ширины,
// соседняя 3/10, под заголовком идёт полоса отсчёта, и через девять секунд
// внимание переходит на соседку.
//
// 🔒 ЭТО ВТОРОЙ ЗАХОД В ТОТ ЖЕ ФАЙЛ ВИТРИНЫ, И ГРАНИЦА МЕЖДУ ВИДАМИ ПРОХОДИТ ПО
// ПОВЕДЕНИЮ, А НЕ ПО РИСУНКУ. Шаг 52 взял оттуда `splitPair` — статику пары:
// две равные половины с картинкой, заголовком и абзацем. Здесь взято то, чего
// `splitPair` взять не мог: подсветка ходит между половинами и в каждый момент
// говорит, на какую смотреть. Отсюда и разные типы каталога: `splitPair` —
// «продукт в действии», этот вид — «сравнение».
//
// 🔒 ДВИЖЕНИЕ ОСТАНАВЛИВАЕТСЯ НАЖАТИЕМ. Владелец сказал это законом ещё в шаге 52:
// движение, которое нельзя остановить, отнимает право дочитать. В источнике
// остановки нет вовсе — там таймер и только. Здесь каждая карточка сама себе
// ярлык переключателя: выбрал — подсветка замерла на выбранной и больше не
// уходит.
//
// 🔒 НИ ОДНОЙ СТРОКИ СКРИПТА, И ЭТО НЕ АСКЕЗА, А СВОЙСТВО ФОРМЫ. Источник держит
// состояние на `useState` и двух таймерах; то же движение умеет CSS-анимация, а
// выбор — радиокнопка. Обе карточки целиком лежат в серверной разметке: человек
// без JavaScript получает секцию полностью, и поисковик читает оба текста, а не
// один активный.
//
// 🔒 КАРТИНКА НЕОБЯЗАТЕЛЬНА, И БЕЗ НЕЁ РИСУЕТСЯ ЗАГЛУШКА, А НЕ ПУСТОТА — тот же
// закон, что у `splitPair`: исчезнув, изображение роняет соседнюю половину вверх,
// и пара перестаёт быть парой.
const Half = ({
  half,
  k,
  htmlFor,
}: {
  half: { image?: string; alt?: string; title: string; text: string }
  k: string
  htmlFor: string
}) => (
  <label
    htmlFor={htmlFor}
    className="sp-card flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card"
  >
    {half.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={half.image} alt={half.alt ?? ''} className="aspect-video w-full object-cover" />
    ) : (
      <div
        data-image-placeholder
        className="flex aspect-video w-full items-center justify-center border-b border-border bg-muted/40"
      >
        <span className="text-[length:var(--fs-small)] text-muted-foreground">{half.alt ?? 'image'}</span>
      </div>
    )}
    <div className="flex flex-col p-4">
      <H4 className="truncate">{inline(half.title, `${k}-t`)}</H4>
      {/* Полоса отсчёта живёт на месте черты под заголовком: пока она едет, эта
          половина главная. Черта остаётся видимой и когда полоса пуста, иначе
          заголовок повисает над абзацем без опоры. */}
      <div className="sp-rule relative mt-2 mb-3 h-px w-full bg-border">
        <span className="sp-bar absolute left-0 top-0 h-full bg-primary" />
      </div>
      <P className="text-muted-foreground">{inline(half.text, `${k}-x`)}</P>
    </div>
  </label>
)

export const spotlightPair: SectionRenderer<'spotlightPair'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-6">
    {b.title && (
      <SectionHead
        id={`${k}-t`}
        badge={b.badge}
        title={b.title}
        note={b.note ? inline(b.note, `${k}-n`) : undefined}
      />
    )}
    <div data-spotlight-pair className="relative">
      {/* Переключатели идут ПЕРЕД содержимым: правило `:checked ~ .sp-body`
          смотрит только вперёд по разметке. Тот же приём у `problemSolution`,
          `carousel` и `priceTable`. */}
      <input type="radio" name={`${k}-sp`} id={`${k}-sp-1`} className="sp-r sr-only" />
      <input type="radio" name={`${k}-sp`} id={`${k}-sp-2`} className="sp-r sr-only" />
      <div className="sp-body flex flex-col gap-4 md:flex-row">
        <Half half={b.left} k={`${k}-l`} htmlFor={`${k}-sp-1`} />
        <Half half={b.right} k={`${k}-r`} htmlFor={`${k}-sp-2`} />
      </div>
    </div>
  </section>
)
