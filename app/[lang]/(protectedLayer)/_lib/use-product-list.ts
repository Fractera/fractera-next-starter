"use client"

// Состояние списка: страница, шаг, поиск, загрузка. Вынесено из компонента,
// потому что компонент отвечает за ВИД, а это — поведение, и оно живёт своей
// жизнью: страница сбрасывается при поиске, шаг переживает перезагрузку,
// удаление последней строки на странице обязано увести на предыдущую.
//
// Побочная польза от выноса: поведение читается целиком, не перемежаясь
// разметкой, и переиспользуется следующим списком защищённого слоя без
// копирования его вида.

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "@/lib/products/types"

// Выбранный шаг — предпочтение ЧЕЛОВЕКА, а не свойство каталога: живёт в
// браузере, переживает перезагрузку и не попадает в базу проекта.
export const SIZE_KEY = "fractera-products-per-page"
export const PAGE_SIZES = [10, 20, 50, 100]

type LoadOpts = { page?: number; perPage?: number; q?: string }

export function useProductList(failedLabel: string) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)
  // Что НАБРАНО в поле и что ПРИМЕНЕНО к выборке — разные вещи, иначе таблица
  // дёргалась бы, пока человек печатает.
  const [query, setQuery] = useState("")
  const [applied, setApplied] = useState("")

  useEffect(() => {
    const saved = Number(localStorage.getItem(SIZE_KEY))
    if (PAGE_SIZES.includes(saved)) setPerPage(saved)
  }, [])

  const load = useCallback(async (opts?: LoadOpts) => {
    const p = opts?.page ?? page
    const size = opts?.perPage ?? perPage
    const q = opts?.q ?? applied
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(size) })
      if (q) params.set("q", q)
      const res = await fetch(projectApi(`/products?${params}`))
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setProducts(data.products ?? [])
      setPage(data.page ?? 1)
      setPages(data.pages ?? 1)
      setTotal(data.total ?? 0)
      setRevealed(true)
    } catch {
      toast.error(failedLabel)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, applied, failedLabel])

  const search = useCallback(() => {
    setApplied(query)
    void load({ page: 1, q: query })
  }, [query, load])

  // Сброс — отдельное действие, а не «поиск по пустой строке»: стереть текст и
  // нажать «Найти» человек не догадывается, и остаётся запертым в выборке.
  const resetSearch = useCallback(() => {
    setQuery("")
    setApplied("")
    void load({ page: 1, q: "" })
  }, [load])

  const changeSize = useCallback((next: number) => {
    setPerPage(next)
    localStorage.setItem(SIZE_KEY, String(next))
    if (revealed) void load({ page: 1, perPage: next })
  }, [revealed, load])

  return {
    revealed, loading, products, page, pages, total, perPage,
    query, setQuery, applied,
    load, search, resetSearch, changeSize,
  }
}
