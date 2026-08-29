"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { renumber, TOP_LABEL_MAX, type NavCandidate, type NavItem, type NavSlot } from "../_lib/nav"
import type { GroupsUi } from "../_i18n/groups.i18n"

// РЕДАКТОР ОДНОГО МЕНЮ — ВЕРХНЕЙ ПОЛОСЫ ИЛИ ПОДВАЛА (31-14 и 31-15, 2026-08-29).
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
// 🔒 «ВЕТКИ НЕТ» И «ВЕТКА ПУСТА» — РАЗНЫЕ ОТВЕТЫ. Пустой массив значит «владелец
// убрал все кнопки», отсутствие ветки — «он ещё не открывал раздел», и тогда сайт
// строит меню из собственных разделов. Поэтому ненастроенное меню показывается
// заполненным тем, что сейчас на сайте, и с объяснением: сохранение — это взятие
// меню в свои руки, а не первая его настройка с нуля.
export function NavEditor({
  slot,
  initial,
  configured,
  candidates,
  ui,
}: {
  slot: NavSlot
  initial: readonly NavItem[]
  /** Есть ли ветка в конфиге. Нет — на сайте работает набор по умолчанию. */
  configured: boolean
  /** Публичные страницы проекта — из чего собирают меню. */
  candidates: readonly NavCandidate[]
  ui: GroupsUi
}) {
  const t = ui.nav
  const [items, setItems] = useState<NavItem[]>(() => renumber(initial))
  const [saved, setSaved] = useState<string>(() => JSON.stringify(renumber(initial)))
  const [busy, setBusy] = useState(false)

  const changed = useMemo(() => JSON.stringify(items) !== saved, [items, saved])
  const used = useMemo(() => new Set(items.map(i => i.href)), [items])
  const free = candidates.filter(c => !used.has(c.href))

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
    const patch = { nav: { [slot]: items.map(i => (i.children ? i : { id: i.id, href: i.href, order: i.order, label: i.label })) } }

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
      toast.success(ui.saved)
      setSaved(JSON.stringify(items))
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

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
              <li
                key={item.id + item.href}
                data-nav-item={item.id}
                className="flex flex-col gap-2 rounded-lg border border-border px-4 py-3 md:flex-row md:items-center md:gap-4"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Small className="font-mono">{item.href}</Small>
                  <Input
                    value={item.label}
                    placeholder={t.labelHint}
                    aria-label={t.label}
                    maxLength={slot === "top" ? TOP_LABEL_MAX : undefined}
                    onChange={e => setLabel(index, e.target.value)}
                    className="h-10 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                  />
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

        {/* Страница, уже стоящая в меню, из кандидатов исчезает: один адрес
            дважды в одном меню — не выбор, а ошибка ввода. */}
        <div className="flex flex-wrap gap-2">
          {free.map(c => (
            <Button
              key={c.href}
              type="button"
              variant="outline"
              data-nav-candidate={c.id}
              onClick={() => add(c)}
              className="h-10 gap-2 px-4 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            >
              <Plus className="size-4" aria-hidden />
              {c.title}
            </Button>
          ))}
          {free.length === 0 && <Small>{t.empty}</Small>}
        </div>
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
