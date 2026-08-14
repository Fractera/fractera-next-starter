import type { SectionRenderer } from '@/sections/contract'

// Контейнер-группа (рекурсивный).
export const group: SectionRenderer<'group'> = (b, ctx) => (
  <div key={ctx.key} className="flex flex-col gap-6">
    {ctx.renderBlocks(b.children, ctx.lang, ctx.ui, ctx.key)}
  </div>
)
