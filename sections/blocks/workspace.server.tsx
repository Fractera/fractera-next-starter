import type { SectionRenderer } from '@/sections/contract'
import type { WorkspaceItem, WorkspaceNote } from '@/lib/content/blocks/types'
import { H3, H4, P, Small } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'

// РАБОЧИЙ ЭКРАН: меню слева, содержимое справа (шаг 48, 2026-08-30).
//
// 🔒 РАСКЛАДКА СНЯТА С ЖИВОГО МЕНЮ СЛОЯ АРХИТЕКТОРА, А НЕ ПРИДУМАНА ЗАНОВО.
// Там она уже пережила правки владельца, и повторять их вслепую пришлось бы
// заново: до `md` меню — горизонтальная лента над содержимым, с `md` — колонка в
// 15rem сбоку; разделитель едет вслед за меню (сверху нижняя граница, слева
// правая), потому что линия отделяет меню от содержимого, а с какой стороны оно
// стоит — решает ширина экрана.
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
}: {
  item: WorkspaceItem
  base: string
  activeClass: string
  idleClass: string
  k: string
}) {
  const cls = base + (item.active ? activeClass : idleClass)
  if (!item.href) {
    // Не ссылка — значит и не кнопка: нажимать нечего. `span` честнее обоих.
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

export const workspace: SectionRenderer<'workspace'> = (b, { key: k, renderBlocks, lang, ui }) => (
  <div
    key={k}
    data-workspace
    className="mt-6 flex flex-col gap-6 rounded-xl border border-border bg-card p-4 md:flex-row md:gap-8 md:p-6"
  >
    {/* ЛЕВАЯ ЧАСТЬ — МЕНЮ.
        🔒 `self-start` ОБЯЗАТЕЛЕН У ЛИПКОЙ КОЛОНКИ: родитель — flex и по
        умолчанию растягивает её на всю высоту строки, а растянутому элементу
        некуда двигаться внутри собственной высоты — `sticky` молча перестаёт
        работать. Отказ без сообщения: класс написан, эффекта нет. */}
    <nav
      data-workspace-menu
      aria-label={b.menuTitle ?? b.title}
      className="shrink-0 border-b border-border pb-3 md:sticky md:top-20 md:max-h-[calc(100dvh-8rem)] md:w-60 md:self-start md:overflow-y-auto md:border-r md:border-b-0 md:pr-6"
    >
      {b.menuTitle && (
        <H4 variant="ui" className="mb-3">
          {inline(b.menuTitle, `${k}-mt`)}
        </H4>
      )}
      {/* 🔒 РЯД ПРОКРУЧИВАЕТСЯ, А НЕ ПЕРЕНОСИТСЯ. На телефоне восемь пунктов в
          две строки съедают экран, и человек листает страницу, не дойдя до того,
          ради чего пришёл. Отрицательный отступ с `px-1` — чтобы полоса
          прокрутки не срезала подсветку крайнего пункта. */}
      <ul className="slim-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-col md:overflow-x-visible">
        {b.menu.map((item, i) => (
          <li key={`${k}-m-${i}`} className="shrink-0 md:shrink">
            <Item
              item={item}
              k={`${k}-m-${i}`}
              // `md:truncate` — только в вертикальном меню: слева ширина задана, и
              // длинное название вылезало за границу. Наверху ширины нет вовсе,
              // ряд прокручивается, и многоточие появилось бы у каждого пункта.
              base="block whitespace-nowrap rounded-md px-3 py-2 text-[length:var(--fs-body)] transition-colors md:truncate"
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
