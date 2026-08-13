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

import { Plus, X, Loader2, Eye, Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type ToolbarLabels = {
  tableTitle: string; reveal: string; loading: string
  add: string; cancelAdd: string
  searchPlaceholder: string; find: string; reset: string
}

export function ProductsToolbar(
  { labels, revealed, loading, adding, query, applied, onQuery, onReveal, onToggleAdd, onSearch, onReset }: {
    labels: ToolbarLabels
    revealed: boolean; loading: boolean; adding: boolean; query: string; applied: string
    onQuery: (v: string) => void
    onReveal: () => void
    /** 🔒 НЕТ ОБРАБОТЧИКА — НЕТ КНОПКИ (владелец 2026-08-13).
     * Три группы прав из четырёх передавали сюда пустую функцию: кнопка «Добавить»
     * рисовалась, человек нажимал и не происходило НИЧЕГО. Кнопка, которая ничего
     * не делает, хуже отсутствующей — она обещает право, которого нет, и человек
     * решает, что сломан продукт, а не что ему сюда нельзя.
     * Проп необязателен намеренно: право добавлять описывается ЕГО НАЛИЧИЕМ, а не
     * отдельным флагом, который однажды разойдётся с обработчиком. */
    onToggleAdd?: () => void
    onSearch: () => void
    onReset: () => void
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
          ) : onToggleAdd ? (
            <Button size="sm" variant="outline" onClick={onToggleAdd}>
              {adding ? <X size={12} /> : <Plus size={12} />}
              {adding ? labels.cancelAdd : labels.add}
            </Button>
          ) : null}
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
        {/* Сброс появляется только когда выборка ПРИМЕНЕНА: кнопка, которой не
            от чего отказываться, — лишний элемент на каждом экране. */}
        {applied && (
          <Button size="sm" variant="ghost" onClick={onReset} disabled={loading}>
            <RotateCcw size={12} />{labels.reset}
          </Button>
        )}
      </div>
    </>
  )
}
