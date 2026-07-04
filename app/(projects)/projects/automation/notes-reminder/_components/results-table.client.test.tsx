import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ProjectResult } from "../_lib/types";
import {
  getNextSortOrder,
  sortResultsByStartedAt,
} from "./results-table.client";

const results: ProjectResult[] = [
  {
    id: "middle",
    started_at: "2026-07-04T10:00:00.000Z",
    finished_at: "2026-07-04T10:01:00.000Z",
    notes_collected: 2,
    status: "completed",
    error: null,
  },
  {
    id: "newest",
    started_at: "2026-07-04T12:00:00.000Z",
    finished_at: "2026-07-04T12:01:00.000Z",
    notes_collected: 3,
    status: "completed",
    error: null,
  },
  {
    id: "oldest",
    started_at: "2026-07-04T08:00:00.000Z",
    finished_at: "2026-07-04T08:01:00.000Z",
    notes_collected: 1,
    status: "completed",
    error: null,
  },
];

describe("ResultsTable sort order", () => {
  it("uses asc by default, then desc, then asc again", () => {
    let sortOrder: "asc" | "desc" = "asc";

    assert.deepEqual(
      sortResultsByStartedAt(results, sortOrder).map((result) => result.id),
      ["oldest", "middle", "newest"]
    );

    sortOrder = getNextSortOrder(sortOrder);
    assert.equal(sortOrder, "desc");
    assert.deepEqual(
      sortResultsByStartedAt(results, sortOrder).map((result) => result.id),
      ["newest", "middle", "oldest"]
    );

    sortOrder = getNextSortOrder(sortOrder);
    assert.equal(sortOrder, "asc");
    assert.deepEqual(
      sortResultsByStartedAt(results, sortOrder).map((result) => result.id),
      ["oldest", "middle", "newest"]
    );
  });

  it("does not mutate the original results array", () => {
    const originalOrder = results.map((result) => result.id);

    sortResultsByStartedAt(results, "desc");

    assert.deepEqual(
      results.map((result) => result.id),
      originalOrder
    );
  });

  it("keeps original relative order when started_at is unavailable", () => {
    const incompleteResults = [
      { ...results[1], id: "missing", started_at: "" },
      results[2],
      { ...results[0], id: "invalid", started_at: "not-a-date" },
    ];

    assert.deepEqual(
      sortResultsByStartedAt(incompleteResults, "desc").map(
        (result) => result.id
      ),
      ["missing", "oldest", "invalid"]
    );
  });
});
