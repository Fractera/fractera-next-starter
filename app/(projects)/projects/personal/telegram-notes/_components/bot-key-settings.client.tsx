"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Bot-API track settings (step 188 Phase 4): replace the Telegram bot token and turn the
// automation on/off. The token goes to the slot env setter (runtime var + restart, rule
// 143); the on/off flag flips the co-located cron.json `enabled` (fractera-cron re-reads
// it live). Turning it off makes this track "broken" — the page status pill goes red.
export function BotKeySettings() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/projects/personal/telegram-notes/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { enabled?: boolean } | null) => {
        if (d) setEnabled(d.enabled !== false);
      })
      .catch(() => setEnabled(true));
  }, []);

  async function toggle() {
    const next = !(enabled ?? true);
    setBusy(true);
    try {
      const r = await fetch("/api/projects/personal/telegram-notes/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!r.ok) {
        toast.error(`Could not update (HTTP ${r.status})`);
        return;
      }
      setEnabled(next);
      toast.success(next ? "Automation activated" : "Automation deactivated");
    } catch {
      toast.error("Could not update (network error)");
    } finally {
      setBusy(false);
    }
  }

  async function saveToken() {
    const value = token.trim();
    if (!value) return;
    setBusy(true);
    try {
      const r = await fetch("/api/project-config/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "TELEGRAM_BOT_TOKEN", value }),
      });
      if (!r.ok) {
        const info = (await r.json().catch(() => null)) as { error?: string } | null;
        toast.error(info?.error ?? `Save failed (HTTP ${r.status})`);
        return;
      }
      setToken("");
      toast.success("Bot token saved — applying (a brief restart)");
    } catch {
      toast.error("Could not save the token (network error)");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The bot token connects your Telegram bot (from @BotFather). Example: message
        @BotFather, run <code>/newbot</code>, and paste the token it gives you. The
        automation reads your messages to that bot and replies there.
      </p>

      {/* Activate / deactivate */}
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-sm font-medium">
            {enabled === null ? "…" : enabled ? "Active" : "Deactivated"}
          </p>
          <p className="text-xs text-muted-foreground">
            Deactivating stops reception — this track shows as broken.
          </p>
        </div>
        <Button
          variant={enabled ? "outline" : "default"}
          size="sm"
          disabled={busy || enabled === null}
          onClick={toggle}
          aria-pressed={Boolean(enabled)}
        >
          {enabled ? "Deactivate" : "Activate"}
        </Button>
      </div>

      {/* Replace token */}
      <div className="space-y-2">
        <label htmlFor="bot-token" className="text-sm font-medium">
          Replace bot token
        </label>
        <div className="flex gap-2">
          <Input
            id="bot-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456:ABC-…"
          />
          <Button onClick={saveToken} disabled={busy || !token.trim()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
