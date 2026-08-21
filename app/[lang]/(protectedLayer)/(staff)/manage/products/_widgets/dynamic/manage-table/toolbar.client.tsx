"use client"

// Управление списком персонала: заголовок, раскрытие, заведение товара, поиск.
//
// 🔒 КНОПКА «ДОБАВИТЬ» ЗДЕСЬ БЕЗУСЛОВНА — и в этом отличие от трёх соседних
// таблиц. Общий тулбар объявлял её необязательной (`onToggleAdd?`), потому что
// обслуживал четыре роли разом: три из них права заводить товар не имеют и
// передавали пустые строки, чтобы её спрятать. Здесь обслуживать некого — право
// есть, кнопка есть, обработчик обязателен. Возможность и её признак в
// интерфейсе снова одна вещь, а не флаг рядом с обработчиком.
//
// 🔒 УПРАВЛЕНИЕ СТОИТ ТАМ, ГДЕ СПИСОК НАЗВАН — на одной строке с заголовком, а не
// под таблицей: под длинной таблицей кнопка уезжает за нижний край, и человек
// ищет глазами то, ради чего пришёл.
//
// Поиск запускается КНОПКОЙ или Enter, а не набором текста: запрос на каждую
// букву на медленной сети обгоняет сам себя, и список моргает ответами на
// промежуточные слова.

import { Plus, X, Loader2, Eye, Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { H4 } from "@/components/ui/typography"

export function ManageToolbar(
  { labels, revealed, loading, adding, query, applied, onQuery, onReveal, onToggleAdd, onSearch, onReset }: {
    labels: {
      tableTitle: string; reveal: string; loading: string
      add: string; cancelAdd: string
      searchPlaceholder: string; find: string; reset: string
    }
    revealed: boolean; loading: boolean; adding: boolean; query: string; applied: string
    onQuery: (v: string) => void
    onReveal: () => void
    onToggleAdd: () => void
    onSearch: () => void
    onReset: () => void
  },
) {
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <H4 variant="ui">{labels.tableTitle}</H4>
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
        {/* Сброс появляется только когда выборка ПРИМЕНЕНА: кнопка, которой не от
            чего отказываться, — лишний элемент на каждом экране. */}
        {applied && (
          <Button size="sm" variant="ghost" onClick={onReset} disabled={loading}>
            <RotateCcw size={12} />{labels.reset}
          </Button>
        )}
      </div>
    </>
  )
}
