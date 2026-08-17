#!/usr/bin/env node
// MCP-сервер проекта — одна дверь к ДВУМ сущностям: пользовательским кейсам и
// шагам разработки.
//
// 🔒 ПОЧЕМУ ОНИ В ОДНОМ СЕРВЕРЕ. Между ними не связь, а ПЕРЕХОД: подтверждённый
// кейс превращается в очередь шагов, и каждый шаг обязан назвать кейсы, ради
// которых существует. Разведи их по двум серверам — и переход окажется ничьим,
// а «шаг без кейса» станет невозможно даже заметить. Раньше файл назывался
// `development-steps.mjs`; имя сменилось вместе с зоной ответственности.
//
// 🔒 ХРАНЯТСЯ ОНИ ПО-РАЗНОМУ, И ЭТО НЕ НЕПОСЛЕДОВАТЕЛЬНОСТЬ. Кейс — содержание,
// которое человек читает и подтверждает: он лежит ФАЙЛОМ в репозитории, едет
// через git и виден владельцу в редакторе. Шаг — состояние очереди, к которому
// ходят с вопросом «что открыто у этого продукта»: он лежит СТРОКОЙ в таблице.
// Кейс, спрятанный в базу, исчезает из поля зрения владельца; шаг, разложенный
// по файлам, требует прочитать все, чтобы ответить на один вопрос.
// **Этот сервер объединяет ДОСТУП, а не хранение.**
//
// 🔒 ЗАЧЕМ ОН СУЩЕСТВУЕТ. Шаги переехали из папок в базу (владелец 2026-08-17), а
// база живёт в слое данных на сервере. Агент работает в ЛОКАЛЬНОМ клоне владельца
// и панель управления физически не видит: она лежит вне репозитория пользователя.
// Без этой двери «шаги в базе» означало бы «шаги, до которых агент не дотянется».
//
// 🔒 ПОДТВЕРЖДАЕТ КЕЙС ТОЛЬКО ВЛАДЕЛЕЦ, И ЭТОГО ИНСТРУМЕНТА ЗДЕСЬ НЕТ ВОВСЕ
// (решение владельца 2026-08-17). Агент вправе добавить кейс, переписать его и
// снять подтверждение. Вернуть зелёный — нет: гейт кейсов существует ровно
// потому, что неподтверждённый кейс есть догадка модели, и модель, подтверждающая
// собственную догадку, обращает гейт в украшение.
//
// 🔒 БЕЗ ЕДИНОЙ ЗАВИСИМОСТИ И БЕЗ ЗАПУЩЕННОГО ПРИЛОЖЕНИЯ. MCP поверх stdio — это
// JSON-RPC 2.0 построчно; SDK ради этого тянуть в стартер незачем, а требовать
// поднятого `next dev` значило бы, что шаги не читаются на холодном клоне. Ходим
// в слой данных тем же протоколом, что и `lib/db/remote-client.ts`, а без него —
// в локальный SQLite тем же файлом, что и приложение.
//
// 🔒 `initialize` ОБЯЗАТЕЛЕН. Клиент MCP делает его ПЕРЕД `tools/list`; сервер,
// отвечающий «Method not found: initialize», регистрирует ноль инструментов и
// молчит об этом. Проект это уже проходил — `reports/errors/
// mcp-missing-initialize-handshake.md`. Прямой вызов `tools/list` руками
// доказательством НЕ является: он этот шаг не делает.

import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const PROTOCOL = "2024-11-05"

// ── Окружение: читаем .env.local сами ────────────────────────────────────────
// Ни `dotenv`, ни загрузчика Next здесь нет: сервер запускается клиентом MCP
// напрямую, без сборки и без приложения.
function readEnvFile(file) {
  try {
    for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
      if (!m) continue
      const value = m[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[m[1]]) process.env[m[1]] = value
    }
  } catch { /* файла нет — работаем на том, что уже в окружении */ }
}
readEnvFile(path.join(ROOT, ".env.local"))

// 🔒 ИМЯ КЛЮЧА — `DATA_SECRET`, и `DATA_API_KEY` остаётся запасным (2026-08-17).
// Установщик пишет в слот `DATA_SECRET`; `DATA_API_KEY` встречается только в
// файле, который панель выдаёт на машину разработчика. Спросив одно имя, сервер
// молча ушёл бы в локальный SQLite и показал бы владельцу ЧУЖУЮ пустую очередь
// шагов вместо настоящей. Порядок тот же, что в `lib/fractera/data-service.ts`.
const REMOTE_DATA_URL = process.env.REMOTE_DATA_URL
const DATA_API_KEY = process.env.DATA_SECRET || process.env.DATA_API_KEY

// ── Доступ к базе: тот же выбор, что делает приложение ───────────────────────
//
// Есть адрес слоя данных и ключ — идём туда; нет — в локальный SQLite. Ровно та
// же развилка, что в `lib/db/index.ts`, и повторена она намеренно: этот файл
// обязан работать без сборки, а значит не может импортировать TypeScript.
// `better-sqlite3` подключается ЛЕНИВО, чтобы удалённый режим не падал на
// машине, где нативный модуль не собрался.
let localDb = null

/**
 * 🔒 НЕ ВЫДУМЫВАТЬ БАЗУ ТАМ, ГДЕ ЕЁ НЕТ (владелец 2026-08-17, по разбору прогона).
 *
 * ЧТО БЫЛО НЕ ТАК. Ветка локального SQLite делала `mkdirSync` + `new Database()`,
 * то есть СОЗДАВАЛА пустой файл на пустом месте. Человек, склонировавший
 * репозиторий и забывший положить `.env.local`, получал не отказ, а честное
 * «открытых шагов нет» — над только что рождённой пустышкой. Агент докладывал
 * владельцу, что работы не запланировано, и оба верили.
 *
 * Отрицательный контроль снят до правки: `steps_next` в чистой папке возвращал
 * `{"done":true,"note":"no open steps"}` и оставлял после себя `data/app.db`.
 *
 * Пустой ответ неотличим от правды — именно поэтому он опаснее ошибки. Дверь к
 * данным не имеет права создавать данные: файл базы заводит ПРИЛОЖЕНИЕ при
 * сборке, а этот сервер только читает и пишет в уже существующее.
 */
class NoDataAccess extends Error {
  constructor(code, note) {
    super(code)
    this.code = code
    this.note = note
  }
}

function dataAccessProblem() {
  if (REMOTE_DATA_URL && !DATA_API_KEY) {
    return new NoDataAccess(
      "data_key_missing",
      "REMOTE_DATA_URL is set but the data-layer key is not. Download .env.local in the control panel "
      + "(Env Variables) and put it in the project root — it carries DATA_SECRET.",
    )
  }
  if (!REMOTE_DATA_URL && !DATA_API_KEY) {
    const dbPath = process.env.APP_DB_PATH ?? path.join(ROOT, "data", "app.db")
    if (!fs.existsSync(dbPath)) {
      return new NoDataAccess(
        "no_data_access",
        "No connection to the project's data: neither REMOTE_DATA_URL + key, nor a local database file. "
        + "Download .env.local in the control panel (Env Variables) and put it in the project root. "
        + "An empty answer here would look exactly like 'no work planned', which is why this refuses instead.",
      )
    }
  }
  return null
}

async function sql(query, params = []) {
  const problem = dataAccessProblem()
  if (problem) throw problem

  if (REMOTE_DATA_URL && DATA_API_KEY) {
    const res = await fetch(`${REMOTE_DATA_URL}/db/migrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Data-Secret": DATA_API_KEY },
      body: JSON.stringify({ sql: query, params }),
    })
    if (!res.ok) throw new Error(`Data service ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return { rows: data.rows ?? [], changes: data.changes ?? 0 }
  }
  if (!localDb) {
    const { default: Database } = await import("better-sqlite3")
    const dbPath = process.env.APP_DB_PATH ?? path.join(ROOT, "data", "app.db")
    // 🔒 `fileMustExist` И НИКАКОГО `mkdirSync`: файл базы заводит приложение при
    // сборке, дверь к данным — только открывает существующий. Ровно здесь и
    // рождалась пустышка, которую агент читал как «работы не запланировано».
    localDb = new Database(dbPath, { fileMustExist: true })
  }
  // 🔒 СХЕМА ИЗ НЕСКОЛЬКИХ ОПЕРАТОРОВ ИДЁТ ЧЕРЕЗ `exec`, А НЕ `prepare`
  // (поймано проверкой конвейером 2026-08-17).
  //
  // `prepare()` принимает РОВНО ОДИН оператор и отвечает «contains more than one
  // statement». `LOG_SCHEMA` — таблица плюс индекс, то есть два; в удалённом
  // режиме слой данных пропускает DDL через `exec` и всё работало, а локально
  // журнал не создавался вовсе.
  //
  // Хуже отказа было то, что вызывающий глотал его: запись перехода — «лучшее
  // усилие», и молчание выглядело как «журнал пуст, продукт не двигался».
  // Ровно тот вид пустоты, против которого написан этот шаг.
  const multi = !/^\s*select/i.test(query) && /;\s*\S/.test(query.trim().replace(/;\s*$/, ""))
  if (multi) { localDb.exec(query); return { rows: [], changes: 0 } }

  const stmt = localDb.prepare(query)
  if (/^\s*select/i.test(query)) return { rows: stmt.all(...params), changes: 0 }
  const info = stmt.run(...params)
  return { rows: [], changes: info.changes }
}

// 🔒 Таблица создаётся и здесь тоже. Приложение объявляет её в `SCHEMA`, но агент
// приходит в клон, где `next build` мог не запускаться ни разу, — а «таблицы нет»
// он прочитает как «шагов нет», что неправда другого рода.
// 🔒 ЖУРНАЛ ЖИЗНЕННОГО ЦИКЛА ПРОДУКТА (владелец 2026-08-17).
//
// ЗАЧЕМ. `devStatus` в реестре — это СНИМОК: он отвечает «где мы сейчас» и не
// отвечает «как мы сюда пришли». Одноцикловую задачу можно провести и так, но
// настоящая разработка идёт десятками циклов и по нескольким продуктам сразу, и
// тогда снимок бесполезен: он не помнит, сколько раз возвращались на доработку,
// кто двинул этап и каким шагом.
//
// Проверено на себе в тот же день: я показывал владельцу снимки, а восстановить
// историю переходов оказалось нечем — журнала не было, коммитов не было.
//
// 🔒 В БАЗЕ, А НЕ ПОЛЕМ В КОНФИГЕ. `PRODUCTS-CONFIG` читается приложением на
// КАЖДЫЙ запрос; растущая история разбиралась бы целиком всю жизнь проекта.
const LOG_SCHEMA = `
  CREATE TABLE IF NOT EXISTS product_status_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id  TEXT NOT NULL,
    from_status TEXT,
    to_status   TEXT NOT NULL,
    -- Шаг-причина. Пусто законно: подтверждение кейса шагом не является.
    step_number INTEGER,
    -- panel | agent | owner — кто двинул. Без этого «этап сменился» не отвечает
    -- на вопрос, сам он сменился или его сменили.
    actor       TEXT NOT NULL DEFAULT 'agent',
    note        TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
  CREATE INDEX IF NOT EXISTS product_status_log_product ON product_status_log (product_id, id);
`

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS development_steps (
    number      INTEGER PRIMARY KEY,
    product_id  TEXT NOT NULL DEFAULT 'platform',
    title       TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'new',
    importance  TEXT NOT NULL DEFAULT 'mandatory',
    kind        TEXT NOT NULL DEFAULT 'work',
    cases       TEXT,
    plan        TEXT,
    result      TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
`

/**
 * Колонка `kind` появилась позже таблицы, поэтому её добавляют отдельно.
 *
 * 🔒 `CREATE TABLE IF NOT EXISTS` НЕ ДОБАВЛЯЕТ КОЛОНКУ в существующую таблицу —
 * он молча ничего не делает. Сервер, где шаги завели вчера, остался бы без `kind`,
 * и «шаг декомпозиции уже есть?» отвечало бы ошибкой вместо ответа.
 *
 * Проверять наличие через `PRAGMA table_info` нельзя: слой данных считает `PRAGMA`
 * командой DDL и возвращает `{ok:true}` без строк. Поэтому добавляем вслепую и
 * глотаем РОВНО «колонка уже есть» — этот приём уже стоит в `safeAddColumn`
 * гостевого приложения по той же причине.
 */
async function ensureKindColumn() {
  try {
    await sql(`ALTER TABLE development_steps ADD COLUMN kind TEXT NOT NULL DEFAULT 'work'`)
  } catch (e) {
    if (!/duplicate column/i.test(String(e?.message ?? e))) throw e
  }
}

/**
 * 🔒 ИМЯ ШАГА — ОТ ШЕСТИ ДО ДВЕНАДЦАТИ СЛОВ, И ЭТО ПРОВЕРЯЕТ КОД (владелец
 * 2026-08-17: «число — шесть или восемь слов, максимально подробно описывающих
 * шаг»).
 *
 * Просьба в описании инструмента исполнением не является — проект платил за этот
 * урок отдельно (`reports/patterns/model-rule-needs-code-check.md`). Короткое имя
 * («fix bug», «catalogue») через месяц не отвечает ни на один вопрос, а очередь
 * из тридцати таких имён нечитаема вовсе.
 *
 * Верхняя граница не педантизм: имя длиннее двенадцати слов — это уже задание, а
 * заданию отведено поле `plan`, где его прочитают целиком.
 */
const TITLE_MIN = 6
const TITLE_MAX = 12
function titleProblem(title) {
  const words = String(title).trim().split(/\s+/).filter(Boolean)
  if (words.length < TITLE_MIN || words.length > TITLE_MAX) {
    return {
      error: "title_shape",
      words: words.length,
      required: `${TITLE_MIN}-${TITLE_MAX} words describing the step in detail`,
      example: "build minimal working skeleton with routes api and stubbed navigation",
    }
  }
  return null
}

const STATUSES = ["new", "in-progress", "blocked", "done", "cancelled"]
const IMPORTANCE = ["optional", "mandatory", "critical"]

// ── Пользовательские кейсы: файлы продукта ───────────────────────────────────
//
// 🔒 ФОРМАТ ПОВТОРЁН ПОБАЙТНО ИЗ ПАНЕЛИ (`bridges/app/lib/use-cases-store.ts`,
// `renderCase`/`parseCase`). Это единственное место проекта, где один формат
// пишут ДВА независимых кода: панель на сервере и этот сервер в клоне владельца.
// Разъедутся они молча — панель просто перестанет видеть статус кейса, который
// написал агент, и наоборот. Меняя одну сторону, меняй обе в том же шаге.

const CASE_MARKER = "fractera:use-case v1"
const casesDir = (pid) => path.join(ROOT, "development-docs", "USE-CASES", pid, "CASES")

function parseCase(id, text) {
  const title = (/^#\s+(.+)$/m.exec(text)?.[1] ?? id).trim()
  const status = /\*\*status:\*\*\s*confirmed/i.test(text) ? "confirmed" : "draft"
  const confirmedAt = /\*\*confirmed:\*\*\s*(\S+)/i.exec(text)?.[1] ?? null
  const summary = text.split(/\n\s*\n/).slice(1).filter(p => !p.includes("**status:**")).join("\n\n").trim()
  return { id, title, summary, status, confirmedAt: confirmedAt === "—" ? null : confirmedAt }
}

function renderCase(c) {
  return `# ${c.title}\n\n<!-- ${CASE_MARKER} -->\n**status:** ${c.status}\n**confirmed:** ${c.confirmedAt ?? "—"}\n\n${String(c.summary ?? "").trim()}\n`
}

/**
 * 🔒 ИМЯ ФАЙЛА КЕЙСА — ТОЛЬКО ЛАТИНИЦА. Всё, что лежит в машинном слое, агент
 * грузит на старте каждой сессии, и второй язык здесь оплачивается токенами
 * вечно. Слова владельца живут ВНУТРИ файла — заголовок и сценарий он читает и
 * подтверждает сам; имя файла ему читать незачем.
 */
function slugify(slug) {
  return String(slug ?? "").toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 48) || "case"
}

function listCaseFiles(pid) {
  try {
    return fs.readdirSync(casesDir(pid)).filter(f => f.endsWith(".md")).sort()
  } catch {
    return []
  }
}

function readCases(pid) {
  return listCaseFiles(pid).map(f =>
    parseCase(f.replace(/\.md$/, ""), fs.readFileSync(path.join(casesDir(pid), f), "utf-8")))
}

/**
 * Какой продукт имеется в виду.
 *
 * 🔒 ОДИН ПРОДУКТ — НЕ СПРАШИВАЕМ, НЕСКОЛЬКО — ТРЕБУЕМ НАЗВАТЬ. Умолчание «первый
 * в реестре» работает ровно до второго продукта, после чего молча правит чужие
 * кейсы, и заметит это владелец не сегодня, а когда сломается соседний продукт.
 */
const brief = (p) => ({ id: p.id, title: p.title, route: p.route })

function resolveProduct(requested) {
  let products = []
  try {
    products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")).products ?? []
  } catch { /* реестра нет — отвечаем об этом честно ниже */ }
  if (!products.length) return { error: "no_products", note: "PRODUCTS-CONFIG holds no product yet" }
  if (requested) {
    const found = products.find(p => p.id === requested)
    // 🔒 ОТКАЗ НАЗЫВАЕТ ПРОДУКТЫ ИМЕНАМИ, А НЕ КОДАМИ. Владелец говорит «магазин»,
    // а инструменты принимают `p2`; голый список кодов не даёт сопоставить одно с
    // другим, и агент застревает на ровном месте, имея всё нужное под рукой.
    return found ? { product: found } : { error: "unknown_product", known: products.map(brief) }
  }
  if (products.length === 1) return { product: products[0] }
  return { error: "product_required", known: products.map(brief) }
}

// ── Оглавление продукта: номера шагов в PRODUCTS-CONFIG ──────────────────────
//
// 🔒 ОГЛАВЛЕНИЕ ОБНОВЛЯЕТСЯ ТЕМ ЖЕ ДЕЙСТВИЕМ, ЧТО И ТАБЛИЦА. Список, который
// поддерживают руками, расходится с истиной в первую же неделю — и расходится
// молча, потому что никто его не перечитывает. Здесь он производное: шаг завели —
// номер появился.
const PRODUCTS_FILE = path.join(ROOT, "PRODUCTS-CONFIG", "products-config.json")

function patchProduct(productId, patch) {
  if (!productId || productId === "platform") return
  try {
    const config = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"))
    const product = (config.products ?? []).find(p => p.id === productId)
    if (!product) return
    Object.assign(product, patch(product))
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(config, null, 2) + "\n", "utf-8")
  } catch { /* конфига нет — оглавление подождёт, шаг важнее */ }
}

function indexStep(productId, number) {
  patchProduct(productId, (p) => ({
    steps: [...new Set([...(p.steps ?? []), number])].sort((a, b) => a - b),
  }))
}

/**
 * Восемь состояний разработки — тот же список и тот же порядок, что в
 * `bridges/app/lib/products-config.ts`. Очередь, а не набор: по ней считается
 * «что дальше».
 */
const DEV_STATUSES = [
  "not-started", "decomposition", "skeleton", "revision",
  "building", "acceptance", "extra-tasks", "done",
]

/**
 * Двигать состояние ТОЛЬКО ВПЕРЁД.
 *
 * 🔒 ОТКАТ НАЗАД ЗДЕСЬ ЗАПРЕЩЁН, И ЭТО НЕ ОСТОРОЖНОСТЬ. Продукт, дошедший до
 * приёмки, закрывает по ходу дела и мелкие шаги; если бы каждый закрытый шаг
 * пересчитывал состояние «по фактам», приёмка откатывалась бы в «выполнение
 * шагов» при первой же правке. Назад двигает владелец в панели — осознанно.
 */
/**
 * Двинуть этап вперёд И записать переход в журнал.
 *
 * 🔒 ЗАПИСЬ ИДЁТ ТЕМ ЖЕ ДЕЙСТВИЕМ, ЧТО И СМЕНА. Разведи их — и журнал станет
 * тем же, чем вчера было оглавление шагов: производным, которое обновляет один
 * из двух писателей, то есть уверенным враньём. Разбор:
 * `reports/errors/index-filled-by-one-of-two-writers.md`.
 *
 * Возвращает `true`, если переход состоялся: вызывающий должен знать, было ли
 * движение, а не догадываться по молчанию.
 */
async function advanceDevStatus(productId, target, { actor = "agent", step = null, note = "" } = {}) {
  const wanted = DEV_STATUSES.indexOf(target)
  if (wanted < 0) return false

  let from = null
  let moved = false
  patchProduct(productId, (p) => {
    const current = p.devStatus ?? "not-started"
    const now = DEV_STATUSES.indexOf(current)
    if (wanted <= now) return {}
    from = current
    moved = true
    return { devStatus: target }
  })
  if (!moved) return false

  // Журнал — лучшее усилие: отказ базы не имеет права отменить уже сделанный
  // переход. Молчание здесь честнее исключения: этап сменён, и это правда.
  try {
    await sql(LOG_SCHEMA)
    await sql(
      `INSERT INTO product_status_log (product_id, from_status, to_status, step_number, actor, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, from, target, step, actor, note],
    )
  } catch { /* журнал не записался — этап всё равно сменён */ }
  return true
}

// ── Инструменты ──────────────────────────────────────────────────────────────

const TOOLS = [
  // ── Продукты сервера ───────────────────────────────────────────────────────
  {
    name: "products_list",
    description:
      "The products this server carries: id, title, address, development stage, how many steps are open "
      + "and which one is next. Call this FIRST when the owner names a product in words (\"start work on "
      + "the shop\") — it is how you turn a name into an id. Also the honest answer to \"where are we\": "
      + "several products may each have an unfinished queue.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "product_history",
    description:
      "How this product's development actually went: every stage transition with who moved it, when, and "
      + "which step caused it. The register holds only the CURRENT stage — this is the record of the road, "
      + "and real development takes many cycles, not one.",
    inputSchema: {
      type: "object",
      properties: { product_id: { type: "string" }, limit: { type: "integer" } },
    },
  },
  // ── Пользовательские кейсы ─────────────────────────────────────────────────
  {
    name: "cases_list",
    description:
      "List the product's use cases with their status (draft | confirmed). Read this BEFORE writing any "
      + "code: a case the owner has not confirmed is a guess the model wrote, and building on it builds on "
      + "a guess.",
    inputSchema: { type: "object", properties: { product_id: { type: "string" } } },
  },
  {
    name: "cases_get",
    description: "Read ONE use case in full — its title and the scenario in the owner's own words.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, product_id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "cases_gate",
    description:
      "May development start? Returns how many cases exist, how many are confirmed, and the verdict. "
      + "No confirmed case means STOP — say what is missing instead of building.",
    inputSchema: { type: "object", properties: { product_id: { type: "string" } } },
  },
  {
    name: "cases_create",
    description:
      "Add a use case. It is ALWAYS created as a draft — confirmation belongs to the owner alone. The "
      + "slug is the machine file name and must be English; title and scenario are in the owner's language.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "short case title, the owner's language" },
        summary: { type: "string", description: "who does what, what they came for, the expected result, the edge case" },
        slug: { type: "string", description: "english-kebab-case, 2-4 words, names the actor's action" },
        product_id: { type: "string" },
      },
      required: ["title", "summary"],
    },
  },
  {
    name: "cases_update",
    description:
      "Rewrite a use case. ANY edit drops it back to draft — otherwise a green status would mean 'the "
      + "owner once approved some earlier text'. Pass only the fields you change.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        summary: { type: "string" },
        product_id: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "cases_unconfirm",
    description:
      "Withdraw confirmation from a case — use when you found that it contradicts reality or another case. "
      + "There is deliberately NO tool to confirm: only the owner does that, in the control panel.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, product_id: { type: "string" } },
      required: ["id"],
    },
  },
  // ── Шаги разработки ────────────────────────────────────────────────────────
  {
    name: "steps_list",
    description:
      "List development steps. Filter by product_id ('platform' for server-wide work) and/or status "
      + "(new | in-progress | blocked | done | cancelled). Returns number, product, title, status, importance.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string" },
        status: { type: "string", enum: STATUSES },
      },
    },
  },
  {
    name: "steps_get",
    description: "Read ONE step in full: its plan, the use cases it serves, and its result if closed.",
    inputSchema: {
      type: "object",
      properties: { number: { type: "integer" } },
      required: ["number"],
    },
  },
  {
    name: "steps_next",
    description:
      "The next step to work on: the lowest-numbered step that is neither done nor cancelled. "
      + "Optionally scoped to one product.",
    inputSchema: { type: "object", properties: { product_id: { type: "string" } } },
  },
  {
    name: "steps_create",
    description:
      "Create a step. Its number is issued here and is permanent — closing a step never renames it. "
      + "The title is 6-12 words describing the step in detail; short titles are refused. A step for a "
      + "product must name the use cases it serves — work that serves no case is work nobody ordered. "
      + "Pass status 'done' with a result to record work that is already finished.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "6-12 words, English, detailed: 'build minimal working skeleton with routes api and stubbed navigation'" },
        product_id: { type: "string", description: "product id, or 'platform' for server-wide work" },
        plan: { type: "string", description: "what to do, in full — this is the brief, not a headline" },
        cases: { type: "array", items: { type: "string" }, description: "case ids this step serves; required unless product is 'platform'" },
        importance: { type: "string", enum: IMPORTANCE },
        status: { type: "string", enum: STATUSES, description: "defaults to 'new'; 'done' records already-finished work" },
        result: { type: "string", description: "the report — pass it together with status 'done'" },
      },
      required: ["title"],
    },
  },
  {
    name: "steps_decompose_start",
    description:
      "Put the product's confirmed use cases into development: creates the ONE decomposition step whose "
      + "job is to turn them into an ordered queue, and moves the product to the 'decomposition' stage. "
      + "Idempotent — if that step already exists it is returned, not duplicated. Refuses while no case "
      + "is confirmed.",
    inputSchema: { type: "object", properties: { product_id: { type: "string" } } },
  },
  {
    name: "steps_close",
    description:
      "Close a step in one call: status 'done' plus the report, and the product's development stage moves "
      + "forward if this step earned it. The report is required — a closed step with no report cannot be "
      + "read back a month later. You must also say whether you updated PASSPORT.md.",
    inputSchema: {
      type: "object",
      properties: {
        number: { type: "integer" },
        result: { type: "string" },
        stage: { type: "string", enum: DEV_STATUSES, description: "optional: the stage this step completes" },
        passport_updated: {
          type: "boolean",
          description:
            "REQUIRED. Did you update development-docs/PASSPORT.md — one line per entity: what it does, "
            + "which cases it serves, what state it is in? Answer false honestly if you did not; the "
            + "answer is recorded either way. PASSPORT.md is the only document that carries PROGRESS: "
            + "the cases do not know what is built, and the architecture does not know what is finished.",
        },
      },
      required: ["number", "result", "passport_updated"],
    },
  },
  {
    name: "steps_update",
    description:
      "Change a step: its plan (revision), its status, or its result on closing. Only the fields you pass "
      + "are touched; the rest keep their values.",
    inputSchema: {
      type: "object",
      properties: {
        number: { type: "integer" },
        title: { type: "string" },
        plan: { type: "string" },
        status: { type: "string", enum: STATUSES },
        importance: { type: "string", enum: IMPORTANCE },
        cases: { type: "array", items: { type: "string" } },
        result: { type: "string", description: "the report; required in spirit when closing a step" },
      },
      required: ["number"],
    },
  },
]

const row = r => ({
  ...r,
  cases: r.cases ? JSON.parse(r.cases) : [],
})

const stamp = () => new Date().toISOString().replace(/\.\d+Z$/, "Z")

// ── Зеркало шагов файлами (решение владельца 2026-08-17, вечер) ───────────────
//
// 🔒 БАЗА — ИСТОЧНИК, ФАЙЛЫ — ЗЕРКАЛО. Владелец смотрит работу ГЛАЗАМИ, в своём
// клоне (правило «локальный репозиторий — единственный орган зрения»), а шаг,
// живущий только строкой в базе, для него не существует: открыв проект в
// редакторе, он не найдёт ни одного.
//
// 🔒 ПОЧЕМУ ЭТО НЕ ВОЗВРАТ СНЕСЁННОГО КОНВЕЙЕРА. У прежнего было три беды, и
// зеркало не имеет ни одной:
//   • «покажи открытые шаги продукта» читало КАЖДЫЙ файл — теперь это запрос к
//     базе, а файлы никто не обходит;
//   • статус жил в двух местах (имя папки и текст внутри) — теперь он один, в
//     базе, а папка ВЫВОДИТСЯ из него;
//   • закрытие было переносом файла, то есть второй операцией, которая могла не
//     случиться, — теперь перенос делает генератор в тот же миг.
//
// Отсюда главное правило этих файлов: **правка руками не доедет никуда**. Об
// этом сказано в шапке каждого — иначе человек однажды напишет в файл и будет
// ждать, что это увидит агент.
const STEPS_DIR = path.join(ROOT, "development-docs", "DEVELOPMENT-STEPS")
const NEW_DIR = path.join(STEPS_DIR, "NEW-STEPS")
const DONE_DIR = path.join(STEPS_DIR, "COMPLETED-STEPS")

/** Имя файла шага: номер + слаг заголовка. Латиница — это машинный слой. */
function stepFileName(step) {
  const slug = String(step.title ?? "")
    .toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60) || "step"
  return `${String(step.number).padStart(2, "0")}-${slug}.md`
}

function renderStepFile(step) {
  const cases = Array.isArray(step.cases) ? step.cases : []
  return `# ${step.number}. ${step.title}

<!-- fractera:step v1 — ЗЕРКАЛО. Источник истины — таблица development_steps.
     Правка этого файла руками НИКУДА не доедет: он переписывается целиком при
     каждом изменении шага, и папка выбирается по его состоянию. Меняйте шаг
     через MCP fractera-project (steps_update / steps_close). -->

**product:** ${step.product_id}
**status:** ${step.status}
**importance:** ${step.importance}
**kind:** ${step.kind ?? "work"}
**cases:** ${cases.length ? cases.join(", ") : "—"}
**updated:** ${step.updated_at ?? "—"}

## Задание

${String(step.plan ?? "").trim() || "_задание не написано_"}

## Результат

${String(step.result ?? "").trim() || "_шаг ещё не закрыт_"}
`
}

/**
 * Разложить ВСЕ шаги по двум папкам: открытые в `NEW-STEPS`, закрытые в
 * `COMPLETED-STEPS`.
 *
 * Полная пересборка, а не точечная правка: она дешёвая (десятки файлов) и не
 * оставляет следов от прошлых состояний — шаг, сменивший имя или папку, не
 * задваивается. Точечная правка ровно здесь и накопила бы расхождение.
 *
 * «Лучшее усилие»: отказ файловой системы не имеет права отменить уже сделанную
 * запись в базе. Молчать нельзя — возвращаем, что вышло, вызывающий доложит.
 */
async function syncStepFiles() {
  try {
    const { rows } = await sql("SELECT * FROM development_steps ORDER BY number")
    fs.mkdirSync(NEW_DIR, { recursive: true })
    fs.mkdirSync(DONE_DIR, { recursive: true })

    const wanted = new Map()
    for (const raw of rows) {
      const step = row(raw)
      const dir = ["done", "cancelled"].includes(step.status) ? DONE_DIR : NEW_DIR
      wanted.set(path.join(dir, stepFileName(step)), renderStepFile(step))
    }
    // Чужого не трогаем: убираем только то, что похоже на наш файл шага.
    for (const dir of [NEW_DIR, DONE_DIR]) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name)
        if (!/^\d+-.*\.md$/.test(name)) continue
        if (!wanted.has(full)) fs.unlinkSync(full)
      }
    }
    for (const [file, body] of wanted) fs.writeFileSync(file, body, "utf-8")
    return { ok: true, files: wanted.size }
  } catch (e) {
    return { ok: false, error: String(e?.message ?? e) }
  }
}

/**
 * Вставка шага с выдачей номера. Вынесена, потому что вставляют трое:
 * `steps_create`, шаг декомпозиции и — в будущем — панель.
 *
 * 🔒 НОМЕР — ОТ МАКСИМУМА КОГДА-ЛИБО ВЫДАННОГО, включая закрытые и отменённые:
 * переиспользованный номер сделал бы оглавление в PRODUCTS-CONFIG указателем на
 * два разных шага сразу.
 *
 * 🔒 И С ПОВТОРОМ ПРИ СТОЛКНОВЕНИИ — это пойманный дефект, а не запас прочности.
 * «Прочитать максимум, затем вставить» — две операции, и между ними влезает
 * второй пишущий: проверка конвейером дала ровно это, `UNIQUE constraint failed`,
 * на втором шаге из двух. Очередь вызовов снимает гонку ВНУТРИ процесса, но
 * второй агент работает другим процессом и очереди не видит. Первичный ключ
 * отказывает честно, а мы берём следующий свободный и пробуем снова.
 */
async function insertStep({ productId, title, status, importance, cases, plan, result, kind }) {
  await ensureKindColumn()
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { rows } = await sql("SELECT MAX(number) AS m FROM development_steps")
    const number = Number(rows[0]?.m ?? 0) + 1
    try {
      await sql(
        `INSERT INTO development_steps (number, product_id, title, status, importance, kind, cases, plan, result)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [number, productId, title, status, importance, kind || "work",
         JSON.stringify(cases ?? []), plan ?? "", result ?? ""],
      )
      indexStep(productId, number)
      // Зеркало обновляется тем же действием, что создаёт шаг: файл, появляющийся
      // отдельным ходом, однажды не появится.
      const mirror = await syncStepFiles()
      return {
        ok: true, number, product_id: productId, title, status, importance, kind: kind || "work",
        ...(mirror.ok ? {} : { mirrorError: mirror.error }),
      }
    } catch (e) {
      // Чужой отказ не глотаем: повторяем ТОЛЬКО столкновение по ключу.
      if (!/unique|constraint/i.test(String(e?.message ?? e))) throw e
    }
  }
  return { error: "number_collision", note: "five attempts lost the race for a free number" }
}

/** Все продукты реестра — без разрешения одного. Пустой список законен. */
function allProducts() {
  try {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")).products ?? []
  } catch {
    return []
  }
}

/**
 * Сколько шагов открыто у каждого продукта, и какой следующий.
 *
 * Одним запросом, а не по продукту: список читают на входе в сессию, и N
 * запросов к слою данных ради N строк — это N задержек сети на пустом месте.
 */
async function openStepsByProduct() {
  const { rows } = await sql(
    `SELECT product_id, COUNT(*) AS open, MIN(number) AS next
       FROM development_steps WHERE status NOT IN ('done','cancelled')
      GROUP BY product_id`,
  )
  const map = new Map()
  for (const r of rows) map.set(String(r.product_id), { open: Number(r.open), next: Number(r.next) })
  return map
}

async function callTool(name, args = {}) {
  // ── Продукты: реестр плюс счётчик открытых шагов ───────────────────────────
  if (name === "products_list") {
    const products = allProducts()
    if (!products.length) return { products: [], note: "PRODUCTS-CONFIG holds no product yet" }
    const open = await openStepsByProduct()
    return {
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        route: p.route,
        devStatus: p.devStatus ?? "not-started",
        openSteps: open.get(p.id)?.open ?? 0,
        nextStep: open.get(p.id)?.next ?? null,
      })),
      note: "Match the owner's words against `title`; every tool takes `id`.",
    }
  }

  if (name === "product_history") {
    const resolved = resolveProduct(args.product_id)
    if (resolved.error) return resolved
    await sql(LOG_SCHEMA)
    const limit = Math.min(Math.max(Number(args.limit) || 50, 1), 200)
    const { rows } = await sql(
      `SELECT from_status, to_status, step_number, actor, note, created_at
         FROM product_status_log WHERE product_id = ? ORDER BY id DESC LIMIT ?`,
      [resolved.product.id, limit],
    )
    // Пусто — это ответ, а не отказ: продукт мог ни разу не двинуться с места.
    // Но сказать об этом надо словом, иначе пустой список читается как поломка.
    return {
      product_id: resolved.product.id,
      title: resolved.product.title,
      currentStage: resolved.product.devStatus ?? "not-started",
      transitions: rows,
      ...(rows.length ? {} : { note: "no transitions recorded yet — the product has not moved" }),
    }
  }

  // ── Кейсы: файлы, базы не касаются вовсе ───────────────────────────────────
  if (name.startsWith("cases_")) {
    const resolved = resolveProduct(args.product_id)
    if (resolved.error) return resolved
    const pid = resolved.product.id

    if (name === "cases_list") {
      const cases = readCases(pid)
      return {
        product_id: pid,
        dir: `development-docs/USE-CASES/${pid}/CASES/`,
        cases: cases.map(({ summary, ...rest }) => rest),
        note: "summaries omitted — read one with cases_get",
      }
    }

    if (name === "cases_get") {
      const found = readCases(pid).find(c => c.id === args.id)
      return found ?? { error: "not_found", id: args.id, known: listCaseFiles(pid).map(f => f.replace(/\.md$/, "")) }
    }

    if (name === "cases_gate") {
      const cases = readCases(pid)
      const confirmed = cases.filter(c => c.status === "confirmed").length
      // 🔒 ВЕРДИКТ ВОЗВРАЩАЕТСЯ СЛОВОМ, А НЕ ВЫВОДИТСЯ ВЫЗЫВАЮЩИМ. Два числа
      // допускают два прочтения: «8 из 8» и «0 из 0» оба выглядят как «всё
      // подтверждено», а второе означает, что кейсов нет вовсе.
      const verdict = cases.length === 0 ? "no-cases"
        : confirmed === 0 ? "nothing-confirmed"
        : confirmed < cases.length ? "partially-confirmed"
        : "ready"
      return {
        product_id: pid, total: cases.length, confirmed, verdict,
        mayBuild: verdict === "ready",
        unconfirmed: cases.filter(c => c.status !== "confirmed").map(c => c.id),
      }
    }

    if (name === "cases_create") {
      const title = String(args.title ?? "").trim()
      const summary = String(args.summary ?? "").trim()
      if (!title) return { error: "title_required" }
      if (!summary) return { error: "summary_required" }
      fs.mkdirSync(casesDir(pid), { recursive: true })
      // Нумерация продолжает существующую: кейсы нумеруются, как шаги, и номер
      // читается из первых двух знаков имени файла.
      const nums = readCases(pid).map(c => Number(c.id.slice(0, 2))).filter(Number.isFinite)
      const n = (nums.length ? Math.max(...nums) : 0) + 1
      const id = `${String(n).padStart(2, "0")}-${slugify(args.slug)}`
      fs.writeFileSync(
        path.join(casesDir(pid), `${id}.md`),
        renderCase({ title, summary, status: "draft", confirmedAt: null }),
        "utf-8",
      )
      return { ok: true, id, product_id: pid, status: "draft", note: "only the owner can confirm it" }
    }

    if (name === "cases_update" || name === "cases_unconfirm") {
      const file = path.join(casesDir(pid), `${args.id}.md`)
      let current
      try {
        current = parseCase(String(args.id), fs.readFileSync(file, "utf-8"))
      } catch {
        return { error: "not_found", id: args.id }
      }
      const next = {
        title: name === "cases_update" && args.title !== undefined ? String(args.title).trim() : current.title,
        summary: name === "cases_update" && args.summary !== undefined ? String(args.summary).trim() : current.summary,
        // 🔒 И ПРАВКА, И СНЯТИЕ ВОЗВРАЩАЮТ ЧЕРНОВИК. Тот же закон стоит в панели
        // (`writeCase`): зелёный статус обязан означать «владелец подтвердил ЭТОТ
        // текст», а не «когда-то подтвердил какой-то».
        status: "draft",
        confirmedAt: null,
      }
      if (!next.title) return { error: "title_required" }
      fs.writeFileSync(file, renderCase(next), "utf-8")
      return {
        ok: true, id: args.id, product_id: pid, status: "draft",
        wasConfirmed: current.status === "confirmed",
      }
    }

    return { error: "unknown_tool", name }
  }

  await sql(SCHEMA)

  if (name === "steps_list") {
    const where = []
    const params = []
    if (args.product_id) { where.push("product_id = ?"); params.push(args.product_id) }
    if (args.status) { where.push("status = ?"); params.push(args.status) }
    const { rows } = await sql(
      `SELECT number, product_id, title, status, importance, cases, updated_at
         FROM development_steps ${where.length ? "WHERE " + where.join(" AND ") : ""}
        ORDER BY number`,
      params,
    )
    return { steps: rows.map(row), total: rows.length }
  }

  if (name === "steps_get") {
    const { rows } = await sql("SELECT * FROM development_steps WHERE number = ?", [Number(args.number)])
    if (!rows.length) return { error: "not_found", number: Number(args.number) }
    return row(rows[0])
  }

  if (name === "steps_next") {
    const params = ["done", "cancelled"]
    let scope = ""
    if (args.product_id) { scope = "AND product_id = ?"; params.push(args.product_id) }
    const { rows } = await sql(
      `SELECT * FROM development_steps WHERE status NOT IN (?, ?) ${scope} ORDER BY number LIMIT 1`,
      params,
    )
    // Пусто — это ответ, а не отказ: очередь пройдена. Молчание клиент прочитал
    // бы как поломку и пошёл бы искать её там, где всё в порядке.
    if (!rows.length) return { done: true, note: "no open steps" }

    const step = row(rows[0])

    // 🔒 ЧУЖАЯ ОЧЕРЕДЬ НАЗЫВАЕТСЯ ВСЛУХ (владелец 2026-08-17).
    //
    // Без `product_id` берётся шаг с НАИМЕНЬШИМ номером среди всех открытых —
    // то есть самый старый. Сценарий владельца дословно: открыты шаги 5–7 по
    // магазину, заведён 12-й по CRM, человек говорит «начинай» и получает
    // пятый. Оба уверены, что делают новое.
    //
    // Не отказ, а предупреждение: один продукт — частый случай, и превращать
    // его в вопрос значит наказывать всех ради редкого. Но промолчать нельзя:
    // здесь пути расходятся молча, и разойдутся они не в коде, а в работе.
    if (!args.product_id) {
      const open = await openStepsByProduct()
      const others = allProducts()
        .filter((p) => p.id !== step.product_id && (open.get(p.id)?.open ?? 0) > 0)
        .map((p) => ({ id: p.id, title: p.title, open: open.get(p.id).open, next: open.get(p.id).next }))
      if (others.length) {
        return {
          ...step,
          otherProductsWithOpenSteps: others,
          note: "This step belongs to " + step.product_id + ". Other products have open steps too — "
            + "say so before you start, and ask which product the owner means.",
        }
      }
    }
    return step
  }

  if (name === "steps_create") {
    const title = String(args.title ?? "").trim()
    if (!title) return { error: "title_required" }
    const shape = titleProblem(title)
    if (shape) return shape

    const productId = String(args.product_id ?? "platform").trim() || "platform"
    const importance = IMPORTANCE.includes(args.importance) ? args.importance : "mandatory"

    // 🔒 ШАГ ПРОДУКТА ОБЯЗАН НАЗВАТЬ КЕЙСЫ. «Платформа» — законное исключение:
    // тема, языки, офлайн-кэш принадлежат всему серверу и кейса не имеют. У
    // продукта кейс есть всегда, и шаг без него — работа, которую никто не
    // заказывал. Отказ называет, из чего выбирать, а не просто отказывает.
    const cases = Array.isArray(args.cases) ? args.cases.map(String).filter(Boolean) : []
    if (productId !== "platform" && !cases.length) {
      return {
        error: "cases_required",
        note: "a step for a product must name the use cases it serves",
        available: readCases(productId).map(c => ({ id: c.id, status: c.status })),
      }
    }

    const status = STATUSES.includes(args.status) ? args.status : "new"
    if (!STATUSES.includes(args.status) && args.status !== undefined) {
      return { error: "unknown_status", allowed: STATUSES }
    }
    // Закрытый шаг без отчёта не заводится: через месяц он не отвечает ни на
    // один вопрос, а исправить это будет уже некому.
    if (status === "done" && !String(args.result ?? "").trim()) {
      return { error: "result_required", note: "a step recorded as done must carry its report" }
    }

    // 🔒 НОМЕР — ОТ МАКСИМУМА КОГДА-ЛИБО ВЫДАННОГО, включая закрытые и
    // отменённые: переиспользованный номер сделал бы оглавление в
    // PRODUCTS-CONFIG указателем на два разных шага сразу.
    //
    // 🔒 И С ПОВТОРОМ ПРИ СТОЛКНОВЕНИИ — это пойманный дефект, а не запас
    // прочности. «Прочитать максимум, затем вставить» — две операции, и между
    // ними влезает второй пишущий: проверка конвейером дала ровно это,
    // `UNIQUE constraint failed: development_steps.number`, на втором шаге из
    // двух. Внутри процесса очередь вызовов это снимает, но второй агент — или
    // панель — работает другим процессом, и очередь его не видит. Первичный
    // ключ отказывает честно, а мы берём следующий свободный и пробуем снова.
    return insertStep({
      productId, title, status, importance, cases,
      plan: String(args.plan ?? ""), result: String(args.result ?? ""),
      kind: String(args.kind ?? "work"),
    })
  }

  // Пустить кейсы в разработку. Шаг ровно один и на весь продукт: повторный
  // вызов возвращает существующий, а не заводит второй такой же.
  if (name === "steps_decompose_start") {
    const resolved = resolveProduct(args.product_id)
    if (resolved.error) return resolved
    const pid = resolved.product.id

    const cases = readCases(pid)
    const confirmed = cases.filter(c => c.status === "confirmed")
    if (!confirmed.length) {
      return {
        error: "nothing_confirmed",
        note: "development starts from CONFIRMED cases; ask the owner to confirm them in the panel",
        total: cases.length,
      }
    }

    await ensureKindColumn()
    const { rows } = await sql(
      "SELECT * FROM development_steps WHERE product_id = ? AND kind = 'decomposition' ORDER BY number LIMIT 1",
      [pid],
    )
    if (rows.length) {
      await advanceDevStatus(pid, "decomposition", { step: rows[0].number, note: "decomposition step already existed" })
      return { ok: true, existed: true, ...row(rows[0]) }
    }

    const created = await insertStep({
      productId: pid,
      title: "decompose confirmed use cases into an ordered development step queue",
      status: "new",
      importance: "critical",
      kind: "decomposition",
      cases: confirmed.map(c => c.id),
      plan:
        "Read every confirmed use case of this product and turn it into an ordered queue of development "
        + "steps through steps_create.\n\n"
        + "The FIRST step of that queue is always the same and is not negotiable: the minimal working "
        + "skeleton — the whole architecture present in the filesystem, the API routes in place, and "
        + "navigation walking end to end on stubs. Nothing real behind it yet. Everything after it fills "
        + "the stubs in, one case at a time.\n\n"
        + "Every step names the cases it serves and carries a title of 6-12 words. When the queue is "
        + "written, close this step with steps_close.",
      result: "",
    })
    if (created.ok) await advanceDevStatus(pid, "decomposition", { step: created.number, note: "confirmed cases put into development" })
    return created
  }

  if (name === "steps_close") {
    const number = Number(args.number)
    const result = String(args.result ?? "").trim()
    if (!result) return { error: "result_required" }
    // 🔒 ПРО ПАСПОРТ СПРАШИВАЮТ, А НЕ НАПОМИНАЮТ (владелец 2026-08-17).
    //
    // `PASSPORT.md` объявлен единственным документом, несущим ПРОГРЕСС, — и за
    // весь сквозной прогон агент не притронулся к нему ни разу. Не потому, что
    // не хотел: ничто его не спросило. Просьба в тексте инструкции — это то, что
    // читают на нулевой минуте и не вспоминают на сороковой.
    //
    // Обязательное поле — вопрос, мимо которого нельзя пройти. `false`
    // принимается: врать агента не заставляют, но ответ попадает в отчёт шага и
    // виден владельцу.
    if (typeof args.passport_updated !== "boolean") {
      return {
        error: "passport_answer_required",
        note: "Say whether you updated development-docs/PASSPORT.md: pass passport_updated true or false. "
          + "It is the only document that carries progress — the cases do not know what is built.",
      }
    }

    const { rows } = await sql("SELECT * FROM development_steps WHERE number = ?", [number])
    if (!rows.length) return { error: "not_found", number }

    const passportNote = args.passport_updated
      ? ""
      : "\n\n⚠ PASSPORT.md НЕ обновлён при закрытии этого шага."
    await sql(
      "UPDATE development_steps SET status = 'done', result = ?, updated_at = ? WHERE number = ?",
      [result + passportNote, stamp(), number],
    )
    // Этап продукта двигается ТОЛЬКО вперёд и только когда его назвали: закрытый
    // шаг сам по себе о стадии ничего не говорит, а угадывать её по числу
    // закрытых значило бы откатывать приёмку при каждой мелкой правке.
    if (args.stage) await advanceDevStatus(String(rows[0].product_id), String(args.stage), { step: number, note: String(args.result ?? "").slice(0, 120) })
    await syncStepFiles()
    return callTool("steps_get", { number })
  }

  if (name === "steps_update") {
    const number = Number(args.number)
    const sets = []
    const params = []
    const put = (column, value) => { sets.push(`${column} = ?`); params.push(value) }
    // Правка имени проверяется тем же правилом, что и создание: иначе шаг,
    // заведённый по закону, переименовывался бы в «fix» через минуту после.
    if (args.title !== undefined) {
      const shape = titleProblem(args.title)
      if (shape) return shape
      put("title", String(args.title).trim())
    }
    if (args.plan !== undefined) put("plan", String(args.plan))
    if (args.result !== undefined) put("result", String(args.result))
    if (args.cases !== undefined) put("cases", JSON.stringify(args.cases ?? []))
    if (args.status !== undefined) {
      if (!STATUSES.includes(args.status)) return { error: "unknown_status", allowed: STATUSES }
      put("status", args.status)
    }
    if (args.importance !== undefined) {
      if (!IMPORTANCE.includes(args.importance)) return { error: "unknown_importance", allowed: IMPORTANCE }
      put("importance", args.importance)
    }
    if (!sets.length) return { error: "nothing_to_change" }
    put("updated_at", stamp())
    params.push(number)
    const { changes } = await sql(
      `UPDATE development_steps SET ${sets.join(", ")} WHERE number = ?`, params,
    )
    if (!changes) return { error: "not_found", number }
    await syncStepFiles()
    return callTool("steps_get", { number })
  }

  return { error: "unknown_tool", name }
}

// ── Протокол ─────────────────────────────────────────────────────────────────

function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n")
}

async function handle(rpc) {
  const { id, method, params } = rpc

  // 🔒 Хендшейк — первым. Клиент зовёт `initialize` до `tools/list`, и сервер,
  // не знающий этого метода, регистрирует ноль инструментов молча.
  if (method === "initialize") {
    return send({
      jsonrpc: "2.0", id,
      result: {
        protocolVersion: params?.protocolVersion ?? PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: { name: "fractera-development-steps", version: "1.0.0" },
      },
    })
  }
  // Нотификации приходят БЕЗ `id` и ответа не ждут: ответить на них значит
  // прислать клиенту сообщение, которого он не запрашивал.
  if (method === "notifications/initialized" || method === "initialized") return
  if (method === "ping") return send({ jsonrpc: "2.0", id, result: {} })

  if (method === "tools/list") return send({ jsonrpc: "2.0", id, result: { tools: TOOLS } })

  if (method === "tools/call") {
    try {
      const out = await callTool(params?.name, params?.arguments ?? {})
      return send({
        jsonrpc: "2.0", id,
        result: {
          content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
          isError: Boolean(out?.error),
        },
      })
    } catch (e) {
      // Отказ базы возвращается ТЕКСТОМ инструмента, а не ошибкой протокола:
      // «слой данных не отвечает» — это то, что агент должен прочитать и
      // сказать владельцу, а не обрыв соединения, который он истолкует сам.
      // Отказ доступа к данным несёт СВОЙ код и указание, что сделать человеку:
      // строка `Error: ...` заставила бы агента пересказывать её своими словами,
      // а пересказ теряет ровно то место, где сказано «скачайте .env.local».
      const body = e instanceof NoDataAccess
        ? { error: e.code, note: e.note }
        : { error: String(e?.message ?? e) }
      return send({
        jsonrpc: "2.0", id,
        result: {
          content: [{ type: "text", text: JSON.stringify(body, null, 2) }],
          isError: true,
        },
      })
    }
  }

  if (id !== undefined) {
    send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } })
  }
}

let buffer = ""
// 🔒 СЧЁТЧИК НЕЗАКОНЧЕННЫХ ВЫЗОВОВ — НЕ ПЕДАНТИЗМ, А ПОЙМАННЫЙ ДЕФЕКТ.
// Сначала здесь стояло `process.stdin.on("end", () => process.exit(0))`, и это
// убивало сервер посреди уже начатого запроса к базе: ответы на два последних
// вызова не уходили вовсе. При живом клиенте поток не закрывается и дефект не
// виден; он выстреливает ровно там, где закрылся раньше времени, — в проверке
// конвейером и у клиента, оборвавшего связь на медленном вызове.
let pending = 0
let closed = false
let queue = Promise.resolve()
const finishIfIdle = () => { if (closed && pending === 0) process.exit(0) }

process.stdin.setEncoding("utf-8")
process.stdin.on("data", chunk => {
  buffer += chunk
  // Сообщения разделены переводом строки, и последний кусок буфера может быть
  // половиной сообщения — разбирать надо только завершённые строки.
  let cut = buffer.indexOf("\n")
  while (cut !== -1) {
    const line = buffer.slice(0, cut).trim()
    buffer = buffer.slice(cut + 1)
    if (line) {
      let rpc = null
      try { rpc = JSON.parse(line) } catch { /* не JSON — не наше сообщение */ }
      if (rpc) {
        pending += 1
        // 🔒 ВЫЗОВЫ ИСПОЛНЯЮТСЯ ПО ОЧЕРЕДИ, А НЕ ВЕЕРОМ. Разобранные из одного
        // куска потока, они уходили в работу одновременно — и «создать шаг» ещё
        // не дописал строку, когда «покажи следующий» уже отвечал «шагов нет».
        // Ответ, обгоняющий собственную причину, читается как пустая база.
        // Операции здесь короткие, поэтому очередь ничего не стоит.
        queue = queue
          .then(() => handle(rpc))
          .catch(() => {})
          .finally(() => { pending -= 1; finishIfIdle() })
      }
    }
    cut = buffer.indexOf("\n")
  }
})
process.stdin.on("end", () => { closed = true; finishIfIdle() })
