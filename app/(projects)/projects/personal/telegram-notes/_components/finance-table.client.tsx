"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FINANCE_COLUMNS, type FinanceColumn } from "../_data/finance-columns";
import { categoryLabel } from "../_data/finance-categories";
import type { FinanceRecord } from "../_lib/project-data";
import { FinanceImageCell } from "./finance-image-cell.client";

// Finance ledger table (step 207.10 item 5) — the SEPARATE money table (owner decision), now a CLIENT
// table so it has the same search + column-picker + localStorage persistence as the universal records
// table. Rows are server-fetched and passed in (≤50), so search / filtering is client-side (no extra
// API). Columns are DATA (FINANCE_COLUMNS) rendered through the typed switch below.
const STORAGE = "finance-cols:personal/telegram-notes";
const DEFAULT_VISIBLE = FINANCE_COLUMNS.map((c) => c.id);

function fmtDate(unix: number): string {
  const d = new Date(unix * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Cell({ col, row }: { col: FinanceColumn; row: FinanceRecord }) {
  switch (col.type) {
    case "kind":
      return (
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-medium ${row.kind === "income" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}
        >
          {row.kind}
        </span>
      );
    case "amount":
      return (
        <span className={`font-mono ${row.kind === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
          {row.kind === "income" ? "+" : "−"}
          {row.amount}
        </span>
      );
    case "categories":
      return (
        <span className="flex flex-wrap gap-1">
          {row.categories.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            row.categories.map((id) => (
              <span key={id} className="rounded border px-1.5 py-0.5 text-xs">
                {categoryLabel(id, "en")}
              </span>
            ))
          )}
        </span>
      );
    case "text":
      return <span>{row.summary || "—"}</span>;
    case "image":
      return row.imageUrl ? (
        <FinanceImageCell url={row.imageUrl} />
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    case "date":
      return <span className="whitespace-nowrap text-muted-foreground">{fmtDate(row.createdAt)}</span>;
    default:
      return null;
  }
}

export function FinanceTable({ rows }: { rows: FinanceRecord[] }) {
  const [search, setSearch] = useState("");
  const [visibleIds, setVisibleIds] = useState<string[]>(DEFAULT_VISIBLE);

  // Restore the user's personal column choice for this project's finance table.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved) setVisibleIds(JSON.parse(saved) as string[]);
    } catch {
      /* no stored choice — keep all columns visible */
    }
  }, []);

  const setVisible = useCallback((ids: string[]) => {
    setVisibleIds(ids);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(ids));
    } catch {
      /* storage unavailable — the choice just does not persist */
    }
  }, []);

  const cols = useMemo(() => FINANCE_COLUMNS.filter((c) => visibleIds.includes(c.id)), [visibleIds]);

  // Client-side search over the money-relevant fields (summary, kind, amount, category labels).
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.summary.toLowerCase().includes(q) ||
        r.kind.includes(q) ||
        String(r.amount).includes(q) ||
        r.categories.some((id) => categoryLabel(id, "en").toLowerCase().includes(q)),
    );
  }, [rows, search]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="mr-1 size-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Show columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {FINANCE_COLUMNS.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={visibleIds.includes(c.id)}
                onCheckedChange={(on) =>
                  setVisible(on ? [...visibleIds, c.id] : visibleIds.filter((id) => id !== c.id))
                }
                onSelect={(e) => e.preventDefault()}
              >
                {c.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="ml-auto max-w-xs"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              {cols.map((c) => (
                <th key={c.id} className="whitespace-nowrap px-3 py-2 font-medium">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={Math.max(cols.length, 1)} className="px-3 py-6 text-center text-muted-foreground">
                  {rows.length === 0
                    ? "No finance records yet. Send the bot a money note (for example: “got paid 1000”) or a receipt photo."
                    : "No finance records match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b align-top last:border-0">
                  {cols.map((c) => (
                    <td key={c.id} className="px-3 py-2">
                      <Cell col={c} row={r} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
