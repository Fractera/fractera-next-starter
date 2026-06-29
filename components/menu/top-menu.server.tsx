import Link from "next/link";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups, slotHasGroups } from "@/lib/menu/group-menus";
import { MenuDropdown } from "@/components/menu/menu-dropdown.client";
import { MobileMenu } from "@/components/menu/mobile-menu.client";
import { AuthButton } from "@/components/menu/auth-button.client";
import { DrawerToggle } from "@/components/menu/drawer-toggle.client";

// Always-present TOP menu (step 160). Exists in every project, renders NOTHING until a
// group enables the top/left/right slot or the app turns on the auth button. Server
// component: reads manifests at build (SSG-safe). Mirrors FES site-header: logo on the
// left, desktop group buttons (hidden < 780px), a mobile hamburger that collapses them,
// an auth island, and — new — the left/right drawer toggle icons (shown only when that
// side's menu has a group; the icon flips when its drawer is open).
const AUTH_LABELS: Record<string, { signIn: string; signOut: string }> = {
  en: { signIn: "Sign in", signOut: "Sign out" },
  es: { signIn: "Entrar", signOut: "Salir" },
  ru: { signIn: "Войти", signOut: "Выйти" },
};
const UI_LABELS: Record<string, { menu: string; openLeft: string; closeLeft: string; openRight: string; closeRight: string }> = {
  en: { menu: "Menu", openLeft: "Open left menu", closeLeft: "Close left menu", openRight: "Open right menu", closeRight: "Close right menu" },
  es: { menu: "Menú", openLeft: "Abrir menú izquierdo", closeLeft: "Cerrar menú izquierdo", openRight: "Abrir menú derecho", closeRight: "Cerrar menú derecho" },
  ru: { menu: "Меню", openLeft: "Открыть левое меню", closeLeft: "Закрыть левое меню", openRight: "Открыть правое меню", closeRight: "Закрыть правое меню" },
};

export function TopMenu({ lang }: { lang: string }) {
  const cfg = getAppConfig();
  const groups = getMenuGroups("top", lang);
  const showAuth = cfg.menus?.authButton ?? false;
  const leftHas = slotHasGroups("left", lang);
  const rightHas = slotHasGroups("right", lang);

  // Not in the render tree until something asks for it (top nav, auth, or a side drawer).
  if (groups.length === 0 && !showAuth && !leftHas && !rightHas) return null;

  const auth = AUTH_LABELS[lang] ?? AUTH_LABELS.en;
  const ui = UI_LABELS[lang] ?? UI_LABELS.en;

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="w-full px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {leftHas && <DrawerToggle side="left" labels={{ open: ui.openLeft, close: ui.closeLeft }} />}

          <Link href={`/${lang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            {cfg.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cfg.logo} alt={cfg.short_name} className="h-7 w-auto object-contain" />
            ) : (
              <span className="text-sm font-semibold tracking-tight text-foreground">{cfg.short_name}</span>
            )}
          </Link>

          {groups.length > 0 && (
            <>
              <span className="hidden min-[780px]:block h-5 w-px bg-border" aria-hidden />
              <nav className="hidden min-[780px]:flex items-center gap-3 flex-wrap">
                {groups.map((g) => (
                  <MenuDropdown key={g.slug} lang={lang} slug={g.slug} label={g.label} items={g.children} asDropdown={g.childrenAsDropdown} />
                ))}
              </nav>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showAuth && <AuthButton lang={lang} labels={auth} />}
          {rightHas && <DrawerToggle side="right" labels={{ open: ui.openRight, close: ui.closeRight }} />}
          {groups.length > 0 && <MobileMenu lang={lang} groups={groups} label={ui.menu} />}
        </div>
      </div>
    </header>
  );
}
