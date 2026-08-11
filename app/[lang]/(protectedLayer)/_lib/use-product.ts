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
import type { Product } from "@/lib/products/types"
import { localizeProduct, type LocalizedProduct } from "@/lib/products/localize"

export type ProductState =
  | { kind: "loading" }
  | { kind: "found"; product: LocalizedProduct; raw: Product }
  | { kind: "missing" }
  | { kind: "failed" }

export function useProduct(productId: string, lang: string, labels: { savedLabel: string; failedLabel: string }) {
  // Английский — базовый язык строки: на нём правится колонка, а не ключ внутри
  // переводов. Иначе английское значение легло бы в i18n.en и разошлось бы с
  // тем, что лежит в самой колонке.
  const isBaseLang = lang === "en"
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

  // 🔒 КУДА ЛОЖИТСЯ ПРАВКА. Язык страницы базовый — в саму колонку; любой
  // другой — в перевод ЭТОГО языка. Человек правит то, что видит: на /ru он
  // видит русское название и меняет русское, а не английское молча.
  //
  // Цена — не текст и переводу не подлежит: число одинаково на всех языках.
  const saveField = useCallback(
    (field: "name" | "price" | "description", value: string) => {
      if (field === "price") return patch({ price: Number(value) })
      if (isBaseLang) return patch({ [field]: value })
      return patch({ i18n: { field, lang, value } })
    },
    [patch, isBaseLang, lang],
  )

  /** Пачка переводов из диалога: по ключу на язык, тем же маршрутом. */
  const saveDrafts = useCallback(async (drafts: Record<string, Record<string, string>>) => {
    try {
      for (const [lng, values] of Object.entries(drafts)) {
        for (const [field, value] of Object.entries(values)) {
          if (!value.trim()) continue
          await fetch(projectApi(`/products/${productId}`), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ i18n: { field, lang: lng, value } }),
          })
        }
      }
      toast.success(labels.savedLabel)
      await load()
      return true
    } catch {
      toast.error(labels.failedLabel)
      return false
    }
  }, [productId, load, labels.savedLabel, labels.failedLabel])

  return { state, saveField, saveDrafts }
}
