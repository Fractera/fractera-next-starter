import type { Block, FaqPair } from '@/lib/content/blocks/types'
import { resolveFields, resolveLocalizedBody } from '@/lib/content/resolve'
import { adminUrlFromSite } from '@/lib/site-urls'
import { getAppConfig } from '@/config/app-config'
import { DEFAULT_APP_CONFIG } from '@/config/app-config.defaults'
import { ALL_ROLES } from '@/lib/roles'
import { en } from './en'
import { ru } from './ru'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { de } from './de'
import { pt } from './pt'
import { pl } from './pl'
import { tr } from './tr'
import { nl } from './nl'

// Данные главной страницы — ТА ЖЕ АРХИТЕКТУРА, ЧТО У ПОСТА (шаг 508).
//
// 🔒 ЧТО ИЗМЕНИЛОСЬ И ПОЧЕМУ. Раньше главная жила по своим правилам: плоский
// словарь `home.i18n.json` (50 ключей × 10 языков) плюс 234 строки вёрстки в
// компоненте. У блога, правовых страниц и хрома — ячейка на язык, внутри неё сам
// материал блоками. Две архитектуры на один проект означают, что агент обязан
// помнить, где какая; ошибается он при этом молча, а страница просто выходит не
// такой. Теперь правило одно: содержимое — данные в языковых ячейках, рисование —
// секции.
//
// 🔒 ПЕРЕВОДЫ НЕ ПЕРЕВОДИЛИСЬ ЗАНОВО. Все десять языков перенесены из прежнего
// словаря скриптом, строка в строку.

export type HomeCell = {
  title: string
  description: string
  /** Ключевые слова страницы — того же вида, что у правовых страниц. */
  keywords: string
  blocks: Block[]
  /**
   * Вопросы и ответы — ТОТ ЖЕ механизм, что у постов и правовых страниц
   * (владелец 2026-08-22). Рисует их шаблон страницы последней секцией и он же
   * строит разметку `FAQPage` для поисковика; заводить ради этого вид блока
   * значило бы завести второй способ делать то же самое.
   */
  faq?: FaqPair[]
}

export type HomeData = {
  en: HomeCell
  overrides: Record<string, Partial<HomeCell>>
}

export const data: HomeData = { en, overrides: { ru, es, fr, it, de, pt, pl, tr, nl } }

/**
 * Подстановки, которые может знать только сервер: адрес панели, язык и число
 * ролей.
 *
 * 🔒 ПОЧЕМУ ОНИ НЕ В ЯЧЕЙКЕ. Адрес панели у каждого проекта свой и появляется
 * только после сохранения настроек; число ролей меняется вместе с кодом. Впиши
 * их в данные — и в языковой ячейке окажется адрес конкретного сервера, который
 * уедет во все остальные.
 *
 * Настройки не сохраняли — адреса нет, и ссылка ВЫРЕЗАЕТСЯ вместе с подписью:
 * ссылка в никуда хуже её отсутствия. Тот же закон, что у страниц подвала.
 */
function fill(text: string, admin: string, lang: string): string {
  const withRoles = text.replace('{roles}', String(ALL_ROLES.length))
  if (admin) return withRoles.replace(/\{admin\}/g, admin).replace(/\{lang\}/g, lang)
  // Убрать разметку ссылки целиком: `текст [подпись]({admin}/…)` → `текст`.
  return withRoles.replace(/\s*\[[^\]]*\]\(\{admin\}[^)]*\)/g, '')
}

function fillBlocks(blocks: Block[], admin: string, lang: string): Block[] {
  // 🔒 `flatMap`, А НЕ `map`: блок может ИСЧЕЗНУТЬ. Кнопка без адреса панели
  // раньше всегда превращалась в абзац со своей подписью — но подпись стала
  // необязательной (её убрали там, где заголовок раздела говорит то же самое),
  // и на сервере без сохранённых настроек получался бы абзац с пустым текстом.
  // Пустой абзац — не «мелочь вёрстки»: он занимает место и выглядит как
  // пропавший текст.
  return blocks.flatMap<Block>(b => {
    if ('children' in b) return [{ ...b, children: fillBlocks(b.children, admin, lang) }]
    // 🔒 ПЛАШКИ ТОЖЕ ПРОХОДЯТ ПОДСТАНОВКУ (31-27, 2026-08-29). Их текст лежит не в
    // `text`, а в `items[].label`, и ветка ниже его не видела: на главной висела
    // строка «Ролей: {roles}» — незаменённый placeholder на публичной странице,
    // которую видит покупатель. ✗ дефект прожил незамеченным, потому что механизм
    // подстановки СУЩЕСТВОВАЛ и работал у всех остальных блоков.
    if (b.kind === 'badges') {
      return [{ ...b, items: b.items.map(it => ({ ...it, label: fill(it.label, admin, lang) })) }]
    }

    if (b.kind === 'olist' || b.kind === 'list') return [{ ...b, items: b.items.map(i => fill(i, admin, lang)) }]
    if (b.kind === 'cta') {
      // 🔒 ВЫРЕЗАЕТСЯ КНОПКА, ВЕДУЩАЯ В ПАНЕЛЬ, А НЕ КАЖДАЯ КНОПКА (дефект найден
      // 2026-08-29, шаг 38). Здесь стояло `if (admin) … else вырезать`, и на сервере
      // без сохранённых настроек со страницы исчезали ВСЕ призывы к действию —
      // включая те, что ведут на внешние адреса и про панель ничего не знают.
      // Правило писалось для ссылок вида `{admin}/…`, а исполнялось для всех: у
      // свежего сервера главная оставалась без единой кнопки, и выглядело это не
      // как пропажа настройки, а как поломка вёрстки.
      if (!b.href.includes('{admin}')) return [b]
      if (admin) return [{ ...b, href: fill(b.href, admin, lang) }]
      // Кнопка в панель без адреса панели — не кнопка. Есть подпись — остаётся
      // абзацем, нет — исчезает целиком: вести некуда и сказать нечего.
      return b.text ? [{ kind: 'p' as const, text: b.text }] : []
    }
    if ('text' in b && typeof b.text === 'string') return [{ ...b, text: fill(b.text, admin, lang) }]
    return [b]
  })
}

// 🔒 ЧТО СТОИТ СРАЗУ ПОД ПЕРВЫМ ЭКРАНОМ — РЕШАЕТ ЭТОТ ФАЙЛ, А НЕ ПЛАТФОРМА
// (владелец 2026-08-22: «эту группу поднять и поставить сразу под героем, над
// новым виджетом»).
//
// Лента направлений и ряд ярлыков — то, что человек видит сразу за первым
// экраном: сначала ЧТО этим строят, потом ЧЕМ это укомплектовано. Оба идут во всю
// ширину, а виджет под ними рисуется вне ленты страницы — значит и они обязаны
// выйти из ленты вместе с ним.
//
// 🔒 РЯД МЕР ОТСЮДА УБРАН (владелец 2026-08-22). Он поднимался вместе с ярлыками,
// а теперь стоит ниже виджета безопасности — то есть в обычной ленте страницы, и
// поднимать его не нужно вовсе.
//
// 🔒 ПОЧЕМУ ОТБОР ПО ВИДУ ЖИВЁТ ЗДЕСЬ, А НЕ В ШАБЛОНЕ СТРАНИЦЫ. Шаблон один на
// семь страниц; научи его поднимать наверх всякий `metrics`, и ряд мер посреди
// поста однажды молча уедет под заголовок. Здесь же это решение ГЛАВНОЙ о своих
// собственных блоках, и дальше её оно не идёт.
const LEAD_KINDS = new Set(['projectTypeMarquee', 'badges'])

/** Блоки, которые главная показывает ВЫШЕ ленты — сразу под первым экраном. */
export function homeLead(lang: string): Block[] {
  return homeBlocksOf(lang).filter(b => LEAD_KINDS.has(b.kind))
}

/** Общая часть: разобранные и подставленные блоки языка. */
function homeBlocksOf(lang: string): Block[] {
  const override = data.overrides[lang]
  const body = resolveLocalizedBody({ blocks: data.en.blocks }, override ? { blocks: override.blocks } : undefined)
  const admin = adminUrlFromSite(getAppConfig().url) ?? ''
  return fillBlocks(body.blocks, admin, lang)
}

/** Содержимое главной на языке: перевод, иначе английская основа. */
export function homePage(lang: string): HomeCell {
  const override = data.overrides[lang]
  const fields = resolveFields(data.en, override ?? {}, ['title', 'description', 'keywords'] as const)
  const body = resolveLocalizedBody({ blocks: data.en.blocks }, override ? { blocks: override.blocks } : undefined)

  const cfg = getAppConfig()
  const admin = adminUrlFromSite(cfg.url) ?? ''

  // 🔒 ЗАГОЛОВОК — ДВА СОСТОЯНИЯ, И ЭТО СМЫСЛОВАЯ РАЗНИЦА. Пока имя в настройках
  // не менялось, стоит не «Fractera», а «Это ваше приложение»: имя шаблона на
  // чужом сайте — реклама платформы за счёт клиента. Сохранил своё имя — оно и в
  // заголовке, а текст-заглушка исчезает навсегда.
  //
  // Подменяются ПОЛЯ СТРАНИЦЫ, а не блок: заголовок рисует фабрика, одна на
  // посты, правовые страницы и главную.
  const named = Boolean(cfg.name) && cfg.name !== DEFAULT_APP_CONFIG.name
  const filled = fillBlocks(body.blocks, admin, lang)

  const title = named ? cfg.name : fields.title
  const description = named ? (cfg.description ?? fields.description) : fields.description

  // 🔒 ИМЯ ПРОЕКТА ДОЕЗЖАЕТ И ДО ПЕРВОГО ЭКРАНА, А НЕ ТОЛЬКО ДО ШАПКИ.
  //
  // Пока заголовок печатала шапка страницы, подмены полей выше хватало. С
  // переходом первого экрана на секцию `heroSplit` заголовок переехал ВНУТРЬ
  // материала — и подмена перестала его доставать: владелец называл проект в
  // панели, а H1 на главной оставался «Это ваше приложение». Дефект тихий:
  // мета-теги и вкладка браузера показывали бы новое имя, а страница — старое.
  //
  // 🔒 А ВОТ ТЕКСТ ПЕРВОГО ЭКРАНА ОСТАЁТСЯ ЗА МАТЕРИАЛОМ, И ЭТО РАЗНЫЕ ВЕЩИ.
  // `description` в настройках — описание для ПОИСКА: оно уезжает в сниппет и в
  // соцсети, где длина ограничена примерно 160 знаками. Абзац первого экрана
  // живёт по другим законам — он объясняет продукт человеку и занимает столько
  // места, сколько нужно. Подставь сюда настройку — и одно поле стало бы
  // отвечать за два несовместимых требования: либо сниппет обрывается на
  // полуслове, либо на первом экране остаётся одна строка.
  // Поднятые блоки убраны из ленты: они уже нарисованы выше, и второй раз
  // означал бы два одинаковых ряда мер на одной странице.
  const blocks = filled
    .filter(b => !LEAD_KINDS.has(b.kind))
    .map(b => (b.kind === 'heroSplit' ? { ...b, title } : b))

  return { ...fields, title, description, blocks, faq: override?.faq ?? data.en.faq }
}
