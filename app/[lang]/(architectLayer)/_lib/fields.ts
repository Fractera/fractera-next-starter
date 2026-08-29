// ОПИСАНИЕ ПОЛЕЙ НАСТРОЕК (31-4, 2026-08-28). Переносится из панели
// (`bridges/app/app/[lang]/app-settings/_lib/fields.ts`) секция за секцией.
//
// 🔒 ОПИСАНИЕ, А НЕ РАЗМЕТКА. Поле — это запись: путь в конфиге, тип, языковое оно
// или нет, заблокировано или нет. Форма рисуется ИЗ описания, поэтому новая секция
// стоит одной записи, а правило (например «у текстового поля есть голос») пишется
// один раз и действует на все.
//
// 🔒 ПУТЬ — КОНТРАКТ С ЧИТАТЕЛЯМИ КОНФИГА, И МЕНЯТЬ ЕГО НЕЛЬЗЯ. `name`,
// `seo.titleTemplate`, `geo.address` читают `lib/brand.ts`, `lib/jsonld.ts`,
// `lib/construct-metadata.ts` и ещё десяток модулей. Подписи мы переводим, пути —
// никогда.
//
// 🔒 ЯЗЫКОВЫХ ПОЛЕЙ РОВНО ПЯТЬ, И ЭТО НЕ НАШ ВЫБОР: `name`, `description`,
// `seo.titleTemplate`, `seo.keywords`, `og.siteName` — так их читает
// `configValueForLang()` в `config/app-config.ts`. Пометить языковым шестое поле
// значит записать перевод, который никто никогда не прочитает.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  /** Список с возможностью своего значения: четыре валюты — и любая пятая. */
  | "combo"
  /** Цвет: образец рядом с полем, палитра браузера и те же шестнадцать знаков. */
  | "color"
  | "switch"
  /** Картинка: значение — адрес файла, а сам файл живёт в хранилище. */
  | "image"
  /** Набор значков: не значение, а действие — сервер режет его из одной картинки. */
  | "icons"
  /** Конструктор соцсетей: список записей, а не поле ввода. */
  | "socials"

export type Field = {
  /** Путь значения в `app-config.json`, точками. */
  path: string
  type: FieldType
  /** Значение своё на каждый язык (хранится в ветке `i18n`). */
  perLang?: boolean
  /**
   * Поле только для чтения: значение ВЫВОДИТСЯ из адреса, на который сервер
   * реально отвечает. Дать его править значило бы позволить назвать сайт адресом,
   * которого не существует.
   */
  locked?: boolean
  /** Варианты для `select` и `combo`; значения — то, что уходит в конфиг. */
  options?: readonly string[]
  /**
   * Микрофон у этого поля.
   *
   * 🔒 ПРИЗНАК ЯВНЫЙ, И ЭТО ПЕРЕВОРОТ ПРЕЖНЕГО ПРАВИЛА (32-10, решение владельца).
   * Было: «поле текстовое → значит есть голос», и микрофон достался тридцати пяти
   * полям — включая подтверждение Яндекса, координаты, HEX-цвет и шаблон `%s | Бренд`.
   * Диктовать туда нечего, а кнопка обещает работу, которой не существует.
   * Стало: голос у того, что человек ПРОИЗНОСИТ словами. Признак пишется полем, а не
   * выводится из типа: тип говорит, КАК поле устроено, и ничего не знает о том, что в
   * него кладут.
   */
  voice?: true
  /**
   * Тип ввода браузера: `email`, `url`, `tel`.
   *
   * 🔒 ЭТО НЕ КОСМЕТИКА, А КЛАВИАТУРА ТЕЛЕФОНА. На `email` появляется «@», на `tel` —
   * цифровая панель, на `url` — «/» и «.com». Ровно там, где мы забрали микрофон,
   * человеку и нужен самый быстрый ручной ввод.
   */
  input?: "email" | "url" | "tel"
  /**
   * Запертая пропорция кадра у поля-картинки.
   *
   * 🔒 ОБРЕЗКА ИДЁТ ВСЕГДА (решение владельца 2026-08-29) — этот признак решает не
   * «резать ли», а «даём ли выбирать форму». Логотип и портрет автора обязаны быть
   * квадратными, картинка для соцсетей — горизонтальной: их форму диктует место,
   * куда они встанут, а не вкус владельца. Где формат свободен, признака нет и
   * человек выбирает пропорцию сам.
   */
  crop?: "square" | "horizontal"
}

export type Section = {
  /** Ключ секции: он же ключ словаря подписей. */
  id: string
  /** Группа левого меню, которой секция принадлежит. */
  group: string
  fields: readonly Field[]
}

// 🔒 ПОРЯДОК СЕКЦИЙ И ПОЛЕЙ — ИЗ ПАНЕЛИ, дословно. Человек, знавший старую
// вкладку, обязан найти поле там же, где привык; переставить их «логичнее» значит
// заставить его искать заново без единой причины.
export const SECTIONS: readonly Section[] = [
  {
    id: "brand",
    group: "basics",
    fields: [
      // Имя, короткое имя и описание — слова, которые человек ПРОИЗНОСИТ. Почта — нет:
      // продиктованный адрес приезжает как «собака точка ком» и правится дольше, чем
      // набирается.
      { path: "name", type: "text", perLang: true, voice: true },
      { path: "short_name", type: "text", voice: true },
      { path: "description", type: "textarea", perLang: true, voice: true },
      { path: "url", type: "text", locked: true },
      { path: "mailSupport", type: "text", input: "email" },
    ],
  },
  {
    id: "author",
    group: "basics",
    // `author.image` вернулось сюда в 31-7 вместе с механикой картинок — на своё
    // место из панели, а не в чужую секцию.
    fields: [
      // Голос — у имени, должности и рассказа о себе. Почта, адрес страницы и три
      // профиля — набираемые строки: в них решают точки, слэши и регистр.
      { path: "author.name", type: "text", voice: true },
      { path: "author.email", type: "text", input: "email" },
      { path: "author.url", type: "text", input: "url" },
      { path: "author.jobTitle", type: "text", voice: true },
      { path: "author.bio", type: "textarea", voice: true },
      { path: "author.image", type: "image", crop: "square" },
      { path: "author.twitter", type: "text" },
      { path: "author.linkedin", type: "text" },
      { path: "author.facebook", type: "text" },
    ],
  },
  {
    id: "commerce",
    group: "basics",
    fields: [
      // 🔒 ЧЕТЫРЕ ВАЛЮТЫ СПИСКОМ И ЛЮБАЯ ПЯТАЯ РУКАМИ — решение владельца 2026-08-28.
      // Обычный `select` запер бы проект в четырёх странах; обычное поле оставило бы
      // человека вспоминать, что код пишется тремя заглавными буквами (ISO 4217), — а
      // «евро» вместо «EUR» ломает разметку товара молча. Список отвечает на частый
      // случай одним щелчком и оставляет открытым весь остальной мир.
      { path: "commerce.currency", type: "combo", options: ["USD", "EUR", "PLN", "RUB"] },
    ],
  },
  {
    id: "seo",
    group: "seo",
    fields: [
      { path: "seo.indexing", type: "select", options: ["allow", "disallow"] },
      // Шаблон — не фраза, а формула с `%s`: продиктовать её нельзя в принципе.
      { path: "seo.titleTemplate", type: "text", perLang: true },
      { path: "seo.robotsIndex", type: "switch" },
      { path: "seo.robotsFollow", type: "switch" },
      // Единственное поле поиска, куда диктуют: это слова, а не код.
      { path: "seo.keywords", type: "textarea", perLang: true, voice: true },
      { path: "seo.canonicalBase", type: "text", locked: true },
      { path: "seo.sitemapUrl", type: "text", locked: true },
      // ✗ ЗДЕСЬ БЫЛ МИКРОФОН, И ВЛАДЕЛЕЦ НАЗВАЛ ЭТО ПРЯМО: «подтверждение Яндекс?
      // Реально.» Это случайная строка чужого сервиса, которую копируют из буфера:
      // произнести её нельзя, а ошибка в одном знаке рушит подтверждение целиком.
      { path: "seo.googleVerification", type: "text" },
      { path: "seo.yandexVerification", type: "text" },
    ],
  },
  {
    id: "og",
    group: "seo",
    fields: [
      { path: "og.type", type: "select", options: ["website", "article", "product"] },
      { path: "og.siteName", type: "text", perLang: true, voice: true },
      { path: "og.locale", type: "text" },
      { path: "og.imageWidth", type: "number" },
      { path: "og.imageHeight", type: "number" },
    ],
  },
  {
    id: "jsonLd",
    group: "seo",
    fields: [
      { path: "jsonLd.website", type: "switch" },
      { path: "jsonLd.organization", type: "switch" },
      { path: "jsonLd.localBusiness", type: "switch" },
    ],
  },
  {
    id: "analytics",
    group: "seo",
    fields: [
      { path: "analytics.enabled", type: "switch" },
      { path: "analytics.googleAnalyticsId", type: "text" },
    ],
  },
  {
    id: "logoImages",
    group: "metaMedia",
    fields: [
      { path: "logo", type: "image", crop: "square" },
      { path: "images.ogImage", type: "image", crop: "horizontal" },
      { path: "images.homePage-light", type: "image" },
      { path: "images.homePage-dark", type: "image" },
      { path: "images.loading-light", type: "image" },
      { path: "images.loading-dark", type: "image" },
      { path: "images.notFound-light", type: "image" },
      { path: "images.notFound-dark", type: "image" },
      { path: "images.error500-light", type: "image" },
      { path: "images.error500-dark", type: "image" },
    ],
  },
  {
    id: "pwa",
    group: "metaMedia",
    // 🔒 `iconSet` — НЕ ЗНАЧЕНИЕ, А ДЕЙСТВИЕ (31-8). Человек даёт одну квадратную
    // картинку, восемь файлов рождает сервер, и в конфиг ложится структура
    // `{ id, files }`. Поэтому у поля своя дверь (`api/architect/icons`), а кнопка
    // сохранения формы к нему отношения не имеет.
    //
    // ✗ В 31-7 ЗДЕСЬ СТОЯЛО «перенести нельзя, двери порождения нет вовсе» — и это
    // было НЕВЕРНО. Двери нет в API гостевого приложения, но она есть этажом ниже,
    // в слое данных (`POST /media/generate-icons`), с которым приложение и так
    // разговаривает. Я проверил свой слой и объявил тупик по всему пути.
    fields: [
      { path: "iconSet", type: "icons" },
      // 🔒 ЦВЕТ — НЕ СТРОКА, ХОТЯ ХРАНИТСЯ СТРОКОЙ. Человек не помнит, что светло-серый
      // это `#f4f4f5`; он его УЗНАЁТ. Поле цвета даёт образец рядом и палитру браузера,
      // а те же шестнадцать знаков остаются доступны для вставки из макета.
      { path: "pwa.themeColor", type: "color" },
      { path: "pwa.backgroundColor", type: "color" },
      { path: "pwa.display", type: "select", options: ["standalone", "fullscreen", "minimal-ui", "browser"] },
      { path: "pwa.orientation", type: "select", options: ["portrait-primary", "landscape-primary", "any"] },
      { path: "pwa.startUrl", type: "text" },
      { path: "pwa.scope", type: "text" },
      { path: "themeColors.light", type: "color" },
      { path: "themeColors.dark", type: "color" },
    ],
  },
  {
    id: "socials",
    group: "metaMedia",
    fields: [
      { path: "seo.socialLinks", type: "socials" },
    ],
  },
  {
    id: "geo",
    group: "basics",
    fields: [
      // Адрес, город и страна — то самое, ради чего голосовой ввод и заводят: их диктуют
      // на ходу. Индекс, телефон и координаты — цифры, а продиктованная цифра ошибается
      // там, где ошибиться нельзя. Часы работы — формат schema.org (`Mo-Fr 09:00-18:00`),
      // а не фраза «с девяти до шести».
      { path: "geo.address", type: "text", voice: true },
      { path: "geo.city", type: "text", voice: true },
      { path: "geo.country", type: "text", voice: true },
      { path: "geo.postalCode", type: "text" },
      { path: "geo.phone", type: "text", input: "tel" },
      { path: "geo.latitude", type: "text" },
      { path: "geo.longitude", type: "text" },
      { path: "geo.hours", type: "text" },
    ],
  },
]

/** Секции одной группы меню, в порядке описания. */
export function sectionsOfGroup(group: string): readonly Section[] {
  return SECTIONS.filter(s => s.group === group)
}

/** Все поля группы — для подсчёта и для сборки заплаты. */
export function fieldsOfGroup(group: string): readonly Field[] {
  return sectionsOfGroup(group).flatMap(s => s.fields)
}

/** Значение по пути; `undefined`, если пути нет. */
export function atPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    source,
  )
}

/**
 * Заплата из одного пути: `"seo.titleTemplate"` → `{ seo: { titleTemplate: v } }`.
 *
 * 🔒 ИМЕННО ЗАПЛАТА, А НЕ ПРАВКА СНИМКА. Дверь принимает только тронутые ветки, и
 * страница физически не может затереть то, чего не присылала
 * (`lib/architect/app-config-writer.ts`).
 */
export function patchAtPath(path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".")
  const out: Record<string, unknown> = {}
  let cur = out
  keys.forEach((key, i) => {
    if (i === keys.length - 1) cur[key] = value
    else {
      const next: Record<string, unknown> = {}
      cur[key] = next
      cur = next
    }
  })
  return out
}

/**
 * Значение поля в ТИПЕ КОНФИГА, а не в типе формы.
 *
 * 🔒 ФОРМА ДЕРЖИТ ВСЁ СТРОКАМИ — так устроен ввод в браузере. Конфиг держит
 * булево булевым и число числом, и записать туда строку `"true"` значит потерять
 * настройку МОЛЧА: проверка на чтении щадящая, она уронит ключ неверного типа на
 * его умолчание и не скажет ни слова. Переключатель останется выключенным, а
 * человек будет уверен, что включил его.
 *
 * Пустое число — это `null` (то есть «стереть»), а не `0`: ноль ширины картинки
 * и отсутствие ширины — разные вещи, и превращать одно в другое нельзя.
 */
export function typedValue(field: Field, raw: string): unknown {
  if (field.type === "switch") return raw === "true"
  // 🔒 СПИСОК СОЦСЕТЕЙ ЕДЕТ ЧЕРЕЗ СОСТОЯНИЕ ФОРМЫ СТРОКОЙ JSON, и это осознанно:
  // движок держит значения полей в `Record<string, string>`, и заводить второе
  // хранилище ради одного поля значило бы иметь два правила «что считать
  // изменённым». Разбор здесь, на границе с конфигом, где он и нужен.
  // Разбор не удался — отдаём пустой список, а не мусор: испорченное значение
  // должно очистить список, а не записать в конфиг строку вместо массива.
  if (field.type === "socials") {
    try {
      const parsed: unknown = JSON.parse(raw || "[]")
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  if (field.type === "number") {
    if (raw.trim() === "") return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  }
  return raw
}

/** Слияние заплат в одну — по тем же правилам, что у писателя на сервере. */
export function mergePatches(patches: readonly Record<string, unknown>[]): Record<string, unknown> {
  const merge = (a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> => {
    const out = { ...a }
    for (const [k, v] of Object.entries(b)) {
      const prev = out[k]
      out[k] =
        v && typeof v === "object" && !Array.isArray(v) && prev && typeof prev === "object" && !Array.isArray(prev)
          ? merge(prev as Record<string, unknown>, v as Record<string, unknown>)
          : v
    }
    return out
  }
  return patches.reduce<Record<string, unknown>>((acc, p) => merge(acc, p), {})
}
