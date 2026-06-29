"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Top-menu auth control (step 160). Rendered ONLY when app-config menus.authButton is
// on (not every app has accounts). Client island: reads identity from /api/me (the slot
// convention — never auth() in a page), shows Sign in or the signed-in account. The page
// HTML is still static; this island hydrates the auth state on top.
type Me = { userId?: string; email?: string; roles?: string[] } | null;

export function AuthButton({ lang, labels }: { lang: string; labels: { signIn: string; signOut: string } }) {
  const [me, setMe] = useState<Me>(undefined as unknown as Me);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive) setMe(d?.userId ? d : null); })
      .catch(() => { if (alive) setMe(null); });
    return () => { alive = false; };
  }, []);

  // Before hydration / while loading: render the Sign-in link so no-JS visitors also get it.
  if (me && me.userId) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground max-w-[160px] truncate hidden sm:block">{me.email}</span>
        <Link href="/api/auth/signout" className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent">
          {labels.signOut}
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/login?lang=${lang}`} className="text-sm font-semibold text-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent">
      {labels.signIn}
    </Link>
  );
}
