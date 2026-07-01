"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVisibleGroups } from "@/components/menu/shared/use-visible-groups.client";
import type { MenuGroup } from "@/lib/menu/group-menus";

// Mobile collapse of the TOP nav (step 160), mirroring FES site-header: below 780px the
// desktop group buttons are hidden and this hamburger shows the same groups as a vertical
// list (dropdown groups flattened — group link + its child pages indented). UI standard:
// shadcn Button + lucide Menu/X icons (no inline SVG).
export function MobileMenu({ lang, groups, label }: { lang: string; groups: MenuGroup[]; label: string }) {
  const [open, setOpen] = useState(false);
  const visible = useVisibleGroups(groups);
  if (visible.length === 0) return null;

  return (
    <div className="min-[780px]:hidden">
      <Button type="button" variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label={label} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <nav className="absolute left-0 right-0 top-14 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col px-6 py-2">
            {visible.map((g) => (
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
