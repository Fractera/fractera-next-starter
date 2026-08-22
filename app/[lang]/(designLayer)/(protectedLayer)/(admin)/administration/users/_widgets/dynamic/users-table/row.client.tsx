"use client"

// Строка одной учётной записи — со своим редактором ролей внутри.
//
// 🔒 РЕДАКТОР ЖИВЁТ В СТРОКЕ, А НЕ В ДИАЛОГЕ. Меняется ровно одно поле, и
// открывать ради него окно значит уводить человека со списка, где он сравнивает
// записи между собой. Диалог оправдан там, где правок много или где решение
// опасно; смена роли отменяется той же кнопкой.
//
// 🔒 ЧЕКБОКСЫ, А НЕ СВОБОДНАЯ СТРОКА. Роли — закрытый список приложения
// (`ALL_ROLES`), и набранная руками роль тихо не открывает ничего. Дверь это
// тоже проверяет — но интерфейс не должен позволять ошибку, которую дверь потом
// отвергнет.

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ALL_ROLES } from "@/lib/roles"
import { rolesOf, type AccountRow } from "./use-list"
import { lastSeen, DORMANT_AFTER_DAYS } from "./last-seen"
import type { UsersTableUi } from "./ui.i18n"

export function UsersRow(
  { row, ui, lang, striped, onSaved }: {
    row: AccountRow
    ui: UsersTableUi
    lang: string
    /** Чередование фона строк — тот же приём, что у соседних таблиц продукта. */
    striped?: boolean
    onSaved: () => void
  },
) {
  const current = rolesOf(row.roles)
  const [editing, setEditing] = useState(false)
  const [next, setNext] = useState<string[]>(current)
  const [saving, setSaving] = useState(false)

  const toggle = (role: string) =>
    setNext(prev => (prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]))

  async function save() {
    if (next.length === 0) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(row.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roles: next }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        // Причину называет тот, кто отказал: служба знает про себя больше нас —
        // например, что снять `architect` с самого себя нельзя.
        const { toast } = await import("sonner")
        toast.error(String(data?.error ?? ui.failed))
        return
      }
      const { toast } = await import("sonner")
      toast.success(ui.saved)
      setEditing(false)
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className={`border-b border-border last:border-0 align-top ${striped ? "bg-muted/20" : ""}`}>
      <td className="px-4 py-2.5">
        <div className="font-medium text-foreground">{row.email}</div>
        {row.nickname && <div className="text-muted-foreground">{row.nickname}</div>}
      </td>
      <td className="px-4 py-2.5">
        {editing ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {ALL_ROLES.map(role => (
                <label key={role} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={next.includes(role)}
                    onChange={() => toggle(role)}
                    className="size-3.5 accent-[var(--color-primary)]"
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
            {next.length === 0 && <p className="text-destructive">{ui.rolesRequired}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={save} disabled={saving || next.length === 0}>{ui.save}</Button>
              <Button size="sm" variant="ghost" onClick={() => { setNext(current); setEditing(false) }}>
                {ui.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {current.map(r => <Badge key={r} variant="secondary">{r}</Badge>)}
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>{ui.edit}</Button>
          </div>
        )}
      </td>
      <td className="px-4 py-2 text-muted-foreground">{row.provider}</td>
      {/* Дата — по языку страницы. Американский порядок на русской странице
          читается как другая дата, а не как непривычная запись. */}
      <td className="px-4 py-2 text-muted-foreground">
        {new Date(row.created_at).toLocaleDateString(lang)}
      </td>
      {/* Последний вход — СЛОВАМИ, а не значением из базы: владелец смотрит
          сюда, чтобы отличить живую запись от заброшенной, и «2026-07-14T09:12Z»
          на этот вопрос не отвечает, пока не посчитаешь в уме.

          Живая запись стоит обычным цветом, а уснувшая — приглушённым: в списке
          из ста строк глаз читает рисунок раньше слов. Точная дата не потеряна,
          она в подсказке — «понятно» не должно значить «непроверяемо». */}
      <LastSeenCell raw={row.last_login_at} lang={lang} ui={ui} />
    </tr>
  )
}

function LastSeenCell({
  raw,
  lang,
  ui,
}: {
  raw: string | null | undefined
  lang: string
  ui: UsersTableUi
}) {
  const seen = lastSeen(raw, lang)

  if (seen.kind === "at") {
    const dormant = seen.days >= DORMANT_AFTER_DAYS
    return (
      <td className={`px-3 py-2 ${dormant ? "text-muted-foreground" : "text-foreground"}`}>
        <span title={seen.exact}>{seen.text}</span>
      </td>
    )
  }

  // Два молчания — две разные строки. Склеить их в одно «—» значит выдать
  // молчание службы за поведение человека.
  return (
    <td className="px-4 py-2 text-muted-foreground">
      {seen.kind === "never" ? ui.lastSeenNever : ui.lastSeenUnknown}
    </td>
  )
}
