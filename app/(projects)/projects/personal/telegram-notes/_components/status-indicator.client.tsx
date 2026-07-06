"use client";

import { useEffect, useState } from "react";

// Automation state pill (step 188 Phase 2) — rendered next to the breadcrumb/title.
// A colored dot + a short label tells the owner at a glance whether the automation is
// running, degraded (a key or a track missing), or broken (stopped / not configured).
// State is derived from: the cron enabled flag (passed from the server-read cron.json)
// and a live presence check of the two integration keys. The full per-track logic
// (bot key vs userbot) lands with the settings accordion (Phase 4); here we surface the
// overall health.
type State = "loading" | "running" | "degraded" | "broken";

const STYLE: Record<State, { dot: string; text: string }> = {
  loading: { dot: "bg-muted-foreground/50 animate-pulse", text: "text-muted-foreground" },
  running: { dot: "bg-green-500", text: "text-green-600 dark:text-green-500" },
  degraded: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-500" },
  broken: { dot: "bg-red-500", text: "text-red-600 dark:text-red-500" },
};

export function StatusIndicator({ cronEnabled }: { cronEnabled: boolean }) {
  const [state, setState] = useState<State>("loading");
  const [label, setLabel] = useState("Checking…");

  useEffect(() => {
    let alive = true;
    async function check() {
      let botOk = false;
      let openaiOk = false;
      try {
        const r = await fetch("/api/project-config/env?keys=TELEGRAM_BOT_TOKEN", { cache: "no-store" });
        const d = r.ok ? ((await r.json()) as { present?: Record<string, boolean> }) : null;
        botOk = Boolean(d?.present?.TELEGRAM_BOT_TOKEN);
      } catch {
        /* env unreachable — treat as unknown (not "missing") */
        botOk = true;
      }
      try {
        const r = await fetch("/api/project-config/openai-key", { cache: "no-store" });
        const d = r.ok ? ((await r.json()) as { configured?: boolean; inconclusive?: boolean }) : null;
        // An inconclusive check must not raise a false "missing key" (187.9).
        openaiOk = Boolean(d?.configured) || Boolean(d?.inconclusive);
      } catch {
        openaiOk = true;
      }
      if (!alive) return;
      const missing = [!botOk && "Telegram key", !openaiOk && "OpenAI key"].filter(Boolean) as string[];
      if (!cronEnabled) {
        setState("broken");
        setLabel("Stopped");
      } else if (missing.length === 0) {
        setState("running");
        setLabel("Running");
      } else if (missing.length === 1) {
        setState("degraded");
        setLabel(`Needs ${missing[0]}`);
      } else {
        setState("broken");
        setLabel("Not configured");
      }
    }
    check();
    return () => {
      alive = false;
    };
  }, [cronEnabled]);

  const s = STYLE[state];
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <span className={`size-2.5 rounded-full ${s.dot}`} aria-hidden />
      <span className={s.text}>{label}</span>
    </div>
  );
}
