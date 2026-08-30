import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'
import { ShowcaseCarousel } from './showcase-carousel.client'

// ВИТРИННАЯ КАРУСЕЛЬ — ПЕРЕНОС ФОРМЫ ИЗ `loop-showcase.tsx` (шаг 53, 2026-08-30).
//
// 🔒 СЕРВЕРНАЯ ОБОЛОЧКА, КЛИЕНТСКАЯ НАЧИНКА — ЗАКОН СЛОЯ. Ни один файл под
// `sections/` не бывает клиентским; движение живёт в островке рядом
// (`showcase-carousel.client.tsx`), а сюда приходит уже готовым.
//
// 🔒 СКРЫТЫЙ БЛОК СО ВСЕМИ СЛАЙДАМИ — ЧАСТЬ ФОРМЫ, А НЕ ДОБАВКА ОТ СЕБЯ. В
// источнике он стоит внизу с оговоркой: карусель раскрывает слайды по одному
// через скрипт, и без такого блока робот прочитал бы один слайд из десяти.
// Здесь он ещё нужнее: островок рисуется только после гидратации, и до неё
// страница без этого блока пуста в том месте, где стоит карусель.
//
// 🔒 ЗАГОЛОВКИ ВНУТРИ СКРЫТОГО БЛОКА — НЕ `<h*>`, А ЖИРНЫЙ ТЕКСТ. Иначе десять
// слайдов принесли бы на страницу десять заголовков, и оглавление, собранное из
// них, стало бы вдвое длиннее самого документа. Приём взят из источника дословно.
export const showcaseCarousel: SectionRenderer<'showcaseCarousel'> = (b, { key: k, ui }) => (
  <section key={k} className="mt-8 flex w-full flex-col items-center gap-4">
    {b.title && (
      <SectionHead
        id={`${k}-t`}
        badge={b.badge}
        title={b.title}
        note={b.note ? inline(b.note, `${k}-n`) : undefined}
      />
    )}

    <ShowcaseCarousel slides={b.slides} placeholderNote={ui.carouselPlaceholder} />

    <div className="sr-only">
      {b.slides.map((s, i) => (
        <div key={`${k}-seo-${i}`}>
          <p>
            <strong>{s.title}</strong> — {s.label}, {s.sublabel}
          </p>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  </section>
)
