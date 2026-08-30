"use client"

import { useState } from "react"
import { Undo2 } from "lucide-react"
import { DesignWorkbench, DesignPreview } from "./design-workbench"
import { COLOR_SCHEMES, activeScheme } from "@/lib/design/color-schemes"
import { contrastRatio, verdictOf, onColor } from "@/lib/design/contrast"
import type { DesignUi } from "../_i18n/design.i18n"

// ЦВЕТ: ДВЕ ТЕМЫ, СЕМЬ РОЛЕЙ, ДЕСЯТЬ ГОТОВЫХ НАБОРОВ (шаг 42, 2026-08-29).
//
// ✗ ЧЕМ ОПЛАЧЕН ЭТОТ ФАЙЛ. В шаге 39 редактор цвета был построен от формы
// данных: семь полей и кнопка сохранения. Владелец назвал это «грубейшим
// нарушением архитектуры» и был прав — из панели переехала левая половина
// страницы, а правая, ради которой человек и крутит цвета, не переехала вовсе.
//
// 🔒 ГОТОВЫЕ НАБОРЫ СТОЯТ ПЕРВЫМИ, И ЭТО НЕ ВОПРОС ПОРЯДКА. Семь полей выбора
// цвета честны и плохи как НАЧАЛО: человек, открывший их впервые, не знает,
// какой серый поставить в рамки, чтобы он не спорил с фоном. Набор отвечает на
// это целиком.
//
// 🔒 НАБОР ЗАМЕНЯЕТ ОБЕ ТЕМЫ ЦЕЛИКОМ, А НЕ ДОПОЛНЯЕТ ТЕКУЩЕЕ. Иначе прежние
// правки остались бы поверх нового решения, и «Изумруд» вышел бы наполовину
// синим.
//
// 🔒 КОНТРАСТ ПОКАЗЫВАЕТСЯ ЧИСЛОМ, А НЕ ЗНАЧКОМ: по «4.3:1» видно, насколько
// промахнулись, а по жёлтому треугольнику — нет.

type Role =
  | "primary" | "accent" | "background" | "foreground" | "muted" | "border" | "destructive"
  // Пять рядов диаграммы (шаг 58). Имена с дефисом — они же имена токенов темы.
  | "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5"
type Theme = "light" | "dark"
type State = Record<Theme, Partial<Record<Role, string>>>

const ROLES: Role[] = [
  "primary", "accent", "background", "foreground", "muted", "border", "destructive",
  // 🔒 ДИАГРАММЫ ИДУТ ПОСЛЕДНИМИ И ПОДРЯД. Порядок списка — порядок полей на
  // экране, а ряды диаграммы читаются как одна шкала: разорви их ролями темы,
  // и человек перестанет видеть, что правит именно шкалу.
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
]

/** Запасные значения темы — только чтобы было что показать в предпросмотре. */
const FALLBACK: Record<Theme, Record<Role, string>> = {
  light: {
    primary: "#343434", accent: "#f7f7f7", background: "#ffffff", foreground: "#252525",
    muted: "#f7f7f7", border: "#ebebeb", destructive: "#c33a2b",
    // Те же значения, что в теме, переведённые в #hex: поле выбора цвета в
    // браузере другой записи не понимает, а показывать ПУСТОЕ поле там, где
    // цвет на самом деле есть, — врать о ненастроенном состоянии.
    "chart-1": "#d4d4d4", "chart-2": "#737373", "chart-3": "#525252",
    "chart-4": "#404040", "chart-5": "#262626",
  },
  dark: {
    primary: "#ebebeb", accent: "#444444", background: "#252525", foreground: "#fbfbfb",
    muted: "#444444", border: "#3a3a3a", destructive: "#e5533d",
    "chart-1": "#d4d4d4", "chart-2": "#b4b4b4", "chart-3": "#949494",
    "chart-4": "#737373", "chart-5": "#525252",
  },
}

export function DesignColors({ initial, ui }: { initial: State; ui: DesignUi["colors"] }) {
  const [state, setState] = useState<State>(initial)
  const [theme, setTheme] = useState<Theme>("light")
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed" | "same">("idle")

  const changed = JSON.stringify(state) !== JSON.stringify(initial)
  const shown = (role: Role) => state[theme][role] ?? FALLBACK[theme][role]

  function set(role: Role, value: string) {
    setStatus("idle")
    setState(s => ({ ...s, [theme]: { ...s[theme], [role]: value } }))
  }

  function applyScheme(id: string) {
    const scheme = COLOR_SCHEMES.find(x => x.id === id)
    if (!scheme) return
    setStatus("idle")
    setState({ light: { ...scheme.light }, dark: { ...scheme.dark } })
  }

  function clear(role: Role) {
    setStatus("idle")
    setState(s => {
      const next = { ...s[theme] }
      delete next[role]
      return { ...s, [theme]: next }
    })
  }

  async function save() {
    if (!changed) { setStatus("same"); return }
    setStatus("saving")
    try {
      // Обе темы уходят целиком, снятая роль получает null: слияние по ключам
      // оставило бы стёртый цвет в файле навсегда.
      const build = (p: Partial<Record<Role, string>>) => {
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

  const contrast = contrastRatio(shown("foreground"), shown("background"))
  const verdict = contrast === null ? null : verdictOf(contrast)
  const active = activeScheme(state.light, state.dark)

  const controls = (
    <div className="flex flex-col gap-4">
      <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.intro}</p>

      <section data-design-schemes className="rounded-lg border border-border p-4">
        <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.schemesLabel}</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.schemesHint}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          {COLOR_SCHEMES.map(scheme => {
            const on = active === scheme.id
            const face = scheme[theme]
            return (
              <button
                key={scheme.id}
                type="button"
                data-scheme={scheme.id}
                onClick={() => applyScheme(scheme.id)}
                aria-pressed={on}
                title={ui.schemes[scheme.id as keyof typeof ui.schemes]}
                className={
                  "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors " +
                  (on ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/50")
                }
              >
                <span className="flex gap-0.5">
                  {([face.background, face.primary, face.accent] as const).map((c, i) => (
                    <span key={i} className="size-3 rounded-full border border-black/10" style={{ background: c }} />
                  ))}
                </span>
                <span className="text-[length:var(--fs-small)] text-foreground">
                  {ui.schemes[scheme.id as keyof typeof ui.schemes]}
                </span>
              </button>
            )
          })}
        </div>
        {!active && (
          <p className="mt-2 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{ui.schemeCustom}</p>
        )}
      </section>

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

      <div className="flex flex-col gap-2">
        {ROLES.map(role => {
          const own = state[theme][role]
          return (
            // 🔒 КАРТОЧКА В ДВЕ СТРОКИ, А НЕ В ТРИ КОЛОНКИ (владелец 2026-08-29):
            // «верхний ряд — это первая строка карточки, а этот длинный текст —
            // вторая строка, и чтобы он занял всё пространство карточки».
            //
            // Довод типографский: описание роли — самая длинная строка карточки, и
            // зажатое между образцом цвета слева и кнопкой сброса справа оно
            // ломалось на четыре-пять коротких обрывков. Ширина у текста должна
            // быть та же, что у карточки.
            <section key={role} data-color-role={role} className="flex flex-col gap-2 rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label={ui.roles[role].label}
                  value={shown(role)}
                  onChange={e => set(role, e.target.value)}
                  className="size-8 shrink-0 cursor-pointer rounded border border-border bg-transparent"
                />
                <p className="min-w-0 flex-1 truncate text-[length:var(--fs-body)] font-medium text-foreground">
                  {ui.roles[role].label}
                </p>
                {/* 🔒 ЗНАЧОК ВМЕСТО ФРАЗЫ (владелец 2026-08-29): «длинный текст
                    „вернуться к цветам темы“ — это должна быть просто одна иконка
                    назад». Подпись никуда не делась: она осталась доступным именем
                    кнопки, то есть её по-прежнему читают вслух и находят поиском. */}
                {own && (
                  <button
                    type="button"
                    onClick={() => clear(role)}
                    aria-label={ui.reset}
                    title={ui.reset}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Undo2 className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                {ui.roles[role].description}
              </p>
            </section>
          )
        })}
      </div>
    </div>
  )

  const preview = (
    <>
      <DesignPreview label={ui.preview}>
        <div
          data-design-preview="colors"
          className="rounded-md p-3"
          style={{ background: shown("background"), border: `1px solid ${shown("border")}` }}
        >
          <p className="text-[length:var(--fs-body)] font-bold" style={{ color: shown("foreground") }}>
            {ui.previewHeading}
          </p>
          <p
            className="mt-1 text-[length:var(--fs-small)] leading-relaxed"
            style={{ color: shown("foreground"), opacity: 0.75 }}
          >
            {ui.previewBody}
          </p>
          <span
            className="mt-2.5 inline-block rounded px-2.5 py-1 text-[length:var(--fs-small)] font-medium"
            style={{ background: shown("primary"), color: onColor(shown("primary")) }}
          >
            {ui.previewButton}
          </span>
        </div>

        {contrast !== null && (
          <div
            data-contrast={verdict}
            className={
              "mt-2 rounded-md border px-2.5 py-2 " +
              (verdict === "ok"
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                : verdict === "low"
                  ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300"
                  : "border-destructive/40 bg-destructive/5 text-destructive")
            }
          >
            <p className="text-[length:var(--fs-small)] font-medium">
              {verdict === "ok" ? ui.contrastOk : verdict === "low" ? ui.contrastLow : ui.contrastBad}
              {" · "}
              <span className="font-mono tabular-nums">{contrast.toFixed(1)}:1</span>
            </p>
            <p className="mt-0.5 text-[length:var(--fs-small)] leading-relaxed opacity-90">{ui.contrastHint}</p>
          </div>
        )}
      </DesignPreview>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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
    </>
  )

  return <DesignWorkbench controls={controls} preview={preview} />
}
