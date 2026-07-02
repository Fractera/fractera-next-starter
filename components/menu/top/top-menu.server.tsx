import Link from "next/link";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups, slotHasGroups } from "@/lib/menu/group-menus";
import { DesktopNav } from "@/components/menu/top/desktop-nav.client";
import { MobileMenu } from "@/components/menu/top/mobile-menu.client";
import { AccountButton } from "@/components/menu/account/account-button.client";
import { appShellAuthSide } from "@/components/menu/account/account-config";
import { accountLabels } from "@/components/menu/account/account-menu.i18n";
import { DrawerToggle } from "@/components/menu/shared/drawer-toggle.client";

// Always-present TOP menu (step 160). Exists in every project, renders NOTHING until a
// group enables the top/left/right slot or the app turns on the auth button. Server
// component: reads manifests at build (SSG-safe). Mirrors FES site-header: logo on the
// left, desktop group buttons (hidden < 780px), a mobile hamburger that collapses them,
// an auth island, and — new — the left/right drawer toggle icons (shown only when that
// side's menu has a group; the icon flips when its drawer is open). The header is ALSO
// force-rendered when public auth is enabled (NEXT_PUBLIC_APP_SHELL_AUTH=left|right, step
// 161) even with zero groups, so the account control always has a home. Account strings are
// co-located in components/menu/account/ (82 languages); only the drawer aria-labels stay here.
const UI_LABELS: Record<string, { menu: string; openLeft: string; closeLeft: string; openRight: string; closeRight: string }> = {
  en: { menu: "Menu", openLeft: "Open left menu", closeLeft: "Close left menu", openRight: "Open right menu", closeRight: "Close right menu" },
  es: { menu: "Menú", openLeft: "Abrir menú izquierdo", closeLeft: "Cerrar menú izquierdo", openRight: "Abrir menú derecho", closeRight: "Cerrar menú derecho" },
  ru: { menu: "Меню", openLeft: "Открыть левое меню", closeLeft: "Закрыть левое меню", openRight: "Открыть правое меню", closeRight: "Закрыть правое меню" },
  hy: { menu: "Մենյու", openLeft: "Բացել ձախ մենյուն", closeLeft: "Փակել ձախ մենյուն", openRight: "Բացել աջ մենյուն", closeRight: "Փակել աջ մենյուն" },
  fr: { menu: "Menu", openLeft: "Ouvrir le menu gauche", closeLeft: "Fermer le menu gauche", openRight: "Ouvrir le menu droit", closeRight: "Fermer le menu droit" },
  de: { menu: "Menü", openLeft: "Linkes Menü öffnen", closeLeft: "Linkes Menü schließen", openRight: "Rechtes Menü öffnen", closeRight: "Rechtes Menü schließen" },
};

export function TopMenu({ lang }: { lang: string }) {
  const cfg = getAppConfig();
  const groups = getMenuGroups("top", lang);
  const authSide = appShellAuthSide();
  const leftHas = slotHasGroups("left", lang);
  const rightHas = slotHasGroups("right", lang);

  // Not in the render tree until something asks for it (top nav, auth, or a side drawer).
  if (groups.length === 0 && !authSide && !leftHas && !rightHas) return null;

  const ui = UI_LABELS[lang] ?? UI_LABELS.en;

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
          {authSide && <AccountButton lang={lang} side={authSide} labels={accountLabels(lang)} />}
          {/* Mobile burger BEFORE the right drawer toggle, so the right-drawer icon is
              the rightmost control in the header (req: right drawer = last icon). */}
          {groups.length > 0 && <MobileMenu lang={lang} groups={groups} label={ui.menu} />}
          {rightHas && <DrawerToggle side="right" labels={{ open: ui.openRight, close: ui.closeRight }} />}
        </div>
      </div>
    </header>
  );
}
