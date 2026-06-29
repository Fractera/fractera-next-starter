import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider.client";
import { ThemeInit } from "@/components/theme-init";
import { DrawerProvider } from "@/providers/drawer-provider.client";
import { TopMenu } from "@/components/menu/top/top-menu.server";
import { bodyFontClass } from "@/lib/fonts";
import { getAppConfig } from "@/config/app-config";
import { constructMetadata } from "@/lib/construct-metadata";
import { buildOrganizationSchema, buildWebSiteSchema, buildLocalBusinessSchema } from "@/lib/jsonld";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";

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

export function generateMetadata(): Metadata {
  return constructMetadata();
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

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="generator" content="Fractera" />
        <ThemeInit />
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
      <body className={bodyFontClass}>
        <ThemeProvider>
          {/* Always-present menu shell (step 160): each menu renders nothing until a
              group enables its slot. DrawerProvider shares the left/right open state
              between the header toggle icons and the drawer panels (sub-step 3). */}
          <DrawerProvider>
            <TopMenu lang={lang} />
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </DrawerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
