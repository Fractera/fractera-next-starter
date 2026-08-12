import Link from "next/link";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups, slotHasGroups } from "@/lib/menu/group-menus";
import { navGroupsFromConfig } from "@/lib/menu/nav-config";
import { DesktopNav } from "@/components/menu/top/desktop-nav.client";
import { MobileMenu } from "@/components/menu/top/mobile-menu.client";
import { AccountButton } from "@/components/menu/account/account-button.client";
import { appShellAuthSide } from "@/components/menu/account/account-config";
import { accountLabels } from "@/components/menu/account/account-menu.i18n";
import { accountLinks } from "@/lib/menu/account-links";
import { cartUi } from "@/components/cart/cart.i18n";
import { DrawerToggle } from "@/components/menu/shared/drawer-toggle.client";
import { featureOn } from "@/config/platform-config";
import { topMenuUi } from "@/components/menu/top/top-menu.i18n";

// Always-present TOP menu (step 160). Exists in every project, renders NOTHING until a
// group enables the top/left/right slot or the app turns on the auth button. Server
// component: reads manifests at build (SSG-safe). Mirrors FES site-header: logo on the
// left, desktop group buttons (hidden < 780px), a mobile hamburger that collapses them,
// an auth island, and — new — the left/right drawer toggle icons (shown only when that
// side's menu has a group; the icon flips when its drawer is open). The header is ALSO
// force-rendered when public auth is enabled (NEXT_PUBLIC_APP_SHELL_AUTH=left|right, step
// 161) even with zero groups, so the account control always has a home. Account strings are
// co-located in components/menu/account/ (82 languages), and the drawer aria-labels now live
// beside them in top-menu.i18n.ts — also 82. They used to sit inline here in six languages,
// which meant that on the seventy-sixth market the burger silently read "Menu" and a
// screen-reader user heard an English "Open left menu". A reusable part of the product must
// speak every language the owner can switch on (rule 4д).

export async function TopMenu({ lang }: { lang: string }) {
  const cfg = getAppConfig();
  const authSide = appShellAuthSide();
  const leftHas = slotHasGroups("left", lang);
  const rightHas = slotHasGroups("right", lang);

  // 🔒 ВЫКЛЮЧАТЕЛЬ ПАНЕЛИ РЕШАЕТ, ЕСТЬ ЛИ ВЕРХНЕЕ МЕНЮ ВООБЩЕ (2026-08-12).
  // Выключено — пунктов нет, даже если манифесты групп на диске их объявляют:
  // владелец сказал «не показывать», и диск с ним не спорит.
  // Источник пунктов: настройки панели, а если владелец их ещё не открывал —
  // прежние манифесты на диске. Различие «ветки нет» и «ветка пуста» разобрано
  // в `nav-config.ts`; без него каждый существующий проект потерял бы меню.
  const menuOn = featureOn("topMenu");
  const fromConfig = menuOn ? navGroupsFromConfig("top", lang) : null;
  const groups = menuOn ? (fromConfig ?? getMenuGroups("top", lang)) : [];

  // Полоса шапки нужна, когда её кто-то населяет: само меню (даже пустое — это
  // состояние, а не ошибка) или ящик сбоку, которому нужен переключатель.
  const barNeeded = menuOn || leftHas || rightHas;

  // 🔒 КНОПКА АККАУНТА И КОРЗИНА ВСЕГДА СПРАВА (владелец, 2026-08-12).
  // Настройка стороны решает ОДНО: с какой стороны выезжает ящик. Сама кнопка
  // не переезжает никогда — это место, к которому человек привык на любом сайте,
  // и менять его ради настройки ящика значит ломать привычку ради мелочи.
  // (Я успел сделать наоборот и был поправлен: настройка двигала и кнопку.)
  const account = authSide ? (
    <AccountButton
      lang={lang}
      side={authSide}
      labels={accountLabels(lang)}
      links={accountLinks(lang)}
      cart={cartUi(lang)}
      currency={cfg.commerce.currency}
    />
  ) : null;

  if (!barNeeded) {
    // 🔒 МЕНЮ ВЫКЛЮЧЕНО, А ВХОД ВКЛЮЧЁН — кнопка живёт сама, абсолютным
    // позиционированием в верхнем углу (требование владельца 2026-08-12).
    // Рисовать ради одной кнопки полосу во всю ширину значит навязать сайту
    // шапку, которую владелец выключил. Угол — тот же, что и у кнопки внутри
    // полосы, поэтому включение меню визуально её не сдвигает.
    if (!account) return null;
    return (
      <div className="absolute top-0 right-0 z-40 h-14 px-6 md:px-8 flex items-center">
        {account}
      </div>
    );
  }

  const ui = topMenuUi(lang);
  // The account drawer's Projects entry is a plain launcher into the projects service (:3003,
  // step 197) — no build-time manifest fs-scan here anymore (the zone left the slot).

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="w-full px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {leftHas && <DrawerToggle side="left" labels={{ open: ui.openLeft, close: ui.closeLeft }} />}

          {/* Brand: the SHORT company name is ALWAYS shown; the logo sits beside it when
              one is uploaded (logo + wordmark together, never either/or). */}
          <Link href={`/${lang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            {cfg.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cfg.logo} alt="" className="h-7 w-auto object-contain" />
            )}
            <span className="text-sm font-semibold tracking-tight text-foreground">{cfg.short_name}</span>
          </Link>

          {groups.length > 0 && <DesktopNav lang={lang} groups={groups} />}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {account}
          {/* Mobile burger BEFORE the right drawer toggle, so the right-drawer icon is
              the rightmost control in the header (req: right drawer = last icon). */}
          {groups.length > 0 && <MobileMenu lang={lang} groups={groups} label={ui.menu} />}
          {rightHas && <DrawerToggle side="right" labels={{ open: ui.openRight, close: ui.closeRight }} />}
        </div>
      </div>
    </header>
  );
}
