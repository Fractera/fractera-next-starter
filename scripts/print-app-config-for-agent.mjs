#!/usr/bin/env node
// print-app-config-for-agent — prints WHAT THIS APPLICATION IS, for an agent starting a session.
//
// The app's identity (name, description, brand, SEO, author, organization) is not in the code: it
// lives in APP-CONFIG/app-config.json on the server, outside git. Without reading it an agent does
// not know what project it is developing.
//
// It prints the BASE (English) slice only. Since step 501 the config also stores translations under
// `i18n.<path>.<lang>`, and the owner may enable up to 82 languages — five fields x 82 languages of
// the same five sentences would fill the context window and add nothing. The dropping happens in
// config/app-config.agent-view.ts; this file is only the command line around it.
//
// Usage:
//   npm run read:app-config          human-readable slice (default)
//   npm run read:app-config -- --json    the same view as JSON, for tooling
//   node scripts/print-app-config-for-agent.mjs
//
// Runs with no server and no running app: it reads the JSON file on disk (or falls back to the
// committed defaults and says so). Exit code: 0 always when it could report; 2 on a usage/tooling
// failure.

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE = join(ROOT, "config", "app-config.agent-view.ts")
// The logic is TypeScript because it is also imported by the app; Node cannot load .ts directly, so
// the script transpiles it with the esbuild that is already a devDependency here. Bundling to a real
// file (not a data: URL) keeps `react` resolvable — the config loader imports it for cache().
const BUILT = join(ROOT, "node_modules", ".cache", "fractera", "app-config-agent-view.mjs")

// The config path is resolved from the working directory (process.cwd()), so pin it to the repo
// root — the command must give the same answer from any directory.
process.chdir(ROOT)

let esbuild
try {
  esbuild = await import("esbuild")
} catch {
  console.error("esbuild is not installed — run `npm install` first (it is a devDependency).")
  process.exit(2)
}

try {
  const result = await esbuild.build({
    entryPoints: [SOURCE],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    packages: "external",
    write: false,
    absWorkingDir: ROOT,
    logLevel: "silent",
  })
  mkdirSync(dirname(BUILT), { recursive: true })
  writeFileSync(BUILT, result.outputFiles[0].text, "utf8")
} catch (err) {
  console.error(`could not compile ${SOURCE}: ${err.message}`)
  process.exit(2)
}

const { getAgentConfigView, renderAgentConfigView } = await import(pathToFileURL(BUILT).href)
const view = getAgentConfigView()

if (process.argv.includes("--json")) console.log(JSON.stringify(view, null, 2))
else console.log(renderAgentConfigView(view))
