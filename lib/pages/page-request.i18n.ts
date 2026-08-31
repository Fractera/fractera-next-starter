import type { RequestCommonUi } from "@/components/request/pre-step-request.client"

// ОБЩИЕ СЛОВА ЗАЯВКИ ДЛЯ СТРАНИЦ ПОДВАЛА (шаг 69, 2026-08-31).
//
// 🔒 ПОЧЕМУ НЕ ВЗЯТЬ ИХ У КАТАЛОГА БЛОКОВ. Его словарь живёт в
// `app/[lang]/(architectLayer)/_i18n/` — приватной папке ЧУЖОЙ группы прав, а
// страницы подвала стоят в публичном слое. Закон корпуса: группа прав не
// импортирует у соседа. Поднимать весь словарь слоя ради десяти строк значило бы
// втащить в публичный слой всё оформление архитектора.
//
// 🔒 ЗДЕСЬ ТОЛЬКО ОБЩЕЕ, И ЭТО ВИДНО ПО ТИПУ. Слов про блоки — «предложить правку
// блока», «роль и ограничения» — тут нет вовсе: страница их не показывает.
// Заголовок, лид и подпись кнопки варианта В живут рядом со словами заглушки,
// в `notice.i18n.ts`, потому что кнопка есть часть заглушки.
//
// Языков два, и это ПОЛНОЕ решение, а не долг: строки страницы идут по
// включённому набору языков проекта. Все 82 обязаны нести только
// переиспользуемые части продукта — меню, тосты, отказы.
const UI: Record<string, RequestCommonUi> = {
  en: {
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

export function blockRequestUi(lang: string): RequestCommonUi {
  return UI[lang] ?? UI.en
}
