"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// ДОБАВИТЬ И УБРАТЬ БОТА (99-4, 2026-09-03).
//
// 🔒 ЗАКАЗ ВЛАДЕЛЬЦА ДОСЛОВНО: «на вкладке Telegram у нас может быть что-то
// вроде аккордеона по одному для каждого пользователя, а также кнопка добавить
// нового». Строка аккордеона — БОТ: собеседники добавляют себя сами, просто
// написав ему; руками добавляют именно бота.
//
// 🔒 ОСТРОВОК МИНИМАЛЬНЫЙ: сам аккордеон рисует `<details>` браузера, без
// единой строки JS. Здесь только две кнопки, которым нужен запрос к серверу.

export type AddBotLabels = {
  add: string
  adding: string
  added: string
  remove: string
  removing: string
  removed: string
  confirmRemove: string
  failed: string
}

export function TelegramAddBot({ labels }: { labels: AddBotLabels }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function add() {
    setBusy(true)
    try {
      // 🔒 `bot=new` — ЯВНОЕ СЛОВО, А НЕ ОПЕЧАТКА В АДРЕСЕ. Служба заводит нового
      // только по нему; иначе неверный идентификатор молча создавал бы лишнего
      // бота вместо правки существующего.
      const r = await fetch("/api/architect/channels/telegram?bot=new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        toast.error(String(d.error ?? labels.failed))
        return
      }
      toast.success(labels.added)
      router.refresh()
    } catch (e) {
      toast.error(String((e as Error).message ?? e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button data-telegram-add-bot variant="outline" size="sm" onClick={add} disabled={busy}>
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
      {busy ? labels.adding : labels.add}
    </Button>
  )
}

export function TelegramRemoveBot({
  botId,
  labels,
}: {
  botId: string
  labels: AddBotLabels
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [armed, setArmed] = useState(false)

  async function remove() {
    // 🔒 ПОДТВЕРЖДЕНИЕ ВТОРЫМ НАЖАТИЕМ, А НЕ ОКНОМ БРАУЗЕРА. `confirm()`
    // блокирует страницу целиком, а в проекте есть свой диалог; но ради одной
    // кнопки поднимать его — лишняя тяжесть. Две ступени решают то же.
    if (!armed) {
      setArmed(true)
      setTimeout(() => setArmed(false), 4000)
      return
    }
    setBusy(true)
    try {
      const r = await fetch(
        `/api/architect/channels/telegram/remove?bot=${encodeURIComponent(botId)}`,
        { method: "POST" },
      )
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        toast.error(String(d.error ?? labels.failed))
        return
      }
      toast.success(labels.removed)
      router.refresh()
    } catch (e) {
      toast.error(String((e as Error).message ?? e))
    } finally {
      setBusy(false)
      setArmed(false)
    }
  }

  return (
    <Button
      data-telegram-remove-bot={botId}
      variant="ghost"
      size="sm"
      onClick={remove}
      disabled={busy}
      className={armed ? "text-destructive" : "text-muted-foreground"}
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      {busy ? labels.removing : armed ? labels.confirmRemove : labels.remove}
    </Button>
  )
}
