import Link from "next/link";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups } from "@/lib/menu/group-menus";
import { MenuDropdown } from "@/components/menu/menu-dropdown.client";
import { AuthButton } from "@/components/menu/auth-button.client";

// Always-present TOP menu (step 160). It exists in every project but renders NOTHING
// until at least one group enables the `top` slot in its manifest — or the app turns on
// the auth button. Server component: reads the group manifests at build (SSG-safe), maps
// each enabled group to a link / dropdown; the auth control is a small client island.
const AUTH_LABELS: Record<string, { signIn: string; signOut: string }> = {
  en: { signIn: "Sign in", signOut: "Sign out" },
  es: { signIn: "Entrar", signOut: "Salir" },
  ru: { signIn: "Войти", signOut: "Выйти" },
};

export function TopMenu({ lang }: { lang: string }) {
  const cfg = getAppConfig();
  const groups = getMenuGroups("top", lang);
  const showAuth = cfg.menus?.authButton ?? false;

  // The whole point: not in the render tree until something asks for it.
  if (groups.length === 0 && !showAuth) return null;

  const authLabels = AUTH_LABELS[lang] ?? AUTH_LABELS.en;

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="w-full px-6 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/${lang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <span className="text-sm font-semibold tracking-tight text-foreground">{cfg.short_name}</span>
          </Link>
          {groups.length > 0 && (
            <>
              <span className="h-5 w-px bg-border" aria-hidden />
              <nav className="flex items-center gap-3 flex-wrap">
                {groups.map((g) => (
                  <MenuDropdown
                    key={g.slug}
                    lang={lang}
                    slug={g.slug}
                    label={g.label}
                    items={g.children}
                    asDropdown={g.childrenAsDropdown}
                  />
                ))}
              </nav>
            </>
          )}
        </div>
        {showAuth && (
          <div className="flex items-center gap-3 shrink-0">
            <AuthButton lang={lang} labels={authLabels} />
          </div>
        )}
      </div>
    </header>
  );
}
