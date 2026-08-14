import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Абзац. Образец формы для всех остальных рендереров дизайна: один вид — один
// файл, экспорт с именем вида, разметка внутри — только токены темы.
export const p: SectionRenderer<'p'> = (b, { key: k }) => (
  <p key={k} className="text-[17px] leading-8 text-muted-foreground md:text-base">
    {inline(b.text, k)}
  </p>
)
