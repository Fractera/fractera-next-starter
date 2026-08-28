// ОПИСАНИЕ ПОЛЕЙ НАСТРОЕК (31-4, 2026-08-28). Переносится из панели
// (`bridges/app/app/[lang]/app-settings/_lib/fields.ts`) секция за секцией.
//
// 🔒 ОПИСАНИЕ, А НЕ РАЗМЕТКА. Поле — это запись: путь в конфиге, тип, языковое оно
// или нет, заблокировано или нет. Форма рисуется ИЗ описания, поэтому новая секция
// стоит одной записи, а правило (например «у текстового поля есть голос») пишется
// один раз и действует на все.
//
// 🔒 ПУТЬ — КОНТРАКТ С ЧИТАТЕЛЯМИ КОНФИГА, И МЕНЯТЬ ЕГО НЕЛЬЗЯ. `name`,
// `seo.titleTemplate`, `geo.address` читают `lib/brand.ts`, `lib/jsonld.ts`,
// `lib/construct-metadata.ts` и ещё десяток модулей. Подписи мы переводим, пути —
// никогда.
//
// 🔒 ЯЗЫКОВЫХ ПОЛЕЙ РОВНО ПЯТЬ, И ЭТО НЕ НАШ ВЫБОР: `name`, `description`,
// `seo.titleTemplate`, `seo.keywords`, `og.siteName` — так их читает
// `configValueForLang()` в `config/app-config.ts`. Пометить языковым шестое поле
// значит записать перевод, который никто никогда не прочитает.

export type FieldType = "text" | "textarea" | "number" | "select" | "switch"

export type Field = {
  /** Путь значения в `app-config.json`, точками. */
  path: string
  type: FieldType
  /** Значение своё на каждый язык (хранится в ветке `i18n`). */
  perLang?: boolean
  /**
   * Поле только для чтения: значение ВЫВОДИТСЯ из адреса, на который сервер
   * реально отвечает. Дать его править значило бы позволить назвать сайт адресом,
   * которого не существует.
   */
  locked?: boolean
  /** Варианты для `select`; значения — то, что уходит в конфиг. */
  options?: readonly string[]
}

export type Section = {
  /** Ключ секции: он же ключ словаря подписей. */
  id: string
  /** Группа левого меню, которой секция принадлежит. */
  group: string
  fields: readonly Field[]
}

// 🔒 ПОРЯДОК СЕКЦИЙ И ПОЛЕЙ — ИЗ ПАНЕЛИ, дословно. Человек, знавший старую
// вкладку, обязан найти поле там же, где привык; переставить их «логичнее» значит
// заставить его искать заново без единой причины.
export const SECTIONS: readonly Section[] = [
  {
    id: "brand",
    group: "basics",
    fields: [
      { path: "name", type: "text", perLang: true },
      { path: "short_name", type: "text" },
      { path: "description", type: "textarea", perLang: true },
      { path: "url", type: "text", locked: true },
      { path: "mailSupport", type: "text" },
    ],
  },
]

/** Секции одной группы меню, в порядке описания. */
export function sectionsOfGroup(group: string): readonly Section[] {
  return SECTIONS.filter(s => s.group === group)
}

/** Все поля группы — для подсчёта и для сборки заплаты. */
export function fieldsOfGroup(group: string): readonly Field[] {
  return sectionsOfGroup(group).flatMap(s => s.fields)
}

/** Значение по пути; `undefined`, если пути нет. */
export function atPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    source,
  )
}

/**
 * Заплата из одного пути: `"seo.titleTemplate"` → `{ seo: { titleTemplate: v } }`.
 *
 * 🔒 ИМЕННО ЗАПЛАТА, А НЕ ПРАВКА СНИМКА. Дверь принимает только тронутые ветки, и
 * страница физически не может затереть то, чего не присылала
 * (`lib/architect/app-config-writer.ts`).
 */
export function patchAtPath(path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".")
  const out: Record<string, unknown> = {}
  let cur = out
  keys.forEach((key, i) => {
    if (i === keys.length - 1) cur[key] = value
    else {
      const next: Record<string, unknown> = {}
      cur[key] = next
      cur = next
    }
  })
  return out
}

/** Слияние заплат в одну — по тем же правилам, что у писателя на сервере. */
export function mergePatches(patches: readonly Record<string, unknown>[]): Record<string, unknown> {
  const merge = (a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown> => {
    const out = { ...a }
    for (const [k, v] of Object.entries(b)) {
      const prev = out[k]
      out[k] =
        v && typeof v === "object" && !Array.isArray(v) && prev && typeof prev === "object" && !Array.isArray(prev)
          ? merge(prev as Record<string, unknown>, v as Record<string, unknown>)
          : v
    }
    return out
  }
  return patches.reduce<Record<string, unknown>>((acc, p) => merge(acc, p), {})
}
