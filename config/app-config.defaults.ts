// Site configuration — TYPES + DEFAULTS only (pure data, no fs / no env reads).
//
// This file is safe to import from anywhere (server OR client): it holds the AppConfig
// shape and the committed Fractera defaults that seed a fresh server. The live config is
// a runtime JSON file on disk read by config/app-config.ts (server-only) — changing it in
// Admin -> Site Settings updates branding/SEO/PWA WITHOUT a rebuild (no NEXT_PUBLIC bake-in).
//
// Ported from the 22slots app-config pattern, adapted so image fields hold OBJECT-STORAGE
// references (media URLs / an icon-set id) instead of static public/ paths.

export type ImageFormat = "png" | "jpg" | "jpeg" | "webp" | "avif" | "svg" | "gif";

// 🪦 `chatbot-dark` / `chatbot-light` УДАЛЕНЫ 2026-08-15. Это были слоты картинок
// для чата Hermes, снесённого задачей 3 шага 500. Панель управления вынесла тот же
// вердикт раньше (`bridges/app/.../app-settings/_lib/fields.ts` — `REMOVED_FIELDS`
// + `dropRemovedFields` вычищает их из JSON при каждом сохранении), а шаблон слота
// продолжал их объявлять: тип обещал два слота, которых панель уже не предлагает и
// которые никто никогда не читал. Не воскрешать.
export type RegularImageType =
  | "ogImage"
  | "loading-dark"
  | "loading-light"
  | "notFound-dark"
  | "notFound-light"
  | "error500-dark"
  | "error500-light"
  | "homePage-dark"
  | "homePage-light";

export type AllImageTypes = RegularImageType | "logo";

export interface AuthorConfig {
  name: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  url?: string;
  jobTitle?: string;
  bio?: string;
  image?: string;
}

export interface SocialConfig {
  twitter?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
}

/**
 * Одна соцсеть — САМОСТОЯТЕЛЬНАЯ ЗАПИСЬ, а не ключ в закрытом наборе (шаг 523).
 *
 * 🔒 ЧТО ЭТО ЛЕЧИТ. `SocialConfig` выше — четыре зашитых ключа, и к каждому намертво
 * привязаны значок и правило сборки адреса. Пятая сеть не добавляется вовсе: значка
 * для неё нет, а правило ссылки взять неоткуда. И у каждой сети правило своё —
 * `t.me/<псевдоним>`, `wa.me/<номер>`, у LinkedIn личный профиль это `/in/`, а не
 * `/company/`. Свободное поле ввода этого не знает и молча собирает нерабочий адрес.
 *
 * Поэтому запись несёт ПРАВИЛО вместе со значением: адрес считается, а не угадывается.
 */
export interface SocialLink {
  /** Вечный идентификатор записи: на нём держатся порядок и значок. */
  id: string;
  /** Каноническое имя сети — «Telegram», «X», «LinkedIn». Его предлагает модель. */
  name: string;
  /**
   * Правило сборки адреса: `https://t.me/{value}`.
   *
   * Плейсхолдера нет — значит `urlTemplate` уже полный адрес, и `value` не участвует.
   * Так выражается сеть, у которой нет предсказуемой формы профиля.
   */
  urlTemplate: string;
  /** То, что ввёл владелец: псевдоним, номер, полный адрес. */
  value: string;
  /**
   * Значок, ПОЛОЖЕННЫЙ В ПРОЕКТ (`/api/media/<id>/file`), а не ссылка на чужой хост:
   * страница обязана работать офлайн. Значка может не быть — это законное состояние.
   */
  icon?: string;
}

export type ContentType = "website" | "article" | "blog" | "product" | "documentation";
export type OpenGraphTypeConfig = ContentType | "profile" | "video.other";

// A generated PWA/favicon icon set — produced by the Data service POST /media/generate-icons
// from one square logo. `files` maps logical names (favicon_ico, icon_192, ...) to the
// per-file path the icons-serving route resolves. `id` is the icon_set row id.
export interface IconSet {
  id: string;
  files: Record<string, string>;
}

export interface AppConfig {
  name: string;
  short_name: string;
  description: string;
  url: string;
  manifest: string;
  mailSupport: string;
  lang: string;

  // Object-storage references (media URL like /api/media/{id}/file) or null when unset.
  images: Record<RegularImageType, string | null>;
  logo: string | null;

  // Individual icon URLs (used when no generated set is present).
  icons: {
    faviconAny?: string;
    icon32?: string;
    icon48?: string;
    icon192?: string;
    icon512?: string;
    icon512Maskable?: string;
    appleTouch?: string;
  };
  // A generated set takes precedence over `icons` for manifest + <head> links.
  iconSet: IconSet | null;

  pwa: {
    themeColor: string;
    backgroundColor: string;
    startUrl: string;
    display: "fullscreen" | "standalone" | "minimal-ui" | "browser";
    scope?: string;
    orientation?: "any" | "portrait-primary" | "landscape-primary";
  };
  themeColors: { light: string; dark: string };

  seo: {
    indexing: "allow" | "disallow";
    titleTemplate?: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
    keywords?: string;
    canonicalBase?: string;
    sitemapUrl?: string;
    disallowPaths?: string[];
    locales?: string[];
    defaultLocale?: string;
    googleVerification?: string;
    yandexVerification?: string;
    social: SocialConfig;
    /**
     * Открытый список сетей (шаг 523). Пусто или отсутствует — работают четыре
     * ключа `social` выше, и ни один существующий проект ссылок не теряет.
     */
    socialLinks?: SocialLink[];
  };

  og: {
    type: OpenGraphTypeConfig;
    locale?: string;
    siteName?: string;
    imageWidth: number;
    imageHeight: number;
  };

  author: AuthorConfig;
  analytics: { googleAnalyticsId?: string; enabled: boolean };
  jsonLd: { website: boolean; organization: boolean; localBusiness: boolean };
  geo: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
    latitude?: string;
    longitude?: string;
    hours?: string;
  };
  // Валюта витрины — ОДНА на сайт, ISO-4217 (`USD`, `EUR`, `RUB`).
  //
  // 🔒 ПОЧЕМУ ЭТО НАСТРОЙКА, А НЕ КОНСТАНТА. Цена без валюты не значит ничего в
  // обеих плоскостях сразу: человек видит «1.20» и не знает, чего именно, а
  // разметка товара БЕЗ `priceCurrency` отвергается поисковиком целиком —
  // карточка с ценой не появляется, хотя разметка вроде бы есть. Магазин в
  // Варшаве и магазин в Далласе ставят здесь разное, поэтому значение живёт в
  // настройках, а не в коде.
  commerce: { currency: string };
}

// 🪦 УДАЛЕНЫ 2026-08-15 — два поля, которые объявлялись и не читались никем:
//
//   `contentTypeDefaults` — сопоставление blog/product/documentation с типом
//   OpenGraph. Потребителей ноль в шаблоне и поля нет в панели: значение нельзя
//   было ни задать, ни применить.
//
//   `menus: { authButton }` — устарело ещё шагом 161, публичный вход задаётся
//   сборочным ключом NEXT_PUBLIC_APP_SHELL_AUTH. Поле держали «ради совместимости
//   файла на диске», и оно обросло собственным обслуживанием: `app-config.agent-view.ts`
//   отдельной строкой ПРЯТАЛ его от агента. Дешевле удалить поле, чем кормить код,
//   который его скрывает. Лишний ключ в чужом app-config.json безвреден — читатель
//   сливает сохранённое поверх этих значений и незнакомые ключи игнорирует.

export const DEFAULT_APP_CONFIG: AppConfig = {
  // These defaults ship with the starter and are what a fresh server serves until
  // its owner saves settings in the panel once. They must therefore describe the
  // product as it IS: the production-coding positioning they carried before was
  // dropped with the coding agents in step 500, and a new server announcing it
  // would be advertising a product that no longer exists.
  name: "Fractera — Agentic Engineering Infrastructure",
  short_name: "Fractera",
  description:
    "Agentic Engineering Infrastructure — your own server, your own code, run and configured from one control panel.",
  // 🔒 ПУСТО НАМЕРЕННО. Адрес — ФАКТ развёртывания, а не мнение: его знает
  // сервер, а не автор шаблона. Пока он неизвестен, код не имеет права
  // подставить чужой: отсутствующий canonical безвреден (поисковик считает
  // страницу собственной копией сам), чужой — разрушителен, он отдаёт весь вес
  // домену платформы и выбрасывает сайт клиента из индекса.
  url: "",
  manifest: "/manifest.webmanifest",
  mailSupport: "admin@fractera.ai",
  lang: "en",

  // 🔒 СТРАНИЦЫ-ЗАГЛУШКИ ИМЕЮТ КАРТИНКУ СРАЗУ (заказ владельца 2026-08-15).
  //
  // Раньше здесь стояли одни `null`, и это было половиной механизма: панель
  // предлагала загрузить восемь картинок, а приложение не читало ни одной.
  // Единственная живая картинка — знак на странице 404 — была вписана прямо в
  // компонент путём `/404-logo.png`, то есть мимо настроек: владелец мог
  // загрузить свой знак и не увидеть его нигде.
  //
  // Файлы рождает `npm run images:placeholders` (знак в двух тонах) и лежит в git
  // (иллюстрация главной). Загрузил владелец своё — панель пишет сюда URL из
  // хранилища, и он перекрывает эти пути БЕЗ пересборки.
  //
  // `ogImage` намеренно остаётся пустым: это картинка для чужой ленты, и знак
  // Fractera в анонсе ЧУЖОГО сайта — не заглушка, а подпись не того автора.
  images: {
    ogImage: null,
    "loading-dark": "/placeholders/logo-dark.png",
    "loading-light": "/placeholders/logo-light.png",
    "notFound-dark": "/placeholders/logo-dark.png",
    "notFound-light": "/placeholders/logo-light.png",
    "error500-dark": "/placeholders/logo-dark.png",
    "error500-light": "/placeholders/logo-light.png",
    "homePage-dark": "/placeholders/home.jpg",
    "homePage-light": "/placeholders/home.jpg",
  },
  logo: null,

  // 🔒 СТАРТОВЫЕ ИКОНКИ ЕСТЬ СРАЗУ (заказ владельца 2026-08-13).
  //
  // Раньше здесь стоял только `favicon.ico`, и манифест свежего проекта уезжал
  // БЕЗ иконок — а манифест без иконок означает ровно одно: приложение нельзя
  // установить. Вся работа по PWA была сделана, а телефон предложить установку не
  // мог. Замер на живом сайте показывал `иконок=0`.
  //
  // Файлы — нейтральная геометрическая заглушка (`npm run icons:default`), без
  // букв и без чьего-либо логотипа: подделка под бренд была бы хуже пустоты, её
  // не замечают и не исправляют. Загрузил владелец своё изображение — панель
  // нарезает набор в `iconSet`, и он перекрывает эти значения целиком.
  icons: {
    faviconAny: "/favicon.ico",
    icon32: "/icons/favicon-32.png",
    icon48: "/icons/favicon-48.png",
    icon192: "/icons/icon-192.png",
    icon512: "/icons/icon-512.png",
    icon512Maskable: "/icons/icon-512-maskable.png",
    appleTouch: "/icons/apple-touch-icon.png",
  },
  iconSet: null,

  pwa: {
    themeColor: "#ffffff",
    backgroundColor: "#ffffff",
    startUrl: "/",
    display: "standalone",
    scope: "/",
    orientation: "portrait-primary",
  },
  themeColors: { light: "#ffffff", dark: "#09090b" },

  seo: {
    indexing: "allow",
    titleTemplate: "%s | Fractera",
    robotsIndex: true,
    robotsFollow: true,
    keywords: undefined,
    canonicalBase: undefined,
    sitemapUrl: undefined,
    disallowPaths: ["/api", "/api/*", "/_next", "/_next/*"],
    locales: ["en"],
    defaultLocale: "en",
    googleVerification: undefined,
    yandexVerification: undefined,
    social: { twitter: "@fractera", github: undefined, linkedin: undefined, facebook: undefined },
    // Пустой список — «владелец ещё не добавлял сетей конструктором»; работают
    // четыре ключа выше. Поле обязано быть здесь: схема порождается из умолчаний,
    // и отсутствующее в них поле панель вычистит при первом сохранении.
    socialLinks: [],
  },

  og: { type: "website", locale: undefined, siteName: "Fractera", imageWidth: 1200, imageHeight: 630 },

  author: { name: "Fractera", email: "admin@fractera.ai", url: undefined },
  analytics: { googleAnalyticsId: undefined, enabled: false },
  jsonLd: { website: true, organization: true, localBusiness: false },
  geo: {},
  commerce: { currency: "USD" },
};

// ---- pure getters (take a config object; safe on client or server) ------------------

export function getImagePath(cfg: AppConfig, t: RegularImageType): string | null {
  return cfg.images[t] ?? null;
}
export function getOgImagePath(cfg: AppConfig): string | null {
  return cfg.images.ogImage ?? null;
}
export function getLogoPath(cfg: AppConfig): string | null {
  return cfg.logo ?? null;
}

// The owner's custom brand name, or null when they have not set one (the shipped defaults
// count as "unset"). Callers show the "Your Company App" placeholder on null. Prefers the
// short wordmark; falls back to the longer App name if only that was changed.
export function resolveBrandName(cfg: AppConfig): string | null {
  if (cfg.short_name && cfg.short_name !== DEFAULT_APP_CONFIG.short_name) return cfg.short_name;
  if (cfg.name && cfg.name !== DEFAULT_APP_CONFIG.name) return cfg.name;
  return null;
}

// Resolve a generated icon URL by logical name (e.g. "icon_192") to its serving URL, or null.
export function iconUrl(cfg: AppConfig, name: string): string | null {
  const rel = cfg.iconSet?.files?.[name];
  if (!cfg.iconSet || !rel) return null;
  const file = rel.split("/").pop() ?? rel;
  return `/api/media/icons/${cfg.iconSet.id}/file/${file}`;
}

/** Готовый адрес записи: правило плюс значение. */
export function socialHref(link: SocialLink): string {
  const v = link.value.trim().replace(/^@/, "");
  if (!link.urlTemplate.includes("{value}")) return link.urlTemplate;
  return link.urlTemplate.replace("{value}", encodeURIComponent(v));
}

/**
 * Список сетей для показа — ЕДИНСТВЕННОЕ место, где решается, что показывать.
 *
 * 🔒 СТАРЫЕ КЛЮЧИ ЧИТАЮТСЯ ДОСЛОВНО, ВКЛЮЧАЯ ИХ СТРАННОСТИ. У LinkedIn здесь
 * `/company/`, хотя для личного профиля это неверно. Исправить правило ЗАДНИМ
 * ЧИСЛОМ нельзя: на работающих серверах в конфиге лежит значение, собранное под
 * это правило, и смена шаблона молча увела бы живую ссылку в другое место.
 * Новые записи получают правило от модели и этой странности не наследуют.
 */
export function resolveSocialLinks(seo: { social?: SocialConfig; socialLinks?: SocialLink[] } | undefined): SocialLink[] {
  if (!seo) return [];
  // 🔒 «ВЕТКИ НЕТ» И «ВЕТКА ПУСТА» — РАЗНЫЕ СОСТОЯНИЯ (шаг 523, тот же закон, по
  // которому живут меню подвала). Здесь стояло `socialLinks?.length`, и пустой
  // список читался как «владелец конструктора не открывал»: убрав из панели все
  // записи, он получал обратно четыре унаследованные ссылки. Решение человека
  // «сетей у меня нет» молча отменялось.
  if (Array.isArray(seo.socialLinks)) return seo.socialLinks;
  const s = seo.social;
  if (!s) return [];
  const out: SocialLink[] = [];
  const legacy = (id: string, name: string, value: string | undefined, template: string) => {
    if (!value) return;
    out.push({
      id,
      name,
      value,
      urlTemplate: value.startsWith("http") ? value : template,
      icon: undefined,
    });
  };
  legacy("github", "GitHub", s.github, "https://github.com/{value}");
  legacy("twitter", "X", s.twitter, "https://twitter.com/{value}");
  legacy("linkedin", "LinkedIn", s.linkedin, "https://linkedin.com/company/{value}");
  legacy("facebook", "Facebook", s.facebook, "https://facebook.com/{value}");
  return out;
}

/**
 * Псевдоним для карточки Twitter/X — ОДИН источник вместо двух (шаг 523).
 *
 * Карточка читала `seo.social.twitter` напрямую. После конструктора владелец
 * заводит X записью в `socialLinks`, и старый ключ остаётся пустым — карточка
 * молча теряла бы автора. Поэтому: сперва исторический ключ (он у работающих
 * проектов заполнен), затем первая запись, чей адрес ведёт в X.
 */
export function twitterHandle(seo: { social?: SocialConfig; socialLinks?: SocialLink[] } | undefined): string | undefined {
  const legacy = seo?.social?.twitter;
  if (legacy) return legacy;
  const link = resolveSocialLinks(seo).find((l) => /\/\/(?:www\.)?(?:twitter|x)\.com\//i.test(socialHref(l)));
  if (!link) return undefined;
  const v = link.value.trim().replace(/^@/, "");
  return v ? `@${v}` : undefined;
}

/** Адреса профилей для разметки `sameAs`. */
export function socialUrls(seo: { social?: SocialConfig; socialLinks?: SocialLink[] } | SocialConfig | undefined): string[] {
  // Прежняя подпись принимала САМ `social`; вызовы такого вида продолжают работать.
  const arg = seo && ("social" in seo || "socialLinks" in seo) ? seo : { social: seo as SocialConfig | undefined };
  return resolveSocialLinks(arg as { social?: SocialConfig; socialLinks?: SocialLink[] }).map(socialHref);
}
