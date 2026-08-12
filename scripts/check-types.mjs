// check:types — проверка типов ИСХОДНИКОВ, без сгенерированных артефактов.
//
// 🔒 ЗАЧЕМ ОБЁРТКА, А НЕ ПРОСТО `tsc --noEmit`. Next кладёт в `.next/types`
// сгенерированный валидатор маршрутов, и он отстаёт от дерева: удалили папку
// страницы — валидатор ещё помнит её и даёт десятки «модуль не найден». Голый
// `tsc` из-за этого красный ВСЕГДА, а гейт, который всегда красный, перестают
// читать в тот же день — и он не ловит уже ничего.
//
// Здесь ошибки артефактов отбрасываются, а ошибки исходников — нет. Их наличие
// и решает судьбу проверки.

import { spawnSync } from "node:child_process"

const res = spawnSync("npx", ["tsc", "--noEmit"], { encoding: "utf8", shell: true })
const lines = `${res.stdout ?? ""}${res.stderr ?? ""}`.split(/\r?\n/)

const GENERATED = /^\.next[\\/]/
// 🔒 ШАБЛОН НЕ ИМЕЕТ ПРАВА ОБРЫВАТЬСЯ НА СКОБКЕ. Первая версия искала
// `^[^(]*\(\d+,\d+\): error` — то есть «до первой скобки», — и молча пропускала
// ВСЁ, что лежит в группах маршрутов: `app/[lang]/(footerPages)/…`. Проверка
// была зелёной на файле с явной ошибкой типа; поймал это отрицательный
// контроль, а не чтение кода. Поэтому позиция ищется в любом месте строки.
const source = lines.filter((l) => /\(\d+,\d+\): error TS\d+/.test(l) && !GENERATED.test(l))
const generated = lines.filter((l) => GENERATED.test(l) && /error/.test(l))

for (const l of source) console.log(l)

if (generated.length) {
  console.log(`\n  (пропущено ошибок в сгенерированных типах .next: ${generated.length} — артефакт сборки, не код)`)
}

if (source.length === 0) {
  console.log("\n===TYPES_OK=== ошибок в исходниках нет")
  process.exit(0)
}
console.log(`\n===TYPES_FAILED=== ошибок в исходниках: ${source.length}`)
process.exit(1)
