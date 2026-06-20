"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Languages, Search, X } from "lucide-react";
import {
  getAvailableLanguages,
  DEFAULT_LANGUAGE,
  SINGLE_LANG_MODE,
} from "@/config/translations/translations.config";
import {
  LANGUAGE_REGIONS,
  type LanguageRegion,
  type LanguageMetadata,
} from "@/config/translations/language-metadata";

// Language switcher button + searchable dropdown (grouped by region, with flags).
// Ported from the Fractera marketing site and re-themed onto the workspace theme
// tokens (foreground/background/border/primary), so it works in light AND dark.
//
// It renders NOTHING when only one language is configured (SINGLE_LANG_MODE) —
// that is how "leave one language in the env and the button disappears" works.
// To re-install this button after deleting it, an agent can use the skill
// install-language-switcher-dropdown (.agents/skills/…), which carries the
// template.
export function LanguageSwitcher() {
  if (SINGLE_LANG_MODE) return null;
  return <LanguageSwitcherInner />;
}

function LanguageSwitcherInner() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const allLanguages = useMemo(() => getAvailableLanguages(), []);

  const currentLang = useMemo(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    return allLanguages.find((l) => l.code === seg) ? seg : DEFAULT_LANGUAGE;
  }, [pathname, allLanguages]);

  const currentMeta = allLanguages.find((l) => l.code === currentLang);

  const filtered = useMemo(() => {
    if (!filter) return allLanguages;
    const q = filter.toLowerCase();
    return allLanguages.filter(
      (l) =>
        l.nativeName.toLowerCase().startsWith(q) ||
        l.englishName.toLowerCase().startsWith(q),
    );
  }, [allLanguages, filter]);

  // Group by region. Languages with multiple regions appear in each of them.
  const groupedByRegion = useMemo(() => {
    const map = new Map<LanguageRegion, LanguageMetadata[]>();
    LANGUAGE_REGIONS.forEach((region) => map.set(region, []));
    allLanguages.forEach((lang) => {
      lang.regions.forEach((region) => {
        map.get(region)?.push(lang);
      });
    });
    return map;
  }, [allLanguages]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function switchLang(code: string) {
    if (code === currentLang) {
      setOpen(false);
      return;
    }
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === currentLang) segments.shift();
    router.replace(`/${code}${segments.length ? "/" + segments.join("/") : ""}`);
    setOpen(false);
    setFilter("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-foreground/80 hover:text-foreground hover:bg-muted transition-all"
        title={currentMeta?.englishName ?? "Switch language"}
        aria-label="Switch language"
      >
        <Languages size={14} />
        <span className="font-semibold uppercase tracking-wider text-xs">
          {currentLang}
        </span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 rounded-lg border border-border bg-background shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="relative p-2 border-b border-border">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search language…"
              className="w-full bg-muted text-foreground text-sm rounded-md pl-8 pr-7 py-1.5 outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filter ? (
              filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No languages found
                </p>
              ) : (
                filtered.map((lang) => (
                  <LangRow
                    key={lang.code}
                    lang={lang}
                    flag={lang.flag}
                    isActive={lang.code === currentLang}
                    onSelect={switchLang}
                  />
                ))
              )
            ) : (
              LANGUAGE_REGIONS.map((region, regionIdx) => {
                const list = groupedByRegion.get(region) ?? [];
                if (list.length === 0) return null;
                return (
                  <div key={region}>
                    {regionIdx > 0 && <div className="h-px bg-border my-1" />}
                    <p className="sticky top-0 z-[1] bg-background px-3 py-1.5 text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
                      {region}
                    </p>
                    {list.map((lang) => (
                      <LangRow
                        key={`${region}-${lang.code}`}
                        lang={lang}
                        flag={lang.regionFlags?.[region] ?? lang.flag}
                        isActive={lang.code === currentLang}
                        onSelect={switchLang}
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LangRow({
  lang,
  flag,
  isActive,
  onSelect,
}: {
  lang: LanguageMetadata;
  flag: string;
  isActive: boolean;
  onSelect: (code: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(lang.code)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${
        isActive
          ? "bg-primary/15 text-primary"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="text-base leading-none">{flag}</span>
      <span>{lang.nativeName}</span>
      <span className="ml-auto text-xs text-muted-foreground uppercase">
        {lang.code}
      </span>
    </button>
  );
}
