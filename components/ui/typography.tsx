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
const H1_STYLE = `${CONTENT_FAMILY} text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl`

// Заголовок ПЕРВОГО ЭКРАНА главной — те же 30/36/48, увеличенные на 30%
// (заказ владельца 2026-08-15): 39 / 47 / 62 пикселя.
//
// 🔒 ЭТО ЕДИНСТВЕННОЕ ИСКЛЮЧЕНИЕ, И ОНО ЖИВЁТ ЗДЕСЬ, А НЕ В СЕКЦИИ. Первый экран
// — обложка сайта, ему позволено звучать громче остальных страниц; но как только
// такое исключение записывается классами на месте, рядом появляется второе, и
// шкала перестаёт существовать. Стоит оно у шкалы, посчитано от неё, и видно
// всякому, кто сюда заглянет.
const H1_HERO_STYLE = `${CONTENT_FAMILY} text-[39px] font-bold leading-tight tracking-tight md:text-[47px] lg:text-[62px]`

const H2_STYLES: Record<Variant, string> = {
  content: `${CONTENT_FAMILY} text-2xl font-bold leading-snug tracking-tight md:text-3xl`,
  ui: `${UI_FAMILY} text-lg font-semibold tracking-tight md:text-xl`,
}

const H3_STYLES: Record<Variant, string> = {
  content: `${UI_FAMILY} text-lg font-semibold leading-snug md:text-xl`,
  ui: `${UI_FAMILY} text-base font-semibold md:text-lg`,
}

const H4_STYLES: Record<Variant, string> = {
  content: `${UI_FAMILY} text-base font-semibold md:text-lg`,
  ui: `${UI_FAMILY} text-sm font-semibold`,
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

/** Обычный текст страницы. */
export function P({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-base leading-relaxed text-muted-foreground md:text-[17px]", className)} {...props} />
}

/** Вводный абзац под заголовком — крупнее обычного, но не заголовок. */
export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-lg leading-relaxed text-muted-foreground md:text-xl", className)} {...props} />
}

/** Подпись, сноска, вспомогательная строка. */
export function Small({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm leading-normal text-muted-foreground", className)} {...props} />
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
      className={cn("text-xs font-semibold uppercase tracking-widest text-primary", className)}
      {...props}
    />
  )
}
