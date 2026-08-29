// ПУНКТЫ ДВУХ МЕНЮ — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЗАВИСИМОСТЕЙ (31-14, 2026-08-29).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО И `routing.ts`: форма нужна и
// серверной странице, и островку. Положи её рядом с чтением конфига — и
// клиентский бандл потянет `server-only`.

/** Меню проекта, которыми управляет владелец. Их ровно два. */
export type NavSlot = "top" | "footer"

/**
 * Вложенный пункт — то, что сайт показывает выпадающим списком.
 *
 * 🔒 ФОРМА ВЗЯТА У ЧИТАТЕЛЯ (`toChild` в `lib/menu/nav-config.ts`): три поля, и
 * лишнее исчезнет при чтении молча, выглядя как несохранённая настройка.
 */
export type NavChild = {
  id: string
  href: string
  label: string
}

/**
 * Пункт меню в том виде, в каком он лежит в `APP-CONFIG`.
 *
 * 🔒 ФОРМА ПОВТОРЯЕТ ТУ, ЧТО ЧИТАЕТ САЙТ (`lib/menu/nav-config.ts`), и разойтись
 * им нельзя: сюда пишет эта страница, читает оттуда сайт.
 *
 * 🔒 ГЛУБИНА РОВНО ДВА, И ЭТО ПРЕДЕЛ ЧИТАТЕЛЯ, А НЕ РЕДАКТОРА (31-23, 2026-08-29).
 * `toChild` не смотрит на `children` ребёнка — третий уровень сохранился бы в файл
 * и не появился бы на сайте: настройка, которая пишется и не действует, хуже
 * отсутствующей. Поэтому редактор его и не предлагает.
 */
export type NavItem = {
  /** Ключ пункта: он же ключ перевода подписи (`nav.<slot>.<id>.label`). */
  id: string
  href: string
  /** Порядок на сайте: сортировка идёт по нему. */
  order: number
  /** Подпись; пустая — сайт возьмёт имя страницы. */
  label: string
  /** Вложенные пункты: сайт покажет их выпадающим списком. */
  children?: NavChild[]
}

/** Кандидат в меню — публичная страница проекта. */
export type NavCandidate = {
  id: string
  href: string
  title: string
  /**
   * Раздел карты сайта: по нему кандидаты собираются в ветки дерева.
   *
   * 🔒 ПРИЗНАК БЕРЁТСЯ У САМОЙ ПОВЕРХНОСТИ (`lib/aio/surfaces.ts`), а не выводится
   * из адреса: список соответствий пришлось бы вести руками, и новая страница
   * молча попадала бы не в ту ветку.
   */
  section: string
}

/** Предел подписи кнопки верхней полосы — тот же, что на сайте. */
export const TOP_LABEL_MAX = 12

/** Перенумеровать по месту в списке: сайт сортирует по `order`. */
export function renumber(items: readonly NavItem[]): NavItem[] {
  return items.map((item, i) => ({ ...item, order: (i + 1) * 10 }))
}

/** Разбор вложенных пунктов: мусор пропускается, а не ломает страницу. */
function parseChildren(raw: unknown): NavChild[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out: NavChild[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue
    const e = entry as Record<string, unknown>
    const id = typeof e.id === "string" ? e.id : ""
    const href = typeof e.href === "string" ? e.href : ""
    if (!id || !href) continue
    out.push({ id, href, label: typeof e.label === "string" ? e.label : "" })
  }
  return out
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
      children: parseChildren(e.children),
    })
  }
  return out.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}

/**
 * Ветка дерева кандидатов.
 *
 * 🔒 ДЕРЕВО, А НЕ ПЛОСКИЙ РЯД КНОПОК (решение владельца 2026-08-29): «сейчас у нас
 * три страницы и это уже занимает половина экрана… невозможно правильным образом
 * работать с большим проектом». Ряд кнопок растёт линейно с числом страниц, и на
 * тридцати страницах список кандидатов вытесняет с экрана само меню, ради которого
 * человек сюда пришёл.
 */
export type CandidateNode = {
  candidate: NavCandidate
  children: NavCandidate[]
}

/**
 * Сложить плоский список кандидатов в дерево.
 *
 * 🔒 ВЕТВЬ ОПРЕДЕЛЯЕТСЯ АДРЕСОМ, А НЕ РАЗДЕЛОМ. `/blog/post` принадлежит `/blog`
 * потому, что так устроен адрес, и это верно для любого проекта. Раздел (`section`)
 * — свойство карты сайта, и по нему в одну кучу попали бы страницы, не вложенные
 * друг в друга.
 *
 * Родителя в списке может не быть (страница `/blog` не публичная, а посты есть) —
 * тогда сирота остаётся корнем: спрятать её под несуществующую ветку значит убрать
 * из выбора.
 */
export function candidateTree(list: readonly NavCandidate[]): CandidateNode[] {
  const roots: CandidateNode[] = []
  const byHref = new Map<string, CandidateNode>()

  // Короткие адреса раньше длинных: родитель обязан появиться до своих детей.
  const sorted = [...list].sort((a, b) => a.href.length - b.href.length || a.href.localeCompare(b.href))

  for (const c of sorted) {
    const cut = c.href.lastIndexOf("/")
    const parentHref = cut > 0 ? c.href.slice(0, cut) : ""
    const parent = parentHref ? byHref.get(parentHref) : undefined
    if (parent) {
      parent.children.push(c)
      continue
    }
    const node: CandidateNode = { candidate: c, children: [] }
    byHref.set(c.href, node)
    roots.push(node)
  }

  return roots
}
