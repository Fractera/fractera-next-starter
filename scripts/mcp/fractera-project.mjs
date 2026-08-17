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

async function sql(query, params = []) {
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
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    localDb = new Database(dbPath)
  }
  const stmt = localDb.prepare(query)
  if (/^\s*select/i.test(query)) return { rows: stmt.all(...params), changes: 0 }
  const info = stmt.run(...params)
  return { rows: [], changes: info.changes }
}

// 🔒 Таблица создаётся и здесь тоже. Приложение объявляет её в `SCHEMA`, но агент
// приходит в клон, где `next build` мог не запускаться ни разу, — а «таблицы нет»
// он прочитает как «шагов нет», что неправда другого рода.
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS development_steps (
    number      INTEGER PRIMARY KEY,
    product_id  TEXT NOT NULL DEFAULT 'platform',
    title       TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'new',
    importance  TEXT NOT NULL DEFAULT 'mandatory',
    cases       TEXT,
    plan        TEXT,
    result      TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
`

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
function resolveProduct(requested) {
  let products = []
  try {
    products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")).products ?? []
  } catch { /* реестра нет — отвечаем об этом честно ниже */ }
  if (!products.length) return { error: "no_products", note: "PRODUCTS-CONFIG holds no product yet" }
  if (requested) {
    const found = products.find(p => p.id === requested)
    return found ? { product: found } : { error: "unknown_product", known: products.map(p => p.id) }
  }
  if (products.length === 1) return { product: products[0] }
  return { error: "product_required", known: products.map(p => p.id) }
}

// ── Оглавление продукта: номера шагов в PRODUCTS-CONFIG ──────────────────────
//
// 🔒 ОГЛАВЛЕНИЕ ОБНОВЛЯЕТСЯ ТЕМ ЖЕ ДЕЙСТВИЕМ, ЧТО И ТАБЛИЦА. Список, который
// поддерживают руками, расходится с истиной в первую же неделю — и расходится
// молча, потому что никто его не перечитывает. Здесь он производное: шаг завели —
// номер появился.
const PRODUCTS_FILE = path.join(ROOT, "PRODUCTS-CONFIG", "products-config.json")

function indexStep(productId, number) {
  if (!productId || productId === "platform") return
  try {
    const config = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"))
    const product = (config.products ?? []).find(p => p.id === productId)
    if (!product) return
    const steps = [...new Set([...(product.steps ?? []), number])].sort((a, b) => a - b)
    product.steps = steps
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(config, null, 2) + "\n", "utf-8")
  } catch { /* конфига нет — оглавление подождёт, шаг важнее */ }
}

// ── Инструменты ──────────────────────────────────────────────────────────────

const TOOLS = [
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
      "Create a step. Its number is issued here (max + 1) and is permanent. A step that serves no use "
      + "case is work nobody ordered — pass the case slugs it exists for.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        product_id: { type: "string", description: "product id, or 'platform' for server-wide work" },
        plan: { type: "string", description: "what to do, in full — this is the brief, not a headline" },
        cases: { type: "array", items: { type: "string" } },
        importance: { type: "string", enum: IMPORTANCE },
      },
      required: ["title"],
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

async function callTool(name, args = {}) {
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
    return row(rows[0])
  }

  if (name === "steps_create") {
    const title = String(args.title ?? "").trim()
    if (!title) return { error: "title_required" }
    const productId = String(args.product_id ?? "platform").trim() || "platform"
    const importance = IMPORTANCE.includes(args.importance) ? args.importance : "mandatory"

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
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { rows } = await sql("SELECT MAX(number) AS m FROM development_steps")
      const number = Number(rows[0]?.m ?? 0) + 1
      try {
        await sql(
          `INSERT INTO development_steps (number, product_id, title, status, importance, cases, plan)
           VALUES (?, ?, ?, 'new', ?, ?, ?)`,
          [number, productId, title, importance, JSON.stringify(args.cases ?? []), String(args.plan ?? "")],
        )
        indexStep(productId, number)
        return { ok: true, number, product_id: productId, title, status: "new", importance }
      } catch (e) {
        // Чужой отказ не глотаем: повторяем ТОЛЬКО столкновение по ключу.
        if (!/unique|constraint/i.test(String(e?.message ?? e))) throw e
      }
    }
    return { error: "number_collision", note: "five attempts lost the race for a free number" }
  }

  if (name === "steps_update") {
    const number = Number(args.number)
    const sets = []
    const params = []
    const put = (column, value) => { sets.push(`${column} = ?`); params.push(value) }
    if (args.title !== undefined) put("title", String(args.title))
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
    put("updated_at", new Date().toISOString().replace(/\.\d+Z$/, "Z"))
    params.push(number)
    const { changes } = await sql(
      `UPDATE development_steps SET ${sets.join(", ")} WHERE number = ?`, params,
    )
    if (!changes) return { error: "not_found", number }
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
      return send({
        jsonrpc: "2.0", id,
        result: {
          content: [{ type: "text", text: JSON.stringify({ error: String(e?.message ?? e) }, null, 2) }],
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
