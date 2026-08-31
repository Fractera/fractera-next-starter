"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { DevMode } from "../_lib/dev-mode"
import type { DevModeUi } from "../_i18n/dev-mode.i18n"

// ПОДТВЕРЖДЕНИЕ ДЕЙСТВУЮЩЕГО РЕЖИМА (шаг 68, 2026-08-31).
//
// 🔒 ЗАЧЕМ ОН ВООБЩЕ ЕСТЬ, ЕСЛИ РЕЖИМ УЖЕ ДЕЙСТВУЕТ. Умолчание — `steps`, поэтому
// режим действует ещё до того, как его выбрали, и по ЗНАЧЕНИЮ «не выбирали»
// неотличимо от «выбрал по умолчанию» (закон `devModeChosen`). Спрашивается факт
// записи: ключ появляется в файле ровно тогда, когда человек нажал кнопку.
//
// ✗ ЧЕМ ОПЛАЧЕНО МЕСТО ЭТОЙ КНОПКИ. Она стояла на карточке действующего режима —
// рядом со словом «сейчас», — и владелец прочитал это как поломку: «ты видишь,
// что это шаг активный, но при этом кнопка продолжает гореть». Он прав: кнопка
// «выбрать» на том, что уже выбрано, обещает действие, которого не видно.
//
// 🔒 ДЕЙСТВИЕ ПРИНАДЛЕЖИТ ТОМУ БЛОКУ, КОТОРЫЙ ОБЪЯСНЯЕТ, ЗАЧЕМ ОНО. Врезка
// говорит «режим ещё не выбирали» — и здесь же даёт это исправить. Убрать кнопку
// совсем было нельзя: тогда врезка осталась бы навсегда, а решение — незаписанным.
//
// 🔒 ОСТРОВОК СВОЙ, А НЕ КУСОК КАРТОЧКИ. Карточка живёт под врезкой и о ней не
// знает; общий островок на два разных места означал бы, что оба обязаны меняться
// вместе.
export function ConfirmMode({ mode, ui }: { mode: DevMode; ui: DevModeUi }) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function confirm() {
    setBusy(true)
    try {
      const res = await fetch("/api/architect/platform-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch: { developmentMode: mode } }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      toast.success(ui.saved)
      // Врезка исчезает сразу: она говорила о состоянии, которого больше нет.
      setDone(true)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  if (done) return null

  return (
    <Button
      type="button"
      variant="outline"
      onClick={confirm}
      disabled={busy}
      data-mode-confirm={mode}
      className="mt-3 h-9 w-fit px-4"
    >
      {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {busy ? ui.saving : ui.confirmCurrent}
    </Button>
  )
}
