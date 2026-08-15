import type { SectionRenderer } from '@/sections/contract'
import { H2 } from '@/components/ui/typography'

// Панель в рамке: заголовок и любое содержимое внутри.
//
// 🔒 ОДИН ВИД ВМЕСТО ЧЕТЫРЁХ СЕКЦИЙ. Вся главная ниже первого экрана была
// четырьмя блоками вёрстки, отличавшимися только тоном рамки и начинкой, —
// 234 строки, где одно и то же написано четыре раза. Здесь это одна секция с
// тремя тонами, а начинку приносят обычные блоки через контейнер.
//
// Тона СМЫСЛОВЫЕ: `plain` — обычный раздел; `warn` — то, что стоит сделать, но
// что ничего не блокирует; `accent` — единственное место страницы, где работает
// модель, и потому единственное со свечением. Выделять всё — значит не выделить
// ничего.
const TONE: Record<string, string> = {
  plain: 'border-border',
  warn: 'border-tone-access/40 bg-tone-access/[0.04]',
  accent: 'border-primary/30',
}

export const panel: SectionRenderer<'panel'> = (b, ctx) => {
  const tone = b.tone ?? 'plain'
  return (
    <section key={ctx.key} className={`relative mt-8 overflow-hidden rounded-2xl border p-6 sm:p-8 ${TONE[tone]}`}>
      {/* Свечение — только у акцентной панели. Сделано градиентами и тенью, без
          анимации и без единой строки скрипта: движущийся фон под текстом мешает
          читать, а на слабом телефоне ещё и стоит кадров. Цвет берётся из токена
          темы, поэтому в обеих темах панель выглядит своей, а не наклеенной. */}
      {tone === 'accent' && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_0%,var(--color-primary)_0%,transparent_60%),radial-gradient(50%_50%_at_100%_100%,var(--color-primary)_0%,transparent_55%)] opacity-[0.07]"
          />
          <div aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-inset ring-primary/20" />
        </>
      )}
      <div className="relative">
        {b.eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{b.eyebrow}</p>
        )}
        <H2 variant="ui" className={b.eyebrow ? 'mt-2' : undefined}>{b.title}</H2>
        <div className="mt-4 flex flex-col gap-4">
          {ctx.renderBlocks(b.children, ctx.lang, ctx.ui, ctx.key)}
        </div>
      </div>
    </section>
  )
}
