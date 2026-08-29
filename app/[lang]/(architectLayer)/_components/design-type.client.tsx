"use client"

import { useState } from "react"
import { DesignWorkbench, DesignPreview } from "./design-workbench"
import type { DesignUi } from "../_i18n/design.i18n"

// ШКАЛА ТЕКСТА (39-3, 2026-08-29). Два числа на весь набор.
//
// 🔒 ОДНО ЧИСЛО, А НЕ ТРИДЦАТЬ РАЗМЕРОВ. Все кегли проекта выведены из `--type-scale`
// множителем, поэтому пропорции сохраняются сами: заголовок остаётся во столько же
// раз крупнее текста, во сколько был. Дай человеку править кегли поимённо — и
// первая же правка разъедет шкалу, а вернуть её будет нечем.
//
// 🔒 ОБРАЗЕЦ ЖИВЁТ ПРЯМО ЗДЕСЬ И МЕНЯЕТСЯ ДО СОХРАНЕНИЯ. Число само по себе ничего
// не говорит: «1,15» — это крупнее или мельче того, что уже на экране? Ответ виден
// только рядом, на настоящем тексте.
//
// 🔒 ГОТОВЫЕ ЗНАЧЕНИЯ — НЕ ЗАМЕНА ПОЛЮ, А ВХОД В НЕГО. Человек, не знающий, с чего
// начать, нажимает «Как в проекте»; знающий вводит своё. Убери поле — и точная
// настройка станет невозможной; убери кнопки — и первый шаг придётся угадывать.

const SCALE_PRESETS: Record<string, number> = { compact: 0.9, normal: 1, relaxed: 1.15 }
const LEADING_PRESETS: Record<string, number> = { compact: 1.4, normal: 1.6, relaxed: 1.8 }

type State = { scale?: number; leading?: number }

export function DesignType({ initial, ui }: { initial: State; ui: DesignUi["type"] }) {
  const [state, setState] = useState<State>(initial)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed" | "same">("idle")

  const changed = JSON.stringify(state) !== JSON.stringify(initial)
  const scale = state.scale ?? 1
  const leading = state.leading ?? 1.6

  function set(key: keyof State, value: number | undefined) {
    setStatus("idle")
    setState(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    if (!changed) { setStatus("same"); return }
    setStatus("saving")
    try {
      // 🔒 НЕВЫБРАННОЕ УХОДИТ КАК `null`, А НЕ ПРОПУСКАЕТСЯ. Пропуск означал бы
      // «не трогай», и сброшенное значение осталось бы в файле навсегда; `null`
      // стирает ключ и возвращает шкалу проекта.
      const patch = {
        type: {
          scale: state.scale ?? null,
          leading: state.leading ?? null,
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

      <section data-design-field="scale" className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.scaleLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.scaleHint}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          {Object.entries(SCALE_PRESETS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("scale", value)}
              aria-pressed={scale === value}
              className={
                "w-full rounded-md border px-3 py-2 text-left text-[length:var(--fs-small)] transition-colors " +
                (scale === value ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50")
              }
            >
              {ui.presets[key as keyof typeof ui.presets]}
            </button>
          ))}
          <input
            type="number"
            step="0.05"
            min="0.7"
            max="1.6"
            value={scale}
            onChange={e => set("scale", Number(e.target.value))}
            className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-[length:var(--fs-small)]"
          />
        </div>
      </section>

      <section data-design-field="leading" className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.leadingLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.leadingHint}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          {Object.entries(LEADING_PRESETS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("leading", value)}
              aria-pressed={leading === value}
              className={
                "w-full rounded-md border px-3 py-2 text-left text-[length:var(--fs-small)] transition-colors " +
                (leading === value ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50")
              }
            >
              {ui.presets[key as keyof typeof ui.presets]}
            </button>
          ))}
          <input
            type="number"
            step="0.05"
            min="1.1"
            max="2.2"
            value={leading}
            onChange={e => set("leading", Number(e.target.value))}
            className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-[length:var(--fs-small)]"
          />
        </div>
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

  // 🔒 ПРЕДПРОСМОТР СПРАВА И ЛИПНЕТ. Шкалу крутят числом, а решение принимают
  // глазами: пока человек ищет нужное значение, ответ обязан оставаться в поле
  // зрения. Внутри левой колонки он уезжал вверх ровно в момент выбора.
  const preview = (
    <DesignPreview label={ui.preview}>
      <div data-design-preview="type">
        <p
          className="font-serif font-bold tracking-tight text-foreground"
          style={{ fontSize: `calc(1.875rem * ${scale})`, lineHeight: 1.15 }}
        >
          {ui.previewH1}
        </p>
        <p
          className="mt-2 text-muted-foreground"
          style={{ fontSize: `calc(1rem * ${scale})`, lineHeight: leading }}
        >
          {ui.previewBody}
        </p>
      </div>
    </DesignPreview>
  )

  return <DesignWorkbench controls={controls} preview={preview} />
}
