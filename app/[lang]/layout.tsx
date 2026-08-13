import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider.client";
import { ThemeInit } from "@/components/theme-init";
import { AppWidthInit } from "@/components/app-width-init";
import { DrawerProvider } from "@/providers/drawer-provider.client";
import { TopMenu } from "@/components/menu/top/top-menu.server";
import { FooterMenu } from "@/components/menu/footer/footer-menu.server";
import { DrawerMenu } from "@/components/menu/drawer/drawer-menu.server";
import { bodyFontClass } from "@/lib/fonts";
import { getAppConfig } from "@/config/app-config";
import { constructMetadata } from "@/lib/construct-metadata";
import { buildOrganizationSchema, buildWebSiteSchema, buildLocalBusinessSchema } from "@/lib/jsonld";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";
import { readBannerConfig } from "./_components/legal/banner-config";
import { CookieBanner } from "./_components/legal/cookie-banner.client";
import { bannerUi } from "./_components/legal/cookie-banner.i18n";
import { featureOn } from "@/config/platform-config";
import { RegisterServiceWorker } from "@/components/pwa/register-sw.client";
import { InstallPrompt } from "@/components/pwa/install-prompt.client";
import { installUi } from "@/components/pwa/install-prompt.i18n";
import { IosSplash } from "@/components/pwa/ios-splash";

// Root layout for the localized public surface (step 131). This zone OWNS <html>/
// <body> — the language comes from the [lang] route param (known at build), NOT from
// a single config value in the bare root (the old anti-pattern that locked
// <html lang="en"> for every language). The lang param is VALIDATED before use
// (22slots rule: always validate the segment, never just trust it). Static-first:
// generateStaticParams enumerates the languages, the subtree is ISR (revalidate),
// and NO dynamic function (headers()/cookies()/auth()) is called here — so the whole
// [lang] tree stays statically prerendered. See workspace-standards/static-first.md.
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
  // Cookie-banner strings for this language (step 305) — merged config over the shipped default.
  const banner = readBannerConfig();
  // Слова баннера: СВОИ на 82 языках, поверх них — то, что владелец изменил в
  // панели. Порядок именно такой: пустая настройка не имеет права оставить
  // баннер без текста, а он делит сообщение по метке ссылки и упал бы.
  const bannerOn = featureOn("cookieBanner");
  // Копия сайта на устройстве посетителя — решение владельца, а не наше
  // умолчание (2026-08-13). Выключенный режим не просто «не регистрируем»: он
  // СНИМАЕТ воркер и стирает кеши у тех, кому он уже достался.
  const offlineOn = featureOn("offlineCache");
  const bannerStrings = { ...bannerUi(lang), ...(banner.languages[lang] ?? {}) };
  const ld: Record<string, unknown>[] = [];
  if (cfg.jsonLd.website) ld.push(buildWebSiteSchema(cfg));
  if (cfg.jsonLd.organization) ld.push(buildOrganizationSchema(cfg));
  if (cfg.jsonLd.localBusiness) {
    const lb = buildLocalBusinessSchema(cfg);
    if (lb) ld.push(lb);
  }

  const gaId = cfg.analytics.enabled ? cfg.analytics.googleAnalyticsId : undefined;

  return (
    <html lang={lang} suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="generator" content="Fractera" />
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
      <body className={`${bodyFontClass} min-h-screen flex flex-col`}>
        <ThemeProvider>
          {/* Always-present menu shell (step 160): each menu renders nothing until a
              group enables its slot. DrawerProvider shares the left/right open state
              between the header toggle icons and the drawer panels (sub-step 3).
              Footer is always present (site furniture + theme/language). */}
          <DrawerProvider>
            <TopMenu lang={lang} />
            {children}
            <FooterMenu lang={lang} />
            {/* Left & right slide-in drawers (shadcn Sheet), controlled by the same
                DrawerProvider state as the header toggle icons; each renders nothing
                until a group enables its side's slot. */}
            <DrawerMenu side="left" lang={lang} />
            <DrawerMenu side="right" lang={lang} />
            {/* Cookie-consent banner (step 305) — on every public page via this layout. Strings are
                server-provided per language (readBannerConfig, ISR) so anonymous visitors get a fully
                localized banner without hitting the gated /api. */}
            {/* Выключатель панели решает, есть ли баннер вообще. До 2026-08-12
                он не проверялся: баннер показывался всегда, а переключатель в
                панели не значил ничего. */}
            {bannerOn && <CookieBanner lang={lang} strings={bannerStrings} />}
            <Toaster position="bottom-right" richColors closeButton />
            {/* Сервис-воркер: офлайн для уже виденных страниц и мгновенное
                повторное открытие. Стратегия — сеть первой для страниц, поэтому
                устаревшая страница невозможна (см. public/sw.js). */}
            <RegisterServiceWorker enabled={offlineOn} />
            {/* Предложение установить приложение. Слова резолвятся на СЕРВЕРЕ и
                едут пропсом: словарь на 82 языка не имеет права оказаться в
                браузере. Кнопка появляется, только когда браузер сам сообщил,
                что сайт устанавливаем. */}
            <InstallPrompt strings={installUi(lang)} />
          </DrawerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
