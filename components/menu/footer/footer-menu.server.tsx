import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups } from "@/lib/menu/group-menus";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/menu/shared/theme-toggle.client";
import { FooterHomeSections } from "@/components/menu/footer/footer-home-sections.client";
import { footerLabels } from "@/components/menu/footer/footer-menu.i18n";
import { LanguageSwitcher } from "@/components/language-switcher.client";

// Always-present FOOTER menu (step 160), mirroring FES site-footer in look & behaviour
// (re-programmed, not copied). Three sections:
//   1. footer-page navigation — links to every group that enabled the `footer` slot;
//   2. home-section navigation — scroll links, HOME PAGE ONLY (client island);
//   3. company — brand + copyright + social icons + theme toggle + language switcher.
// The footer is always rendered (site furniture + the always-useful theme/language).
// UI standard: lucide icons, shadcn controls, theme tokens (light + dark).
// Footer-owned strings live co-located in ./footer-menu.i18n (delete the folder, they go
// with it); the two headings are translated across the full 82-language catalogue.

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
  const ui = footerLabels(lang);
  const socials = socialLinks(cfg.seo?.social);
  const address = cfg.geo?.address;

  return (
    <footer className="border-t border-border bg-background text-foreground mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Section 1 — footer-page navigation (groups that enabled the footer slot),
            under a "Footer pages" heading. */}
        {groups.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">{ui.footerPages}</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground font-medium">
              {groups.map((g) => (
                <Link key={g.slug} href={`/${lang}/${g.slug}`} className="hover:text-primary transition-colors">
                  {g.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Section 2 — home-section scroll navigation (HOME PAGE ONLY). */}
        <FooterHomeSections lang={lang} label={ui.pageSections} />

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
