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
}

export type DevModeUi = {
  title: string
  subtitle: string
  lead: string
  lawTitle: string
  law: string
  /** Отметка у режима, который записан в конфиге. */
  current: string
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
    },
    cases: {
      label: "Use cases",
      body: "The fullest order: the owner confirms use cases, they become products, products become a queue of steps. Nothing is built on a guess, and every step names the case it serves.",
      when: "Take it when a product is being built, not patched.",
      requires: ["minimum requirement: Fable 5+", "recommended: dynamic workflows", "recommended: a Max plan"],
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
    },
    cases: {
      label: "Пользовательские кейсы",
      body: "Самый полный порядок: владелец подтверждает кейсы, из них рождаются продукты, из продуктов — очередь шагов. Ничего не строится на догадке, и каждый шаг называет кейс, которому служит.",
      when: "Берите, когда продукт строят, а не латают.",
      requires: ["минимальные требования Fable 5+", "рекомендуется: динамические рабочие процессы", "рекомендуется: тариф Max"],
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
