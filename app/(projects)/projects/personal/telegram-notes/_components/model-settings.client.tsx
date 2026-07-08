"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Per-automation model selection (step 205 §L): each automation picks its OWN OpenAI model — different
// automations need different capability/price points (document parsing needs vision; a cheap text
// automation does not). ONE global OpenAI key (Admin → Hermes), the MODEL is per project. Writes the
// runtime env key TELEGRAM_NOTES_MODEL via the slot env setter (restart, no rebuild).
const MODELS_LINK = "https://developers.openai.com/api/docs/models";

export function ModelSettings() {
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    const value = model.trim();
    if (!value) return;
    setBusy(true);
    try {
      const r = await fetch("/api/project-config/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "TELEGRAM_NOTES_MODEL", value }),
      });
      if (!r.ok) {
        const info = (await r.json().catch(() => null)) as { error?: string } | null;
        toast.error(info?.error ?? `Save failed (HTTP ${r.status})`);
        return;
      }
      setModel("");
      toast.success("Model saved — applying (a brief restart)");
    } catch {
      toast.error("Could not save the model (network error)");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Choose the OpenAI model this automation uses (one global key, a model per automation). Not sure
        which to pick? See the{" "}
        <a href={MODELS_LINK} target="_blank" rel="noopener noreferrer" className="underline">
          OpenAI model guide
        </a>{" "}
        for the price = capability = quality trade-off. This automation digitizes photos, so a
        vision-capable model is recommended. Default if unset: <code>gpt-4o-mini</code>.
      </p>
      <div className="flex gap-2">
        <Input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="gpt-4o-mini"
          autoComplete="off"
        />
        <Button onClick={save} disabled={busy || !model.trim()}>
          Save
        </Button>
      </div>
    </div>
  );
}
