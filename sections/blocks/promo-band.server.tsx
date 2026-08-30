import type { SectionRenderer } from '@/sections/contract'
import { Github, ExternalLink } from 'lucide-react'
import { H2, P } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'

// ПОЛОСА ВО ВСЮ ШИРИНУ ЭКРАНА — ПЕРЕНОС ИЗ `fractera-promo.tsx` ВИТРИНЫ
// (шаг 55, 2026-08-30). Заголовок, абзац и кнопка слева, картинка справа; сверху
// и снизу — акцентная черта в четыре пикселя.
//
// 🔒 СМЫСЛ ФОРМЫ — В ТОМ, ЧТО ОНА ВЫХОДИТ ЗА КОЛОНКУ. Фон полосы в источнике
// СОВПАДАЕТ с фоном страницы (там и там чёрный): разделяют не цветом, а двумя
// чертами и шириной. Отсюда `bg-background` здесь — залей полосу чем-то другим,
// и приём превратится в обычную карточку, только пошире.
//
// 🪦 ПРИЁМ «ВЫХОД ЗА КОЛОНКУ» ОТМЕНЁН ВЛАДЕЛЬЦЕМ 2026-08-30, дословно: «эта секция
// внутри нашей страницы ломает разметку… она не находится внутри своего
// собственного контейнера, а выходит наружу за его пределы… если секция
// промобанд01 имеет в своих стилях специальный способ сломать вёрстку — это
// неправильно». Здесь стояли `w-screen` и `marginLeft: calc(50% - 50vw)`, а в
// `globals.css` — защита `overflow-x: clip` у корня; ушло и то и другое.
//
// 🔒 ПОЛОСА ЗАНИМАЕТ ВСЮ ШИРИНУ СВОЕГО КОНТЕЙНЕРА И НИ ПИКСЕЛЕМ БОЛЬШЕ. Довод
// владельца — соседний вид: `languageMarquee` тоже во всю ширину и при этом
// остаётся внутри контейнера. Полная ширина не требует ломать колонку.
//
// 🔒 ГДЕ ЕЙ МЕСТО — ЧАСТЬ ОПИСАНИЯ ВИДА, А НЕ ЕГО КОДА (слова владельца там же):
// полосу ставят В НИЖНЕЙ ЧАСТИ страницы, которая сама растянута на всю ширину.
// Тогда она выглядит так же, как на витрине, и ничего не ломает.
//
// 🔒 ЗНАЧОК КНОПКИ ВЫБИРАЕТСЯ ИМЕНЕМ ИЗ ДВУХ. В источнике значок GitHub вшит
// разметкой SVG на тридцать строк — витрина знает, куда ведёт её единственная
// кнопка. Каталог не знает: та же полоса поведёт в магазин, в документацию, куда
// угодно. Имён два, потому что третьего случая пока не было; понадобится —
// добавляется правкой этой строки, то есть осознанно.
const ICONS = { github: Github, link: ExternalLink } as const

export const promoBand: SectionRenderer<'promoBand'> = (b, { key: k }) => {
  const Icon = ICONS[b.cta?.icon ?? 'link']
  return (
    <div
      key={k}
      data-promo-band
      // Ширина берётся у контейнера, а не у экрана: `w-full` вместо прежнего
      // `w-screen`. Отделяют полосу от соседей две акцентные черты, а не выход
      // за чужие поля.
      className="mt-8 w-full border-y-4 border-primary bg-background py-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 px-6 md:flex-row md:gap-16">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <H2 className="mb-6 max-w-3xl">{inline(b.title, `${k}-t`)}</H2>
          <P className="mb-12 max-w-xl text-muted-foreground">{inline(b.text, `${k}-x`)}</P>

          {b.cta && (
            <div className="mt-8 flex w-full flex-col gap-4">
              <a
                href={b.cta.href}
                // Внешний адрес открывается в новой вкладке, и `noopener`
                // обязателен рядом с `_blank`: без него открытая страница получает
                // ссылку на окно-родитель через `window.opener`.
                {...(b.cta.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/5 px-6 py-3 font-semibold text-foreground transition-colors hover:bg-primary/20"
              >
                <Icon size={18} aria-hidden />
                {b.cta.label}
              </a>
            </div>
          )}
        </div>

        <div className="relative shrink-0">
          {b.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={b.image}
              alt={b.alt ?? ''}
              width={300}
              height={300}
              className="h-auto max-w-xs sm:max-w-sm md:max-w-md"
            />
          ) : (
            // Заглушка держит ширину колонки: исчезнув, картинка роняет текст на
            // всю ширину полосы, и две колонки превращаются в одну.
            <div
              data-image-placeholder
              className="flex aspect-square w-[300px] max-w-xs items-center justify-center rounded-xl border border-border bg-muted/40 sm:max-w-sm"
            >
              <span className="text-[length:var(--fs-small)] text-muted-foreground">{b.alt ?? 'image'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
