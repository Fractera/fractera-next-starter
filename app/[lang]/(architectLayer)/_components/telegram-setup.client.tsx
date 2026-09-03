"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ExternalLink, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Small } from "@/components/ui/typography"

// НАСТРОЙКА TELEGRAM — ПЕРЕНЕСЕНА ИЗ ПАНЕЛИ (77-4), ПЕРЕЛОЖЕНА ПО СЛОВУ
// ВЛАДЕЛЬЦА (77-9, 2026-09-01).
//
// 🔒 ОСТРОВОК ЗДЕСЬ НЕИЗБЕЖЕН, И ДОВОД ПЕРЕЕХАЛ ВМЕСТЕ С КОДОМ: токен — СЕКРЕТ,
// и форма без JS отправила бы его перезагрузкой, оставив в истории навигации;
// выключатель обязан отвечать сразу; привязка ЖДЁТ действия человека в другом
// приложении.
//
// 🪦 РАСПИСАНИЕ ОТСЮДА УШЛО (77-9) в свой островок `telegram-schedule.client.tsx`.
// Здесь оно стояло между токеном и привязкой, и кнопка «Привязать другую учётную
// запись» читалась как часть расписания. ✗ ошибка переноса: порядок источника я
// повторил дословно, не спросив, верен ли он. Владелец: «кнопку привязать другую
// учетную запись поднять в первую секцию».
//
// 🔒 ПОРЯДОК ТЕПЕРЬ СМЫСЛОВОЙ: канал включён → чей это бот (токен) → кому он
// пишет (привязка) → и сразу предупреждение о том, что будет после привязки.

export type TelegramSetupLabels = {
  tokenLabel: string
  tokenPlaceholder: string
  tokenReplace: string
  save: string
  saving: string
  saved: string
  failed: string
  connect: string
  relink: string
  waiting: string
  openTelegram: string
  linked: string
  linkTimeout: string
  linkExpired: string
  linkFailed: string
  channelOn: string
  /** Предупреждение о том, что бот заговорит только после привязки. */
  afterLink: string
}

export function TelegramSetup({
  configured,
  enabled,
  linked,
  labels,
}: {
  configured: boolean
  enabled: boolean
  /** Привязана ли учётная запись Telegram. Решает, зовёт ли кнопка к себе. */
  linked?: boolean
  labels: TelegramSetupLabels
}) {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [saving, setSaving] = useState(false)
  const [linking, setLinking] = useState(false)
  const [deepLink, setDeepLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function saveToken() {
    setSaving(true)
    setError(null)
    try {
      const r = await fetch("/api/architect/channels/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        // 🔒 ОТКАЗ ПОКАЗЫВАЕТСЯ СЛОВАМИ СЛУЖБЫ: она одна знает, чем именно плох
        // токен; «не удалось сохранить» отправило бы человека гадать.
        setError(String(d.error ?? `${r.status}`))
        return
      }
      setToken("")
      toast.success(labels.saved)
      router.refresh()
    } catch (e) {
      setError(String((e as Error).message ?? e))
    } finally {
      setSaving(false)
    }
  }

  async function toggle(on: boolean) {
    try {
      await fetch("/api/architect/channels/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: on }),
      })
    } finally {
      // Правду показывает сервер: если служба отказала, состояние вернётся прежним.
      router.refresh()
    }
  }

  async function startLink() {
    setLinking(true)
    setError(null)
    setDeepLink(null)
    try {
      const r = await fetch("/api/architect/channels/telegram/link", { method: "POST" })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || !d.deepLink) {
        setError(String(d.error ?? labels.linkFailed))
        setLinking(false)
        return
      }
      setDeepLink(d.deepLink)
      window.open(d.deepLink, "_blank", "noopener")

      // 🔒 ОПРОС КАЖДЫЕ 2 СЕКУНДЫ, ПРЕДЕЛ 10 МИНУТ — КАК В ИСТОЧНИКЕ, ДОСЛОВНО.
      // Код в службе живёт ровно столько же; страница, ждущая дольше кода,
      // показывает «жду» тому, кому уже нечего дождаться.
      const deadline = Date.now() + 10 * 60_000
      const poll = async () => {
        if (Date.now() > deadline) {
          setLinking(false)
          setError(labels.linkTimeout)
          return
        }
        const p = await fetch(
          `/api/architect/channels/telegram/link?code=${encodeURIComponent(d.code)}`,
          { cache: "no-store" },
        )
        const s = await p.json().catch(() => ({}))
        if (s.status === "linked") {
          setLinking(false)
          setDeepLink(null)
          toast.success(`${labels.linked} ${s.who ?? s.chatId}`)
          router.refresh()
          return
        }
        if (s.status === "expired") {
          setLinking(false)
          setError(labels.linkExpired)
          return
        }
        setTimeout(poll, 2000)
      }
      setTimeout(poll, 2000)
    } catch (e) {
      setLinking(false)
      setError(String((e as Error).message ?? e))
    }
  }

  return (
    <div data-telegram-setup className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="flex-1 text-[length:var(--fs-small)] text-muted-foreground">
          {labels.channelOn}
        </span>
        {/* 🔒 БЕЗ ТОКЕНА ВЫКЛЮЧАТЕЛЬ ЗАПЕРТ: включать нечего, и служба ответила бы
            отказом, который человек прочитал бы как поломку. */}
        <Switch
          checked={enabled}
          disabled={!configured}
          onCheckedChange={toggle}
          aria-label={labels.channelOn}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[length:var(--fs-small)] text-muted-foreground">
          {labels.tokenLabel}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* 🔒 `type="password"` И `autoComplete="off"` — НЕ ОФОРМЛЕНИЕ. Первое
              прячет секрет от чужих глаз, второе не даёт браузеру запомнить токен
              в автозаполнении, откуда его достанет любой, кто сядет за машину. */}
          <Input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder={configured ? labels.tokenReplace : labels.tokenPlaceholder}
            autoComplete="off"
            className="h-9 min-w-0 flex-1 font-mono"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={saveToken}
            disabled={saving || !token.trim()}
          >
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            {saving ? labels.saving : labels.save}
          </Button>
        </div>
      </div>

      <div data-telegram-link-row className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* 🔒 КНОПКА ЗОВЁТ К СЕБЕ РОВНО ТОГДА, КОГДА НАЖАТЬ ЕЁ НАДО, И НИ
              МИНУТОЙ ДОЛЬШЕ (правка владельца 2026-09-03: «пользователь забывает
              нажать эту кнопку»). Токен сохранён, а привязки нет — единственное
              состояние, в котором человек застревает: бот настроен и молчит,
              потому что не знает, кому отвечать.

              🛑 ПОСЛЕ ПРИВЯЗКИ ПУЛЬСАЦИЯ ОБЯЗАНА ПРОПАСТЬ. Зовущий к себе орган
              управления, который зовёт всегда, к третьему разу не значит ничего —
              тот же закон, что у одного цвета тревоги на шаг. Здесь это ещё и
              ложь: кнопка называется уже «привязать другую», и звать к ней
              человека, у которого всё работает, значит толкать его ломать
              рабочую настройку. */}
          <Button
            variant={configured && !linked ? "default" : "outline"}
            size="sm"
            onClick={startLink}
            disabled={!configured || linking}
            data-telegram-link-call={configured && !linked && !linking ? "on" : "off"}
            className={configured && !linked && !linking ? "animate-pulse" : undefined}
          >
            {linking ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ExternalLink className="size-3.5" />
            )}
            {linking ? labels.waiting : labels.connect}
          </Button>
          {deepLink && (
            <a
              href={deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[length:var(--fs-small)] text-primary underline underline-offset-2"
            >
              {labels.openTelegram}
            </a>
          )}
        </div>

        {/* 🔒 ПРЕДУПРЕЖДЕНИЕ СТОИТ У КНОПКИ, А НЕ В КОНЦЕ ЭКРАНА — прямое слово
            владельца. Оранжевый здесь означает «что произойдёт после нажатия», и
            он на этом экране единственный: красный занят отказом службы, а тон,
            стоящий у каждого абзаца, к третьему разу не значит ничего. */}
        <p
          data-telegram-warning
          className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <Small className="leading-relaxed text-amber-900 dark:text-amber-100">
            {labels.afterLink}
          </Small>
        </p>
      </div>

      {error && (
        <p className="text-[length:var(--fs-small)] leading-relaxed break-words text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
