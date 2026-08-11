import type { Metadata } from 'next'
import { SUPPORTED_LANGUAGES as SUPPORTED_LANGS, DEFAULT_LANGUAGE } from '@/config/translations/translations.config'
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
function urlFor(lang: string, subPath: string): string {
  const BASE = base()
  if (subPath === '') return lang === DEFAULT_LANGUAGE ? `${BASE}/` : `${BASE}/${lang}`
  return `${BASE}/${lang}${subPath}`
}

// Per-page canonical + hreflang. Each page declares ITSELF as canonical (fixing
// the old bug where every sub-page inherited canonical = the language root, so
// Google folded them into the home page). hreflang advertises the same page in
// every supported language. `subPath` is '' for a home page, '/slug' otherwise.
export function buildAlternates(lang: string, subPath = ''): Metadata['alternates'] {
  return {
    canonical: urlFor(lang, subPath),
    languages: {
      'x-default': urlFor(DEFAULT_LANGUAGE, subPath),
      ...Object.fromEntries(SUPPORTED_LANGS.map(l => [l, urlFor(l, subPath)])),
    },
  }
}
