"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { H3, P, Small } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { CasesBoard } from "./cases-board.client"
import type { CasesUi } from "../_i18n/cases.i18n"

// ПРОДУКТЫ И ИХ КЕЙСЫ НА ВКЛАДКЕ РЕЖИМА (34-E, 2026-08-29).
//
// 🔒 ЭТО НЕ ТА ПОВЕРХНОСТЬ, ЧТО Я СТРОИЛ УТРОМ И ЧТО ВЛАДЕЛЕЦ ОТПРАВИЛ УДАЛЯТЬ.
// Там были три операции из двадцати двух и плоский список кейсов без сброса
// подтверждения. Здесь список продуктов открывает НАСТОЯЩУЮ доску кейсов,
// перенесённую из панели вместе с тремя путями правки и гейтом.
//
// 🔒 ПРОДУКТ — ЕДИНИЦА РАБОТЫ, А НЕ СТРАНИЦА. Один сервер несёт несколько, и
// каждый живёт своим темпом. `id` (`p1`, `p2`) не значит ничего и не меняется
// никогда: на нём висят пути — страницы, таблицы `<id>_*`, папка логики.
//
// 🔒 ФАЗА И СТАДИЯ ТОЛЬКО ПОКАЗЫВАЮТСЯ. Стадия ВЫЧИСЛЯЕТСЯ хранилищем из самого
// досье в ту же секунду, что и сохраняется, — поэтому разойтись с данными не
// может. Дать её править значило бы завести второе мнение о том же.

export type ProductRow = {
  id: string
  title: string
  type: string
  surface: string
  route: string
  phase: string
  stage: string
  cases: { slug: string; title: string; summary: string; confirmed: boolean }[]
  steps: { number: number; title: string; status: string; kind: string }[]
}

export function ProductsBoard({
  initial,
  lang,
  ui,
  words,
}: {
  initial: ProductRow[]
  lang: string
  ui: CasesUi
  /** Слова этой обвязки: заголовки и пустое состояние. Тексты режима — отдельно. */
  words: { title: string; hint: string; empty: string; emptyHint: string; create: string; creating: string; created: string; namePlaceholder: string; phase: string; stage: string }
}) {
  const [items, setItems] = useState<ProductRow[]>(initial)
  const [open, setOpen] = useState<string | null>(initial[0]?.id ?? null)
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState("")

  async function create() {
    const clean = title.trim()
    setBusy(true)
    try {
      const r = await fetch("/api/architect/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // 🔒 ТА ЖЕ ДВЕРЬ И ТА ЖЕ ОПЕРАЦИЯ, ЧТО В ПАНЕЛИ. Своей двери «создать
        // продукт» здесь нет намеренно: две двери к одной папке — это два места,
        // где надо помнить про вечный номер.
        // Поля называются так же, как их ждёт дверь: `typeId` и `typeTitle`.
        // `newProduct` отличает «завести второй» от «передумать про первый» — без
        // него второй продукт был бы неотличим от смены структуры первого.
        body: JSON.stringify({ op: "project-type", typeId: "custom", typeTitle: clean, newProduct: true }),
      })
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; product?: ProductRow }
      if (!r.ok || d.ok === false || !d.product) {
        toast.error(ui.failed)
        return
      }
      setItems(prev => [...prev, d.product as ProductRow])
      setOpen(d.product.id)
      setTitle("")
      toast.success(words.created)
    } catch {
      toast.error(ui.failed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section data-products-board className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <H3 variant="ui">{words.title}</H3>
        <Small className="max-w-3xl">{words.hint}</Small>
      </div>
      <Separator />

      {items.length === 0 ? (
        <div data-products-empty className="flex flex-col gap-1 rounded-lg border border-dashed border-border px-4 py-6">
          <P className="text-[length:var(--fs-body)]">{words.empty}</P>
          <Small className="max-w-2xl">{words.emptyHint}</Small>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map(p => {
            const isOpen = open === p.id
            const confirmed = p.cases.filter(c => c.confirmed).length
            return (
              <li key={p.id} data-product={p.id} className="rounded-2xl border border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                >
                  {isOpen ? <ChevronDown className="size-4 shrink-0" aria-hidden /> : <ChevronRight className="size-4 shrink-0" aria-hidden />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[length:var(--fs-body)] text-foreground">{p.title || p.id}</span>
                    <Small className="block truncate font-mono">
                      {p.id} · {p.route || "—"} · {p.surface}
                    </Small>
                  </span>
                  {/* Счёт кейсов читается раньше, чем открыта карточка: он и есть
                      ответ на вопрос «сколько тут работы». */}
                  <span data-product-cases={p.cases.length} className="hidden shrink-0 text-[length:var(--fs-small)] text-muted-foreground sm:inline">
                    {confirmed}/{p.cases.length}
                  </span>
                  <span data-product-phase={p.phase} className="shrink-0 rounded-full border border-border px-3 py-1 text-[length:var(--fs-small)] text-muted-foreground">
                    {p.phase}
                  </span>
                  <span data-product-stage={p.stage} className="hidden shrink-0 text-[length:var(--fs-small)] text-muted-foreground md:inline">
                    {p.stage}
                  </span>
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-6 border-t border-border px-5 py-5">
                    <CasesBoard productId={p.id} cases={p.cases} lang={lang} ui={ui} />
                    <StepsList steps={p.steps} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={words.namePlaceholder}
          className="max-w-sm text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
        />
        <Button type="button" onClick={create} disabled={busy} data-product-create className="h-10 px-5">
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          {busy ? words.creating : words.create}
        </Button>
      </div>
    </section>
  )
}

// 🔒 ШАГИ ТОЛЬКО ПОКАЗЫВАЮТСЯ. Они рождаются из подтверждённых кейсов: первый —
// шаг разбора, который заводит сама дверь в момент подтверждения. Заведённый
// руками шаг не знал бы, из какого кейса вырос, — а это и есть смысл режима.
function StepsList({ steps }: { steps: ProductRow["steps"] }) {
  if (steps.length === 0) return null
  return (
    <ul data-steps-list className="flex flex-col gap-2">
      {steps.map(s => (
        <li
          key={s.number}
          data-step={s.number}
          data-step-status={s.status}
          className="flex items-center gap-3 rounded-lg border border-border px-4 py-2"
        >
          <span className="w-8 shrink-0 font-mono text-[length:var(--fs-small)] text-muted-foreground">{s.number}</span>
          <span className="min-w-0 flex-1 truncate text-[length:var(--fs-body)] text-foreground">{s.title}</span>
          <span className="shrink-0 text-[length:var(--fs-small)] text-muted-foreground">{s.status}</span>
        </li>
      ))}
    </ul>
  )
}
