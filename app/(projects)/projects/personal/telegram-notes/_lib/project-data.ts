import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "@/lib/db";
import { PROJECT_COLUMNS, RECORD_TABLE } from "../_data/columns";
import type { CronJob, NoteRow, RecordRow } from "./types";
import { noteType } from "./note-type";

const CATEGORY = "personal";
const PROJECT = "telegram-notes";

// Identifier guard for the config-driven records table (RECORD_TABLE / column sources are
// engine-generated + gate-validated; re-checked so a hand edit can never inject SQL).
const IDENT = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// Rows of the UNIVERSAL records table (ontology entity 12 Record): project each column's
// `source` from RECORD_TABLE into a values map keyed by column id. Server-rendered first page;
// the /records API adds search + pagination.
export async function getRecords(): Promise<RecordRow[]> {
  if (!RECORD_TABLE || !IDENT.test(RECORD_TABLE)) return [];
  const sources = Array.from(
    new Set(PROJECT_COLUMNS.map((c) => c.source).filter((s) => IDENT.test(s))),
  );
  const cols = ["id", ...sources.filter((s) => s !== "id")];
  try {
    const rows = await db
      .prepare(`SELECT ${cols.join(", ")} FROM ${RECORD_TABLE} ORDER BY id DESC LIMIT 20`)
      .all();
    return rows.map((row) => {
      const rec = row as Record<string, unknown>;
      const values: Record<string, unknown> = {};
      for (const c of PROJECT_COLUMNS) values[c.id] = rec[c.source];
      return { id: String(rec.id), values };
    });
  } catch {
    return [];
  }
}

// Server-rendered first page of the unified results table (step 188 Phase 3): the
// newest telegram_notes rows + the total count. The client table then handles search /
// sort / load-more via /api/projects/personal/telegram-notes/notes.
export async function getNotes(limit = 20): Promise<{ rows: NoteRow[]; total: number }> {
  try {
    const rows = await db
      .prepare(
        `SELECT id, hook_action, hook_phrase, condition, summary, reminder_due, delivered, created_at
           FROM telegram_notes WHERE project_slug = ?
          ORDER BY created_at DESC, id DESC LIMIT ?`,
      )
      .all(PROJECT, limit);
    const totalRow = (await db
      .prepare(`SELECT COUNT(*) AS n FROM telegram_notes WHERE project_slug = ?`)
      .get(PROJECT)) as { n: number } | null;
    return {
      rows: rows.map((r) => ({
        id: String(r.id),
        type: noteType(String(r.hook_action)),
        action: String(r.hook_action),
        hookPhrase: String(r.hook_phrase ?? ""),
        condition: r.condition === null || r.condition === undefined ? null : String(r.condition),
        summary: String(r.summary ?? ""),
        reminderDue: r.reminder_due === null ? null : Number(r.reminder_due),
        delivered: Boolean(r.delivered),
        createdAt: Number(r.created_at),
      })),
      total: totalRow?.n ?? 0,
    };
  } catch {
    return { rows: [], total: 0 }; // table not created yet — empty feed
  }
}

export async function getCronJobs(): Promise<CronJob[]> {
  try {
    const raw = await readFile(
      join(
        process.cwd(),
        "app",
        "(projects)",
        "projects",
        CATEGORY,
        PROJECT,
        "cron.json",
      ),
      "utf8",
    );
    const jobs = JSON.parse(raw)?.jobs;
    if (!Array.isArray(jobs)) {
      return [];
    }
    return jobs.map((j) => ({
      id: String(j?.id ?? ""),
      title: String(j?.title ?? j?.id ?? ""),
      schedule: String(j?.schedule ?? ""),
      enabled: j?.enabled !== false,
    }));
  } catch {
    return []; // no cron.json yet — the project declares no scheduled runs
  }
}
