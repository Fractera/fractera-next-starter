import type { CSSProperties } from 'react'
import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { H2, H3 } from '@/components/ui/typography'

// «Как это работает»: шаги, которые зажигаются по очереди, и свет, бегущий по
// связи между ними.
//
// 🔒 ДВИЖЕНИЕ — ЧИСТЫЙ CSS, НИ ОДНОЙ СТРОКИ СКРИПТА. Тот же закон, что у ленты
// языков: страница обязана работать с выключенным JavaScript — и здесь она
// работает не «терпимо», а полностью, потому что зажигать шаги умеет сам
// браузер. Клиентский островок дал бы ровно обратное: три абзаца текста уехали
// бы в браузер ради подсветки рамки, и с выключенным скриптом секция осталась бы
// пустой. Анимации нет только там, где её запретили (`prefers-reduced-motion`),
// и тогда секция стоит в покойном виде — законченная, а не застрявшая.
//
// 🔒 НАДПИСЬ НИКОГДА НЕ ГАСНЕТ, И ЭТО НЕ ПРИДИРКА. Первым замыслом было увести
// невыбранные шаги в прозрачность — так «надписи появляются» выглядит нагляднее
// всего. Но текст, погашенный прозрачностью, проваливается ниже порога контраста
// (ровно это ловит `check:contrast`), а человек, пришедший читать второй шаг,
// обязан ждать своей очереди у карусели. Поэтому гаснет и разгорается ОПРАВА —
// рамка, свечение, кружок с номером, — а слова стоят в полную силу всегда.
//
// 🔒 ОСТАНОВКА ПРИ `prefers-reduced-motion` — требование доступности: у части
// людей постоянное движение вызывает тошноту и мигрень. Правило живёт рядом с
// самой анимацией, в `styles/globals.css`.
//
// 🔒 ОЧЕРЕДЬ ЗАДАНА ОДНИМ ЧИСЛОМ `--flow-i`, а не тремя классами задержки.
// Шагов может стать четыре — при классах пришлось бы дописывать четвёртый и
// вспоминать, где он объявлен; здесь длина цикла считается из числа шагов
// (`--flow-n`), и добавленный шаг встаёт в очередь сам.
export const flow: SectionRenderer<'flow'> = (b, { key: k }) => (
  <section key={k} aria-labelledby={`${k}-t`} className="my-10">
    <div className="text-center">
      <H2 id={`${k}-t`} variant="ui">{b.title}</H2>
      {b.note && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {inline(b.note, `${k}-n`)}
        </p>
      )}
    </div>

    {/* Порядок шагов — содержание, а не оформление: список нумерованный, и
        читалка с экрана произносит «1 из 3» без нашей помощи. Цифра в кружке —
        то же самое ещё раз, для глаза, поэтому она скрыта от озвучивания. */}
    <ol
      className="flow relative mt-8 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-6"
      style={{ '--flow-n': b.steps.length } as CSSProperties}
    >
      {b.steps.map((s, i) => (
        <li
          key={`${k}-${i}`}
          className="flow-step relative flex flex-col items-center gap-4 text-center"
          style={{ '--flow-i': i } as CSSProperties}
        >
          <span aria-hidden className="flow-node relative z-10 flex size-14 items-center justify-center rounded-full border text-lg font-semibold">
            {i + 1}
          </span>
          <div className="flow-card w-full rounded-2xl border p-5">
            <H3 variant="ui">{s.title}</H3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {inline(s.text, `${k}-${i}-b`)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </section>
)
