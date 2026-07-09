"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProjectColumn } from "../_data/columns";
import type { RecordRow } from "../_lib/types";
import type { FinanceRecord } from "../_lib/project-data";
import { RecordsTable } from "./records-table.client";
import { FinanceTable } from "./finance-table.client";

// Records ⇄ Finances panel (step 207.10 item 5): the two tables were stacked, doubling the page. Now they
// share ONE section with a right-aligned toggle — one table at a time, Records by default. The choice is
// remembered per browser (localStorage) so an owner who lives in Finances stays there across visits.
const STORAGE = "records-finances-view:personal/telegram-notes";
type View = "records" | "finances";

export function RecordsFinancesPanel({
  columns,
  records,
  finances,
}: {
  columns: ProjectColumn[];
  records: RecordRow[];
  finances: FinanceRecord[];
}) {
  const [view, setView] = useState<View>("records");

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE);
      if (v === "records" || v === "finances") setView(v);
    } catch {
      /* no stored choice — default to records */
    }
  }, []);

  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(STORAGE, v);
    } catch {
      /* storage unavailable — the choice just does not persist */
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-medium">
          {view === "records" ? "Records & requests" : "Finances"}
        </h2>
        <div className="inline-flex rounded-md border p-0.5">
          <Button
            variant={view === "records" ? "default" : "ghost"}
            size="sm"
            aria-pressed={view === "records"}
            onClick={() => choose("records")}
          >
            Records
          </Button>
          <Button
            variant={view === "finances" ? "default" : "ghost"}
            size="sm"
            aria-pressed={view === "finances"}
            onClick={() => choose("finances")}
          >
            Finances
          </Button>
        </div>
      </div>
      {view === "records" ? (
        <RecordsTable columns={columns} initialRows={records} />
      ) : (
        <FinanceTable rows={finances} />
      )}
    </div>
  );
}
