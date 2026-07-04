"use client";

import { useMemo, useState } from "react";
import type { ProjectResult } from "../_lib/types";

type SortOrder = "asc" | "desc";

export function getNextSortOrder(sortOrder: SortOrder): SortOrder {
  return sortOrder === "asc" ? "desc" : "asc";
}

function getRunTime(result: ProjectResult) {
  const runTime = new Date(result.started_at).getTime();
  return Number.isNaN(runTime) ? null : runTime;
}

export function sortResultsByStartedAt(
  results: ProjectResult[],
  sortOrder: SortOrder
) {
  return [...results].sort((a, b) => {
    const aRunTime = getRunTime(a);
    const bRunTime = getRunTime(b);

    if (aRunTime === null || bRunTime === null) {
      return 0;
    }

    const diff = aRunTime - bRunTime;
    return sortOrder === "asc" ? diff : -diff;
  });
}

export function ResultsTable({ results }: { results: ProjectResult[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const sortedResults = useMemo(
    () => sortResultsByStartedAt(results, sortOrder),
    [results, sortOrder]
  );
  const isNewestFirst = sortOrder === "desc";

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          aria-label={
            isNewestFirst
              ? "Показать старые результаты сверху"
              : "Показать новые результаты сверху"
          }
          aria-pressed={isNewestFirst}
          onClick={() => setSortOrder(getNextSortOrder)}
          className="inline-flex min-h-9 items-center rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isNewestFirst ? "Новые сверху" : "Старые сверху"}
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-2 font-medium">Начато</th>
              <th className="px-4 py-2 font-medium">Завершено</th>
              <th className="px-4 py-2 font-medium">Заметок собрано</th>
              <th className="px-4 py-2 font-medium">Статус</th>
              <th className="px-4 py-2 font-medium">Ошибка</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Результатов пока нет - завершенные запуски появятся здесь.
                </td>
              </tr>
            ) : (
              sortedResults.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-4 py-2">
                    {new Date(r.started_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {r.finished_at
                      ? new Date(r.finished_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{r.notes_collected}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2 text-xs text-red-600">
                    {r.error ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
