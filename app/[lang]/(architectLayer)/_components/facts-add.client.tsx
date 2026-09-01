"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Small } from "@/components/ui/typography"
import { FACT_ON_MISSING, FACT_VALUE_TYPES, type FactOnMissing, type FactValueType } from "@/lib/facts/types"

// ФОРМА ДОБАВЛЕНИЯ ПРИЗНАКА (81-4).
//
// 🔒 ПЯТЬ ЧАСТЕЙ ЗАПРАШИВАЮТСЯ ЦЕЛИКОМ, И НИ ОДНА НЕ ПРЯЧЕТСЯ ЗА «ДОПОЛНИТЕЛЬНО».
// Признак без инструкции узнавания — колонка, которую никто не заполняет; признак
// без поведения при неудаче молча теряет половину случаев. Спрятав их под
// раскрывающийся блок, мы получили бы форму, которую заполняют наполовину.
//
// 🔒 ЭТО ФОРМА РУКАМИ, А НЕ ГОЛОСОМ. Свободное описание с расшифровкой моделью —
// 81-5; здесь человек заполняет поля сам. Порядок намеренный: сперва должно
// существовать то, во что модель будет складывать разобранное.
//
// 🔒 ОТКАЗ ДВЕРИ ПОКАЗЫВАЕТСЯ ПРИЧИНОЙ, А НЕ СЛОВОМ «ОШИБКА». Дверь отвечает
// названными кодами (`bad-key`, `no-how-to-find`, `builtin-exists`), и каждый
// значит своё действие человека. «Не удалось» вместо причины отправляет его
// гадать.

type Labels = {
  addTitle: string
  keyLabel: string
  keyHint: string
  titleLabel: string
  descriptionLabel: string
  valueTypeLabel: string
  howToFindLabel: string
  howToFindHint: string
  onMissingLabel: string
  onMissing: Record<FactOnMissing, string>
  valueTypes: Record<FactValueType, string>
  submit: string
  submitting: string
  saved: string
  errors: Record<string, string>
  errorOther: string
}

export function FactsAdd({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")

  async function submit(form: FormData) {
    setBusy(true)
    setError("")
    setSaved("")
    try {
      const r = await fetch("/api/architect/facts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: String(form.get("key") ?? ""),
          level: "field",
          title: String(form.get("title") ?? ""),
          description: String(form.get("description") ?? ""),
          valueType: String(form.get("valueType") ?? "text"),
          howToFind: String(form.get("howToFind") ?? ""),
          onMissing: String(form.get("onMissing") ?? "silent"),
        }),
      })
      const d = (await r.json()) as { ok?: boolean; error?: string; table?: string }
      if (!d.ok) {
        setError(labels.errors[d.error ?? ""] ?? labels.errorOther)
        return
      }
      // 🔒 НАЗЫВАЕМ ТАБЛИЦУ, А НЕ ПРОСТО «СОХРАНЕНО». Человек только что завёл
      // хранилище — и должен видеть, что оно появилось: это и есть доказательство
      // того, что признак заработал без пересборки.
      setSaved(labels.saved.replace("{table}", d.table ?? ""))
      setOpen(false)
    } catch {
      setError(labels.errorOther)
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} data-facts-add-open>
          <Plus className="size-3.5" />
          {labels.addTitle}
        </Button>
        {saved && (
          <Small data-facts-saved className="text-muted-foreground">
            {saved}
          </Small>
        )}
      </div>
    )
  }

  return (
    <form
      action={submit}
      data-facts-add-form
      className="flex flex-col gap-3 rounded-lg border border-border p-3"
    >
      <Field label={labels.keyLabel} hint={labels.keyHint}>
        <Input name="key" required placeholder="weather" autoComplete="off" />
      </Field>

      <Field label={labels.titleLabel}>
        <Input name="title" required autoComplete="off" />
      </Field>

      <Field label={labels.descriptionLabel}>
        <Textarea name="description" rows={2} />
      </Field>

      <Field label={labels.valueTypeLabel}>
        <select
          name="valueType"
          defaultValue="text"
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-[length:var(--fs-small)]"
        >
          {FACT_VALUE_TYPES.map(t => (
            <option key={t} value={t}>
              {labels.valueTypes[t]}
            </option>
          ))}
        </select>
      </Field>

      <Field label={labels.howToFindLabel} hint={labels.howToFindHint}>
        <Textarea name="howToFind" rows={2} required />
      </Field>

      <Field label={labels.onMissingLabel}>
        <select
          name="onMissing"
          defaultValue="silent"
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-[length:var(--fs-small)]"
        >
          {FACT_ON_MISSING.map(t => (
            <option key={t} value={t}>
              {labels.onMissing[t]}
            </option>
          ))}
        </select>
      </Field>

      {error && (
        <Small data-facts-error className="text-warning">
          {error}
        </Small>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={busy}>
          {busy && <Loader2 className="size-3.5 animate-spin" />}
          {busy ? labels.submitting : labels.submit}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <Small className="font-medium text-foreground">{label}</Small>
      {children}
      {hint && <Small className="text-muted-foreground">{hint}</Small>}
    </label>
  )
}
