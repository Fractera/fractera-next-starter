"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { ImageRecord } from "../_lib/project-data";
import { FinanceImageCell } from "./finance-image-cell.client";

// Images registry table (step 207.20 — the owner's FOUR integrated tables: Records · Finances · Images ·
// GEO). Every stored photo: preview, vision description (the searchable knowledge), document/photo plane,
// pending/linked status, and the records it belongs to via record_images. Client-side search over ≤50
// server-fetched rows (same pattern as the finance table).
function fmtDate(unix: number): string {
  const d = new Date(unix * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ImagesTable({ rows }: { rows: ImageRecord[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      `${r.description} ${r.kindHint} ${r.status} ${r.linked.join(" ")}`.toLowerCase().includes(needle),
    );
  }, [rows, q]);

  return (
    <div className="space-y-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search images (description, status, linked records)…"
        className="max-w-sm"
      />
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Preview</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Plane</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Linked records</th>
              <th className="px-3 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                  No images yet — send the bot a photo (a receipt or any picture).
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-0 align-top">
                  <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2">{r.url ? <FinanceImageCell url={r.url} /> : "—"}</td>
                  <td className="px-3 py-2 max-w-md">{r.description || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-3 py-2">
                    <span className="rounded border px-1.5 py-0.5 text-xs">{r.kindHint}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-medium ${r.status === "linked" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 max-w-xs">
                    {r.linked.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <ul className="space-y-0.5">
                        {r.linked.map((l) => (
                          <li key={l} className="text-xs">{l}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{fmtDate(r.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
