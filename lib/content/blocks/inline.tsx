import type { ReactNode } from 'react'

// Stable anchor id for a heading, so a table of contents (used by the content
// pages) can link to it. Additive: headings simply gain an id, no visual change.
export function headingId(text: string): string {
  return text.toLowerCase().replace(/\*\*/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

// Dark-theme inline renderer for content prose: **bold** and [label](url).
//
// 🔒 ДВА ТИПА ССЫЛОК, И ЭТО ЗАКОН, А НЕ ПРИВЫЧКА.
//
// 1. ВНЕШНЯЯ — всегда абсолютная, с хостом. Открывается в новой вкладке.
//    Чужому домену ставится `nofollow` (вес не отдаём), домену платформы —
//    не ставится: туда вес уходит намеренно. Относительной внешняя ссылка быть
//    не может: пост копируется в проект, где такой страницы нет, и ссылка
//    ведёт в никуда — так `/ai-development-loop` отдавал 404 на каждом сайте
//    клиента.
//
// 2. ВНУТРЕННЯЯ НА КОРЕНЬ — единственная разрешённая относительная ссылка, и
//    выглядит она как `[%SITE%](/ru)`. Язык берётся из самого адреса, потому
//    что языковая ячейка данных уже знает свой язык, а подпись `%SITE%`
//    заменяется НАЗВАНИЕМ САЙТА на этом же языке (`APP-CONFIG`). Так каждая
//    статья своими словами тянет вес на главную и делает это на языке
//    читателя — а не зашивает чьё-то имя в текст.
//
// Проверяется механически: `npm run check:content`.
import { metaForLang } from '@/config/app-config'

/** Внутренняя ссылка на корень сайта: `/ru`, `/en`. */
const ROOT_LINK = /^\/([a-z]{2})$/
/** Подпись, которую заменяет название сайта на языке ссылки. */
const SITE_TOKEN = '%SITE%'

export function inline(text: string, kp: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      nodes.push(<strong key={`${kp}-b${i}`} className="font-semibold text-foreground">{m[1]}</strong>)
    } else {
      const href = m[3]
      const external = /^https?:/.test(href)
      const ownDomain = /^https?:\/\/[^/]*fractera\.ai(\/|$)/i.test(href)
      const rel = external
        ? ownDomain
          ? 'noopener noreferrer'
          : 'noopener noreferrer nofollow'
        : undefined

      // Внутренняя ссылка на корень: подпись `%SITE%` становится названием
      // сайта на языке этой же ссылки. Название приходит из настроек проекта,
      // поэтому в тексте статьи не остаётся ничьего имени.
      // Подставляется ИМЯ САЙТА, а не его SEO-заголовок: заголовок собирается по
      // шаблону `%s | <имя>` и в якоре читается как «Имя — описание | Имя».
      // Якорь — это то, как сайт называет сам себя в чужом предложении.
      const root = href.match(ROOT_LINK)
      const label = root && m[2].trim() === SITE_TOKEN ? metaForLang(root[1]).siteName : m[2]

      nodes.push(
        <a
          key={`${kp}-a${i}`}
          href={href}
          {...(external ? { target: '_blank', rel } : {})}
          className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary"
        >
          {label}
        </a>,
      )
    }
    last = re.lastIndex
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}
