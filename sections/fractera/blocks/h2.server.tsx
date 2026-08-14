import type { SectionRenderer } from '@/sections/contract'
import { inline, headingId } from '@/lib/content/blocks/inline'

// Заголовок второго уровня.
export const h2: SectionRenderer<'h2'> = (b, { key: k }) => (
  <h2 key={k} id={headingId(b.text)} className="mt-6 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground md:text-xl">
    {inline(b.text, k)}
  </h2>
)
