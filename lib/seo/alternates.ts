import type { Metadata } from 'next'
import {
  SUPPORTED_LANGUAGES as SUPPORTED_LANGS,
  DEFAULT_LANGUAGE,
  SINGLE_LANG_MODE,
} from '@/config/translations/translations.config'
import { getAppConfig } from '@/config/app-config'

// 🔒 ОРИГИН БЕРЁТСЯ ИЗ `APP-CONFIG`, А НЕ ИЗ КОНСТАНТЫ. В версии, откуда это
// перенесено, здесь стоял адрес платформы — и каждый канонический адрес любого
// проекта указывал бы на чужой сайт. Хуже опечатки: поисковик склеил бы страницы
// клиента со страницами платформы.
function base(): string {
  return (getAppConfig().url ?? '').replace(/\/+$/, '')
}

// The canonical URL for a (lang, subPath) pair. The home page of the DEFAULT
// language lives at the bare root (proxy.ts rewrites '/' -> '/<default>'); every
// other URL is /<lang><subPath>. Examples (site url = https://example.com):
//   ('en', '')        -> https://example.com/
//   ('ru', '')        -> https://example.com/ru
//   ('en', '/blog')   -> https://example.com/en/blog
//
// 🔒 ONE LANGUAGE MEANS NO LANGUAGE IN THE URL (step 503). With a single entry in
// NEXT_PUBLIC_SUPPORTED_LANGUAGES the proxy strips the segment from every public
// address: /en/blog answers 301 and the page lives at /blog. Printing the prefixed
// form here would put a redirect into every canonical tag and every sitemap row —
// a canonical that points at a redirect is a page declining to be indexed as
// itself, which is the exact opposite of what this file is for.
export function urlFor(lang: string, subPath: string): string {
  const BASE = base()
  if (SINGLE_LANG_MODE) return subPath === '' ? `${BASE}/` : `${BASE}${subPath}`
  if (subPath === '') return lang === DEFAULT_LANGUAGE ? `${BASE}/` : `${BASE}/${lang}`
  return `${BASE}/${lang}${subPath}`
}

// Per-page canonical + hreflang. Each page declares ITSELF as canonical (fixing
// the old bug where every sub-page inherited canonical = the language root, so
// Google folded them into the home page). hreflang advertises the same page in
// every supported language. `subPath` is '' for a home page, '/slug' otherwise.
//
// 🔒 WHY EVERY PUBLIC PAGE MUST CALL THIS (step 503). A translation that does not
// name its siblings is not read as a translation — it is read as a copy, and a set
// of copies at different addresses is what a search engine calls a doorway. The
// cost is not a worse position: it is whole languages missing from results while
// the site looks perfectly fine to its owner. `npm run check:seo` enforces it, so
// that "someone forgot" stops being a possible state of the tree.
export function buildAlternates(lang: string, subPath = ''): Metadata['alternates'] {
  // Адрес сайта не задан — альтернатив нет. Выдать hreflang на чужой домен
  // значит объявить, что переводы этой страницы живут не здесь.
  if (!base()) return undefined

  // Одноязычный сайт: перевода нет, и объявлять его нечем. `hreflang` из одной
  // записи — не сигнал, а шум; канонический адрес при этом обязателен и остаётся.
  if (SINGLE_LANG_MODE) return { canonical: urlFor(lang, subPath) }

  return {
    canonical: urlFor(lang, subPath),
    languages: {
      'x-default': urlFor(DEFAULT_LANGUAGE, subPath),
      ...Object.fromEntries(SUPPORTED_LANGS.map(l => [l, urlFor(l, subPath)])),
    },
  }
}
