"use client";

import Link from "next/link";
import { useState } from "react";

// One group button in a menu. When the group asked for childrenAsDropdown it opens a
// dropdown of its child pages (JS); otherwise it is a plain link to the group index.
// no-JS degradation (step 160 sub-step 4) is layered on later via the JS-availability
// provider — by default the static HTML already ships a plain link to the group root.
export type MenuChildLink = { slug: string; title: string };

export function MenuDropdown({
  lang, slug, label, items, asDropdown,
}: {
  lang: string;
  slug: string;
  label: string;
  items: MenuChildLink[];
  asDropdown: boolean;
}) {
  const [open, setOpen] = useState(false);
  const groupHref = `/${lang}/${slug}`;

  if (!asDropdown || items.length === 0) {
    return (
      <Link href={groupHref} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        {label}
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="thin-scroll absolute left-0 top-full mt-1 z-50 w-64 max-h-[600px] overflow-y-auto bg-popover border border-border rounded-xl shadow-2xl p-1.5 flex flex-col gap-0.5">
            <Link href={groupHref} onClick={() => setOpen(false)}
              className="px-2.5 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold text-foreground">
              {label}
            </Link>
            <div className="h-px bg-border my-0.5" />
            {items.map((c) => (
              <Link key={c.slug} href={`${groupHref}/${c.slug}`} onClick={() => setOpen(false)}
                className="px-2.5 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-foreground/85 hover:text-foreground truncate">
                {c.title}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
