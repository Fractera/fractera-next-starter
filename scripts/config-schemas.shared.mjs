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

/** Конфиг → откуда берётся схема и куда кладётся её порождённая копия. */
export const CONFIGS = [
  { id: "app", source: "config/app-config.schema.ts", exportName: "appConfigSchema", target: "APP-CONFIG/schema.json" },
  { id: "platform", source: "config/platform-config.schema.ts", exportName: "platformConfigSchema", target: "PLATFORM-CONFIG/schema.json" },
  { id: "design", source: "config/design-config.schema.ts", exportName: "designConfigSchema", target: "DESIGN-CONFIG/schema.json" },
  { id: "products", source: "config/products-config.schema.ts", exportName: "productsConfigSchema", target: "PRODUCTS-CONFIG/schema.json" },
]

const CACHE_DIR = join(ROOT, "node_modules", ".cache", "fractera")

/**
 * Собрать все четыре схемы в JSON Schema.
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
    const built = join(CACHE_DIR, `${cfg.id}-config-schema.mjs`)
    const result = await esbuild.build({
      entryPoints: [join(ROOT, cfg.source)],
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

    const mod = await import(`${pathToFileURL(built).href}?t=${Date.now()}`)
    const schema = mod[cfg.exportName]
    if (!schema) throw new Error(`${cfg.source}: не найден экспорт ${cfg.exportName}`)

    const json = zod.z.toJSONSchema(schema, { io: "input" })
    out.push({ id: cfg.id, target: cfg.target, text: `${JSON.stringify(json, null, 2)}\n` })
  }

  return out
}
