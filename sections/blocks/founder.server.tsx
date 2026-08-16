import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { author, authorSocialLinks } from '@/lib/author'
import { PullQuote } from '@/sections/pull-quote.server'

// Цитата владельца, подписанная данными из настроек проекта.
//
// 🔒 РИСУНОК ПЕРЕЕХАЛ В `sections/pull-quote.server.tsx` (2026-08-16). Тот же
// вид понадобился второму блоку — правилу продукта, у которого автора нет, —
// и копия градиента разошлась бы с оригиналом на первой правке темы. Здесь
// осталось единственное, что принадлежит именно этому виду: ПОДПИСЬ.
//
// 🔒 ТРИ АБСОЛЮТНЫХ ЦВЕТА УБРАНЫ ранее (шаг 508, найдено гейтом при переезде):
// `text-gray-400`/`text-gray-500` в подписи и фиолетовый градиент прямо в
// `style`. Всё это одинаково в обеих темах по построению — тот же дефект, из-за
// которого блог оставался чёрным под светлой темой.
export const founder: SectionRenderer<'founder'> = (b, { key: k }) => (
  <PullQuote
    key={k}
    footer={
      /* Подпись — имя, фото и должность приходят из панели (App settings → Author).
         Проект, где владелец их не заполнил, показывает цитату БЕЗ подписи: без
         имени честно, с чужим — нет. Каждая часть отваливается сама по себе —
         нет фото, но имя остаётся. */
      <figcaption className="mt-7 flex flex-col items-center gap-4">
        {author().name && (
          <div className="flex items-center">
            {author().photo && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={author().photo!} alt={`${author().name} photo`} width={32} height={32} className="mr-2.5 rounded-full" />
            )}
            <span className="text-base font-medium tracking-tight text-foreground">
              <a href={author().url} rel="author me" className="hover:text-primary">{author().name}</a>
              {author().role && (
                <cite className="ml-1.5 not-italic text-muted-foreground before:mr-1.5 before:inline-flex before:h-px before:w-4 before:bg-muted-foreground before:align-middle">
                  {author().role}
                </cite>
              )}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {authorSocialLinks().map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="me author noopener noreferrer" className="hover:text-primary">
              {s.label}
            </a>
          ))}
        </div>
      </figcaption>
    }
  >
    {inline(b.text, k)}
  </PullQuote>
)
