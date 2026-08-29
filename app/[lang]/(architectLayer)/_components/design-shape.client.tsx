"use client"

import { useState } from "react"
import { DesignWorkbench, DesignPreview } from "./design-workbench"
import type { DesignUi } from "../_i18n/design.i18n"

// ФОРМЫ И ВОЗДУХ (39-3, 2026-08-29).
//
// 🔒 ЧЕТЫРЕ ЗНАЧЕНИЯ, И КАЖДОЕ ДЕЙСТВУЕТ СРАЗУ НА ВСЕ ПОВЕРХНОСТИ. Скругление
// правится один раз — карточки, панели, кнопки и поля ввода выводят из него свой
// радиус. Дай править каждому элементу отдельно, и интерфейс перестанет быть одним
// интерфейсом: это ровно тот случай, когда свобода настройки покупается потерей
// цельности.
//
// 🔒 ТОЛЩИНА РАМКИ СТОИТ РЯДОМ СО СКРУГЛЕНИЕМ НЕ ПО ТЕХНИКЕ, А ПО СМЫСЛУ: рамка в
// два пикселя меняет характер интерфейса сильнее, чем цвет, — и человек, пришедший
// «сделать помягче», должен видеть оба рычага сразу.
//
// 🔒 ЗНАЧЕНИЯ — СТРОКИ CSS, А НЕ ЧИСЛА. `0.625rem`, `1px`, `80rem`: единица здесь
// часть решения, и отнять её значит запретить половину допустимых форм.

const RADIUS: Record<string, string> = { square: "0rem", soft: "0.375rem", round: "0.625rem", pill: "1.25rem" }
const SPACE: Record<string, number> = { dense: 0.85, normal: 1, airy: 1.2 }

type State = { radius?: string; borderWidth?: string; spaceScale?: number; appWidth?: string }

export function DesignShape({ initial, ui }: { initial: State; ui: DesignUi["shape"] }) {
  const [state, setState] = useState<State>(initial)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed" | "same">("idle")

  const changed = JSON.stringify(state) !== JSON.stringify(initial)
  const radius = state.radius ?? "0.625rem"
  const border = state.borderWidth ?? "1px"
  const space = state.spaceScale ?? 1
  const width = state.appWidth ?? "80rem"

  function set<K extends keyof State>(key: K, value: State[K]) {
    setStatus("idle")
    setState(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    if (!changed) { setStatus("same"); return }
    setStatus("saving")
    try {
      const patch = {
        shape: {
          radius: state.radius ?? null,
          borderWidth: state.borderWidth ?? null,
          spaceScale: state.spaceScale ?? null,
          appWidth: state.appWidth ?? null,
        },
      }
      const res = await fetch("/api/architect/design-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patch }),
      })
      setStatus(res.ok ? "saved" : "failed")
    } catch {
      setStatus("failed")
    }
  }

  const controls = (
    <div className="flex flex-col gap-5">
      <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.intro}</p>

      <section data-design-field="radius" className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.radiusLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.radiusHint}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          {Object.entries(RADIUS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("radius", value)}
              aria-pressed={radius === value}
              style={{ borderRadius: value }}
              className={
                "w-full border px-3 py-2 text-left text-[length:var(--fs-small)] transition-colors " +
                (radius === value ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50")
              }
            >
              {ui.radiusPresets[key as keyof typeof ui.radiusPresets]}
            </button>
          ))}
        </div>
      </section>

      <section data-design-field="borderWidth" className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.borderLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.borderHint}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {["1px", "2px", "3px"].map(value => (
            <button
              key={value}
              type="button"
              onClick={() => set("borderWidth", value)}
              aria-pressed={border === value}
              style={{ borderWidth: value }}
              className={
                "rounded-md border px-3 py-1.5 text-[length:var(--fs-small)] transition-colors " +
                (border === value ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50")
              }
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      <section data-design-field="spaceScale" className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.spaceLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.spaceHint}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          {Object.entries(SPACE).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("spaceScale", value)}
              aria-pressed={space === value}
              className={
                "w-full rounded-md border px-3 py-2 text-left text-[length:var(--fs-small)] transition-colors " +
                (space === value ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50")
              }
            >
              {ui.spacePresets[key as keyof typeof ui.spacePresets]}
            </button>
          ))}
        </div>
      </section>

      <section data-design-field="appWidth" className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.widthLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.widthHint}</p>
        <input
          type="text"
          value={width}
          onChange={e => set("appWidth", e.target.value)}
          className="mt-3 w-40 rounded-md border border-border bg-background px-2 py-1.5 text-[length:var(--fs-small)]"
        />
      </section>


      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-primary px-4 py-2 text-[length:var(--fs-body)] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "saving" ? ui.saving : ui.save}
        </button>
        <span data-save-status={status} className="text-[length:var(--fs-small)] text-muted-foreground">
          {status === "saved" && ui.saved}
          {status === "failed" && ui.failed}
          {status === "same" && ui.nothingToSave}
        </span>
      </div>
    </div>
  )

  // 🔒 ПРЕДПРОСМОТР СПРАВА И ЛИПНЕТ — та же причина, что у шкалы: четыре рычага
  // формы влияют друг на друга, и увидеть их вместе можно только рядом.
  const preview = (
    <DesignPreview label={ui.preview}>
      <div
        data-design-preview="shape"
        className="border border-border bg-muted/40"
        style={{ borderRadius: radius, borderWidth: border, padding: `calc(1rem * ${space})` }}
      >
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.previewCard}</p>
        <p className="mt-1 text-[length:var(--fs-small)] text-muted-foreground">{ui.previewBody}</p>
      </div>
    </DesignPreview>
  )

  return <DesignWorkbench controls={controls} preview={preview} />
}
