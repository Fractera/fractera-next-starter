// read-menu — состояние верхнего меню одной командой.
//
// 🔒 ЗАЧЕМ ЭТО СУЩЕСТВУЕТ. Меню собирают В ПАНЕЛИ, а живёт оно в файлах, которых
// в репозитории НЕТ: `PLATFORM-CONFIG/platform-config.json` и
// `APP-CONFIG/app-config.json` лежат на сервере вне git. Агент, читающий только
// код, видит компонент без единого пункта и делает единственный доступный ему
// вывод: «меню не существует, надо написать». Дальше он пишет второе — и на
// странице оказываются две шапки, одна из которых не подчиняется владельцу.
//
// Эта команда — единственный способ узнать правду до первой строчки кода.
// Печатает: включено ли меню, откуда берутся пункты, что в нём стоит сейчас, на
// каких языках, и где всё это меняется.
//
// 🔒 РАБОТАЕТ БЕЗ СЕРВЕРА И БЕЗ ФАЙЛОВ. Нет конфигов — так и говорит: значит
// владелец ещё ничего не настраивал, и это состояние, а не сбой.

import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const read = (p) => { try { return fs.readFileSync(p, "utf8") } catch { return null } }
const json = (p) => { const t = read(p); if (!t) return null; try { return JSON.parse(t) } catch { return null } }

const platform = json(path.join(ROOT, "PLATFORM-CONFIG", "platform-config.json"))
const app = json(path.join(ROOT, "APP-CONFIG", "app-config.json"))
const env = read(path.join(ROOT, ".env.local")) ?? ""

const langs = (env.match(/^NEXT_PUBLIC_SUPPORTED_LANGUAGES=(.*)$/m)?.[1] ?? "")
  .split(",").map((s) => s.trim()).filter(Boolean)
const base = env.match(/^NEXT_PUBLIC_DEFAULT_LOCALE=(.*)$/m)?.[1]?.trim() || langs[0] || "en"

// Значение по умолчанию продублировано из `config/platform-config.ts`: скрипт
// исполняется отдельным процессом до сборки и импортировать TypeScript не может.
const menuOn = typeof platform?.features?.topMenu === "boolean" ? platform.features.topMenu : true
const authOn = typeof platform?.features?.auth === "boolean"
  ? platform.features.auth
  : /^NEXT_PUBLIC_APP_SHELL_AUTH=(left|right)/m.test(env)

const nav = app?.nav
const items = Array.isArray(nav?.top) ? nav.top : null

console.log("")
console.log("ВЕРХНЕЕ МЕНЮ ЭТОГО ПРИЛОЖЕНИЯ")
console.log("=============================")
console.log("")
console.log(`  выключатель «Верхнее меню»   ${menuOn ? "ВКЛЮЧЁН" : "ВЫКЛЮЧЕН"}`)
console.log(`  кнопка входа и корзина       ${authOn ? "ВКЛЮЧЕНЫ (всегда справа)" : "выключены"}`)
console.log(`  языки приложения             ${langs.length ? langs.join(", ") : "не заданы"}  (основной: ${base})`)
console.log("")

if (!menuOn) {
  console.log("  Меню выключено владельцем — на сайте его нет вовсе.")
  console.log("  Включается в панели управления: раздел «Возможности приложения».")
} else if (items === null) {
  console.log("  Ветки `nav` в настройках НЕТ: владелец ещё не открывал раздел меню.")
  console.log("  Пункты сейчас берутся из манифестов групп на диске (`_data/group.ts`).")
} else if (items.length === 0) {
  console.log("  Меню включено, но кнопок в нём НЕТ — владелец убрал все.")
  console.log("  На сайте видна полоса с логотипом. Это законное состояние, а не поломка.")
} else {
  console.log(`  Кнопок: ${items.length}`)
  for (const it of items) {
    const kids = Array.isArray(it.children) ? it.children : []
    const translated = langs
      .filter((l) => l !== base && app?.i18n?.[`nav.top.${it.id}.label`]?.[l])
      .length
    console.log(`    • ${String(it.label ?? "").padEnd(14)} ${String(it.href ?? "(группа)").padEnd(22)} переводов: ${translated}/${Math.max(langs.length - 1, 0)}`)
    for (const c of kids) console.log(`        └ ${String(c.label ?? "").padEnd(12)} ${c.href ?? ""}`)
  }
}

console.log("")
console.log("  ГДЕ ЭТО МЕНЯЕТСЯ: панель управления → «Верхнее меню». Не в коде.")
console.log("  Настройка применяется БЕЗ пересборки — приложение читает её на рендере.")
console.log("")
console.log("  Подпись кнопки — не длиннее 12 знаков, иначе обрезается многоточием.")
console.log("")
console.log("  🔒 ВТОРОЕ МЕНЮ НЕ СТРОИТЬ. Шапка уже есть:")
console.log("     components/menu/top/top-menu.server.tsx")
console.log("     Нужен другой ВИД — меняйте её оформление. Нужны другие ПУНКТЫ —")
console.log("     это настройка владельца, а не код. Своя вторая шапка даст две")
console.log("     полосы на странице, и вашей владелец управлять не сможет.")
console.log("")
