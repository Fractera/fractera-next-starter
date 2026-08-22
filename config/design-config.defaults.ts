// Оформление проекта — ТИПЫ И УМОЛЧАНИЯ (чистые данные, без `fs` и без env).
//
// Этот файл безопасно импортировать откуда угодно: он несёт форму настроек и те
// значения, с которыми живёт ненастроенный проект. Живой выбор владельца лежит
// файлом на диске (`DESIGN-CONFIG/design-config.json`) и читается сервером —
// `config/design-config.ts`, тот же контракт, что у `APP-CONFIG` и
// `PLATFORM-CONFIG`: панель пишет, приложение читает, применяется БЕЗ пересборки.
//
// 🔒 ПОЧЕМУ ВСЕ ЗНАЧЕНИЯ ЗДЕСЬ — ПУСТЫЕ, А НЕ КОПИЯ ПАЛИТРЫ. Умолчания
// оформления уже существуют, и живут они в теме проекта
// (`config/design/design-minimal-001.css`) вместе с тёмным вариантом каждого
// цвета. Продублируй мы их сюда — получится вторая палитра, которая разойдётся
// с первой на первой же правке темы, причём молча: страница выглядит нормально,
// просто не так, как написано в CSS.
//
// Поэтому здесь пусто, и пустое значение означает буквально «владелец не
// высказался — берётся то, что в теме». Настройка перекрывает тему только там,
// где владелец её задал.

/** Роли цвета. Те же имена, что у токенов темы, — чтобы перекрытие было прямым. */
export type ColorRole =
  | "primary"
  | "secondary"
  | "accent"
  | "background"
  | "foreground"
  | "muted"
  | "border"
  | "destructive"

/** Роли шрифта: заголовки, текст, моноширинный. */
export type FontRole = "heading" | "body" | "mono"

export type DesignConfig = {
  /**
   * Цвета по ролям. Значение — любая запись, понятная CSS (`#0b0f19`,
   * `oklch(0.2 0 0)`), и она подставляется в переменную как есть: проверять
   * цвет разбором строки значит запретить половину допустимых форм.
   *
   * `light` и `dark` — РАЗНЫЕ значения одной роли. Тема переключается классом
   * `.dark`, и цвет, заданный один раз, на второй теме почти всегда неверен:
   * тёмный текст на тёмном фоне исчезает целиком.
   */
  colors: { light: Partial<Record<ColorRole, string>>; dark: Partial<Record<ColorRole, string>> }

  /**
   * Шрифты. `family` — то, что уедет в `font-family`; `import` — адрес
   * подключения, если шрифт внешний.
   *
   * 🔒 АДРЕС ХРАНИТСЯ ОТДЕЛЬНО ОТ ИМЕНИ. Внешний шрифт требует и того и другого,
   * и склеенная строка `@import url(…); font-family: …` однажды приедет в
   * `font-family` целиком — вместе с адресом.
   */
  fonts: Partial<Record<FontRole, { family: string; import?: string }>>

  /** Шкала текста: множитель на весь набор и межстрочный интервал. */
  type: { scale?: number; leading?: number }

  /** Формы и отступы: скругление, рамка, плотность, ширина ленты и первого экрана. */
  shape: {
    radius?: string
    borderWidth?: string
    /** Множитель воздуха страниц. 1 — плотность проекта. */
    spaceScale?: number
    appWidth?: string
    heroWidth?: string
  }
}

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  colors: { light: {}, dark: {} },
  fonts: {},
  type: {},
  shape: {},
}

/** Пустая ли настройка целиком — то есть «оформление не трогали». */
export function isDesignConfigEmpty(cfg: DesignConfig): boolean {
  return (
    Object.keys(cfg.colors?.light ?? {}).length === 0 &&
    Object.keys(cfg.colors?.dark ?? {}).length === 0 &&
    Object.keys(cfg.fonts ?? {}).length === 0 &&
    Object.keys(cfg.type ?? {}).length === 0 &&
    Object.keys(cfg.shape ?? {}).length === 0
  )
}
