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
  /**
   * СЛОВА РАЗДЕЛА «ЛОГИ» — НАПИСАНЫ ЗДЕСЬ, А НЕ ПЕРЕНЕСЕНЫ (77-5, 2026-09-01).
   *
   * 🔒 И ЭТО СКАЗАНО ВСЛУХ ИМЕННО ПОТОМУ, ЧТО ОСТАЛЬНОЙ ВХОД — ПЕРЕНОС. В панели
   * экрана логов нет вовсе: служба хранила входящие с самого начала, и читал их
   * только код. Не найдя источника, легко решить, что «перевод потерялся».
   */
  /**
   * СЛОВА РАЗДЕЛА «ОПИСАНИЕ» (77-6, 2026-09-01).
   *
   * 🔒 НАПИСАНЫ ПО КОДУ СЛУЖБЫ И ПРОДУКТА, А НЕ ПО ПАМЯТИ И НЕ ПО НАВЫКУ. Три
   * утверждения, которые «все знали», оказались устаревшими: голос расшифровывается,
   * сообщения уезжают в сам проект, файлы попадают в медиатеку. Каждая строка ниже
   * проверена в первоисточнике — иначе описание обещает то, чего нет, или молчит о
   * том, что есть.
   */
  /**
   * СЛОВА БЛОКА «КЛЮЧ OPENAI» (77-8, 2026-09-01).
   *
   * 🔒 ОСТАТОК ПО СЧЁТУ НЕ ОБЕЩАН НИ ОДНОЙ СТРОКОЙ, И ЭТО ИЗМЕРЕНО, А НЕ
   * ПРЕДПОЛОЖЕНО: OpenAI отдаёт баланс только браузерной сессии кабинета либо
   * админскому ключу с правом api.usage.read. Поэтому есть строка, которая
   * объясняет это человеку, а не пустое поле «остаток: —».
   */
  openai: {
    title: string
    lead: string
    exists: string
    missing: string
    partial: string
    consumerApp: string
    consumerData: string
    consumerGraph: string
    keyLabel: string
    keyPlaceholder: string
    keyReplace: string
    save: string
    saving: string
    saved: string
    failed: string
    badFormat: string
    check: string
    checking: string
    valid: string
    invalid: string
    funded: string
    noFunds: string
    fundsUnknown: string
    balanceNote: string
    restartNote: string
  }

  about: {
    /**
     * ПЕРВЫЙ АБЗАЦ ОПИСАНИЯ (77-10, 2026-09-01, заказ владельца).
     *
     * 🔒 ОН ОБЪЯСНЯЕТ, ЧЕМ БОТ ЯВЛЯЕТСЯ, А НЕ ЧТО ОН УМЕЕТ. Список умений идёт
     * ниже и отвечает на другой вопрос. Человек, не понявший ЗАЧЕМ здесь бот,
     * читает список умений как набор случайных возможностей.
     */
    demoTitle: string
    demoWhat: string
    demoWriteTitle: string
    demoWrite: string
    demoReadTitle: string
    demoRead: string
    demoWhy: string
    whatTitle: string
    what: string
    arrangedTitle: string
    arranged: string
    canTitle: string
    can: string[]
    cannotTitle: string
    cannot: string[]
    boundaryTitle: string
    boundary: string
    startTitle: string
    start: string
  }

  logs: {
    title: string
    lead: string
    /** Три причины пустоты — у каждой своё лечение. */
    emptyNoToken: string
    emptyNotLinked: string
    emptyNoMessages: string
    refresh: string
    refreshing: string
    live: string
    /** `{n}` — сколько записей показано. */
    counted: string
    /** Пометка о пределе склада службы. */
    ringNote: string
    /** Кто сказал реплику — человек или бот (77-11). */
    fromBot: string
    fromPerson: string
    kindVoice: string
    kindFile: string
    kindLocation: string
    forwarded: string
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
  logs: {
    title: "What the bot has heard",
    lead:
      "Everything that reaches the bot is kept by the channels service — the last 500 messages, whatever it then did with them. This is that record, oldest first — it reads as a conversation.",
    emptyNoToken:
      "Nothing here yet, and the reason is simple: the bot has no token. Save one in Settings and it starts listening.",
    emptyNotLinked:
      "The bot is alive but no account is linked yet, so nobody has written to it. Link yours in Settings and the first message appears here.",
    emptyNoMessages:
      "The bot is set up and listening — nobody has written to it yet. This page is empty because there is nothing to show, not because something failed.",
    refresh: "Refresh",
    refreshing: "Refreshing…",
    live: "Updating while this section is open",
    counted: "{n} messages",
    ringNote:
      "The service keeps the last 500 and drops the oldest as new ones arrive — this is a log, not an archive.",
    fromBot: "bot",
    fromPerson: "person",
    kindVoice: "voice",
    kindFile: "file",
    kindLocation: "location",
    forwarded: "forwarded from",
  },
  about: {
    demoTitle: "Your starter bot is a working demonstration of how this project remembers.",
    demoWhat:
      "It is not a toy and not a placeholder. Everything it does is built from the same parts your own project has, so trying it out is the shortest way to see the memory of Fractera at work.",
    demoWriteTitle: "What happens to what you tell it.",
    demoWrite:
      "One sentence does not land as one line of text. It is taken apart: the record itself, when it happened, what it was about, the money in it, the place, the links to everything said before. Each part goes to the kind of memory that can answer questions about it later.",
    demoReadTitle: "How the parts come back together.",
    demoRead:
      "A question is not answered from a single row. Several sources are read at once — the records, their meaning, the connections between them — and the answer is assembled from all of them, so it stays whole rather than literal.",
    demoWhy:
      "That is why it is worth talking to before you build anything of your own: what you see here is the behaviour your project can be given.",
    whatTitle: "A door into this project from a messenger.",
    what:
      "A person writes to your bot and talks to your project — no separate app, no login screen. The bot is yours: the token comes from @BotFather and belongs to you, so the conversation runs between your visitors and your server.",
    arrangedTitle: "How it is arranged.",
    arranged:
      "One service on this machine is the only reader of the bot. It listens, keeps what it heard, and hands every message to this project at once. Nothing about the bot lives in your repository except the screens you are looking at.",
    canTitle: "What it can do today",
    can: [
      "hear text and voice — a voice note is fetched and transcribed, and from then on it is indistinguishable from typing (an OpenAI key is required for that)",
      "accept a photo, a video, a document or audio — the file goes into the media library and is READ, so a receipt sent without a word is still searchable",
      "keep everything it heard: the last 500 messages, which is what the Logs section shows",
      "hand every message to this project the moment it lands — your own door at /api/telegram/hook, with a shared secret; while that wiring is in place the PROJECT answers, not the service",
      "knock on the project on a schedule, so a reminder can fire while nobody is looking at the site",
      "send back: your project can write text and files into the chat",
    ],
    cannotTitle: "What it does not do — said plainly",
    cannot: [
      "one linked chat, yours. Other people can write to the bot and their messages reach the project, but the linked chat stays the default recipient, and nothing here collects a list of other people",
      "no mass mailing. One bot, one messenger, one conversation at a time — a loyalty service writing to thousands is a different product",
      "two of its own phrases (the greeting and the reply after linking) are English and live inside the service. This project cannot translate them",
      "without an OpenAI key a voice note arrives without text — the message is kept, but nobody transcribed it",
      "the log keeps the last 500 messages and drops the oldest. It is a log, not an archive",
    ],
    boundaryTitle: "Where the boundary is.",
    boundary:
      "The channels service belongs to the platform, not to your repository: on the server they are neighbours, and on your laptop the service is not running at all. That is why these screens say the service is unavailable there — nothing is broken, the bot simply lives on the server.",
    startTitle: "How to get a bot.",
    start:
      "Ask @BotFather in Telegram for a new bot, take the token it gives you, and paste it into Settings here. Then link your account and write to the bot — the first message appears in Logs.",
  },
  openai: {
    title: "OpenAI key",
    lead:
      "The bot needs it more often than not: without this key a voice note is not transcribed and an answer is not composed. It is set here so that both settings live on one screen.",
    exists: "An OpenAI key is set",
    missing: "No OpenAI key yet",
    partial: "The key has not reached every service",
    consumerApp: "this project",
    consumerData: "data layer",
    consumerGraph: "knowledge graph",
    keyLabel: "Key from platform.openai.com",
    keyPlaceholder: "sk-…",
    keyReplace: "Paste a new key to replace the saved one",
    save: "Save",
    saving: "Saving…",
    saved: "OpenAI key saved",
    failed: "Action failed",
    badFormat: "That does not look like an OpenAI key — they start with sk-",
    check: "Check",
    checking: "Checking…",
    valid: "The key is valid",
    invalid: "OpenAI did not accept this key",
    funded: "The balance is positive",
    noFunds: "The key works, but the account is out of credit",
    fundsUnknown: "Could not tell whether there is credit — try again later",
    balanceNote:
      "The remaining balance cannot be shown: OpenAI returns it only to a browser session of your account or to an admin key with the api.usage.read scope. An ordinary project key never sees it.",
    restartNote: "The project restarts to pick up the new key; the channel service reads it straight away.",
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
  logs: {
    title: "Что бот услышал",
    lead:
      "Всё, что доходит до бота, служба каналов складывает у себя — последние 500 сообщений, что бы она потом с ними ни сделала. Это и есть та запись, старые сверху — она читается как разговор.",
    emptyNoToken:
      "Здесь пока пусто, и причина простая: у бота нет токена. Сохраните его в «Настройках», и он начнёт слушать.",
    emptyNotLinked:
      "Бот жив, но учётная запись ещё не привязана, поэтому ему никто не писал. Привяжите свою в «Настройках» — и первое сообщение появится здесь.",
    emptyNoMessages:
      "Бот настроен и слушает — ему просто ещё никто не написал. Пусто здесь потому, что показывать нечего, а не потому, что что-то отказало.",
    refresh: "Обновить",
    refreshing: "Обновляю…",
    live: "Обновляется, пока раздел открыт",
    counted: "сообщений: {n}",
    ringNote:
      "Служба хранит последние 500 и вытесняет старые новыми — это журнал, а не архив.",
    fromBot: "бот",
    fromPerson: "человек",
    kindVoice: "голос",
    kindFile: "файл",
    kindLocation: "место",
    forwarded: "переслано от",
  },
  about: {
    demoTitle: "Ваш стартовый бот — работающая демонстрация того, как этот проект помнит.",
    demoWhat:
      "Это не игрушка и не заглушка. Всё, что он делает, собрано из тех же частей, что есть у вашего проекта, — поэтому поговорить с ним быстрее всего, чтобы увидеть память Fractera в работе.",
    demoWriteTitle: "Что происходит с тем, что вы ему сказали.",
    demoWrite:
      "Одна фраза не ложится одной строкой текста. Она раскладывается на части: сама запись, когда это случилось, о чём речь, какие в ней деньги, где это было, с чем связано из сказанного раньше. Каждая часть уходит в тот вид памяти, который потом сможет отвечать на вопросы о ней.",
    demoReadTitle: "Как части собираются обратно.",
    demoRead:
      "Ответ не берётся из одной строки. Читаются сразу несколько источников — сами записи, их смысл и связи между ними, — и ответ собирается из всего этого, поэтому он получается целостным, а не буквальным.",
    demoWhy:
      "Поэтому с ним стоит поговорить до того, как вы начнёте строить своё: здесь видно поведение, которое можно дать вашему проекту.",
    whatTitle: "Дверь в этот проект из мессенджера.",
    what:
      "Человек пишет вашему боту и разговаривает с вашим проектом — без отдельного приложения и без страницы входа. Бот ваш: токен вы получаете у @BotFather, и он принадлежит вам, поэтому разговор идёт между вашими посетителями и вашим сервером.",
    arrangedTitle: "Как это устроено.",
    arranged:
      "На этой машине есть одна служба, и она единственный читатель бота. Она слушает, хранит услышанное и сразу передаёт каждое сообщение в этот проект. В вашем репозитории от бота нет ничего, кроме экранов, на которые вы сейчас смотрите.",
    canTitle: "Что он умеет сегодня",
    can: [
      "слышать текстом и голосом — голосовая заметка скачивается и расшифровывается, и дальше неотличима от напечатанной (для этого нужен ключ OpenAI)",
      "принимать фотографию, видео, документ и звук — файл попадает в медиатеку и ПРОЧИТЫВАЕТСЯ, поэтому снимок чека, присланный молча, всё равно находится поиском",
      "хранить всё услышанное: последние 500 сообщений — это и есть раздел «Логи»",
      "передавать каждое сообщение в сам проект в момент прихода — в вашу дверь /api/telegram/hook, с общим секретом; пока эта проводка на месте, отвечает ПРОЕКТ, а не служба",
      "стучать в проект по расписанию, чтобы напоминание сработало, когда на сайт никто не смотрит",
      "отвечать: ваш проект умеет писать в чат текст и присылать файлы",
    ],
    cannotTitle: "Чего он не умеет — сказано прямо",
    cannot: [
      "привязанный чат один, ваш. Другие люди могут писать боту, и их сообщения доходят до проекта, но адресатом по умолчанию остаётся привязанный чат, а списка чужих чатов здесь никто не собирает",
      "рассылок нет. Один бот, один мессенджер, один разговор за раз — служба лояльности, пишущая тысячам, это другой продукт",
      "две его собственные фразы (приветствие и ответ после привязки) — английские и живут внутри службы. Этот проект их не переводит",
      "без ключа OpenAI голосовая заметка приходит без текста — сообщение сохранится, но расшифровать его будет некому",
      "журнал хранит последние 500 сообщений и вытесняет старые. Это журнал, а не архив",
    ],
    boundaryTitle: "Где проходит граница.",
    boundary:
      "Служба каналов принадлежит платформе, а не вашему репозиторию: на сервере они соседи, а на вашем ноутбуке служба не запущена вовсе. Поэтому там эти экраны говорят, что службы нет, — ничего не сломано, просто бот живёт на сервере.",
    startTitle: "Как завести бота.",
    start:
      "Попросите у @BotFather в Telegram нового бота, возьмите выданный токен и вставьте его здесь, в «Настройках». Потом привяжите свою учётную запись и напишите боту — первое сообщение появится в «Логах».",
  },
  openai: {
    title: "Ключ OpenAI",
    lead:
      "Боту он нужен чаще, чем нет: без этого ключа голосовая заметка не расшифруется, а ответ не соберётся. Поэтому он настраивается здесь — обе настройки на одном экране.",
    exists: "Ключ OpenAI существует",
    missing: "Ключ OpenAI не задан",
    partial: "Ключ доехал не до всех служб",
    consumerApp: "этот проект",
    consumerData: "слой данных",
    consumerGraph: "граф знаний",
    keyLabel: "Ключ с platform.openai.com",
    keyPlaceholder: "sk-…",
    keyReplace: "Вставьте новый ключ, чтобы заменить сохранённый",
    save: "Сохранить",
    saving: "Сохраняю…",
    saved: "Ключ OpenAI сохранён",
    failed: "Действие не выполнено",
    badFormat: "Это не похоже на ключ OpenAI — они начинаются с sk-",
    check: "Проверить",
    checking: "Проверяю…",
    valid: "Ключ верный",
    invalid: "OpenAI этот ключ не принял",
    funded: "Баланс положительный",
    noFunds: "Ключ рабочий, но на счёте кончились средства",
    fundsUnknown: "Про средства ответить не удалось — попробуйте позже",
    balanceNote:
      "Остаток показать нельзя: OpenAI отдаёт его только браузерной сессии вашего кабинета или админскому ключу с правом api.usage.read. Обычный проектный ключ его не видит.",
    restartNote: "Проект перезапускается, чтобы прочитать новый ключ; служба каналов читает его сразу.",
  },
}

const DICT: Record<string, TelegramUi> = { en: EN, ru: RU }

export function telegramUi(lang: string): TelegramUi {
  return DICT[lang] ?? DICT.en
}
