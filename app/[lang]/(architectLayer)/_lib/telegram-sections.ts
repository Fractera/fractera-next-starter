// РАЗДЕЛЫ ВХОДА «TELEGRAM-БОТ» — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЗАВИСИМОСТЕЙ (77-1, 2026-08-31;
// расширено до шести 77-15, 2026-09-01).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО `design-sections.ts` И `dev-mode.ts`
// РЯДОМ: список нужен и серверной странице, и левому меню. Живи он внутри
// клиентского островка, Next заменил бы экспорт клиентской ссылкой, и на сервере
// `TELEGRAM_SECTIONS` перестал бы быть массивом — страница отдала бы белый экран,
// видимый только в логе. ✗ это уже оплачено в панели: владелец нашёл белый экран
// 2026-08-18, и причина была ровно такой.
//
// 🔒 ПОРЯДОК НАЗВАН ВЛАДЕЛЬЦЕМ ДОСЛОВНО И ДВАЖДЫ. Сначала (2026-08-31): «первая
// вкладка описание, вторая вкладка логи, третья вкладка настройки». Затем
// (2026-09-01): «после кнопки описания добавляем кнопку команды», «после кнопки
// логи ты создаёшь ещё две вкладки: календарь… карта». Отсюда шесть, и порядок
// повторяет порядок знакомства: что это → как с ним говорить → что он делал →
// что запомнил (время и место) → как он настроен.
//
// 🔒 ПОЛЬЗОВАТЕЛЕЙ ЗДЕСЬ НЕТ, И ЭТО РЕШЕНИЕ, А НЕ НЕДОСМОТР. Его слова: «там не
// будет пользователей». Вход отвечает за одну способность — бота, — а учётные
// записи живут своей жизнью и своей группой прав.

export const TELEGRAM_SECTIONS = [
  "about",
  "commands",
  "logs",
  "calendar",
  "map",
  "settings",
] as const
export type TelegramSection = (typeof TELEGRAM_SECTIONS)[number]

export function isTelegramSection(v: unknown): v is TelegramSection {
  return typeof v === "string" && (TELEGRAM_SECTIONS as readonly string[]).includes(v)
}

/**
 * Какой раздел открыт.
 *
 * 🔒 НЕИЗВЕСТНОЕ ЗНАЧЕНИЕ ПАДАЕТ НА ПЕРВЫЙ РАЗДЕЛ, А НЕ НА ПУСТОЙ ЭКРАН. Адрес
 * приходит из строки браузера, то есть от кого угодно; «нет такого раздела»
 * человек читает как поломку проекта, а не как свою опечатку. Тот же закон, что у
 * соседних входов слоя.
 */
export function resolveTelegramSection(raw: string | undefined): TelegramSection {
  return isTelegramSection(raw) ? raw : "about"
}

/** Адрес раздела внутри входа. */
export function hrefOfTelegramSection(lang: string, section: TelegramSection): string {
  return `/${lang}/architect/telegram?section=${section}`
}

// ── Верхнее меню раздела «Логи» (77-15, 2026-09-01) ─────────────────────────
//
// 🔒 ЭТО ВТОРОЙ УРОВЕНЬ, А НЕ ЕЩЁ ПЯТЬ РАЗДЕЛОВ СЛЕВА. Заказ владельца: «эта
// вкладка получит в своём правом контейнере наше стандартное верхнее липкое
// меню». Слева — О ЧЁМ раздел, сверху — НА ЧТО СМОТРИМ внутри него. Положи мы
// «медиатеку» в левое меню, вход про бота начал бы отвечать за хранилища проекта.
//
// 🔒 РАЗМЕТКУ ДАЁТ `WorkspaceShell` СВОИМ СВОЙСТВОМ `tabs` — тем самым липким
// рядом, который в раскладке был с самого начала и до сих пор не использовался
// никем. Своя полоса вкладок здесь была бы второй копией готового.
export const TELEGRAM_LOG_VIEWS = ["messages", "db", "media", "vectors", "rag"] as const
export type TelegramLogView = (typeof TELEGRAM_LOG_VIEWS)[number]

export function isTelegramLogView(v: unknown): v is TelegramLogView {
  return typeof v === "string" && (TELEGRAM_LOG_VIEWS as readonly string[]).includes(v)
}

/** Какой вид логов открыт. Неизвестное значение падает на первый — тот же закон. */
export function resolveTelegramLogView(raw: string | undefined): TelegramLogView {
  return isTelegramLogView(raw) ? raw : "messages"
}

/** Адрес вида внутри раздела «Логи». */
export function hrefOfTelegramLogView(lang: string, view: TelegramLogView): string {
  return `/${lang}/architect/telegram?section=logs&view=${view}`
}
