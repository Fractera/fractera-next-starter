import type { SectionRenderer } from '@/sections/contract'

const COLS_CLASS: Record<2 | 3, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
}

// Контейнер-колонки (рекурсивный).
export const columns: SectionRenderer<'columns'> = (b, ctx) => (
  <div key={ctx.key} className={`my-4 grid gap-6 ${COLS_CLASS[b.cols ?? 2]}`}>
    {ctx.renderBlocks(b.children, ctx.lang, ctx.ui, ctx.key)}
  </div>
)
