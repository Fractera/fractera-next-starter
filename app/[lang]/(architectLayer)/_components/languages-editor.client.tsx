"use client"

import { useMemo, useState } from "react"
import { Check, Loader2, Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { AdviceNote } from "./advice-note"
import type { GroupsUi } from "../_i18n/groups.i18n"

/** Одна строка каталога: всё уже разобрано сервером. */
export type LangRow = {
  code: string
  flag: string
  nativeName: string
  englishName: string
  /** Качество машинного перевода: `A` — высокое, `community` — данных мало. */
  tier: string
}

// НАБОР ЯЗЫКОВ САЙТА (31-16, 2026-08-29).
//
// 🔒 РЕЧЬ О ЯЗЫКАХ ЭТОГО САЙТА, А НЕ ЭКРАНОВ НАСТРОЕК. Два разных набора, и путать
// их нельзя: снять здесь язык — значит перестать собирать для него страницы сайта.
//
// 🔒 ПРЕДУПРЕЖДЕНИЕ О ЦЕНЕ СТОИТ ПЕРЕД СПИСКОМ, А НЕ ПОСЛЕ. Свежий проект приходит
// с готовым набором, и страницу проскакивают с мыслью «потом разберусь» — набор
// выглядит как отметки, а стоит как переводы всех страниц навсегда и умноженное
// время каждой сборки. Увидевший сначала список выбирает языки; увидевший сначала
// цену решает, сколько их ему нужно.
//
// 🔒 СОХРАНЕНО ≠ ПРИМЕНЕНО, И ЭТО ГЛАВНОЕ ОТЛИЧИЕ ЭТОЙ ГРУППЫ ОТ ОСТАЛЬНЫХ. Набор
// запекается на сборке. Сказать «Сохранено» и замолчать значило бы отдать человеку
// зелёную отметку на настройку, которой сайт не видит: он откроет сайт, увидит
// прежние языки и решит, что сохранение не работает.
export function LanguagesEditor({
  catalogue,
  initial,
  initialDefault,
  built,
  ui,
}: {
  /** Все языки, которые проект умеет: разобраны на сервере. */
  catalogue: readonly LangRow[]
  /** Что записано в окружении сейчас. */
  initial: readonly string[]
  initialDefault: string
  /** С каким набором проект СОБРАН. Расхождение и есть «ждёт пересборки». */
  built: readonly string[]
  ui: GroupsUi
}) {
  const t = ui.langs
  const [selected, setSelected] = useState<string[]>(() => [...initial])
  const [def, setDef] = useState(initialDefault)
  const [saved, setSaved] = useState(() => JSON.stringify([[...initial].sort(), initialDefault]))
  const [busy, setBusy] = useState(false)

  const changed = useMemo(
    () => JSON.stringify([[...selected].sort(), def]) !== saved,
    [selected, def, saved],
  )

  // 🔒 «ЖДЁТ ПЕРЕСБОРКИ» СЧИТАЕТСЯ ПО СОХРАНЁННОМУ, А НЕ ПО ТЕКУЩЕМУ ВЫБОРУ.
  // Иначе строка мигала бы при каждом щелчке по языку, ещё до сохранения, — и
  // перестала бы значить что-либо. Сравниваются два факта: что записано в
  // окружении и с чем проект СОБРАН.
  const pending = useMemo(() => {
    const [savedSet] = JSON.parse(saved) as [string[], string]
    return savedSet.join(",") !== [...built].sort().join(",")
  }, [saved, built])

  function toggle(code: string) {
    setSelected(prev => {
      if (prev.includes(code)) {
        if (prev.length === 1) {
          toast.error(t.atLeastOne)
          return prev
        }
        if (code === def) {
          // Основной язык снять нельзя: сайт остался бы без главной страницы.
          toast.error(t.defaultMustBeSelected)
          return prev
        }
        return prev.filter(c => c !== code)
      }
      return [...prev, code]
    })
  }

  async function save() {
    if (!changed) {
      toast.info(ui.nothingToSave)
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/architect/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ languages: selected, defaultLanguage: def }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      // Два сообщения подряд были бы шумом: одной строкой говорим и что
      // сохранено, и что это значит на самом деле.
      toast.success(ui.saved + " — " + t.rebuildTitle)
      setSaved(JSON.stringify([[...selected].sort(), def]))
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  return (
    <div data-languages-editor className="flex flex-col gap-8">
      {/* Цена — до списка. Она и есть решение, которое здесь принимают. */}
      <AdviceNote probe="lang-cost" title={t.costTitle} text={t.cost} />

      {/* Строка про пересборку — не украшение: без неё «Сохранено» лжёт. */}
      <div data-lang-rebuild={pending ? "pending" : "clean"} className="flex flex-col gap-1">
        <P className="text-[length:var(--fs-body)] font-medium">{t.rebuildTitle}</P>
        <Small className="max-w-2xl">{t.rebuild}</Small>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.title}</H3>
          <Small className="max-w-2xl">{t.hint}</Small>
          <Small data-lang-count className="font-medium text-foreground">
            {selected.length} {t.selected}
          </Small>
        </div>
        <Separator />

        <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {catalogue.map(row => {
            const on = selected.includes(row.code)
            const isDefault = row.code === def
            return (
              <li
                key={row.code}
                data-lang={row.code}
                data-on={on ? "true" : "false"}
                data-default={isDefault ? "true" : "false"}
                className={
                  "flex items-center gap-3 rounded-lg border px-3 py-2 " +
                  (on ? "border-primary/50 bg-primary/5" : "border-border")
                }
              >
                <button
                  type="button"
                  onClick={() => toggle(row.code)}
                  aria-pressed={on}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span aria-hidden className="text-[length:var(--fs-h3)] leading-none">{row.flag}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[length:var(--fs-body)] text-foreground">{row.nativeName}</span>
                    <Small className="block truncate">
                      {row.englishName} · {row.tier === "A" ? t.tierA : t.tierCommunity}
                    </Small>
                  </span>
                  {on && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                </button>

                {/* Основным можно сделать только выбранный язык: иначе сайт
                    остался бы с умолчанием, страниц для которого не собирают. */}
                {on && (
                  <Button
                    type="button"
                    variant={isDefault ? "default" : "ghost"}
                    size="icon"
                    aria-label={isDefault ? t.defaultLabel : t.makeDefault}
                    title={isDefault ? t.defaultLabel : t.makeDefault}
                    data-make-default={row.code}
                    onClick={() => setDef(row.code)}
                    className="size-9 shrink-0"
                  >
                    <Star className="size-4" aria-hidden />
                  </Button>
                )}
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
