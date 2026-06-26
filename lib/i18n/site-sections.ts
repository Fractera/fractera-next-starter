import { DEFAULT_LANGUAGE } from "@/config/translations/translations.config";

// The site's top-level sections, shown in the home-page table of contents (SEO) and
// its footer navigation. MANUAL, owner-editable list: add / remove / reorder entries,
// set your own labels and hrefs. You may list a section you have not built yet.
// An empty list hides the contents block entirely.
//
// Per-language labels deep-fall back to English (like home-strings): a language with
// no entry uses the English list. href is the section path WITHOUT the language
// prefix — the component prefixes the active /<lang> automatically.
export type SiteSection = { label: string; href: string };

const SECTIONS: Record<string, SiteSection[]> = {
  en: [
    { label: "News", href: "/news" },
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "/documentation" },
  ],
  es: [
    { label: "Noticias", href: "/news" },
    { label: "Blog", href: "/blog" },
    { label: "Documentación", href: "/documentation" },
  ],
};

// Returns the sections for a language, with the active /<lang> prefix applied to each
// href. Falls back to the English list for an unconfigured language.
export function getSiteSections(lang: string): SiteSection[] {
  const list = SECTIONS[lang] ?? SECTIONS[DEFAULT_LANGUAGE] ?? SECTIONS.en ?? [];
  return list.map((s) => ({ label: s.label, href: `/${lang}${s.href}` }));
}
