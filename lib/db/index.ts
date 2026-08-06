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
`

// The architecture three streams (projects / pages / endpoints) and their tasks
// moved fully to the filesystem (README.md per entity, step 108) — these tables
// are abandoned. Drop them so no stale architecture state survives in the DB.
const DROP_LEGACY = `
  DROP TABLE IF EXISTS projects;
  DROP TABLE IF EXISTS requested_routes;
  DROP TABLE IF EXISTS route_tasks;
  -- step 205 §C: hooks removed (one bot per automation). Drop the global phrase registry so no
  -- stale hook rows survive on an upgraded server; routing no longer reads this table.
  DROP TABLE IF EXISTS project_hooks;
  -- Step 500: the projects/automations layer was removed from the product, and with it
  -- every warehouse it owned. They are dropped here so an upgraded server does not keep
  -- dozens of empty tables that make the DB browser unreadable.
  DROP TABLE IF EXISTS project_cron_jobs;
  DROP TABLE IF EXISTS project_cron_runs;
  DROP TABLE IF EXISTS automation_finance_types;
  DROP TABLE IF EXISTS automation_finance;
  DROP TABLE IF EXISTS automation_events;
  DROP TABLE IF EXISTS automation_images;
  DROP TABLE IF EXISTS automation_geo;
  DROP TABLE IF EXISTS automation_calendar_tokens;
  DROP TABLE IF EXISTS automation_catalog_index;
  DROP TABLE IF EXISTS automation_diagram_edges;
  DROP TABLE IF EXISTS automation_edge_versions;
  DROP TABLE IF EXISTS automation_edges;
  DROP TABLE IF EXISTS automation_entities;
  DROP TABLE IF EXISTS automation_entity_order;
  DROP TABLE IF EXISTS automation_instances;
  DROP TABLE IF EXISTS automation_lifecycle;
  DROP TABLE IF EXISTS automation_node_versions;
  DROP TABLE IF EXISTS automation_nodes;
  DROP TABLE IF EXISTS automation_quiz;
  DROP TABLE IF EXISTS automation_quiz_phase;
  DROP TABLE IF EXISTS automation_quiz_turns;
  DROP TABLE IF EXISTS automation_run_nodes;
  DROP TABLE IF EXISTS automation_runs;
  DROP TABLE IF EXISTS automation_schedule;
  DROP TABLE IF EXISTS automation_scheduled_requests;
  DROP TABLE IF EXISTS automation_use_cases;
  DROP TABLE IF EXISTS automation_use_cases_review;
  DROP TABLE IF EXISTS record_images;
  DROP TABLE IF EXISTS record_geo;
  DROP TABLE IF EXISTS subjects;
  DROP TABLE IF EXISTS subject_events;
  DROP TABLE IF EXISTS telegram_notes;
  DROP TABLE IF EXISTS telegram_notes_state;
  DROP TABLE IF EXISTS dashboard_rows;
  DROP TABLE IF EXISTS entity_history;
  DROP TABLE IF EXISTS entity_summary;
  DROP TABLE IF EXISTS entity_transport;
  DROP TABLE IF EXISTS entity_warning;
  DROP TABLE IF EXISTS global_automation;
  DROP TABLE IF EXISTS wave_snooze;
  -- The frozen starter `other/starter-v3` created its own warehouses at runtime, one per
  -- tab, prefixed with the automation id. The starter is gone; so are its tables.
  DROP TABLE IF EXISTS other_starter_v3__analytics;
  DROP TABLE IF EXISTS other_starter_v3__calendar;
  DROP TABLE IF EXISTS other_starter_v3__calendar_delivery;
  DROP TABLE IF EXISTS other_starter_v3__chat_state;
  DROP TABLE IF EXISTS other_starter_v3__conversation;
  DROP TABLE IF EXISTS other_starter_v3__database;
  DROP TABLE IF EXISTS other_starter_v3__evolution_feedback;
  DROP TABLE IF EXISTS other_starter_v3__evolution_proposal;
  DROP TABLE IF EXISTS other_starter_v3__evolution_version;
  DROP TABLE IF EXISTS other_starter_v3__links;
  DROP TABLE IF EXISTS other_starter_v3__map;
  DROP TABLE IF EXISTS other_starter_v3__route;
  DROP TABLE IF EXISTS other_starter_v3__route_stop;
  DROP TABLE IF EXISTS other_starter_v3__toast;
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
  // (step 500) The ALTER blocks for telegram_notes / automation_finance / automation_images
  // are gone with their tables — those warehouses belonged to the removed projects layer.

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
