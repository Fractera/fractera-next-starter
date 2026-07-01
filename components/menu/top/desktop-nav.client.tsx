"use client";

import { MenuDropdown } from "@/components/menu/shared/menu-dropdown.client";
import { useVisibleGroups } from "@/components/menu/shared/use-visible-groups.client";
import type { MenuGroup } from "@/lib/menu/group-menus";

// Desktop TOP nav (step 160) — extracted to a client island (step 167) so it can hide
// role-gated groups the viewer may not access (the separator + nav render only when at
// least one group is visible to THIS viewer). Public groups render pre-hydration; gated
// ones appear once /api/me confirms a matching role.
export function DesktopNav({ lang, groups }: { lang: string; groups: MenuGroup[] }) {
  const visible = useVisibleGroups(groups);
  if (visible.length === 0) return null;

  return (
    <>
      <span className="hidden min-[780px]:block h-5 w-px bg-border" aria-hidden />
      <nav className="hidden min-[780px]:flex items-center gap-3 flex-wrap">
        {visible.map((g) => (
          <MenuDropdown key={g.slug} lang={lang} slug={g.slug} label={g.label} items={g.children} asDropdown={g.childrenAsDropdown} />
        ))}
      </nav>
    </>
  );
}
