"use client"

// The DYNAMIC CONTAINER of this page — and the reference implementation of the
// rule for every protected page that follows.
//
// 🔒 CLOSED BY DEFAULT. Nothing is fetched when the page opens. The visitor sees
// the skeleton of the table — its real frame and column headers — and a button
// that says what pressing it will do. Data arrives only after that press.
//
// Why, in one line: the page is addressable instantly and costs the database
// nothing until somebody actually wants the rows. A page that queries on mount
// pays for every visit, including the ones that opened it by mistake, and its
// first paint is hostage to the slowest service it touches.
//
// The architect may waive this for a single container — but the default is
// closed, and a container that opens itself has to explain why in a comment.
//
// 🔒 NO AUTH CALL HERE. Whether this visitor may be on the page at all is the
// job of `(staff)/layout.tsx` → `AccessGate`, and the job of the API route that
// returns the rows. Asking a third time from here would only add a round trip.

import { useState, useCallback } from "react"
import { Plus, X, Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { UploadedFile } from "@/services/upload/upload.service"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "./types"
import { ProductForm } from "./product-form.client"
import { ProductTable } from "./product-table.client"
import { ProductTableSkeleton } from "./product-table-skeleton"

export type ProductsLabels = {
  reveal: string; revealHint: string; loading: string
  tableTitle: string; empty: string; count: string
  add: string; cancelAdd: string; newProduct: string
  name: string; price: string; uploadPhoto: string; save: string
  colPhoto: string; colName: string; colPrice: string; colId: string
  created: string; deleted: string; failed: string
}

export function ProductsPanel({ labels }: { labels: ProductsLabels }) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: "", price: "" })
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(projectApi("/products"))
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setProducts(data.products ?? [])
      setRevealed(true)
    } catch {
      toast.error(labels.failed)
    } finally {
      setLoading(false)
    }
  }, [labels.failed])

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
      toast.success(labels.created)
      setForm({ name: "", price: "" })
      setUploaded(null)
      setAdding(false)
      await load()
    } catch {
      toast.error(labels.failed)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(projectApi(`/products/${id}`), { method: "DELETE" })
      if (!res.ok) throw new Error(String(res.status))
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success(labels.deleted)
    } catch {
      toast.error(labels.failed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">{labels.tableTitle}</h2>
        {revealed && (
          <Button size="sm" variant="outline" onClick={() => setAdding(v => !v)}>
            {adding ? <X size={12} /> : <Plus size={12} />}
            {adding ? labels.cancelAdd : labels.add}
          </Button>
        )}
      </div>

      {adding && (
        <ProductForm
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={add}
          onUpload={setUploaded}
          labels={labels}
        />
      )}

      {revealed ? (
        products.length > 0 ? (
          <>
            <ProductTable products={products} deleting={deleting} onDelete={remove} labels={labels} />
            <p className="mt-2 text-[10px] text-muted-foreground">
              {labels.count.replace("{count}", String(products.length))}
            </p>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
            {labels.empty}
          </div>
        )
      ) : (
        <>
          {/* Скелетон — не «загрузка», а форма того, что появится. Он статичен и
              виден без JS, поэтому страница не мигает пустотой. */}
          <ProductTableSkeleton labels={labels} />
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <Button size="sm" onClick={load} disabled={loading}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
              {loading ? labels.loading : labels.reveal}
            </Button>
            <p className="text-[10px] text-muted-foreground">{labels.revealHint}</p>
          </div>
        </>
      )}
    </section>
  )
}
