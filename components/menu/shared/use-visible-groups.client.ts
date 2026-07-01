"use client";

import { useEffect, useState } from "react";
import type { MenuGroup } from "@/lib/menu/group-menus";

// Role-aware visibility for menu items (step 167 defect fix). The group manifest carries a
// `roles` echo (step 158), but the always-present menus render every enabled group to EVERYONE —
// so a guest saw a link to a role-gated group (e.g. Documentation) whose page then redirects.
// Menus are statically scanned server-side (no viewer identity there); the viewer's role is only
// known at runtime, so we gate CLIENT-side from /api/me — the same slot convention the account
// button uses (never auth() in a page).
//
// Rule: a PUBLIC group is always visible (incl. pre-hydration and no-JS). A ROLE-GATED group is
// hidden until identity is known AND the viewer holds a matching role — so no gated link ever
// flashes to a guest. Gated content requires JS auth anyway (the RouteGuard is a client gate).

// roles echo vocabulary (manage-group.mjs): "public", "public+guest", or role names joined by "+".
export function isPublicGroup(roles: string): boolean {
  return !roles || roles === "public" || roles === "public+guest";
}

type Me = { userId?: string; roles?: string[] } | null;
const LOADING = undefined as unknown as Me;

export function useVisibleGroups(groups: MenuGroup[]): MenuGroup[] {
  const [me, setMe] = useState<Me>(LOADING);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive) setMe(d?.userId ? d : null); })
      .catch(() => { if (alive) setMe(null); });
    return () => { alive = false; };
  }, []);

  return groups.filter((g) => {
    if (isPublicGroup(g.roles)) return true;      // public: always visible
    if (me === LOADING) return false;             // gated: hidden until identity known (no guest flash)
    const mine = me?.roles ?? [];
    return g.roles.split("+").some((r) => mine.includes(r));
  });
}
