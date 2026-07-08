import { FINANCE_COLUMNS, type FinanceColumn } from "../_data/finance-columns";
import { categoryLabel } from "../_data/finance-categories";
import type { FinanceRecord } from "../_lib/project-data";

// Finance section (step 207) — a SEPARATE ledger table from the universal records table (owner decision).
// Server-rendered (static-first, zero client JS): the money movements the automation digitized from voice
// notes and receipt photos, grouped by kind (income first, then expense). Columns are DATA (FINANCE_COLUMNS)
// rendered through a small typed switch; the receipt image is a plain link (preview modal is step 207.9).
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
        <a href={row.imageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
          Open
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    case "date":
      return <span className="whitespace-nowrap text-muted-foreground">{fmtDate(row.createdAt)}</span>;
    default:
      return null;
  }
}

export function FinanceSection({ rows }: { rows: FinanceRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            {FINANCE_COLUMNS.map((c) => (
              <th key={c.id} className="whitespace-nowrap px-3 py-2 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={FINANCE_COLUMNS.length} className="px-3 py-6 text-center text-muted-foreground">
                No finance records yet. Send the bot a money note (for example: &quot;got paid 1000&quot;) or a receipt photo.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-b align-top last:border-0">
                {FINANCE_COLUMNS.map((c) => (
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
  );
}
