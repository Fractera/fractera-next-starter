"use client"

// Динамический контейнер карточки товара — и место, где товар правят.
//
// 🔒 ГДЕ ГРАНИЦА ПРАВИЛА «ЗАКРЫТО ПО УМОЛЧАНИЮ». Кнопки «Показать» здесь нет
// намеренно: человек пришёл ИМЕННО за этим товаром. Правило защищает от дорогих
// выборок, которых никто не просил, а не от единственного запроса, ради
// которого страницу открыли. Что правило требует безусловно — каркас готов до
// данных, место данных занимает скелетон — соблюдено.
//
// 🔒 ВЁРСТКА ВЗЯТА У СТАТЬИ, А НЕ ЕЁ КОД. Переиспользована ФОРМА: изображение
// фигурой с подписью, крупный заголовок, врезка. Сам `StandardContentPage` не
// подключён — он несёт чёрную тему витрины и внутри приложения смотрелся бы
// чужим. Переиспользуют то, что подходит, а не всё, что есть.
//
// ПРАВКА — НА МЕСТЕ И ПО ОДНОМУ ПОЛЮ. Базовое значение и перевод разведены
// намеренно: правка русского названия не должна трогать английское, и человек
// должен видеть, какое из двух он меняет.

import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useProduct } from "../_lib/use-product"
import { EditableField } from "./editable-field.client"

export type CardLabels = {
  name: string; price: string; colId: string
  notFoundTitle: string; notFoundBody: string
  failed: string; back: string
  edit: string; saveField: string; cancelEdit: string; fieldSaved: string
  baseValue: string; translation: string; descriptionField: string
}

export function ProductCard(
  { productId, lang, labels, backHref }:
  { productId: string; lang: string; labels: CardLabels; backHref: string },
) {
  const { state, saveBase, saveTranslation } = useProduct(productId, lang, {
    savedLabel: labels.fieldSaved,
    failedLabel: labels.failed,
  })
  const editLabels = {
    edit: labels.edit, save: labels.saveField,
    cancel: labels.cancelEdit, saved: labels.fieldSaved, failed: labels.failed,
  }

  if (state.kind === "loading") {
    return (
      <div className="space-y-5">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
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
  const raw = state.raw
  // Английский — базовый язык строки: на нём правится колонка, а не ключ внутри
  // переводов. Иначе английское название легло бы в i18n.en и разошлось бы с
  // тем, что лежит в самой колонке.
  const isBase = lang === "en"

  return (
    <article>
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
      <p className="mt-1 text-lg font-medium text-foreground">
        {new Intl.NumberFormat(lang, { style: "decimal", minimumFractionDigits: 2 }).format(p.price)}
      </p>

      <div className="mt-6 space-y-5 rounded-xl border border-border p-4">
        <EditableField
          label={`${labels.name} · ${labels.baseValue}`}
          value={raw.name}
          labels={editLabels}
          onSave={v => saveBase("name", v)}
        />
        {!isBase && (
          <EditableField
            label={`${labels.name} · ${labels.translation}`}
            value={p.localizedName === raw.name ? "" : p.localizedName}
            labels={editLabels}
            onSave={v => saveTranslation("name", v)}
          />
        )}
        <EditableField
          label={labels.price}
          value={String(raw.price)}
          numeric
          labels={editLabels}
          onSave={v => saveBase("price", v)}
        />
        <EditableField
          label={`${labels.descriptionField} · ${labels.baseValue}`}
          value={raw.description ?? ""}
          multiline
          labels={editLabels}
          onSave={v => saveBase("description", v)}
        />
        {!isBase && (
          <EditableField
            label={`${labels.descriptionField} · ${labels.translation}`}
            value={p.localizedDescription === raw.description ? "" : (p.localizedDescription ?? "")}
            multiline
            labels={editLabels}
            onSave={v => saveTranslation("description", v)}
          />
        )}
        <div className="flex gap-2 border-t border-border pt-3 text-xs">
          <span className="w-16 shrink-0 text-muted-foreground">{labels.colId}</span>
          <span className="truncate font-mono text-muted-foreground">{p.id}</span>
        </div>
      </div>

      <Link href={backHref} className="mt-6 inline-block text-xs text-muted-foreground underline hover:text-foreground">
        ← {labels.back}
      </Link>
    </article>
  )
}
