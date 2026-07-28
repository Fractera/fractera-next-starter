"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// COOKIE CONSENT BANNER (step 305) — reprogrammed from FES components/cookie-banner.tsx into the FNS config
// system. Shown until the visitor decides; stores the choice in localStorage ("fractera-cookie-consent")
// and drives Google Consent Mode v2 (analytics_storage granted/denied) if gtag is present. Strings are
// server-provided per language (readBannerConfig in the layout) so anonymous visitors — who never reach the
// gated /api — still get a fully localized banner. Re-openable via the "open-cookie-settings" window event.
export function CookieBanner({
  lang,
  strings,
}: {
  lang: string;
  strings: { message: string; policyLinkLabel: string; accept: string; reject: string };
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("fractera-cookie-consent")) setVisible(true);
    const handler = () => setVisible(true);
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  if (!visible) return null;

  const [before, after] = strings.message.split("{policy}");

  function consent(choice: "accepted" | "rejected") {
    localStorage.setItem("fractera-cookie-consent", choice);
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("consent", "update", { analytics_storage: choice === "accepted" ? "granted" : "denied" });
    }
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/98 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {before}
          <Link href={`/${lang}/legal/cookies`} className="text-foreground underline hover:no-underline">
            {strings.policyLinkLabel}
          </Link>
          {after}
        </p>
        <div className="flex shrink-0 gap-3">
          <Button type="button" onClick={() => consent("accepted")}>
            {strings.accept}
          </Button>
          <Button type="button" variant="outline" onClick={() => consent("rejected")}>
            {strings.reject}
          </Button>
        </div>
      </div>
    </div>
  );
}
