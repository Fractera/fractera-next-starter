// Ссылки внутри материала — ОДНО место, где решается их судьба (шаг 507).
//
// Раньше об этом знал только `inline.tsx`, разбиравший ссылки в прозе, и оба
// его решения были неверны в проекте клиента:
//
// 1. «Свой домен» был записан как `fractera.ai`. То есть на сайте клиента вес
//    без ограничений уходил домену ПЛАТФОРМЫ, а собственный домен клиента
//    считался чужим и получал `nofollow`. Идентичность обязана приходить из
//    настроек (`CONTENT-ENGINE.md` §6), и это правило движок нарушал первым.
//
// 2. Внутренняя ссылка на корень записывается как `/ru` — но в одноязычном
//    режиме `proxy.ts` снимает языковой сегмент, и такой адрес отвечает 301.
//    Ссылка на главную из каждой статьи превращалась в редирект; тот же случай
//    уже был вылечен для канонических адресов в `lib/seo/alternates.ts`, а для
//    ссылок в тексте — нет.
//
// Кнопка (`cta`) ходит по тем же законам, поэтому решение живёт здесь, а не в
// одном из рендереров.

import { SINGLE_LANG_MODE } from "@/config/translations/translations.config"
import { brand } from "@/lib/brand"

/** Внутренняя ссылка на корень сайта на языке ячейки: `/ru`, `/en`. */
export const ROOT_LINK = /^\/([a-z]{2})$/

/** Подпись, которую заменяет название сайта на языке ссылки. */
export const SITE_TOKEN = "%SITE%"

/** Хост из адреса сайта в настройках; пусто, если адрес ещё не задан. */
function ownHost(): string {
  try {
    const url = brand().siteUrl
    return url ? new URL(url).host.replace(/^www\./, "") : ""
  } catch {
    return ""
  }
}

/**
 * Ссылка ведёт на СОБСТВЕННЫЙ домен проекта? Тогда `nofollow` не ставится: вес
 * внутри своего сайта отдавать некому. Адрес сайта не задан — считаем чужим:
 * ошибиться в сторону осторожности дешевле.
 */
export function isOwnDomain(href: string): boolean {
  const host = ownHost()
  if (!host) return false
  try {
    return new URL(href).host.replace(/^www\./, "") === host
  } catch {
    return false
  }
}

/**
 * Адрес корневой ссылки с учётом одноязычного режима: там языкового сегмента в
 * публичных адресах нет, и `/en` отвечает редиректом. Не корневая ссылка —
 * возвращается как есть.
 */
export function resolveRootHref(href: string): string {
  return SINGLE_LANG_MODE && ROOT_LINK.test(href) ? "/" : href
}

/** Атрибуты внешней ссылки; для внутренней — ничего (та же вкладка, без rel). */
export function linkAttrs(href: string): { target?: string; rel?: string } {
  if (!/^https?:/.test(href)) return {}
  return {
    target: "_blank",
    rel: isOwnDomain(href) ? "noopener noreferrer" : "noopener noreferrer nofollow",
  }
}
