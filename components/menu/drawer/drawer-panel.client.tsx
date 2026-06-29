"use client";

import Link from "next/link";
import { useDrawer } from "@/providers/drawer-provider.client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { MenuGroup } from "@/lib/menu/group-menus";

// Left/right drawer panel (step 160, sub-step 3). UI standard: shadcn Sheet (Radix
// Dialog) in CONTROLLED mode — its open state is the shared DrawerProvider state that the
// header toggle icons drive, so one source of truth opens both. Lists each group that
// enabled this side's slot (link to the group root) and, when childrenAsDropdown, its
// child pages beneath. Closing the sheet (X / overlay / Escape) syncs the provider.
export function DrawerPanel({
  side, lang, groups, title,
}: {
  side: "left" | "right";
  lang: string;
  groups: MenuGroup[];
  title: string;
}) {
  const { leftOpen, rightOpen, close } = useDrawer();
  const open = side === "left" ? leftOpen : rightOpen;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) close(side); }}>
      <SheetContent side={side} className="w-72 p-0 gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-0.5 overflow-y-auto p-2">
          {groups.map((g) => (
            <div key={g.slug} className="flex flex-col">
              <Link
                href={`/${lang}/${g.slug}`}
                onClick={() => close(side)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                {g.label}
              </Link>
              {g.children.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${lang}/${g.slug}/${c.slug}`}
                  onClick={() => close(side)}
                  className="px-3 py-2 pl-6 rounded-lg text-sm font-medium text-foreground/75 hover:bg-accent hover:text-foreground transition-colors truncate"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
