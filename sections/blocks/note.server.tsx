import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Примечание.
export const note: SectionRenderer<'note'> = (b, { key: k }) => (
  // Было `text-foreground/35` — примечание почти сливалось с фоном и не
  // проходило порог контраста (проверка доступности 2026-08-13). Примечание не
  // обязано кричать, но обязано читаться: `muted-foreground` для того и есть.
  <p key={k} className="mt-2 border-t border-border pt-6 text-sm italic leading-normal text-muted-foreground">
    {inline(b.text, k)}
  </p>
)
