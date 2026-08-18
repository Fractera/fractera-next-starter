// Порождение схем четырёх конфигов — общая половина двух команд.
//
// `build:config-schemas` пишет результат в папки конфигов, `check:config-schemas`
// сверяет с тем, что лежит на диске. Обе обязаны считать схему ОДИНАКОВО, иначе
// гейт начнёт ругаться на файл, который сам же и породил, — поэтому расчёт живёт
// здесь, а команды остаются тонкими.
//
// Схемы написаны на TypeScript (их импортирует приложение), а Node не грузит `.ts`
// напрямую: сборка идёт через `esbuild`, уже стоящий в devDependencies. Приём взят
// у `scripts/print-app-config-for-agent.mjs` — единственного скрипта, который тоже
// читает TypeScript.

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/**
 * Конфиг → откуда берутся схема и умолчания, куда кладутся их порождённые копии.
 *
 * 🔒 УМОЛЧАНИЯ ЛЕЖАТ В ПАПКЕ ДАННЫМИ, А НЕ КОДОМ (2026-08-18). Человек и агент
 * открывают `APP-CONFIG/` и видят `{}` — из чего следует вывод «пусто, работать
 * не может», уже стоивший одной сессии. Правда в том, что файл несёт ТОЛЬКО
 * решения владельца, а отвечает система умолчаниями. Значит умолчания обязаны
 * лежать там же, где их ищут.
 *
 * Но `.ts` в папку данных класть нельзя: рядом оказались бы файлы с разными
 * законами жизни — один применяется сразу, другой требует пересборки. Поэтому
 * единственное определение остаётся в `config/<x>-config.defaults.ts`, а сюда
 * приезжает его порождённая копия. Разойтись они не могут: копию пишет скрипт, а
 * гейт `check:config-schemas` падает, если она устарела.
 */
export const CONFIGS = [
  {
    id: "app",
    source: "config/app-config.schema.ts",
    exportName: "appConfigSchema",
    target: "APP-CONFIG/schema.json",
    defaultsSource: "config/app-config.defaults.ts",
    defaultsExport: "DEFAULT_APP_CONFIG",
    defaultsTarget: "APP-CONFIG/defaults.json",
  },
  {
    id: "platform",
    source: "config/platform-config.schema.ts",
    exportName: "platformConfigSchema",
    target: "PLATFORM-CONFIG/schema.json",
    // 🔒 У ЭТОГО КОНФИГА УМОЛЧАНИЯ — НЕ ПУСТОЙ ФАЙЛ, А ДЕВЯТЬ ВЫКЛЮЧАТЕЛЕЙ.
    // Пустой `{}` на диске означает «владелец не высказался», и отвечает за него
    // `FEATURE_DEFAULTS`: именно его и надо показать тому, кто открыл папку.
    defaultsSource: "config/platform-config.defaults.ts",
    defaultsExport: "FEATURE_DEFAULTS",
    defaultsTarget: "PLATFORM-CONFIG/defaults.json",
  },
  {
    id: "design",
    source: "config/design-config.schema.ts",
    exportName: "designConfigSchema",
    target: "DESIGN-CONFIG/schema.json",
    defaultsSource: "config/design-config.defaults.ts",
    defaultsExport: "DEFAULT_DESIGN_CONFIG",
    defaultsTarget: "DESIGN-CONFIG/defaults.json",
  },
  {
    id: "products",
    source: "config/products-config.schema.ts",
    exportName: "productsConfigSchema",
    target: "PRODUCTS-CONFIG/schema.json",
    defaultsSource: "config/products-config.defaults.ts",
    defaultsExport: "DEFAULT_PRODUCTS_CONFIG",
    defaultsTarget: "PRODUCTS-CONFIG/defaults.json",
  },
]

const CACHE_DIR = join(ROOT, "node_modules", ".cache", "fractera")

/** Собрать модуль TypeScript и загрузить его — Node не грузит `.ts` напрямую. */
async function loadModule(esbuild, source, cacheName) {
  const built = join(CACHE_DIR, cacheName)
  const result = await esbuild.build({
    entryPoints: [join(ROOT, source)],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    packages: "external",
    write: false,
    absWorkingDir: ROOT,
    logLevel: "silent",
  })
  mkdirSync(dirname(built), { recursive: true })
  writeFileSync(built, result.outputFiles[0].text, "utf8")
  return import(`${pathToFileURL(built).href}?t=${Date.now()}`)
}

/**
 * Собрать порождаемые файлы всех четырёх конфигов: схему и умолчания.
 *
 * Возвращает массив `{ id, target, text }`, где `text` — уже готовый текст файла
 * с переводом строки в конце: сравнивать и записывать надо одно и то же значение,
 * иначе гейт поймает собственный перевод строки.
 */
export async function renderSchemas() {
  let esbuild
  try {
    esbuild = await import("esbuild")
  } catch {
    throw new Error("esbuild не установлен — выполните `npm install` (он в devDependencies).")
  }

  const zod = await import("zod")
  const out = []

  for (const cfg of CONFIGS) {
    const schemaMod = await loadModule(esbuild, cfg.source, `${cfg.id}-config-schema.mjs`)
    const schema = schemaMod[cfg.exportName]
    if (!schema) throw new Error(`${cfg.source}: не найден экспорт ${cfg.exportName}`)

    const json = zod.z.toJSONSchema(schema, { io: "input" })
    out.push({ id: cfg.id, target: cfg.target, text: `${JSON.stringify(json, null, 2)}\n` })

    const defaultsMod = await loadModule(esbuild, cfg.defaultsSource, `${cfg.id}-config-defaults.mjs`)
    const defaults = defaultsMod[cfg.defaultsExport]
    if (defaults === undefined) {
      throw new Error(`${cfg.defaultsSource}: не найден экспорт ${cfg.defaultsExport}`)
    }
    // `JSON.stringify` роняет ключи со значением `undefined` — и это правда о них:
    // поле, которого нет, отличается от поля, заданного пустой строкой.
    out.push({
      id: `${cfg.id}-defaults`,
      target: cfg.defaultsTarget,
      text: `${JSON.stringify(defaults, null, 2)}\n`,
    })
  }

  return out
}
