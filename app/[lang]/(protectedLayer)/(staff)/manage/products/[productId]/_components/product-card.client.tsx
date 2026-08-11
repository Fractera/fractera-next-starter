"use client"

// Динамический контейнер карточки товара.
//
// 🔒 КАРТОЧКА ГОВОРИТ НА ЯЗЫКЕ СВОЕЙ СТРАНИЦЫ. Перечня языков здесь нет: на
// `/ru` человек видит русское и правит русское. Пары «базовое / перевод» на
// одной странице заставляли его каждый раз решать, какое из двух полей он сейчас
// меняет, — и это была моя ошибка, а не свойство задачи.
//
// Куда пишется правка: язык страницы базовый (английский) — в саму колонку;
// любой другой — в перевод ЭТОГО языка. Человек правит то, что видит, и не
// ломает чужой язык молча.
//
// Работа с остальными языками — кнопкой «Переводы», тем же диалогом, что и при
// создании. Один инструмент на весь проект, а не второй для карточки.
//
// 🔒 ГДЕ ГРАНИЦА ПРАВИЛА «ЗАКРЫТО ПО УМОЛЧАНИЮ». Кнопки «Показать» нет: человек
// пришёл ИМЕННО за этим товаром. Правило защищает от дорогих выборок, которых
// никто не просил, а не от запроса, ради которого страницу открыли. Что правило
// требует безусловно — каркас готов до данных, место данных занимает скелетон.
//
// Вёрстка взята у статьи (изображение фигурой с подписью, крупный заголовок,
// врезка), но не её код: `StandardContentPage` несёт чёрную тему витрины и
// внутри приложения смотрелся бы чужим.

import { useState } from "react"
import Link from "next/link"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TranslationsDialog, type Drafts } from "@/components/i18n/translations-dialog.client"
import type { PlatformErrors } from "@/lib/i18n/platform-errors"
import type { TranslationsUi } from "@/components/i18n/translations-dialog.i18n"
import { useProduct } from "@/app/[lang]/(protectedLayer)/_lib/use-product"
import { EditableField } from "@/app/[lang]/(protectedLayer)/_components/products/editable-field.client"

export type CardLabels = {
  name: string; price: string; colId: string
  notFoundTitle: string; notFoundBody: string
  failed: string; back: string
  edit: string; saveField: string; cancelEdit: string; fieldSaved: string
  descriptionField: string; translations: string
}

export function ProductCard(
  { productId, lang, labels, errors, dialogUi, billingUrl, backHref }:
  { productId: string; lang: string; labels: CardLabels; errors: PlatformErrors; dialogUi: TranslationsUi; billingUrl: string; backHref: string },
) {
  const { state, saveField, saveDrafts } = useProduct(productId, lang, {
    savedLabel: labels.fieldSaved,
    failedLabel: labels.failed,
  })
  const [translating, setTranslating] = useState(false)
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

  // Окно остаётся открытым после сохранения: человек сам решает, сколько
  // языков заполнить за один заход и когда закрыть.
  const commitTranslations = (drafts: Drafts) => saveDrafts(drafts)

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

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-xl">{p.localizedName}</h2>
          <p className="mt-1 text-lg font-medium text-foreground">
            {new Intl.NumberFormat(lang, { style: "decimal", minimumFractionDigits: 2 }).format(p.price)}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setTranslating(true)}>
          <Languages size={12} />{labels.translations}
        </Button>
      </div>

      <div className="mt-6 space-y-5 rounded-xl border border-border p-4">
        <EditableField
          label={labels.name}
          value={p.localizedName}
          labels={editLabels}
          onSave={v => saveField("name", v)}
        />
        <EditableField
          label={labels.price}
          value={String(p.price)}
          numeric
          labels={editLabels}
          onSave={v => saveField("price", v)}
        />
        <EditableField
          label={labels.descriptionField}
          value={p.localizedDescription ?? ""}
          multiline
          labels={editLabels}
          onSave={v => saveField("description", v)}
        />
        <div className="flex gap-2 border-t border-border pt-3 text-xs">
          <span className="w-16 shrink-0 text-muted-foreground">{labels.colId}</span>
          <span className="truncate font-mono text-muted-foreground">{p.id}</span>
        </div>
      </div>

      <Link href={backHref} className="mt-6 inline-block text-xs text-muted-foreground underline hover:text-foreground">
        ← {labels.back}
      </Link>

      <TranslationsDialog
        open={translating}
        lang={lang}
        fields={[
          { key: "name", label: labels.name, value: p.localizedName },
          { key: "description", label: labels.descriptionField, value: p.localizedDescription ?? "", multiline: true },
        ]}
        ui={dialogUi}
        errors={errors}
        billingUrl={billingUrl}
        onSkip={() => setTranslating(false)}
        onSave={commitTranslations}
      />
    </article>
  )
}
