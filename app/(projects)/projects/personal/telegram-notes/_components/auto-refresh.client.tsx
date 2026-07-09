"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Live view for the owner cockpit (step 207.x — fix items 8 & 9): the project route is
// force-dynamic, so a periodic router.refresh() re-runs the server components and updates EVERY
// DB-backed section at once (records, finances, calendar, queue) — no new APIs, no websockets,
// self-sufficient. Pauses while the tab is hidden so a backgrounded page costs nothing, and
// refreshes once on regaining focus so a switched-away tab is current the moment it returns.
// Renders nothing.
export function AutoRefresh({ intervalMs = 8000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) router.refresh();
    };
    const id = setInterval(tick, intervalMs);
    const onVisible = () => {
      if (!document.hidden) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, intervalMs]);
  return null;
}
