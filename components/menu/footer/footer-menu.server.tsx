import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups } from "@/lib/menu/group-menus";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/menu/shared/theme-toggle.client";
import { FooterHomeSections } from "@/components/menu/footer/footer-home-sections.client";
import { LanguageSwitcher } from "@/components/language-switcher.client";

// Always-present FOOTER menu (step 160), mirroring FES site-footer in look & behaviour
// (re-programmed, not copied). Three sections:
//   1. footer-page navigation — links to every group that enabled the `footer` slot;
//   2. home-section navigation — scroll links, HOME PAGE ONLY (client island);
//   3. company — brand + copyright + social icons + theme toggle + language switcher.
// The footer is always rendered (site furniture + the always-useful theme/language).
// UI standard: lucide icons, shadcn controls, theme tokens (light + dark).
const UI: Record<string, { contents: string; rights: string; system: string; light: string; dark: string }> = {
  en: { contents: "Site contents", rights: "All rights reserved.", system: "Theme: system", light: "Theme: light", dark: "Theme: dark" },
  es: { contents: "Contenido del sitio", rights: "Todos los derechos reservados.", system: "Tema: sistema", light: "Tema: claro", dark: "Tema: oscuro" },
  ru: { contents: "Содержание сайта", rights: "Все права защищены.", system: "Тема: системная", light: "Тема: светлая", dark: "Тема: тёмная" },
};

function socialLinks(social: { twitter?: string; github?: string; linkedin?: string; facebook?: string } | undefined) {
  if (!social) return [] as { href: string; label: string; Icon: typeof Github }[];
  const out: { href: string; label: string; Icon: typeof Github }[] = [];
  if (social.github) out.push({ href: social.github, label: "GitHub", Icon: Github });
  if (social.twitter) out.push({ href: social.twitter.startsWith("http") ? social.twitter : `https://twitter.com/${social.twitter.replace("@", "")}`, label: "X (Twitter)", Icon: Twitter });
  if (social.linkedin) out.push({ href: social.linkedin.startsWith("http") ? social.linkedin : `https://linkedin.com/company/${social.linkedin}`, label: "LinkedIn", Icon: Linkedin });
  if (social.facebook) out.push({ href: social.facebook.startsWith("http") ? social.facebook : `https://facebook.com/${social.facebook}`, label: "Facebook", Icon: Facebook });
  return out;
}

export function FooterMenu({ lang }: { lang: string }) {
  const cfg = getAppConfig();
  const groups = getMenuGroups("footer", lang);
  const ui = UI[lang] ?? UI.en;
  const socials = socialLinks(cfg.seo?.social);
  const address = cfg.geo?.address;

  return (
    <footer className="border-t border-border bg-background text-foreground mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-lg font-bold tracking-tight">{cfg.short_name}</span>
        </div>

        {/* Section 1 — footer-page navigation (groups that enabled the footer slot). */}
        {groups.length > 0 && (
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground font-medium">
            {groups.map((g) => (
              <Link key={g.slug} href={`/${lang}/${g.slug}`} className="hover:text-primary transition-colors">
                {g.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Section 2 — home-section scroll navigation (HOME PAGE ONLY). */}
        <FooterHomeSections lang={lang} label={ui.contents} />

        {/* Section 3 — company: copyright + address, social, theme toggle, language. */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm border-t border-border pt-6">
          <div className="flex flex-col gap-1">
            <span>© {new Date().getFullYear()} {cfg.short_name}. {ui.rights}</span>
            {address && <span className="text-xs text-muted-foreground">{address}</span>}
          </div>
          <div className="flex items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-border text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
            <ThemeToggle labels={{ system: ui.system, light: ui.light, dark: ui.dark }} />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
