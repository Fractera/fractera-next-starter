import Database from "better-sqlite3"
import { slugify } from "@/lib/ids"
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
      name: { ru: 'Яблоко', es: 'Manzana', fr: 'Pomme', it: 'Mela', de: 'Apfel', pt: 'Maçã', pl: 'Jabłko', tr: 'Elma', nl: 'Appel' },
      description: {
        ru: 'Хрустящее красное яблоко. Образцовая строка каталога: у неё есть название, цена, изображение и перевод — всё, что нужно продукту, чтобы попасть на страницу.',
        es: 'Una manzana roja y crujiente. La fila de referencia de este catálogo: tiene nombre, precio, imagen y traducción — todo lo que un producto necesita para aparecer en una página.',
        fr: 'Une pomme rouge et croquante. La ligne de référence de ce catalogue : elle a un nom, un prix, une image et une traduction — tout ce dont un produit a besoin pour apparaître sur une page.',
        it: "Una mela rossa e croccante. La riga di riferimento di questo catalogo: ha un nome, un prezzo, un'immagine e una traduzione — tutto ciò di cui un prodotto ha bisogno per comparire su una pagina.",
        de: 'Ein knackiger roter Apfel. Die Referenzzeile dieses Katalogs: Sie hat einen Namen, einen Preis, ein Bild und eine Übersetzung — alles, was ein Produkt braucht, um auf einer Seite angezeigt zu werden.',
        pt: 'Uma maçã vermelha e estaladiça. A linha de referência deste catálogo: tem nome, preço, imagem e tradução — tudo o que um produto precisa para aparecer numa página.',
        pl: 'Chrupiące czerwone jabłko. Wzorcowy wiersz tego katalogu: ma nazwę, cenę, obraz i tłumaczenie — wszystko, czego produkt potrzebuje, żeby trafić na stronę.',
        tr: 'Çıtır kırmızı bir elma. Bu kataloğun referans satırı: bir adı, bir fiyatı, bir görseli ve bir çevirisi var — bir ürünün bir sayfada gösterilmesi için gereken her şey.',
        nl: 'Een knapperige rode appel. De referentierij van deze catalogus: hij heeft een naam, een prijs, een afbeelding en een vertaling — alles wat een product nodig heeft om op een pagina te verschijnen.',
      },
    },
  },
  {
    name: 'Orange',
    price: 1.8,
    description: 'A ripe orange. The second row exists on purpose: one example shows the shape, two show what changes between them — here it is the price and the picture.',
    media_url: null,
    i18n: {
      name: { ru: 'Апельсин', es: 'Naranja', fr: 'Orange', it: 'Arancia', de: 'Orange', pt: 'Laranja', pl: 'Pomarańcza', tr: 'Portakal', nl: 'Sinaasappel' },
      description: {
        ru: 'Спелый апельсин. Вторая строка нужна не для количества: один пример показывает форму, два показывают, что между ними меняется — здесь это цена и изображение.',
        es: 'Una naranja madura. La segunda fila existe a propósito: un ejemplo muestra la forma, dos muestran qué cambia entre ellos — aquí es el precio y la imagen.',
        fr: 'Une orange mûre. La seconde ligne existe volontairement : un exemple montre la forme, deux montrent ce qui change entre eux — ici c\'est le prix et l\'image.',
        it: 'Un\'arancia matura. La seconda riga esiste apposta: un esempio mostra la forma, due mostrano cosa cambia tra loro — qui è il prezzo e l\'immagine.',
        de: 'Eine reife Orange. Die zweite Zeile gibt es nicht wegen der Menge: Ein Beispiel zeigt die Form, zwei zeigen, was sich zwischen ihnen ändert — hier sind es der Preis und das Bild.',
        pt: 'Uma laranja madura. A segunda linha existe de propósito: um exemplo mostra a forma, dois mostram o que muda entre eles — aqui é o preço e a imagem.',
        pl: 'Dojrzała pomarańcza. Drugi wiersz istnieje celowo: jeden przykład pokazuje kształt, dwa pokazują, co się między nimi zmienia — tutaj to cena i obraz.',
        tr: 'Olgun bir portakal. İkinci satır sayı için değil, bilinçli olarak var: bir örnek şekli gösterir, iki örnek aralarında neyin değiştiğini gösterir — burada bu, fiyat ve görsel.',
        nl: 'Een rijpe sinaasappel. De tweede rij bestaat bewust, niet vanwege het aantal: het ene voorbeeld toont de vorm, twee tonen wat er tussen hen verandert — hier is dat de prijs en de afbeelding.',
      },
    },
  },
]

/**
 * Идентификатор посевной строки — ПОСТОЯННЫЙ, а не случайный (владелец 2026-08-14,
 * по факту дублей на живом сервере).
 *
 * 🔒 ЧТО БЫЛО НЕ ТАК. Здесь стоял `entityId(p.name, 'seed')` — тот же генератор,
 * что у настоящих товаров, со случайным хвостом: `seed-apple-6EM2RM`. Настоящей
 * записи такой хвост нужен (двух «Apple» создать надо, и переименование не
 * должно ломать ссылку), а посеву он ВРЕДЕН: при повторной вставке рождается
 * НОВАЯ строка вместо конфликта первичного ключа. На сервере владельца это дало
 * ровно то, что он и увидел, — по два яблока и апельсина:
 *
 *   seed-apple-6EM2RM · seed-apple-T4VrcM · seed-orange-7FvyJo · seed-orange-O3MJwx
 *
 * Защита `COUNT(*) > 0` от этого не спасает: она не атомарна (два процесса,
 * стартующие одновременно, оба видят пустую таблицу) и вообще не срабатывает,
 * когда база создаётся заново рядом с уже наполненной.
 *
 * Постоянный идентификатор делает дубль ФИЗИЧЕСКИ НЕВОЗМОЖНЫМ: вторая вставка
 * упирается в первичный ключ, и `INSERT OR IGNORE` молча её отбрасывает. Это
 * защита на уровне базы, а не на уровне удачного порядка выполнения.
 *
 * Приставка `seed` сохранена: она видна в адресе и в журнале, поэтому сразу
 * понятно, что строка пришла со стартером, а не заведена клиентом.
 */
const seedId = (name: string) => `seed-${slugify(name)}`

function seedProducts(sqlite: Database.Database) {
  // Проверка остаётся первой линией: она дешёвая и не даёт трогать каталог,
  // который клиент уже начал вести. Но теперь она не единственная — за ней
  // стоит первичный ключ, который держит, даже если проверка не сработала.
  const row = sqlite.prepare('SELECT COUNT(*) AS n FROM products').get() as { n: number }
  if (row?.n > 0) return
  const insert = sqlite.prepare(
    'INSERT OR IGNORE INTO products (id, name, price, description, i18n, media_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  for (const p of SEED) {
    insert.run(seedId(p.name), p.name, p.price, p.description, JSON.stringify(p.i18n), p.media_url, 'starter')
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
