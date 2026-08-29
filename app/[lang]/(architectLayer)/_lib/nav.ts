// ПУНКТЫ ДВУХ МЕНЮ — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЗАВИСИМОСТЕЙ (31-14, 2026-08-29).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО И `routing.ts`: форма нужна и
// серверной странице, и островку. Положи её рядом с чтением конфига — и
// клиентский бандл потянет `server-only`.

/** Меню проекта, которыми управляет владелец. Их ровно два. */
export type NavSlot = "top" | "footer"

/**
 * Пункт меню в том виде, в каком он лежит в `APP-CONFIG`.
 *
 * 🔒 ФОРМА ПОВТОРЯЕТ ТУ, ЧТО ЧИТАЕТ САЙТ (`lib/menu/nav-config.ts`), и разойтись
 * им нельзя: сюда пишет эта страница, читает оттуда сайт, и лишнее поле здесь
 * просто исчезнет при чтении — молча, выглядя как несохранённая настройка.
 *
 * 🔒 ВЛОЖЕННЫХ ПУНКТОВ ЗДЕСЬ НЕТ, И ЭТО НАЗВАННЫЙ ПРЕДЕЛ, А НЕ ЗАБЫВЧИВОСТЬ.
 * Читатель сайта умеет `children` — выпадающие списки; редактор их не создаёт,
 * потому что осмысленный ввод вложенности требует перетаскивания, а оно стоит
 * дороже, чем даёт: меню проекта — это пять-семь ссылок. Уже существующие
 * `children` СОХРАНЯЮТСЯ: пункт с детьми правится по подписи и порядку, а его
 * дети едут обратно нетронутыми.
 */
export type NavItem = {
  /** Ключ пункта: он же ключ перевода подписи (`nav.<slot>.<id>.label`). */
  id: string
  href: string
  /** Порядок на сайте: сортировка идёт по нему. */
  order: number
  /** Подпись; пустая — сайт возьмёт имя страницы. */
  label: string
  /** Вложенные пункты, если они уже были: редактор их не трогает. */
  children?: unknown[]
}

/** Кандидат в меню — публичная страница проекта. */
export type NavCandidate = {
  id: string
  href: string
  title: string
}

/** Предел подписи кнопки верхней полосы — тот же, что на сайте. */
export const TOP_LABEL_MAX = 12

/** Перенумеровать по месту в списке: сайт сортирует по `order`. */
export function renumber(items: readonly NavItem[]): NavItem[] {
  return items.map((item, i) => ({ ...item, order: (i + 1) * 10 }))
}

/** Разбор того, что лежит в конфиге. Мусор пропускается, а не ломает страницу. */
export function parseNavItems(raw: unknown): NavItem[] {
  if (!Array.isArray(raw)) return []
  const out: NavItem[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue
    const e = entry as Record<string, unknown>
    const id = typeof e.id === "string" ? e.id : ""
    const href = typeof e.href === "string" ? e.href : ""
    if (!id || !href) continue
    out.push({
      id,
      href,
      order: typeof e.order === "number" ? e.order : 0,
      label: typeof e.label === "string" ? e.label : "",
      children: Array.isArray(e.children) ? (e.children as unknown[]) : undefined,
    })
  }
  return out.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}
