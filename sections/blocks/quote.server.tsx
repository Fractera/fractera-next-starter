import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Цитата.
//
// Размер шёл `text-xl … md:text-lg` — убывал с экраном, как и заголовки. Теперь
// растёт: цитата крупнее обычного текста и на телефоне, и на мониторе.
// 🔒 `lead` — ПЕРВАЯ СТРОКА ЦИТАТЫ, А НЕ ЗАГОЛОВОК РАЗДЕЛА. Тег заголовка здесь
// стоять не может: внутри `<blockquote>` он попал бы в оглавление страницы и в
// иерархию машинного близнеца как раздел, которого нет. Поэтому это `<strong>`
// с собственным кеглем — крупнее тела цитаты и на телефоне, и на мониторе.
export const quote: SectionRenderer<'quote'> = (b, { key: k }) => (
  <figure key={k} className="my-2 border-l-2 border-primary/60 bg-primary/[0.05] py-4 pl-6 pr-4">
    <blockquote className="text-lg font-medium leading-relaxed text-foreground md:text-xl">
      {b.lead && (
        <strong className="mb-3 block text-xl font-bold underline decoration-primary/50 decoration-2 underline-offset-4 md:text-2xl">
          {b.lead}
        </strong>
      )}
      “{inline(b.text, k)}”
    </blockquote>
    {b.cite && (
      <figcaption className="mt-3 text-sm font-medium text-primary">{b.cite}</figcaption>
    )}
  </figure>
)
