"use client";

import { usePathname } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";
import { HOME_SECTIONS, homeSectionLabel } from "@/config/home-sections";

// Footer MIDDLE section (step 160): scroll-navigation between the HOME page's sections.
// Shows ONLY on the home page — its anchors (#hero, #platforms…) target the home blocks,
// which exist nowhere else (FES isHome principle: strip a known language segment; home
// means nothing is left). Empty section list → renders nothing.
export function FooterHomeSections({ lang, label }: { lang: string; label: string }) {
  const pathname = usePathname() ?? "/";
  const parts = pathname.split("/").filter(Boolean);
  const rest = parts[0] && SUPPORTED_LANGUAGES.includes(parts[0]) ? parts.slice(1) : parts;
  const isHome = rest.length === 0;

  if (!isHome || HOME_SECTIONS.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-6">
      <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/75 font-medium">
        {HOME_SECTIONS.map((s) => (
          <a key={s.id} href={`/${lang}#${s.id}`} className="hover:text-primary transition-colors">
            {homeSectionLabel(s, lang)}
          </a>
        ))}
      </nav>
    </div>
  );
}
