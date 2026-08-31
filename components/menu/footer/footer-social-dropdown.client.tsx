"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { SOCIAL_ICONS, socialIcon } from "@/components/icons/socials";

// Mobile-only social collapse (footer). On phones the row of social icons folds
// into ONE hamburger button that opens a drawer UPWARD listing the available
// networks — the mirror of the top mobile menu (which opens downward) and of the
// language switcher (which also opens upward). Desktop keeps the icons inline
// (rendered by footer-menu.server); this component is rendered `sm:hidden`.
//
// Icons cross the server→client boundary as a STRING key (serializable), never as
// a component reference. UI standard: lucide icons + theme tokens (light + dark).

// 🔒 НАБОР ЗНАЧКОВ ОБЩИЙ С ПОДВАЛОМ И С НАСТРОЙКАМИ (31-26, 2026-08-29). Здесь
// стояла своя таблица из четырёх сетей, и она молча расходилась с той, что рисует
// значки на широком экране: телефон показывал кубик там, где рабочий стол —
// знак сети. Один набор на трёх потребителей, и расходиться нечему.
export type SocialKey = keyof typeof SOCIAL_ICONS;

export function FooterSocialDropdown({
  socials,
  label,
}: {
  socials: { href: string; label: string; icon: SocialKey | (string & {}) }[];
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
        className="size-9 inline-flex items-center justify-center rounded-md border border-border text-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 min-w-[180px] rounded-xl border border-border bg-popover shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-1 duration-150 py-1">
          {socials.map(({ href, label: name, icon }) => {
            // Ключ может не совпасть ни с чем: у записи вне каталога значка нет,
            // и запасной кубик здесь означает «сеть без знака», а не сбой.
            const Icon = socialIcon(icon);
            return (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground transition-colors"
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
