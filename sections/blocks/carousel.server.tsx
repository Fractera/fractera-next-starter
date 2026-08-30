import type { SectionRenderer } from '@/sections/contract'
import { H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// КАРУСЕЛЬ: СЛАЙДЫ, КОТОРЫЕ ЛИСТАЕТ ЧЕЛОВЕК (шаг 52, форма перенесена с витрины).
//
// 🔒 БЕЗ АВТОПЕРЕХОДА, И ЭТО ОСОЗНАННОЕ ОТЛИЧИЕ ОТ ИСТОЧНИКА. На витрине слайды
// листаются сами; здесь — нет. Движение, которое нельзя остановить, отнимает у
// человека право дочитать: он возвращается к слайду, а тот уже сменился. Читателю
// с укачиванием оно ещё и физически неприятно, и `prefers-reduced-motion` от
// автоперехода не спасает — он про анимацию, а не про смену содержимого.
//
// 🔒 ЛИСТАНИЕ — ПЕРЕКЛЮЧАТЕЛЬ И ПРАВИЛО CSS, А НЕ ОСТРОВОК. Канон проекта: сначала
// спросить, нужен ли островок вообще. Показать один из нескольких блоков умеет
// чистый CSS — тот же приём, что у вида `problemSolution`, — и тогда карусель
// работает при выключенном JavaScript, а не «терпимо».
//
// 🔒 ВСЕ СЛАЙДЫ ЛЕЖАТ В РАЗМЕТКЕ, И ЭТО ГЛАВНОЕ. Карусель, подгружающая слайды
// скриптом, для поисковика содержит один слайд из десяти: остальные девять он не
// ждёт. Здесь видно всё — скрыты они только визуально.
export const carousel: SectionRenderer<'carousel'> = (b, { key: k }) => {
  const name = `${k}-slide`
  return (
    <section key={k} className="mt-8 flex flex-col gap-4">
      {b.title && (
        <SectionHead id={`${k}-t`} title={b.title} note={b.note ? inline(b.note, `${k}-n`) : undefined} />
      )}

      <div data-carousel className="cr-root flex flex-col gap-3">
        {/* Переключатели стоят ПЕРЕД содержимым: правило `:checked ~` видит
            только последующих соседей. Поставь их после — класс написан, эффекта
            нет, и отказ будет молчаливым. */}
        {b.slides.map((_, i) => (
          <input
            key={`${k}-r-${i}`}
            className="cr-r sr-only"
            type="radio"
            name={name}
            id={`${name}-${i}`}
            defaultChecked={i === 0}
          />
        ))}

        <div className="cr-body overflow-hidden rounded-xl border border-border bg-card">
          {b.slides.map((s, i) => (
            <figure key={`${k}-s-${i}`} className="cr-slide" data-slide={i}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.alt ?? ''} className="aspect-video w-full object-cover" />
              ) : (
                <div
                  data-image-placeholder
                  className="flex aspect-video w-full items-center justify-center border-b border-border bg-muted/40"
                >
                  <span className="text-[length:var(--fs-small)] text-muted-foreground">
                    {s.alt ?? 'image'}
                  </span>
                </div>
              )}
              <figcaption className="p-4">
                <H4>{inline(s.title, `${k}-s-${i}-t`)}</H4>
                {s.text && <P className="mt-1 text-muted-foreground">{inline(s.text, `${k}-s-${i}-x`)}</P>}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Точки-ярлыки. Подпись у каждой — номер слайда: экранный диктор иначе
            прочитает ряд одинаковых «кнопка», и человек не поймёт, куда он идёт. */}
        <div className="cr-dots flex justify-center gap-2">
          {b.slides.map((s, i) => (
            <label
              key={`${k}-d-${i}`}
              htmlFor={`${name}-${i}`}
              aria-label={s.title}
              className="cr-dot h-2.5 w-2.5 cursor-pointer rounded-full border border-border bg-muted transition-colors hover:bg-muted-foreground/40"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
