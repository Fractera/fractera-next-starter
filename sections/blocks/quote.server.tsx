import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Цитата.
export const quote: SectionRenderer<'quote'> = (b, { key: k }) => (
  <figure key={k} className="my-2 border-l-2 border-primary/60 bg-primary/[0.05] py-4 pl-6 pr-4">
    <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-lg">
      “{inline(b.text, k)}”
    </blockquote>
    {b.cite && (
      <figcaption className="mt-3 text-sm font-medium text-primary">{b.cite}</figcaption>
    )}
  </figure>
)
