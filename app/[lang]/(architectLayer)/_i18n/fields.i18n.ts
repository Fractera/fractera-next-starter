// ПОДПИСИ ПОЛЕЙ И СЕКЦИЙ (31-4, 2026-08-28).
//
// 🔒 АНГЛИЙСКИЕ ПОДПИСИ ПЕРЕНЕСЕНЫ ИЗ ПАНЕЛИ ДОСЛОВНО. Человек, знавший старую
// вкладку, обязан узнать поле по слову; «улучшенная» формулировка заставила бы его
// заново соображать, то же ли это поле.
//
// 🔒 ЯЗЫКОВ ДВА — решение владельца 2026-08-28: «en + ru сейчас, остальные файлом
// позже». Резолвер откатывается на английский, поэтому третий язык видит рабочую
// форму, а не пустые подписи.
//
// 🔒 ПОДПИСЬ ЖИВЁТ ЗДЕСЬ, А ПУТЬ — В `_lib/fields.ts`, и это разделение намеренное:
// путь есть контракт с читателями конфига и не меняется никогда, подпись —
// человеческий текст, который правится и переводится свободно.

export type FieldWords = {
  label: string
  hint?: string
  placeholder?: string
  /**
   * Подписи вариантов списка: значение → слово.
   *
   * 🔒 ЗНАЧЕНИЯ ЖИВУТ В ОПИСАНИИ ПОЛЯ, СЛОВА — ЗДЕСЬ. Значение (`allow`) есть
   * контракт с читателями конфига и не переводится никогда; слово («Разрешить
   * индексацию») — человеческий текст. Слить их в одно место значило бы либо
   * заморозить перевод в контракте, либо переводить контракт.
   */
  options?: Record<string, string>
}

export type FieldsUi = {
  /** Заголовки секций по `id`. */
  sections: Record<string, string>
  /**
   * Объяснение секции — там, где без него поле выглядит необязательным.
   *
   * 🔒 ПЕРЕНЕСЕНО ИЗ ПАНЕЛИ ВМЕСТЕ С ПОЛЯМИ, а не выброшено как «мелочь»: текст
   * про валюту объясняет, почему пустое поле стоит человеку карточки товара в
   * поиске. Такое знание, потерянное при переезде, потом покупается заново
   * недоумением владельца.
   */
  sectionHints: Record<string, string>
  /** Слова полей по пути в конфиге. */
  fields: Record<string, FieldWords>
  /** Общие подписи формы. */
  save: string
  saving: string
  saved: string
  failed: string
  nothingToSave: string
  /** Пометка «значение своё на каждый язык». */
  perLang: string
  /** Пометка «перевод есть» / «перевода нет». */
  translated: string
  notTranslated: string
  /** Пометка заблокированного поля. */
  locked: string
  lockedHint: string
}

const en: FieldsUi = {
  sections: {
    brand: "Brand & identity",
    author: "Author",
    commerce: "Commerce",
    geo: "Local business / address",
    seo: "SEO",
    og: "OpenGraph",
    jsonLd: "Structured data (JSON-LD)",
    analytics: "Analytics",
  },
  sectionHints: {
    author: "Default author used in metadata and Person structured data.",
    commerce:
      "The currency every price on the site is shown and published in. A price without a currency means nothing to a visitor, and product markup without it is rejected by search engines outright.",
    geo: "Only used when the LocalBusiness schema is on.",
    og: "The card other sites and messengers show when someone shares a link to this project.",
    jsonLd: "Structured data: what the site tells machines about itself. LocalBusiness reads the address section.",
    analytics: "Google Analytics stays off until a measurement ID is entered — the switch alone changes nothing.",
  },
  fields: {
    "author.name": { label: "Name" },
    "author.email": { label: "Email" },
    "author.url": { label: "URL" },
    "author.jobTitle": { label: "Job title" },
    "author.bio": { label: "Bio" },
    "author.twitter": { label: "Twitter", placeholder: "@handle or URL" },
    "author.linkedin": { label: "LinkedIn" },
    "author.facebook": { label: "Facebook" },
    "seo.indexing": {
      label: "Indexing",
      options: { allow: "Allow (index this site)", disallow: "Disallow (no-index)" },
    },
    "seo.titleTemplate": { label: "Title template", placeholder: "%s | Brand", hint: "%s is the page title." },
    "seo.robotsIndex": { label: "Robots: index" },
    "seo.robotsFollow": { label: "Robots: follow" },
    "seo.keywords": { label: "Keywords", placeholder: "comma, separated" },
    "seo.canonicalBase": {
      label: "Canonical base URL",
      hint: "Same address as Site URL — search engines use it to name the one true copy of a page.",
    },
    "seo.sitemapUrl": { label: "Sitemap URL", hint: "The site map the app generates at that address." },
    "seo.googleVerification": { label: "Google verification" },
    "seo.yandexVerification": { label: "Yandex verification" },
    "og.type": { label: "Type", options: { website: "website", article: "article", product: "product" } },
    "og.siteName": { label: "Site name" },
    "og.locale": { label: "Locale", placeholder: "en_US" },
    "og.imageWidth": { label: "Image width", placeholder: "1200" },
    "og.imageHeight": { label: "Image height", placeholder: "630" },
    "jsonLd.website": { label: "WebSite schema" },
    "jsonLd.organization": { label: "Organization schema" },
    "jsonLd.localBusiness": { label: "LocalBusiness schema" },
    "analytics.enabled": { label: "Enable Google Analytics" },
    "analytics.googleAnalyticsId": { label: "Measurement ID", placeholder: "G-XXXXXXX" },
    "commerce.currency": { label: "Currency", placeholder: "USD · EUR · PLN · RUB" },
    "geo.address": { label: "Street address" },
    "geo.city": { label: "City" },
    "geo.country": { label: "Country" },
    "geo.postalCode": { label: "Postal code" },
    "geo.phone": { label: "Phone" },
    "geo.latitude": { label: "Latitude" },
    "geo.longitude": { label: "Longitude" },
    "geo.hours": { label: "Opening hours", placeholder: "Mo-Fr 09:00-18:00" },
    name: { label: "App name", placeholder: "Fractera" },
    short_name: { label: "Short name", placeholder: "Fractera", hint: "Used by the PWA icon label." },
    description: { label: "Description", placeholder: "What this app is…" },
    url: {
      label: "Site URL",
      hint: "Follows this server's domain. Change it in the panel → Personal Domain.",
    },
    mailSupport: { label: "Support email", placeholder: "admin@example.com" },
  },
  save: "Save",
  saving: "Saving…",
  saved: "Saved",
  failed: "Could not save",
  nothingToSave: "Nothing changed",
  perLang: "per language",
  translated: "translated",
  notTranslated: "no translation",
  locked: "read-only",
  lockedHint: "This value follows the address the server actually answers on.",
}

const ru: FieldsUi = {
  sections: {
    brand: "Имя и лицо проекта",
    author: "Автор",
    commerce: "Торговля",
    geo: "Адрес и организация",
    seo: "Поиск",
    og: "Карточка ссылки (OpenGraph)",
    jsonLd: "Разметка для машин (JSON-LD)",
    analytics: "Аналитика",
  },
  sectionHints: {
    author: "Автор по умолчанию: он подставляется в мету страниц и в разметку «Person» для поисковиков.",
    commerce:
      "Валюта, в которой сайт показывает и публикует любую цену. Цена без валюты ничего не значит для посетителя, а разметку товара без неё поисковик отвергает целиком — карточка с ценой просто не появляется.",
    geo: "Используется, только когда включена разметка LocalBusiness.",
    og: "Карточка, которую покажут другие сайты и мессенджеры, когда кто-то поделится ссылкой на проект.",
    jsonLd: "Структурированные данные: что сайт сообщает машинам о себе. Разметка LocalBusiness читает секцию адреса.",
    analytics: "Google Analytics не работает без идентификатора счётчика — один переключатель ничего не включает.",
  },
  fields: {
    "author.name": { label: "Имя" },
    "author.email": { label: "Почта" },
    "author.url": { label: "Адрес страницы" },
    "author.jobTitle": { label: "Должность" },
    "author.bio": { label: "О себе" },
    "author.twitter": { label: "Twitter", placeholder: "@ник или адрес" },
    "author.linkedin": { label: "LinkedIn" },
    "author.facebook": { label: "Facebook" },
    "seo.indexing": {
      label: "Индексация",
      options: { allow: "Разрешить (сайт в поиске)", disallow: "Запретить (скрыть из поиска)" },
    },
    "seo.titleTemplate": {
      label: "Шаблон заголовка",
      placeholder: "%s | Бренд",
      hint: "%s — это заголовок самой страницы.",
    },
    "seo.robotsIndex": { label: "Роботам: индексировать" },
    "seo.robotsFollow": { label: "Роботам: ходить по ссылкам" },
    "seo.keywords": { label: "Ключевые слова", placeholder: "через, запятую" },
    "seo.canonicalBase": {
      label: "Канонический адрес",
      hint: "Тот же адрес, что и адрес сайта: по нему поисковик решает, какая копия страницы настоящая.",
    },
    "seo.sitemapUrl": { label: "Адрес карты сайта", hint: "Карта, которую приложение отдаёт по этому адресу." },
    "seo.googleVerification": { label: "Подтверждение Google" },
    "seo.yandexVerification": { label: "Подтверждение Яндекса" },
    "og.type": { label: "Тип", options: { website: "сайт", article: "статья", product: "товар" } },
    "og.siteName": { label: "Имя сайта в карточке" },
    "og.locale": { label: "Локаль", placeholder: "ru_RU" },
    "og.imageWidth": { label: "Ширина картинки", placeholder: "1200" },
    "og.imageHeight": { label: "Высота картинки", placeholder: "630" },
    "jsonLd.website": { label: "Разметка WebSite" },
    "jsonLd.organization": { label: "Разметка Organization" },
    "jsonLd.localBusiness": { label: "Разметка LocalBusiness" },
    "analytics.enabled": { label: "Включить Google Analytics" },
    "analytics.googleAnalyticsId": { label: "Идентификатор счётчика", placeholder: "G-XXXXXXX" },
    "commerce.currency": { label: "Валюта", placeholder: "USD · EUR · PLN · RUB" },
    "geo.address": { label: "Улица и дом" },
    "geo.city": { label: "Город" },
    "geo.country": { label: "Страна" },
    "geo.postalCode": { label: "Почтовый индекс" },
    "geo.phone": { label: "Телефон" },
    "geo.latitude": { label: "Широта" },
    "geo.longitude": { label: "Долгота" },
    "geo.hours": { label: "Часы работы", placeholder: "Пн-Пт 09:00-18:00" },
    name: { label: "Название приложения", placeholder: "Fractera" },
    short_name: { label: "Короткое имя", placeholder: "Fractera", hint: "Подпись под значком приложения." },
    description: { label: "Описание", placeholder: "О чём это приложение…" },
    url: {
      label: "Адрес сайта",
      hint: "Следует за доменом этого сервера. Меняется в панели → «Личный домен».",
    },
    mailSupport: { label: "Почта поддержки", placeholder: "admin@example.com" },
  },
  save: "Сохранить",
  saving: "Сохраняем…",
  saved: "Сохранено",
  failed: "Не удалось сохранить",
  nothingToSave: "Ничего не изменилось",
  perLang: "на каждый язык",
  translated: "перевод есть",
  notTranslated: "перевода нет",
  locked: "только чтение",
  lockedHint: "Значение следует за адресом, на который сервер реально отвечает.",
}

const DICT: Record<string, FieldsUi> = { en, ru }

export function fieldsUi(lang: string): FieldsUi {
  return DICT[lang] ?? DICT.en
}
