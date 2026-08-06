"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminBase, designBase } from "@/lib/runtime-urls";
import type { LayerLabels } from "@/components/menu/footer/footer-menu.i18n";

// Footer navigator between the app's MAIN AREAS. Three destinations after step 500:
// Home (public), Admin panel (:3002) and Design (:3004). The Projects/automations
// layer (:3003) was removed from the product. Each cockpit layer is ROLE-GATED: on click, if the
// visitor lacks the required role a RED toast ("insufficient permissions") is shown and
// navigation is cancelled; with the role, the browser is sent to that layer. Home is a
// plain public link (no gate, works without JS). Identity comes from /api/me (the slot
// convention — never auth() in a page). The cockpit hrefs are host-derived at CLICK time
// (adminBase()/designBase() read window.location) so one build works in both
// IP and domain (Secure) mode; they are rendered as href="#" (identical on server & first
// client render → no hydration mismatch) and resolved in the handler. Heading uses the
// shared footer-heading font (mono/uppercase), same as the other footer sections.
type Me = { userId?: string; roles?: string[] } | null;

type LayerItem = {
  key: "home" | "admin" | "design";
  need: string[] | null; // null = public (always allowed); else roles admitted
  resolve: (lang: string) => string; // destination URL, computed at click (window-derived)
};

// Roles admitted to each cockpit layer. Admin and Design are architect-only;
// Home is public (need: null).
const LAYERS: LayerItem[] = [
  { key: "home", need: null, resolve: (lang) => `/${lang}` },
  { key: "admin", need: ["architect"], resolve: () => adminBase() },
  { key: "design", need: ["architect"], resolve: () => designBase() },
];

export function FooterLayersNav({ lang, labels }: { lang: string; labels: LayerLabels }) {
  const [me, setMe] = useState<Me>(undefined as unknown as Me);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive) setMe(d?.userId ? d : null); })
      .catch(() => { if (alive) setMe(null); });
    return () => { alive = false; };
  }, []);

  const loaded = me !== undefined;
  const roles = me?.roles ?? [];

  function go(e: React.MouseEvent, item: LayerItem) {
    e.preventDefault();
    // While identity is still loading, let the destination's own server gate decide
    // (avoids a false "denied" on a fast click). Once loaded, enforce the client gate.
    if (loaded && item.need && !item.need.some((r) => roles.includes(r))) {
      toast.error(labels.denied);
      return;
    }
    window.location.href = item.resolve(lang);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-6">
      <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">{labels.heading}</p>
      {/* Responsive columns (owner req): 1 on mobile, 2 on tablet (md), 4 on wide (lg ≥1024).
          Same rule as the legal block, the categories grid and the automation-card grid. */}
      <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-foreground/75 font-medium">
        {LAYERS.map((item) =>
          item.need === null ? (
            // Home — plain public link, works without JS.
            <Link key={item.key} href={`/${lang}`} className="hover:text-primary transition-colors">
              {labels[item.key]}
            </Link>
          ) : (
            <a
              key={item.key}
              href="#"
              onClick={(e) => go(e, item)}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {labels[item.key]}
            </a>
          )
        )}
      </nav>
    </div>
  );
}
