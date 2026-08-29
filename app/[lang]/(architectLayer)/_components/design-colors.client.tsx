"use client"

import { useState } from "react"
import { ColorField } from "./color-field.client"
import type { DesignUi } from "../_i18n/design.i18n"

// ЦВЕТ: ДВЕ ТЕМЫ, СЕМЬ РОЛЕЙ (39-4, 2026-08-29).
//
// 🔒 СВЕТЛАЯ И ТЁМНАЯ — РАЗНЫЕ КАРТЫ, И ЭТО НЕ УДВОЕНИЕ РАБОТЫ, А УСЛОВИЕ ТОГО,
// ЧТОБЫ ТЕКСТ БЫЛО ВИДНО. Тема переключается классом, и цвет, заданный один раз,
// на второй теме почти всегда неверен: тёмный текст на тёмном фоне исчезает
// целиком. Поэтому и правятся они порознь — человек настраивает их в разное время
// и почти никогда не смотрит на обе сразу.
//
// 🔒 ПУСТОЕ ПОЛЕ — ЗАКОННОЕ СОСТОЯНИЕ, А НЕ НЕЗАПОЛНЕННОЕ. «Владелец выбрал
// чёрный» и «владелец не выбирал» — разные вещи: второе следует за темой проекта,
// когда та изменится. Поэтому снятие цвета уходит как `null` и СТИРАЕТ ключ, а не
// записывает пустую строку.
//
// 🔒 ПОЛЕ ЦВЕТА — ГОТОВОЕ (`color-field.client.tsx`), И ЭТО ВАЖНЕЕ, ЧЕМ КАЖЕТСЯ:
// оно уже умеет отличать показ от записи (сокращённый `#abc` показывается, но не
// пишется). Вторая реализация этого различения разошлась бы с первой.

type Theme = "light" | "dark"
type Palette = Partial<Record<string, string>>
type State = { light: Palette; dark: Palette }

const ROLES = ["primary", "accent", "background", "foreground", "muted", "border", "destructive"] as const

export function DesignColors({ initial, ui }: { initial: State; ui: DesignUi["colors"] }) {
  const [state, setState] = useState<State>(initial)
  const [theme, setTheme] = useState<Theme>("light")
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed" | "same">("idle")

  const changed = JSON.stringify(state) !== JSON.stringify(initial)

  function set(role: string, value: string) {
    setStatus("idle")
    setState(prev => ({ ...prev, [theme]: { ...prev[theme], [role]: value } }))
  }

  function clear(role: string) {
    setStatus("idle")
    setState(prev => {
      const next = { ...prev[theme] }
      delete next[role]
      return { ...prev, [theme]: next }
    })
  }

  async function save() {
    if (!changed) { setStatus("same"); return }
    setStatus("saving")
    try {
      // 🔒 ОБЕ ТЕМЫ УХОДЯТ ЦЕЛИКОМ, И РОЛЬ, У КОТОРОЙ ЦВЕТ СНЯЛИ, ПОЛУЧАЕТ `null`.
      // Слияние по ключам без этого оставило бы стёртый цвет в файле навсегда:
      // «его нет в заплате» читается как «не трогай».
      const build = (p: Palette) => {
        const out: Record<string, string | null> = {}
        for (const r of ROLES) out[r] = p[r] ?? null
        return out
      }
      const res = await fetch("/api/architect/design-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patch: { colors: { light: build(state.light), dark: build(state.dark) } } }),
      })
      setStatus(res.ok ? "saved" : "failed")
    } catch {
      setStatus("failed")
    }
  }

  const palette = state[theme]

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.intro}</p>

      {/* Переключатель темы — не оформление, а выбор ТОГО, ЧТО правится. */}
      <div className="flex gap-2">
        {(["light", "dark"] as Theme[]).map(t => (
          <button
            key={t}
            type="button"
            data-color-theme={t}
            onClick={() => setTheme(t)}
            aria-pressed={theme === t}
            className={
              "rounded-md border px-3 py-1.5 text-[length:var(--fs-small)] transition-colors " +
              (theme === t ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50")
            }
          >
            {t === "light" ? ui.themeLight : ui.themeDark}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {ROLES.map(role => (
          <section key={role} data-color-role={role} className="rounded-lg border border-border p-4">
            <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.roles[role].label}</p>
            <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
              {ui.roles[role].description}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <ColorField
                id={`${theme}-${role}`}
                value={palette[role] ?? ""}
                onChange={next => set(role, next)}
              />
              {palette[role] && (
                <button
                  type="button"
                  onClick={() => clear(role)}
                  className="text-[length:var(--fs-small)] text-muted-foreground underline hover:text-foreground"
                >
                  {ui.reset}
                </button>
              )}
            </div>
          </section>
        ))}
      </div>

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
}
