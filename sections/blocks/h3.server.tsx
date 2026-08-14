import type { SectionRenderer } from '@/sections/contract'
import { inline, headingId } from '@/lib/content/blocks/inline'

// Заголовок третьего уровня.
export const h3: SectionRenderer<'h3'> = (b, { key: k }) => (
  <h3 key={k} id={headingId(b.text)} className="mt-4 scroll-mt-24 text-lg font-semibold text-foreground">
    {inline(b.text, k)}
  </h3>
)
