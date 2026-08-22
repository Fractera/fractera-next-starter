// Слой оформления Fractera — всё, что делает страницу «страницей этого сайта».
//
// 🔒 ЗАЧЕМ ЭТОТ СЛОЙ ПОЯВИЛСЯ (шаг 538, решение владельца 2026-08-22). Раньше меню,
// подвал, баннер согласия и обвязка приложения жили в `[lang]/layout.tsx` — то есть
// доставались КАЖДОЙ странице, и уйти из-под них было нельзя иначе как сломав
// корневой layout. Теперь оформление живёт здесь, а рядом стоит `(freeLayer)` —
// пустой слой для страниц с кастомным дизайном.
//
// 🔒 ГРУППА В АДРЕСЕ НЕ ВИДНА. `(designLayer)` — route group: `/ru/blog/x` остаётся
// `/ru/blog/x`. Перенос существующих веток внутрь ничего не изменил снаружи.
//
// 🔒 ЧТО СЮДА НЕ ПЕРЕЕХАЛО И ПОЧЕМУ. В `[lang]/layout.tsx` остались `<html>`,
// `<body>`, шрифт, метаданные, манифест — и всё, что обязано стоять в `<head>`:
// перекрытие темы владельца (каскад считается по порядку следования, а не по
// важности), скрипт инициализации темы (в теле он сработал бы после первой
// отрисовки и дал вспышку светлой темы), инициализация ширины, JSON-LD и счётчик.
// Они ничего не рисуют — это словарь и метаданные документа; рисует то, что здесь.
//
// Статика не задета: динамических функций тут нет, поддерево остаётся ISR.

import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider.client";
import { DrawerProvider } from "@/providers/drawer-provider.client";
import { TopMenu } from "@/components/menu/top/top-menu.server";
import { FooterMenu } from "@/components/menu/footer/footer-menu.server";
import { DrawerMenu } from "@/components/menu/drawer/drawer-menu.server";
import { ViewportBadge } from "@/components/dev/viewport-badge.client";
import { featureOn } from "@/config/platform-config";
import { RegisterServiceWorker } from "@/components/pwa/register-sw.client";
import { InstallPrompt } from "@/components/pwa/install-prompt.client";
import { installUi } from "@/components/pwa/install-prompt.i18n";
import { readBannerConfig } from "../_components/cookie-banner/banner-config";
import { CookieBanner } from "../_components/cookie-banner/cookie-banner.client";
import { bannerUi } from "../_components/cookie-banner/cookie-banner.i18n";

export default async function DesignLayer({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Слова баннера: СВОИ на 82 языках, поверх них — то, что владелец изменил в
  // панели. Порядок именно такой: пустая настройка не имеет права оставить
  // баннер без текста, а он делит сообщение по метке ссылки и упал бы.
  const banner = readBannerConfig();
  const bannerOn = featureOn("cookieBanner");
  const bannerStrings = { ...bannerUi(lang), ...(banner.languages[lang] ?? {}) };

  // Копия сайта на устройстве посетителя — решение владельца, а не наше
  // умолчание (2026-08-13). Выключенный режим не просто «не регистрируем»: он
  // СНИМАЕТ воркер и стирает кеши у тех, кому он уже достался.
  const offlineOn = featureOn("offlineCache");

  return (
    <ThemeProvider>
      {/* Always-present menu shell (step 160): each menu renders nothing until a
          group enables its slot. DrawerProvider shares the left/right open state
          between the header toggle icons and the drawer panels. */}
      <DrawerProvider>
        <TopMenu lang={lang} />
        {children}
        <FooterMenu lang={lang} />
        <DrawerMenu side="left" lang={lang} />
        <DrawerMenu side="right" lang={lang} />
        {/* Индикатор ширины экрана — только в разработке; в боевой сборке
            компонент вырезается целиком (см. его файл), а не прячется. */}
        <ViewportBadge />
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
            браузере. */}
        <InstallPrompt strings={installUi(lang)} />
      </DrawerProvider>
    </ThemeProvider>
  );
}
