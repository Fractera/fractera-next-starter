// Разметка счётчика — ОДНА на близнеца и анимированную версию (тот же закон,
// что у `security-orbit/parts.tsx`): расхождение в раскладке видел бы только
// тот, кто дождался подмены, и молчало бы до первой жалобы.
//
// 🔒 ЦВЕТ — ТОЛЬКО ПРИМИТИВ ТИПОГРАФИКИ. `Metric` — готовый знак «число-
// утверждение» из `components/ui/typography.tsx`; свой размер шрифта здесь не
// заводится, чтобы владелец, двигая `--type-scale` в панели, менял и этот
// блок вместе со всем сайтом.

import type { ReactNode } from "react"
import { Metric, Small } from "@/components/ui/typography"

export function CounterFrame({ digits, caption }: { digits: ReactNode; caption: string }) {
  return (
    <section className="relative py-16 md:py-20" data-widget="user-counter">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Metric className="tabular-nums">{digits}</Metric>
        <Small className="mt-3">{caption}</Small>
      </div>
    </section>
  )
}
