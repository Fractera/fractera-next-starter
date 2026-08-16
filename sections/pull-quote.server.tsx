import type { ReactNode } from 'react'

// КРУПНАЯ ЦИТАТА В РАЗРЯДКУ — рисунок, общий у двух видов.
//
// 🔒 ЗАЧЕМ ОБЩИЙ ФАЙЛ. Так выглядят `founder` (слова владельца, подписанные его
// именем) и `statement` (правило продукта, которое никто не говорил). Отличаются
// они ровно подписью; кавычка, градиент и рамка — одно и то же. Скопируй рисунок
// во второй вид, и градиент разойдётся с первым на первой же правке темы,
// причём молча: обе половины соберутся и обе будут выглядеть правдоподобно.
//
// 🔒 ГРАДИЕНТ ИЗ ТОКЕНА АКЦЕНТА, А НЕ ФИОЛЕТОВЫМ ЧИСЛОМ. Здесь когда-то стоял
// цвет платформы прямо в `style` — он был одинаков в обеих темах и у каждого
// клиента, то есть заголовок клиента светился НАШИМ фиолетовым, что бы тот ни
// выбрал в настройках.
//
// 🔒 КАВЫЧКА НАРИСОВАНА ЗДЕСЬ И НАСЛЕДУЕТ ЦВЕТ ТЕКСТА (`currentColor`): своя
// картинка в `public/` привязала бы дизайн к файлу вне его папки.
export function PullQuote({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <figure className="my-6 flex flex-col items-center rounded-2xl border border-border bg-muted/40 px-6 py-10">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="mb-6 h-14 w-14 text-primary/70">
        <path d="M9.5 5C6.5 6.8 4.8 9.8 4.8 13.4c0 3.2 1.9 5.6 4.6 5.6 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.9.1-1 .2.3-1.7 2-3.7 3.7-4.7L9.5 5Zm9.6 0c-3 1.8-4.7 4.8-4.7 8.4 0 3.2 1.9 5.6 4.6 5.6 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.9.1-1 .2.3-1.7 2-3.7 3.7-4.7L19.1 5Z" />
      </svg>
      <blockquote className="max-w-[640px] text-center">
        <p className="bg-gradient-to-r from-primary/40 via-primary to-primary/40 bg-clip-text text-center text-lg font-medium leading-snug tracking-tight text-transparent md:text-xl">
          {children}
        </p>
      </blockquote>
      {footer}
    </figure>
  )
}
