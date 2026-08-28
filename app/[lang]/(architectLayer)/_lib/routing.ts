// ОБЛАСТИ РАСКЛАДКИ — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЕДИНОЙ ЗАВИСИМОСТИ (31-12, 2026-08-29).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ, И ЭТО МЕХАНИЧЕСКОЕ ТРЕБОВАНИЕ, А НЕ ЧИСТОПЛЮЙСТВО. Список
// нужен И серверной странице, И островку. Положи его рядом с чтением диска — и
// клиентский бандл потянет `fs`, а сборка ответит `Module not found: Can't resolve
// 'fs'`. Тот же урок уже оплачен в панели одной упавшей сборкой.
//
// 🔒 СОСТАВ И ПОРЯДОК ПОВТОРЯЮТ СТАНДАРТ `ARCHITECTURE-PARALLEL-ROUTING.md` и
// панель управления. Разойтись им нельзя: в файл пишут оба, и область, известная
// одному и неизвестная другому, исчезнет с экрана при первом же сохранении.

export type SlotName =
  | "header"
  | "promoScreen"
  | "left"
  | "right"
  | "centerHeader"
  | "center"
  | "centerFooter"
  | "footer"

/** Порядок показа: сверху вниз, как области лежат на экране. */
export const SLOT_ORDER: readonly SlotName[] = [
  "header",
  "promoScreen",
  "left",
  "right",
  "centerHeader",
  "center",
  "centerFooter",
  "footer",
]

/** Шапку и подвал снять нельзя — без них страница не собирается. */
export const LOCKED_SLOTS: readonly SlotName[] = ["header", "footer"]

/**
 * Раскладка нового проекта — ОДНА КОЛОНКА (решение владельца 2026-08-08).
 *
 * 🔒 ОТСУТСТВИЕ КЛЮЧА `slots` ЗНАЧИТ ИМЕННО ЭТО, а не «всё выключено». Прежде
 * отсутствующий ключ считался включённым, и свежий сервер стартовал со всеми
 * восемью областями — самая нагруженная раскладка тому, кто ещё ничего не выбрал.
 */
export const DEFAULT_SLOTS: readonly SlotName[] = ["header", "center", "footer"]

/** Два значения, и третьего не бывает: стандарт §0.1. */
export type RoutingMode = "standard" | "parallel"

/**
 * Режим из сырого конфига.
 *
 * 🔒 ДВА ИСТОРИЧЕСКИХ ИМЕНИ ОДНОГО РЕШЕНИЯ ЧИТАЮТСЯ ОБА, а пишется только новое.
 * Старое (`parallelRouting: true`) осталось на серверах, развёрнутых до
 * переименования; перестань его читать — и они молча вернутся в обычный режим.
 */
export function modeOf(config: Record<string, unknown>): RoutingMode {
  return config.routingMode === "parallel" || config.parallelRouting === true ? "parallel" : "standard"
}

/** Какие области включены сейчас: из файла, иначе набор по умолчанию. */
export function activeSlots(config: Record<string, unknown>): SlotName[] {
  const slots = (config.slots ?? {}) as Record<string, unknown>
  return SLOT_ORDER.filter(s =>
    typeof slots[s] === "boolean" ? (slots[s] as boolean) : DEFAULT_SLOTS.includes(s),
  )
}
