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
  // 🪦 БЫЛО СЕМЬ РАЗДЕЛОВ, СТАЛО ЧЕТЫРЕ (111, 2026-09-04): «команды»,
  // «календарь» и «карта» убраны словом владельца вместе со своими словами.
  // 🪦 И СТАЛО ЧЕТЫРЕ ИЗ ПЯТИ (ревизия, шаг 116, 2026-09-05): «Стратегия
  // автоматизации» убрана — выбор между конвейером на OpenAI и агентом Anthropic
  // перестал существовать вместе со стратегией, которая его породила.
  pages: Record<
    "about" | "logs" | "settings" | "passport",
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
   * КАРКАС РАЗДЕЛОВ, ПОСТРОЕННЫХ ПОЗЖЕ (77-15, 2026-09-01).
   *
   * 🔒 СЛОВА ЗАГЛУШКИ ЖИВУТ ЗДЕСЬ, А НЕ В КОМПОНЕНТЕ. Заглушка одна на семь мест,
   * и текст у каждого свой: «в процессе разработки» без имени того, чего ждать,
   * не отличается от поломки.
   */
  skeleton: {
    inProgress: string
    instructionTitle: string
    instructionLead: string
    views: Record<'parse' | 'db' | 'media' | 'vectors' | 'rag', string>
  }

  /**
   * СЛОВА ВИДА «РАЗБОР ЗАПРОСА» (91-1).
   *
   * 🔒 ВКЛАДКА ОБЯЗАНА ОБЪЯСНЯТЬ СОБОЙ, А НЕ НАЗЫВАТЬСЯ — прямое требование
   * владельца: «вкладку которая в своем описании подробно расскажет что здесь
   * происходит». Экран показывает ХОД РАССУЖДЕНИЯ, и без слов он читается как
   * технический мусор, а не как работа.
   *
   * 🔒 ПУСТОЕ СОСТОЯНИЕ НАЗЫВАЕТ ПРИЧИНУ, И ПРИЧИН ТРИ РАЗНЫХ. «Ничего нет»
   * одинаково выглядит при мёртвой службе, непривязанном боте и просто молчании
   * — а лечится по-разному. Молчание вместо причины читается как поломка (28-13).
   */
  parse: {
    title: string
    /** Первый абзац справки: виден свёрнутым. */
    summary: string
    /** Остальное: пять родов строки, почему всегда одна запись, что дальше. */
    details: string
    /** Причины пустоты — по одной на состояние. */
    emptyServiceDown: string
    emptyNotLinked: string
    emptyNoRequests: string
    /** Заголовки колонок таблицы. */
    colNo: string
    colInstruction: string
    colAction: string
    /** Кнопка под однострочной ячейкой: открыть весь текст в окне. */
    viewAll: string
    /** Следующее действие первой строки — она всегда ведёт к анализу реестра. */
    nextAfterIntake: string
    /** Что умеет «инструмент» первой строки — канал. */
    intakeToolWhat: string
    colKind: string
    colWhat: string
    colSource: string
    colTime: string
    /**
     * Строка «сырой запрос»: чем она добыта и что показать, когда слов нет.
     *
     * 🔒 ИМЯ КАНАЛА ПОДСТАВЛЯЕТСЯ В `{name}`, А НЕ ПИШЕТСЯ ВТОРЫМ СПИСКОМ.
     * Список каналов один — `REQUEST_CHANNELS`; словарь, перечисляющий их
     * заново, разошёлся бы с ним на первом же добавленном канале.
     */
    via: string
    noWords: string
    /** Имена пяти родов строки. */
    kinds: Record<'intake' | 'store' | 'match' | 'evolve' | 'extract' | 'resolve' | 'plan' | 'reveal', string>
    /**
     * Чем строка добыта — по слову на источник.
     *
     * 🔒 СПИСОК ТОТ ЖЕ, ЧТО `TASK_SOURCES`, И ПРОВЕРЯЕТСЯ ТИПОМ. Словарь, не
     * знающий нового источника, показал бы пустую ячейку вместо ответа на
     * вопрос «чем это добыто» — то есть отнял бы у таблицы половину смысла.
     */
    sources: Record<'none' | 'model' | 'http' | 'rag' | 'table' | 'vector' | 'map', string>
  }

  /**
   * СЛОВА КАРТОЧКИ «РЕЕСТР ПРИЗНАКОВ» (81-3).
   *
   * 🔒 ОПРЕДЕЛЕНИЕ ЛЕЖИТ В СЛОВАХ ЭКРАНА, А НЕ В КОММЕНТАРИИ КОДА. Правило,
   * которое негде увидеть, исполняется по памяти — то есть не исполняется:
   * закон, оплаченный шагом 62 на модальных окнах и шагом 51 на карточках видов.
   */
  facts: {
    title: string
    /** Первый абзац справки: виден свёрнутым. */
    summary: string
    /** Остальное: определение через отрицание, пять частей, откуда берутся. */
    rest: string
    more: string
    less: string
    /** Подписи пяти уровней — отвечают на вопрос «когда признак известен». */
    levels: Record<'initiator' | 'material' | 'intent' | 'entity' | 'destination' | 'field', string>
    /** Пометки записи. */
    builtin: string
    required: string
    noTable: string
    counted: string
    /** Слова формы добавления (81-4). */
    addTitle: string
    keyLabel: string
    keyHint: string
    titleLabel: string
    descriptionLabel: string
    valueTypeLabel: string
    howToFindLabel: string
    howToFindHint: string
    onMissingLabel: string
    onMissingWords: Record<'silent' | 'ask' | 'join', string>
    valueTypes: Record<'flag' | 'text' | 'number' | 'money' | 'date' | 'geo' | 'relation' | 'list', string>
    submit: string
    submitting: string
    /** `{table}` — имя созданной таблицы. */
    savedWithTable: string
    /** Причины отказа двери, по её кодам. */
    errors: Record<string, string>
    errorOther: string
    /** Слова инструмента черновика (81-5). */
    draftTitle: string
    draftHint: string
    draftPlaceholder: string
    draftSubmit: string
    draftSubmitting: string
    draftNotes: string
    draftFailures: Record<'no-key' | 'too-short' | 'model-silent' | 'not-understood', string>
    /**
     * ПОДПИСИ РАСКРЫТИЯ КАРТОЧКИ (81-9).
     *
     * 🔒 ПОДПИСИ ЖИВУТ ЗДЕСЬ, А СОДЕРЖИМОЕ — РЯДОМ С МЕХАНИЗМОМ. Словарь
     * принадлежит экрану и знает, КАК назвать строку; что в ней стоит, знает
     * `lib/facts/{detail,builtin}.ts`. Положи мы туда и текст — он устарел бы в
     * день правки кода, и устарел бы молча.
     */
    detailsMore: string
    detailExample: string
    detailExtracts: string
    detailTools: string
    detailFunctions: string
    detailLost: string
    /** Рукописного нет — так и говорим. Выдуманный пример хуже пустоты. */
    detailNotDescribed: string
    /** Терять нечего — это тоже ответ, и он отличается от «не описано». */
    detailNothingLost: string
  }

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
    /** Ботов может быть несколько (99-4). {n} — их число. */
    botsTitle: string
    /** Заголовок строки бота, у которого ещё нет токена. {n} — номер. */
    botUnnamed: string
    addBot: string
    addingBot: string
    addedBot: string
    removeBot: string
    removingBot: string
    removedBot: string
    confirmRemoveBot: string
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
    "The architect's own tool, built to make their work faster — and a live demonstration of how this project remembers.",
  pages: {
    about: {
      title: "About",
      hint: "What the bot is for in this project and how it is arranged.",
    },
    logs: {
      title: "Logs",
      hint:
        "The bot picks one of two modes. Fast and cheap, on the fact registry, for most simple tasks. Complex and recursively evolving, on an agent that grows skills, MCP, external APIs and AI browsers for research.",
    },
    settings: {
      title: "Settings",
      hint: "The token, the connection and everything the bot needs in order to answer.",
    },
    passport: {
      title: "Passport",
      hint: "What we are building, why, and how it works today. A living document.",
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
  skeleton: {
    inProgress: "Being built",
    instructionTitle: "Your own instruction for the bot",
    instructionLead:
      "A text you write yourself and the bot follows in addition to its own rules — your limits, your tone, your subject. It is added to the instruction the bot already has, not instead of it.",
    views: {
      parse: "Request breakdown",
      db: "Database",
      media: "Media library",
      vectors: "Vector store",
      rag: "Agentic RAG",
    },
  },

  parse: {
    title: "Request breakdown",
    summary:
      "One message, taken apart in front of you. Not the result — the reasoning: what arrived, what was read out of it, which registry facts it turned out to contain, and what each of them would be stored as.",
    details:
      "Rows appear as the work finishes, not all at once. The first is the raw request exactly as it came in, down to the millisecond. Then, if there was an attachment, what was read out of it. Then, if the message refers to something said earlier, which thing exactly and how it was chosen. Then the plan: which registry facts this request contains. Then one row per fact, with the values pulled out and the table they would go into.\n\nThere is always exactly ONE record here, and the next request replaces it — this is working material, not a history. Yesterday's breakdown is not kept: the point is to see how the system thinks right now, and later this record is split across the fact tables and freed for the next conversation.\n\nNothing is written into those tables yet. A row names where a value would land; it does not put it there.",
    emptyServiceDown:
      "The channel service is not running, so nothing reaches the bot and there is nothing to take apart.",
    emptyNotLinked:
      "The bot is not linked to a chat yet. Link it in Settings, write to it, and the breakdown of that message appears here.",
    emptyNoRequests:
      "Nobody has written to the bot yet. The first message will be taken apart here.",
    colKind: "Fact",
    colNo: "#",
    colInstruction: "Instruction",
    colAction: "Next action",
    viewAll: "View all",
    nextAfterIntake: "Find out which registry facts this message matches.",
    intakeToolWhat: "The channel the message arrived through, and the person who sent it. Nothing here is interpreted: this is the raw material everything else is checked against.",
    colWhat: "Output",
    colSource: "Tool",
    colTime: "Time",
    via: "{name}",
    noWords: "No words of their own — the message arrived as an attachment.",
    kinds: {
      intake: "Raw request",
      store: "Message saved",
      match: "Fact lookup",
      evolve: "Registry evolution",
      extract: "Read from attachment",
      resolve: "Link to previous message",
      plan: "Plan",
      reveal: "Fact",
    },
    sources: {
      none: "taken as it came",
      model: "a model",
      http: "an external service",
      rag: "the knowledge graph",
      table: "the project database",
      vector: "the vector store",
      map: "the map service",
    },
  },

  facts: {
    title: "Fact registry",
    summary:
      "What this project knows how to pull out of a message: the date of the event, money, a place, a link to what was said before. Each of them is a declared ability — not a label.",
    rest:
      "A fact is a declared ability to recognise a class of facts in a message, store them apart from the text and link them to the rest. Put the other way round, which is more exact: no fact in the registry means no instruction for how to decompose it — so it lands in no table and stays plain text. Every entry carries five parts: a name, what it is, the form of the value, HOW TO RECOGNISE it, and what to do when it is implied but not extracted. Built-in facts are generated from the code and cannot be edited: they describe what the system does by construction. Added ones you describe yourself, and each gets its own table the moment it is saved.",
    more: "What is a fact",
    less: "Collapse",
    levels: {
      initiator: "Who started it",
      material: "How it arrived",
      intent: "Why it arrived",
      entity: "What it turned out to be",
      destination: "Where it went",
      field: "What was extracted",
    },
    builtin: "built-in",
    required: "cannot be turned off",
    noTable: "no table of its own: a link is a relation, not a value",
    counted: "{n} facts",
    addTitle: "Add a fact",
    keyLabel: "Machine name",
    keyHint: "Latin letters and digits, dots for levels. The table name is built from it and never changes.",
    titleLabel: "Name",
    descriptionLabel: "What it is",
    valueTypeLabel: "Form of the value",
    howToFindLabel: "How to recognise it",
    howToFindHint: "The words and shapes it appears in. This is what goes to the model — without it the fact is a column nobody fills.",
    onMissingLabel: "When it is implied but not extracted",
    onMissingWords: {
      silent: "Say nothing",
      ask: "Ask a clarifying question",
      join: "Look in neighbouring messages",
    },
    valueTypes: {
      flag: "Yes or no", text: "Text", number: "Number", money: "Money",
      date: "Date", geo: "Coordinates", relation: "Link between messages", list: "List",
    },
    submit: "Save",
    submitting: "Saving…",
    savedWithTable: "Saved. Table {table} created — the fact works from now on, no rebuild needed.",
    errors: {
      "bad-key": "This machine name will not do: latin letters and digits only, dots between levels.",
      "no-title": "A name is required.",
      "no-how-to-find": "Say how to recognise it — without that the fact stays an empty column.",
      "builtin-exists": "A built-in fact already has this name.",
      "builtin-readonly": "Built-in facts are generated from the code and cannot be edited.",
    },
    errorOther: "Could not save. Try again in a minute.",
    draftTitle: "Describe it in words",
    draftHint: "Say what you want to store and how it shows up in messages. The model fills the fields in — you check them and save. Nothing is written until you do.",
    draftPlaceholder: "I want to keep the weather when a message arrived — take it from mentions of rain, heat, snow or degrees",
    draftSubmit: "Fill the fields in",
    draftSubmitting: "Reading…",
    draftNotes: "Assumed:",
    draftFailures: {
      "no-key": "No OpenAI key — fill the fields by hand, everything else works.",
      "too-short": "Too short. Say what it is and by which words it shows up.",
      "model-silent": "The model did not answer. Try again in a minute.",
      "not-understood": "Could not make a record out of this. Say it in other words, or fill the fields by hand.",
    },
    detailsMore: "More about this fact",
    detailExample: "How a person says it",
    detailExtracts: "What is extracted, and where it lands",
    detailTools: "Obtained by",
    detailFunctions: "The code behind it",
    detailLost: "What is extracted and NOT kept",
    detailNotDescribed: "not described",
    detailNothingLost: "nothing is lost — everything extracted is stored",
  },
  settings: {
    serviceDown: "The channels service is not running, so nothing can be set up here yet.",
    noToken: "no token yet",
    botsTitle: "Telegram bots: {n}",
    botUnnamed: "Bot {n} — no token",
    addBot: "Add a bot",
    addingBot: "Adding…",
    addedBot: "Bot added — enter its token",
    removeBot: "Remove",
    removingBot: "Removing…",
    removedBot: "Bot removed. The conversation history is kept.",
    confirmRemoveBot: "Press again to remove",
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
      "Everything that reaches the bot is kept by the channels service, and so is every answer it sends back — the whole conversation, from the day this project started until the server is gone. This is that record, oldest first.",
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
      "Nothing here is ever dropped: the journal keeps the whole history for as long as the server lives. Only the newest part is loaded at once.",
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
      "keep the whole conversation — both what it heard and what it answered — for as long as the server lives; that is what the Logs section shows",
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
      "nothing is deleted automatically, so the journal only grows — the disk of your server is the limit",
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
    "Личный инструмент архитектора, созданный для повышения его профессиональной эффективности и как демонстрация работы памяти проекта.",
  pages: {
    about: {
      title: "Описание",
      hint: "Зачем боту существовать в этом проекте и как он устроен.",
    },
    logs: {
      title: "Логи",
      hint:
        "Бот выбирает один из двух режимов. Быстрый и дешёвый — на реестре признаков, для большинства простых задач. Сложный, рекурсивно эволюционирующий — на агенте, наращивающем навыки, MCP, внешние API и ИИ-браузеры для исследований.",
    },
    settings: {
      title: "Настройки",
      hint: "Токен, связь и всё, без чего бот не отвечает.",
    },
    passport: {
      title: "Паспорт",
      hint: "Что мы строим, зачем и как это устроено сегодня. Живой документ: правится по мере того, как решения принимаются.",
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
  skeleton: {
    inProgress: "В процессе разработки",
    instructionTitle: "Ваша собственная инструкция боту",
    instructionLead:
      "Текст, который вы пишете сами, а бот исполняет вдобавок к своим правилам: ваши ограничения, ваш тон, ваша предметная область. Он добавляется к инструкции бота, а не заменяет её.",
    views: {
      parse: "Разбор запроса",
      db: "База данных",
      media: "Медиатека",
      vectors: "Векторное хранилище",
      rag: "Агентный RAG",
    },
  },

  parse: {
    title: "Разбор запроса",
    summary:
      "Одно сообщение, разобранное у вас на глазах. Не итог, а ход рассуждения: что пришло, что из этого прочитано, какие признаки реестра в нём нашлись и чем каждый из них станет при сохранении.",
    details:
      "Строки появляются по мере готовности, а не разом. Первая — запрос как он пришёл, с точностью до миллисекунды. Затем, если было вложение, — что из него прочитано. Затем, если сообщение ссылается на сказанное раньше, — на что именно и почему выбрано оно. Затем план: какие признаки реестра в этом запросе есть. Затем по строке на признак: извлечённые значения и таблица, в которую они лягут.\n\nЗапись здесь всегда РОВНО ОДНА, и следующий запрос её заменяет — это рабочий материал, а не история. Вчерашний разбор не хранится: смысл экрана в том, чтобы видеть, как система думает сейчас, а позже эта запись разъедется по таблицам признаков и освободится под следующий разговор.\n\nВ сами таблицы пока ничего не пишется. Строка называет, куда значение легло бы, но не кладёт его туда.",
    emptyServiceDown:
      "Служба каналов не запущена — до бота ничего не доходит, и разбирать нечего.",
    emptyNotLinked:
      "Бот ещё не привязан к чату. Привяжите его в «Настройках», напишите ему — и разбор этого сообщения появится здесь.",
    emptyNoRequests:
      "Боту ещё никто не писал. Первое сообщение будет разобрано здесь.",
    colKind: "Признак",
    colNo: "№",
    colInstruction: "Инструкция",
    colAction: "Следующее действие",
    viewAll: "Посмотреть всё",
    nextAfterIntake: "Узнать, каким элементам реестра признаков соответствует сообщение.",
    intakeToolWhat: "Канал, которым пришло сообщение, и человек, который его прислал. Здесь ничего не интерпретируется: это сырьё, с которым сверяют всё остальное.",
    colWhat: "Выход",
    colSource: "Инструмент",
    colTime: "Время",
    via: "{name}",
    noWords: "Своих слов нет — сообщение пришло вложением.",
    kinds: {
      intake: "Сырой запрос",
      store: "Сохранение сообщения",
      match: "Поиск признаков",
      evolve: "Эволюция реестра признаков",
      extract: "Прочитано из вложения",
      resolve: "Поиск связи с предыдущим сообщением",
      plan: "План",
      reveal: "Признак",
    },
    sources: {
      none: "принято как есть",
      model: "модель",
      http: "внешняя служба",
      rag: "граф знаний",
      table: "база проекта",
      vector: "векторное хранилище",
      map: "служба карт",
    },
  },

  facts: {
    title: "Реестр признаков",
    summary:
      "Что проект умеет вынимать из сообщения: дату события, деньги, место, связь со сказанным раньше. Каждый признак — объявленная способность, а не ярлык.",
    rest:
      "Признак — объявленная способность узнать в сообщении класс фактов, сохранить их отдельно от текста и связать с остальным. С другой стороны, и так точнее: нет признака в реестре — нет инструкции, как это декомпозировать, значит факт не попадёт ни в одну таблицу и останется просто текстом. У каждой записи пять частей: имя, что это, форма значения, КАК ЭТО УЗНАВАТЬ и что делать, когда признак подразумевается, но не извлекается. Встроенные порождаются из кода и не правятся: они описывают то, что система делает по устройству. Добавленные вы описываете сами, и каждый получает свою таблицу в момент сохранения.",

    more: "Что такое признак",
    less: "Свернуть",
    levels: {
      initiator: "Кто инициировал",
      material: "Чем пришло",
      intent: "Зачем пришло",
      entity: "Чем оказалось",
      destination: "Куда уехало",
      field: "Что извлекли",
    },
    builtin: "встроенный",
    required: "выключить нельзя",
    noTable: "своей таблицы нет: связь — отношение, а не значение",
    counted: "признаков: {n}",
    addTitle: "Добавить признак",
    keyLabel: "Машинное имя",
    keyHint: "Латиница и цифры, точки между уровнями. Из него строится имя таблицы, и оно не меняется никогда.",
    titleLabel: "Название",
    descriptionLabel: "Что это",
    valueTypeLabel: "Форма значения",
    howToFindLabel: "Как это узнавать",
    howToFindHint: "По каким словам и в каком виде встречается. Именно это едет в модель — без него признак останется колонкой, которую никто не заполняет.",
    onMissingLabel: "Если подразумевается, но не извлекается",
    onMissingWords: {
      silent: "Промолчать",
      ask: "Задать уточняющий вопрос",
      join: "Поискать в соседних сообщениях",
    },
    valueTypes: {
      flag: "Да или нет", text: "Текст", number: "Число", money: "Деньги",
      date: "Дата", geo: "Координаты", relation: "Связь между сообщениями", list: "Список",
    },
    submit: "Сохранить",
    submitting: "Сохраняем…",
    savedWithTable: "Сохранено. Таблица {table} создана — признак работает с этой минуты, пересборка не нужна.",
    errors: {
      "bad-key": "Такое машинное имя не годится: только латиница и цифры, точки между уровнями.",
      "no-title": "Название обязательно.",
      "no-how-to-find": "Скажите, как это узнавать, — без этого признак останется пустой колонкой.",
      "builtin-exists": "Встроенный признак уже носит это имя.",
      "builtin-readonly": "Встроенные признаки порождаются из кода и не правятся.",
    },
    errorOther: "Не удалось сохранить. Попробуйте через минуту.",
    draftTitle: "Опишите словами",
    draftHint: "Скажите, что хотите хранить и по каким словам это встречается. Модель заполнит поля — вы проверите и сохраните. До этого ничего не записывается.",
    draftPlaceholder: "хочу хранить погоду в момент сообщения — бери из упоминаний дождя, жары, снега или градусов",
    draftSubmit: "Заполнить поля",
    draftSubmitting: "Читаем…",
    draftNotes: "Предположил:",
    draftFailures: {
      "no-key": "Ключа OpenAI нет — заполните поля руками, остальное работает.",
      "too-short": "Слишком коротко. Скажите, что это и по каким словам встречается.",
      "model-silent": "Модель не ответила. Попробуйте через минуту.",
      "not-understood": "Не получилось собрать запись. Скажите иначе или заполните поля руками.",
    },
    detailsMore: "Подробнее об этом признаке",
    detailExample: "Как человек это говорит",
    detailExtracts: "Что извлекается и куда ложится",
    detailTools: "Чем добывается",
    detailFunctions: "Какой код за этим стоит",
    detailLost: "Что извлекается и НЕ сохраняется",
    detailNotDescribed: "не описано",
    detailNothingLost: "не теряется ничего — всё извлечённое сохраняется",
  },
  settings: {
    serviceDown: "Служба каналов не запущена, поэтому настроить здесь пока нечего.",
    noToken: "токен не задан",
    botsTitle: "Telegram-боты: {n}",
    botUnnamed: "Бот {n} — без токена",
    addBot: "Добавить бота",
    addingBot: "Добавляю…",
    addedBot: "Бот добавлен — впишите его токен",
    removeBot: "Убрать",
    removingBot: "Убираю…",
    removedBot: "Бот убран. Переписка сохранена.",
    confirmRemoveBot: "Нажмите ещё раз, чтобы убрать",
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
      "Всё, что доходит до бота, и всё, что он отвечает, служба каналов складывает у себя — весь разговор целиком, со дня запуска проекта и до тех пор, пока жив сервер. Это и есть та запись, старые сверху.",
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
      "Отсюда ничего не удаляется: журнал хранит всю переписку, пока жив сервер. Разом загружается только свежая часть.",
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
      "хранить весь разговор — и услышанное, и свои ответы — пока жив сервер; это и есть раздел «Логи»",
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
      "ничего не удаляется само, поэтому журнал только растёт — предел здесь один, диск вашего сервера",
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
