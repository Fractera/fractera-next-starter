// СТРАТЕГИЯ АВТОМАТИЗАЦИИ — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЕДИНОЙ ЗАВИСИМОСТИ (112-3, 2026-09-04).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО `dev-mode.ts` И `telegram-sections.ts`
// РЯДОМ: список нужен и серверной странице, и островку. Живи он внутри клиентского
// модуля, Next заменил бы экспорт клиентской ссылкой, и на сервере
// `AUTOMATION_MODES` перестал бы быть массивом — страница отдала бы белый экран,
// видимый только в логе. ✗ это уже оплачено в панели 2026-08-18.
//
// 🔒 ЗДЕСЬ ЭКРАН АРХИТЕКТОРА — ВТОРАЯ ДВЕРЬ, А НЕ ХОЗЯИН. Решение владельца
// 2026-09-04, дословно: переключатель в поле ввода чата «будет по факту первичный и
// основной», а эта секция — «просто дополнительный механизм управления, дверь», и
// «ядро живёт порт 3600». Значение одно и то же — `automationMode` в
// `PLATFORM-CONFIG`; двух правд не заводится.
//
// 🔒 УМОЛЧАНИЕ ОБЯЗАНО СОВПАДАТЬ С ДВУМЯ СОСЕДЯМИ — `config/platform-config.defaults.ts`
// и `lib/fractera/automation-mode.ts` чата. Тот же закон, что у режима разработки:
// разойдясь, три места назовут ненастроенный проект по-разному, и правой окажется
// та копия, которую человек открыл первой.

/**
 * Два режима, названные владельцем.
 *
 * 🔒 ИМЯ — `claude`, А НЕ `cloud`. Поправка владельца 2026-09-04 с адресом
 * первоисточника: продукт называется **Claude Agent SDK**
 * (`https://code.claude.com/docs/en/agent-sdk/overview`); «Cloud» был артефактом
 * распознавания речи и успел попасть в первую редакцию плана.
 */
export const AUTOMATION_MODES = ["claude", "openai"] as const;
export type AutomationMode = (typeof AUTOMATION_MODES)[number];

export function isAutomationMode(v: unknown): v is AutomationMode {
  return typeof v === "string" && (AUTOMATION_MODES as readonly string[]).includes(v)
}

/**
 * Действующий режим проекта.
 *
 * 🔒 УМОЛЧАНИЕ — `claude`, ПРЯМОЕ СЛОВО ВЛАДЕЛЬЦА: «по умолчанию показываем
 * переключатель в состоянии режим Claude агент SDK активен».
 */
export function automationModeOf(config: Record<string, unknown>): AutomationMode {
  const v = config.automationMode
  return isAutomationMode(v) ? v : "claude"
}

/**
 * Выбирал ли человек режим вообще.
 *
 * 🔒 «НЕ ВЫБИРАЛИ» И «ВЫБРАЛИ CLAUDE» — РАЗНЫЕ СОСТОЯНИЯ, и по значению они
 * неотличимы: умолчание подставит `claude` в обоих случаях. Спрашивается ФАКТ
 * ЗАПИСИ — ключ появляется в файле ровно тогда, когда человек переключил. Тот же
 * приём, что у `devModeChosen()` соседнего входа.
 */
export function automationModeChosen(config: Record<string, unknown>): boolean {
  return isAutomationMode(config.automationMode)
}
