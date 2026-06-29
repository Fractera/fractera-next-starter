"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Top-menu auth control (step 160). Rendered ONLY when app-config menus.authButton is
// on (not every app has accounts). Client island: reads identity from /api/me (the slot
// convention — never auth() in a page), shows Sign in or the signed-in account. UI
// standard: shadcn Button (asChild) + lucide icons. The page HTML stays static; this
// island hydrates the auth state on top.
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

  if (me && me.userId) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground max-w-[160px] truncate hidden sm:block">{me.email}</span>
        <Link href="/api/auth/signout" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <LogOut />{labels.signOut}
        </Link>
      </div>
    );
  }

  // Before hydration / no account: the Sign-in link so no-JS visitors also get it.
  return (
    <Link href={`/login?lang=${lang}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
      <LogIn />{labels.signIn}
    </Link>
  );
}
