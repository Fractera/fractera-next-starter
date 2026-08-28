// Порождает `sections/BLOCKS.md` — сводку по всем видам секций.
//
// 🔒 ЗАЧЕМ ОНА СУЩЕСТВУЕТ. Агент выбирает вид ДО того, как открывать файлы: каталог
// закрыт, видов почти три десятка, и читать двадцать девять рендереров ради выбора
// одного — расход контекста на пустом месте. Сводка отвечает на единственный вопрос
// момента выбора: какие виды есть, что каждый несёт и у кого есть карточка с
// правилами владельца.
//
// 🔒 ПОРОЖДАЕТСЯ, А НЕ ПИШЕТСЯ РУКАМИ — как `API-MAP.md`. Список, который ведут
// вручную, устаревает первым: новый вид появляется в коде, а в сводке его нет, и
// агент честно им не пользуется. Здесь источник один — сам код.
//
//   node scripts/build-blocks-map.mjs      порождает файл
//   node scripts/check-blocks-map.mjs      проверяет свежесть (в prebuild)

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const TYPES = join(ROOT, "lib", "content", "blocks", "types.ts")
const INDEX = join(ROOT, "sections", "index.ts")
const BLOCKS = join(ROOT, "sections", "blocks")
export const TARGET = join(ROOT, "sections", "BLOCKS.md")
export const CATALOGUE = join(ROOT, "sections", "SECTIONS.json")
const TAXONOMY = join(ROOT, "sections", "taxonomy.json")

// 🔒 ИСТОЧНИК ВИДОВ — РЕЕСТР `SECTIONS`, А НЕ РАЗБОР ТИПОВ. Первая редакция читала
// объединение `Block` регулярным выражением и нашла 24 вида из 29: определения с
// вложенными фигурными скобками (`metrics`, `flow`, `hero`, …) обрывались на первой
// закрывающей. Неполная сводка ХУЖЕ отсутствующей — по ней агент честно не возьмёт
// вид, которого «нет». Реестр же и есть закон: рендерер, не названный в нём, не
// существует для приложения.
function readKinds() {
  const src = readFileSync(INDEX, "utf8")
  const body = src.slice(src.indexOf("export const SECTIONS"))
  const inner = body.slice(body.indexOf("{") + 1, body.indexOf("}"))
  const kinds = inner.split(",").map(x => x.trim()).filter(Boolean)

  // Поля — по возможности из типов; не разобрались — честный прочерк, а не догадка.
  const typeLines = readFileSync(TYPES, "utf8").split("\n")
  return kinds.map(kind => {
    // Берём СТРОКУ ОБЪЯВЛЕНИЯ, а не первое вхождение имени: имя вида встречается и
    // в комментариях выше, и тогда в колонку полей уезжал сам ключ.
    const line = typeLines.find(l => l.trimStart().startsWith("|") && l.includes(`kind: '${kind}'`))
    let fields = ""
    if (line) {
      fields = line
        .replace(/^\s*\|\s*\{/, "")
        // 🔒 ЦИФРА В ИМЕНИ ВИДА — ЗАКОННА (`h2`, `h3`). Здесь стояло `[a-zA-Z]+`, и
        // у этих двух ключ не вычищался, уезжая в колонку полей.
        .replace(/kind:\s*'[a-zA-Z0-9]+';?/, "")
        .replace(/\}\s*$/, "")
        .trim()
    }
    // Труба ломает разметку таблицы — экранируем.
    return { kind, fields: fields.replace(/\|/g, "\\|") }
  })
}

/** Первая содержательная строка карточки — её и показываем как «что это». */
function cardSummary(kind) {
  const file = join(BLOCKS, `${kind}.md`)
  if (!existsSync(file)) return null
  const lines = readFileSync(file, "utf8").split("\n")
  const head = lines.find(l => l.startsWith("# "))
  return {
    title: head ? head.replace(/^#\s*/, "").trim() : kind,
  }
}

/** Таксономия читается один раз: её спрашивают и сводка, и каталог. */
const TAXONOMY_DATA = JSON.parse(readFileSync(TAXONOMY, "utf8"))

/**
 * Тип вида — из таксономии, а не из прозы карточки.
 *
 * 🔒 ЗДЕСЬ СТОЯЛ РАЗБОР СТРОКИ «**Семейство:**», И КОЛОНКА БЫЛА ПУСТА ЦЕЛИКОМ
 * (найдено 2026-08-22). Карточки давно пишутся по-английски и говорят
 * «**Type:**» — совпадений не находилось ни разу, и в порождённой сводке во всех
 * двадцати девяти строках стоял прочерк. Дефект ровно того сорта, что этот файл
 * заводился ловить: сводка выглядит целой, а одна её колонка не значит ничего.
 *
 * Источник теперь тот же, что у панели, — `taxonomy.json`. Он знает тип КАЖДОГО
 * вида, а не только тех одиннадцати, у которых есть карточка, и не зависит от
 * языка, на котором карточка написана.
 */
function familyOf(kind) {
  const t = TAXONOMY_DATA.kinds[kind]
  const type = TAXONOMY_DATA.types.find(x => x.id === (t?.type ?? "page-material"))
  return type?.title?.en ?? null
}

export function render() {
  const kinds = readKinds()
  const renderers = readdirSync(BLOCKS).filter(f => f.endsWith(".server.tsx")).length

  const rows = kinds.map(({ kind, fields }) => {
    const card = cardSummary(kind)
    const what = card ? card.title.replace(/^[a-zA-Z]+\s*—\s*/, "") : "—"
    const family = familyOf(kind) ?? "—"
    const mark = card ? `[карточка](blocks/${kind}.md)` : "—"
    return `| \`${kind}\` | ${family} | ${what} | ${fields || "—"} | ${mark} |`
  })

  return [
    "# Каталог видов секций",
    "",
    "> **Файл порождается.** `npm run build:blocks-map`; свежесть стережёт `check:blocks-map` в",
    "> `prebuild`. Правки руками теряются при первом же порождении — правьте типы и карточки.",
    "",
    "Сводка нужна в момент ВЫБОРА вида: она отвечает, что вообще есть, и не заставляет открывать",
    "двадцать девять рендереров. Но она не заменяет карточку: **каталог говорит, что вид СУЩЕСТВУЕТ,",
    "и только карточка говорит, что он выдержит** — сколько элементов, что ломается за пределом, когда",
    "его не брать. Есть карточка — прочти её перед использованием.",
    "",
    `Видов: **${kinds.length}** · рендереров: **${renderers}** · карточек: **${kinds.filter(k => cardSummary(k.kind)).length}**`,
    "",
    "| Вид | Семейство | Что это | Поля | Правила владельца |",
    "|---|---|---|---|---|",
    ...rows,
    "",
    "## Чего в этой таблице нет",
    "",
    "**Вместимости.** Сколько карточек влезает в `cards`, сколько чисел в `metrics`, что происходит с",
    "неполным рядом — этого из типа не видно, потому что тип принимает массив любой длины, а сетка",
    "рассчитана на кратность. Это живёт в карточке вида, и там же живут правила владельца, сказанные",
    "по конкретному поводу.",
    "",
    "**Карточка рождается, когда о виде что-то узнали** — обычно когда владелец поправил внешность и",
    "объяснил почему. Пустая карточка, написанная ради полноты таблицы, не учит никого.",
    "",
  ].join("\n")
}

// 🔒 РЯДОМ ЛЕЖИТ `sections/descriptions.json` — И ОН НЕ ПОРОЖДАЕТСЯ.
// Туда панель пишет описания секций, написанные ВЛАДЕЛЬЦЕМ. Держать их в
// порождаемом каталоге нельзя: сторож свежести уронил бы следующую сборку сразу
// после того, как владелец нажал «Сохранить». Два файла, два автора, один читатель.
//
// КАТАЛОГ ДЛЯ ПАНЕЛИ — `sections/SECTIONS.json`.
//
// 🔒 ПАНЕЛЬ И ПРИЛОЖЕНИЕ — РАЗНЫЕ ПРИЛОЖЕНИЯ, и код рендереров панель импортировать
// не может. Поэтому источник остаётся здесь, а панель читает готовые ДАННЫЕ из
// слота (`APP_DIR`). Дублирования каталога не возникает: этот файл порождается из
// реестра, таксономии и карточек — трёх мест, которые и так существуют.
//
// 🔒 ВИДА НЕТ В ТАКСОНОМИИ — ОН НЕ ПРОПАДАЕТ, а падает в «материал страницы» с
// формой `text`. Новый вид виден на странице секций в тот же день, пусть и в
// последнем типе; молча исчезнуть он не может.
export function renderCatalogue() {
  const taxonomy = TAXONOMY_DATA
  const usage = scanUsage()
  const kinds = readKinds().map(({ kind, fields }) => {
    const t = taxonomy.kinds[kind] ?? { id: null, type: "page-material", shape: "text" }
    const card = cardSummary(kind)
    return {
      // 🔒 ЧИСЛОВОЙ НОМЕР — ЧТОБЫ АРХИТЕКТОР НАЗЫВАЛ СЕКЦИЮ БЕЗ ОПЕЧАТОК (владелец
      // 2026-08-22). `heroSplit` и `hero-split` различаются одним знаком, и агент,
      // получив второе, честно не найдёт ничего. `0002` не перепутать.
      id: t.id ?? null,
      kind,
      type: t.type,
      shape: t.shape ?? "text",
      // Труба экранировалась для разметки таблицы — в данных она не нужна.
      fields: fields.replace(/\\\|/g, "|"),
      title: card ? card.title.replace(/^[a-zA-Z0-9]+\s*—\s*/, "") : null,
      description: cardDescription(kind),
      hasCard: Boolean(card),
      // Где вид РЕАЛЬНО стоит и каким по счёту. Считается обходом содержимого, а не
      // ведётся руками: список, который поддерживают вручную, устаревает первым.
      usedOn: usage[kind] ?? [],
    }
  })

  return JSON.stringify(
    {
      _: "Generated by npm run build:blocks-map. Hand edits are lost.",
      generatedFrom: [
        "sections/index.ts",
        "sections/taxonomy.json",
        "sections/blocks/<kind>.md",
        "app/[lang]/(publicLayer)/**/_data/en.ts",
      ],
      types: taxonomy.types,
      kinds,
    },
    null,
    2,
  ) + "\n"
}

/**
 * Где какой вид стоит — обходом английского содержимого публичных страниц.
 *
 * 🔒 СЧИТАЕТСЯ, А НЕ ХРАНИТСЯ РУКАМИ. Владелец просил показывать, на каких
 * страницах секция применена и какой она там по счёту. Реестр, который ведут
 * вручную, разойдётся с содержимым на первой же правке текста — и разойдётся
 * молча. Здесь источник один: сами файлы материала.
 *
 * 🔒 БЕРЁТСЯ ОДИН ЯЗЫК (`en.ts`), а не все. Набор блоков у языковых ячеек один и
 * тот же — переводится текст, а не строение; обход всех языков дал бы то же самое,
 * умноженное на десять.
 *
 * Порядок — по появлению в файле, то есть по порядку на странице. Вложенные блоки
 * (внутри `group`, `columns`, `panel`) считаются наравне: они тоже стоят на этой
 * странице, и архитектору важно, что они там есть.
 */
function scanUsage() {
  const root = join(ROOT, "app", "[lang]", "(publicLayer)")
  const out = {}
  const files = []

  const walk = dir => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name === "en.ts" && dir.endsWith("_data")) files.push(p)
    }
  }
  try {
    walk(root)
  } catch {
    return out
  }

  for (const file of files) {
    // Имя страницы — путь папки без служебных сегментов и групп в скобках.
    const page =
      file
        .slice(root.length)
        .replace(/\\/g, "/")
        .replace(/\/_data\/en\.ts$/, "")
        .replace(/\/\([^)]*\)/g, "")
        .replace(/^\//, "") || "(home)"

    const src = readFileSync(file, "utf8")
    const found = [...src.matchAll(/kind:\s*'([a-zA-Z0-9]+)'/g)].map(m => m[1])
    found.forEach((kind, i) => {
      ;(out[kind] ??= []).push({ page, order: i + 1 })
    })
  }

  // На одной странице вид встречается не раз — оставляем первое вхождение и число.
  for (const kind of Object.keys(out)) {
    const byPage = new Map()
    for (const row of out[kind]) {
      const seen = byPage.get(row.page)
      if (!seen) byPage.set(row.page, { page: row.page, order: row.order, times: 1 })
      else seen.times += 1
    }
    out[kind] = [...byPage.values()].sort((a, b) => a.page.localeCompare(b.page))
  }
  return out
}

/**
 * Описание архитектора — проза карточки без заголовка и без служебных строк.
 *
 * 🔒 БЕРЁТСЯ ЦЕЛИКОМ, А НЕ ПЕРВЫМ АБЗАЦЕМ. В карточке живут и правила владельца,
 * сказанные по конкретному поводу, — обрезать их значит показать в панели половину
 * того, что уже оплачено разговором.
 */
function cardDescription(kind) {
  const file = join(BLOCKS, `${kind}.md`)
  if (!existsSync(file)) return null
  // 🔒 ПЕРЕВОДЫ СТРОК НОРМАЛИЗУЮТСЯ, И ЭТО НЕ КОСМЕТИКА (найдено в 32-8). Карточка
  // лежит в рабочей копии, а на Windows git отдаёт её с CRLF — тогда порождённый
  // здесь JSON отличается от порождённого на сервере БАЙТОМ НА КАЖДОЙ СТРОКЕ, и
  // сторож свежести падает сразу после чистого клона, ничего не сказав о причине.
  // Файл, который сверяют посимвольно, не имеет права зависеть от настроек рабочей
  // копии.
  const lines = readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n")
  const body = lines.slice(1).join("\n").trim()
  return body || null
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("build-blocks-map.mjs")) {
  writeFileSync(TARGET, render(), "utf8")
  writeFileSync(CATALOGUE, renderCatalogue(), "utf8")
  console.log(`✓ sections/BLOCKS.md и sections/SECTIONS.json — видов: ${readKinds().length}`)
}
