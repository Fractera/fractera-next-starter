"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { projectsStrings } from "./projects.i18n";
import type { AccessTier } from "./catalog";

// CLIENT BODY GATE (step 311, static-first) — the ONLY per-visitor part of the automation page. The static
// shell (header, breadcrumbs, hero, meta) is generated once (ISR); whether THIS visitor may see the gated
// body depends on their session, so that single decision moves to the client here. `/api/me` returns the
// session roles; we compare them to the automation's required tier in the browser. No cookies()/headers() on
// the server → the page stays static and costs nothing per view.
//
// Used ONLY for a gated automation (access !== "guest"); a public one renders its body inline on the server,
// fully static (see automation-page.server.tsx). While the role is loading, and with JavaScript OFF, the
// gate stays closed (safe default) — the body is empty at this step anyway, so nothing leaks.
const REQUIRED_RANK: Record<AccessTier, number> = { guest: 0, user: 1, architect: 2 };
function rankOf(roles: string[]): number {
  if (roles.includes("architect") || roles.includes("admin")) return 2;
  return roles.some((r) => r && r !== "guest") ? 1 : 0;
}

export function AccessGate({ access, lang }: { access: AccessTier; lang: string }) {
  const L = projectsStrings(lang);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s: { roles?: string[] } | null) => {
        if (alive) setAllowed(rankOf(s?.roles ?? []) >= REQUIRED_RANK[access]);
      })
      .catch(() => { if (alive) setAllowed(false); });
    return () => { alive = false; };
  }, [access]);

  if (allowed) {
    // Empty ready container — the automation body (tables/calendar/…) lands in a later step.
    return <div className="min-h-[8rem] rounded-xl border border-dashed bg-muted/20" />;
  }
  // Loading or denied → the access-error container (safe default while the session resolves).
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-10 text-center">
      <Lock className="size-6 text-muted-foreground" />
      <p className="font-medium">{L.bodyNoAccessTitle}</p>
      <p className="max-w-md text-sm text-muted-foreground">{L.bodyNoAccessText}</p>
    </div>
  );
}
