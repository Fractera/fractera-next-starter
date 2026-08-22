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
  const family = lines.find(l => l.startsWith("**Семейство:**"))
  return {
    title: head ? head.replace(/^#\s*/, "").trim() : kind,
    family: family ? family.replace(/\*\*Семейство:\*\*/, "").split(".")[0].trim() : null,
  }
}

export function render() {
  const kinds = readKinds()
  const renderers = readdirSync(BLOCKS).filter(f => f.endsWith(".server.tsx")).length

  const rows = kinds.map(({ kind, fields }) => {
    const card = cardSummary(kind)
    const what = card ? card.title.replace(/^[a-zA-Z]+\s*—\s*/, "") : "—"
    const family = card?.family ?? "—"
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
  const taxonomy = JSON.parse(readFileSync(TAXONOMY, "utf8"))
  const kinds = readKinds().map(({ kind, fields }) => {
    const t = taxonomy.kinds[kind] ?? { type: "page-material", shape: "text" }
    const card = cardSummary(kind)
    return {
      kind,
      type: t.type,
      shape: t.shape ?? "text",
      // Труба экранировалась для разметки таблицы — в данных она не нужна.
      fields: fields.replace(/\\\|/g, "|"),
      title: card ? card.title.replace(/^[a-zA-Z0-9]+\s*—\s*/, "") : null,
      description: cardDescription(kind),
      hasCard: Boolean(card),
    }
  })

  return JSON.stringify(
    {
      _: "Порождается npm run build:blocks-map. Правки руками теряются.",
      generatedFrom: ["sections/index.ts", "sections/taxonomy.json", "sections/blocks/<вид>.md"],
      types: taxonomy.types,
      kinds,
    },
    null,
    2,
  ) + "\n"
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
  const lines = readFileSync(file, "utf8").split("\n")
  const body = lines.slice(1).join("\n").trim()
  return body || null
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("build-blocks-map.mjs")) {
  writeFileSync(TARGET, render(), "utf8")
  writeFileSync(CATALOGUE, renderCatalogue(), "utf8")
  console.log(`✓ sections/BLOCKS.md и sections/SECTIONS.json — видов: ${readKinds().length}`)
}
