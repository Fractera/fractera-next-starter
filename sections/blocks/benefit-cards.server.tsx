import type { SectionRenderer } from '@/sections/contract'
import { H4, P } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// КАРТОЧКИ ВОЗМОЖНОСТЕЙ СО ССЫЛКОЙ (шаг 52, форма перенесена с витрины).
//
// 🔒 ЧЕМ ОТЛИЧАЕТСЯ ОТ `cards`, РАЗ ТОТ ТОЖЕ РИСУЕТ РЯД ЯЧЕЕК. У `cards` ячейка
// держит ЛЮБЫЕ блоки — это контейнер, и порядок внутри выбирает автор. Здесь
// порядок фиксирован: заголовок · черта · текст · ссылка, — и ссылка прижата к
// низу. В ряду из трёх карточек с текстом разной длины это единственный способ
// поставить все ссылки на одну линию; собранная из контейнеров, такая карточка
// выравнивается только случайно.
//
// 🔒 ССЫЛКА ЗДЕСЬ НЕ `cta`, И ЭТО НЕ ОБХОД ЗАКОНА. У вида `cta` кнопка стоит по
// центру — решение владельца, оплаченное тем, что прижатая влево кнопка читается
// как продолжение абзаца. Внутри карточки центр неуместен: там кнопки нет вовсе,
// есть текстовая ссылка в углу, и она принадлежит своей ячейке, а не разделу.
export const benefitCards: SectionRenderer<'benefitCards'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-4">
    {/* Шапка — общий примитив, а не своя разметка: ярлык, заголовок и
        подзаголовок обязаны выглядеть одинаково у всех разделов страницы.
        Заголовок необязателен: ряд карточек бывает и продолжением соседнего
        раздела, у которого шапка уже есть. */}
    {b.title && (
      <SectionHead id={`${k}-t`} title={b.title} note={b.note ? inline(b.note, `${k}-n`) : undefined} />
    )}
    <div
      className={`grid gap-4 sm:grid-cols-2 ${b.cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}
      data-benefit-cards
    >
      {b.items.map((item, i) => (
        <div
          key={`${k}-i-${i}`}
          // `h-full` и `justify-between` вместе — то, ради чего вид существует:
          // ячейки одной высоты, ссылки на одной линии.
          className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4"
        >
          <div>
            <H4>{inline(item.title, `${k}-i-${i}-t`)}</H4>
            {/* Черта под заголовком — не украшение: она отделяет имя возможности
                от её объяснения, и в ряду карточек взгляд цепляется за неё, а не
                за первую строку текста. */}
            <div className="my-2 h-px w-10 bg-primary" />
            <P className="text-muted-foreground">{inline(item.text, `${k}-i-${i}-x`)}</P>
          </div>
          {item.href && (
            <a
              href={item.href}
              className="mt-3 inline-block text-[length:var(--fs-small)] text-primary hover:underline"
            >
              {item.linkLabel ?? item.title}
            </a>
          )}
        </div>
      ))}
    </div>
  </section>
)
