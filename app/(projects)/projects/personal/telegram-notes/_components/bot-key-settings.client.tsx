"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  refreshAutomationStatus,
  setAutomationEnabled,
  useAutomationStatus,
} from "../_lib/automation-status";

// Bot-API track settings (step 188 Phase 4): replace the Telegram bot token and turn the
// automation on/off. The token goes to the slot env setter (runtime var + restart, rule
// 143); the on/off flag flips the co-located cron.json `enabled` (fractera-cron re-reads
// it live). Turning it off makes this track "broken" — the shared store updates so the
// page status pill AND this tab's dot go red INSTANTLY (Phase 4.1, no reload).
export function BotKeySettings() {
  const status = useAutomationStatus();
  const enabled = status.loaded ? status.enabled : null;
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !(enabled ?? true);
    setBusy(true);
    setAutomationEnabled(next); // optimistic — pill + dot react immediately
    try {
      const r = await fetch("/api/projects/personal/telegram-notes/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!r.ok) {
        setAutomationEnabled(!next); // revert on failure
        toast.error(`Could not update (HTTP ${r.status})`);
        return;
      }
      toast.success(next ? "Automation activated" : "Automation deactivated");
    } catch {
      setAutomationEnabled(!next);
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
      // Register this bot with the substrate listener so it starts polling (one bot per automation,
      // step 205). Best-effort — the env token is saved regardless; the listener reconciles on its tick.
      try {
        await fetch("/api/project-config/register-bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: "personal", project: "telegram-notes", token: value }),
        });
      } catch { /* best-effort */ }
      setToken("");
      void refreshAutomationStatus(); // reflect the new key in the pill/dots
      toast.success("Bot token saved — applying (a brief restart)");
    } catch {
      toast.error("Could not save the token (network error)");
    } finally {
      setBusy(false);
    }
  }

  async function testBot() {
    setBusy(true);
    try {
      const r = await fetch("/api/projects/personal/telegram-notes/test-bot", { method: "POST" });
      const data = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (data?.ok) toast.success("Sent a test message to your Telegram");
      else toast.error(data?.error ?? "Could not send a test message");
    } catch {
      toast.error("Could not reach the bot");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Give this automation its OWN Telegram bot (each automation needs a separate one). In Telegram,
        message{" "}
        <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="underline">
          @BotFather
        </a>
        , run <code>/newbot</code>, pick a name ending in <code>_bot</code> (for example{" "}
        <code>my_notes_bot</code>), and paste the token it gives you below. The automation reads your
        messages to that bot and replies there.
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

      {/* Send a test message so you can confirm the bot works. Message your bot once first —
          a bot cannot start a chat on its own. */}
      <Button variant="outline" size="sm" disabled={busy} onClick={testBot}>
        Test bot
      </Button>
    </div>
  );
}
