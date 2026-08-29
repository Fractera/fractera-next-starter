"use client"

import { useState } from "react"
import { DesignWorkbench, DesignPreview } from "./design-workbench"
import { FONT_CATALOGUE, isSystemFont, type FontEntry } from "@/lib/design/font-catalogue"
import type { DesignUi } from "../_i18n/design.i18n"

// ВЫБОР ШРИФТОВ ВНУТРИ ПРОЕКТА (39-2, 2026-08-29).
//
// 🔒 ПОВЕДЕНИЕ ПЕРЕНЕСЕНО ИЗ ПАНЕЛИ, А НЕ ПРИДУМАНО ЗАНОВО. Тот же набор ролей,
// та же плитка выбора, та же оговорка о внешних шрифтах. Человек, знавший панель,
// обязан узнать экран; переезд — это смена адреса, а не смена продукта.
//
// 🔒 ОТПРАВЛЯЕТСЯ ВСЯ ВЕТКА `fonts`, И ЭТО НЕ ПРОТИВОРЕЧИТ ЗАКОНУ ЗАПЛАТЫ.
// Заплата защищает СОСЕДНИЕ ветки — `type`, `shape`, `colors`, — и они здесь не
// упоминаются вовсе. Внутри же своей ветки нужен именно снимок: роль, у которой
// выбор сняли, обязана из файла ИСЧЕЗНУТЬ, а слияние по ключам оставило бы ей
// прежнее значение навсегда. Та же причина, по которой массивы меню шлются
// целиком.
//
// 🔒 СИСТЕМНЫЙ ШРИФТ СТОИТ ПЕРВЫМ И НИЧЕГО НЕ ЗАГРУЖАЕТ. Оговорка про внешние
// шрифты остаётся видимой всегда, а не прячется мелким шрифтом внизу: подключение
// внешнего шрифта отдаёт адрес посетителя чужому серверу, и в Европе это уже
// признавалось нарушением GDPR.

type Role = "heading" | "body" | "mono"
type Choice = { family: string; import?: string }
type State = Partial<Record<Role, Choice>>

const ROLES: Role[] = ["heading", "body", "mono"]

export function DesignFonts({ initial, ui }: { initial: State; ui: DesignUi["fonts"] }) {
  const [state, setState] = useState<State>(initial)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed" | "same">("idle")

  const changed = JSON.stringify(state) !== JSON.stringify(initial)
  const links = [...new Set(ROLES.map(r => state[r]?.import).filter((u): u is string => !!u))]

  function pick(role: Role, entry: FontEntry | null) {
    setStatus("idle")
    setState(prev => ({
      ...prev,
      [role]: entry ? { family: entry.family, ...(entry.import ? { import: entry.import } : {}) } : undefined,
    }))
  }

  async function save() {
    if (!changed) { setStatus("same"); return }
    setStatus("saving")
    try {
      const fonts: Record<string, Choice> = {}
      for (const r of ROLES) if (state[r]) fonts[r] = state[r]!
      const res = await fetch("/api/architect/design-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patch: { fonts } }),
      })
      setStatus(res.ok ? "saved" : "failed")
    } catch {
      setStatus("failed")
    }
  }

  const controls = (
    <div className="flex flex-col gap-5">
      {/* Настоящие шрифты в образце: витрина, показывающая выбор чужим шрифтом,
          не показывает ничего. */}
      {links.map(href => <link key={href} rel="stylesheet" href={href} />)}

      <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.intro}</p>

      {ROLES.map(role => {
        const current = state[role]
        const options = FONT_CATALOGUE.filter(f => (role === "mono" ? f.kind === "mono" : f.kind !== "mono"))
        return (
          <section key={role} data-font-role={role} className="rounded-lg border border-border p-4">
            <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.roles[role].label}</p>
            <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
              {ui.roles[role].description}
            </p>

            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {options.map(entry => {
                const active = current?.family === entry.family
                const system = isSystemFont(entry.family)
                return (
                  <button
                    key={entry.family}
                    type="button"
                    onClick={() => pick(role, entry)}
                    aria-pressed={active}
                    className={
                      "flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition-colors " +
                      (active ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/50")
                    }
                  >
                    <span
                      className="text-[length:var(--fs-body)] font-medium text-foreground"
                      style={{ fontFamily: entry.family }}
                    >
                      {system ? ui.systemOption : entry.family}
                    </span>
                    <span className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                      {entry.alphabets.map(a => ui.alphabets[a]).join(", ")}
                      {" · "}
                      {system ? ui.noDownload : ui.external}
                    </span>
                  </button>
                )
              })}
            </div>

            {current && (
              <button
                type="button"
                onClick={() => pick(role, null)}
                className="mt-2 text-[length:var(--fs-small)] text-muted-foreground underline hover:text-foreground"
              >
                {ui.reset}
              </button>
            )}
          </section>
        )
      })}

      <p className="rounded-md border border-tone-access/30 bg-tone-access/5 p-3 text-[length:var(--fs-small)] leading-relaxed text-tone-access">
        {ui.systemNote}
      </p>

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

  // 🔒 ПРЕДПРОСМОТР ПОКАЗЫВАЕТ ТЕКСТ ВЫБРАННЫМИ ШРИФТАМИ, А НЕ ИХ ИМЕНА.
  // Название семейства не отвечает на вопрос, ради которого человек сюда пришёл:
  // как это будет читаться. Отвечает только сам текст, набранный этим шрифтом.
  const preview = (
    <>
      <DesignPreview label={ui.preview}>
        <div data-design-preview="fonts" className="flex flex-col gap-3">
          <p
            className="text-[length:var(--fs-h3)] font-bold leading-tight text-foreground"
            style={{ fontFamily: state.heading?.family }}
          >
            {ui.previewText}
          </p>
          <p
            className="text-[length:var(--fs-body)] leading-relaxed text-muted-foreground"
            style={{ fontFamily: state.body?.family }}
          >
            {ui.previewText}
          </p>
          <p
            className="text-[length:var(--fs-small)] text-muted-foreground"
            style={{ fontFamily: state.mono?.family ?? "ui-monospace, monospace" }}
          >
            {ui.previewText}
          </p>
        </div>
      </DesignPreview>
    </>
  )

  return <DesignWorkbench controls={controls} preview={preview} />
}
