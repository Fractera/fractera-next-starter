"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronRight, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { H3, P, Small } from "@/components/ui/typography"
import type { DevModeUi } from "../_i18n/dev-mode.i18n"

// ПОВЕРХНОСТЬ ПРОДУКТОВ НА ВКЛАДКЕ КЕЙСОВ (34-2 … 34-5, 2026-08-29).
//
// 🔒 ОНА СТОИТ ПОД ОПИСАНИЕМ РЕЖИМА, А НЕ ВМЕСТО НЕГО. Человек, впервые открывший
// вкладку, сначала читает, что этот режим значит, и лишь потом видит инструмент.
// Поменяй местами — и описание станет подписью под таблицей, которую не читают.
//
// 🔒 ПРОДУКТ — НЕ СТРАНИЦА. Это то, что несёт сервер: магазин, лендинг, мозг
// компании — со своими кейсами, шагами и адресом. Пустое состояние объясняет
// именно это: ноль продуктов на свежем проекте — норма, а не поломка.
//
// 🔒 `id` ВЕЧЕН И ПОКАЗЫВАЕТСЯ, НО НЕ ПРАВИТСЯ. На нём висят пути: страницы,
// таблицы `<id>_*`, папка логики. Название и адрес владелец меняет свободно.
//
// 🔒 ФАЗА И СТАДИЯ ТОЛЬКО ПОКАЗЫВАЮТСЯ. Стадия ВЫЧИСЛЯЕТСЯ из досье, а не
// назначается мнением: записанная руками, она начнёт врать при первой же правке —
// кейсы подтвердили, а на экране по-прежнему «ожидание».

/** Досье в том виде, в каком его отдаёт дверь: сырой файл, без умолчаний. */
export type ProductRow = {
  id: string
  title?: string
  surface?: string
  route?: string
  published?: boolean
  phase?: string
  stage?: string
  cases?: { slug: string; title: string; summary: string; confirmed: boolean; confirmedAt: string | null }[]
  steps?: { number: number; title: string; status: string; importance: string; cases?: string[] }[]
}

const SURFACES = ["public", "private", "headless"] as const

export function ProductsBoard({ initial, ui }: { initial: ProductRow[]; ui: DevModeUi }) {
  const t = ui.products
  const [items, setItems] = useState<ProductRow[]>(initial)
  const [open, setOpen] = useState<string | null>(initial[0]?.id ?? null)
  const [busy, setBusy] = useState(false)

  async function call(body: unknown): Promise<ProductRow | null> {
    const res = await fetch("/api/architect/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; product?: ProductRow }
    if (!res.ok || !data.ok || !data.product) {
      toast.error(ui.failed)
      return null
    }
    return data.product
  }

  async function create() {
    setBusy(true)
    const product = await call({ title: "" })
    if (product) {
      setItems(prev => [...prev, product])
      setOpen(product.id)
      toast.success(t.created)
    }
    setBusy(false)
  }

  async function patch(id: string, part: Record<string, unknown>, note = t.saved) {
    setBusy(true)
    const product = await call({ id, patch: part })
    if (product) {
      setItems(prev => prev.map(p => (p.id === id ? product : p)))
      toast.success(note)
    }
    setBusy(false)
  }

  return (
    <section data-products-board className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <H3 variant="ui">{t.title}</H3>
        <Small className="max-w-3xl">{t.hint}</Small>
      </div>
      <Separator />

      {items.length === 0 ? (
        <div data-products-empty className="flex flex-col gap-1 rounded-lg border border-dashed border-border px-4 py-6">
          <P className="text-[length:var(--fs-body)]">{t.empty}</P>
          <Small className="max-w-2xl">{t.emptyHint}</Small>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map(p => {
            const isOpen = open === p.id
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
                    <Small className="block truncate font-mono">{p.id}</Small>
                  </span>
                  <span data-product-phase={p.phase ?? "intake"} className="shrink-0 rounded-full border border-border px-3 py-1 text-[length:var(--fs-small)] text-muted-foreground">
                    {t.phases[p.phase ?? "intake"] ?? p.phase}
                  </span>
                  <span data-product-stage={p.stage ?? "waiting"} className="hidden shrink-0 text-[length:var(--fs-small)] text-muted-foreground sm:inline">
                    {t.stages[p.stage ?? "waiting"] ?? p.stage}
                  </span>
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-6 border-t border-border px-5 py-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex flex-col gap-1">
                        <Small className="font-medium text-foreground">{t.nameLabel}</Small>
                        <Input
                          defaultValue={p.title ?? ""}
                          placeholder={t.namePlaceholder}
                          onBlur={e => e.target.value !== (p.title ?? "") && patch(p.id, { title: e.target.value })}
                          className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <Small className="font-medium text-foreground">{t.route}</Small>
                        <Input
                          defaultValue={p.route ?? ""}
                          dir="ltr"
                          placeholder="/shop"
                          onBlur={e => e.target.value !== (p.route ?? "") && patch(p.id, { route: e.target.value })}
                          className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                        />
                        <Small>{t.routeHint}</Small>
                      </label>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Small className="font-medium text-foreground">{t.surface}</Small>
                      <div className="flex flex-wrap gap-2">
                        {SURFACES.map(s => (
                          <Button
                            key={s}
                            type="button"
                            variant={(p.surface ?? "public") === s ? "default" : "outline"}
                            size="sm"
                            data-product-surface={s}
                            disabled={busy}
                            onClick={() => patch(p.id, { surface: s })}
                          >
                            {t.surfaces[s] ?? s}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4 rounded-lg border border-border px-4 py-3">
                      <div className="min-w-0">
                        <span className="block text-[length:var(--fs-body)] text-foreground">{t.published}</span>
                        <Small className="mt-0.5 block">{t.publishedHint}</Small>
                      </div>
                      <Switch
                        checked={Boolean(p.published)}
                        disabled={busy}
                        aria-label={t.published}
                        onCheckedChange={next => patch(p.id, { published: next })}
                      />
                    </div>

                    <CasesEditor product={p} ui={ui} busy={busy} onPatch={patch} />
                    <StepsList product={p} ui={ui} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <div>
        <Button type="button" onClick={create} disabled={busy} data-product-create className="h-10 px-5">
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          {busy ? t.creating : t.create}
        </Button>
      </div>
    </section>
  )
}

// 🔒 КЕЙС ПОДТВЕРЖДАЕТ ТОЛЬКО ВЛАДЕЛЕЦ, И ЭТО НЕ ФОРМАЛЬНОСТЬ. Неподтверждённый
// кейс — догадка модели; строить по ней запрещено законом режима. Поэтому
// подтверждение — отдельное действие с датой, а не галочка заодно с правкой текста.
//
// 🔒 ПОДТВЕРЖДЕНИЕ СНИМАЕТСЯ, И ДАТА ОБНУЛЯЕТСЯ ВМЕСТЕ С НИМ. Владелец вправе
// передумать; оставшаяся дата говорила бы о решении, которого больше нет.
function CasesEditor({
  product,
  ui,
  busy,
  onPatch,
}: {
  product: ProductRow
  ui: DevModeUi
  busy: boolean
  onPatch: (id: string, part: Record<string, unknown>, note?: string) => void
}) {
  const t = ui.products
  const cases = product.cases ?? []
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")

  function add() {
    const clean = title.trim()
    if (!clean) return
    const slug = `c${Date.now()}`
    onPatch(product.id, {
      cases: [
        ...cases,
        { slug, title: clean, summary: summary.trim(), confirmed: false, confirmedAt: null, updatedAt: new Date().toISOString() },
      ],
    })
    setTitle("")
    setSummary("")
  }

  function toggle(slug: string, confirmed: boolean) {
    onPatch(product.id, {
      cases: cases.map(c =>
        c.slug === slug
          ? { ...c, confirmed, confirmedAt: confirmed ? new Date().toISOString() : null, updatedAt: new Date().toISOString() }
          : c,
      ),
    })
  }

  return (
    <section data-cases-editor className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <H3 variant="ui">{t.cases}</H3>
        <Small className="max-w-3xl">{t.casesHint}</Small>
      </div>

      {cases.length > 0 && (
        <ul className="flex flex-col gap-2">
          {cases.map(c => (
            <li
              key={c.slug}
              data-case={c.slug}
              data-case-confirmed={c.confirmed ? "true" : "false"}
              className={
                "flex items-start justify-between gap-4 rounded-lg border px-4 py-3 " +
                (c.confirmed ? "border-primary/50 bg-primary/5" : "border-border")
              }
            >
              <div className="min-w-0">
                <span className="flex items-center gap-2 text-[length:var(--fs-body)] text-foreground">
                  {c.title}
                  {c.confirmed && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                </span>
                {c.summary && <Small className="mt-0.5 block">{c.summary}</Small>}
                {!c.confirmed && <Small className="mt-0.5 block text-amber-700 dark:text-amber-400">{t.unconfirmedNotice}</Small>}
              </div>
              <Button
                type="button"
                variant={c.confirmed ? "outline" : "default"}
                size="sm"
                disabled={busy}
                data-case-toggle={c.slug}
                onClick={() => toggle(c.slug, !c.confirmed)}
                className="shrink-0"
              >
                {c.confirmed ? t.unconfirm : t.confirm}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border px-4 py-3">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={t.caseTitle}
          className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
        />
        <Textarea
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder={t.caseSummary}
          rows={2}
          className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
        />
        <div>
          <Button type="button" size="sm" disabled={busy || !title.trim()} data-case-add onClick={add}>
            <Plus className="size-4" aria-hidden />
            {t.caseAdd}
          </Button>
        </div>
      </div>
    </section>
  )
}

// 🔒 ШАГИ ТОЛЬКО ПОКАЗЫВАЮТСЯ. Они рождаются из подтверждённых кейсов работой
// агента, а не заводятся руками в настройках: заведённый здесь шаг не знал бы, из
// какого кейса он вырос, — а именно это и есть смысл режима.
function StepsList({ product, ui }: { product: ProductRow; ui: DevModeUi }) {
  const t = ui.products
  const steps = product.steps ?? []
  return (
    <section data-steps-list className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <H3 variant="ui">{t.steps}</H3>
        <Small className="max-w-3xl">{t.stepsHint}</Small>
      </div>
      {steps.length === 0 ? (
        <Small>{t.stepsEmpty}</Small>
      ) : (
        <ul className="flex flex-col gap-2">
          {steps.map(s => (
            <li
              key={s.number}
              data-step={s.number}
              data-step-status={s.status}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-2"
            >
              <span className="w-10 shrink-0 font-mono text-[length:var(--fs-small)] text-muted-foreground">{s.number}</span>
              <span className="min-w-0 flex-1 truncate text-[length:var(--fs-body)] text-foreground">{s.title}</span>
              <span className="shrink-0 text-[length:var(--fs-small)] text-muted-foreground">
                {t.statuses[s.status] ?? s.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
