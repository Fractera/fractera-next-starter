"use client"

// Управление списком покупателя: заголовок, раскрытие, поиск.
//
// 🔒 ЗДЕСЬ НЕТ КНОПКИ «ДОБАВИТЬ» — И НЕТ ДАЖЕ ПОЛЕЙ ПОД НЕЁ. Общий тулбар их
// объявлял, и слой покупателя, чтобы кнопку спрятать, передавал `add: ""` и
// `cancelAdd: ""`. Пустая строка как способ выключить возможность — признак
// того, что компонент принадлежит не тому, кто им пользуется.
//
// Покупатель товары не заводит, он их покупает. Поэтому кнопки нет физически.
//
// 🔒 УПРАВЛЕНИЕ СТОИТ ТАМ, ГДЕ СПИСОК НАЗВАН — на одной строке с заголовком, а не
// под таблицей: под длинной таблицей кнопка уезжает за нижний край, и человек
// ищет глазами то, ради чего пришёл.
//
// Поиск запускается КНОПКОЙ или Enter, а не набором текста: запрос на каждую
// букву на медленной сети обгоняет сам себя, и список моргает ответами на
// промежуточные слова.

import { Loader2, Eye, Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { H4 } from "@/components/ui/typography"

export function ShopToolbar(
  { labels, revealed, loading, query, applied, onQuery, onReveal, onSearch, onReset }: {
    labels: {
      tableTitle: string; reveal: string; loading: string
      searchPlaceholder: string; find: string; reset: string
    }
    revealed: boolean; loading: boolean; query: string; applied: string
    onQuery: (v: string) => void
    onReveal: () => void
    onSearch: () => void
    onReset: () => void
  },
) {
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <H4 variant="ui">{labels.tableTitle}</H4>
        {!revealed && (
          <Button size="sm" onClick={onReveal} disabled={loading}>
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
            {loading ? labels.loading : labels.reveal}
          </Button>
        )}
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
