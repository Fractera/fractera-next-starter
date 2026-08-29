"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { H3, Small } from "@/components/ui/typography"
import type { MigrationSource } from "../_lib/dev-mode"
import type { DevModeUi } from "../_i18n/dev-mode.i18n"

// ИСТОЧНИК ПЕРЕЕЗДА (33-5, 2026-08-29).
//
// 🔒 ЭТО ЕДИНСТВЕННЫЙ РЕЖИМ С ВНЕШНИМ УСЛОВИЕМ. Остальным трём довольно того, что
// уже лежит на сервере; переезд без чужого проекта не начинается вовсе, и молчать
// об этом до сохранения режима значило бы обещать работу, которой владелец не
// сможет дать хода. Поэтому поле стоит на самой вкладке, а не «где-то дальше».
//
// 🔒 ФОРМА ВЕТКИ ВЗЯТА У ЧИТАТЕЛЯ, А НЕ ПРИДУМАНА ЗДЕСЬ. `PLATFORM-CONFIG.migration`
// читает агент этого проекта на старте вместе с режимом (`CLAUDE.md`, «Development
// modes»). Лишнее поле там просто исчезнет при чтении, выглядя как несохранённая
// настройка.
//
// 🔒 ТОКЕН НЕ СПРАШИВАЕТСЯ, И ЭТО ЗАКОН, А НЕ ЗАБЫВЧИВОСТЬ. Владелец держит
// приватный репозиторий, из которого переезжает, открытым на время переезда. Не
// путать с `USER_GITHUB_ACCESS_TOKEN` в `.env.local`: тот принадлежит СОБСТВЕННОМУ
// репозиторию проекта, его пишет панель, и он законен.
//
// 🔒 АДРЕС ПРОВЕРЯЕТСЯ НА ФОРМУ, А НЕ НА ДОСТУПНОСТЬ. Поход к чужому репозиторию
// отсюда может висеть секунды и ничего не доказать: приватный ответит `404` и
// живой, и мёртвый. Проверяем проверяемое.
export function MigrationSourceEditor({
  initial,
  ui,
}: {
  initial: MigrationSource
  ui: DevModeUi
}) {
  const [url, setUrl] = useState(initial.repositoryUrl ?? "")
  const [saved, setSaved] = useState(initial.repositoryUrl ?? "")
  const [busy, setBusy] = useState(false)

  const changed = url.trim() !== saved.trim()

  async function save() {
    const value = url.trim()
    setBusy(true)

    // 🔒 «НЕ НАЗВАЛ ИСТОЧНИК» И «НАЗВАЛ ПУСТЫМ» — РАЗНЫЕ СОСТОЯНИЯ. Пустое поле
    // СТИРАЕТ ветку целиком (`null` в заплате), а не кладёт в неё пустую строку:
    // пустая строка читалась бы агентом как названный источник, которого нет.
    const patch = value
      ? { migration: { source: "github", repositoryUrl: value, declaredAt: new Date().toISOString() } }
      : { migration: null }

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
      toast.success(ui.sourceSaved)
      setSaved(value)
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  return (
    <section data-migration-source className="flex flex-col gap-4 rounded-2xl border border-border p-6">
      <div className="flex flex-col gap-1">
        <H3 variant="ui">{ui.sourceTitle}</H3>
        <Small className="max-w-3xl">{ui.sourceHint}</Small>
      </div>
      <Separator />

      <div className="flex flex-col gap-2">
        <Small className="font-medium text-foreground">{ui.sourceLabel}</Small>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="url"
            inputMode="url"
            dir="ltr"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={ui.sourcePlaceholder}
            aria-label={ui.sourceLabel}
            className="max-w-xl text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
          />
          <Button type="button" onClick={save} disabled={busy || !changed} data-migration-save className="h-10 px-5">
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {busy ? ui.saving : ui.sourceSave}
          </Button>
        </div>
        <Small>{ui.sourceNoToken}</Small>
      </div>
    </section>
  )
}
