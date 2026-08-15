import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Нумерованный список.
export const olist: SectionRenderer<'olist'> = (b, { key: k }) => (
  <ol key={k} className="flex list-decimal flex-col gap-3 pl-6 text-base leading-8 text-muted-foreground marker:font-semibold marker:text-primary md:text-[17px]">
    {b.items.map((it, j) => <li key={`${k}-${j}`} className="pl-1">{inline(it, `${k}-${j}`)}</li>)}
  </ol>
)
