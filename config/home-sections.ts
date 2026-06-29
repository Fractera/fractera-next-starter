// The home page's scrollable sections (step 160, footer middle section). ONE ordered
// source of truth: each entry is an anchor id that exists on the home page (ShellHome
// gives a matching id to that block) plus a per-language label. The footer's middle
// section renders these as scroll links (/<lang>#<id>) — HOME PAGE ONLY. Add a section
// here and on the home block; an empty list means the footer's middle section hides.
// Neutral module (no server-only): read by a client island.

export type HomeSection = { id: string; label: Record<string, string> };

export const HOME_SECTIONS: HomeSection[] = [
  { id: "hero",      label: { en: "Top",          es: "Inicio",      ru: "Главная" } },
  { id: "platforms", label: { en: "AI platforms", es: "Plataformas", ru: "AI-платформы" } },
  { id: "start",     label: { en: "Get started",  es: "Empezar",     ru: "Начать" } },
];

// Label for a section in a language, falling back to English then the id.
export function homeSectionLabel(s: HomeSection, lang: string): string {
  return s.label[lang] ?? s.label.en ?? s.id;
}
