"use client"

// Динамический контейнер каталога — образец для каждой защищённой страницы со
// списком.
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ. Ничего не запрашивается при открытии страницы:
// посетитель видит скелетон настоящей таблицы и кнопку, которая говорит, что
// сделает нажатие. Страница адресуема мгновенно и не стоит базе ничего, пока
// строки никому не понадобились.
//
// 🔒 ЭТОТ ФАЙЛ ТОЛЬКО СОБИРАЕТ. Поведение списка живёт в `_lib/use-product-list`,
// панель управления и подвал — свои компоненты. Так каждая часть остаётся
// читаемой целиком, и ни одна не упирается в предел в 200 строк, за которым
// файл перестают читать и начинают править вслепую.

import { useState } from "react"
import { toast } from "sonner"
import type { UploadedFile } from "@/services/upload/upload.service"
import { projectApi } from "@/lib/architecture/project-api"
import { useProductList } from "@/app/[lang]/(protectedLayer)/_lib/use-product-list"
import { ProductForm } from "@/app/[lang]/(protectedLayer)/_components/products/product-form.client"
import { ProductTable } from "@/app/[lang]/(protectedLayer)/_components/products/product-table.client"
import { ProductTableSkeleton } from "@/app/[lang]/(protectedLayer)/_components/products/product-table-skeleton"
import { ProductsToolbar } from "@/app/[lang]/(protectedLayer)/_components/products/products-toolbar.client"
import { ProductsPager } from "@/app/[lang]/(protectedLayer)/_components/products/products-pager.client"
import { TranslationsDialog, type Drafts } from "@/components/i18n/translations-dialog.client"
import type { PlatformErrors } from "@/lib/i18n/platform-errors"
import type { TranslationsUi } from "@/components/i18n/translations-dialog.i18n"

export type ProductsLabels = {
  reveal: string; revealHint: string; loading: string
  tableTitle: string; empty: string; count: string
  add: string; cancelAdd: string; newProduct: string
  name: string; price: string; uploadPhoto: string; save: string
  colPhoto: string; colName: string; colPrice: string; colId: string
  created: string; deleted: string; failed: string
  searchPlaceholder: string; find: string; reset: string; nothingFound: string
  perPage: string; prev: string; next: string; pageOf: string
  first: string; last: string
  descriptionField: string
}

export function ProductsPanel(
  { lang, currency, labels, errors, dialogUi, billingUrl }:
  { lang: string; currency: string; labels: ProductsLabels; errors: PlatformErrors; dialogUi: TranslationsUi; billingUrl: string },
) {
  const list = useProductList(common.failed)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: "", price: "" })
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)
  // Созданная запись, ждущая переводов. Диалог открывается ПОСЛЕ создания, а не
  // вместо него: продукт уже существует, и закрытие диалога ничего не теряет.
  const [justCreated, setJustCreated] = useState<{ id: string; name: string } | null>(null)

  async function add() {
    if (!form.name.trim() || !form.price) return
    setSaving(true)
    try {
      const res = await fetch(projectApi("/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
          media_id: uploaded?.id ?? null,
          media_url: uploaded?.url ?? null,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json().catch(() => ({}))
      toast.success(labels.created)
      const created = data?.product
      if (created?.id) setJustCreated({ id: created.id, name: created.name })
      setForm({ name: "", price: "" })
      setUploaded(null)
      setAdding(false)
      await list.load({ page: 1 })
    } catch {
      toast.error(common.failed)
    } finally {
      setSaving(false)
    }
  }

  // Переводы новой записи ложатся тем же PATCH, что и правка с карточки: один
  // способ записи на весь проект, а не второй ради формы создания.
  async function saveTranslations(drafts: Drafts): Promise<boolean> {
    if (!justCreated) return false
    try {
      for (const [lng, values] of Object.entries(drafts)) {
        for (const [field, value] of Object.entries(values)) {
          if (!value.trim()) continue
          await fetch(projectApi(`/products/${justCreated.id}`), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ i18n: { field, lang: lng, value } }),
          })
        }
      }
      // 🔒 ОКНО НЕ ЗАКРЫВАЕТСЯ САМО. Сколько языков сохранить и когда уйти —
      // решает человек: он может добавить один перевод, посмотреть, добавить
      // второй. Закрытие после первого сохранения обрывало работу на середине.
      await list.load()
      return true
    } catch {
      toast.error(common.failed)
      return false
    }
  }


  return (
    <section>
      <ProductsToolbar
        labels={labels}
        revealed={liscommon.revealed}
        loading={liscommon.loading}
        adding={adding}
        query={list.query}
        applied={list.applied}
        onQuery={list.setQuery}
        onReveal={() => list.load({ page: 1 })}
        onToggleAdd={() => setAdding(v => !v)}
        onSearch={list.search}
        onReset={liscommon.resetSearch}
      />

      {adding && (
        <ProductForm
          form={form} setForm={setForm} saving={saving}
          onSave={add} onUpload={setUploaded} lang={lang} labels={labels}
        />
      )}

      {!liscommon.revealed ? (
        <>
          <ProductTableSkeleton labels={labels} />
          <p className="mt-2 text-center text-[10px] text-muted-foreground">{common.revealHint}</p>
        </>
      ) : list.products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
          {list.applied ? labels.nothingFound : common.empty}
        </div>
      ) : (
        <>
          {/* Удаления здесь НЕТ и не будет: с 2026-08-11 это право слоя
              администрирования. Таблица общая, и «нет обработчика» означает «нет
              колонки» — способность и её признак в интерфейсе неразделимы. */}
          <ProductTable
            products={list.products}
            lang={lang}
            currency={currency}
            labels={labels}
            hrefFor={(id) => `/${lang}/manage/products/${id}`}
          />
          <ProductsPager
            labels={labels}
            total={list.total}
            page={list.page}
            pages={list.pages}
            perPage={liscommon.perPage}
            onPage={p => list.load({ page: p })}
            onSize={list.changeSize}
          />
        </>
      )}
      {justCreated && (
        <TranslationsDialog
          open
          lang={lang}
          fields={[{ key: "name", label: labels.name, value: justCreated.name }]}
          ui={dialogUi}
          errors={errors}
          billingUrl={billingUrl}
          onSkip={() => setJustCreated(null)}
          onSave={saveTranslations}
        />
      )}
    </section>
  )
}
