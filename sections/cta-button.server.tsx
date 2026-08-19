import type { ReactNode } from 'react'
import { linkAttrs, resolveRootHref } from '@/lib/content/blocks/links'

// ГЛАВНОЕ ДЕЙСТВИЕ СТРАНИЦЫ — ОДНА КНОПКА НА ВСЕ МЕСТА, ГДЕ ОНО ПРЕДЛАГАЕТСЯ.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ ФАЙЛ. Призыв стоит теперь дважды: на первом экране и там,
// где раньше сидела кнопка Quiz. Скопировать классы во второе место значит
// завести две кнопки, которые совпадают ровно до первой правки цвета, — тот же
// разбор, что у шапки страницы и у оболочки.
//
// 🔒 ЗАКОН ССЫЛОК ОБЩИЙ (`lib/content/blocks/links.ts`). Внешний адрес получает
// новую вкладку и `rel`, внутренний на корень — учёт одноязычного режима, где
// языкового сегмента в адресах нет. Кнопка не имеет права решать это по-своему.
//
// 🔒 ТЕКСТ НА ЗАЛИВКЕ — `text-primary-foreground`, А НЕ `text-foreground`. Цвет
// обычного текста страницы тёмный, и на тёмной заливке кнопки он сливается с
// ней. Переменные ходят парой: фон `primary` и текст на нём `primary-foreground`
// — единственная запись, читаемая в обеих темах. Значок наследует цвет текста.
export function CtaButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={resolveRootHref(href)}
      {...linkAttrs(href)}
      className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  )
}
