// Схема `APP-CONFIG/app-config.json` — форма ДАННЫХ, не типа.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ ФАЙЛ, А НЕ `zod` ВНУТРИ `app-config.defaults.ts`. Умолчания
// импортируются клиентскими компонентами — файл прямо объявлен client-safe, — и
// `zod`, поставленный туда, уехал бы в браузерный бандл каждой страницы. Здесь он
// нужен только серверу и скрипту порождения схем.
//
// 🔒 ОБЪЕКТЫ ОБЪЯВЛЕНЫ `loose`, И ЭТО НЕ НЕБРЕЖНОСТЬ. Панель может оказаться
// новее слота и записать поле, которого этот шаблон ещё не знает. Строгий объект
// молча вычистил бы решение владельца при первом же чтении.
//
// 🔒 ПРОВЕРКА СООТВЕТСТВИЯ ТИПУ — внизу файла, строкой `__appConfigSchemaMatchesType`.
// Разошлись схема и тип — сборка падает, а не молчит.

import { z } from "zod";
import type { AppConfig } from "./app-config.defaults";

const socialSchema = z.looseObject({
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
});

// Открытый список сетей (шаг 523). Правило сборки адреса хранится ВМЕСТЕ со
// значением, поэтому пятая сеть добавляется записью, а не правкой кода.
const socialLinkSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
  urlTemplate: z.string(),
  value: z.string(),
  icon: z.string().optional(),
});

const imageSlot = z.string().nullable();

export const appConfigSchema = z.looseObject({
  name: z.string(),
  short_name: z.string(),
  description: z.string(),
  /** Пусто до развёртывания: адрес — факт сервера, а не мнение автора шаблона. */
  url: z.string(),
  manifest: z.string(),
  mailSupport: z.string(),
  lang: z.string(),

  images: z.looseObject({
    ogImage: imageSlot,
    "loading-dark": imageSlot,
    "loading-light": imageSlot,
    "notFound-dark": imageSlot,
    "notFound-light": imageSlot,
    "error500-dark": imageSlot,
    "error500-light": imageSlot,
    "homePage-dark": imageSlot,
    "homePage-light": imageSlot,
  }),
  logo: z.string().nullable(),

  icons: z.looseObject({
    faviconAny: z.string().optional(),
    icon32: z.string().optional(),
    icon48: z.string().optional(),
    icon192: z.string().optional(),
    icon512: z.string().optional(),
    icon512Maskable: z.string().optional(),
    appleTouch: z.string().optional(),
  }),
  /** Нарезанный панелью набор; перекрывает `icons` целиком. */
  iconSet: z
    .looseObject({ id: z.string(), files: z.record(z.string(), z.string()) })
    .nullable(),

  pwa: z.looseObject({
    themeColor: z.string(),
    backgroundColor: z.string(),
    startUrl: z.string(),
    display: z.enum(["fullscreen", "standalone", "minimal-ui", "browser"]),
    scope: z.string().optional(),
    orientation: z.enum(["any", "portrait-primary", "landscape-primary"]).optional(),
  }),
  themeColors: z.looseObject({ light: z.string(), dark: z.string() }),

  seo: z.looseObject({
    indexing: z.enum(["allow", "disallow"]),
    titleTemplate: z.string().optional(),
    robotsIndex: z.boolean(),
    robotsFollow: z.boolean(),
    keywords: z.string().optional(),
    canonicalBase: z.string().optional(),
    sitemapUrl: z.string().optional(),
    disallowPaths: z.array(z.string()).optional(),
    locales: z.array(z.string()).optional(),
    defaultLocale: z.string().optional(),
    googleVerification: z.string().optional(),
    yandexVerification: z.string().optional(),
    social: socialSchema,
    socialLinks: z.array(socialLinkSchema).optional(),
  }),

  og: z.looseObject({
    type: z.enum(["website", "article", "blog", "product", "documentation", "profile", "video.other"]),
    locale: z.string().optional(),
    siteName: z.string().optional(),
    imageWidth: z.number(),
    imageHeight: z.number(),
  }),

  author: z.looseObject({
    name: z.string(),
    email: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    url: z.string().optional(),
    jobTitle: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
  }),
  analytics: z.looseObject({
    googleAnalyticsId: z.string().optional(),
    enabled: z.boolean(),
  }),
  jsonLd: z.looseObject({
    website: z.boolean(),
    organization: z.boolean(),
    localBusiness: z.boolean(),
  }),
  geo: z.looseObject({
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    hours: z.string().optional(),
  }),
  /** Валюта витрины, ISO-4217. Непригодный код лечится в `normalize()` читателя. */
  commerce: z.looseObject({ currency: z.string() }),
});

export const __appConfigSchemaMatchesType: z.infer<typeof appConfigSchema> extends AppConfig
  ? true
  : never = true;
