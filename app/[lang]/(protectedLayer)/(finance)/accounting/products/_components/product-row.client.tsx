"use client"

// Строка таблицы цен: имя только на чтение, цена правится на месте.
//
// 🔒 ПРАВКА В СТРОКЕ, А НЕ В КАРТОЧКЕ. Бухгалтер меняет десяток цен подряд —
// переход в карточку и обратно на каждую превращает пять минут работы в двадцать.
// У менеджера всё наоборот: он правит один товар целиком, и карточка там уместна.
// Одна и та же сущность, разные роли, разная форма работы.
//
// 🔒 ОТКАЗ СЕРВЕРА ПОКАЗЫВАЕТСЯ, А НЕ ГЛОТАЕТСЯ. Если маршрут ответит 403 (роль
// потеряна, сессия истекла), человек обязан увидеть это сразу: молча вернувшееся
// старое значение читается как «сохранил», и расхождение с базой обнаружится
// через неделю в отчёте.

import { useState } from "react"
import { toast } from "sonner"
import { Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { projectApi } from "@/lib/architecture/project-api"
import type { LocalizedProduct } from "@/lib/products/localize"

export type ProductRowLabels = {
  save: string; cancel: string
  saved: string; failed: string; invalidPrice: string
}

export function ProductRow(
  { product, lang, currency, labels, onSaved }: {
    product: LocalizedProduct
    lang: string
    currency: string
    labels: ProductRowLabels
    onSaved: (id: string, price: number) => void
  },
) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(product.price))
  const [busy, setBusy] = useState(false)

  const money = new Intl.NumberFormat(lang, { style: "currency", currency })

  async function save() {
    const next = Number(draft.replace(",", "."))
    if (!Number.isFinite(next) || next < 0) {
      toast.error(labels.invalidPrice)
      return
    }
    setBusy(true)
    try {
      const res = await fetch(projectApi(`/products/${product.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Отправляется ТОЛЬКО цена. Не потому, что сервер иначе не справится, —
        // он как раз откажет, — а потому, что запрос обязан говорить правду о
        // намерении: страница цен меняет цену и ничего больше.
        body: JSON.stringify({ price: next }),
      })
      if (!res.ok) throw new Error(String(res.status))
      onSaved(product.id, next)
      setEditing(false)
      toast.success(labels.saved)
    } catch {
      toast.error(labels.failed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-2.5 text-foreground">{product.localizedName}</td>
      <td className="px-4 py-2 w-56">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <Input
              autoFocus
              value={draft}
              inputMode="decimal"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void save()
                if (e.key === "Escape") { setEditing(false); setDraft(String(product.price)) }
              }}
              className="h-7 w-28 text-xs"
            />
            <Button size="sm" variant="ghost" onClick={() => void save()} disabled={busy} aria-label={labels.save}>
              {busy ? <Loader2 className="animate-spin" /> : <Check />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setEditing(false); setDraft(String(product.price)) }}
              disabled={busy}
              aria-label={labels.cancel}
            >
              <X />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded px-2 py-1 text-left text-foreground hover:bg-muted"
          >
            {money.format(product.price)}
          </button>
        )}
      </td>
      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{product.id}</td>
    </tr>
  )
}
