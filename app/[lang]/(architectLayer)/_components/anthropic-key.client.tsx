"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Small } from "@/components/ui/typography"

// ВВОД И ПРОВЕРКА КЛЮЧА ANTHROPIC (113-2, 2026-09-04).
//
// 🔒 ОСТРОВОК НЕИЗБЕЖЕН ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО У КЛЮЧА OPENAI И ТОКЕНА БОТА:
// сюда вводят СЕКРЕТ, и форма без JS отправила бы его перезагрузкой, оставив в
// истории навигации.
//
// 🔒 ПРОВЕРКА НЕ ШЛЁТ КЛЮЧ. Она просит сервер проверить ТОТ ключ, что уже лежит
// у него, — иначе кнопка стала бы способом гонять чужие ключи через наш сервер.
//
// 🔒 ДВА ВОПРОСА, А НЕ ОДИН. «Ключ верный» — это `/v1/models`; «деньги есть» —
// настоящий вызов на один токен, потому что список моделей отвечает `200` и на
// пустом счёте. ✗ У ключа OpenAI показ одного вместо двух уже стоил дня отладки:
// плашка зеленела, бот молчал.

type CheckResult = { valid: boolean; funded: boolean | null; reason: string | null }

export function AnthropicKeyForm({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [key, setKey] = useState("")
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)

  async function save() {
    const value = key.trim()
    if (!value) return
    // 🔒 ФОРМА ПРОВЕРЯЕТСЯ И ЗДЕСЬ, И НА СЕРВЕРЕ. Здесь — чтобы человек узнал об
    // опечатке мгновенно; там — потому что проверку в браузере отключают в браузере.
    if (!value.startsWith("sk-ant-")) {
      toast.error("Ключ Anthropic начинается с sk-ant-")
      return
    }
    setSaving(true)
    try {
      const r = await fetch("/api/architect/anthropic-key", {
        body: JSON.stringify({ key: value }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!r.ok || !d.ok) {
        toast.error(d.error === "bad-key-format" ? "Ключ не похож на ключ Anthropic" : "Не сохранено")
        return
      }
      setKey("")
      setResult(null)
      toast.success("Ключ сохранён и действует со следующего вопроса")
      router.refresh()
    } catch {
      toast.error("Не сохранено")
    } finally {
      setSaving(false)
    }
  }

  async function check() {
    setChecking(true)
    setResult(null)
    try {
      const r = await fetch("/api/architect/anthropic-key?check=1", {
        credentials: "include",
        method: "POST",
      })
      if (r.status === 409) {
        toast.error("Сначала сохраните ключ")
        return
      }
      setResult((await r.json()) as CheckResult)
    } catch {
      toast.error("Проверка не удалась")
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <Small className="text-muted-foreground">
          {configured ? "Заменить ключ" : "Ключ Anthropic"}
        </Small>
        <Input
          autoComplete="off"
          data-anthropic-input
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-api03-…"
          spellCheck={false}
          type="password"
          value={key}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-9" disabled={saving || !key.trim()} onClick={save} type="button">
          {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {saving ? "Сохраняю…" : "Сохранить"}
        </Button>
        <Button
          className="h-9"
          disabled={checking || !configured}
          onClick={check}
          type="button"
          variant="outline"
        >
          {checking && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {checking ? "Проверяю…" : "Проверить"}
        </Button>
      </div>

      {result && (
        <div className="flex flex-col gap-1.5" data-anthropic-check>
          {result.valid ? (
            <Small className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-3.5" /> Ключ принят Anthropic
            </Small>
          ) : (
            <Small className="flex items-center gap-1.5 text-destructive">
              <XCircle className="size-3.5" /> Ключ отвергнут
            </Small>
          )}
          {/* 🔒 ТРИ ИСХОДА, А НЕ ДВА: «оплачен» · «денег нет» · «не узнали».
              Третий — честное состояние, а не отказ, и молчать о нём нельзя:
              пустое место человек читает как «всё хорошо». */}
          {result.valid && result.funded === true && (
            <Small className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-3.5" /> Настоящий вызов прошёл — счёт оплачен
            </Small>
          )}
          {result.valid && result.funded === false && (
            <Small className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-3.5" /> Ключ живой, но вызов не оплачен
            </Small>
          )}
          {result.valid && result.funded === null && (
            <Small className="text-muted-foreground">
              Оплату проверить не удалось — это не отказ ключа.
            </Small>
          )}
          {result.reason && (
            <Small className="text-muted-foreground">Ответ Anthropic: {result.reason}</Small>
          )}
        </div>
      )}
    </div>
  )
}
