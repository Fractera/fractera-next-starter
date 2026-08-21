"use client"

// Поведение таблицы учётных записей — СВОЁ, как у соседних виджетов.
//
// 🔒 ЧЕМ ОНО ОТЛИЧАЕТСЯ ОТ ТАБЛИЦ ТОВАРОВ, И ПОЧЕМУ ОБЩИМ БЫТЬ НЕ МОЖЕТ.
// Записи живут в СЛУЖБЕ авторизации, а не в базе приложения: размер страницы
// задаёт она (сто строк) и менять его отсюда нечем. Поэтому здесь нет ни выбора
// числа строк, ни ключа хранения этого выбора — те строки у соседей не «лишние»,
// они просто про другой источник.
//
// 🔒 ЗАКРЫТА ПО УМОЛЧАНИЮ. Пока человек не нажал, служба не спрошена. Список
// людей — самая дорогая и самая чувствительная выборка на этой странице, и
// запрашивать её у каждого, кто просто открыл адрес, незачем.
//
// 🔒 ОТКАЗ РАЗБИРАЕТСЯ ПО КОДУ, А НЕ ОДНОЙ ФРАЗОЙ. 403 и 502 — разные события:
// первое означает «вам сюда нельзя», второе — «служба не ответила». Одна общая
// фраза «не удалось» заставила бы владельца искать неисправность там, где её нет.

import { useState, useCallback } from "react"
import { toast } from "sonner"
import type { UsersTableUi } from "./ui.i18n"

export type AccountRow = {
  id: string
  email: string
  nickname: string | null
  /** Приезжает строкой JSON — разбор в одном месте, см. `rolesOf`. */
  roles: string
  is_active: number
  provider: string
  created_at: string
}

/**
 * Роли строкой JSON → массив. Разбор ЗДЕСЬ, а не в двух местах: таблица и форма
 * изменения обязаны понимать роли одинаково, иначе одна запись покажет разные
 * роли в строке и в редакторе.
 */
export function rolesOf(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed.map(String) : ["user"]
  } catch {
    return ["user"]
  }
}

export function useUsersList(ui: UsersTableUi) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AccountRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  // Что НАБРАНО и что ПРИМЕНЕНО — разные вещи, иначе список дёргается, пока
  // человек печатает.
  const [query, setQuery] = useState("")

  const load = useCallback(
    async (opts: { page?: number; q?: string } = {}) => {
      const nextPage = opts.page ?? 1
      const q = opts.q ?? ""
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(nextPage) })
        if (q) params.set("q", q)
        const res = await fetch(`/api/users?${params}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast.error(res.status === 403 ? ui.forbidden : res.status === 502 ? ui.unreachable : ui.failed)
          return
        }
        const list = Array.isArray(data.users) ? (data.users as AccountRow[]) : []
        setRows(list)
        setTotal(Number(data.total) || list.length)
        setPage(nextPage)
        // Число страниц считает сторона, знающая размер страницы: у службы он
        // свой, и вычислять его здесь значило бы дублировать её решение.
        const perPage = Number(data.perPage) || 100
        setPages(Math.max(1, Math.ceil((Number(data.total) || list.length) / perPage)))
        setRevealed(true)
      } catch {
        toast.error(ui.unreachable)
      } finally {
        setLoading(false)
      }
    },
    [ui],
  )

  return { revealed, loading, rows, total, page, pages, query, setQuery, load }
}
