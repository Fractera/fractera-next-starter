import type { SectionRenderer } from '@/sections/contract'
import { H4 } from '@/components/ui/typography'
import { inline, headingId } from '@/lib/content/blocks/inline'

// Заголовок четвёртого уровня. Размер и шрифт — из примитива типографики.
//
// Отступ сверху меньше, чем у третьего уровня (`mt-4`): чем глубже уровень, тем
// теснее он прижат к тому, что озаглавливает, — иначе подраздел визуально
// отрывается от своего раздела и читается как соседний.
export const h4: SectionRenderer<'h4'> = (b, { key: k }) => (
  <H4 key={k} id={headingId(b.text)} className="mt-3 scroll-mt-24">
    {inline(b.text, k)}
  </H4>
)
