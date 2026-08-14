import type { Block } from '@/lib/content/blocks/types'
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
  blocks: Block[]
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
  return blocks.map(b => {
    if ('children' in b) return { ...b, children: fillBlocks(b.children, admin, lang) }
    if (b.kind === 'olist' || b.kind === 'list') return { ...b, items: b.items.map(i => fill(i, admin, lang)) }
    if (b.kind === 'cta') {
      const href = fill(b.href, admin, lang)
      // Кнопка без адреса — не кнопка: превращаем в обычный абзац.
      return admin ? { ...b, href } : { kind: 'p' as const, text: b.text }
    }
    if ('text' in b) return { ...b, text: fill(b.text, admin, lang) }
    return b
  })
}

/** Содержимое главной на языке: перевод, иначе английская основа. */
export function homePage(lang: string): HomeCell {
  const override = data.overrides[lang]
  const fields = resolveFields(data.en, override ?? {}, ['title', 'description'] as const)
  const body = resolveLocalizedBody({ blocks: data.en.blocks }, override ? { blocks: override.blocks } : undefined)

  const cfg = getAppConfig()
  const admin = adminUrlFromSite(cfg.url) ?? ''

  // 🔒 ЗАГОЛОВОК ГЕРОЯ — ДВА СОСТОЯНИЯ, И ЭТО СМЫСЛОВАЯ РАЗНИЦА. Пока имя в
  // настройках не менялось, стоит не «Fractera», а «Это ваше приложение»: имя
  // шаблона на чужом сайте — реклама платформы за счёт клиента. Сохранил своё
  // имя — оно и в заголовке, а текст-заглушка исчезает навсегда.
  const named = Boolean(cfg.name) && cfg.name !== DEFAULT_APP_CONFIG.name
  const blocks = fillBlocks(body.blocks, admin, lang).map(b =>
    b.kind === 'hero' && named ? { ...b, title: cfg.name, subtitle: cfg.description ?? b.subtitle } : b,
  )

  return { ...fields, blocks }
}
