import "server-only"
import { getDesignConfig } from "@/config/design-config"
import { isDesignConfigEmpty, type DesignConfig } from "@/config/design-config.defaults"

// ОФОРМЛЕНИЕ ВЛАДЕЛЬЦА → CSS. Одна функция превращает настройки в правила,
// которые перекрывают тему проекта.
//
// 🔒 ПОЧЕМУ ПЕРЕКРЫТИЕ, А НЕ ЗАМЕНА ТЕМЫ. Тема (`config/design/*.css`) несёт
// полную палитру: десятки токенов в двух вариантах. Владелец меняет из них
// единицы — фирменный цвет, шрифт, скругление. Заменяя тему целиком, пришлось бы
// требовать от него ВСЕ значения сразу, иначе часть интерфейса осталась бы без
// цвета. Перекрытие же означает буквально «остальное как было».
//
// 🔒 CSS СОБИРАЕТСЯ НА РЕНДЕРЕ, А НЕ ХРАНИТСЯ РЯДОМ С НАСТРОЙКАМИ. В образце,
// с которого взят механизм (22slots), готовая строка лежит в базе рядом с
// токенами. Здесь так не делается СОЗНАТЕЛЬНО: хранить и токены, и производную
// от них — это два источника одного факта, и расходятся они молча (строку в
// браузере никто не читает глазами). Сборка стоит доли миллисекунды на запрос,
// а `cache()` в читателе делает её единственной за проход рендера.
//
// 🔒 ЗНАЧЕНИЯ НЕ РАЗБИРАЮТСЯ, А ПРОВЕРЯЮТСЯ НА БЕЗОПАСНОСТЬ. Цвет может быть
// `#0b0f19`, `oklch(…)`, `color-mix(…)` — перечислить все допустимые формы
// значит запретить половину. Поэтому проверка одна и грубая: в значении не
// должно быть символов, которыми закрывают правило и открывают своё.

/**
 * Безопасно ли значение для подстановки в переменную.
 *
 * Настройки приходят из панели, то есть от владельца, — но путь «панель → файл
 * → страница» заканчивается в `<style>`, и значение с `}` или `<` внутри
 * позволило бы дописать в страницу что угодно. Отбрасываем такие молча:
 * подставить безопасное умолчание тут нельзя, а падать из-за одной настройки
 * незачем.
 */
function safe(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !/[{}<>;]/.test(value)
}

/** Строки `--role: value;` для одной темы. */
function colorVars(map: Record<string, string | undefined>): string[] {
  return Object.entries(map)
    .filter(([, v]) => safe(v))
    .map(([role, v]) => `  --${role}: ${v};`)
}

/**
 * Полный текст правил и список адресов внешних шрифтов.
 *
 * 🔒 АДРЕСА ШРИФТОВ ВОЗВРАЩАЮТСЯ ОТДЕЛЬНО, А НЕ ОСТАЮТСЯ `@import`-ом. Приём
 * взят у образца и решает конкретную задержку: `@import` внутри `<style>`
 * браузер обнаруживает ПОСЛЕ разбора стилей и только тогда идёт за шрифтом —
 * а `<link>` в шапке он видит сразу и загружает параллельно. Разница — целый
 * оборот сети на первой отрисовке.
 */
export function buildDesignCss(cfg: DesignConfig = getDesignConfig()): {
  css: string
  fontLinks: string[]
} {
  if (isDesignConfigEmpty(cfg)) return { css: "", fontLinks: [] }

  const blocks: string[] = []
  const fontLinks: string[] = []

  // ── Цвета ──────────────────────────────────────────────────────────────────
  const light = colorVars(cfg.colors?.light ?? {})
  const dark = colorVars(cfg.colors?.dark ?? {})

  // ── Шрифты, шкала, формы — всё это от темы не зависит и живёт в светлом блоке
  const root: string[] = [...light]

  // 🔒 ИМЕНА ПЕРЕМЕННЫХ ЗАДАНЫ ТАБЛИЦЕЙ, А НЕ СКЛЕЙКОЙ ИЗ РОЛИ. Шаблон
  // `--font-${role}` давал для моноширинного `--font-mono` — а это имя УЖЕ
  // занято темой Tailwind, и выбор владельца столкнулся бы с ней. Столкновение
  // такого рода не падает и не видно в коде: побеждает то правило, что окажется
  // ниже, а какое окажется — зависит от порядка сборки.
  const FONT_VAR: Record<string, string> = {
    heading: "--font-heading",
    body: "--font-body",
    mono: "--font-mono-user",
  }

  for (const [role, font] of Object.entries(cfg.fonts ?? {})) {
    const varName = FONT_VAR[role]
    if (!varName || !font || !safe(font.family)) continue
    // 🔒 КАВЫЧКИ СТАВЯТСЯ ОДНОМУ ИМЕНИ, НО НЕ НАБОРУ. «Playfair Display» без
    // кавычек распадается на два слова, и браузер ищет шрифт «Playfair». А
    // системный вариант — это СПИСОК через запятую (`system-ui, -apple-system,
    // 'Segoe UI', …`), и кавычки вокруг него превращают весь список в одно
    // несуществующее имя: страница молча откатывается на шрифт по умолчанию
    // браузера, то есть выглядит сломанной ровно там, где выбран «системный».
    const value = font.family.includes(",") ? font.family : `"${font.family}"`
    root.push(`  ${varName}: ${value};`)
    if (typeof font.import === "string" && /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(font.import)) {
      fontLinks.push(font.import)
    }
  }

  // Множитель шкалы — одно число на весь текст: примитив типографики считает
  // размеры от него. Границы жёсткие: вне их текст либо нечитаем, либо ломает
  // раскладку, а «владелец так захотел» здесь не аргумент — он не видит
  // последствий, пока не откроет каждую страницу.
  if (typeof cfg.type?.scale === "number" && cfg.type.scale >= 0.75 && cfg.type.scale <= 1.5) {
    root.push(`  --type-scale: ${cfg.type.scale};`)
  }
  if (typeof cfg.type?.leading === "number" && cfg.type.leading >= 1 && cfg.type.leading <= 2.2) {
    root.push(`  --type-leading: ${cfg.type.leading};`)
  }

  // Плотность — тот же приём, что у шкалы текста: одно число двигает воздух на
  // всех страницах, сохраняя разницу между контентными и рабочими экранами.
  // Границы те же по смыслу: ниже 0.5 страница слипается, выше 2 — рассыпается.
  if (typeof cfg.shape?.spaceScale === "number" && cfg.shape.spaceScale >= 0.5 && cfg.shape.spaceScale <= 2) {
    root.push(`  --space-scale: ${cfg.shape.spaceScale};`)
  }

  if (safe(cfg.shape?.radius)) root.push(`  --radius: ${cfg.shape.radius};`)
  if (safe(cfg.shape?.borderWidth)) root.push(`  --border-width: ${cfg.shape.borderWidth};`)
  if (safe(cfg.shape?.appWidth)) root.push(`  --app-w: ${cfg.shape.appWidth};`)
  if (safe(cfg.shape?.heroWidth)) root.push(`  --hero-w: ${cfg.shape.heroWidth};`)

  if (root.length) blocks.push(`:root {\n${root.join("\n")}\n}`)

  // 🔒 ТЁМНАЯ ТЕМА — ОТДЕЛЬНЫМ БЛОКОМ И ТОЛЬКО ЦВЕТА. Класс `.dark` ставит
  // инлайн-скрипт; всё, что от темы не зависит (шрифт, скругление, ширина),
  // повторять здесь не нужно — оно уже стоит в `:root` и наследуется.
  if (dark.length) blocks.push(`.dark {\n${dark.join("\n")}\n}`)

  return { css: blocks.join("\n\n"), fontLinks: [...new Set(fontLinks)] }
}
