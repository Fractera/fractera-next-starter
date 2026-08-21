import { resolveFields, resolveLocalizedBody } from '@/lib/content/resolve'
import { adminUrlFromSite } from '@/lib/site-urls'
import { getAppConfig } from '@/config/app-config'
import type { ContentPageContent } from '@/lib/content/create-content-page'
import type { Block } from '@/lib/content/blocks/types'

// Общая часть трёх страниц подвала — чтобы они были ПАТТЕРНОМ, а не тремя копиями.
//
// 🔒 ЧЕМ ЭТИ СТРАНИЦЫ ОТЛИЧАЮТСЯ ОТ ПРЕЖНИХ. Снесённые `legal/*` объявляли
// `force-dynamic`, не имели `generateStaticParams` и структурированных данных:
// тело подтягивалось из рантайм-конфига на каждый запрос. Для поиска такие
// страницы почти не существуют, а канон проекта их прямо запрещает. Эти —
// полностью статические: всё приходит из `createContentPage`.
//
// 🔒 ДВА ЯЗЫКА НАМЕРЕННО. Здесь лежит не контент, а ОБРАЗЕЦ: `en` + `ru`
// достаточно, чтобы показать, как устроена языковая ячейка. Проект с другими
// языками получит `en` — тем же резолвером, что у постов блога.

export type FooterPageData = {
  /**
   * 🔒 `heroImage` НЕОБЯЗАТЕЛЕН И ПОЯВИЛСЯ ПО ПРОГОНУ НАВЫКОВ 2026-08-21.
   * Правовым страницам иллюстрация не нужна и не положена, а рассказу о
   * компании она — половина смысла. Пока поля здесь не было, страница с
   * картинкой обходила тип: `meta` импортировали в обход `data`. Обход в
   * образце опаснее пропущенной возможности — следующий скопирует именно его.
   *
   * Значение то же, что у `ogImage`: карточка в чужой ленте и картинка на
   * странице обязаны совпадать, иначе человек и робот видят разные страницы.
   */
  meta: { slug: string; ogImage: string; heroImage?: string }
  en: FooterPageCell
  overrides?: Record<string, Partial<FooterPageCell>>
}

export type FooterPageCell = {
  title: string
  description: string
  keywords: string
  /**
   * Подпись пункта ВЕРХНЕГО меню на этом языке.
   *
   * 🔒 ЧИТАЕТСЯ ТЕКСТОМ, А НЕ ИМПОРТОМ, И ИМЯ ПОЛЯ МЕНЯТЬ НЕЛЬЗЯ. Сканер меню
   * (`lib/menu/group-menus.ts`) разбирает языковые ячейки регулярным
   * выражением: он работает на сборке и не вправе импортировать движок
   * контента. Другого имени он не знает — нет поля, и кнопка называется именем
   * папки на всех языках сразу, то есть латиницей в русском меню.
   *
   * Предел кнопки — двенадцать знаков: полоса меню одна и горизонтальна.
   */
  eyebrow?: string
  /** Абзацы заглушки: их владелец заменит своим текстом. */
  blocks: Block[]
}

/**
 * Врезка «текст размещается в панели» — единственная общая часть тела страниц.
 *
 * 🔒 АДРЕС ПАНЕЛИ ВЫВОДИТСЯ НА СЕРВЕРЕ, из `APP-CONFIG.url` — той же функцией,
 * что и на главной. Не из `window`: страница обязана остаться статической и
 * читаться с выключенным JS. Настройки не сохраняли — ссылки нет, остаётся
 * текст: адрес в никуда хуже отсутствующего.
 */
export function panelNotice(lang: string, texts: { title: string; text: string; label: string }): Block {
  const admin = adminUrlFromSite(getAppConfig().url)
  // 🔒 ЯЗЫКОВОЙ ПРЕФИКС ОБЯЗАТЕЛЕН (2026-08-12). Здесь стоял адрес
  // `<панель>/footer-pages` — без языка, и он отдавал 404: все страницы панели
  // живут под `/<язык>/`. Язык берём тот же, на котором читают страницу, — тогда
  // человек попадает в панель на своём языке, а не на чужом.
  return admin
    ? { kind: 'cta', text: `${texts.title} ${texts.text}`, href: `${admin}/${lang}/footer-pages`, label: texts.label }
    : { kind: 'note', text: `${texts.title} ${texts.text}` }
}

/** Собрать содержимое страницы на языке: перевод, иначе английская основа. */
export function footerPage(data: FooterPageData, lang: string): ContentPageContent {
  const override = data.overrides?.[lang]
  const fields = resolveFields(data.en, override ?? {}, ['title', 'description', 'keywords'] as const)
  const body = resolveLocalizedBody({ blocks: data.en.blocks }, override ? { blocks: override.blocks } : undefined)
  return { ...fields, blocks: body.blocks }
}
