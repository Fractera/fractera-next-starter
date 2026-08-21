"use client"

// Управление таблицей учётных записей: заголовок, кнопка раскрытия, поиск.
//
// 🔒 СВОЁ, А НЕ ОБЩЕЕ (шаг 521) — но форма ТА ЖЕ, что у соседних таблиц, и это
// не противоречие. Изоляция означает, что фрагменты не делятся между виджетами;
// она не означает, что страницы одного продукта имеют право выглядеть чужими
// друг другу. Владелец 2026-08-21 указал именно на это: таблица пользователей
// была построена в другом ритме отступов и без заголовка, и читалась как кусок
// другого сайта.
//
// Отличие от соседей одно и по существу: здесь нет кнопки сброса поиска —
// выборку задаёт служба авторизации, и «применённого» состояния, от которого
// можно отказаться, у нас нет.

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { H4 } from "@/components/ui/typography"
import { Eye, Loader2, Search } from "lucide-react"
import type { UsersTableUi } from "./ui.i18n"

export function UsersToolbar(
  { ui, revealed, loading, query, onQuery, onReveal, onSearch }: {
    ui: UsersTableUi
    revealed: boolean
    loading: boolean
    query: string
    onQuery: (v: string) => void
    onReveal: () => void
    onSearch: () => void
  },
) {
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <H4 variant="ui">{ui.tableTitle}</H4>
        {!revealed && (
          <Button size="sm" onClick={onReveal} disabled={loading}>
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
            {loading ? ui.loading : ui.reveal}
          </Button>
        )}
      </div>

      <div className="mb-3 flex gap-2">
        <Input
          value={query}
          onChange={e => onQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch()}
          placeholder={ui.searchPlaceholder}
          className="h-8 max-w-xs text-xs"
        />
        <Button size="sm" variant="secondary" onClick={onSearch} disabled={loading}>
          <Search size={12} />{ui.search}
        </Button>
      </div>
    </>
  )
}
