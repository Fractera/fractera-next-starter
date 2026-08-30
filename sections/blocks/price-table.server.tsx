import type { SectionRenderer } from '@/sections/contract'
import { Check } from 'lucide-react'
import { H2, H3, P, Small } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { inline } from '@/lib/content/blocks/inline'

// ТАРИФЫ С ПЕРЕКЛЮЧАТЕЛЕМ ПЕРИОДА (шаг 56, 2026-08-30).
//
// Форма прислана владельцем из внешней библиотеки блоков: заголовок и описание,
// переключатель «месяц / год», ряд карточек — ярлык с названием, крупная цена,
// подпись периода, черта, список возможностей с галочками, кнопка внизу.
// Выделенный тариф получает заливку и сплошную кнопку.
//
// 🔒 ПЕРЕКЛЮЧАТЕЛЬ — ПЕРЕКЛЮЧАТЕЛЬ, А НЕ ОСТРОВОК, И ПРИЧИН ДВЕ. Первая: канон
// проекта требует сначала спросить, нужен ли островок вообще — показать одно из
// двух умеет чистый CSS, и тогда цены видны при выключенном JavaScript, а
// поисковик читает ОБЕ. Вторая приземлённее: в источнике переключателем служит
// `Tabs`, а такого компонента в шаблоне нет вовсе, и заводить целый узел ради
// двух подписей значило бы принести зависимость, о которой никто не просил.
//
// 🔒 ОБЕ ЦЕНЫ ЛЕЖАТ В РАЗМЕТКЕ, СКРЫТА ЛИШЬ ОДНА. Островок нарисовал бы только
// текущую, и годовая цена не существовала бы для поисковика — а именно её ищут,
// когда сравнивают тарифы.
//
// 🔒 ГАЛОЧКА ОДНА НА ВСЕ ВОЗМОЖНОСТИ, КАК В ИСТОЧНИКЕ. Там у каждой возможности
// объявлено собственное поле значка и даже написана функция-извлекатель — но
// разметка всегда рисует `Check`, а функцию никто не зовёт. Значок при списке
// «что входит» и не должен быть разным: он говорит «включено», а не «что это».
export const priceTable: SectionRenderer<'priceTable'> = (b, { key: k }) => {
  // Переключатель существует, только если ЕСТЬ что переключать.
  const hasYearly = b.plans.some(p => p.yearlyPrice) && !!b.periodLabels
  const name = `${k}-period`

  return (
    <section key={k} data-price-table className="pt-root mt-8 flex flex-col gap-6">
      {/* Переключатели стоят ПЕРЕД содержимым: правило `:checked ~` видит только
          последующих соседей. Поставь их после — класс написан, эффекта нет. */}
      {hasYearly && (
        <>
          <input className="pt-r sr-only" type="radio" name={name} id={`${name}-m`} defaultChecked />
          <input className="pt-r sr-only" type="radio" name={name} id={`${name}-y`} />
        </>
      )}

      <div className="flex flex-col gap-6">
        <H2 id={`${k}-t`}>{inline(b.title, `${k}-t`)}</H2>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          {b.note && <P className="max-w-3xl text-muted-foreground">{inline(b.note, `${k}-n`)}</P>}

          {hasYearly && b.periodLabels && (
            <div className="pt-tabs flex w-fit shrink-0 gap-1 rounded-lg border border-border p-1">
              <label htmlFor={`${name}-m`} className="pt-tab cursor-pointer rounded-md px-6 py-2 text-[length:var(--fs-small)] font-semibold text-muted-foreground transition-colors">
                {b.periodLabels.monthly}
              </label>
              <label htmlFor={`${name}-y`} className="pt-tab cursor-pointer rounded-md px-6 py-2 text-[length:var(--fs-small)] font-semibold text-muted-foreground transition-colors">
                {b.periodLabels.yearly}
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="pt-body flex w-full flex-col items-stretch gap-6 md:flex-row">
        {b.plans.map((plan, i) => (
          <div
            key={`${k}-p-${i}`}
            data-plan={plan.highlighted ? 'highlighted' : 'plain'}
            className={`flex w-full flex-col rounded-lg border border-border p-6 text-left ${
              plan.highlighted ? 'bg-muted' : ''
            }`}
          >
            <Badge variant={plan.highlighted ? 'default' : 'outline'} className="mb-8 block w-fit uppercase">
              {plan.name}
            </Badge>

            {/* Цена — заголовок третьего уровня, а не набранное руками число:
                размер приходит из шкалы проекта, и владелец двигает его вместе с
                остальным набором. В источнике здесь зашитый `text-5xl`. */}
            <H3 className="pt-monthly">{plan.monthlyPrice}</H3>
            {plan.yearlyPrice && <H3 className="pt-yearly">{plan.yearlyPrice}</H3>}

            {/* 🔒 ПОДПИСЬ ПЕРИОДА ПРЯЧЕТСЯ, НО МЕСТО ЗАНИМАЕТ. У бесплатного
                тарифа периода нет, и убери её совсем — цена этой карточки
                поднимется на строку выше соседних, а ряд перестанет читаться
                рядом. В источнике ровно тот же приём. */}
            <Small className={`pt-monthly block text-muted-foreground ${plan.monthlyPeriod ? '' : 'invisible'}`}>
              {plan.monthlyPeriod ?? ' '}
            </Small>
            {plan.yearlyPrice && (
              <Small className={`pt-yearly block text-muted-foreground ${plan.yearlyPeriod ? '' : 'invisible'}`}>
                {plan.yearlyPeriod ?? ' '}
              </Small>
            )}

            <Separator className="my-6" />

            {/* Список и кнопка разведены по краям: кнопки всех карточек встают на
                одну линию, как бы ни различалась длина списков. */}
            <div className="flex h-full flex-col justify-between gap-10">
              <ul className="flex flex-col gap-4 text-muted-foreground">
                {plan.features.map((f, fi) => (
                  <li key={`${k}-p-${i}-f-${fi}`} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0" aria-hidden />
                    <span>{inline(f, `${k}-p-${i}-f-${fi}`)}</span>
                  </li>
                ))}
              </ul>

              {plan.cta && (
                <a
                  href={plan.cta.href}
                  {...(plan.cta.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-[length:var(--fs-small)] font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {plan.cta.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
