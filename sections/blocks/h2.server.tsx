import type { SectionRenderer } from '@/sections/contract'
import { H2 } from '@/components/ui/typography'
import { inline, headingId } from '@/lib/content/blocks/inline'

// Заголовок второго уровня.
//
// Размер и шрифт — из примитива `components/ui/typography.tsx`, здесь только
// отступ и якорь. Раньше стояло `text-2xl … md:text-xl`, то есть на мониторе
// заголовок был МЕЛЬЧЕ, чем на телефоне, — и это касалось каждой контентной
// страницы разом.
export const h2: SectionRenderer<'h2'> = (b, { key: k }) => (
  <H2 key={k} id={headingId(b.text)} className="mt-6 scroll-mt-24">
    {inline(b.text, k)}
  </H2>
)
