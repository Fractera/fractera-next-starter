import Link from "next/link"
import { metaForLang } from "@/config/app-config"

// Хлебные крошки — на КАЖДОЙ странице, один компонент на весь проект.
//
// Зачем один: крошки, скопированные в страницу, расходятся в разметке и в
// поведении на узком экране. Здесь они верстаются один раз и одинаково.
//
// 🔒 СЕРВЕРНЫЙ И СТАТИЧЕСКИЙ. Крошки — часть каркаса: они известны до всяких
// данных и обязаны уезжать в предрендер вместе с заголовком. Клиентский вариант
// заставил бы страницу ждать JS ради навигации, которая не менялась никогда.
//
// Первая крошка — корень сайта, подписанный ИМЕНЕМ САЙТА из настроек проекта:
// тот же приём, что и внутренняя ссылка на главную в статьях. Ничьё имя не
// вписывается в код.
//
// Последняя крошка — текущая страница: без ссылки, с `aria-current`, и только
// она сжимается на узком экране, чтобы длинный заголовок не выдавил строку за
// край и не породил горизонтальную прокрутку.

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ lang, trail }: { lang: string; trail: Crumb[] }) {
  const home: Crumb = { label: metaForLang(lang).siteName, href: `/${lang}` }
  const items = [home, ...trail]

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className={`flex items-center gap-1.5 ${last ? "min-w-0" : "shrink-0"}`}>
              {c.href && !last ? (
                <Link href={c.href} className="whitespace-nowrap hover:text-foreground">{c.label}</Link>
              ) : (
                <span aria-current="page" className="block min-w-0 truncate text-foreground/80">{c.label}</span>
              )}
              {!last && <span aria-hidden className="shrink-0 text-muted-foreground/40">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
