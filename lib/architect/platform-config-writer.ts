import "server-only"
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, unlinkSync } from "fs"
import { dirname, join } from "path"
import { platformConfigSchema } from "@/config/platform-config.schema"
import { DEFAULT_PLATFORM_CONFIG_FILE } from "@/config/platform-config.defaults"
import { validateConfig } from "@/config/config-validate"

// ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ЭТОТ СЛОЙ ПИШЕТ `PLATFORM-CONFIG/platform-config.json`
// (шаг 31-12, 2026-08-29).
//
// 🔒 ЗЕРКАЛО СОСЕДНЕГО `app-config-writer.ts`, И ЭТО НАМЕРЕННО. Два писателя
// конфигов, ведущие себя по-разному, — источник вопросов «почему здесь
// сохранилось, а там нет». Приёмы те же: заплата вместо снимка, диск читается в
// момент записи, запись атомарна.
//
// 🔒 НО ОДНО ОТЛИЧИЕ ЕСТЬ, И ОНО ВАЖНОЕ: ЭТОТ ФАЙЛ ОТСЛЕЖИВАЕТСЯ GIT. Соседний
// `APP-CONFIG` лежит вне git и развёртывание его не трогает; этот приезжает с
// кодом, и слияние может привезти чужую версию поверх решений владельца. Это
// известная несогласованность двух соседних конфигов (`ARCHITECTURE.md` §3.5), и
// не нам её решать здесь — но знать о ней обязан каждый, кто сюда пишет.
//
// 🔒 ЗАПЛАТА ЗАЩИЩАЕТ ЧУЖИЕ ВЕТКИ КОНСТРУКЦИЕЙ. В этом файле живут не только наши
// ключи: режим разработки, выключатели документов агента, состояние переезда,
// команды. Прислать снимок целиком значило бы затирать всё это при каждом
// сохранении одной галочки — а панель пишет сюда же, из другого процесса.
//
// 🔒 `null` СТИРАЕТ КЛЮЧ, и это единственный способ вернуть возможность к
// умолчанию шаблона. «Выключено владельцем» и «не решалось» — разные состояния,
// и читатель их различает (`decided` в `PlatformConfig`).

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
export function getPlatformConfigPath(): string {
  return process.env.PLATFORM_CONFIG_PATH ?? join(process.cwd(), "PLATFORM-CONFIG", "platform-config.json")
}

/**
 * Сырое содержимое файла — БЕЗ умолчаний.
 *
 * 🔒 ЗДЕСЬ РАЗНИЦА С ЧИТАТЕЛЕМ ОСОБЕННО ВЕЛИКА. `getPlatformConfig()` отдаёт
 * полную картину: одиннадцать выключателей со значениями и отдельную карту
 * «решал ли владелец». Записать такую картину в файл значило бы объявить решением
 * владельца каждое умолчание шаблона — и следующая версия шаблона уже не смогла
 * бы поменять ни одного.
 */
export function readRawPlatformConfig(): Record<string, unknown> {
  try {
    const raw = readFileSync(getPlatformConfigPath(), "utf8")
    const parsed: unknown = JSON.parse(raw)
    return isPlainObject(parsed) ? parsed : {}
  } catch {
    // Файла нет — законное состояние «владелец ещё ничего не настраивал».
    return {}
  }
}

/** Записать заплату поверх диска. Возвращает то, что теперь лежит в файле. */
export function writePlatformPatch(patch: unknown): WriteResult {
  if (!isPlainObject(patch)) {
    return { ok: false, reason: "bad-body", detail: "patch must be a JSON object" }
  }

  const path = getPlatformConfigPath()
  const next = mergePatch(readRawPlatformConfig(), patch)

  // Проверка щадящая — та же, что на чтении: неверный ключ падает на умолчание,
  // незнакомый проходит. Строгая означала бы отказ целого файла из-за одного
  // ключа, который панель уже знает, а этот шаблон ещё нет.
  validateConfig(platformConfigSchema, { ...DEFAULT_PLATFORM_CONFIG_FILE, ...next }, DEFAULT_PLATFORM_CONFIG_FILE, "PLATFORM-CONFIG")

  const tmp = join(dirname(path), `.platform-config.${process.pid}.${Date.now()}.tmp`)
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
