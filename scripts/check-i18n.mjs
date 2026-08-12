// check-i18n — сторож словарей интерфейса.
//
// 🔒 ЗАЧЕМ. Словарь на 82 языка глазами не проверяют: пропущенный ключ в сорок
// седьмом языке роняет сборку типами, лишний язык тихо не работает, а язык,
// написанный не в том порядке, ломает сравнение при следующей правке. Всё это
// находится за секунду скриптом и за час — руками.
//
// Проверяются ДВЕ вещи, и обе — по факту, а не по обещанию:
//   • сколько языков в словаре против ожидаемого числа;
//   • есть ли в КАЖДОМ языке все ключи, объявленные в его типе.
//
// Список файлов ведётся здесь руками намеренно: новый словарь должен попадать
// под охрану осознанно, вместе с решением, сколько языков он обязан нести.
// Автоматический обход папок молча пропустил бы файл, названный иначе.

import fs from "fs"

/** [файл, имя типа, сколько языков обязано быть] */
const FILES = [
  // Переиспользуемые части продукта — всегда 82 (правило 4д).
  ["components/cart/cart.i18n.ts", "CartUi", 82],
  ["components/menu/account/account-menu.i18n.ts", "AccountLabels", 82],
  // Служебные слова верхнего меню: бургер и aria-подписи ящиков. Жили внутри
  // компонента на шести языках — то есть на семьдесят шестом рынке бургер молча
  // звался "Menu". Переиспользуемая часть продукта обязана говорить на всех.
  ["components/menu/top/top-menu.i18n.ts", "TopMenuUi", 82],
  // Согласие на cookie, написанное не на языке посетителя, юридически
  // бесполезно — это не «непереведённая строка», а несостоявшееся согласие.
  ["app/[lang]/_components/legal/cookie-banner.i18n.ts", "BannerStrings", 82],
  ["components/menu/footer/cookie-settings-button.i18n.ts", "CookieButtonUi", 82],
  ["app/[lang]/(protectedLayer)/_data/products.i18n.ts", "ProductListUi", 82],
  // Словарь ОДНОЙ страницы — идёт по включённому набору
  // (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`), сегодня `en,ru`. Число здесь стоит
  // намеренно маленькое: требовать 82 от страничного словаря значит объявлять
  // долгом работу, которой никто не заказывал. Владелец включит третий язык —
  // поднимет и это число.
  ["app/[lang]/_data/home.i18n.ts", "HomeUi", 2],
  // Страницы четырёх слоёв прав.
  ["app/[lang]/(protectedLayer)/(staff)/manage/products/_data/ui.i18n.ts", "ProductsUi", 82],
  ["app/[lang]/(protectedLayer)/(finance)/accounting/products/_data/ui.i18n.ts", "AccountingProductsUi", 82],
  ["app/[lang]/(protectedLayer)/(admin)/administration/products/_data/ui.i18n.ts", "AdministrationProductsUi", 82],
  ["app/[lang]/(protectedLayer)/(account)/shopping/products/_data/ui.i18n.ts", "ShoppingProductsUi", 82],
]

// 🔒 ЦИФРЫ В ИМЕНИ КЛЮЧА ОБЯЗАТЕЛЬНЫ В ШАБЛОНЕ. `step1`, `step2` — обычные
// имена, а шаблон без цифр молча терял их и объявлял неполный словарь полным:
// проверка, пропускающая часть ключей, опаснее отсутствующей.
const KEY_RE = /^ {2}([a-zA-Z][a-zA-Z0-9]*)\??:/gm
const LANG_RE = /^ {2}([a-z]{2,3}(?:-[A-Za-z]+)?): \{/gm

let bad = 0
for (const [file, type, want] of FILES) {
  if (!fs.existsSync(file)) {
    console.log(`  НЕТ ФАЙЛА  ${file}`)
    bad++
    continue
  }
  const src = fs.readFileSync(file, "utf8")

  const typeBlock = src.match(new RegExp(`export type ${type} = \\{([\\s\\S]*?)\\n\\}`))
  const keys = typeBlock ? [...typeBlock[1].matchAll(KEY_RE)].map(m => m[1]) : []

  // Языковая запись читается СЧЁТОМ СКОБОК, а не строкой: словари бывают в двух
  // видах — однострочном (`  fr: { … },`) и многострочном, и проверка, знающая
  // только один из них, объявляет второй сломанным. Это уже случилось.
  const langs = []
  const entries = []
  for (const m of src.matchAll(LANG_RE)) {
    const start = m.index + m[0].length - 1 // на открывающей `{`
    let depth = 0
    let q = null
    let end = start
    for (let i = start; i < src.length; i++) {
      const ch = src[i]
      if (q) {
        if (ch === "\\") i++
        else if (ch === q) q = null
        continue
      }
      if (ch === "'" || ch === '"' || ch === "`") { q = ch; continue }
      if (ch === "{") depth++
      else if (ch === "}") { depth--; if (depth === 0) { end = i; break } }
    }
    langs.push(m[1])
    entries.push([m[1], src.slice(start, end + 1)])
  }

  const holes = []
  for (const [lang, body] of entries) {
    for (const k of keys) {
      if (!new RegExp(`[{,]\\s*${k}:`).test(body)) holes.push(`${lang}.${k}`)
    }
  }

  const ok = langs.length === want && keys.length > 0 && holes.length === 0
  if (!ok) bad++
  const head = ok ? "  OK   " : "  БЕДА "
  let line = `${head} ${file}\n         языков ${langs.length}/${want}, ключей ${keys.length}`
  if (!keys.length) line += " — ТИП НЕ РАЗОБРАН"
  if (holes.length) {
    line += `\n         не хватает: ${holes.slice(0, 8).join(", ")}`
    if (holes.length > 8) line += ` (+${holes.length - 8})`
  }
  console.log(line)
}

console.log(bad ? `\n===I18N_FAILED=== проблемных словарей: ${bad}` : "\n===I18N_OK=== все словари полны")
process.exit(bad ? 1 : 0)
