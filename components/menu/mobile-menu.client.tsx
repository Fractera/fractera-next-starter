"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuGroup } from "@/lib/menu/group-menus";

// Mobile collapse of the TOP nav (step 160), mirroring FES site-header: below 780px the
// desktop group buttons are hidden and this hamburger shows the same groups as a vertical
// list. Dropdown groups are flattened here (group link + its child pages indented), like
// the FES original shows its dropdown targets flat.
export function MobileMenu({ lang, groups, label }: { lang: string; groups: MenuGroup[]; label: string }) {
  const [open, setOpen] = useState(false);
  if (groups.length === 0) return null;

  return (
    <div className="min-[780px]:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : (<><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>)}
        </svg>
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-14 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col px-6 py-2">
            {groups.map((g) => (
              <div key={g.slug} className="flex flex-col">
                <Link
                  href={`/${lang}/${g.slug}`}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors"
                >
                  {g.label}
                </Link>
                {g.childrenAsDropdown && g.children.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${lang}/${g.slug}/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-2 pl-4 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors truncate"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
