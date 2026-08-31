// СЛОВА ВХОДА «TELEGRAM-БОТ» (77-1, 2026-08-31).
//
// 🔒 СЛОВАРЬ СЕРВЕРНЫЙ. Ни один файл с `"use client"` не имеет права импортировать
// его значением: тогда все языки уезжают в браузер на каждой странице слоя.
// Серверная страница резолвит и передаёт островкам СТРОКИ ПОИМЁННО — закон,
// оплаченный в 76-4 замером отданной разметки.
//
// 🔒 ДВА ЯЗЫКА, А НЕ 82. Слой архитектора живёт на `en` и `ru`; 82 языка — у
// панели и у слоя авторизации, потому что там воронка и мы не знаем, из какой
// страны придёт покупатель. Сюда приходит хозяин проекта, и он уже пришёл.

export type TelegramUi = {
  /** Заголовок входа — он же подпись кнопки в подвале. */
  title: string
  /** Подпись группы в левом меню. */
  menuTitle: string
  subtitle: string
  pages: Record<
    "about" | "logs" | "settings",
    { title: string; hint: string }
  >
  /** Свёрнутая справка раздела «Описание». */
  helpMore: string
  helpLess: string
  aboutSoonTitle: string
  aboutSoon: string
  /** Заглушки двух рабочих разделов. */
  soonTitle: string
  soonLead: string
  soonWhere: string
  soonPanel: string
}

const EN: TelegramUi = {
  title: "Telegram bot",
  menuTitle: "Telegram bot",
  subtitle:
    "The bot that talks to people on behalf of this project: what it is, what it has been doing, and how it is set up.",
  pages: {
    about: {
      title: "About",
      hint: "What the bot is for in this project and how it is arranged.",
    },
    logs: {
      title: "Logs",
      hint: "What the bot has actually been doing — messages, answers, refusals.",
    },
    settings: {
      title: "Settings",
      hint: "The token, the connection and everything the bot needs in order to answer.",
    },
  },
  helpMore: "Learn more",
  helpLess: "Collapse",
  aboutSoonTitle: "This description is being written.",
  aboutSoon:
    "The section exists and its place is taken; the text and the picture that explain how the bot is arranged in this project are still being prepared. Nothing is broken here — there is simply nothing written yet.",
  soonTitle: "This section is not built yet",
  soonLead:
    "The place for it is here, and it is deliberately empty rather than hidden: a section that appears out of nowhere later is harder to notice than one that says it is coming.",
  soonWhere: "Where this works today:",
  soonPanel: "the Channels tab of the control panel — the link to it is in the site footer.",
}

const RU: TelegramUi = {
  title: "Telegram-бот",
  menuTitle: "Telegram-бот",
  subtitle:
    "Бот, который говорит с людьми от имени этого проекта: что это такое, что он делал и как он настроен.",
  pages: {
    about: {
      title: "Описание",
      hint: "Зачем боту существовать в этом проекте и как он устроен.",
    },
    logs: {
      title: "Логи",
      hint: "Что бот на самом деле делал — сообщения, ответы, отказы.",
    },
    settings: {
      title: "Настройки",
      hint: "Токен, связь и всё, без чего бот не отвечает.",
    },
  },
  helpMore: "Узнать больше",
  helpLess: "Свернуть",
  aboutSoonTitle: "Это описание сейчас пишется.",
  aboutSoon:
    "Раздел существует, и место под него занято; текст и изображение, объясняющие, как устроен бот в этом проекте, ещё готовятся. Здесь ничего не сломано — здесь пока просто ничего не написано.",
  soonTitle: "Этот раздел ещё не построен",
  soonLead:
    "Место под него здесь, и оно намеренно пустое, а не спрятанное: раздел, появившийся потом из ниоткуда, заметить труднее, чем тот, который сам сказал, что он будет.",
  soonWhere: "Где это работает сегодня:",
  soonPanel: "вкладка «Каналы связи» панели управления — ссылка на неё в подвале сайта.",
}

const DICT: Record<string, TelegramUi> = { en: EN, ru: RU }

export function telegramUi(lang: string): TelegramUi {
  return DICT[lang] ?? DICT.en
}
