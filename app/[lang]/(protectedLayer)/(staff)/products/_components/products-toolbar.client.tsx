"use client"

// Панель управления списком: заголовок раздела, кнопка раскрытия, кнопка
// добавления и поиск.
//
// 🔒 УПРАВЛЕНИЕ СТОИТ ТАМ, ГДЕ СПИСОК НАЗВАН — на одной строке с заголовком, а
// не под таблицей. Под длинной таблицей кнопка уезжает за нижний край, и
// человек ищет глазами то, ради чего пришёл.
//
// Поиск запускается КНОПКОЙ или клавишей Enter, а не набором текста: запрос на
// каждую букву на медленной сети обгоняет сам себя, и список моргает ответами
// на промежуточные слова.

import { Plus, X, Loader2, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type ToolbarLabels = {
  tableTitle: string; reveal: string; loading: string
  add: string; cancelAdd: string
  searchPlaceholder: string; find: string
}

export function ProductsToolbar(
  { labels, revealed, loading, adding, query, onQuery, onReveal, onToggleAdd, onSearch }: {
    labels: ToolbarLabels
    revealed: boolean; loading: boolean; adding: boolean; query: string
    onQuery: (v: string) => void
    onReveal: () => void
    onToggleAdd: () => void
    onSearch: () => void
  },
) {
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">{labels.tableTitle}</h2>
        <div className="flex items-center gap-2">
          {!revealed ? (
            <Button size="sm" onClick={onReveal} disabled={loading}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
              {loading ? labels.loading : labels.reveal}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onToggleAdd}>
              {adding ? <X size={12} /> : <Plus size={12} />}
              {adding ? labels.cancelAdd : labels.add}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <Input
          value={query}
          onChange={e => onQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch()}
          placeholder={labels.searchPlaceholder}
          className="h-8 max-w-xs text-xs"
        />
        <Button size="sm" variant="secondary" onClick={onSearch} disabled={loading}>
          <Search size={12} />{labels.find}
        </Button>
      </div>
    </>
  )
}
