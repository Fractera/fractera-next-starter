import type { ReactNode } from "react"
import { Breadcrumbs, type Crumb } from "@/components/nav/breadcrumbs.server"
import { H1, Lead, Eyebrow } from "@/components/ui/typography"

// ШАПКА СТРАНИЦЫ — ОДИН ПОРЯДОК И ОДИН РИТМ НА ВЕСЬ САЙТ.
//
// 🔒 ЧТО ЭТО ЛЕЧИТ (замер 2026-08-15). Шапку собирала каждая страница сама, и
// собирала по-своему — пять разных сборок на восемь страниц:
//
//   шаблон страниц   теги → H1 → Lead → автор     mt-6 gap-5, черта снизу
//   список блога     лейбл → H1 → текст           gap-3, черты нет
//   каталог          крошки → H1 → текст          mb-8 mt-4 + mt-1, черты нет
//   панель товаров   крошки → H1 → текст          то же, но подзаголовок 12px
//   витрина блоков   лейбл → H1 → текст           gap-3, черта снизу
//
// Подзаголовок существовал в ЧЕТЫРЁХ размерах (20 / 16 / 14 / 12px), черта была
// у двух страниц из пяти, а над заголовком у каждой стояло своё. Размеры самого
// H1 к тому времени уже совпадали — и именно поэтому разнобой читался как
// «заголовки разные»: глаз видит не кегль, а расстояние и порядок.
//
// 🔒 ПОРЯДОК ФИКСИРОВАН И НЕ НАСТРАИВАЕТСЯ. Крошки → надзаголовок → H1 →
// подзаголовок → строка сведений. Ни один элемент нельзя переставить снаружи:
// возможность переставить — это и есть то, из-за чего пять страниц разъехались.
// Любой элемент можно НЕ ДАТЬ, и тогда его просто нет.
//
// 🔒 КРОШКИ РИСУЕТ ОБЩИЙ КОМПОНЕНТ, А НЕ ЭТОТ ФАЙЛ. У шаблона страниц была своя
// копия их разметки — вторая на проект, со своим размером текста. Здесь стоит
// `components/nav/breadcrumbs.server.tsx`, и вместе с ним приходит разметка
// `BreadcrumbList` для поисковика: она обязана совпадать с нарисованным путём,
// поэтому живёт там же, где путь.

export type PageHeaderProps = {
  lang: string
  /** Путь наверх. Нет уровня выше — не передавайте: у корня сайта крошек нет. */
  breadcrumbs?: Crumb[]
  /** Короткая метка над заголовком: раздел, рубрика, тип материала. */
  eyebrow?: string
  /** Ярлыки материала. Показываются вместо надзаголовка, если он не задан. */
  tags?: string[]
  title: string
  subtitle?: string
  /**
   * Строка сведений под заголовком: автор, дата, время чтения.
   * Готовый узел — состав у поста и у страницы разный, а место одно.
   */
  meta?: ReactNode
  /**
   * Черта под шапкой. По умолчанию есть: она отделяет заголовок от материала.
   * Убирать её стоит там, где ниже сразу идёт своя рамка или сетка.
   */
  divider?: boolean
}

export function PageHeader({
  lang,
  breadcrumbs,
  eyebrow,
  tags,
  title,
  subtitle,
  meta,
  divider = true,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs lang={lang} trail={breadcrumbs} />}

      <header className={`flex flex-col gap-4 ${divider ? "border-b border-border pb-8" : ""}`}>
        {eyebrow ? (
          <Eyebrow>{eyebrow}</Eyebrow>
        ) : tags && tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map(t => (
              <span
                key={t}
                className="rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <H1>{title}</H1>

        {/* Подзаголовок — всегда `Lead`. Четыре размера, что были на пяти
            страницах, различались не смыслом, а тем, кто их писал. */}
        {subtitle && <Lead className="max-w-3xl">{subtitle}</Lead>}

        {meta}
      </header>
    </div>
  )
}
