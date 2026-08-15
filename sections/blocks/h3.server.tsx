import type { SectionRenderer } from '@/sections/contract'
import { H3 } from '@/components/ui/typography'
import { inline, headingId } from '@/lib/content/blocks/inline'

// Заголовок третьего уровня. Размер и шрифт — из примитива типографики.
export const h3: SectionRenderer<'h3'> = (b, { key: k }) => (
  <H3 key={k} id={headingId(b.text)} className="mt-4 scroll-mt-24">
    {inline(b.text, k)}
  </H3>
)
