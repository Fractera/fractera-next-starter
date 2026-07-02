"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Github, Twitter, Linkedin, Facebook } from "lucide-react";

// Mobile-only social collapse (footer). On phones the row of social icons folds
// into ONE hamburger button that opens a drawer UPWARD listing the available
// networks — the mirror of the top mobile menu (which opens downward) and of the
// language switcher (which also opens upward). Desktop keeps the icons inline
// (rendered by footer-menu.server); this component is rendered `sm:hidden`.
//
// Icons cross the server→client boundary as a STRING key (serializable), never as
// a component reference. UI standard: lucide icons + theme tokens (light + dark).

const SOCIAL_ICONS = { github: Github, twitter: Twitter, linkedin: Linkedin, facebook: Facebook } as const;
export type SocialKey = keyof typeof SOCIAL_ICONS;

export function FooterSocialDropdown({
  socials,
  label,
}: {
  socials: { href: string; label: string; icon: SocialKey }[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (socials.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        title={label}
        aria-expanded={open}
        className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-border text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 min-w-[180px] rounded-xl border border-border bg-popover shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-1 duration-150 py-1">
          {socials.map(({ href, label: name, icon }) => {
            const Icon = SOCIAL_ICONS[icon];
            return (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                <Icon className="size-4 shrink-0" />
                <span>{name}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
