import "server-only"
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, unlinkSync } from "fs"
import { dirname, join } from "path"
import { designConfigSchema } from "@/config/design-config.schema"
import { DEFAULT_DESIGN_CONFIG } from "@/config/design-config.defaults"
import { validateConfig } from "@/config/config-validate"

// ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ЭТОТ СЛОЙ ПИШЕТ `DESIGN-CONFIG/design-config.json`
// (шаг 39-2, 2026-08-29).
//
// 🔒 ТРЕТИЙ ПИСАТЕЛЬ, И ОН НАМЕРЕННО ЗЕРКАЛО ДВУХ СОСЕДНИХ. Приёмы те же, что в
// `app-config-writer.ts` и `platform-config-writer.ts`: заплата вместо снимка,
// диск читается в момент записи, запись атомарна через временный файл. Писатель,
// ведущий себя иначе, породил бы вопрос «почему здесь сохранилось, а там нет» —
// и ответ на него пришлось бы искать в трёх файлах вместо одного правила.
//
// 🔒 ЗАПЛАТА ЗАЩИЩАЕТ ЧЕТЫРЕ НЕЗАВИСИМЫЕ ВЕТКИ КОНСТРУКЦИЕЙ. В конфиге живут
// `fonts`, `type`, `shape`, `colors` — и правит их человек ПО ОДНОЙ, в разное
// время: шрифты выбирают в начале, цвет крутят месяцами. Снимок целиком означал
// бы, что сохранение цвета возвращает шрифты к тому, что было отрисовано на
// экране в момент открытия страницы.
//
// 🔒 ГЛУБИНА ЗАПЛАТЫ ЗДЕСЬ БОЛЬШЕ, ЧЕМ У СОСЕДЕЙ, И ЭТО НЕ УКРАШЕНИЕ. `colors`
// содержит две карты — `light` и `dark`, — которые человек настраивает порознь и
// почти никогда не смотрит обе сразу. Слияние обязано спускаться внутрь них,
// иначе правка одного цвета светлой темы стирала бы всю тёмную.
//
// 🔒 `null` СТИРАЕТ КЛЮЧ — единственный способ вернуть значение к умолчанию
// шаблона. «Владелец выбрал чёрный» и «владелец не выбирал» — разные состояния:
// второе обязано следовать за темой проекта, когда та изменится.
//
// 🔒 ЭТОТ ФАЙЛ ОТСЛЕЖИВАЕТСЯ GIT, как и `PLATFORM-CONFIG`: он приезжает с кодом,
// и слияние может привезти чужую версию поверх решений владельца. Известная
// несогласованность двух родов конфигов (`ARCHITECTURE.md` §3.5) — здесь она не
// решается, но знать о ней обязан каждый, кто сюда пишет.

export type WriteResult =
  | { ok: true; config: Record<string, unknown> }
  | { ok: false; reason: "bad-body" | "write-failed"; detail?: string }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

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

/** Путь к файлу — тот же, что у читателя, включая переопределение окружением. */
export function getDesignConfigPath(): string {
  return process.env.DESIGN_CONFIG_PATH ?? join(process.cwd(), "DESIGN-CONFIG", "design-config.json")
}

/**
 * Сырое содержимое файла — БЕЗ умолчаний.
 *
 * 🔒 РАЗНИЦА С ЧИТАТЕЛЕМ РЕШАЮЩАЯ. `getDesignConfig()` отдаёт полную палитру, где
 * невыбранные значения заполнены темой проекта. Записать такую палитру в файл
 * значило бы объявить решением владельца каждый цвет, который он никогда не
 * трогал, — и следующая версия шаблона уже не смогла бы поменять ни одного.
 */
export function readRawDesignConfig(): Record<string, unknown> {
  try {
    const raw = readFileSync(getDesignConfigPath(), "utf8")
    const parsed: unknown = JSON.parse(raw)
    return isPlainObject(parsed) ? parsed : {}
  } catch {
    // Файла нет — законное состояние «владелец ещё ничего не настраивал».
    return {}
  }
}

/** Записать заплату поверх диска. Возвращает то, что теперь лежит в файле. */
export function writeDesignPatch(patch: unknown): WriteResult {
  if (!isPlainObject(patch)) {
    return { ok: false, reason: "bad-body", detail: "patch must be a JSON object" }
  }

  const path = getDesignConfigPath()
  const next = mergePatch(readRawDesignConfig(), patch)

  // Проверка щадящая — та же, что на чтении: неверное значение падает на
  // умолчание, незнакомый ключ проходит. Строгая означала бы отказ целого файла
  // из-за одного ключа, который знает панель и ещё не знает этот шаблон.
  // 🔒 ПРОВЕРЯЕТСЯ КОНФИГ, СЛИТЫЙ С УМОЛЧАНИЯМИ, А ЗАПИСЫВАЕТСЯ ЗАПЛАТА. Разница
  // не косметическая: у конфига четыре ветки, и на диске лежат только те, что
  // владелец трогал. Отдай схеме голый файл — и отсутствие ветки `type` она
  // прочитает как нарушение, напечатав «значения не по схеме заменены
  // умолчаниями» при КАЖДОЙ записи. Предупреждение было бы ложным: ненастроенная
  // ветка — законное состояние, а не ошибка. ✗ поймано зондом 39-2, до сборки.
  validateConfig(designConfigSchema, { ...DEFAULT_DESIGN_CONFIG, ...next }, DEFAULT_DESIGN_CONFIG, "DESIGN-CONFIG")

  const tmp = join(dirname(path), `.design-config.${process.pid}.${Date.now()}.tmp`)
  try {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(tmp, JSON.stringify(next, null, 2) + "\n", "utf8")
    renameSync(tmp, path)
    return { ok: true, config: next }
  } catch (e) {
    if (existsSync(tmp)) {
      try { unlinkSync(tmp) } catch { /* уже нет — тем лучше */ }
    }
    return { ok: false, reason: "write-failed", detail: String(e) }
  }
}
