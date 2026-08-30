import type { SectionRenderer } from '@/sections/contract'
import type { WorkspaceItem, WorkspaceNote } from '@/lib/content/blocks/types'
import { H3, H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { Menu } from 'lucide-react'

// РАБОЧИЙ ЭКРАН: меню слева, содержимое справа (шаг 48, 2026-08-30).
//
// 🔒 РАСКЛАДКА ВЗЯТА У ЖИВОГО МЕНЮ СЛОЯ АРХИТЕКТОРА, НО НА ТЕЛЕФОНЕ ОНА ДРУГАЯ
// (правка 48-1, 2026-08-30). С `md` — та же липкая колонка в 15rem. До `md` слой
// превращает меню в горизонтальную ленту, и владелец, увидев это здесь, назвал
// приём неправильным: «нужно чтобы левое меню превращалось в выдвижной ящик
// который открывается на 90%». Он прав по существу — рабочий экран с восемью
// разделами в ряд не помещается, ряд начинает прокручиваться, и человек не видит,
// где находится. Ящик показывает все разделы разом и уходит после выбора.
//
// 🔒 ЛЕНТУ В СЛОЕ АРХИТЕКТОРА ЭТА ПРАВКА НЕ ТРОГАЕТ. Перенос его страниц на этот
// вид — отдельная работа по слову владельца; менять их заодно значило бы правку,
// о которой никто не просил, в файлах, которых шаг не касается.
//
// 🔒 ЗНАЧЕНИЯ ТОНОВ ПЕРЕНЕСЕНЫ, А НЕ ИМПОРТИРОВАНЫ. `advice-note.tsx` живёт в
// слое архитектора, а этот блок обязан работать на ЛЮБОЙ странице проекта,
// включая публичную, где того слоя нет вовсе. Импорт связал бы каталог секций со
// слоем — и первый же гость, поставивший блок на свою страницу, получил бы
// зависимость, о которой не просил.
//
// 🔒 БЕЗ `"use client"` — свойство слоя: ни один файл под `sections/` не бывает
// клиентским. Раскладка, меню и вкладки статичны; интерактивность приходит
// островком внутри `children`, если она вообще нужна.

/** Три тона карточек. Те же три, что работают в слое архитектора. */
const NOTE_TONE: Record<WorkspaceNote['tone'], { box: string; title: string; text: string }> = {
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
 * Пункт меню или вкладки. Ссылка — только когда адрес задан.
 *
 * 🔒 `aria-current` СТАВИТСЯ ТОЛЬКО АКТИВНОМУ, И ТОЛЬКО ОДНОМУ. Экранный диктор
 * читает его как «текущая страница»; два таких пункта означают, что человек
 * находится в двух местах сразу.
 */
function Item({
  item,
  base,
  activeClass,
  idleClass,
  k,
  closes,
}: {
  item: WorkspaceItem
  base: string
  activeClass: string
  idleClass: string
  k: string
  /** Идентификатор ящика: пункт без адреса закрывает его собой. */
  closes?: string
}) {
  const cls = base + (item.active ? activeClass : idleClass)
  if (!item.href) {
    // 🔒 ПУНКТ БЕЗ АДРЕСА — ЯРЛЫК ЯЩИКА, А НЕ МЁРТВАЯ ССЫЛКА (48-1, 2026-08-30).
    // Требование владельца: «после клика на любую из кнопок снова закрывается».
    // У пункта со ссылкой это выходит само — уход на страницу закрывает ящик;
    // у пункта без адреса закрывать было нечем, и ящик оставался открытым поверх
    // содержимого, которое человек только что выбрал.
    //
    // Ярлык снимает тот же переключатель, которым ящик открыт, — то есть закрытие
    // работает и с выключенным JavaScript, как и открытие.
    if (closes) {
      return (
        <label
          key={k}
          htmlFor={closes}
          aria-current={item.active ? 'page' : undefined}
          className={cls + ' cursor-pointer md:cursor-default'}
        >
          {item.label}
        </label>
      )
    }
    return (
      <span key={k} aria-current={item.active ? 'page' : undefined} className={cls}>
        {item.label}
      </span>
    )
  }
  return (
    <a key={k} href={item.href} aria-current={item.active ? 'page' : undefined} className={cls}>
      {item.label}
    </a>
  )
}

export const workspace: SectionRenderer<'workspace'> = (b, { key: k, renderBlocks, lang, ui }) => {
  // Идентификатор переключателя ящика. Ключ блока уникален на странице, значит
  // уникален и он: двух ящиков с одним именем на странице не окажется.
  const drawer = `${k}-drawer`

  return (
  <div
    key={k}
    data-workspace
    className="mt-6 flex flex-col gap-6 rounded-xl border border-border bg-card p-4 md:flex-row md:gap-8 md:p-6"
  >
    {/* ВЫДВИЖНОЙ ЯЩИК НА ТЕЛЕФОНЕ — БЕЗ ЕДИНОЙ СТРОКИ JAVASCRIPT (48-1, 2026-08-30).
        Требование владельца дословно: «левое меню у нас сейчас в мобильной версии
        превращается в верхнее меню это неправильно. Нужно чтобы левое меню
        превращалось в выдвижной ящик который открывается на 90% и после клика на
        любую из кнопок снова закрывается а также должна появиться область для
        кнопки открыть ящик».

        🔒 ПЕРЕКЛЮЧАТЕЛЬ, А НЕ ОСТРОВОК. Канон проекта — сначала спросить, нужен ли
        островок вообще: открыть и закрыть панель умеет чистый CSS, и тогда ящик
        работает при выключенном JavaScript, а не «терпимо». Тот же приём, что у
        вида `problemSolution`.

        🔒 ПЕРЕКЛЮЧАТЕЛЬ СТОИТ ПЕРВЫМ СРЕДИ СОСЕДЕЙ. Правило `peer-checked:` читает
        только ПРЕДШЕСТВУЮЩЕГО соседа; поставь его после меню — класс написан,
        эффекта нет, и отказ будет молчаливым. */}
    <input id={drawer} type="checkbox" className="peer sr-only" aria-hidden tabIndex={-1} />

    {/* Область кнопки — та самая, которую просил владелец. Существует только до
        `md`: на широком экране меню и так на виду, и кнопка к нему была бы
        предложением открыть открытое. */}
    <label
      htmlFor={drawer}
      data-workspace-open
      className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
    >
      <Menu size={16} aria-hidden />
      {b.menuTitle ?? ui.workspaceMenu}
    </label>

    {/* Затемнение под ящиком: клик мимо меню тоже закрывает — привычка, которую
        человек приносит с собой, и обманывать её незачем. */}
    <label
      htmlFor={drawer}
      aria-hidden
      className="fixed inset-0 z-30 hidden bg-foreground/40 peer-checked:block md:peer-checked:hidden"
    />

    {/* ЛЕВАЯ ЧАСТЬ — МЕНЮ.
        До `md` это ящик шириной 90 %, уехавший за левый край; `peer-checked`
        возвращает его на место. С `md` — обычная липкая колонка.

        🔒 `self-start` ОБЯЗАТЕЛЕН У ЛИПКОЙ КОЛОНКИ: родитель — flex и по
        умолчанию растягивает её на всю высоту строки, а растянутому элементу
        некуда двигаться внутри собственной высоты — `sticky` молча перестаёт
        работать. Отказ без сообщения: класс написан, эффекта нет. */}
    <nav
      data-workspace-menu
      aria-label={b.menuTitle ?? b.title}
      // 🔒 ОТСТУП `p-4` ОДИН НА ВСЕ ШИРИНЫ, И ЭТО НЕ НЕДОСМОТР. Первая редакция
      // гасила его на широком экране (`md:p-0`), и сторож типографики отказал:
      // «отступ УБЫВАЕТ с ростом экрана». Правило абсолютно намеренно, и обходить
      // его классом-хитростью значило бы завести исключение, которое следующий
      // скопирует. Вместо этого отступ остался общим: ящику он даёт поля, колонке
      // — воздух внутри рамки карточки, и ни одна ширина не проигрывает.
      className="fixed left-0 top-0 z-40 h-dvh w-[90%] -translate-x-full overflow-y-auto border-r border-border bg-card p-4 shadow-xl transition-transform duration-200 peer-checked:translate-x-0 md:static md:z-auto md:h-auto md:max-h-[calc(100dvh-8rem)] md:w-60 md:shrink-0 md:translate-x-0 md:self-start md:shadow-none md:sticky md:top-20"
    >
      {b.menuTitle && (
        <H4 variant="ui" className="mb-3">
          {inline(b.menuTitle, `${k}-mt`)}
        </H4>
      )}
      {/* 🪦 ГОРИЗОНТАЛЬНОЙ ЛЕНТЫ НА ТЕЛЕФОНЕ БОЛЬШЕ НЕТ (48-1). Здесь стояло
          `flex gap-1 overflow-x-auto … md:flex-col`: до `md` меню становилось
          верхним рядом. Владелец назвал это неправильным — и он прав по
          существу, а не по вкусу: рабочий экран с восемью разделами не помещается
          в ряд, ряд начинает прокручиваться, и человек не видит, где находится.
          Теперь меню всегда колонка, а на телефоне эта колонка живёт в ящике. */}
      <ul className="flex flex-col gap-1">
        {b.menu.map((item, i) => (
          <li key={`${k}-m-${i}`}>
            <Item
              item={item}
              k={`${k}-m-${i}`}
              closes={drawer}
              // `truncate` теперь безусловен: колонка есть на любой ширине, и
              // длинное название обязано кончаться многоточием, а не вылезать.
              base="block truncate whitespace-nowrap rounded-md px-3 py-2 text-[length:var(--fs-body)] transition-colors"
              activeClass=" bg-muted font-medium text-foreground"
              idleClass=" text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            />
          </li>
        ))}
      </ul>
    </nav>

    {/* ПРАВАЯ ЧАСТЬ — СОДЕРЖИМОЕ.
        `min-w-0` держит длинное содержимое внутри колонки: без него таблица или
        строка кода растягивает flex-элемент и ломает раскладку целиком. */}
    <div data-workspace-content className="flex min-w-0 flex-1 flex-col gap-4">
      <div>
        <H3>{inline(b.title, `${k}-t`)}</H3>
        {b.lead && <P className="mt-1 text-muted-foreground">{inline(b.lead, `${k}-l`)}</P>}
      </div>

      {b.notes && b.notes.length > 0 && (
        <div data-workspace-notes className="flex flex-col gap-2">
          {b.notes.map((note, i) => {
            const tone = NOTE_TONE[note.tone]
            return (
              <div
                key={`${k}-n-${i}`}
                data-tone={note.tone}
                className={`rounded-lg border p-3 ${tone.box}`}
              >
                <P className={`font-semibold ${tone.title}`}>{inline(note.title, `${k}-n-${i}-t`)}</P>
                <Small className={`mt-1 block ${tone.text}`}>{inline(note.text, `${k}-n-${i}-x`)}</Small>
              </div>
            )
          })}
        </div>
      )}

      {/* ВЕРХНИЙ РЯД РАЗДЕЛОВ — необязателен, и его отсутствие есть второй случай
          владельца, а не упущение. */}
      {b.tabs && b.tabs.length > 0 && (
        <nav
          data-workspace-tabs
          aria-label={b.title}
          className="slim-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
        >
          {b.tabs.map((tab, i) => (
            <Item
              key={`${k}-tab-${i}`}
              item={tab}
              k={`${k}-tab-${i}`}
              base="shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-[length:var(--fs-small)] transition-colors"
              activeClass=" border-primary/50 bg-primary/5 text-foreground"
              idleClass=" border-border text-muted-foreground hover:bg-muted/50"
            />
          ))}
        </nav>
      )}

      {b.children.length > 0 && (
        <div data-workspace-body className="flex flex-col">
          {renderBlocks(b.children, lang, ui, `${k}-c`)}
        </div>
      )}
    </div>
  </div>
  )
}
