"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_HOOKS } from "../_data/hooks";
import { PROJECT_ACTIONS } from "../_data/actions";
import type { Hook } from "../_lib/types";

// Hooks layer of the project page (step 187.4): the spoken trigger phrases that drive
// this automation. Lists the hooks already registered (GLOBAL project_hooks table via
// /api/project-hooks) and lets the user register the project's DEFAULT_HOOKS suggestions
// or their own wording. Phrase uniqueness is enforced app-wide: a duplicate/near-dup is
// refused (409) and surfaced as a toast — the user picks different wording, never forced.
const CATEGORY = "personal";
const PROJECT = "telegram-notes";

// Action labels + options come from the project's ACTIONS registry (_data/actions.ts, derived
// from the automation graph — 188-R). A hook binds a phrase to one of THESE typed actions, never
// an abstract verb; adding a new action means extending the automation's diagram, not this panel.
const ACTION_LABEL: Record<string, string> = Object.fromEntries(
  PROJECT_ACTIONS.map((a) => [a.id, a.title]),
);
const ACTION_OPTIONS = PROJECT_ACTIONS.map((a) => ({ v: a.id, label: a.title, hint: a.description }));

export function HooksPanel({ initialHooks }: { initialHooks: Hook[] }) {
  const [hooks, setHooks] = useState<Hook[]>(initialHooks);
  const [phrase, setPhrase] = useState("");
  const [action, setAction] = useState<string>(ACTION_OPTIONS[0]?.v ?? "save");
  const [busy, setBusy] = useState(false);

  // Refresh from the server on mount so the list reflects hooks other sessions added.
  useEffect(() => {
    fetch(`/api/project-hooks?category=${CATEGORY}&project=${PROJECT}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { hooks?: unknown[] } | null) => {
        if (d?.hooks) setHooks(d.hooks as Hook[]);
      })
      .catch(() => {});
  }, []);

  const registered = new Set(hooks.map((h) => h.phrase.trim().toLowerCase()));
  const suggestions = DEFAULT_HOOKS.filter(
    (d) => !registered.has(d.phrase.trim().toLowerCase()),
  );

  async function register(p: string, action: string, description: string, lang: string) {
    const value = p.trim();
    if (!value) return;
    setBusy(true);
    try {
      const res = await fetch("/api/project-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: CATEGORY, project: PROJECT, phrase: value, action, description, lang }),
      });
      if (res.status === 409) {
        const info = (await res.json().catch(() => null)) as { conflict?: { project?: string } } | null;
        toast.error(
          info?.conflict?.project
            ? `That phrase is too similar to a hook in "${info.conflict.project}". Try different wording.`
            : "That phrase is too similar to an existing hook. Try different wording.",
        );
        return;
      }
      if (!res.ok) {
        toast.error(`Could not add the hook (HTTP ${res.status})`);
        return;
      }
      const { hook } = (await res.json()) as { hook: Hook };
      setHooks((prev) => [...prev, hook]);
      setPhrase("");
      toast.success("Hook added");
    } catch {
      toast.error("Could not add the hook (network error)");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/project-hooks?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) setHooks((prev) => prev.filter((h) => h.id !== id));
      else toast.error("Could not remove the hook");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      {/* Registered hooks */}
      {hooks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hooks yet. A hook is a phrase you say (in Telegram or chat) that runs this
          automation. Add one below or from the suggestions.
        </p>
      ) : (
        <ul className="space-y-2">
          {hooks.map((h) => (
            <li key={h.id} className="flex items-start gap-2 text-sm">
              <Mic className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1">
                <span className="font-medium">&ldquo;{h.phrase}&rdquo;</span>
                <span className="text-muted-foreground"> — {ACTION_LABEL[h.action] ?? h.action}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(h.id)}
                disabled={busy}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                aria-label="Remove hook"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Suggestions (project defaults not yet registered) */}
      {suggestions.length > 0 && (
        <div className="space-y-1.5 border-t pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggested</p>
          {suggestions.map((s) => (
            <button
              key={s.phrase}
              type="button"
              disabled={busy}
              onClick={() => register(s.phrase, s.action, s.description, s.lang ?? "en")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50"
            >
              <Plus className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1">
                &ldquo;{s.phrase}&rdquo;
                <span className="text-muted-foreground"> — {ACTION_LABEL[s.action] ?? s.action}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Free-form add — pick the action the phrase triggers. Whatever you type is
          stored as simple lowercase text (punctuation/case dropped), so any Telegram
          message is matched on meaning, not an exact phrase. */}
      <div className="space-y-2 border-t pt-3">
        <div className="flex flex-wrap gap-2">
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((o) => (
                <SelectItem key={o.v} value={o.v}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Add your own trigger phrase…"
            className="min-w-48 flex-1"
            onKeyDown={(e) => e.key === "Enter" && register(phrase, action, "", "en")}
          />
          <Button onClick={() => register(phrase, action, "", "en")} disabled={busy || !phrase.trim()}>
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Actions are defined by the automation&apos;s diagram — to add a new one, extend the
          automation. The phrase is stored lowercase without punctuation — e.g. &ldquo;Remind
          me…&rdquo; → &ldquo;remind me&rdquo;.
        </p>
      </div>
    </div>
  );
}
