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
import { useProductList } from "../_lib/use-product-list"
import { ProductForm } from "./product-form.client"
import { ProductTable } from "./product-table.client"
import { ProductTableSkeleton } from "./product-table-skeleton"
import { ProductsToolbar } from "./products-toolbar.client"
import { ProductsPager } from "./products-pager.client"
import { TranslationsDialog, type Drafts } from "@/components/i18n/translations-dialog.client"

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

export function ProductsPanel({ lang, labels }: { lang: string; labels: ProductsLabels }) {
  const list = useProductList(labels.failed)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: "", price: "" })
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
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
      toast.error(labels.failed)
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
      setJustCreated(null)
      await list.load()
      return true
    } catch {
      toast.error(labels.failed)
      return false
    }
  }

  async function remove(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(projectApi(`/products/${id}`), { method: "DELETE" })
      if (!res.ok) throw new Error(String(res.status))
      toast.success(labels.deleted)
      // Перезагружаем выборку, а не вычёркиваем строку: после удаления последней
      // записи на странице её надо покинуть, и это знает сервер.
      await list.load()
    } catch {
      toast.error(labels.failed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section>
      <ProductsToolbar
        labels={labels}
        revealed={list.revealed}
        loading={list.loading}
        adding={adding}
        query={list.query}
        applied={list.applied}
        onQuery={list.setQuery}
        onReveal={() => list.load({ page: 1 })}
        onToggleAdd={() => setAdding(v => !v)}
        onSearch={list.search}
        onReset={list.resetSearch}
      />

      {adding && (
        <ProductForm
          form={form} setForm={setForm} saving={saving}
          onSave={add} onUpload={setUploaded} lang={lang} labels={labels}
        />
      )}

      {!list.revealed ? (
        <>
          <ProductTableSkeleton labels={labels} />
          <p className="mt-2 text-center text-[10px] text-muted-foreground">{labels.revealHint}</p>
        </>
      ) : list.products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
          {list.applied ? labels.nothingFound : labels.empty}
        </div>
      ) : (
        <>
          <ProductTable products={list.products} deleting={deleting} onDelete={remove} lang={lang} labels={labels} />
          <ProductsPager
            labels={labels}
            total={list.total}
            page={list.page}
            pages={list.pages}
            perPage={list.perPage}
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
          onSkip={() => setJustCreated(null)}
          onSave={saveTranslations}
        />
      )}
    </section>
  )
}
