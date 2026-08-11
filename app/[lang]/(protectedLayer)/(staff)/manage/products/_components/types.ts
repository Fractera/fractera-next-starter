export type Product = {
  id: string
  name: string
  price: number
  /** Базовый (английский) текст. Переводы — в `i18n`. */
  description: string | null
  /**
   * Переводы полей одной строкой JSON: `{ "name": { "ru": "…" } }`.
   * Разрешается через `_lib/localize-product.ts`; колонка на язык не заводится —
   * каждый новый язык требовал бы миграции схемы.
   */
  i18n: string | null
  media_id: string | null
  media_url: string | null
  created_at: string
}
