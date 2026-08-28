"use client"

import { useMemo, useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { SLOT_ORDER, LOCKED_SLOTS, type RoutingMode, type SlotName } from "../_lib/routing"
import type { GroupsUi } from "../_i18n/groups.i18n"

// РЕЖИМ СБОРКИ СТРАНИЦЫ И СОСТАВ ОБЛАСТЕЙ (31-12, 2026-08-29).
//
// 🔒 РЕЖИМ — ДВА БОЛЬШИХ КОНТЕЙНЕРА, А НЕ ПЕРЕКЛЮЧАТЕЛЬ. Это выбор устройства
// всех страниц проекта разом, и он заслуживает того же размера, что выбор пути в
// мастере запуска (28-2): у каждого варианта своё имя и своя строка о том, что он
// значит. Переключатель «параллельный: вкл/выкл» назвал бы один из двух режимов
// отсутствием другого — а они равноправны.
//
// 🔒 ОБЛАСТИ ПОКАЗЫВАЮТСЯ ВСЕГДА, НО В ОБЫЧНОМ РЕЖИМЕ НЕДОСТУПНЫ. Спрятать их
// значило бы скрыть, ЧТО именно даёт параллельный режим: человек выбирает между
// двумя словами, не видя разницы. Видимые и погашенные — они и есть объяснение.
//
// 🔒 ШАПКА И ПОДВАЛ ЗАПЕРТЫ, И ЗАМОК ВИДЕН. Без них страница не собирается;
// выключатель, который молча не срабатывает, хуже отсутствующего.
export function RoutingEditor({
  initialMode,
  initialSlots,
  ui,
}: {
  initialMode: RoutingMode
  /** Включённые области на момент открытия страницы. */
  initialSlots: readonly SlotName[]
  ui: GroupsUi
}) {
  const t = ui.routing
  const [mode, setMode] = useState<RoutingMode>(initialMode)
  const [slots, setSlots] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SLOT_ORDER.map(s => [s, initialSlots.includes(s)])),
  )
  const [savedMode, setSavedMode] = useState<RoutingMode>(initialMode)
  const [savedSlots, setSavedSlots] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SLOT_ORDER.map(s => [s, initialSlots.includes(s)])),
  )
  const [busy, setBusy] = useState(false)

  const changed = useMemo(
    () => mode !== savedMode || SLOT_ORDER.some(s => slots[s] !== savedSlots[s]),
    [mode, savedMode, slots, savedSlots],
  )

  async function save() {
    if (!changed) {
      toast.info(ui.nothingToSave)
      return
    }
    setBusy(true)

    // 🔒 ПИШЕТСЯ ТОЛЬКО НОВОЕ ИМЯ РЕЖИМА, А СТАРОЕ СТИРАЕТСЯ (`null` в заплате).
    // Оставить оба значило бы держать на диске два ответа на один вопрос — и
    // однажды они разойдутся, а читатель предпочтёт старое.
    const patch: Record<string, unknown> = {
      routingMode: mode,
      parallelRouting: null,
      slots: Object.fromEntries(SLOT_ORDER.map(s => [s, Boolean(slots[s])])),
    }

    try {
      const res = await fetch("/api/architect/platform-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      toast.success(ui.saved)
      setSavedMode(mode)
      setSavedSlots({ ...slots })
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  const modes: { id: RoutingMode; title: string; hint: string }[] = [
    { id: "standard", title: t.modeStandard, hint: t.modeStandardHint },
    { id: "parallel", title: t.modeParallel, hint: t.modeParallelHint },
  ]

  return (
    <div data-routing-editor className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.title}</H3>
          <Small className="max-w-2xl">{t.hint}</Small>
        </div>
        <Separator />

        <div className="flex flex-col gap-4 md:flex-row">
          {modes.map(m => {
            const chosen = mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                data-routing-mode={m.id}
                data-chosen={chosen ? "true" : "false"}
                aria-pressed={chosen}
                onClick={() => setMode(m.id)}
                className={
                  "flex-1 rounded-2xl border p-6 text-left transition-colors " +
                  (chosen
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/40")
                }
              >
                <span className="block text-[length:var(--fs-h3)] font-semibold text-foreground">{m.title}</span>
                <span className="mt-2 block text-[length:var(--fs-small)] leading-normal text-muted-foreground">
                  {m.hint}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.areasTitle}</H3>
          <Small className="max-w-2xl">{mode === "parallel" ? t.areasHint : t.standardAreasHint}</Small>
        </div>
        <Separator />

        <ul data-slot-list className="flex flex-col gap-3">
          {SLOT_ORDER.map(slot => {
            const locked = LOCKED_SLOTS.includes(slot)
            // В обычном режиме состав областей не выбирают: раскладка задана.
            const disabled = locked || mode !== "parallel"
            return (
              <li
                key={slot}
                data-slot={slot}
                data-on={slots[slot] ? "true" : "false"}
                className={
                  "flex items-start justify-between gap-4 rounded-lg border border-border px-4 py-3 " +
                  (mode === "parallel" ? "" : "opacity-60")
                }
              >
                <div className="min-w-0">
                  <span className="flex items-center gap-2 text-[length:var(--fs-body)] text-foreground">
                    {t.areas[slot] ?? slot}
                    {locked && <Lock className="size-3.5 shrink-0 opacity-60" aria-hidden />}
                  </span>
                  <Small className="mt-0.5 block">
                    {locked ? t.lockedHint : (t.areaHints[slot] ?? "")}
                  </Small>
                </div>
                <Switch
                  checked={locked ? true : Boolean(slots[slot])}
                  disabled={disabled}
                  aria-label={t.areas[slot] ?? slot}
                  onCheckedChange={next => setSlots(prev => ({ ...prev, [slot]: next }))}
                />
              </li>
            )
          })}
        </ul>
      </section>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={busy || !changed} data-save className="h-10 px-5">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? ui.saving : ui.save}
        </Button>
        {!changed && <P className="text-[length:var(--fs-small)] text-muted-foreground">{ui.nothingToSave}</P>}
      </div>
    </div>
  )
}
