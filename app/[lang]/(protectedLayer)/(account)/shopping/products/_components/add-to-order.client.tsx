"use client"

// Действие строки для слоя покупателя: количество и кнопка «в заказ».
//
// 🔒 КОЛИЧЕСТВО ЖИВЁТ В СТРОКЕ, А НЕ В КОРЗИНЕ. Человек набирает «три» ещё до
// того, как решил класть, и решение может не состояться — до подтверждения в
// корзине не должно появляться ничего. Поэтому число здесь местное, а в корзину
// уходит один раз, вместе с согласием.
//
// 🔒 ПОДТВЕРЖДЕНИЕ — ОКНОМ, А НЕ БРАУЗЕРНЫМ `confirm`. Тут показывается название
// товара и количество: человек должен увидеть, с чем соглашается, а системное
// окно не умеет ни переносов, ни выделения имени.

import { useState } from "react"
import { toast } from "sonner"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { addToCart } from "@/components/cart/cart-store"
import type { CartUi } from "@/components/cart/cart.i18n"
import type { LocalizedProduct } from "@/lib/products/localize"

export function AddToOrder({ product, labels }: { product: LocalizedProduct; labels: CartUi }) {
  const [qty, setQty] = useState(1)
  const [asking, setAsking] = useState(false)

  function confirm() {
    addToCart({ id: product.id, name: product.localizedName, price: product.price }, qty)
    setAsking(false)
    setQty(1)
    toast.success(labels.added)
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        aria-label={labels.decrease}
        disabled={qty <= 1}
        onClick={() => setQty(q => Math.max(1, q - 1))}
      >
        <Minus />
      </Button>
      <span className="w-5 text-center text-sm tabular-nums text-foreground">{qty}</span>
      <Button variant="ghost" size="sm" aria-label={labels.increase} onClick={() => setQty(q => q + 1)}>
        <Plus />
      </Button>
      <Button variant="ghost" size="sm" aria-label={labels.addToCart} title={labels.addToCart} onClick={() => setAsking(true)}>
        <ShoppingCart />
      </Button>

      <Dialog open={asking} onOpenChange={setAsking}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              {labels.confirmAdd.replace("{name}", product.localizedName)}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              {labels.quantity}: {qty}. {labels.confirmAddNote}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAsking(false)}>{labels.cancel}</Button>
            <Button size="sm" onClick={confirm}>{labels.yes}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
