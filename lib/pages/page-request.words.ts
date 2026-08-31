// СЛОВА ЗАЯВКИ НА ТЕКСТ СТРАНИЦЫ — ЧИТАЕТ САМ ОСТРОВОК (шаг 69, 2026-08-31).
//
// ✗ ЧЕМ ОПЛАЧЕН ЭТОТ ФАЙЛ. Сначала слова резолвил сервер и отдавал пропсами — по
// закону слоя «островку только его слова, перечисленные поимённо». Закон был
// соблюдён, и результат всё равно оказался не тот: измерено на живом сервере —
// кнопки в разметке нет (её видит только архитектор), а её СЛОВА стоят в полезной
// нагрузке у каждого посетителя политики конфиденциальности.
// **По проводу уезжает всё переданное, даже неотрисованное.**
//
// 🔒 ЗДЕСЬ ИМПОРТ СЛОВАРЯ В КЛИЕНТ ДЁШЕВ РОВНО ПОТОМУ, ЧТО СЛОВАРЬ КРОШЕЧНЫЙ:
// два языка, тринадцать строк, и он всё равно лежит в бандле вместе с островком.
// Запрет «клиентский файл не импортирует словарь» писался про 82 языка на 600
// ключей, где цена — мегабайты на каждой странице. Правило живо; случай другой, и
// разница названа, а не обойдена молча.
//
// 🔒 ЯЗЫКОВ ДВА, И ЭТО ПОЛНОЕ РЕШЕНИЕ, А НЕ ДОЛГ. Строки страницы идут по
// включённому набору языков проекта; все 82 обязаны нести только
// переиспользуемые части продукта — меню, тосты, отказы.

/** Слова кнопки и окна ПЛЮС общие слова заявки: всё, что нужно варианту В. */
export type PageRequestWords = {
  /** Кнопка под заглушкой и заголовок её окна. */
  label: string
  title: string
  lead: string
  /** Поле, кнопки, тост — то же, что у заявки из каталога блоков. */
  whatLabel: string
  whatPlaceholder: string
  send: string
  sending: string
  cancel: string
  toastTitle: string
  toastWhere: string
  toastNext: string
  toastGot: string
  toastFailed: string
}

const WORDS: Record<string, PageRequestWords> = {
  en: {
    label: "Ask the project to write this text",
    title: "Text for the page «%s»",
    lead:
      "Say in your own words what this document must cover — the request goes to the project inbox, and the agent will write it when you ask him to start. Nothing happens on its own.",
    whatLabel: "What this text must cover",
    whatPlaceholder:
      "For example: we collect only an email for the newsletter, store it in the EU, and delete it on request within 30 days. No third-party analytics.",
    send: "Send to the agent",
    sending: "Sending…",
    cancel: "Cancel",
    toastTitle: "Request created:",
    toastWhere: "It waits in development-docs/development-steps/pre-steps/",
    toastNext:
      "Nothing starts on its own: when the agent finishes his current stage, ask him to plan this request.",
    toastGot: "Understood",
    toastFailed: "The request was not created. Nothing was saved — try again.",
  },
  ru: {
    label: "Попросить проект написать этот текст",
    title: "Текст страницы «%s»",
    lead:
      "Своими словами скажите, что этот документ должен охватывать. Заявка ляжет в приёмную проекта, и агент напишет текст, когда вы скажете ему начать. Само ничего не произойдёт.",
    whatLabel: "Что должен охватывать этот текст",
    whatPlaceholder:
      "Например: собираем только адрес почты для рассылки, храним в ЕС, удаляем по запросу в течение 30 дней. Сторонней аналитики нет.",
    send: "Отправить агенту",
    sending: "Отправляю…",
    cancel: "Отмена",
    toastTitle: "Заявка создана:",
    toastWhere: "Она ждёт в development-docs/development-steps/pre-steps/",
    toastNext:
      "Само ничего не начнётся: когда агент закончит текущий этап, попросите его запланировать эту заявку.",
    toastGot: "Понятно",
    toastFailed: "Заявка не создана. Ничего не сохранено — попробуйте ещё раз.",
  },
}

export function pageRequestWords(lang: string): PageRequestWords {
  return WORDS[lang] ?? WORDS.en
}
