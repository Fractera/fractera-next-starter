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
  savedReload: string
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
  /** Поле-картинка. */
  upload: string
  uploaded: string
  uploadFailed: string
  clear: string
  noImage: string
  /** Набор значков приложения. */
  iconsSlice: string
  iconsDrop: string
  iconsDone: string
  iconsDropped: string
  iconsFailed: string
  iconsCurrent: string
  iconsNone: string
  /** Конструктор соцсетей. */
  socialsEmpty: string
  socialName: string
  socialValue: string
  socialTemplate: string
  socialAdd: string
  socialIcon: string
  socialIconNone: string
  socialRemove: string
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
    logoImages: "Logo & images",
    pwa: "App icons & PWA",
    socials: "Social profiles",
  },
  sectionHints: {
    author: "Default author used in metadata and Person structured data.",
    commerce:
      "The currency every price on the site is shown and published in. A price without a currency means nothing to a visitor, and product markup without it is rejected by search engines outright.",
    geo: "Only used when the LocalBusiness schema is on.",
    og: "The card other sites and messengers show when someone shares a link to this project.",
    jsonLd: "Structured data: what the site tells machines about itself. LocalBusiness reads the address section.",
    analytics: "Google Analytics stays off until a measurement ID is entered — the switch alone changes nothing.",
    logoImages: "Every picture here is optional: without one the project shows its own placeholder.",
    pwa: "How the project looks once it is installed as an app. Give one square image and the server cuts the whole icon set from it.",
    socials: "Linked from the footer, the OG card and Organization sameAs. Each entry carries its own address rule, so the link is computed rather than guessed.",
  },
  fields: {
    'author.image': { label: 'Photo' },
    logo: { label: 'Logo' },
    'images.ogImage': { label: 'OG / social image' },
    'images.homePage-light': { label: 'Home illustration (light)' },
    'images.homePage-dark': { label: 'Home illustration (dark)' },
    'images.loading-light': { label: 'Loading (light)' },
    'images.loading-dark': { label: 'Loading (dark)' },
    'images.notFound-light': { label: '404 (light)' },
    'images.notFound-dark': { label: '404 (dark)' },
    'images.error500-light': { label: '500 (light)' },
    'images.error500-dark': { label: '500 (dark)' },
    'pwa.themeColor': { label: 'Theme color', placeholder: '#ffffff' },
    'pwa.backgroundColor': { label: 'Background color', placeholder: '#ffffff' },
    'pwa.display': { label: 'Display' },
    'pwa.orientation': { label: 'Orientation' },
    'pwa.startUrl': { label: 'Start URL', placeholder: '/' },
    'pwa.scope': { label: 'Scope', placeholder: '/' },
    'themeColors.light': { label: 'Browser bar color (light)', placeholder: '#ffffff' },
    'themeColors.dark': { label: 'Browser bar color (dark)', placeholder: '#09090b' },
    'seo.socialLinks': { label: 'Social networks' },
    iconSet: { label: 'App icon set' },
    "author.name": { label: "Name", placeholder: "Jane Doe" },
    "author.email": { label: "Email", placeholder: "you@example.com" },
    "author.url": { label: "URL", placeholder: "https://example.com" },
    "author.jobTitle": { label: "Job title", placeholder: "Founder" },
    "author.bio": { label: "Bio", placeholder: "A couple of sentences about yourself…" },
    "author.twitter": { label: "Twitter", placeholder: "@handle or URL" },
    "author.linkedin": { label: "LinkedIn", placeholder: "in/handle or URL" },
    "author.facebook": { label: "Facebook", placeholder: "handle or URL" },
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
    "seo.googleVerification": { label: "Google verification", placeholder: "google-site-verification code", hint: "Copied from Search Console — paste it, do not retype it." },
    "seo.yandexVerification": { label: "Yandex verification", placeholder: "yandex-verification code", hint: "Copied from Yandex Webmaster — paste it, do not retype it." },
    "og.type": { label: "Type", options: { website: "website", article: "article", product: "product" } },
    "og.siteName": { label: "Site name", placeholder: "Fractera" },
    "og.locale": { label: "Locale", placeholder: "en_US" },
    "og.imageWidth": { label: "Image width", placeholder: "1200" },
    "og.imageHeight": { label: "Image height", placeholder: "630" },
    "jsonLd.website": { label: "WebSite schema" },
    "jsonLd.organization": { label: "Organization schema" },
    "jsonLd.localBusiness": { label: "LocalBusiness schema" },
    "analytics.enabled": { label: "Enable Google Analytics" },
    "analytics.googleAnalyticsId": { label: "Measurement ID", placeholder: "G-XXXXXXX" },
    "commerce.currency": {
      label: "Currency",
      placeholder: "Any ISO 4217 code — UAH, KZT, GBP…",
      hint: "Three capital letters (ISO 4217). Pick one above, or type any other.",
      options: { USD: "USD $", EUR: "EUR €", PLN: "PLN zł", RUB: "RUB ₽" },
    },
    "geo.address": { label: "Street address", placeholder: "1111B S Governors Ave STE 45122" },
    "geo.city": { label: "City", placeholder: "Dover" },
    "geo.country": { label: "Country", placeholder: "United States" },
    "geo.postalCode": { label: "Postal code", placeholder: "19904" },
    "geo.phone": { label: "Phone", placeholder: "+1 302 000 0000" },
    "geo.latitude": { label: "Latitude", placeholder: "39.158100" },
    "geo.longitude": { label: "Longitude", placeholder: "-75.524400" },
    "geo.hours": { label: "Opening hours", placeholder: "Mo-Fr 09:00-18:00" },
    name: { label: "App name", placeholder: "Fractera" },
    short_name: { label: "Short name", placeholder: "Fractera", hint: "Used by the PWA icon label." },
    description: { label: "Description", placeholder: "What this app is…" },
    url: {
      label: "Site URL",
      hint: "Follows this server's domain — set where the project was deployed.",
    },
    mailSupport: { label: "Support email", placeholder: "admin@example.com" },
  },
  save: "Save",
  saving: "Saving…",
  saved: "Saved",
  savedReload: "Saved. Reload the page to see the change.",
  failed: "Could not save",
  nothingToSave: "Nothing changed",
  perLang: "per language",
  translated: "translated",
  notTranslated: "no translation",
  locked: "read-only",
  lockedHint: "This value follows the address the server actually answers on.",
  upload: "Upload",
  uploaded: "Image uploaded",
  uploadFailed: "Could not upload the image",
  clear: "Clear the image",
  noImage: "No image yet — the project shows its built-in placeholder.",
  iconsSlice: "Slice from an image",
  iconsDrop: "Remove the set",
  iconsDone: "The icon set is ready",
  iconsDropped: "The set is removed — the project icons are back",
  iconsFailed: "Could not slice the icon set",
  iconsCurrent: "This set is in use: favicon, home-screen icon and the app manifest.",
  iconsNone: "No set yet — the project uses the icons it ships with. Give one square image and the server cuts the rest.",
  socialsEmpty: "No networks yet.",
  socialName: "Network",
  socialValue: "Handle or address",
  socialTemplate: "Address rule",
  socialAdd: "Add a network",
  socialIcon: "Icon",
  socialIconNone: "No icon",
  socialRemove: "Remove the network",
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
    logoImages: "Логотип и картинки",
    pwa: "Значок приложения и PWA",
    socials: "Профили в соцсетях",
  },
  sectionHints: {
    author: "Автор по умолчанию: он подставляется в мету страниц и в разметку «Person» для поисковиков.",
    commerce:
      "Валюта, в которой сайт показывает и публикует любую цену. Цена без валюты ничего не значит для посетителя, а разметку товара без неё поисковик отвергает целиком — карточка с ценой просто не появляется.",
    geo: "Используется, только когда включена разметка LocalBusiness.",
    og: "Карточка, которую покажут другие сайты и мессенджеры, когда кто-то поделится ссылкой на проект.",
    jsonLd: "Структурированные данные: что сайт сообщает машинам о себе. Разметка LocalBusiness читает секцию адреса.",
    analytics: "Google Analytics не работает без идентификатора счётчика — один переключатель ничего не включает.",
    logoImages: "Любая картинка здесь необязательна: без неё проект показывает собственную заглушку.",
    pwa: "Как проект выглядит установленным приложением. Дайте одну квадратную картинку — весь набор значков сервер нарежет из неё сам.",
    socials: "Ссылки идут в подвал сайта, в карточку OG и в разметку Organization. У каждой записи своё правило адреса, поэтому ссылка считается, а не угадывается.",
  },
  fields: {
    'author.image': { label: 'Фотография' },
    logo: { label: 'Логотип' },
    'images.ogImage': { label: 'Картинка для соцсетей (OG)' },
    'images.homePage-light': { label: 'Иллюстрация главной (светлая)' },
    'images.homePage-dark': { label: 'Иллюстрация главной (тёмная)' },
    'images.loading-light': { label: 'Загрузка (светлая)' },
    'images.loading-dark': { label: 'Загрузка (тёмная)' },
    'images.notFound-light': { label: '404 (светлая)' },
    'images.notFound-dark': { label: '404 (тёмная)' },
    'images.error500-light': { label: '500 (светлая)' },
    'images.error500-dark': { label: '500 (тёмная)' },
    'pwa.themeColor': { label: 'Цвет темы', placeholder: '#ffffff' },
    'pwa.backgroundColor': { label: 'Цвет фона', placeholder: '#ffffff' },
    'pwa.display': { label: 'Режим окна' },
    'pwa.orientation': { label: 'Ориентация' },
    'pwa.startUrl': { label: 'Стартовый адрес', placeholder: '/' },
    'pwa.scope': { label: 'Область приложения', placeholder: '/' },
    'themeColors.light': { label: 'Цвет строки браузера (светлая)', placeholder: '#ffffff' },
    'themeColors.dark': { label: 'Цвет строки браузера (тёмная)', placeholder: '#09090b' },
    'seo.socialLinks': { label: 'Соцсети' },
    iconSet: { label: 'Набор значков приложения' },
    "author.name": { label: "Имя", placeholder: "Иван Петров" },
    "author.email": { label: "Почта", placeholder: "you@example.com" },
    "author.url": { label: "Адрес страницы", placeholder: "https://example.com" },
    "author.jobTitle": { label: "Должность", placeholder: "Основатель" },
    "author.bio": { label: "О себе", placeholder: "Пара предложений о себе…" },
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
    "seo.googleVerification": { label: "Подтверждение Google", placeholder: "код google-site-verification", hint: "Копируется из Search Console — вставьте его, а не набирайте." },
    "seo.yandexVerification": { label: "Подтверждение Яндекса", placeholder: "код yandex-verification", hint: "Копируется из Яндекс.Вебмастера — вставьте его, а не набирайте." },
    "og.type": { label: "Тип", options: { website: "сайт", article: "статья", product: "товар" } },
    "og.siteName": { label: "Имя сайта в карточке", placeholder: "Fractera" },
    "og.locale": { label: "Локаль", placeholder: "ru_RU" },
    "og.imageWidth": { label: "Ширина картинки", placeholder: "1200" },
    "og.imageHeight": { label: "Высота картинки", placeholder: "630" },
    "jsonLd.website": { label: "Разметка WebSite" },
    "jsonLd.organization": { label: "Разметка Organization" },
    "jsonLd.localBusiness": { label: "Разметка LocalBusiness" },
    "analytics.enabled": { label: "Включить Google Analytics" },
    "analytics.googleAnalyticsId": { label: "Идентификатор счётчика", placeholder: "G-XXXXXXX" },
    "commerce.currency": {
      label: "Валюта",
      placeholder: "Любой код ISO 4217 — UAH, KZT, GBP…",
      hint: "Три заглавные буквы (ISO 4217). Выберите сверху или впишите любую другую.",
      options: { USD: "USD $", EUR: "EUR €", PLN: "PLN zł", RUB: "RUB ₽" },
    },
    "geo.address": { label: "Улица и дом", placeholder: "ул. Ленина, 15, оф. 3" },
    "geo.city": { label: "Город", placeholder: "Москва" },
    "geo.country": { label: "Страна", placeholder: "Россия" },
    "geo.postalCode": { label: "Почтовый индекс", placeholder: "101000" },
    "geo.phone": { label: "Телефон", placeholder: "+7 900 000-00-00" },
    "geo.latitude": { label: "Широта", placeholder: "55.755800" },
    "geo.longitude": { label: "Долгота", placeholder: "37.617600" },
    "geo.hours": { label: "Часы работы", placeholder: "Пн-Пт 09:00-18:00" },
    name: { label: "Название приложения", placeholder: "Fractera" },
    short_name: { label: "Короткое имя", placeholder: "Fractera", hint: "Подпись под значком приложения." },
    description: { label: "Описание", placeholder: "О чём это приложение…" },
    url: {
      label: "Адрес сайта",
      hint: "Следует за доменом этого сервера — задаётся там, где проект развёрнут.",
    },
    mailSupport: { label: "Почта поддержки", placeholder: "admin@example.com" },
  },
  save: "Сохранить",
  saving: "Сохраняем…",
  saved: "Сохранено",
  savedReload: "Сохранено. Обновите страницу, чтобы увидеть изменения.",
  failed: "Не удалось сохранить",
  nothingToSave: "Ничего не изменилось",
  perLang: "на каждый язык",
  translated: "перевод есть",
  notTranslated: "перевода нет",
  locked: "только чтение",
  lockedHint: "Значение следует за адресом, на который сервер реально отвечает.",
  upload: "Загрузить",
  uploaded: "Картинка загружена",
  uploadFailed: "Не удалось загрузить картинку",
  clear: "Убрать картинку",
  noImage: "Картинки пока нет — проект показывает встроенную заглушку.",
  iconsSlice: "Нарезать из картинки",
  iconsDrop: "Убрать набор",
  iconsDone: "Набор значков готов",
  iconsDropped: "Набор убран — вернулись значки проекта",
  iconsFailed: "Не удалось нарезать набор",
  iconsCurrent: "Этот набор используется: значок вкладки, значок на домашнем экране и манифест приложения.",
  iconsNone: "Набора пока нет — проект показывает свои встроенные значки. Дайте одну квадратную картинку, остальное сервер нарежет сам.",
  socialsEmpty: "Сетей пока нет.",
  socialName: "Сеть",
  socialValue: "Псевдоним или адрес",
  socialTemplate: "Правило адреса",
  socialAdd: "Добавить сеть",
  socialIcon: "Значок",
  socialIconNone: "Без значка",
  socialRemove: "Убрать сеть",
}

const DICT: Record<string, FieldsUi> = { en, ru }

export function fieldsUi(lang: string): FieldsUi {
  return DICT[lang] ?? DICT.en
}
