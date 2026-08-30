import type { SectionRenderer } from '@/sections/contract'
import { H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// ВАРИАНТЫ ПОДДЕРЖКИ ПРОЕКТА (шаг 52, форма перенесена с витрины).
//
// 🔒 ЭТО НЕ ПРАЙС-ЛИСТ, И РАЗНИЦА НЕ В СЛОВАХ. У цены есть обязанность: заплатив,
// человек получает названное, и невыполнение — обман. Поддержка — добровольный
// взнос в открытый проект; обещать за неё функциональность нельзя, иначе она
// превращается в продажу без гарантии.
//
// Отсюда устройство: сумма НЕОБЯЗАТЕЛЬНА (бывает «сколько посчитаете нужным»),
// вместо «что входит» — обычный текст, и в самом виде нет кнопки покупки. Ссылка
// ведёт туда, где взнос принимают, и её подпись пишет автор — «Поддержать» на
// площадке пожертвований и «Оформить» в магазине читаются по-разному.
//
// 🔒 ПЕРВЫЙ ВИД ТИПА `pricing`, КРОМЕ `noBill`. Тот говорит о счетах, которых НЕ
// будет, — утверждение об экономии. Этот — о деньгах, которые человек отдаёт по
// своей воле. Один тип, противоположные направления, и путать их нельзя.
export const support: SectionRenderer<'support'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-4">
    {b.title && (
      <SectionHead id={`${k}-t`} title={b.title} note={b.note ? inline(b.note, `${k}-n`) : undefined} />
    )}
    <div data-support className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {b.tiers.map((tier, i) => (
        <div
          key={`${k}-i-${i}`}
          className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4"
        >
          <div>
            <H4>{inline(tier.name, `${k}-i-${i}-n`)}</H4>
            {/* Сумма — крупный знак, который читают до чтения; но она
                необязательна, и без неё карточка не ломается. */}
            {tier.amount && (
              <P className="mt-1 font-semibold text-primary">{inline(tier.amount, `${k}-i-${i}-a`)}</P>
            )}
            <Small className="mt-2 block text-muted-foreground">{inline(tier.text, `${k}-i-${i}-x`)}</Small>
          </div>
          {tier.href && (
            <a
              href={tier.href}
              className="mt-3 inline-block text-[length:var(--fs-small)] text-primary hover:underline"
            >
              {tier.linkLabel ?? tier.name}
            </a>
          )}
        </div>
      ))}
    </div>
  </section>
)
