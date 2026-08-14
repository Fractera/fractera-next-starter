import type { ReactNode } from 'react'

// Stable anchor id for a heading, so a table of contents (used by the content
// pages) can link to it. Additive: headings simply gain an id, no visual change.
//
// 🔒 ЗАГОЛОВОК НЕ ОБЯЗАН БЫТЬ ЛАТИНИЦЕЙ (найдено на живой странице 2026-08-14).
// Здесь стояло только `[^a-z0-9] → -`, то есть у русского заголовка от адреса не
// оставалось НИЧЕГО: на `/ru` каждый `<h2>` уезжал с `id=""`, а всё оглавление
// ссылалось на `#`. Дефект не виден ни в коде, ни в сборке — только глазами, на
// странице того языка, который писали не первым. Перевод на восемь языков
// размножил бы его на восемь страниц каждого поста.
//
// Лечение: латиница даёт читаемый адрес, как раньше; всё остальное получает
// устойчивую метку от текста заголовка. Метка считается от СОДЕРЖАНИЯ, а не от
// порядкового номера: вставка нового `h2` в середину статьи не должна ломать
// ссылки на её разделы, которыми люди уже поделились.
function stableHash(text: string): string {
  // FNV-1a: коротко, без зависимостей, одинаково на сервере и в markdown-версии.
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36)
}

export function headingId(text: string): string {
  const clean = text.replace(/\*\*/g, '').trim()
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
  // Меньше трёх знаков — это не адрес, а совпадение: два разных заголовка легко
  // дадут одинаковый огрызок. Тогда честнее метка от всего текста.
  return slug.length >= 3 ? slug : `h-${stableHash(clean)}`
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
//
// 🔒 РЕШЕНИЯ О ССЫЛКЕ ЖИВУТ В `./links.ts` (шаг 507): «свой домен» берётся из
// настроек проекта, а не из зашитого имени платформы, и корневая ссылка
// учитывает одноязычный режим. Кнопка `cta` пользуется тем же модулем, поэтому
// закон один на все места, где в материале встречается адрес.
import { metaForLang } from '@/config/app-config'
import { ROOT_LINK, SITE_TOKEN, linkAttrs, resolveRootHref } from './links'

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
          href={resolveRootHref(href)}
          {...linkAttrs(href)}
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
