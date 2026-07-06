import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "@/lib/db";
import type { CronJob, Hook, NoteRow } from "./types";
import { noteType } from "./note-type";

const CATEGORY = "personal";
const PROJECT = "telegram-notes";

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

// Hooks registered for this project (step 187): rows of the GLOBAL project_hooks
// table filtered to this category/project. The server-rendered table shows what
// spoken phrases already drive this automation; the client panel adds/removes them.
export async function getHooks(): Promise<Hook[]> {
  try {
    const rows = await db
      .prepare(
        `SELECT id, phrase, action, lang, description
           FROM project_hooks
          WHERE category = ? AND project = ?
          ORDER BY created_at`,
      )
      .all(CATEGORY, PROJECT);
    return rows.map((r) => ({
      id: String(r.id),
      phrase: String(r.phrase),
      action: r.action as Hook["action"],
      lang: String(r.lang),
      description: String(r.description ?? ""),
    }));
  } catch {
    return []; // table not created yet — no hooks
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
