import type { SectionRenderer } from '@/sections/contract'

// Блок кода.
export const code: SectionRenderer<'code'> = (b, { key: k }) => (
  <pre
    key={k}
    className="overflow-x-auto rounded-2xl border border-border bg-muted/40 p-5 text-[12.5px] leading-snug text-foreground"
  >
    <code className="whitespace-pre font-mono">{b.text}</code>
  </pre>
)
