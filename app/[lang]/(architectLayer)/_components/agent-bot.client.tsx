"use client"

// ТОКЕН БОТА АГЕНТА — ВВОД ПРЯМО ВО ВКЛАДКЕ (шаг 117, 2026-09-05).
//
// 🔒 ПИШЕТ НЕ ЭТОТ ОСТРОВОК, А ДВЕРЬ ЧАТА. Форма зовёт наш тонкий проводник
// `/api/architect/agent-setup`, тот — дверь `:3600`, и уже она кладёт токен в
// файл, из которого его читает плагин каналов. Один писатель на файл; сюда
// добавлена ПОВЕРХНОСТЬ, а не второе хранилище.
//
// ✗ ЧЕМ ОПЛАЧЕНО. До шага 117 поле на этом экране писало в службу каналов
// `:3500`, а плагин читал другой файл: владелец вводил бота здесь и не понимал,
// почему терминал его не видит. Измерено 2026-09-05.
//
// 🔒 ТОКЕН НЕ ВОЗВРАЩАЕТСЯ НИКОГДА — только признак и маска. Поле после успеха
// очищается: набранный секрет не должен пережить свою отправку в разметке.
//
// 🛑 «СОХРАНЕНО» И «РАБОТАЕТ» — РАЗНЫЕ УТВЕРЖДЕНИЯ, и это сказано словами.
// Плагин читает файл при ЗАПУСКЕ канала; пока канал не перезапущен, записанный
// токен проверен только своей формой.

import { useState } from "react"
import { Bot, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Small } from "@/components/ui/typography"

export type AgentBotLabels = {
  placeholder: string
  save: string
  saving: string
  saved: string
  configured: string
  notConfigured: string
  hint: string
  appliesOnRestart: string
  errBadFormat: string
  errUnreachable: string
  errFailed: string
}

export function AgentBotForm({
  labels,
  masked,
  present,
}: {
  labels: AgentBotLabels
  masked: string | null
  present: boolean
}) {
  const [token, setToken] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shownMask, setShownMask] = useState(masked)
  const [isSet, setIsSet] = useState(present)

  async function save() {
    if (!token.trim() || busy) return
    setBusy(true)
    setError(null)
    setDone(false)
    try {
      const r = await fetch("/api/architect/agent-setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      })
      const j = (await r.json().catch(() => ({}))) as Record<string, unknown>
      if (!r.ok) {
        // 🔒 ПРИЧИНА НАЗЫВАЕТСЯ ПРИЧИНОЙ. Дверь чата уже сказала, что именно не
        // так; общее «не получилось» отняло бы у человека единственную подсказку.
        const code = typeof j.error === "string" ? j.error : ""
        setError(
          code === "bad-format"
            ? labels.errBadFormat
            : code === "chat-unreachable"
              ? labels.errUnreachable
              : labels.errFailed
        )
        return
      }
      const tg = (j.telegram ?? {}) as Record<string, unknown>
      setShownMask(typeof tg.masked === "string" ? tg.masked : null)
      setIsSet(Boolean(tg.present))
      setToken("")
      setDone(true)
    } catch {
      setError(labels.errUnreachable)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2" data-agent-bot={isSet ? "configured" : "empty"}>
      <div className="flex items-center gap-2">
        <Bot className="size-4 shrink-0 text-muted-foreground" />
        {isSet ? (
          <Small className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            {labels.configured}
            {shownMask && <span className="font-mono opacity-70">{shownMask}</span>}
          </Small>
        ) : (
          <Small className="text-muted-foreground">{labels.notConfigured}</Small>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={token}
          placeholder={labels.placeholder}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") save()
          }}
        />
        <Button type="button" size="sm" onClick={save} disabled={busy || !token.trim()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {busy ? labels.saving : labels.save}
        </Button>
      </div>

      {error ? (
        <Small data-agent-bot-error className="text-destructive">
          {error}
        </Small>
      ) : null}
      {done ? <Small className="text-muted-foreground">{labels.saved}</Small> : null}

      <Small className="leading-relaxed text-muted-foreground">{labels.hint}</Small>
      <Small className="leading-relaxed text-muted-foreground">{labels.appliesOnRestart}</Small>
    </div>
  )
}
