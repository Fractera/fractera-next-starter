"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CheckCheck, Loader2, Pencil, Plus, Sparkles, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Small } from "@/components/ui/typography"
import VoiceInput from "@/_tools/voice-input/client/voice-input.client"
import type { CasesUi } from "../_i18n/cases.i18n"

// ДОСКА КЕЙСОВ (34-E, 2026-08-29) — перенос из панели
// (`bridges/app/app/[lang]/products/_components/cases-board.client.tsx`).
//
// 🔒 ОРАНЖЕВЫЙ = НЕ СОГЛАСОВАН, ЗЕЛЁНЫЙ = ПОДТВЕРЖДЁН (владелец 2026-08-10). Кейс,
// рождённый моделью, не считается описанием продукта, пока человек его не
// прочитал: до этого он догадка, и строить по нему значит строить по догадке.
//
// 🔒 ЛЮБАЯ ПРАВКА СБРАСЫВАЕТ ЗЕЛЁНЫЙ — и делает это ХРАНИЛИЩЕ, а не эта разметка.
// Иначе подтверждение означало бы «когда-то смотрел», а не «согласен вот с этим
// текстом». Здесь мы лишь показываем результат: тост так и говорит — «кейс
// сохранён, он снова не подтверждён, перечитайте его».
//
// 🔒 ТРИ ПУТИ ПРАВКИ, И ВСЕ ТРИ ПО ЗАДАНИЮ ВЛАДЕЛЬЦА: замечание словами (модель
// переписывает кейс), голос (то же самое, надиктованное) и прямая правка руками.
// Убрать любой из трёх — не упрощение, а потеря способа, которым человек работает.
//
// ✗ ИМЕННО ЗДЕСЬ БЫЛА МОЯ ОШИБКА 2026-08-29: я построил только третий путь и
// потерял сброс подтверждения. Владелец: «не выдерживает никакой критики».

type CaseRow = {
  slug: string
  title: string
  summary: string
  confirmed: boolean
}

export function CasesBoard({
  productId,
  cases,
  lang,
  ui,
}: {
  productId: string
  cases: CaseRow[]
  lang: string
  ui: CasesUi
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  /**
   * 🔒 ВОЗВРАЩАЕТ ТЕЛО ОТВЕТА, А НЕ «получилось / не получилось». Тот же вызов
   * заводит шаг разбора и сообщает его номер — а номер надо показать человеку.
   * Ответ, выброшенный сразу после проверки, приходится добывать вторым запросом,
   * который однажды вернёт уже другое состояние.
   */
  async function act(op: string, payload: Record<string, unknown> = {}, key = op) {
    setBusy(key)
    try {
      const r = await fetch("/api/architect/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, op, ...payload }),
      })
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; development?: { step: number; created: boolean } }
      if (!r.ok || d.ok === false) throw new Error(String(d?.error ?? ui.failed))
      router.refresh()
      return d
    } catch (e) {
      toast.error(e instanceof Error ? e.message : ui.failed)
      return null
    } finally {
      setBusy(null)
    }
  }

  const pending = cases.filter(c => !c.confirmed).length

  return (
    <section data-cases-board className="flex flex-col gap-3">
      {/* Гейт: право начать работу. Три состояния, а не два — «кейсов нет» и
          «кейсы есть, но не подтверждены» требуют разного действия. */}
      <div
        data-cases-gate={cases.length === 0 ? "missing" : pending > 0 ? "unconfirmed" : "ready"}
        className={
          "rounded-lg border px-4 py-3 text-[length:var(--fs-small)] " +
          (cases.length === 0
            ? "border-border text-muted-foreground"
            : pending > 0
              ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200")
        }
      >
        {cases.length === 0 ? ui.gateMissing : pending > 0 ? ui.gateUnconfirmed : ui.gateReady}
      </div>

      {pending > 0 && (
        <div className="flex">
          <span className="flex-1" />
          <Button
            type="button"
            size="sm"
            data-cases-confirm-all
            disabled={busy !== null}
            onClick={async () => {
              if (await act("confirmAll")) toast.success(ui.confirmedAll)
            }}
          >
            {busy === "confirmAll" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CheckCheck className="size-4" aria-hidden />}
            {ui.confirmAll}
          </Button>
        </div>
      )}

      {cases.map(row => (
        <CaseCard key={row.slug} row={row} productId={productId} lang={lang} ui={ui} act={act} busy={busy} />
      ))}

      <AddCase productId={productId} ui={ui} act={act} busy={busy} />
    </section>
  )
}

function CaseCard({
  row,
  productId,
  lang,
  ui,
  act,
  busy,
}: {
  row: CaseRow
  productId: string
  lang: string
  ui: CasesUi
  act: (op: string, payload?: Record<string, unknown>, key?: string) => Promise<unknown>
  busy: string | null
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(row.title)
  const [summary, setSummary] = useState(row.summary)
  const [remark, setRemark] = useState("")
  const [rewriting, setRewriting] = useState(false)
  const remarkField = useRef<HTMLTextAreaElement | null>(null)

  // 🔒 ЗАМЕЧАНИЕ СЛОВАМИ — ОТДЕЛЬНЫЙ ПУТЬ, А НЕ КНОПКА «УЛУЧШИТЬ». Человек
  // говорит, ЧТО не так («это делает не менеджер, а клиент»), и модель переписывает
  // ОДИН кейс, а не весь набор: правят сценарий, а не начинают заново.
  async function rewrite() {
    if (!remark.trim()) return
    setRewriting(true)
    try {
      const r = await fetch("/api/architect/use-cases/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, mode: "rewrite", lang, title, summary, remark: remark.trim() }),
      })
      const d = (await r.json().catch(() => ({}))) as { error?: string; case?: { title: string; summary: string } }
      if (!r.ok) {
        toast.error(d?.error === "no-key" ? ui.noKey : ui.failed, { duration: 15000 })
        return
      }
      if (!d.case) {
        toast.error(ui.failed)
        return
      }
      setTitle(d.case.title)
      setSummary(d.case.summary)
      setRemark("")
      toast.success(ui.savedCase)
    } finally {
      setRewriting(false)
    }
  }

  return (
    <div
      data-case={row.slug}
      data-case-confirmed={row.confirmed ? "true" : "false"}
      className={
        "rounded-lg border border-s-4 border-border p-4 " +
        (row.confirmed ? "border-s-emerald-500" : "border-s-amber-500")
      }
    >
      <div className="flex flex-wrap items-start gap-2">
        <span
          className={
            "rounded-full px-2 py-0.5 text-[length:var(--fs-small)] " +
            (row.confirmed
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-300")
          }
        >
          {row.confirmed ? ui.confirmed : ui.draft}
        </span>
        <span className="font-mono text-[length:var(--fs-small)] text-muted-foreground">{row.slug}</span>
      </div>

      {editing ? (
        <div className="mt-3 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <Small className="font-medium text-foreground">{ui.titleLabel}</Small>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <Small className="font-medium text-foreground">{ui.summaryLabel}</Small>
            <Textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={5}
              className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            />
          </label>

          <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <Small>{ui.remarkTitle}</Small>
            <Textarea
              ref={remarkField}
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder={ui.remarkPlaceholder}
              rows={2}
              dir="auto"
              className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            />
            <div className="flex items-center gap-2">
              {/* Голос — тот же инструмент проекта, что у полей настроек. */}
              <VoiceInput targetRef={remarkField} value={remark} onChange={setRemark} lang={lang} apiUrl="/api/transcribe" />
              <Button type="button" size="sm" variant="outline" data-case-rewrite onClick={rewrite} disabled={rewriting || !remark.trim()}>
                {rewriting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
                {rewriting ? ui.rewriting : ui.rewrite}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              disabled={busy === row.slug}
              onClick={async () => {
                if (await act("edit", { id: row.slug, title, summary }, row.slug)) {
                  setEditing(false)
                  toast.success(ui.savedCase)
                }
              }}
            >
              {busy === row.slug ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
              {busy === row.slug ? ui.saving : ui.save}
            </Button>
            <button
              type="button"
              onClick={() => {
                setTitle(row.title)
                setSummary(row.summary)
                setEditing(false)
              }}
              className="text-[length:var(--fs-small)] text-muted-foreground underline hover:text-foreground"
            >
              {ui.cancel}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-[length:var(--fs-body)] font-medium text-foreground">{row.title}</p>
          {row.summary && (
            <p className="mt-1 whitespace-pre-wrap text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
              {row.summary}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={row.confirmed ? "outline" : "default"}
              data-case-toggle={row.slug}
              disabled={busy === row.slug}
              onClick={() => act(row.confirmed ? "unconfirm" : "confirm", { id: row.slug }, row.slug)}
            >
              {busy === row.slug ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
              {row.confirmed ? ui.unconfirm : ui.confirm}
            </Button>
            <Button type="button" size="sm" variant="ghost" data-case-edit onClick={() => setEditing(true)}>
              <Pencil className="size-4" aria-hidden />
              {ui.edit}
            </Button>
            <span className="flex-1" />
            {/* 🔒 УДАЛЕНИЕ СПРАШИВАЕТ ПОДТВЕРЖДЕНИЯ. Кейс — работа человека, а не
                строка списка: снести его нажатием мимо было бы слишком дёшево. */}
            <button
              type="button"
              data-case-remove
              title={ui.remove}
              onClick={() => {
                if (window.confirm(ui.removeConfirm)) void act("delete", { id: row.slug }, row.slug)
              }}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// 🔒 РУЧНОЙ КЕЙС — СВОЯ ДВЕРЬ, И ЭТО НЕ ДУБЛЬ. Модель присылает пачку внутри
// Quiz; здесь человек дописывает ОДИН кейс поздно — когда вопросы отвечены и
// разговор закрыт. Разные намерения с разными правилами не имеют права входить
// одной дверью: у модели пачка без проверки полей, у человека пустой заголовок
// надо отвергнуть, а не записать «Без названия».
function AddCase({
  productId,
  ui,
  act,
  busy,
}: {
  productId: string
  ui: CasesUi
  act: (op: string, payload?: Record<string, unknown>, key?: string) => Promise<unknown>
  busy: string | null
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")

  if (!open) {
    return (
      <div>
        <Button type="button" size="sm" variant="outline" data-case-add-open onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden />
          {ui.p_addCase}
        </Button>
      </div>
    )
  }

  return (
    <div data-case-add className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4">
      <div className="flex flex-col gap-1">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.p_addCaseTitle}</p>
        <Small>{ui.p_addCaseHint}</Small>
      </div>
      <Input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder={ui.p_addCaseName}
        className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
      />
      <Textarea
        value={summary}
        onChange={e => setSummary(e.target.value)}
        placeholder={ui.p_addCaseSummary}
        rows={3}
        className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          data-case-add-save
          disabled={busy !== null || !title.trim()}
          onClick={async () => {
            if (await act("add-case", { title: title.trim(), summary: summary.trim() }, "add-case")) {
              toast.success(ui.p_addCaseSaved)
              setTitle("")
              setSummary("")
              setOpen(false)
            }
          }}
        >
          {busy === "add-case" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
          {ui.p_addCaseSave}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[length:var(--fs-small)] text-muted-foreground underline hover:text-foreground"
        >
          {ui.p_addCaseCancel}
        </button>
      </div>
    </div>
  )
}
