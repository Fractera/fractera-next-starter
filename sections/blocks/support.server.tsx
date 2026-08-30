import type { SectionRenderer } from '@/sections/contract'
import { H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// ПОДДЕРЖКА ПРОЕКТА — ПЕРЕНОС ИЗ `sponsorship-section.tsx` ВИТРИНЫ
// (переписан 2026-08-30 по слову владельца: «support01 — абсолютно некачественная
// работа, удаляй это и заменяй на sponsorship-section.tsx»).
//
// ✗ ЧЕМ ОПЛАЧЕН ЭТОТ ВИД. В шаге 52 он был назван переносом витрины, а на деле
// собран по мотивам: три карточки с именем, суммой и абзацем. От источника не
// осталось ни ряда достоинств со звёздочками, ни выделенного тарифа с ярлыком
// над карточкой, ни кнопки, ни строки «кто уже поддерживает». Тот же урок, что
// владелец назвал в шаге 53: **название секции даётся затем, чтобы форму ВЗЯТЬ,
// а не придумать похожую.**
//
// 🔒 ЧТО В ФОРМЕ ГЛАВНОЕ. Ряд из трёх: крупная сумма и период в одну строку,
// подпись под ними, перечень достоинств со звёздочкой, кнопка внизу. Один тариф
// выделен ярлыком, который висит НАД карточкой, заливкой и сплошной кнопкой.
// Под рядом — строка условия, ниже — широкая ссылка «кто уже поддерживает».
//
// 🔒 ВЫДЕЛЕННЫЙ ТАРИФ РОВНО ОДИН, И ЭТО НЕ УКРАШЕНИЕ: два выделенных не выделяют
// ничего. Признаком служит сам ярлык — отдельного поля «выделить» нет, чтобы
// нельзя было выделить тариф без объяснения, за что ему это.
//
// 🔒 КНОПКА ИСТОЧНИКА ОТКРЫВАЕТ ОПЛАТУ, У КАТАЛОГА ЕЁ НЕТ — И ЗДЕСЬ ССЫЛКА С
// АДРЕСОМ. Кнопка, которая никуда не ведёт, хуже её отсутствия: человек нажимает
// и решает, что интерфейс сломан. Тот же закон уже записан у `priceTable`.
//
// 🔒 ЖЁЛТЫЙ ВИТРИНЫ ЗАМЕНЁН ТОКЕНОМ ТЕМЫ (решение владельца о цветах, 2026-08-30).
// Буквальная копия палитры сломала бы тему каждого клиента и не прошла бы
// `check:contrast`.
//
// 🔒 СОСТОЯНИЯ ПРИЛОЖЕНИЯ В КАТАЛОГ НЕ ЕДУТ. У источника есть экран «спасибо» и
// подсказка «сначала войдите» — они принадлежат сеансу и оплате, а не форме.
// Место второй занимает обычная строка `note` под рядом.
export const support: SectionRenderer<'support'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-8">
    <SectionHead id={`${k}-t`} badge={b.badge} title={b.title} />
    {b.body && b.body.length > 0 && (
      <div className="flex flex-col gap-2">
        {b.body.map((line, i) => (
          <P key={`${k}-b-${i}`} className="text-muted-foreground">{inline(line, `${k}-b-${i}`)}</P>
        ))}
      </div>
    )}

    <div data-support className="grid items-stretch gap-4 md:grid-cols-3">
      {b.tiers.map((tier, i) => {
        const popular = !!tier.badge
        return (
          <div
            key={`${k}-i-${i}`}
            data-tier={popular ? 'popular' : 'plain'}
            className={
              popular
                ? 'relative flex h-full flex-col gap-4 rounded-2xl border border-primary/50 bg-primary/5 p-6'
                : 'relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6'
            }
          >
            {/* Ярлык висит НАД карточкой, наполовину выходя за её край, — так в
                источнике. Он же единственный признак выделенного тарифа. */}
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-[length:var(--fs-small)] font-bold uppercase tracking-widest text-primary">
                {tier.badge}
              </span>
            )}

            <div className="flex flex-col gap-1">
              {/* Сумма и период стоят по одной базовой линии: период — приписка
                  к числу, а не второе число. */}
              <div className="flex items-baseline gap-1">
                <H4 className="text-[length:var(--fs-h3)]">{inline(tier.amount, `${k}-i-${i}-a`)}</H4>
                {tier.period && <Small className="text-muted-foreground">{tier.period}</Small>}
              </div>
              <Small className="text-muted-foreground">{inline(tier.sublabel, `${k}-i-${i}-s`)}</Small>
            </div>

            <ul className="flex flex-col gap-2">
              {tier.perks.map((perk, p) => (
                <li key={`${k}-i-${i}-p-${p}`} className="flex items-start gap-2">
                  <span aria-hidden className="mt-0.5 shrink-0 font-bold text-primary">★</span>
                  <Small>{inline(perk, `${k}-i-${i}-p-${p}`)}</Small>
                </li>
              ))}
            </ul>

            {tier.cta && (
              <a
                href={tier.cta.href}
                className={
                  popular
                    ? 'mt-auto inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90'
                    : 'mt-auto inline-flex w-full items-center justify-center rounded-xl border border-border bg-muted/40 px-5 py-3 font-bold text-foreground transition-colors hover:bg-muted'
                }
              >
                {tier.cta.label}
              </a>
            )}
          </div>
        )
      })}
    </div>

    {b.note && <Small className="text-center text-muted-foreground">{inline(b.note, `${k}-n`)}</Small>}

    {/* Широкая ссылка внизу: в источнике это вход на страницу спонсоров. Стрелка
        нарисована текстом и спрятана от чтения вслух — она украшение, а не слово. */}
    {b.link && (
      <a
        href={b.link.href}
        data-support-link
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-5 transition-colors hover:border-primary/60 hover:bg-primary/10"
      >
        <span className="flex flex-col gap-0.5">
          <Small className="font-bold uppercase tracking-widest text-primary">{b.link.label}</Small>
          <P className="font-semibold">{inline(b.link.text, `${k}-l`)}</P>
        </span>
        <span aria-hidden className="text-[length:var(--fs-h4)] font-bold text-primary">→</span>
      </a>
    )}
  </section>
)
