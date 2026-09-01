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
  /**
   * СЛОВА РАЗДЕЛА «НАСТРОЙКИ» — ПЕРЕНЕСЕНЫ ИЗ ПАНЕЛИ ДОСЛОВНО (77-4, 2026-09-01),
   * из `admin-translations.json` → `channels`.
   *
   * 🔒 ПЕРЕВОД НЕ ПИШЕТСЯ ЗАНОВО. Он выверен на живых людях и правился не раз;
   * «сказать то же самое своими словами» здесь означает завести второй текст,
   * который разойдётся с первым и будет расходиться дальше.
   * Изменено ровно одно: строка про базу знаний потеряла ссылку в панель —
   * такой страницы у гостя нет, а ссылка в чужой контур хуже её отсутствия.
   */
  settings: {
    serviceDown: string
    noToken: string
    notLinked: string
    /** `{who}` — имя привязанной учётной записи. */
    linkedTo: string
    tokenRejected: string
    currentBot: string
    tokenLabel: string
    tokenPlaceholder: string
    tokenReplace: string
    save: string
    saving: string
    saved: string
    failed: string
    connect: string
    relink: string
    waiting: string
    openTelegram: string
    linkedToast: string
    linkTimeout: string
    linkExpired: string
    linkFailed: string
    channelOn: string
    answersFrom: string
    neverInvents: string
    scheduleLabel: string
    scheduleHint: string
    scheduleOff: string
    /** `{n}` — шаг в секундах. */
    scheduleEvery: string
    scheduleSaved: string
    helpLabel: string
    helpWhatTitle: string
    helpWhat: string
    helpWhyTitle: string
    helpWhy: string
    helpLinkTitle: string
    helpLink: string
    helpOffTitle: string
    helpOff: string
  }
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
  settings: {
    serviceDown: "The channels service is not running, so nothing can be set up here yet.",
    noToken: "no token yet",
    notLinked: "token saved, account not linked",
    linkedTo: "linked to {who}",
    tokenRejected:
      "The token is saved, but Telegram does not recognise it. Either it was mistyped, or it was revoked in @BotFather — get a fresh one there and save it again.",
    currentBot: "Current bot:",
    tokenLabel: "Bot token from @BotFather",
    tokenPlaceholder: "123456789:AA…",
    tokenReplace: "Paste a new token to replace the saved one",
    save: "Save",
    saving: "Saving…",
    saved: "Bot token saved",
    failed: "Action failed",
    connect: "Connect your account",
    relink: "Link another account",
    waiting: "Waiting for START in Telegram…",
    openTelegram: "open Telegram",
    linkedToast: "Linked to",
    linkTimeout: "Linking timed out — press Connect again.",
    linkExpired: "The code expired — press Connect again.",
    linkFailed: "Linking could not be started.",
    channelOn: "Channel active",
    answersFrom: "Once linked, the bot answers from the knowledge base of this project.",
    neverInvents:
      "It never invents an answer: with the base empty or the service off, it says so.",
    scheduleLabel: "Schedule",
    scheduleHint:
      "How often the product is asked whether a reminder has come due. Reminders have to fire while nobody is looking at the site, so something has to knock — this is it. Off means the project has no reminders and pays for none.",
    scheduleOff: "Off",
    scheduleEvery: "Every {n} sec",
    scheduleSaved: "Schedule saved",
    helpLabel: "What a channel is, and what it is not",
    helpWhatTitle: "What this gives you.",
    helpWhat:
      "A door into your project from a messenger instead of a browser. A person writes to your bot and gets an answer built from your own knowledge base — no separate app, no login screen.",
    helpWhyTitle: "Why your own bot and not ours.",
    helpWhy:
      "The token belongs to a bot you created, so the conversation runs between your visitors and your server. Nothing passes through us, and if you ever move the server the bot moves with the token.",
    helpLinkTitle: "Why linking needs a one-time code.",
    helpLink:
      "The link is opened inside a messenger, where it is visible to anyone who sees the screen. A code that worked twice would let someone else attach their account to your project, so it works once and expires.",
    helpOffTitle: "Turning the channel off.",
    helpOff:
      "The switch stops the bot answering without deleting the token or the link — useful while you are changing the knowledge base and would rather nobody got half-built answers.",
  },
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
  settings: {
    serviceDown: "Служба каналов не запущена, поэтому настроить здесь пока нечего.",
    noToken: "токен не задан",
    notLinked: "токен сохранён, учётная запись не привязана",
    linkedTo: "привязано к {who}",
    tokenRejected:
      "Токен сохранён, но Telegram его не узнаёт. Либо он набран с ошибкой, либо отозван в @BotFather — получите там новый и сохраните снова.",
    currentBot: "Текущий бот:",
    tokenLabel: "Токен бота от @BotFather",
    tokenPlaceholder: "123456789:AA…",
    tokenReplace: "Вставьте новый токен, чтобы заменить сохранённый",
    save: "Сохранить",
    saving: "Сохраняю…",
    saved: "Токен бота сохранён",
    failed: "Действие не выполнено",
    connect: "Привязать свою учётную запись",
    relink: "Привязать другую учётную запись",
    waiting: "Жду нажатия «Старт» в Telegram…",
    openTelegram: "открыть Telegram",
    linkedToast: "Привязано к",
    linkTimeout: "Привязка не дождалась ответа — нажмите «Привязать» снова.",
    linkExpired: "Код истёк — нажмите «Привязать» снова.",
    linkFailed: "Привязку начать не удалось.",
    channelOn: "Канал включён",
    answersFrom: "После привязки бот отвечает из базы знаний этого проекта.",
    neverInvents:
      "Ответ он не выдумывает: если база пуста или служба выключена, он так и говорит.",
    scheduleLabel: "Расписание",
    scheduleHint:
      "Как часто у приложения спрашивают, не наступило ли напоминание. Напоминание обязано сработать, когда на сайт никто не смотрит, — значит кто-то должен постучать, и это он. «Выключено» означает, что напоминаний в проекте нет и платить за них не нужно.",
    scheduleOff: "Выключено",
    scheduleEvery: "Каждые {n} сек",
    scheduleSaved: "Расписание сохранено",
    helpLabel: "Что такое канал и чем он не является",
    helpWhatTitle: "Что это даёт.",
    helpWhat:
      "Дверь в ваш проект из мессенджера, а не из браузера. Человек пишет вашему боту и получает ответ, собранный из вашей же базы знаний, — без отдельного приложения и без страницы входа.",
    helpWhyTitle: "Почему свой бот, а не наш.",
    helpWhy:
      "Токен принадлежит боту, которого создали вы, поэтому разговор идёт между вашими посетителями и вашим сервером. Через нас не проходит ничего, а если вы переедете на другой сервер, бот переедет вместе с токеном.",
    helpLinkTitle: "Почему привязке нужен одноразовый код.",
    helpLink:
      "Ссылка открывается в мессенджере, где её видит всякий, кто видит экран. Код, работающий дважды, позволил бы кому-то другому привязать к вашему проекту свою учётную запись — поэтому он работает один раз и истекает.",
    helpOffTitle: "Что делает выключение канала.",
    helpOff:
      "Переключатель останавливает ответы бота, не удаляя ни токен, ни привязку, — это удобно, пока вы меняете базу знаний и не хотите, чтобы кто-то получал недостроенные ответы.",
  },
}

const DICT: Record<string, TelegramUi> = { en: EN, ru: RU }

export function telegramUi(lang: string): TelegramUi {
  return DICT[lang] ?? DICT.en
}
