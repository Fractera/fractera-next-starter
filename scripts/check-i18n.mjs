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
  ["app/[lang]/_components/cookie-banner/cookie-banner.i18n.ts", "BannerStrings", 82],
  ["components/menu/footer/cookie-settings-button.i18n.ts", "CookieButtonUi", 82],
  // 🔒 СЛОВАРИ МОДАЛЬНЫХ ОКОН (внесены 2026-08-17 вместе с единым примитивом).
  // Два из трёх УЖЕ несли 82 языка и всё это время стояли вне охраны: сторож
  // проверяет только то, что ему назвали, а назвать их забыли. Дыра тихая —
  // словарь можно было урезать до десяти языков, и ни один гейт бы не заметил.
  // С этого дня регистрация нового окна в этом списке — часть того же коммита,
  // что и само окно.
  ["components/dialog/app-dialog.i18n.ts", "AppDialogUi", 82],
  ["components/auth/access-gate.i18n.ts", "AccessGateUi", 82],
  ["_tools/translations-dialog/types/translations-dialog.i18n.ts", "TranslationsUi", 82],
  // Слова публичного каталога и подписи движка материалов — тот же страничный
  // слой, тот же набор из десяти готовых переводов (шаг 507). До этого шага их
  // не проверял никто: словарь каталога отсутствовал в списке, а два словаря
  // движка были написаны в форме, которой сторож не понимает.
  ["lib/content/page-ui.ts", "PageUi", 10],
  ["lib/content/post-body-ui.ts", "PostBodyUi", 10],
  // Кнопка в подвале и кнопка на главной, ведущие на страницу архитектуры
  // (шаг 510). Десять языков — тот же страничный набор, что у остальных строк
  // этой поверхности (правило 4д): не переиспользуемый элемент, а слова ОДНОЙ
  // площадки, поэтому не 82.
  ["lib/i18n/architecture-link.i18n.ts", "ArchitectureLinkUi", 10],
  // Каталог секций — страница архитектора, но слова у неё такие же страничные.
  ["app/[lang]/(protectedLayer)/(admin)/blocks/_data/ui.i18n.ts", "BlocksCatalogueUi", 10],
  // 🔒 СЛОВАРИ ВИДЖЕТОВ — ДЕСЯТЬ ЯЗЫКОВ, А НЕ 82 (шаг 521, решение владельца
  // 2026-08-21). Здесь стоял ОДИН словарь `_data/products.i18n.ts` на 82 языка,
  // общий для четырёх таблиц; он и заставлял их говорить одинаково. Таблицы
  // разобраны по маршрутам, и каждая получила свои слова.
  //
  // Почему десять, а не восемьдесят два: набор страничный (правило 4д) —
  // виджет принадлежит ОДНОМУ маршруту и не переиспользуется, а 82 обязаны
  // нести переиспользуемые части продукта, которые являются в любом включённом
  // языке сами. Цена размена названа в шапке каждого словаря.
  ["app/[lang]/(protectedLayer)/(finance)/accounting/products/_widgets/dynamic/price-table/ui.i18n.ts", "PriceTableUi", 10],
  ["app/[lang]/(protectedLayer)/(staff)/manage/products/_widgets/dynamic/manage-table/ui.i18n.ts", "ManageTableUi", 10],
  ["app/[lang]/(protectedLayer)/(admin)/administration/products/_widgets/dynamic/catalogue-table/ui.i18n.ts", "CatalogueTableUi", 10],
  ["app/[lang]/(protectedLayer)/(account)/shopping/products/_widgets/dynamic/shop-table/ui.i18n.ts", "ShopTableUi", 10],
  ["app/[lang]/(protectedLayer)/(staff)/manage/products/[productId]/_widgets/dynamic/product-card/ui.i18n.ts", "ProductCardUi", 10],
  // Страницы четырёх слоёв прав.
  ["app/[lang]/(protectedLayer)/(staff)/manage/products/_data/ui.i18n.ts", "ProductsUi", 82],
  ["app/[lang]/(protectedLayer)/(finance)/accounting/products/_data/ui.i18n.ts", "AccountingProductsUi", 82],
  ["app/[lang]/(protectedLayer)/(admin)/administration/products/_data/ui.i18n.ts", "AdministrationProductsUi", 82],
  ["app/[lang]/(protectedLayer)/(account)/shopping/products/_data/ui.i18n.ts", "ShoppingProductsUi", 82],
]

/**
 * ВТОРАЯ ФОРМА СЛОВАРЯ — ЯЗЫКОВЫЕ ЯЧЕЙКИ (шаг 508).
 *
 * 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ СПИСОК. Публичные поверхности хранят слова не одним файлом
 * с картой языков, а ПАПКОЙ: `_data/en.ts`, `ru.ts`, … — по файлу на язык, как
 * у поста блога. Сторож, знающий только первую форму, такие словари не видел
 * вовсе: у индекса блога и у каталога не проверялся НИ ОДИН ключ, и пропущенная
 * строка в девятом языке доехала бы до клиента.
 *
 * [папка, файл типа, имя типа, сколько языков]
 */
const CELLS = [
  ["app/[lang]/(publicLayer)/blog/_data", "app/[lang]/(publicLayer)/blog/_lib/types.ts", "BlogUi", 10],
  ["app/[lang]/(publicLayer)/products/_data", "app/[lang]/(publicLayer)/products/_lib/types.ts", "CatalogueUi", 10],
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

  // 🔒 СЛОВАРЬ МОЖЕТ ЖИТЬ В JSON РЯДОМ (владелец 2026-08-14). Переводы делает
  // внешняя модель и возвращает их файлом, поэтому слова уехали из кода в
  // `<имя>.json`, а тип остался здесь и по-прежнему решает всё. Сторож обязан
  // знать оба вида: иначе переезд словаря читается как «языков 0» — то есть
  // проверка объявляет поломкой ровно то, ради чего её и держат.
  const jsonPath = file.replace(/\.ts$/, ".json")
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
    const langs = Object.keys(data)
    const holes = []
    for (const lang of langs) {
      for (const k of keys) {
        const v = data[lang]?.[k]
        if (typeof v !== "string" || !v.trim()) holes.push(`${lang}.${k}`)
      }
    }
    const ok = langs.length === want && keys.length > 0 && holes.length === 0
    if (!ok) bad++
    let line = `${ok ? "  OK   " : "  БЕДА "} ${file}\n         языков ${langs.length}/${want}, ключей ${keys.length} (слова в ${jsonPath.split("/").pop()})`
    if (!keys.length) line += " — ТИП НЕ РАЗОБРАН"
    if (holes.length) {
      line += `\n         не хватает: ${holes.slice(0, 8).join(", ")}`
      if (holes.length > 8) line += ` (+${holes.length - 8})`
    }
    console.log(line)
    continue
  }

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

// ── Вторая форма: языковые ячейки ──────────────────────────────────────────
for (const [dir, typeFile, type, want] of CELLS) {
  if (!fs.existsSync(dir) || !fs.existsSync(typeFile)) {
    console.log(`  НЕТ ПАПКИ  ${dir}`)
    bad++
    continue
  }
  const typeSrc = fs.readFileSync(typeFile, "utf8")
  const block = typeSrc.match(new RegExp(`export type ${type} = \\{([\\s\\S]*?)\\n\\}`))
  const keys = block ? [...block[1].matchAll(KEY_RE)].map(m => m[1]) : []
  const cells = fs.readdirSync(dir).filter(f => /^[a-z]{2}\.ts$/.test(f)).map(f => f.replace(".ts", ""))

  const holes = []
  for (const lang of cells) {
    const body = fs.readFileSync(`${dir}/${lang}.ts`, "utf8")
    for (const k of keys) {
      if (!new RegExp(`[{,\\s]${k}:`).test(body)) holes.push(`${lang}.${k}`)
    }
  }

  const ok = cells.length === want && keys.length > 0 && holes.length === 0
  if (!ok) bad++
  let line = `${ok ? "  OK   " : "  БЕДА "} ${dir}/\n         языков ${cells.length}/${want}, ключей ${keys.length} (ячейки)`
  if (!keys.length) line += " — ТИП НЕ РАЗОБРАН"
  if (holes.length) {
    line += `\n         не хватает: ${holes.slice(0, 8).join(", ")}`
    if (holes.length > 8) line += ` (+${holes.length - 8})`
  }
  console.log(line)
}

console.log(bad ? `\n===I18N_FAILED=== проблемных словарей: ${bad}` : "\n===I18N_OK=== все словари полны")
process.exit(bad ? 1 : 0)
