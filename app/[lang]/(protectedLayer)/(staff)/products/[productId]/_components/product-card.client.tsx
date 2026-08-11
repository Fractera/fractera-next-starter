"use client"

// Динамический контейнер карточки товара.
//
// 🔒 ГДЕ ГРАНИЦА ПРАВИЛА «ЗАКРЫТО ПО УМОЛЧАНИЮ». Кнопки «Показать» здесь нет
// намеренно: человек пришёл ИМЕННО за этим товаром, и второе нажатие было бы
// данью правилу, а не пользой. Правило защищает от дорогих выборок, которых
// никто не просил — списка, отчёта, журнала, — а не от единственного запроса,
// ради которого страницу и открыли. Что правило требует безусловно, то здесь
// соблюдено: каркас готов до данных, а место данных занимает скелетон.
//
// 🔒 ВЁРСТКА ВЗЯТА У СТАТЬИ, А НЕ ЕЁ КОД. Из контентного движка переиспользована
// ФОРМА — крупный заголовок, изображение фигурой с подписью, врезка, аккуратная
// типографика. Сам `StandardContentPage` не подключён сознательно: он несёт
// чёрную маркетинговую тему витрины (`bg-black text-white`) и внутри приложения
// смотрелся бы чужим. Переиспользуют то, что подходит, а не всё, что есть.
//
// Отсутствие товара — законный исход, а не ошибка: собственное состояние и
// дорога назад, вместо выброса в общий 404.

import { useEffect, useState } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "../../_components/types"
import { localizeProduct, type LocalizedProduct } from "../../_lib/localize-product"

type Labels = {
  name: string; price: string; colId: string
  notFoundTitle: string; notFoundBody: string
  failed: string; loading: string; back: string
}

type State =
  | { kind: "loading" }
  | { kind: "found"; product: LocalizedProduct }
  | { kind: "missing" }
  | { kind: "failed" }

export function ProductCard(
  { productId, lang, labels, backHref }:
  { productId: string; lang: string; labels: Labels; backHref: string },
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
        const product = (data.product ?? data) as Product | null
        setState(product?.id
          ? { kind: "found", product: localizeProduct(product, lang) }
          : { kind: "missing" })
      })
      .catch(() => alive && setState({ kind: "failed" }))
    return () => { alive = false }
  }, [productId, lang])

  if (state.kind === "loading") {
    return (
      <div className="space-y-5">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <Skeleton className="h-7 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
      </div>
    )
  }

  if (state.kind !== "found") {
    const failed = state.kind === "failed"
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-base font-medium text-foreground">
          {failed ? labels.failed : labels.notFoundTitle}
        </p>
        {!failed && <p className="mt-1.5 text-sm text-muted-foreground">{labels.notFoundBody}</p>}
        <Link href={backHref} className="mt-6 inline-block text-xs text-muted-foreground underline hover:text-foreground">
          ← {labels.back}
        </Link>
      </div>
    )
  }

  const p = state.product

  return (
    <article>
      {/* Герой — фигурой с подписью, как у статьи. Подпись несёт название на
          языке страницы: изображение без подписи ничего не сообщает читателю
          экранного диктора. */}
      {p.media_url && (
        <figure className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.media_url} alt={p.localizedName} className="mx-auto h-64 w-full object-contain p-6" />
          <figcaption className="border-t border-border px-4 py-2 text-center text-[11px] text-muted-foreground">
            {p.localizedName}
          </figcaption>
        </figure>
      )}

      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-xl">{p.localizedName}</h2>

      <p className="mt-2 text-lg font-medium text-foreground">
        {new Intl.NumberFormat(lang, { style: "decimal", minimumFractionDigits: 2 }).format(p.price)}
      </p>

      {p.localizedDescription && (
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {p.localizedDescription}
        </p>
      )}

      {/* Врезка — тот же приём, что и в статье: короткий факт, который стоит
          заметить, вынесен из потока текста. Здесь это машинные поля строки. */}
      <aside className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
        <dl className="grid gap-2 text-xs sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 text-muted-foreground">{labels.colId}</dt>
            <dd className="truncate font-mono text-foreground">{p.id}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 text-muted-foreground">{labels.price}</dt>
            <dd className="text-foreground">{p.price}</dd>
          </div>
        </dl>
      </aside>

      <Link href={backHref} className="mt-6 inline-block text-xs text-muted-foreground underline hover:text-foreground">
        ← {labels.back}
      </Link>
    </article>
  )
}
