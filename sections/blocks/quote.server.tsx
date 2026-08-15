import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Цитата.
//
// Размер шёл `text-xl … md:text-lg` — убывал с экраном, как и заголовки. Теперь
// растёт: цитата крупнее обычного текста и на телефоне, и на мониторе.
export const quote: SectionRenderer<'quote'> = (b, { key: k }) => (
  <figure key={k} className="my-2 border-l-2 border-primary/60 bg-primary/[0.05] py-4 pl-6 pr-4">
    <blockquote className="text-lg font-medium leading-relaxed text-foreground md:text-xl">
      “{inline(b.text, k)}”
    </blockquote>
    {b.cite && (
      <figcaption className="mt-3 text-sm font-medium text-primary">{b.cite}</figcaption>
    )}
  </figure>
)
