import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Маркированный список.
export const list: SectionRenderer<'list'> = (b, { key: k }) => (
  <ul key={k} className="flex list-disc flex-col gap-3 pl-6 text-[17px] leading-8 text-muted-foreground marker:text-primary md:text-base">
    {b.items.map((it, j) => <li key={`${k}-${j}`}>{inline(it, `${k}-${j}`)}</li>)}
  </ul>
)
