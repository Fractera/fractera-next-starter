import "server-only"
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, unlinkSync, readdirSync } from "fs"
import { dirname, join } from "path"
import {
  DEFAULT_PRODUCT_DOSSIER,
  DEFAULT_PRODUCTS_REGISTRY,
  type ProductDossier,
} from "@/config/products-config.defaults"
import { productDossierSchema, productsRegistrySchema } from "@/config/products-config.schema"
import { validateConfig } from "@/config/config-validate"

// ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ЭТОТ СЛОЙ ПИШЕТ ДОСЬЕ ПРОДУКТОВ (34-1, 2026-08-29).
//
// 🔒 ЗЕРКАЛО ДВУХ СОСЕДНИХ ПИСАТЕЛЕЙ (`app-config-writer`, `platform-config-writer`)
// НАСТОЛЬКО, НАСКОЛЬКО ПОЗВОЛЯЕТ РАСКЛАДКА. Приёмы те же: заплата вместо снимка,
// диск читается в момент записи, запись атомарна через временный файл и `rename`.
// Писатели, ведущие себя по-разному, — источник вопросов «почему здесь
// сохранилось, а там нет».
//
// 🔒 НО ОТЛИЧИЕ ЕСТЬ, И ОНО МЕНЯЕТ ЦЕНУ ОШИБКИ: ЗДЕСЬ НЕ ОДИН ФАЙЛ, А ПАПКА, И У
// КАЖДОГО ПРОДУКТА СВОЙ. Значит чужие продукты защищены самой раскладкой — заплата
// нужна внутри ОДНОГО досье, чтобы правка фазы не стёрла кейсы и шаги.
//
// 🔒 СПИСОК ПРОДУКТОВ — ЭТО ОБХОД ПАПКИ, А НЕ РЕЕСТР. Реестр хранит ПОРЯДОК и
// последний выданный номер, и только это. Файл-оглавление, дублирующий список
// файлов, разошёлся бы с папкой в первую неделю — и разошёлся бы молча.
//
// 🔒 `id` ВЕЧЕН И НИЧЕГО НЕ ЗНАЧИТ. `p1`, `p2` — не имя и не адрес: на них висят
// пути (страницы, таблицы `<id>_*`, папка логики). Имя и адрес владелец меняет
// свободно, `id` — никогда. Поэтому он выдаётся счётчиком, а не выводится из
// названия: название переименуют в первый же день.

export type ProductsResult =
  | { ok: true; product: ProductDossier }
  | { ok: false; reason: "bad-body" | "not-found" | "write-failed"; detail?: string }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/**
 * Слияние заплаты внутрь одного досье.
 *
 * 🔒 МАССИВЫ ЗАМЕНЯЮТСЯ ЦЕЛИКОМ, А НЕ СЛИВАЮТСЯ ПО ИНДЕКСУ — тот же закон, что у
 * `nav.top` в настройках приложения. Слияние по индексу оставило бы удалённый
 * последний кейс на диске навсегда.
 */
function mergePatch(base: unknown, patch: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = isPlainObject(base) ? { ...base } : {}
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete out[key]
      continue
    }
    out[key] = isPlainObject(value) ? mergePatch(out[key], value) : value
  }
  return out
}

/** Папка данных — та же, что у читателя, включая переопределение окружением. */
export function getProductsDir(): string {
  return process.env.PRODUCTS_CONFIG_DIR ?? join(process.cwd(), "PRODUCTS-CONFIG")
}

const dossierPath = (id: string) => join(getProductsDir(), `${id}.json`)
const registryPath = () => join(getProductsDir(), "registry.json")

/** Идентификаторы по файлам на диске — правда о том, какие продукты есть. */
export function productIds(): string[] {
  try {
    return readdirSync(getProductsDir())
      .filter(f => /^p\d+\.json$/.test(f))
      .map(f => f.replace(/\.json$/, ""))
      .sort((a, b) => (Number(a.slice(1)) || 0) - (Number(b.slice(1)) || 0))
  } catch {
    // Папки нет — законное состояние «ни одного продукта не заводили».
    return []
  }
}

/** Сырое досье с диска — БЕЗ умолчаний: только то, что владелец действительно сохранял. */
export function readRawDossier(id: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(dossierPath(id), "utf8"))
    return isPlainObject(parsed) ? parsed : null
  } catch {
    return null
  }
}

function readRegistry(): { version: number; ids: string[]; maxId: number } {
  try {
    const raw: unknown = JSON.parse(readFileSync(registryPath(), "utf8"))
    return validateConfig(productsRegistrySchema, raw, DEFAULT_PRODUCTS_REGISTRY, "PRODUCTS-CONFIG/registry")
  } catch {
    return { ...DEFAULT_PRODUCTS_REGISTRY, ids: [] }
  }
}

/** Атомарная запись любого файла папки: временный файл рядом, затем `rename`. */
function writeAtomic(path: string, data: unknown): { ok: true } | { ok: false; detail: string } {
  const tmp = join(dirname(path), `.${process.pid}.${Date.now()}.tmp`)
  try {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf8")
    renameSync(tmp, path)
    return { ok: true }
  } catch (e) {
    if (existsSync(tmp)) {
      try { unlinkSync(tmp) } catch { /* уже нет — тем лучше */ }
    }
    return { ok: false, detail: String(e) }
  }
}

/**
 * Завести продукт.
 *
 * 🔒 НОМЕР БЕРЁТСЯ У РЕЕСТРА, А НЕ У ДЛИНЫ СПИСКА. Удалили `p2` из трёх — длина
 * даст «2», и новый продукт займёт чужой вечный идентификатор, к которому ведут
 * пути уже удалённого. Счётчик `maxId` растёт всегда и назад не идёт.
 */
export function createProduct(title: string): ProductsResult {
  const reg = readRegistry()
  // На всякий случай сверяемся и с диском: реестр мог отстать от папки, если файл
  // клали руками. Берём максимум из двух — так номер не столкнётся ни с чем.
  const onDisk = productIds().map(id => Number(id.slice(1)) || 0)
  const next = Math.max(reg.maxId, ...onDisk, 0) + 1
  const id = `p${next}`
  const now = new Date().toISOString()

  const product: ProductDossier = {
    ...DEFAULT_PRODUCT_DOSSIER,
    id,
    title: title.trim() || id,
    createdAt: now,
    updatedAt: now,
    // Массивы копируются, а не наследуются ссылкой: иначе два продукта делили бы
    // один и тот же список кейсов, и второй правил бы первого.
    intake: { questions: [], answers: [], seed: "" },
    cases: [],
    steps: [],
    pages: [],
    history: [{ at: now, phase: DEFAULT_PRODUCT_DOSSIER.phase, stage: DEFAULT_PRODUCT_DOSSIER.stage, by: "owner" }],
  }

  const w = writeAtomic(dossierPath(id), product)
  if (!w.ok) return { ok: false, reason: "write-failed", detail: w.detail }

  const r = writeAtomic(registryPath(), {
    version: reg.version,
    ids: [...reg.ids.filter(x => x !== id), id],
    maxId: next,
  })
  // 🔒 ДОСЬЕ ВАЖНЕЕ РЕЕСТРА, ПОЭТОМУ ОНО ПИШЕТСЯ ПЕРВЫМ. Упади запись реестра —
  // продукт всё равно существует: список берётся обходом папки, а реестр лишь
  // задаёт порядок. Обратный порядок дал бы номер, выданный несуществующему файлу.
  if (!r.ok) return { ok: false, reason: "write-failed", detail: r.detail }

  return { ok: true, product }
}

/** Записать заплату внутрь одного досье. */
export function writeProductPatch(id: string, patch: unknown): ProductsResult {
  if (!/^p\d+$/.test(id)) return { ok: false, reason: "bad-body", detail: "bad product id" }
  if (!isPlainObject(patch)) return { ok: false, reason: "bad-body", detail: "patch must be a JSON object" }

  const base = readRawDossier(id)
  if (!base) return { ok: false, reason: "not-found" }

  // 🔒 `id` НЕ ПРАВИТСЯ НИКОГДА, ЧЕМ БЫ ЕГО НИ ПРИСЛАЛИ. Он вечен по закону, и
  // защита стоит здесь, а не только в форме: дверь видна в любой вкладке
  // разработчика, а форма — нет.
  const { id: _ignored, ...safe } = patch as Record<string, unknown>
  const next = mergePatch(base, { ...safe, updatedAt: new Date().toISOString() })

  // Проверка щадящая — та же, что на чтении: неверный ключ падает на умолчание,
  // незнакомый проходит. Строгая означала бы отказ целого досье из-за одного поля.
  const checked = validateConfig(
    productDossierSchema,
    { ...DEFAULT_PRODUCT_DOSSIER, ...next },
    { ...DEFAULT_PRODUCT_DOSSIER, id },
    `PRODUCTS-CONFIG/${id}`,
  )

  const w = writeAtomic(dossierPath(id), next)
  if (!w.ok) return { ok: false, reason: "write-failed", detail: w.detail }
  return { ok: true, product: checked }
}
