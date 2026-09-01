"use client"

import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Small } from "@/components/ui/typography"
import { VoiceControl } from "@/components/form/voice-control.client"
import type { DraftFailure } from "../types/fact-draft"

// ОПИСАНИЕ СЛОВАМИ → ЧЕРНОВИК ЗАПИСИ (81-5).
//
// 🔒 ПОЛЕ С МИКРОФОНОМ, А НЕ «ГОЛОСОВОЕ ПОЛЕ», И ЭТО НЕ УСТУПКА. Микрофон
// браузер отдаёт только в защищённом контексте: на `http://<IP>` его нет по
// устройству, и владелец об этом предупреждён заранее. Свободный текст плюс
// микрофон рядом — то, как устроены все одиннадцать голосовых полей проекта:
// на домене заработает голосом без единой правки.
//
// 🔒 ЧЕРНОВИК ПОКАЗЫВАЕТСЯ, А НЕ ПРИМЕНЯЕТСЯ. Инструмент отдаёт разобранное
// наружу, и что с ним делать — решает потребитель: здесь он кладёт значения в
// поля формы, а сохраняет человек. Модель ошибается тихо, и единственная защита
// от этого — глаза владельца между предложением и записью.

export type FactDraftLabels = {
  title: string
  hint: string
  placeholder: string
  submit: string
  submitting: string
  /** Причины отказа по кодам инструмента. */
  failures: Record<DraftFailure, string>
  /** Приставка к пояснению модели: что она предположила. */
  notesPrefix: string
}

export function FactDraft({
  lang,
  labels,
  onDraft,
}: {
  lang: string
  labels: FactDraftLabels
  /** Разобранное уезжает наружу. Инструмент сам ничего не сохраняет. */
  onDraft: (draft: Record<string, string>, notes: string) => void
}) {
  const [words, setWords] = useState("")
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState<DraftFailure | "">("")

  async function ask() {
    setBusy(true)
    setFailure("")
    try {
      const r = await fetch("/api/architect/fact-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words, lang }),
      })
      const d = (await r.json()) as
        | { ok: true; draft: Record<string, string>; notes: string }
        | { ok: false; reason: DraftFailure }
      if (!d.ok) {
        setFailure(d.reason)
        return
      }
      onDraft(d.draft, d.notes)
      setWords("")
    } catch {
      setFailure("model-silent")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div data-fact-draft className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-muted-foreground" />
        <Small className="font-medium text-foreground">{labels.title}</Small>
      </div>

      <Small className="leading-relaxed text-muted-foreground">{labels.hint}</Small>

      <VoiceControl
        id="fact-draft-words"
        variant="textarea"
        rows={3}
        value={words}
        onChange={setWords}
        lang={lang}
        placeholder={labels.placeholder}
        disabled={busy}
      />

      {failure && (
        <Small data-fact-draft-failure={failure} className="text-warning">
          {labels.failures[failure]}
        </Small>
      )}

      <div>
        <Button size="sm" variant="outline" onClick={() => void ask()} disabled={busy || !words.trim()}>
          {busy && <Loader2 className="size-3.5 animate-spin" />}
          {busy ? labels.submitting : labels.submit}
        </Button>
      </div>
    </div>
  )
}
