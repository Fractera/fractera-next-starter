import type Database from "better-sqlite3"
import { slugify } from "@/lib/ids"
import { mkdirSync } from "fs"
import { join, dirname } from "path"
import { remoteDb } from "./remote-client"
import { dataService } from "@/lib/fractera/data-service"

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
  -- ── Шаги разработки (владелец 2026-08-17) ─────────────────────────────────
  --
  -- 🔒 РАНЬШЕ ЭТО БЫЛИ ФАЙЛЫ: development-docs/DEVELOPMENT-STEPS/{NEW,COMPLETED}.
  -- Конвейер из двух папок работает, пока шагов десяток и читает их один агент.
  -- Он ломается на трёх вещах сразу: «покажи все незакрытые шаги этого продукта»
  -- требует прочитать КАЖДЫЙ файл; статус хранится и в имени папки, и внутри
  -- файла, то есть в двух местах; а перенос между папками — это две операции с
  -- диском, из которых вторая может не случиться.
  --
  -- Таблица отвечает на вопрос запросом и держит статус в одном месте.
  --
  -- 🔒 НОМЕР СКВОЗНОЙ ПО ВСЕМУ СЕРВЕРУ, А НЕ ВНУТРИ ПРОДУКТА. Номера шагов лежат
  -- ещё и в PRODUCTS-CONFIG оглавлением («шаги этого продукта: 12, 13»), и
  -- нумерация внутри продукта сделала бы это оглавление бессмысленным: число 12
  -- само по себе не называло бы шаг. Сквозной номер называет.
  CREATE TABLE IF NOT EXISTS development_steps (
    number      INTEGER PRIMARY KEY,
    -- Чей это шаг. 'platform' — законное значение, а не заглушка: тема, языки,
    -- офлайн-кэш принадлежат всему серверу, и навязанный им product_id был бы
    -- полем, которое врёт.
    product_id  TEXT NOT NULL DEFAULT 'platform',
    title       TEXT NOT NULL,
    -- new | in-progress | blocked | done | cancelled
    status      TEXT NOT NULL DEFAULT 'new',
    -- optional | mandatory | critical
    importance  TEXT NOT NULL DEFAULT 'mandatory',
    -- work | decomposition. Шаг декомпозиции — единственный на продукт, и его
    -- ищут запросом, а не по совпадению заголовка: строка, по которой сверяются,
    -- переживёт ровно до первой правки формулировки.
    kind        TEXT NOT NULL DEFAULT 'work',
    -- Слаги кейсов, ради которых шаг существует, JSON-массивом. Шаг, не
    -- служащий ни одному кейсу, — это работа, которую никто не заказывал.
    cases       TEXT,
    -- Задание: что сделать. Пишется при создании и правится на этапе
    -- перепроверки (devStatus = revision).
    plan        TEXT,
    -- Отчёт: что вышло. Пусто, пока шаг не закрыт.
    result      TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
  CREATE INDEX IF NOT EXISTS development_steps_product ON development_steps (product_id, status);
  CREATE TABLE IF NOT EXISTS site_settings (
    id            INTEGER PRIMARY KEY DEFAULT 1,
    custom_domain TEXT,
    domain_status TEXT NOT NULL DEFAULT 'idle',
    domain_error  TEXT,
    updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );

  -- ── Telegram Desk ─────────────────────────────────────────────────────────
  --
  -- ОБРАЗЕЦ ПРОДУКТА, а не платформенная таблица. Он приезжает в стартере как
  -- приезжает блог: агент клиента копирует УСТРОЙСТВО под своё дело — чеки,
  -- места, заявки, — а не пользуется этим как готовым сервисом.
  --
  -- 🔒 ПРЕФИКС "tgdesk_", А НЕ "<id>_". Закон продуктов велит называть таблицы
  -- по вечному "id" из досье, но у образца в стартере досье ещё нет: владелец
  -- заводит продукт в панели уже на своём сервере. Отступление названо вслух и
  -- живёт ровно до регистрации; зарегистрировал — таблицы переименовываются
  -- шагом, а не молча.
  CREATE TABLE IF NOT EXISTS tgdesk_messages (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Время В СЕКУНДАХ, целым числом: по нему считают «сколько ушло на встречи»
    -- и режут периоды. Строка ISO рядом — для человека и для сортировки в
    -- браузере базы; считать по ней нельзя.
    at_unix       INTEGER NOT NULL,
    at            TEXT    NOT NULL,
    -- in | out. Ответ продукта — такая же строка, иначе история однобока и
    -- «последние двадцать сообщений» показывают только одну сторону разговора.
    direction     TEXT    NOT NULL,
    channel       TEXT    NOT NULL DEFAULT 'telegram',
    chat_id       TEXT,
    who           TEXT,
    -- 🔒 Идентификатор сообщения В КАНАЛЕ. Дверь идемпотентна по нему: служба
    -- повторит доставку, если приложение не ответило вовремя, и без этого
    -- ключа один голос лёг бы в базу дважды.
    external_id   TEXT,
    -- text | voice — чем это БЫЛО. Расшифрованный голос ниже по потоку
    -- неотличим от печатного текста, и только здесь видно, что человек говорил.
    raw_kind      TEXT    NOT NULL DEFAULT 'text',
    text          TEXT    NOT NULL DEFAULT '',
    -- Пересказ модели. Пусто — разбор ещё не дошёл или не удался; это законное
    -- состояние, а не признак поломки.
    ai_summary    TEXT,
    -- Гео и род вложения живут ЗДЕСЬ, потому что у сообщения они ровно одни.
    lat           REAL,
    lon           REAL,
    object_type   TEXT,
    -- Флаг, ради которого не нужно перечитывать текст: «покажи траты» становится
    -- условием SQL, а не прогоном модели по всей истории.
    has_financial INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
  CREATE UNIQUE INDEX IF NOT EXISTS tgdesk_messages_external ON tgdesk_messages (channel, external_id);
  CREATE INDEX IF NOT EXISTS tgdesk_messages_time ON tgdesk_messages (at_unix);
  CREATE INDEX IF NOT EXISTS tgdesk_messages_money ON tgdesk_messages (has_financial, at_unix);

  -- 🔒 СВЯЗЬ МНОГИЕ-КО-МНОГИМ, А НЕ КОЛОНКИ В ГЛАВНОЙ ТАБЛИЦЕ. Одно сообщение
  -- несёт три фотографии и голос: три записи медиатеки, один вектор, один
  -- документ графа. Колонка "media_id" ломается на второй фотографии, а эта
  -- таблица держит любое их число и остаётся читаемой.
  --
  -- "ref" — то, чем склад отвечает, и у каждого оно СВОЁ: медиатека даёт ИМЯ
  -- файла (id разный на каждом сервере), векторный склад — id записи, граф —
  -- track_id. Одно поле на три склада законно ровно потому, что ссылку всегда
  -- читают вместе с "kind".
  CREATE TABLE IF NOT EXISTS tgdesk_artifacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    kind       TEXT    NOT NULL,          -- media | vector | rag
    ref        TEXT    NOT NULL,
    note       TEXT,
    created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
  CREATE INDEX IF NOT EXISTS tgdesk_artifacts_message ON tgdesk_artifacts (message_id);
  CREATE UNIQUE INDEX IF NOT EXISTS tgdesk_artifacts_unique ON tgdesk_artifacts (message_id, kind, ref);

  -- СМЫСЛ, извлечённый из сообщения: заметка, задача, чек, место, идея. Это то,
  -- что рисуют дашборды, и то, что агент клиента переименует под своё дело.
  -- "payload" — JSON намеренно: у чека сумма и продавец, у места адрес, и
  -- заводить колонку под каждое поле значит менять схему на каждый новый род.
  CREATE TABLE IF NOT EXISTS tgdesk_entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    kind       TEXT    NOT NULL,          -- note | task | receipt | place | idea
    title      TEXT    NOT NULL DEFAULT '',
    payload    TEXT,
    created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
  CREATE INDEX IF NOT EXISTS tgdesk_entries_message ON tgdesk_entries (message_id);
  CREATE INDEX IF NOT EXISTS tgdesk_entries_kind ON tgdesk_entries (kind, created_at);

  -- Сводки за период. Существуют, чтобы дорогой проход по месяцу оплачивался
  -- ОДИН раз: второй такой же вопрос читает готовый текст. "cost_note" хранит,
  -- во что он обошёлся, — иначе никто никогда не узнает цену.
  CREATE TABLE IF NOT EXISTS tgdesk_digests (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    from_unix  INTEGER NOT NULL,
    to_unix    INTEGER NOT NULL,
    text       TEXT    NOT NULL,
    cost_note  TEXT,
    created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
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

/**
 * Тот же посев, но через слой данных.
 *
 * 🔒 ЗАЧЕМ ВТОРАЯ ФУНКЦИЯ, А НЕ ОБЩАЯ. Локальная дорога знает синхронный
 * `better-sqlite3`, удалённая — асинхронный HTTP; общего исполнителя у них нет.
 * Общий у них СПИСОК — `SEED`, и он ровно один: расходятся не механизмы, а
 * данные, и данные здесь не дублируются.
 *
 * 🔒 ПОЧЕМУ ЭТО ПОЯВИЛОСЬ (владелец, новый сервер 2026-08-19). Посев жил только
 * внутри `makeLocalDb()`. Пока приложение писало в файл, стартер приезжал с двумя
 * примерами; после перехода на слой данных (`4c21090`) каталог свежего сервера
 * стал пустым — та же асимметрия двух дорог, что и у лестницы колонок.
 *
 * 🔒 ОТКАЗ НЕ РОНЯЕТ ПРИЛОЖЕНИЕ. Посев — удобство, а не условие работы: слой
 * данных может быть ещё не поднят. Не удалось — скажем в лог и продолжим, а
 * следующий старт посеет. Тот же закон, что у посева картинок (`seed-media.mjs`).
 */
async function seedProductsRemote() {
  try {
    const row = (await remoteDb.prepare('SELECT COUNT(*) AS n FROM products').get()) as { n?: number } | null
    if (Number(row?.n ?? 0) > 0) return
    for (const p of SEED) {
      await remoteDb.prepare(
        'INSERT OR IGNORE INTO products (id, name, price, description, i18n, media_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(seedId(p.name), p.name, p.price, p.description, JSON.stringify(p.i18n), p.media_url, 'starter')
    }
  } catch (err) {
    console.error("[db] Примеры каталога не посеяны — слой данных не ответил. Причина:", err)
  }
}

function makeLocalDb() {
  // 🔒 ДРАЙВЕР ГРУЗИТСЯ ЗДЕСЬ, А НЕ ПЕРВОЙ СТРОКОЙ ФАЙЛА (2026-08-19).
  //
  // `better-sqlite3` — нативный модуль: ему нужны node-gyp и компилятор C++.
  // Импорт наверху загружал его ВСЕГДА, в том числе когда приложение работает
  // удалённой дорогой и локальная база не открывается ни разу. На Windows это
  // означало, что `npm run dev` не поднимался вовсе — у разработчика, которому
  // локальная база не нужна: его `.env.local` из панели указывает на живой слой
  // данных сервера.
  //
  // Тип берётся через `import type` и в сборку не попадает; сам драйвер
  // требуется только на локальной дороге, то есть ровно тогда, когда он нужен.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SqliteDatabase: typeof Database = require("better-sqlite3")
  const dbPath = process.env.APP_DB_PATH ?? join(process.cwd(), "data", "app.db")
  mkdirSync(dirname(dbPath), { recursive: true })
  const sqlite = new SqliteDatabase(dbPath)
  sqlite.exec(SCHEMA)
  sqlite.exec(DROP_LEGACY)

  // Лестница колонок — ОДНА на обе дороги к базе, см. `LATE_COLUMNS`.
  for (const sql of LATE_COLUMNS) safeAddColumn(sqlite, sql)

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

/**
 * Колонки, добавленные ПОСЛЕ появления своей таблицы.
 *
 * 🔒 `CREATE TABLE IF NOT EXISTS` НЕ ДОБАВЛЯЕТ КОЛОНКУ — на сервере, где таблица
 * уже есть, он молча ничего не делает. Проверено живьём 2026-08-17: `kind`
 * объявили в SCHEMA, развернули, и колонки в базе не появилось.
 *
 * Добавляем вслепую и глотаем РОВНО «колонка уже есть»: это и есть штатный
 * результат на всех серверах, кроме первого запуска. Тот же приём, что у
 * `safeAddColumn` для локального пути.
 *
 * 🔒 ЛЕСТНИЦА ОДНА НА ОБЕ ДОРОГИ К БАЗЕ (найдено падением развёртывания 2026-08-18).
 *
 * Здесь список был коротким, а колонки товаров добавлял отдельный блок ВНУТРИ
 * `makeLocalDb()` — то есть только на локальной дороге. Пока приложение писало в
 * файл, это было незаметно. Коммит `4c21090` (2026-08-17) перевёл его на слой
 * данных, лестница перестала выполняться вовсе, и слой данных начал отвечать
 * `no such column: description` на КАЖДЫЙ запрос каталога — витрина, карта сайта и
 * панель товаров разом.
 *
 * Расходятся такие пары молча: обе ветки исправны по отдельности. Поэтому список
 * ровно один, а исполнителей у него два — `makeLocalDb()` и `initRemoteSchema()`.
 * Новая колонка дописывается СЮДА и никуда больше.
 */
const LATE_COLUMNS = [
  `ALTER TABLE products ADD COLUMN media_id     TEXT`,
  `ALTER TABLE products ADD COLUMN media_url    TEXT`,
  `ALTER TABLE products ADD COLUMN media_width  INTEGER`,
  `ALTER TABLE products ADD COLUMN media_height INTEGER`,
  `ALTER TABLE products ADD COLUMN media_blur   TEXT`,
  `ALTER TABLE products ADD COLUMN created_by   TEXT NOT NULL DEFAULT 'system'`,
  `ALTER TABLE products ADD COLUMN description  TEXT`,
  `ALTER TABLE products ADD COLUMN i18n         TEXT`,
  `ALTER TABLE development_steps ADD COLUMN kind TEXT NOT NULL DEFAULT 'work'`,
]

async function initRemoteSchema() {
  await remoteDb.exec(SCHEMA.trim())
  await remoteDb.exec(DROP_LEGACY.trim())
  for (const sql of LATE_COLUMNS) {
    try {
      await remoteDb.exec(sql)
    } catch (e) {
      if (!/duplicate column/i.test(String(e))) throw e
    }
  }
  // Примеры каталога — обеими дорогами одинаково; посев идёт ПОСЛЕ лестницы,
  // иначе на старой таблице он писал бы в ещё не существующие колонки.
  await seedProductsRemote()
}

/**
 * Удалённая дорога ЖДЁТ схему, а не бежит с ней наперегонки.
 *
 * 🔒 ЗАЧЕМ. Подготовка схемы запускалась при загрузке модуля и никем не
 * дожидалась: первый же запрос уходил в слой данных ОДНОВРЕМЕННО с созданием
 * таблиц. На пустой базе это лотерея — успела лестница колонок или нет, — а
 * проигрыш выглядит как «no such column» в случайном месте и не воспроизводится.
 *
 * Обещание одно на процесс: каждый вызов дожидается ЕГО, поэтому подготовка
 * по-прежнему выполняется единожды.
 */
function awaitingSchema(ready: Promise<unknown>): typeof remoteDb {
  const stmt = (sql: string) => {
    const inner = remoteDb.prepare(sql)
    return {
      async all(...args: unknown[]) { await ready; return inner.all(...args) },
      async get(...args: unknown[]) { await ready; return inner.get(...args) },
      async run(...args: unknown[]) { await ready; return inner.run(...args) },
    }
  }
  return {
    prepare: stmt,
    async exec(sql: string) { await ready; return remoteDb.exec(sql) },
  }
}

// 🔒 ВЫБОР ХРАНИЛИЩА СПРАШИВАЕТ КЛЮЧ У ОБЩЕГО РЕШАТЕЛЯ (2026-08-17).
//
// Здесь стояло `process.env.DATA_API_KEY` — имя, которого в окружении сервера
// нет: установщик пишет `DATA_SECRET`. Условие никогда не выполнялось, и КАЖДЫЙ
// сервер работал с локальным SQLite вместо слоя данных, ни разу об этом не
// сказав: обе ветки исправны, отличается только адресат записи.
//
// Адрес по-прежнему обязателен явно. `dataService()` подставляет `localhost:3300`
// по умолчанию, и полагаться на это умолчание здесь нельзя: на машине
// разработчика без `REMOTE_DATA_URL` приложение начало бы стучаться в
// несуществующую службу вместо того, чтобы честно открыть локальный файл.
export const db = (process.env.REMOTE_DATA_URL && dataService().key)
  ? awaitingSchema(initRemoteSchema().catch(err => {
      // Слой данных недоступен или отказал — приложение продолжает работать и
      // отвечает заглушкой (см. `lib/catalogue.ts`). Молчать здесь нельзя:
      // без этой строки причина пустой витрины не называется нигде.
      console.error("[db] Схема в слое данных не подготовлена:", err)
    }))
  : makeLocalDb()
