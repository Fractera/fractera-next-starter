import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ThemeInit } from "@/components/theme-init";
import { AppWidthInit } from "@/components/app-width-init";
import { buildDesignCss } from "@/lib/design-css";
import { bodyFontClass } from "@/lib/fonts";
import { getAppConfig } from "@/config/app-config";
import { constructMetadata } from "@/lib/construct-metadata";
import { buildOrganizationSchema, buildWebSiteSchema, buildLocalBusinessSchema } from "@/lib/jsonld";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";
import { IosSplash } from "@/components/pwa/ios-splash";

// Root layout for the localized public surface (step 131). This zone OWNS <html>/
// <body> — the language comes from the [lang] route param (known at build), NOT from
// a single config value in the bare root (the old anti-pattern that locked
// <html lang="en"> for every language). The lang param is VALIDATED before use
// (22slots rule: always validate the segment, never just trust it). Static-first:
// generateStaticParams enumerates the languages, the subtree is ISR (revalidate),
// and NO dynamic function (headers()/cookies()/auth()) is called here — so the whole
// [lang] tree stays statically prerendered.
//
// 🔒 ОФОРМЛЕНИЕ ОТСЮДА УЕХАЛО (шаг 538, решение владельца 2026-08-22). Меню, подвал,
// выдвижные панели, баннер согласия, тосты и обвязка приложения живут в
// `(designLayer)/layout.tsx`. Рядом стоит `(freeLayer)` — пустой слой для страниц с
// кастомным дизайном; он получает голый `<body>` и рисует что угодно.
//
// 🔒 ЗДЕСЬ ОСТАЛОСЬ ТО, БЕЗ ЧЕГО СТРАНИЦА ПЕРЕСТАЁТ БЫТЬ ДОКУМЕНТОМ, и то, что
// обязано стоять в `<head>`:
//   • `<html lang>`, `<body>`, шрифт, метаданные, манифест — идентичность документа;
//   • перекрытие темы владельца — каскад считается по ПОРЯДКУ СЛЕДОВАНИЯ, и в теле
//     страницы оно применилось бы раньше файла темы, то есть пропало бы;
//   • `ThemeInit` — в теле он сработал бы после первой отрисовки и дал вспышку
//     светлой темы на тёмной; `AppWidthInit` — по той же причине;
//   • JSON-LD и счётчик — метаданные сайта целиком, они ничего не рисуют.
// Ничто из перечисленного не рисует интерфейс: кастомная страница получает словарь
// и метаданные, а меню, подвал и баннер — не получает.
export const revalidate = 600;

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// Язык страницы передаётся в сборку меты (шаг 501): без него `constructMetadata`
// брала название, описание, шаблон заголовка, ключевые слова и имя сайта ОДНИМ
// набором на все языки — и испанская страница объявляла себя англоязычной.
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang } = await params;
  return {
    ...constructMetadata({ lang }),
    // Манифест — СВОЙ на каждый язык (шаг 504). Установленное приложение
    // подписано на домашнем экране именем отсюда и открывается с его
    // `start_url`; общий манифест ставил всем английское имя и английскую
    // главную, а переименовать значок пользователь уже не сможет.
    manifest: `/${lang}/manifest.webmanifest`,
  };
}

export function generateViewport(): Viewport {
  const cfg = getAppConfig();
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: cfg.themeColors.light },
      { media: "(prefers-color-scheme: dark)", color: cfg.themeColors.dark },
    ],
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // Validate the route param before it reaches <html lang> (never trust the segment).
  if (!SUPPORTED_LANGUAGES.includes(lang)) notFound();

  const cfg = getAppConfig();

  const ld: Record<string, unknown>[] = [];
  if (cfg.jsonLd.website) ld.push(buildWebSiteSchema(cfg));
  if (cfg.jsonLd.organization) ld.push(buildOrganizationSchema(cfg));
  if (cfg.jsonLd.localBusiness) {
    const lb = buildLocalBusinessSchema(cfg);
    if (lb) ld.push(lb);
  }

  const gaId = cfg.analytics.enabled ? cfg.analytics.googleAnalyticsId : undefined;

  // Оформление владельца: правила перекрытия и адреса внешних шрифтов.
  const { css: designCss, fontLinks: designFontLinks } = buildDesignCss();

  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="generator" content="Fractera" />

        {/* ОФОРМЛЕНИЕ ВЛАДЕЛЬЦА — перекрытие темы проекта (шаг «Дизайн», 2026-08-15).
            Цвета, шрифты, шкала текста и формы приходят из
            `DESIGN-CONFIG/design-config.json`, который пишет панель управления.
            Ничего не настроено — здесь пусто, и действует тема проекта.

            🔒 СТОИТ ПЕРВЫМ В ШАПКЕ И ДО ГЛОБАЛЬНЫХ СТИЛЕЙ НЕ ПОДНИМАЕТСЯ: правила
            перекрывают тему по порядку следования, а не по важности, поэтому
            блок обязан идти ПОСЛЕ файла темы (его подключает сборка) и внутри
            `<head>` — иначе браузер применит его до того, как тема загружена,
            и перекрытие пропадёт. */}
        {designCss && <style dangerouslySetInnerHTML={{ __html: designCss }} />}
        {designFontLinks.map(href => (
          <link key={href} rel="stylesheet" href={href} />
        ))}

        <ThemeInit />
        {/* Заставки iOS: без них Safari рисует при запуске установленного
            приложения белый экран — на тёмной теме это выглядит поломкой. */}
        <IosSplash />
        <AppWidthInit />
        {ld.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </head>
      <body className={`${bodyFontClass} min-h-screen flex flex-col`}>{children}</body>
    </html>
  );
}
