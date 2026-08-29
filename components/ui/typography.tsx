import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

// ТИПОГРАФИКА ПРОЕКТА — ОДНА ШКАЛА НА ВЕСЬ САЙТ.
//
// 🔒 ЗАЧЕМ ЭТОТ ФАЙЛ ПОЯВИЛСЯ (2026-08-15, разбор владельца). В наборе
// `components/ui/` было двадцать два компонента — кнопки, диалоги, меню — и ни
// одного для текста. Правило продукта требовало «один интерфейс, один стиль», но
// записано было ТОЛЬКО про интерактив, поэтому каждый файл описывал заголовок
// сам. Замер по дереву: девять разных описаний `<h1>`, три `<h2>`, сорок пять
// вариантов абзаца. Страницы одного сайта отличались размером заголовка вдвое
// (20px в панелях товаров против 36px в блоге).
//
// Причина была не в небрежности, а в ОТСУТСТВУЮЩЕМ ПРИМИТИВЕ: там, где нет
// одного места, расхождение неизбежно — оно лишь вопрос числа правок.
//
// 🔒 ШКАЛА ТОЛЬКО РАСТЁТ С ЭКРАНОМ. Восемь заголовков в проекте уменьшались:
// `text-4xl md:text-3xl` — на телефоне крупнее, чем на мониторе. Это не выбор
// вкуса, а ошибка, и она была в том числе в `h2.server.tsx`, то есть на КАЖДОЙ
// контентной странице. Здесь такой записи появиться не может: размеры заданы
// один раз и перечислены по возрастанию.
//
// 🔒 ДВА НАБОРА, И ГРАНИЦА МЕЖДУ НИМИ СМЫСЛОВАЯ.
//   `content` (по умолчанию) — витрина: главная, посты, правовые страницы,
//      каталог. Заголовки крупные и с засечками: у страницы, которую читают,
//      должен быть характер.
//   `ui` — рабочие экраны: панели товаров, служебные разделы. Заголовок здесь
//      подпись к таблице, а не обложка; он компактный и без засечек, иначе
//      рабочий экран превращается в афишу.
// Семейство задаётся ОДНОЙ строкой ниже — сменить решение можно в одном месте.
//
// 🔒 РАЗМЕРЫ — ПЕРЕМЕННЫЕ, А НЕ ЧИСЛА (слой «Дизайн», 2026-08-15). Шкала живёт в
// `styles/globals.css` (`--fs-*`), и каждая ступень посчитана от множителя
// `--type-scale`. Владелец меняет одно число в панели — набор целиком становится
// крупнее или мельче, сохраняя пропорции. Девять отдельных полей вместо
// множителя дали бы девять способов развалить шкалу: подзаголовок крупнее
// заголовка, основной текст мельче подписи — ровно тот разнобой, что мы отсюда
// и убирали.
//
// Семейства тоже читают выбор владельца: `font-serif` и `font-sans` в теме
// объявлены через `var(--font-heading, …)` и `var(--font-body, …)`. До этой
// правки панель писала переменные, которых никто не читал.

const CONTENT_FAMILY = "font-serif"
const UI_FAMILY = "font-sans"

type Variant = "content" | "ui"

// 🔒 У ЗАГОЛОВКА СТРАНИЦЫ ВАРИАНТОВ НЕТ — ОДИН НА ВЕСЬ САЙТ (владелец, 2026-08-15).
//
// Здесь стояло два: `content` (с засечками, 30→48px) для витрины и `ui` (без
// засечек, 20→24px) для рабочих экранов. Замер на живом сервере показал, во что
// это обошлось: `/ru/blocks` и `/ru/manage/products` — обе страницы защищённого
// слоя, обе рабочие — отличались ВДВОЕ по размеру и шрифтом. Одна выглядела
// витриной, другая таблицей, и человек, переходя между ними, видел два разных
// продукта.
//
// Различие вводил я, «чтобы рабочий экран не выглядел афишей». Довод звучал
// разумно и оказался неверным: страница может быть плотной за счёт отступов и
// содержимого, а заголовок — это опознавательный знак сайта, и он обязан быть
// один. Проверяется это глазами человека, открывшего две страницы подряд, а не
// рассуждением о плотности.
const H1_STYLE = `${CONTENT_FAMILY} text-[length:var(--fs-h1)] font-bold leading-tight tracking-tight md:text-[length:var(--fs-h1-md)] lg:text-[length:var(--fs-h1-lg)]`

// Заголовок ПЕРВОГО ЭКРАНА главной — те же 30/36/48, увеличенные на 30%
// (заказ владельца 2026-08-15): 39 / 47 / 62 пикселя.
//
// 🔒 ЭТО ЕДИНСТВЕННОЕ ИСКЛЮЧЕНИЕ, И ОНО ЖИВЁТ ЗДЕСЬ, А НЕ В СЕКЦИИ. Первый экран
// — обложка сайта, ему позволено звучать громче остальных страниц; но как только
// такое исключение записывается классами на месте, рядом появляется второе, и
// шкала перестаёт существовать. Стоит оно у шкалы, посчитано от неё, и видно
// всякому, кто сюда заглянет.
const H1_HERO_STYLE = `${CONTENT_FAMILY} text-[length:var(--fs-hero)] font-bold leading-[1.1] tracking-tight md:text-[length:var(--fs-hero-md)] lg:text-[length:var(--fs-hero-lg)]`

// ЧИСЛО-УТВЕРЖДЕНИЕ: множитель в ряду мер, зачёркнутое имя в ряду «счетов, которых
// нет». Не заголовок — оно ничего не озаглавливает, — но и не текст: это крупный
// знак, который читают до чтения.
//
// 🔒 ОНО СТОИТ ЗДЕСЬ РОВНО ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО И `H1_HERO_STYLE` ВЫШЕ, и
// причина уже оплачена дважды. В секции это было написано как `text-4xl
// md:text-5xl` — размеры из лестницы Tailwind, то есть ВНЕ шкалы: владелец
// двигает `--type-scale` в панели, весь набор становится крупнее, а число стоит
// на месте. Шкала, которой подчиняется не всё, — не шкала.
//
// Ступень взята существующая (`--fs-h1`), новой не заведено: каждая новая
// ступень — ещё один способ развалить пропорции.
const METRIC_STYLE = `${CONTENT_FAMILY} text-[length:var(--fs-h1)] font-bold leading-none tracking-tight md:text-[length:var(--fs-h1-md)]`

const H2_STYLES: Record<Variant, string> = {
  content: `${CONTENT_FAMILY} text-[length:var(--fs-h2)] font-bold leading-snug tracking-tight md:text-[length:var(--fs-h2-md)]`,
  ui: `${UI_FAMILY} text-[length:var(--fs-h3)] font-semibold tracking-tight md:text-[length:var(--fs-h3-md)]`,
}

const H3_STYLES: Record<Variant, string> = {
  content: `${UI_FAMILY} text-[length:var(--fs-h3)] font-semibold leading-snug md:text-[length:var(--fs-h3-md)]`,
  ui: `${UI_FAMILY} text-[length:var(--fs-body)] font-semibold md:text-[length:var(--fs-h3)]`,
}

const H4_STYLES: Record<Variant, string> = {
  content: `${UI_FAMILY} text-[length:var(--fs-body)] font-semibold md:text-[length:var(--fs-h3)]`,
  ui: `${UI_FAMILY} text-[length:var(--fs-small)] font-semibold`,
}

type HeadingProps = ComponentProps<"h1"> & { variant?: Variant }

/**
 * Заголовок страницы. Вариантов нет: он один на весь сайт — и на витрине, и на
 * рабочих экранах.
 *
 * `scale="hero"` — единственное исключение, первый экран главной (+30%).
 */
export function H1({ scale = "page", className, ...props }: ComponentProps<"h1"> & { scale?: "page" | "hero" }) {
  return <h1 className={cn(scale === "hero" ? H1_HERO_STYLE : H1_STYLE, "text-foreground", className)} {...props} />
}

export function H2({ variant = "content", className, ...props }: HeadingProps) {
  return <h2 className={cn(H2_STYLES[variant], "text-foreground", className)} {...props} />
}

export function H3({ variant = "content", className, ...props }: HeadingProps) {
  return <h3 className={cn(H3_STYLES[variant], "text-foreground", className)} {...props} />
}

export function H4({ variant = "content", className, ...props }: HeadingProps) {
  return <h4 className={cn(H4_STYLES[variant], "text-foreground", className)} {...props} />
}

/**
 * Число-утверждение — множитель, счёт, крупный знак в ряду мер.
 *
 * Это `<span>`, а не абзац: оно живёт внутри `<dt>` списка определений или в
 * ячейке ряда, где абзац стоять не может. Цвет не задан намеренно — у меры он
 * акцентный, у отменённого счёта приглушённый, и это решает секция.
 */
export function Metric({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn(METRIC_STYLE, className)} {...props} />
}

/** Обычный текст страницы. */
export function P({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-[length:var(--fs-body)] leading-[var(--type-leading)] text-muted-foreground md:text-[length:var(--fs-body-md)]", className)} {...props} />
}

/** Вводный абзац под заголовком — крупнее обычного, но не заголовок. */
export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-[length:var(--fs-lead)] leading-[var(--type-leading)] text-muted-foreground md:text-[length:var(--fs-lead-md)]", className)} {...props} />
}

/** Подпись, сноска, вспомогательная строка. */
export function Small({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-[length:var(--fs-small)] leading-normal text-muted-foreground", className)} {...props} />
}

/**
 * Надзаголовок: короткая метка над заголовком раздела.
 *
 * Единственное место, где в типографике живёт `uppercase` и разрядка: их роль —
 * отличить служебную метку от текста, и делать это ещё где-то значит стирать
 * разницу.
 */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-[length:var(--fs-eyebrow)] font-semibold uppercase tracking-widest text-primary", className)}
      {...props}
    />
  )
}
