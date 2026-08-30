import type { ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { H3, H4, P, Small } from '@/components/ui/typography'

// РАСКЛАДКА РАБОЧЕГО ЭКРАНА — ОДНА НА БЛОК И НА СТРАНИЦЫ (шаг 49, 2026-08-30).
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ КОМПОНЕНТ, ЕСЛИ ВИД `workspace` УЖЕ ЕСТЬ. Вид принимает
// содержимое как `children: Block[]` — материал каталога. Страницы слоя
// архитектора содержат ОСТРОВКИ: редакторы полей, переключатели, загрузку
// картинок. Островок в блок не завернуть — он не материал, а работающая вещь.
//
// Значит у одной раскладки два потребителя с разной природой содержимого. Общий
// компонент принимает `ReactNode` — и блок, и страница дают ему своё:
//   • `sections/blocks/workspace.server.tsx` → отрисованные блоки материала;
//   • страницы слоя → островки.
//
// 🔒 ЭТО НЕ ТРАНСФОРМАЦИЯ ВИДА ПОД СТРАНИЦУ, И РАЗНИЦА ПРОВЕРЯЕМА. Вид не узнал
// о существовании страниц: он по-прежнему получает блоки и по-прежнему ничего не
// знает о слое архитектора. Общей стала РАСКЛАДКА — то, что и так было одним и
// тем же; разошлись бы две её копии на первой правке отступа.
//
// 🔒 БЕЗ `"use client"`. Ящик открывается переключателем и правилом CSS, поэтому
// работает при выключенном JavaScript. Островки приходят снаружи, в `children`, и
// клиентскими становятся сами по себе — раскладке для этого меняться не нужно.

export type WorkspaceShellItem = { label: string; href?: string; active?: boolean }
export type WorkspaceShellNote = {
  tone: 'recommended' | 'advice' | 'warning'
  title: string
  text: string
}

/** Три тона карточек. Те же три, что работают в слое архитектора. */
const NOTE_TONE: Record<WorkspaceShellNote['tone'], { box: string; title: string; text: string }> = {
  recommended: {
    box: 'border-emerald-500/40 bg-emerald-500/10',
    title: 'text-emerald-900 dark:text-emerald-100',
    text: 'text-emerald-800 dark:text-emerald-200',
  },
  advice: {
    box: 'border-amber-500/40 bg-amber-500/10',
    title: 'text-amber-900 dark:text-amber-100',
    text: 'text-amber-800 dark:text-amber-200',
  },
  warning: {
    box: 'border-destructive/40 bg-destructive/10',
    title: 'text-destructive',
    text: 'text-destructive',
  },
}

/**
 * Пункт меню или вкладки.
 *
 * 🔒 ССЫЛКА ТОЛЬКО ТАМ, ГДЕ ЕСТЬ АДРЕС; пункт без адреса — ярлык, закрывающий
 * ящик. Мёртвая ссылка хуже её отсутствия, а закрывать ящик после выбора нужно —
 * иначе он остаётся поверх того, что человек только что открыл.
 *
 * 🔒 `aria-current` — ТОЛЬКО АКТИВНОМУ, И ТОЛЬКО ОДНОМУ: экранный диктор читает
 * его как «текущая страница», и два таких пункта означают, что человек находится
 * в двух местах сразу.
 */
function Item({
  item,
  base,
  activeClass,
  idleClass,
  closes,
  content,
}: {
  item: WorkspaceShellItem
  base: string
  activeClass: string
  idleClass: string
  closes?: string
  /** Готовая подпись: страница может отдать разметку, блок — размеченный текст. */
  content?: ReactNode
}) {
  const cls = base + (item.active ? activeClass : idleClass)
  const body = content ?? item.label
  if (item.href) {
    return (
      <a href={item.href} aria-current={item.active ? 'page' : undefined} className={cls}>
        {body}
      </a>
    )
  }
  if (closes) {
    return (
      <label
        htmlFor={closes}
        aria-current={item.active ? 'page' : undefined}
        className={cls + ' cursor-pointer md:cursor-default'}
      >
        {body}
      </label>
    )
  }
  return (
    <span aria-current={item.active ? 'page' : undefined} className={cls}>
      {body}
    </span>
  )
}

export function WorkspaceShell({
  id,
  menuTitle,
  menuWord,
  menu,
  title,
  lead,
  notes,
  tabs,
  children,
  renderItem,
  renderTab,
}: {
  /** Уникальный на странице идентификатор: из него строится имя переключателя. */
  id: string
  menuTitle?: string
  /** Слово «Меню» на языке страницы — подпись кнопки, открывающей ящик. */
  menuWord: string
  menu: WorkspaceShellItem[]
  title: ReactNode
  lead?: ReactNode
  notes?: WorkspaceShellNote[]
  tabs?: WorkspaceShellItem[]
  children?: ReactNode
  /** Своя отрисовка подписи пункта — нужна там, где подпись размечена. */
  renderItem?: (item: WorkspaceShellItem, index: number) => ReactNode
  renderTab?: (item: WorkspaceShellItem, index: number) => ReactNode
}) {
  const drawer = `${id}-drawer`

  return (
    <div
      data-workspace
      className="mt-6 flex flex-col gap-6 rounded-xl border border-border bg-card p-4 md:flex-row md:gap-8 md:p-6"
    >
      {/* 🔒 ПЕРЕКЛЮЧАТЕЛЬ СТОИТ ПЕРВЫМ СРЕДИ СОСЕДЕЙ. Правило `peer-checked:`
          читает только ПРЕДШЕСТВУЮЩЕГО соседа; поставь его после меню — класс
          написан, эффекта нет, и отказ будет молчаливым. */}
      <input id={drawer} type="checkbox" className="peer sr-only" aria-hidden tabIndex={-1} />

      {/* Кнопка ящика. Существует только до `md`: на широком экране меню и так на
          виду, и кнопка к нему была бы предложением открыть открытое. */}
      <label
        htmlFor={drawer}
        data-workspace-open
        className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
      >
        <Menu size={16} aria-hidden />
        {menuTitle ?? menuWord}
      </label>

      {/* ЛЕВАЯ ЧАСТЬ. До `md` — ящик в 90 % ширины, уехавший за левый край;
          `peer-checked` возвращает его на место. С `md` — липкая колонка.

          🔒 `self-start` ОБЯЗАТЕЛЕН У ЛИПКОЙ КОЛОНКИ: родитель — flex и по
          умолчанию растягивает её на всю высоту строки, а растянутому элементу
          некуда двигаться внутри собственной высоты — `sticky` молча перестаёт
          работать.

          🔒 `slim-scrollbar` — ТИХАЯ ПОЛОСА: жёлоба нет, остаётся бегунок. Без
          неё браузер рисует свой серый жёлоб во всю высоту ящика, и панель
          выглядит обрезанной по правому краю. */}
      <nav
        data-workspace-menu
        aria-label={menuTitle ?? menuWord}
        className="slim-scrollbar fixed left-0 top-0 z-40 h-dvh w-[90%] -translate-x-full overflow-y-auto border-r border-border bg-card p-4 shadow-xl transition-transform duration-200 peer-checked:translate-x-0 md:static md:z-auto md:h-auto md:max-h-[calc(100dvh-var(--wsx-top)-2rem)] md:w-60 md:shrink-0 md:translate-x-0 md:self-start md:shadow-none md:sticky wsx-sticky wsx-rule-up"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          {menuTitle ? <H4 variant="ui">{menuTitle}</H4> : <span aria-hidden />}
          <label
            htmlFor={drawer}
            data-workspace-close
            aria-label={menuWord}
            className="shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
          >
            <X size={16} aria-hidden />
          </label>
        </div>

        <ul className="flex flex-col gap-1">
          {menu.map((item, i) => (
            <li key={`${id}-m-${i}`}>
              <Item
                item={item}
                closes={drawer}
                content={renderItem?.(item, i)}
                base="block truncate whitespace-nowrap rounded-md px-3 py-2 text-[length:var(--fs-body)] transition-colors"
                activeClass=" bg-muted font-medium text-foreground"
                idleClass=" text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ПРАВАЯ ЧАСТЬ. `min-w-0` держит длинное содержимое внутри колонки: без
          него таблица или строка кода растягивает flex-элемент и ломает
          раскладку целиком. */}
      <div data-workspace-content className="flex min-w-0 flex-1 flex-col gap-4">
        <div>
          <H3>{title}</H3>
          {lead && <P className="mt-1 text-muted-foreground">{lead}</P>}
        </div>

        {notes && notes.length > 0 && (
          <div data-workspace-notes className="flex flex-col gap-2">
            {notes.map((note, i) => {
              const tone = NOTE_TONE[note.tone]
              return (
                <div key={`${id}-n-${i}`} data-tone={note.tone} className={`rounded-lg border p-3 ${tone.box}`}>
                  <P className={`font-semibold ${tone.title}`}>{note.title}</P>
                  <Small className={`mt-1 block ${tone.text}`}>{note.text}</Small>
                </div>
              )
            })}
          </div>
        )}

        {/* ВЕРХНИЙ РЯД РАЗДЕЛОВ. Липкий с `md` — ровно так же, как левое меню, и по
            той же причине (владелец 2026-08-30): «когда лента в правой секции очень
            большая, механизмы навигации уходят далеко вверх, что делает невозможным
            навигацию между вкладками до того, как я верну страницу».

            🔒 ПРАВКА ОДНА, А СТРАНИЦ ТРИ. Оболочку зовут и вид каталога
            `workspace`, и обе страницы слоя архитектора — настройки проекта и
            дизайн. Ряд разделов рисуется здесь и только здесь, поэтому изменение
            доезжает до всех троих само.

            🔒 ФОН ОБЯЗАТЕЛЕН У ЛИПКОГО РЯДА. Прозрачный он пропускает под собой
            уезжающее содержимое, и текст читается сквозь ярлыки.

            🔒 СТИКИ ЖИВЁТ, ПОКА НИ ОДИН ПРЕДОК НЕ СТАЛ КОНТЕЙНЕРОМ ПРОКРУТКИ.
            `overflow: hidden` у любого родителя выключает его МОЛЧА — тем же днём
            это правило чуть не поставили на корень страницы ради полосы `promoBand`;
            там выбран `clip`, а потом снят и он. */}
        {tabs && tabs.length > 0 && (
          <nav
            data-workspace-tabs
            aria-label={typeof title === 'string' ? title : menuWord}
            className="slim-scrollbar wsx-strip -mx-1 flex gap-1.5 overflow-x-auto bg-card px-1 pb-1 md:sticky wsx-sticky md:z-30 md:py-3"
          >
            {tabs.map((tab, i) => (
              <Item
                key={`${id}-tab-${i}`}
                item={tab}
                content={renderTab?.(tab, i)}
                base="shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-[length:var(--fs-small)] transition-colors"
                activeClass=" border-primary/50 bg-primary/5 text-foreground"
                idleClass=" border-border text-muted-foreground hover:bg-muted/50"
              />
            ))}
          </nav>
        )}

        {children && <div data-workspace-body className="flex flex-col">{children}</div>}
      </div>
    </div>
  )
}
