import Database from "better-sqlite3"
import { entityId } from "@/lib/ids"
import { mkdirSync } from "fs"
import { join, dirname } from "path"
import { remoteDb } from "./remote-client"

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS products (
    id         TEXT PRIMARY KEY NOT NULL,
    name       TEXT NOT NULL,
    price      REAL NOT NULL DEFAULT 0,
    description TEXT,
    -- Переводы полей одной колонкой JSON: { "name": { "ru": "…" }, "description": { "ru": "…" } }.
    -- Так же переводы хранит и платформа в APP-CONFIG (ветка i18n). Колонка на
    -- язык не масштабируется: каждый новый язык требовал бы миграции схемы.
    i18n       TEXT,
    media_id   TEXT,
    media_url  TEXT,
    -- Размеры и размытая подложка картинки товара. Лежат ЗДЕСЬ, а не берутся
    -- запросом к хранилищу на каждую строку: страница каталога показывает две
    -- дюжины товаров сразу, и два десятка обращений за размерами превратили бы
    -- заранее собранную страницу в цепочку запросов. Записываются в тот момент,
    -- когда картинку прикрепляют к товару.
    media_width  INTEGER,
    media_height INTEGER,
    media_blur   TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS site_settings (
    id            INTEGER PRIMARY KEY DEFAULT 1,
    custom_domain TEXT,
    domain_status TEXT NOT NULL DEFAULT 'idle',
    domain_error  TEXT,
    updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
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
  -- The frozen starter other/starter-v3 created its own warehouses at runtime, one per
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
  -- Step 500: the Deployments table (Product Loop journal) was removed from the admin
  -- together with its panel and its API. Nothing writes or reads it any more.
  DROP TABLE IF EXISTS deployment_records;
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


// ── Два примера в пустой базе ────────────────────────────────────────────────
//
// Стартер приезжает с работающим примером, а не с пустым экраном: увидеть, как
// устроен продукт с переводами и картинкой, дешевле, чем прочитать об этом.
//
// 🔒 ТОЛЬКО В ПУСТУЮ ТАБЛИЦУ. Ни одной строки не трогаем, если каталог уже
// начат: посев, повторяющийся при каждом старте, однажды затрёт настоящий товар
// клиента, и заметят это не сразу.
//
// Переводы лежат в колонке i18n тем же способом, что и в APP-CONFIG. Картинки —
// собственные SVG в public/seed: без внешних ссылок, которые ломаются, и без
// чужих лицензий, о которых потом спорят.
const SEED = [
  {
    name: 'Apple',
    price: 1.2,
    description: 'A crisp red apple. The reference row of this catalogue: it has a name, a price, a picture and a translation — everything a product needs to be shown on a page.',
    // Картинка прикрепляется посевом (см. комментарий выше), а не путём в public/.
    media_url: null,
    i18n: {
      name: { ru: 'Яблоко' },
      description: { ru: 'Хрустящее красное яблоко. Образцовая строка каталога: у неё есть название, цена, изображение и перевод — всё, что нужно продукту, чтобы попасть на страницу.' },
    },
  },
  {
    name: 'Orange',
    price: 1.8,
    description: 'A ripe orange. The second row exists on purpose: one example shows the shape, two show what changes between them — here it is the price and the picture.',
    media_url: null,
    i18n: {
      name: { ru: 'Апельсин' },
      description: { ru: 'Спелый апельсин. Вторая строка нужна не для количества: один пример показывает форму, два показывают, что между ними меняется — здесь это цена и изображение.' },
    },
  },
]

function seedProducts(sqlite: Database.Database) {
  const row = sqlite.prepare('SELECT COUNT(*) AS n FROM products').get() as { n: number }
  if (row?.n > 0) return
  const insert = sqlite.prepare(
    'INSERT INTO products (id, name, price, description, i18n, media_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  for (const p of SEED) {
    // Тот же генератор, что и у настоящих записей: примеры обязаны выглядеть
    // как всё остальное, иначе они учат неверной форме. Приставка `seed` видна
    // в адресе и в журнале — сразу понятно, что строка пришла со стартером.
    insert.run(entityId(p.name, 'seed'), p.name, p.price, p.description, JSON.stringify(p.i18n), p.media_url, 'starter')
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
  if (!cols.has('media_width'))  safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN media_width  INTEGER`)
  if (!cols.has('media_height')) safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN media_height INTEGER`)
  if (!cols.has('media_blur'))   safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN media_blur   TEXT`)
  if (!cols.has('created_by')) safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN created_by TEXT NOT NULL DEFAULT 'system'`)
  if (!cols.has('description')) safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN description TEXT`)
  if (!cols.has('i18n'))        safeAddColumn(sqlite, `ALTER TABLE products ADD COLUMN i18n       TEXT`)

  seedProducts(sqlite)
  // (step 500) The ALTER blocks for deployment_records / telegram_notes / automation_finance
  // / automation_images are gone with their tables — those warehouses belonged to the
  // removed projects layer and to the Deployments journal.

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
