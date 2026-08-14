import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { linkAttrs, resolveRootHref } from '@/lib/content/blocks/links'

// Призыв к действию.
export const cta: SectionRenderer<'cta'> = (b, { key: k }) => (
  <div key={k} className="my-4 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/[0.06] p-6">
    <p className="text-base font-medium text-foreground">{inline(b.text, k)}</p>
    <a
      // Кнопка подчиняется тому же закону ссылок, что и текст (`./links.ts`):
      // внешняя открывается в новой вкладке и получает `rel`, внутренняя на
      // корень — учитывает одноязычный режим, где языкового сегмента нет.
      href={resolveRootHref(b.href)}
      {...linkAttrs(b.href)}
      // 🔒 ТЕКСТ НА ЗАЛИВКЕ — `text-primary-foreground`, А НЕ `text-foreground`
      // (2026-08-12). Здесь стояло `text-foreground`: цвет обычного текста
      // СТРАНИЦЫ, то есть тёмный на светлой теме. На тёмной заливке кнопки он
      // сливался с ней. Переменные ходят парой — фон `primary` и текст на нём
      // `primary-foreground`, — и это единственный способ остаться читаемым в
      // обеих темах. Значок наследует цвет текста (`currentColor`), поэтому
      // чинится вместе с надписью.
      className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
    >
      {b.label}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    </a>
  </div>
)
