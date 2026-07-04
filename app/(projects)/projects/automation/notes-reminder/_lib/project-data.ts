import type { ProcessRun, ProjectResult } from "./types";
import { db } from "@/lib/db";

export async function getProcessQueue(): Promise<ProcessRun[]> {
  try {
    const stmt = db.prepare(`
      SELECT id, started_at, status, notes_count
      FROM project_cron_runs
      WHERE project = 'notes-reminder'
      ORDER BY started_at DESC
      LIMIT 10
    `);
    const rows = await stmt.all();
    return rows.map((row: Record<string, unknown>) => ({
      id: String(row.id),
      started_at: String(row.started_at),
      status: String(row.status) as "in-progress" | "completed" | "failed",
      notes_count: Number(row.notes_count) || 0,
    }));
  } catch {
    return [];
  }
}

export async function getResults(): Promise<ProjectResult[]> {
  try {
    const stmt = db.prepare(`
      SELECT id, started_at, finished_at, notes_count, error
      FROM (
        SELECT id, started_at, finished_at, notes_count, error
        FROM reminders_history
        ORDER BY started_at DESC
        LIMIT 20
      )
      ORDER BY started_at ASC
    `);
    const rows = await stmt.all();
    return rows.map((row: Record<string, unknown>) => ({
      id: String(row.id),
      started_at: String(row.started_at),
      finished_at: row.finished_at ? String(row.finished_at) : null,
      notes_collected: Number(row.notes_count) || 0,
      status: row.finished_at ? ("completed" as const) : ("failed" as const),
      error: row.error ? String(row.error) : null,
    }));
  } catch {
    return [];
  }
}
