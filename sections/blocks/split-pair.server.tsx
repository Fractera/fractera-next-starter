import type { SectionRenderer } from '@/sections/contract'
import { H4, P } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'

// ДВЕ ПОЛОВИНЫ С КАРТИНКАМИ — ПОКАЗ ПРОДУКТА С ДВУХ СТОРОН (шаг 52).
//
// 🔒 ПЕРВЫЙ ВИД ТИПА `product-demo`, КОТОРЫЙ СТОЯЛ ПУСТЫМ. Это и есть основание
// завести вид, а не вкус: у каталога была дыра по назначению — «показать, как
// продукт выглядит в работе», — и собрать её из `columns` можно было только
// вручную и каждый раз чуть иначе.
//
// 🔒 ПОЛОВИН РОВНО ДВЕ. Форма держится на равновесии: они делят ширину пополам и
// читаются как пара утверждений об одном предмете. Третья ячейка превращает пару
// в ряд карточек, а для ряда уже есть `cards` и `benefitCards`.
//
// 🔒 КАРТИНКА НЕОБЯЗАТЕЛЬНА, И БЕЗ НЕЁ РИСУЕТСЯ ЗАГЛУШКА, А НЕ ПУСТОТА. Место под
// изображение занимает высоту; исчезнув, оно роняет вторую половину вверх, и пара
// перестаёт быть парой. Заглушка держит равновесие и честно говорит, что картинки
// пока нет.
const Half = ({ half, k }: { half: { image?: string; alt?: string; title: string; text: string }; k: string }) => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
    {half.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={half.image} alt={half.alt ?? ''} className="aspect-video w-full object-cover" />
    ) : (
      <div
        data-image-placeholder
        className="flex aspect-video w-full items-center justify-center border-b border-border bg-muted/40"
      >
        <span className="text-[length:var(--fs-small)] text-muted-foreground">{half.alt ?? 'image'}</span>
      </div>
    )}
    <div className="p-4">
      <H4>{inline(half.title, `${k}-t`)}</H4>
      <P className="mt-1 text-muted-foreground">{inline(half.text, `${k}-x`)}</P>
    </div>
  </div>
)

export const splitPair: SectionRenderer<'splitPair'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex flex-col gap-4">
    {b.title && (
      <SectionHead id={`${k}-t`} title={b.title} note={b.note ? inline(b.note, `${k}-n`) : undefined} />
    )}
    <div data-split-pair className="grid gap-4 md:grid-cols-2">
      <Half half={b.left} k={`${k}-l`} />
      <Half half={b.right} k={`${k}-r`} />
    </div>
  </section>
)
