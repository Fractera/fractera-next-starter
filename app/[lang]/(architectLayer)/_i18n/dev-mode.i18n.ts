// СЛОВА РЕЖИМА РАЗРАБОТКИ (33-1 … 33-4, 2026-08-29).
//
// 🔒 ТЕКСТЫ ПЕРЕНЕСЕНЫ ИЗ ПАНЕЛИ ДОСЛОВНО (`bridges/app/lib/i18n/admin-translations.json`,
// ветка `developmentMode`). Это НЕ сочинение текста продукта, закреплённое за
// владельцем: слова уже написаны, им приняты и живут на 82 языках. Переписать их
// «получше» при переносе значило бы подменить принятое своим — и человек, знавший
// панель, увидел бы другой продукт.
//
// 🔒 ЗДЕСЬ `en` И `ru`; ОСТАЛЬНЫЕ 80 — ДОЛГ, НАЗВАННЫЙ ВСЛУХ. Слой архитектора
// живёт по закону слота: два языка пишу я, остальные приходят файлом от внешней
// модели. Панельные 82 сюда не переносятся — там свой словарь и своя сборка.
//
// 🔒 СЛОВАРЬ СЕРВЕРНЫЙ. Ни один файл с `"use client"` не имеет права его
// импортировать: строки едут островку пропсами — общий закон слоя.

import type { DevMode } from "../_lib/dev-mode"

export type ModeWords = {
  label: string
  /** Что этот режим делает — абзац. */
  body: string
  /** Когда его брать — одна фраза. */
  when: string
  /**
   * Требования режима.
   *
   * 🔒 ЭТО ЦЕНА, НАЗВАННАЯ ДО РЕШЕНИЯ, А НЕ ПОХВАЛА РЕЖИМУ. У классического их нет
   * вовсе, и пустой ряд на его карточке выглядел бы недоделкой — значит ряда там
   * нет совсем.
   */
  requires: string[]
  /**
   * Совет, показанный оранжевым блоком над карточкой. Пусто — совета нет.
   *
   * 🔒 ЖАНР ТОТ ЖЕ, ЧТО У «ПО ОДНОМУ СЛОТУ» В МАРШРУТИЗАЦИИ: цена решения,
   * названная до того, как решение приняли. Поэтому и контейнер тот же —
   * `AdviceNote` в тоне `advice`, а не второе изобретение того же блока.
   */
  advice?: string
  /**
   * Дверь режима: куда идти дальше, когда он выбран.
   *
   * 🔒 ЗАПИСЬ НА РЕЖИМЕ, А НЕ ВЕТКА В КОДЕ — так же, как в панели. Режим без
   * двери её просто не имеет: ключа нет. Ветка `if (mode === "cases")` завела бы
   * частный случай, который при второй двери разваливает карточку надвое.
   */
  /**
   * Дверь режима: КУДА идти после выбора. Здесь только СЛОВА.
   *
   * 🔒 АДРЕС ОТСЮДА УБРАН, И ЭТО ОПЛАЧЕНО МОЛЧА НЕ ОТРИСОВАННОЙ КАРТОЧКОЙ
   * (2026-08-29). Сначала здесь лежала функция `href(lang, adminUrl)`. Функцию
   * НЕЛЬЗЯ передать из серверного компонента в клиентский: сборка проходит, типы
   * сходятся, а карточка просто не появляется — в разметке остаётся один
   * полезный груз RSC. Владелец увидел это раньше меня: «я не вижу что ты
   * сделала, попробовать не могу».
   *
   * Адрес считает сама карточка по имени режима: он не слово и переводу не
   * подлежит.
   */
  door?: { label: string; hint: string }
}

export type DevModeUi = {
  title: string
  subtitle: string
  lead: string
  lawTitle: string
  law: string
  /** Отметка у режима, который записан в конфиге. */
  current: string
  alpha: string
  adviceTitle: string
  /** Обвязка списка продуктов на вкладке кейсов (34-E). */
  products: { title: string; hint: string; empty: string; emptyHint: string; create: string; creating: string; created: string; namePlaceholder: string; phase: string; stage: string }
  choose: string
  chosen: string
  saving: string
  saved: string
  failed: string
  /** Строка о том, что режим ни разу не выбирали. */
  neverChosen: string
  modes: Record<DevMode, ModeWords>
  /** Поле источника переезда. */
  sourceTitle: string
  sourceHint: string
  sourceLabel: string
  sourcePlaceholder: string
  sourceSave: string
  sourceSaved: string
  sourceNoToken: string
}

const en: DevModeUi = {
  title: "Development mode",
  subtitle:
    "How work on this project is carried out. The agent reads this at the start of every session — said in a chat, it would not survive the conversation.",
  lead:
    "The mode decides one thing: whether a confirmed use case and an open step are required before work begins. Everything else — the technical laws of the project — holds in all four.",
  lawTitle: "What the mode never changes.",
  law:
    "Static public pages, size limits, translations instead of inline text, settings read from config — these hold in every mode. A law that a mode could switch off would not be a law.",
  current: "current",
  alpha: "alpha testing",
  adviceTitle: "Before you choose",
  products: {
    title: "Products of this project",
    hint: "A product is the unit of work: one server carries several, and each lives at its own pace. The id (p1, p2) means nothing and never changes — paths hang on it.",
    empty: "No products yet",
    emptyHint: "A product is not a page. It is a thing this server carries: a shop, a landing, a company brain — with its own cases, steps and address.",
    create: "New product",
    creating: "Creating…",
    created: "Product created",
    namePlaceholder: "What you call it yourself",
    phase: "Phase",
    stage: "Stage",
  },
  choose: "Choose this mode",
  chosen: "This mode is in effect",
  saving: "Saving…",
  saved: "Mode saved",
  failed: "Could not save",
  neverChosen:
    "No mode has been chosen yet, so the project works as Classic. Choosing it explicitly is also a choice — it tells the agent the decision was made.",
  modes: {
    classic: {
      label: "Classic",
      body: "Ordinary work by request: you say what to change, the agent changes it. No case, no step, no queue.",
      when: "Take it for small, separate tasks — a fix, a wording, one page.",
      requires: [],
    },
    steps: {
      label: "Development steps",
      body: "The agent breaks the task into numbered steps with sub-steps, and works the queue. What is planned survives the end of a session, because it is written down before it is executed.",
      when: "Take it when the work is longer than one conversation.",
      requires: ["recommended for Opus 5"],
      advice:
        "This is the recommended way of working with the Fractera architecture. The project is built in numbered steps, each written down before it is done — so the work survives the end of a session, and you always see where it stands.",
    },
    cases: {
      label: "Use cases",
      body: "The fullest order: the owner confirms use cases, they become products, products become a queue of steps. Nothing is built on a guess, and every step names the case it serves.",
      when: "Take it when a product is being built, not patched.",
      requires: ["minimum requirement: Fable 5+", "recommended: dynamic workflows", "recommended: a Max plan"],
      door: {
        label: "Open the use cases",
        hint: "The surface of products and cases is still being moved into this layer. Until it lands, cases are edited in the control panel — the same files, the same data.",
      },
      advice:
        "Go through the work with the model step by step rather than switching on a fully automatic run. Confirm one case, look at what the agent built from it, and only then hand over the next. An automatic pass is faster right up until it turns the wrong way — and then you pay for every step it took while nobody was watching.",
    },
    migration: {
      label: "Move to Fractera",
      body: "Your project already exists. The agent reads its code — architecture, dependencies, what rests on what — lays out what it found as a file tree, and turns that tree into a queue of numbered steps. The frame comes first: addresses, tables, sign-in. Your data moves last, on access you grant yourself.",
      when: "Take it when the project is already written and needs moving, not starting over.",
      requires: [
        "minimum requirement: Fable 5+",
        "recommended: dynamic workflows",
        "recommended: a Max plan",
        "needs access to your project",
      ],
      door: {
        label: "Name your project",
        hint: "The address of the project you are moving from is set on the tab above. The reading itself is done by the agent inside this project.",
      },
      advice:
        "Move the project piece by piece together with the model, not in one automatic sweep. Read one part, agree on what it becomes here, let it be built — then take the next. A migration that ran unattended is hardest to check exactly where it matters most: in your own data.",
    },
  },
  sourceTitle: "The project you are moving from",
  sourceHint:
    "The agent starts by reading it. Without a source this mode does not begin at all — that is what separates it from the other three.",
  sourceLabel: "Repository address",
  sourcePlaceholder: "https://github.com/owner/repo",
  sourceSave: "Save the source",
  sourceSaved: "Source saved",
  sourceNoToken:
    "No token is asked for, on purpose: keep the repository open while the move lasts, and close it again afterwards.",
}

const ru: DevModeUi = {
  title: "Режим разработки",
  subtitle:
    "Как ведётся работа над этим проектом. Агент читает это в начале каждой сессии — сказанное в разговоре до следующего окна не доезжает.",
  lead:
    "Режим решает одно: обязательны ли подтверждённый кейс и открытый шаг перед началом работы. Всё остальное — технические законы проекта — действует во всех четырёх.",
  lawTitle: "Чего режим не меняет никогда.",
  law:
    "Статика публичных страниц, лимиты размера, переводы вместо вписанного текста, настройки из конфигов — действуют в любом режиме. Закон, который режим мог бы выключить, законом не был бы.",
  current: "сейчас",
  alpha: "альфа-тестирование",
  adviceTitle: "Прежде чем выбрать",
  products: {
    title: "Продукты этого проекта",
    hint: "Продукт — единица работы: один сервер несёт несколько, и каждый живёт своим темпом. Идентификатор (p1, p2) не значит ничего и не меняется никогда — на нём висят пути.",
    empty: "Продуктов пока нет",
    emptyHint: "Продукт — это не страница. Это то, что несёт сервер: магазин, лендинг, мозг компании — со своими кейсами, шагами и адресом.",
    create: "Новый продукт",
    creating: "Создаю…",
    created: "Продукт создан",
    namePlaceholder: "Как вы его называете сами",
    phase: "Фаза",
    stage: "Стадия",
  },
  choose: "Выбрать этот режим",
  chosen: "Этот режим действует",
  saving: "Сохраняю…",
  saved: "Режим сохранён",
  failed: "Не удалось сохранить",
  neverChosen:
    "Режим ещё не выбирали, поэтому проект работает как классический. Выбрать его явно — тоже выбор: так агент узнаёт, что решение принято.",
  modes: {
    classic: {
      label: "Классический",
      body: "Обычная работа по просьбе: вы говорите, что изменить, — агент меняет. Ни кейса, ни шага, ни очереди.",
      when: "Берите для мелких отдельных задач — правка, формулировка, одна страница.",
      requires: [],
    },
    steps: {
      label: "Шаги разработки",
      body: "Агент раскладывает задачу на нумерованные шаги с подшагами и работает очередь. Запланированное переживает конец сессии, потому что записано до того, как исполнено.",
      when: "Берите, когда работа длиннее одного разговора.",
      requires: ["рекомендуется для модели Opus 5"],
      advice:
        "Это рекомендованный режим работы с архитектурой Fractera. Проект строится нумерованными шагами, и каждый записан до того, как исполнен, — поэтому работа переживает конец сессии, и всегда видно, на чём она стоит.",
    },
    cases: {
      label: "Пользовательские кейсы",
      body: "Самый полный порядок: владелец подтверждает кейсы, из них рождаются продукты, из продуктов — очередь шагов. Ничего не строится на догадке, и каждый шаг называет кейс, которому служит.",
      when: "Берите, когда продукт строят, а не латают.",
      requires: ["минимальные требования Fable 5+", "рекомендуется: динамические рабочие процессы", "рекомендуется: тариф Max"],
      door: {
        label: "Открыть пользовательские кейсы",
        hint: "Поверхность продуктов и кейсов ещё переезжает в этот слой. Пока она не приехала, кейсы правятся в панели управления — те же файлы, те же данные.",
      },
      advice:
        "Проходите работу с моделью постепенно, шаг за шагом, а не включайте полностью автоматический прогон. Подтвердите один кейс, посмотрите, что агент из него построил, и только потом отдавайте следующий. Автоматический проход быстрее ровно до того мгновения, как свернёт не туда, — и тогда вы платите за каждый шаг, сделанный, пока никто не смотрел.",
    },
    migration: {
      label: "Переезд на Fractera",
      body: "Ваш проект уже написан. Агент читает его код — архитектуру, зависимости, что на чём держится, — раскладывает прочитанное деревом файлов и превращает это дерево в очередь нумерованных шагов. Первым срезом встаёт каркас: адреса, таблицы, вход. Данные переезжают последними и по доступу, который вы даёте сами.",
      when: "Берите, когда проект уже написан и его нужно перевезти, а не начинать заново.",
      requires: [
        "минимальные требования Fable 5+",
        "рекомендуется: динамические рабочие процессы",
        "рекомендуется: тариф Max",
        "нужен доступ к вашему проекту",
      ],
      door: {
        label: "Назвать свой проект",
        hint: "Адрес проекта, из которого переезжаете, задаётся на этой же вкладке ниже. Само чтение делает агент внутри этого проекта.",
      },
      advice:
        "Перевозите проект по частям вместе с моделью, а не одним автоматическим заходом. Прочитали часть, договорились, чем она станет здесь, дали построить — и берите следующую. Переезд, прошедший без присмотра, труднее всего проверить там, где это важнее всего: в ваших собственных данных.",
    },
  },
  sourceTitle: "Проект, из которого переезжаете",
  sourceHint:
    "С его чтения агент и начинает. Без источника этот режим не начинается вовсе — этим он и отличается от остальных трёх.",
  sourceLabel: "Адрес репозитория",
  sourcePlaceholder: "https://github.com/owner/repo",
  sourceSave: "Сохранить источник",
  sourceSaved: "Источник сохранён",
  sourceNoToken:
    "Токен не спрашивается намеренно: держите репозиторий открытым, пока идёт переезд, и закройте его снова после.",
}

const DICT: Record<string, DevModeUi> = { en, ru }

export function devModeUi(lang: string): DevModeUi {
  return DICT[lang] ?? DICT[lang.slice(0, 2)] ?? DICT.en
}
