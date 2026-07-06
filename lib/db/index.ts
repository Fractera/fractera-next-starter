import Database from "better-sqlite3"
import { mkdirSync } from "fs"
import { join, dirname } from "path"
import { remoteDb } from "./remote-client"

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS products (
    id         TEXT PRIMARY KEY NOT NULL,
    name       TEXT NOT NULL,
    price      REAL NOT NULL DEFAULT 0,
    media_id   TEXT,
    media_url  TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS site_settings (
    id            INTEGER PRIMARY KEY DEFAULT 1,
    custom_domain TEXT,
    domain_status TEXT NOT NULL DEFAULT 'idle',
    domain_error  TEXT,
    updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
  CREATE TABLE IF NOT EXISTS deployment_records (
    id             TEXT PRIMARY KEY NOT NULL,
    result         INTEGER NOT NULL DEFAULT 3,
    project        TEXT NOT NULL DEFAULT 'default',
    tokens         INTEGER NOT NULL DEFAULT 0,
    platform       TEXT,
    model          TEXT,
    page_url       TEXT,
    commit_message TEXT,
    status         TEXT NOT NULL DEFAULT 'ready',
    duration_ms    INTEGER,
    commit_hash    TEXT,
    branch         TEXT,
    author         TEXT,
    step           TEXT,
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    created_by     TEXT NOT NULL DEFAULT 'system'
  );
  -- Cron journal (Projects layer). The substrate runner (fractera-cron) carries the SAME
  -- two CREATE TABLE statements so an empty slot still gets the tables — keep the DDL
  -- textually identical in both places when changing it.
  CREATE TABLE IF NOT EXISTS project_cron_jobs (
    id          TEXT PRIMARY KEY NOT NULL,
    category    TEXT NOT NULL,
    project     TEXT NOT NULL,
    job_id      TEXT NOT NULL,
    title       TEXT NOT NULL DEFAULT '',
    schedule    TEXT NOT NULL,
    action      TEXT NOT NULL,
    enabled     INTEGER NOT NULL DEFAULT 1,
    last_run_at TEXT,
    last_status TEXT,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS project_cron_runs (
    id          TEXT PRIMARY KEY NOT NULL,
    job_key     TEXT NOT NULL,
    category    TEXT NOT NULL,
    project     TEXT NOT NULL,
    process     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'in-progress',
    started_at  TEXT NOT NULL DEFAULT (datetime('now')),
    finished_at TEXT,
    result_title TEXT,
    result_url  TEXT,
    error       TEXT,
    created_by  TEXT NOT NULL DEFAULT 'fractera-cron'
  );
  -- Automation hooks (step 187): a spoken trigger phrase → an action, bound to a
  -- project. normalized_phrase is UNIQUE across the WHOLE table (GLOBAL uniqueness):
  -- the chat/Telegram router matches one phrase to exactly one project action, so a
  -- duplicate or near-duplicate phrase in ANY project is refused (owner contract 187).
  CREATE TABLE IF NOT EXISTS project_hooks (
    id                TEXT PRIMARY KEY NOT NULL,
    category          TEXT NOT NULL,
    project           TEXT NOT NULL,
    phrase            TEXT NOT NULL,
    normalized_phrase TEXT NOT NULL UNIQUE,
    action            TEXT NOT NULL DEFAULT 'custom',
    lang              TEXT NOT NULL DEFAULT 'en',
    description       TEXT NOT NULL DEFAULT '',
    created_at        TEXT NOT NULL DEFAULT (datetime('now')),
    created_by        TEXT NOT NULL DEFAULT 'system'
  );
  -- telegram-notes automation (step 188). Key/value cursor store for the Telegram
  -- getUpdates poller (last_update_id) — one row per key, self-sufficient (no Hermes).
  CREATE TABLE IF NOT EXISTS telegram_notes_state (
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );
  -- telegram-notes records (step 188): one row per saved note / date-reminder / recall
  -- request. summary feeds the project-page results table; reminder_due (unix seconds) is
  -- set only for date reminders (type 1) and delivered flips to 1 once the push is sent.
  -- hook_action = the Action id (save|remind|recall); hook_phrase = the exact phrase that
  -- fired; condition = the declared-guard outcome (e.g. date-parsed / needs-date, NULL when
  -- the action has no condition) — the automation-ontology trace (188-R).
  CREATE TABLE IF NOT EXISTS telegram_notes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    project_slug TEXT NOT NULL DEFAULT 'telegram-notes',
    hook_action  TEXT NOT NULL,
    hook_phrase  TEXT NOT NULL DEFAULT '',
    condition    TEXT,
    chat_id      TEXT NOT NULL,
    msg_date     INTEGER,
    reminder_due INTEGER,
    delivered    INTEGER NOT NULL DEFAULT 0,
    full_text    TEXT NOT NULL DEFAULT '',
    summary      TEXT NOT NULL DEFAULT '',
    created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
`

// The architecture three streams (projects / pages / endpoints) and their tasks
// moved fully to the filesystem (README.md per entity, step 108) — these tables
// are abandoned. Drop them so no stale architecture state survives in the DB.
const DROP_LEGACY = `
  DROP TABLE IF EXISTS projects;
  DROP TABLE IF EXISTS requested_routes;
  DROP TABLE IF EXISTS route_tasks;
`

// ALTER TABLE ADD COLUMN must tolerate the "duplicate column" error: during
// `next build`, Next.js spawns multiple workers that all evaluate this
// module concurrently. Each worker reads PRAGMA table_info and decides to
// add the column, then a slower worker races against a faster one's
// successful ALTER and gets a SQLITE_ERROR. The exists-check is correct
// for steady-state but not race-safe — wrap each ALTER so duplicate-column
// is treated as success (the column already exists, that's what we wanted).
function safeAddColumn(sqlite: Database.Database, sql: string) {
  try {
    sqlite.exec(sql)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (/duplicate column/i.test(msg)) return
    throw e
  }
}

function makeLocalDb() {
  const dbPath = process.env.APP_DB_PATH ?? join(process.cwd(), "data", "app.db")
  mkdirSync(dirname(dbPath), { recursive: true })
  const sqlite = new Database(dbPath)
  sqlite.exec(SCHEMA)
  sqlite.exec(DROP_LEGACY)
  const cols = new Set(
    (sqlite.prepare('PRAGMA table_info(products)').all() as Array<{ name: string }>).map(c => c.name)
  )
  if (!cols.has('media_id'))   safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN media_id   TEXT`)
  if (!cols.has('media_url'))  safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN media_url  TEXT`)
  if (!cols.has('created_by')) safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN created_by TEXT NOT NULL DEFAULT 'system'`)
  // deployment_records.step (Product Loop) — added after the table shipped, so
  // existing DBs need the column via ALTER (CREATE TABLE IF NOT EXISTS won't).
  const depCols = new Set(
    (sqlite.prepare('PRAGMA table_info(deployment_records)').all() as Array<{ name: string }>).map(c => c.name)
  )
  if (depCols.size && !depCols.has('step')) safeAddColumn(sqlite, `ALTER TABLE deployment_records ADD COLUMN step TEXT`)
  // telegram_notes.hook_phrase / condition (automation ontology 188-R) — added after the
  // table shipped, so a live DB (rows already saved) needs them via ALTER.
  const tnCols = new Set(
    (sqlite.prepare('PRAGMA table_info(telegram_notes)').all() as Array<{ name: string }>).map(c => c.name)
  )
  if (tnCols.size && !tnCols.has('hook_phrase')) safeAddColumn(sqlite, `ALTER TABLE telegram_notes ADD COLUMN hook_phrase TEXT NOT NULL DEFAULT ''`)
  if (tnCols.size && !tnCols.has('condition'))   safeAddColumn(sqlite, `ALTER TABLE telegram_notes ADD COLUMN condition TEXT`)
  return {
    prepare(sql: string) {
      const stmt = sqlite.prepare(sql)
      return {
        async all(...args: unknown[]) { return stmt.all(...args) as Record<string, unknown>[] },
        async get(...args: unknown[]) { return (stmt.get(...args) ?? null) as Record<string, unknown> | null },
        async run(...args: unknown[]) { return stmt.run(...args) },
      }
    },
    async exec(sql: string) { sqlite.exec(sql) },
  }
}

async function initRemoteSchema() {
  await remoteDb.exec(SCHEMA.trim())
  await remoteDb.exec(DROP_LEGACY.trim())
}

export const db = (process.env.REMOTE_DATA_URL && process.env.DATA_API_KEY)
  ? (initRemoteSchema().catch(console.error), remoteDb)
  : makeLocalDb()
