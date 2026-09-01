"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

// НАСТРОЙКА TELEGRAM — ПЕРЕНЕСЕНА ИЗ ПАНЕЛИ (77-4, 2026-09-01).
// Источник: `bridges/app/app/[lang]/channels/_components/telegram-setup.client.tsx`.
//
// 🔒 ОСТРОВОК ЗДЕСЬ НЕИЗБЕЖЕН, И ВСЕ ТРИ ЕГО ДЕЛА ТРЕБУЮТ БРАУЗЕРА ПО-РАЗНОМУ —
// довод переехал вместе с кодом:
//   • токен бота — СЕКРЕТ, и форма без JS отправила бы его перезагрузкой,
//     оставив в истории навигации;
//   • выключатель обязан отвечать сразу, иначе непонятно, сработал ли он;
//   • привязка ЖДЁТ действия человека в другом приложении — страница опрашивает
//     сервер, пока в Telegram не нажмут «Старт».
//
// 🔒 ЧТО ИЗМЕНЕНО ПРОТИВ ИСТОЧНИКА, И ТОЛЬКО ЭТО: адреса дверей
// (`/api/architect/channels/*` вместо панельных) и кегли — вместо `text-[11px]`
// шкала `--fs-*` этого проекта. **Поведение не изменено ни в одном месте.**
//
// 🔒 СЛОВА ПРИХОДЯТ ПРОПСОМ, А НЕ ИМПОРТОМ (76-4): клиентский файл, импортирующий
// словарь слоя значением, увёз бы в браузер все его языки.

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
  scheduleLabel: string
  scheduleHint: string
  scheduleOff: string
  scheduleEvery: string
  scheduleSaved: string
}

export function TelegramSetup({
  configured,
  enabled,
  tickSeconds,
  labels,
}: {
  configured: boolean
  enabled: boolean
  tickSeconds: number
  labels: TelegramSetupLabels
}) {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [saving, setSaving] = useState(false)
  const [linking, setLinking] = useState(false)
  const [deepLink, setDeepLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(tickSeconds)

  // 🔒 ШАГ РАСПИСАНИЯ ВЫБИРАЕТСЯ ИЗ СПИСКА, А НЕ ВВОДИТСЯ ЧИСЛОМ. Свободное поле
  // здесь означает «поставлю единицу и посмотрю»: служба стучит в приложение, и
  // цена ошибки — постоянная нагрузка, которую никто не заметит месяцами. Служба
  // всё равно зажимает значение в 30…3600, но объяснять это отказом формы дороже,
  // чем просто не дать ошибиться.
  const STEPS = [0, 60, 300, 900, 3600]

  async function saveTick(next: number) {
    const before = tick
    setTick(next)
    try {
      const r = await fetch("/api/architect/channels/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickSeconds: next }),
      })
      if (!r.ok) {
        setTick(before)
        setError(labels.failed)
        return
      }
      toast.success(labels.scheduleSaved)
      router.refresh()
    } catch {
      // 🔒 СЛУЖБА НЕ ОТВЕТИЛА — ВОЗВРАЩАЕМ ПРЕЖНЕЕ ЗНАЧЕНИЕ. Показать выбранное
      // как сохранённое значит соврать о состоянии сервера.
      setTick(before)
      setError(labels.failed)
    }
  }

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
        // 🔒 ОТКАЗ ПОКАЗЫВАЕТСЯ СЛОВАМИ СЛУЖБЫ. Она одна знает, чем именно плох
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
              прячет секрет от чужих глаз за плечом, второе не даёт браузеру
              запомнить токен в автозаполнении, откуда его достанет любой, кто
              сядет за эту машину. */}
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

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="text-[length:var(--fs-small)] text-muted-foreground">
          {labels.scheduleLabel}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {STEPS.map(n => (
            <Button
              key={n}
              variant={tick === n ? "default" : "outline"}
              size="sm"
              disabled={!configured}
              onClick={() => saveTick(n)}
            >
              {n === 0 ? labels.scheduleOff : labels.scheduleEvery.replace("{n}", String(n))}
            </Button>
          ))}
        </div>
        <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
          {labels.scheduleHint}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={startLink}
          disabled={!configured || linking}
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

      {error && (
        <p className="text-[length:var(--fs-small)] leading-relaxed break-words text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
