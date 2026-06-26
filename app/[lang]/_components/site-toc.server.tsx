import { getSiteSections } from "@/lib/i18n/site-sections";

// Site table-of-contents — a numbered list of the top-level sections, rendered on the
// SERVER so its links are in the static HTML (SEO). Shown on the home page only (it is
// mounted from app/[lang]/_components, the home entry). Returns null when there are no
// sections, so an empty site shows nothing. The owner edits the list in
// lib/i18n/site-sections.ts.
export function SiteToc({ lang, heading }: { lang: string; heading: string }) {
  const sections = getSiteSections(lang);
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Contents"
      className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-violet-400/70">
        {heading} · {sections.length}
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {sections.map((s, i) => (
          <li key={s.href} className="flex gap-3 text-[15px] leading-snug">
            <span aria-hidden="true" className="select-none font-mono text-sm text-white/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a href={s.href} className="text-white/65 transition-colors hover:text-violet-300">
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
