"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, CornerDownRight, CornerLeftUp, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import {
  candidateTree,
  renumber,
  TOP_LABEL_MAX,
  type NavCandidate,
  type NavItem,
  type NavSlot,
} from "../_lib/nav"
import type { GroupsUi } from "../_i18n/groups.i18n"

// РЕДАКТОР ОДНОГО МЕНЮ — ВЕРХНЕЙ ПОЛОСЫ ИЛИ ПОДВАЛА (31-14 и 31-15, 2026-08-29).
// Вложенность — 31-23, дерево кандидатов и бэйдж языка — 31-24.
//
// 🔒 ОДИН ЭЛЕМЕНТ НА ДВА МЕНЮ. Верхняя полоса и подвал — разные места с разным
// смыслом, но одной машиной: список ссылок с порядком и подписями. Две копии
// разошлись бы на первой же правке, и разошлись бы молча.
//
// 🔒 ПОРЯДОК ЗАДАЁТСЯ СТРЕЛКАМИ, А НЕ ПЕРЕТАСКИВАНИЕМ, и это осознанный выбор.
// Перетаскивание требует библиотеки, работает мимо клавиатуры и плохо живёт на
// телефоне; меню проекта — это пять-семь ссылок, и две стрелки решают задачу
// целиком. Порядок пересчитывается при каждом движении: сайт сортирует по `order`,
// и дыра в нумерации однажды поставит новый пункт не туда.
//
// 🔒 ВЛОЖЕННОСТЬ ТОЖЕ БЕЗ ПЕРЕТАСКИВАНИЯ — ДВЕ КНОПКИ. Здесь стоял названный предел:
// «осмысленный ввод вложенности требует перетаскивания». Он оказался неверен.
// Вложение — это отношение к СОСЕДУ СВЕРХУ, а не позиция в пространстве: «внутрь»
// делает пункт ребёнком предыдущего, «наружу» возвращает его в корень на место сразу
// после бывшего родителя. Мышь для этого не нужна, клавиатура работает, телефон тоже.
//
// 🔒 «ВЕТКИ НЕТ» И «ВЕТКА ПУСТА» — РАЗНЫЕ ОТВЕТЫ. Пустой массив значит «владелец
// убрал все кнопки», отсутствие ветки — «он ещё не открывал раздел», и тогда сайт
// строит меню из собственных разделов.
export function NavEditor({
  slot,
  initial,
  configured,
  candidates,
  editLang,
  ui,
}: {
  slot: NavSlot
  initial: readonly NavItem[]
  /** Есть ли ветка в конфиге. Нет — на сайте работает набор по умолчанию. */
  configured: boolean
  /** Публичные страницы проекта — из чего собирают меню. */
  candidates: readonly NavCandidate[]
  /**
   * Язык, для которого сейчас правятся подписи.
   *
   * 🔒 ПОКАЗЫВАЕТСЯ БЭЙДЖЕМ У КАЖДОГО ПОЛЯ (решение владельца 2026-08-29). Поле
   * подписи выглядит одинаково на любом языке, а пишет в разные ячейки: человек,
   * забывший переключить язык настроек, правит русскую подпись, глядя на немецкую
   * страницу, и узнаёт об этом на сайте.
   */
  editLang: string
  ui: GroupsUi
}) {
  const t = ui.nav
  const [items, setItems] = useState<NavItem[]>(() => renumber(initial))
  const [saved, setSaved] = useState<string>(() => JSON.stringify(renumber(initial)))
  const [busy, setBusy] = useState(false)
  const [closed, setClosed] = useState<Set<string>>(() => new Set())

  const changed = useMemo(() => JSON.stringify(items) !== saved, [items, saved])

  // Занятые адреса считаются ВМЕСТЕ С ДЕТЬМИ: вложенный пункт стоит в меню так же,
  // как корневой, и предлагать его второй раз — та же ошибка ввода.
  const used = useMemo(() => {
    const set = new Set<string>()
    for (const i of items) {
      set.add(i.href)
      for (const c of i.children ?? []) set.add(c.href)
    }
    return set
  }, [items])

  const tree = useMemo(
    () => candidateTree(candidates.filter(c => !used.has(c.href))),
    [candidates, used],
  )
  const freeCount = useMemo(
    () => tree.reduce((n, node) => n + 1 + node.children.length, 0),
    [tree],
  )

  function move(index: number, delta: number) {
    const next = [...items]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(renumber(next))
  }

  function add(c: NavCandidate) {
    setItems(prev => renumber([...prev, { id: c.id, href: c.href, order: 0, label: "" }]))
  }

  function remove(index: number) {
    setItems(prev => renumber(prev.filter((_, i) => i !== index)))
  }

  function setLabel(index: number, label: string) {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, label } : item)))
  }

  // 🔒 ВЛОЖИТЬ МОЖНО ТОЛЬКО ПУНКТ БЕЗ ДЕТЕЙ И ТОЛЬКО В ПУНКТ БЕЗ РОДИТЕЛЯ: глубина
  // сайта — два уровня, и третий записался бы в файл, не появившись на экране.
  function nest(index: number) {
    if (index === 0) return
    setItems(prev => {
      const child = prev[index]
      if (child.children?.length) return prev
      const parent = prev[index - 1]
      const next = prev.filter((_, i) => i !== index)
      const pi = next.indexOf(parent)
      next[pi] = {
        ...parent,
        children: [...(parent.children ?? []), { id: child.id, href: child.href, label: child.label }],
      }
      return renumber(next)
    })
  }

  function unnest(parentIndex: number, childIndex: number) {
    setItems(prev => {
      const parent = prev[parentIndex]
      const kids = parent.children ?? []
      const child = kids[childIndex]
      if (!child) return prev
      const rest = kids.filter((_, i) => i !== childIndex)
      const next = [...prev]
      next[parentIndex] = { ...parent, children: rest.length ? rest : undefined }
      // Встаёт сразу за бывшим родителем: пункт, улетевший в конец списка, человек
      // считает потерянным и добавляет второй раз.
      next.splice(parentIndex + 1, 0, { id: child.id, href: child.href, order: 0, label: child.label })
      return renumber(next)
    })
  }

  function setChildLabel(parentIndex: number, childIndex: number, label: string) {
    setItems(prev =>
      prev.map((item, i) =>
        i !== parentIndex
          ? item
          : { ...item, children: (item.children ?? []).map((c, j) => (j === childIndex ? { ...c, label } : c)) },
      ),
    )
  }

  function removeChild(parentIndex: number, childIndex: number) {
    setItems(prev =>
      prev.map((item, i) => {
        if (i !== parentIndex) return item
        const rest = (item.children ?? []).filter((_, j) => j !== childIndex)
        return { ...item, children: rest.length ? rest : undefined }
      }),
    )
  }

  function toggleBranch(href: string) {
    setClosed(prev => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href)
      else next.add(href)
      return next
    })
  }

  async function save() {
    if (!changed) {
      toast.info(ui.nothingToSave)
      return
    }
    setBusy(true)

    // 🔒 ОТПРАВЛЯЕТСЯ ВЕТКА ЦЕЛИКОМ, И ЗДЕСЬ ЭТО ЕДИНСТВЕННЫЙ ВЕРНЫЙ СПОСОБ.
    // Заплата умеет сливать объекты, но `nav.top` — МАССИВ, и слияние массивов
    // по индексу означало бы, что удалённый последний пункт остаётся на диске
    // навсегда. Массив заменяется целиком; соседние ветки конфига при этом
    // по-прежнему защищены — мы шлём только `nav.<slot>`.
    const patch = {
      nav: {
        [slot]: items.map(i => ({
          id: i.id,
          href: i.href,
          order: i.order,
          label: i.label,
          ...(i.children?.length ? { children: i.children } : {}),
        })),
      },
    }

    try {
      const res = await fetch("/api/architect/app-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      toast.success(ui.savedReload)
      setSaved(JSON.stringify(items))
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  const labelInput = (value: string, onChange: (v: string) => void) => (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        placeholder={t.labelHint}
        aria-label={t.label}
        maxLength={slot === "top" ? TOP_LABEL_MAX : undefined}
        onChange={e => onChange(e.target.value)}
        className="h-10 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
      />
      {/* Бэйдж стоит У ПОЛЯ, а не в шапке страницы: правят здесь, и здесь же надо
          видеть, куда попадёт написанное. */}
      <Badge data-edit-lang={editLang} variant="secondary" className="shrink-0 uppercase">
        {editLang}
      </Badge>
    </div>
  )

  return (
    <div data-nav-editor={slot} className="flex flex-col gap-8">
      {/* Ненастроенное меню объясняет, откуда взялся показанный набор: иначе
          человек решит, что кто-то уже всё настроил за него. */}
      {!configured && (
        <Small data-nav-defaults className="rounded-md border border-blue-500/30 bg-blue-500/5 px-3 py-2 text-blue-700 dark:text-blue-300">
          {t.defaultsNotice}
        </Small>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.items}</H3>
          <Small className="max-w-2xl">{t.itemsHint}</Small>
          <Small className="max-w-2xl">{t.nestHint}</Small>
        </div>
        <Separator />

        {items.length === 0 ? (
          <div className="flex flex-col gap-1 rounded-lg border border-dashed border-border px-4 py-6">
            <P className="text-[length:var(--fs-body)]">{t.empty}</P>
            <Small>{t.emptyHint}</Small>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => (
              <li key={item.id + item.href} className="flex flex-col gap-2">
                <div
                  data-nav-item={item.id}
                  data-depth="0"
                  className="flex flex-col gap-2 rounded-lg border border-border px-4 py-3 md:flex-row md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Small className="font-mono">{item.href}</Small>
                    {labelInput(item.label, v => setLabel(index, v))}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={t.up}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="size-10"
                    >
                      <ArrowUp className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={t.down}
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                      className="size-10"
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </Button>
                    {/* Вложить некуда, если пункт первый или сам держит детей. */}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={t.nest}
                      title={t.nest}
                      data-nav-nest
                      disabled={index === 0 || Boolean(item.children?.length)}
                      onClick={() => nest(index)}
                      className="size-10"
                    >
                      <CornerDownRight className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t.remove}
                      data-nav-remove
                      onClick={() => remove(index)}
                      className="size-10"
                    >
                      <X className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>

                {/* Дети рисуются СО СДВИГОМ и своей полосой слева: вложенность видна
                    формой, а не подписью «внутри чего-то». */}
                {(item.children ?? []).map((child, ci) => (
                  <div
                    key={child.id + child.href}
                    data-nav-item={child.id}
                    data-depth="1"
                    data-nav-child-of={item.id}
                    className="ms-6 flex flex-col gap-2 rounded-lg border border-border border-s-2 border-s-primary px-4 py-3 md:ms-10 md:flex-row md:items-center md:gap-4"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Small className="font-mono">
                        <span className="text-muted-foreground">{t.childOf} {item.id} · </span>
                        {child.href}
                      </Small>
                      {labelInput(child.label, v => setChildLabel(index, ci, v))}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={t.unnest}
                        title={t.unnest}
                        data-nav-unnest
                        onClick={() => unnest(index, ci)}
                        className="size-10"
                      >
                        <CornerLeftUp className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={t.remove}
                        onClick={() => removeChild(index, ci)}
                        className="size-10"
                      >
                        <X className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}

        {slot === "top" && <Small>{t.labelLimit}</Small>}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.candidates}</H3>
        </div>
        <Separator />

        {/* 🔒 ДЕРЕВО, А НЕ РЯД КНОПОК. Ряд растёт линейно с числом страниц: на трёх
            он занимает полэкрана, на тридцати вытесняет само меню, ради которого
            человек сюда пришёл. Ветка сворачивается — и остаётся одна строка. */}
        {freeCount === 0 ? (
          <Small>{t.empty}</Small>
        ) : (
          <ul data-page-tree className="flex flex-col gap-1">
            {tree.map(node => {
              const open = !closed.has(node.candidate.href)
              const hasKids = node.children.length > 0
              return (
                <li key={node.candidate.href} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    {hasKids ? (
                      <button
                        type="button"
                        data-tree-toggle={node.candidate.id}
                        aria-expanded={open}
                        aria-label={open ? t.collapse : t.expand}
                        title={open ? t.collapse : t.expand}
                        onClick={() => toggleBranch(node.candidate.href)}
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {open ? <ChevronDown className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
                      </button>
                    ) : (
                      <span className="size-8 shrink-0" />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      data-nav-candidate={node.candidate.id}
                      onClick={() => add(node.candidate)}
                      className="h-10 flex-1 justify-start gap-2 px-4 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                    >
                      <Plus className="size-4 shrink-0" aria-hidden />
                      <span className="truncate">{node.candidate.title}</span>
                      {hasKids && <span className="ms-auto shrink-0 text-muted-foreground">{node.children.length}</span>}
                    </Button>
                  </div>

                  {open &&
                    node.children.map(child => (
                      <div key={child.href} className="flex items-center gap-1 ps-8">
                        <span className="size-8 shrink-0" />
                        <Button
                          type="button"
                          variant="ghost"
                          data-nav-candidate={child.id}
                          onClick={() => add(child)}
                          className="h-10 flex-1 justify-start gap-2 px-4 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                        >
                          <Plus className="size-4 shrink-0" aria-hidden />
                          <span className="truncate">{child.title}</span>
                        </Button>
                      </div>
                    ))}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={busy || !changed} data-save className="h-10 px-5">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? ui.saving : ui.save}
        </Button>
        {!changed && <P className="text-[length:var(--fs-small)] text-muted-foreground">{ui.nothingToSave}</P>}
      </div>
    </div>
  )
}
