import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { H2, Lead, P } from '@/components/ui/typography'

// Раздел карточками: заголовок, подзаголовок и равные ячейки без порядка.
//
// 🔒 ТА ЖЕ ПОЛОСА, ЧТО У `flow`, НО БЕЗ НОМЕРОВ, СВЯЗИ И АНИМАЦИИ — и это не
// упрощение, а другой смысл. Там очерёдность есть и она содержательна: первый
// шаг предшествует второму. Здесь очерёдности нет — три утверждения об одном
// предмете, любое читается первым. Зажигать их «по очереди» значило бы показать
// последовательность, которой не существует; неправда, рассказанная красивой
// анимацией, убедительнее обычной.
//
// Отсюда `<ul>` вместо `<ol>`: разметка обязана говорить то же, что вид.
//
// 🔒 РАВНАЯ ВЫСОТА — СЕТКОЙ, А НЕ ИЗМЕРЕНИЕМ. Строка сетки высотой с самый
// высокий элемент, `<li>` растягивается сам, а `flex-1` заставляет карточку
// занять остаток. Разбор целиком — в `flow.server.tsx`: считать высоту скриптом
// значило бы завести клиентский островок ради того, что браузер делает сам.
//
// 🔒 ЗАГОЛОВОК — ВАРИАНТ `content` ПО УМОЛЧАНИЮ. Главная и любая контентная
// страница — витрина; `ui` в этом слое остаётся только у `panel`, где заголовок
// является подписью к рамке, а не именем раздела.
export const cards: SectionRenderer<'cards'> = (b, { key: k }) => (
  <section key={k} aria-labelledby={`${k}-t`} className="my-10">
    <div className="text-center">
      <H2 id={`${k}-t`}>{b.title}</H2>
      {b.note && <Lead className="mx-auto mt-3 max-w-2xl">{inline(b.note, `${k}-n`)}</Lead>}
    </div>

    <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-3">
      {b.items.map((text, i) => (
        <li key={`${k}-${i}`} className="flex">
          <div className="w-full flex-1 rounded-2xl border border-border p-5">
            <P>{inline(text, `${k}-${i}-b`)}</P>
          </div>
        </li>
      ))}
    </ul>
  </section>
)
