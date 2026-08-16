import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

const COLS: Record<2 | 3, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
}

// Раздел карточками: шапка раздела и равные ячейки без порядка.
//
// 🔒 ТА ЖЕ ПОЛОСА, ЧТО У `flow`, НО БЕЗ НОМЕРОВ, СВЯЗИ И АНИМАЦИИ — и это другой
// смысл, а не упрощение. Там очерёдность содержательна: первый шаг предшествует
// второму. Здесь её нет — утверждения об одном предмете, любое читается первым.
// Зажигать их «по очереди» значило бы показать последовательность, которой не
// существует.
//
// Отсюда `<ul>` вместо `<ol>`: разметка обязана говорить то же, что вид.
//
// 🔒 ШАПКА РАЗДЕЛА — ОБЩИЙ ПРИМИТИВ (`SectionHead`), не своя разметка. Ярлык,
// заголовок и подзаголовок одинаковы у трёх видов; пока форма жила в каждом
// отдельно, «один стандарт» держался на моей памяти и трижды за день
// расходился.
//
// 🔒 РАВНАЯ ВЫСОТА — СЕТКОЙ, А НЕ ИЗМЕРЕНИЕМ. Строка сетки высотой с самый
// высокий элемент, `<li>` растягивается сам, `flex-1` заставляет ячейку занять
// остаток. Разбор целиком — в `flow.server.tsx`.
export const cards: SectionRenderer<'cards'> = (b, ctx) => {
  const k = ctx.key
  return (
    <section key={k} aria-labelledby={`${k}-t`} className="my-10">
      <SectionHead
        id={`${k}-t`}
        badge={b.badge}
        title={b.title}
        note={b.note ? inline(b.note, `${k}-n`) : undefined}
      />

      <ul className={`mt-8 grid list-none gap-6 p-0 ${COLS[b.cols ?? 3]}`}>
        {b.children.map((child, i) => (
          <li key={`${k}-${i}`} className="flex">
            {ctx.renderBlocks([child], ctx.lang, ctx.ui, `${k}-${i}`)}
          </li>
        ))}
      </ul>
    </section>
  )
}
