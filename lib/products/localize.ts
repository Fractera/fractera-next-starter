import type { Product } from "@/lib/products/types"

// Разрешение полей продукта на язык страницы.
//
// Строка базы хранит базовое значение в своей колонке (`name`, `description`), а
// переводы — одной колонкой `i18n` в виде `{ "name": { "ru": "…" } }`. Та же
// форма, что у переводов в `APP-CONFIG`, и по той же причине: колонка на язык не
// масштабируется — каждый новый язык требовал бы миграции схемы, а их у клиента
// может быть десять.
//
// Правило разрешения ровно одно и совпадает с контентным движком: **нет
// перевода — берётся базовое значение**. Пустая строка вместо названия хуже
// английского названия: первое выглядит поломкой, второе — честной границей
// перевода.

type Translations = Record<string, Record<string, string> | undefined>

function parse(raw: unknown): Translations {
  if (typeof raw !== "string" || !raw.trim()) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" ? (parsed as Translations) : {}
  } catch {
    // Битый JSON — не повод уронить страницу товара: показываем базовый язык.
    return {}
  }
}

export type LocalizedProduct = Product & { localizedName: string; localizedDescription: string | null }

export function localizeProduct(product: Product, lang: string): LocalizedProduct {
  const t = parse((product as unknown as { i18n?: unknown }).i18n)
  const pick = (field: string, base: string | null | undefined) =>
    t[field]?.[lang] ?? t[field]?.[lang.slice(0, 2)] ?? base ?? null

  return {
    ...product,
    localizedName: pick("name", product.name) ?? product.name,
    localizedDescription: pick("description", (product as unknown as { description?: string }).description),
  }
}
