"use client"

// Состояние карточки: загрузка товара и сохранение отдельных полей.
//
// Вынесено из компонента по той же причине, что и состояние списка: компонент
// отвечает за вид, а это — поведение. Здесь же живёт единственное место, где
// решается, ЧТО отправить на сервер при правке базового значения и при правке
// перевода: два разных запроса к одному маршруту, и путать их нельзя.

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "../../_components/types"
import { localizeProduct, type LocalizedProduct } from "../../_lib/localize-product"

export type ProductState =
  | { kind: "loading" }
  | { kind: "found"; product: LocalizedProduct; raw: Product }
  | { kind: "missing" }
  | { kind: "failed" }

export function useProduct(productId: string, lang: string, labels: { savedLabel: string; failedLabel: string }) {
  const [state, setState] = useState<ProductState>({ kind: "loading" })

  const load = useCallback(async () => {
    try {
      const res = await fetch(projectApi(`/products/${productId}`))
      if (res.status === 404) return setState({ kind: "missing" })
      if (!res.ok) return setState({ kind: "failed" })
      const data = await res.json()
      const product = (data.product ?? data) as Product | null
      setState(product?.id
        ? { kind: "found", product: localizeProduct(product, lang), raw: product }
        : { kind: "missing" })
    } catch {
      setState({ kind: "failed" })
    }
  }, [productId, lang])

  useEffect(() => { void load() }, [load])

  // Отправляем ТОЛЬКО изменённое поле. Отправка объекта целиком затирала бы
  // чужую правку, сделанную секундой раньше в соседней вкладке.
  const patch = useCallback(async (body: Record<string, unknown>): Promise<boolean> => {
    try {
      const res = await fetch(projectApi(`/products/${productId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(String(data?.error ?? labels.failedLabel))
        return false
      }
      toast.success(labels.savedLabel)
      await load()
      return true
    } catch {
      toast.error(labels.failedLabel)
      return false
    }
  }, [productId, load, labels.savedLabel, labels.failedLabel])

  /** Базовое значение поля — своя колонка в строке. */
  const saveBase = useCallback(
    (field: "name" | "price" | "description", value: string) =>
      patch({ [field]: field === "price" ? Number(value) : value }),
    [patch],
  )

  /** Перевод поля — ключ внутри колонки `i18n`; другие языки не трогаются. */
  const saveTranslation = useCallback(
    (field: "name" | "description", value: string) => patch({ i18n: { field, lang, value } }),
    [patch, lang],
  )

  return { state, saveBase, saveTranslation }
}
