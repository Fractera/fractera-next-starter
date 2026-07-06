"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NOTE_TYPE_LABEL, type NoteType } from "../_lib/note-type";
import type { NoteRow } from "../_lib/types";

// The single unified results table (step 188 Phase 3) — replaces the two removed
// spam tables. Reads the telegram_notes feed: a colored type badge (record/reminder/
// request), a one-line summary that expands on click, the reminder date (black if
// still due, gray if past), the created date, and a "Full text" modal that fetches
// the original message. Progressive load (20/page) + server-side search over ALL
// summaries. First page is server-rendered (works with JS off); the client adds
// search / sort / load-more.
const PAGE = 20;
const API = "/api/projects/personal/telegram-notes/notes";

const TYPE_STYLE: Record<NoteType, string> = {
  record: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-transparent",
  reminder: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent",
  request: "bg-green-500/15 text-green-600 dark:text-green-400 border-transparent",
  other: "bg-muted text-muted-foreground border-transparent",
};

const SORTS = [
  { v: "newest", label: "Newest first" },
  { v: "type", label: "By type" },
  { v: "reminder_soon", label: "Reminder: soonest" },
  { v: "reminder_late", label: "Reminder: latest" },
];

function fmtDate(sec: number | null): string {
  if (!sec) return "—";
  return new Date(sec * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function NotesTable({
  initialRows,
  initialTotal,
}: {
  initialRows: NoteRow[];
  initialTotal: number;
}) {
  const [rows, setRows] = useState<NoteRow[]>(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; text: string } | null>(null);
  const first = useRef(true);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const load = useCallback(
    async (opts: { q: string; sort: string; offset: number; append: boolean }) => {
      setBusy(true);
      try {
        const url = `${API}?limit=${PAGE}&offset=${opts.offset}&sort=${opts.sort}&q=${encodeURIComponent(opts.q)}`;
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) {
          toast.error(`Could not load records (HTTP ${r.status})`);
          return;
        }
        const d = (await r.json()) as { rows: NoteRow[]; total: number };
        setRows((prev) => (opts.append ? [...prev, ...d.rows] : d.rows));
        setTotal(d.total);
      } catch {
        toast.error("Could not load records (network error)");
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  // Re-query on search / sort change (debounced). Skip the first run — the initial
  // page is already server-rendered for q="" / newest.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load({ q, sort, offset: 0, append: false }), 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [q, sort, load]);

  async function openFull(id: string) {
    setModal({ id, text: "Loading…" });
    try {
      const r = await fetch(`${API}/${id}`, { cache: "no-store" });
      const d = r.ok ? ((await r.json()) as { fullText?: string }) : null;
      setModal({ id, text: d?.fullText || "(no text stored)" });
    } catch {
      setModal({ id, text: "Could not load the full text." });
    }
  }

  const now = Date.now();
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Track the records and requests you created here.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.v} value={s.v}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search summaries…"
          className="ml-auto max-w-xs"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Summary</th>
              <th className="px-3 py-2 font-medium">Reminder</th>
              <th className="px-3 py-2 font-medium">Created</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  No records yet — send a hook phrase in Telegram to create one.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const open = expanded === r.id;
                const dueMs = r.reminderDue ? r.reminderDue * 1000 : null;
                const past = dueMs !== null && dueMs < now;
                return (
                  <tr key={r.id} className="border-b align-top last:border-0">
                    <td className="px-3 py-2">
                      <Badge className={TYPE_STYLE[r.type]}>{NOTE_TYPE_LABEL[r.type]}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : r.id)}
                        className={"block max-w-md text-left " + (open ? "" : "line-clamp-1")}
                        title="Click to expand"
                      >
                        {r.summary || "—"}
                      </button>
                    </td>
                    <td
                      className={
                        "whitespace-nowrap px-3 py-2 " +
                        (r.type === "reminder" && !past
                          ? "text-foreground"
                          : "text-muted-foreground")
                      }
                    >
                      {r.type === "reminder" ? fmtDate(r.reminderDue) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                      {fmtDate(r.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openFull(r.id)}>
                        Full text
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>For semantic AI search, ask through Telegram.</span>
        {rows.length < total && (
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => load({ q, sort, offset: rows.length, append: true })}
          >
            {busy ? "Loading…" : `Load more (${total - rows.length})`}
          </Button>
        )}
      </div>
      <Dialog open={!!modal} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Full text</DialogTitle>
            <DialogDescription>The original message stored for this record.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm">
            {modal?.text}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
