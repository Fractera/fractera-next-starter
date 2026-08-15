import type { SectionRenderer } from '@/sections/contract'
import { P } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'

// Абзац. Образец формы для всех остальных рендереров: один вид — один файл.
//
// Размер приходит из примитива. Раньше здесь стояло `text-[17px] … md:text-base`
// — 17px на телефоне против 16px на мониторе, то есть КАЖДЫЙ абзац контентной
// страницы убывал с ростом экрана. Сторож этого не видел: он знал только
// именованные размеры и мимо `text-[17px]` проходил молча.
export const p: SectionRenderer<'p'> = (b, { key: k }) => (
  <P key={k} className="leading-8">
    {inline(b.text, k)}
  </P>
)
