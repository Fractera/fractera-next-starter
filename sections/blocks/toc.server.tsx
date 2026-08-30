import type { SectionRenderer } from '@/sections/contract'
import { getPageUi } from '@/lib/content/page-ui'

// ОГЛАВЛЕНИЕ СТРАНИЦЫ.
//
// 🔒 РИСУНОК ПЕРЕНЕСЁН ИЗ ФАБРИКИ БЕЗ ЕДИНОГО ИЗМЕНЕНИЯ (шаг 542) — то же
// условие приёмки, что у `faq`: задача свести два источника разметки в один, а
// не перерисовать семь живых страниц заодно.
//
// 🔒 ЗАГОЛОВКИ ПРИХОДЯТ ГОТОВЫМИ, И СЧИТАЕТ ИХ ФАБРИКА. Секция не видит соседей
// по странице — договор даёт ей её собственный блок и ничего больше, — и это
// правильно: вид, читающий чужие блоки, перестал бы быть переносимым между
// поверхностями. Владелец решил 2026-08-22 оставить оглавление автоматическим,
// поэтому список строит тот, кто держит страницу целиком.
//
// 🔒 НОМЕР — ЗНАК, А НЕ ТЕКСТ: `aria-hidden` снимает его с чтения с экрана,
// потому что «01» перед названием раздела там ничего не сообщает, а мешает.
// Глазами его читают все, поэтому контраст поднят до полного `muted-foreground`
// (проверка доступности 2026-08-13): при `/70` отношение падало ниже порога.
//
// 🔒 ДОЛГ, НАЗВАННЫЙ ВСЛУХ: `aria-label="Contents"` — по-английски во всех
// языках. Он перенесён дословно вместе с остальной разметкой, чтобы переезд
// остался переездом; чинится отдельно, вместе с остальными подписями механизма.
export const toc: SectionRenderer<'toc'> = (b, ctx) => {
  if (b.items.length === 0) return null
  const ui = getPageUi(ctx.lang)
  return (
    <nav key={ctx.key} aria-label="Contents" className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        {ui.tocHeading} · {b.items.reduce((n, i) => n + 1 + (i.children?.length ?? 0), 0)}
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {b.items.map((item, i) => (
          <li key={item.id} className="flex flex-col gap-2 text-[15px] leading-snug">
            <span className="flex gap-3">
              <span aria-hidden className="select-none font-mono text-sm text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <a href={`#${item.id}`} className="text-muted-foreground transition-colors hover:text-primary">
                {item.text}
              </a>
            </span>
            {/* Второй уровень: подразделы своего раздела. Номера им не даются —
                нумерация «01.03» превращает карту в оглавление книги, а отступа
                и точки достаточно, чтобы уровень читался. */}
            {item.children && item.children.length > 0 && (
              <ul className="ml-9 flex flex-col gap-1.5">
                {item.children.map(sub => (
                  <li key={sub.id} className="flex gap-2 text-sm leading-snug">
                    <span aria-hidden className="select-none text-muted-foreground">·</span>
                    <a href={`#${sub.id}`} className="text-muted-foreground transition-colors hover:text-primary">
                      {sub.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
