"use client"

// Динамический контейнер карточки. Один товар — одна строка в базе, поэтому
// прятать его за кнопкой «Показать» бессмысленно: человек пришёл ИМЕННО за ним,
// и второе нажатие было бы данью правилу, а не пользой.
//
// 🔒 ГДЕ ГРАНИЦА ПРАВИЛА. «Закрыт по умолчанию» защищает от дорогих выборок,
// которых никто не просил: список, отчёт, журнал. Запрос, ради которого страницу
// и открыли, к ним не относится. Правило требует, чтобы КАРКАС был готов до
// данных, — он готов; и чтобы место данных занимал скелетон — он занимает.
//
// Отсутствие товара — не ошибка страницы, а её законный исход, поэтому здесь
// собственное состояние «нет такого», а не выброс в общий 404: человек остаётся
// в разделе и получает дорогу обратно.

import { useEffect, useState } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "../../_components/types"

type Labels = {
  name: string; price: string; colId: string
  notFoundTitle: string; notFoundBody: string
  failed: string; loading: string; back: string
}

type State = { kind: "loading" } | { kind: "found"; product: Product } | { kind: "missing" } | { kind: "failed" }

export function ProductCard(
  { productId, labels, backHref }: { productId: string; labels: Labels; backHref: string },
) {
  const [state, setState] = useState<State>({ kind: "loading" })

  useEffect(() => {
    let alive = true
    fetch(projectApi(`/products/${productId}`))
      .then(async res => {
        if (!alive) return
        if (res.status === 404) return setState({ kind: "missing" })
        if (!res.ok) return setState({ kind: "failed" })
        const data = await res.json()
        const product = data.product ?? data
        setState(product?.id ? { kind: "found", product } : { kind: "missing" })
      })
      .catch(() => alive && setState({ kind: "failed" }))
    return () => { alive = false }
  }, [productId])

  if (state.kind === "loading") {
    return (
      <div className="space-y-3 rounded-xl border border-border p-4">
        <Skeleton className="h-24 w-24 rounded" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-20" />
      </div>
    )
  }

  if (state.kind !== "found") {
    const failed = state.kind === "failed"
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
        <p className="text-sm text-foreground">{failed ? labels.failed : labels.notFoundTitle}</p>
        {!failed && <p className="mt-1 text-xs text-muted-foreground">{labels.notFoundBody}</p>}
        <Link href={backHref} className="mt-4 inline-block text-xs text-muted-foreground underline hover:text-foreground">
          ← {labels.back}
        </Link>
      </div>
    )
  }

  const p = state.product
  return (
    <div className="rounded-xl border border-border p-4">
      {p.media_url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={p.media_url} alt={p.name} className="mb-4 h-24 w-24 rounded object-cover" />
      )}
      <dl className="space-y-2 text-xs">
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-muted-foreground">{labels.name}</dt>
          <dd className="text-foreground">{p.name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-muted-foreground">{labels.price}</dt>
          <dd className="text-foreground">{p.price}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-20 shrink-0 text-muted-foreground">{labels.colId}</dt>
          <dd className="font-mono text-muted-foreground">{p.id}</dd>
        </div>
      </dl>
      <Link href={backHref} className="mt-5 inline-block text-xs text-muted-foreground underline hover:text-foreground">
        ← {labels.back}
      </Link>
    </div>
  )
}
