// РЕЖИМЫ РАЗРАБОТКИ — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЕДИНОЙ ЗАВИСИМОСТИ (33-1, 2026-08-29).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ, И ЭТО ОПЛАЧЕНО БЕЛЫМ ЭКРАНОМ В ПАНЕЛИ (владелец нашёл
// 2026-08-18). Список режимов жил там внутри клиентского островка, а серверная
// страница импортировала его оттуда; Next заменяет экспорты клиентского модуля
// КЛИЕНТСКИМИ ССЫЛКАМИ, и на сервере `MODES` переставал быть массивом —
// `MODES.includes(...)` падал, страница отдавала пустой экран. В логе видно, в
// браузере нет: просто белое.
//
// 🔒 ПОРЯДОК СМЫСЛОВОЙ, А НЕ АЛФАВИТНЫЙ: от «ничего не требую» к «требую больше
// всего». `migration` стоит последним не по возрасту, а потому что это
// единственный режим с ВНЕШНИМ источником — чужим проектом: без него он не
// начинается вовсе.
//
// 🔒 СОСТАВ И ИМЕНА ПОВТОРЯЮТ `lib/development-mode.ts` ПАНЕЛИ ОДИН В ОДИН.
// Разойтись им нельзя: в `PLATFORM-CONFIG.developmentMode` пишут оба редактора, а
// читает значение агент этого проекта на старте сессии. Режим, известный одному и
// неизвестный другому, превратится в `classic` молча.

export const DEV_MODES = ["classic", "steps", "cases", "migration"] as const
export type DevMode = (typeof DEV_MODES)[number]

export function isDevMode(v: unknown): v is DevMode {
  return typeof v === "string" && (DEV_MODES as readonly string[]).includes(v)
}

/**
 * Действующий режим проекта.
 *
 * 🔒 УМОЛЧАНИЕ — `classic`, И ЭТО РЕШЕНИЕ ВЛАДЕЛЬЦА 2026-08-18, ОТМЕНИВШЕЕ
 * ПРЕЖНЕЕ `cases`. Довод «умолчанием стоит то, ради чего платформа существует»
 * оказался ценой для человека: режим кейсов ТРЕБУЕТ работы — описать продукт,
 * пройти опрос, подтвердить кейсы, — и требовал её раньше, чем владелец решил,
 * нужны ли ему кейсы вообще. Свежий проект встречал его тревогой за то, чего он не
 * выбирал. `classic` не требует ничего: спросил — сделали.
 */
export function devModeOf(config: Record<string, unknown>): DevMode {
  return isDevMode(config.developmentMode) ? config.developmentMode : "classic"
}

/**
 * Режим ВЫБРАН осознанно? Это НЕ то же самое, что «какой режим действует».
 *
 * 🔒 РАЗНИЦА СОДЕРЖАТЕЛЬНАЯ (владелец 2026-08-19). Действующий режим есть всегда:
 * молчание конфига читается как `classic`. Значит по ЗНАЧЕНИЮ «не выбрано»
 * неотличимо от «выбран классический», и отметка, построенная на значении, либо не
 * загорится никогда, либо не погаснет никогда.
 *
 * Спрашивается ФАКТ ЗАПИСИ: ключ появляется в файле ровно тогда, когда человек
 * нажал кнопку. Оставить текущий режим — такой же осознанный выбор, как сменить
 * его, и он тоже записывается. Тот же приём, что у языков: отметка о ПОСТУПКЕ
 * вместо проверки значения, которую сделать невозможно.
 */
export function devModeChosen(config: Record<string, unknown>): boolean {
  return isDevMode(config.developmentMode)
}

/** Какая подвкладка открыта; неизвестное значение падает на действующий режим. */
export function resolveDevMode(raw: string | undefined, current: DevMode): DevMode {
  return isDevMode(raw) ? raw : current
}

/**
 * Ветка переезда в конфиге.
 *
 * 🔒 ФОРМА ВЗЯТА У ЧИТАТЕЛЯ, А НЕ ПРИДУМАНА ЗДЕСЬ: её читает агент этого проекта
 * на старте вместе с режимом (`CLAUDE.md`, раздел «Development modes»). Лишнее
 * поле там просто исчезнет при чтении, выглядя как несохранённая настройка.
 */
export type MigrationSource = {
  source?: string
  repositoryUrl?: string
  declaredAt?: string
}

export function migrationOf(config: Record<string, unknown>): MigrationSource {
  const raw = config.migration
  if (!raw || typeof raw !== "object") return {}
  const m = raw as Record<string, unknown>
  return {
    source: typeof m.source === "string" ? m.source : undefined,
    repositoryUrl: typeof m.repositoryUrl === "string" ? m.repositoryUrl : undefined,
    declaredAt: typeof m.declaredAt === "string" ? m.declaredAt : undefined,
  }
}
