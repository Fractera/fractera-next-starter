import type { SectionRenderer } from '@/sections/contract'
import { H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// РЯД КАРТОЧЕК С ИМЕНЕМ ПОСТАВЩИКА (шаг 52).
//
// 🔒 ПЕРВЫЙ ВИД ТИПА `showcase`, КОТОРЫЙ СТОЯЛ ПУСТЫМ. Витрина показывает так
// пять кодинг-платформ; в каталоге это витрина чего угодно — интеграций,
// партнёров, поддерживаемых форматов.
//
// 🔒 ТРЕТЬЯ СТРОКА — ЧЬЯ ЭТО ВЕЩЬ, И РАДИ НЕЁ ВИД СУЩЕСТВУЕТ. Без неё карточка
// неотличима от `cards`; с ней она отвечает на вопрос, который в витрине задают
// первым: «а это вообще чьё?». Поле необязательное: своя вещь в ряду чужих
// остаётся без подписи, и это честнее выдуманного имени.
export const logoCards: SectionRenderer<'logoCards'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-4">
    {b.title && (
      <SectionHead id={`${k}-t`} title={b.title} note={b.note ? inline(b.note, `${k}-n`) : undefined} />
    )}
    <div data-logo-cards className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {b.items.map((item, i) => (
        <div key={`${k}-i-${i}`} className="flex h-full flex-col rounded-xl border border-border bg-card p-4">
          <H4>{inline(item.title, `${k}-i-${i}-t`)}</H4>
          <P className="mt-1 flex-1 text-muted-foreground">{inline(item.text, `${k}-i-${i}-x`)}</P>
          {item.source && (
            <Small className="mt-3 block uppercase tracking-wide text-muted-foreground">{item.source}</Small>
          )}
        </div>
      ))}
    </div>
  </section>
)
