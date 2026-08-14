import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { author, authorSocialLinks } from '@/lib/author'

// Цитата владельца, подписанная данными из настроек проекта.
//
// 🔒 ТРИ АБСОЛЮТНЫХ ЦВЕТА УБРАНЫ (шаг 508, найдено гейтом при переезде).
// Здесь были `text-gray-400` и `text-gray-500` в подписи, фиолетовый градиент
// прямо в `style` и фиолетовая картинка-кавычка файлом. Всё это одинаково в
// обеих темах по построению, то есть секция не меняется вместе с темой — тот же
// дефект, из-за которого блог оставался чёрным под светлой темой.
//
// Градиент сохранён как приём, но собран из токена акцента (`from-primary/40 via-primary`),
// поэтому в чужом дизайне он станет цветом ЭТОГО дизайна, а не нашим фиолетовым.
// Кавычка нарисована здесь же и наследует цвет текста (`currentColor`): своя
// картинка в `public/` привязала бы дизайн к файлу вне его папки.
export const founder: SectionRenderer<'founder'> = (b, { key: k }) => (
  <figure key={k} className="my-6 flex flex-col items-center rounded-2xl border border-border bg-muted/40 px-6 py-10">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="mb-6 h-14 w-14 text-primary/70">
      <path d="M9.5 5C6.5 6.8 4.8 9.8 4.8 13.4c0 3.2 1.9 5.6 4.6 5.6 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.9.1-1 .2.3-1.7 2-3.7 3.7-4.7L9.5 5Zm9.6 0c-3 1.8-4.7 4.8-4.7 8.4 0 3.2 1.9 5.6 4.6 5.6 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.9.1-1 .2.3-1.7 2-3.7 3.7-4.7L19.1 5Z" />
    </svg>
    <blockquote className="max-w-[640px] text-center">
      <p className="bg-gradient-to-r from-primary/40 via-primary to-primary/40 bg-clip-text text-center text-[22px] font-medium leading-snug tracking-tight text-transparent md:text-xl">
        {inline(b.text, k)}
      </p>
    </blockquote>
    {/* Подпись — имя, фото и должность приходят из панели (App settings → Author).
        Проект, где владелец их не заполнил, показывает цитату БЕЗ подписи: без
        имени честно, с чужим — нет. Каждая часть отваливается сама по себе —
        нет фото, но имя остаётся. */}
    <figcaption className="mt-7 flex flex-col items-center gap-4">
      {author().name && (
        <div className="flex items-center">
          {author().photo && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={author().photo!} alt={`${author().name} photo`} width={32} height={32} className="mr-2.5 rounded-full" />
          )}
          <span className="text-base font-light tracking-tight text-foreground">
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
  </figure>
)
