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
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import { addToCart } from "@/components/cart/cart-store"
import type { CartUi } from "@/components/cart/cart.i18n"
import type { LocalizedProduct } from "@/lib/products/localize"

export function AddToOrder(
  { product, labels, dialogUi }:
  {
    product: LocalizedProduct
    labels: CartUi
    /** Слова общего окна — резолвятся на сервере (`appDialogUi(lang)`). */
    dialogUi: AppDialogUi
  },
) {
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

      <AppDialog
        open={asking}
        onOpenChange={setAsking}
        ui={dialogUi}
        size="sm"
        title={labels.confirmAdd.replace("{name}", product.localizedName)}
        description={`${labels.quantity}: ${qty}. ${labels.confirmAddNote}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAsking(false)}>{labels.cancel}</Button>
            <Button size="sm" onClick={confirm}>{labels.yes}</Button>
          </>
        }
      /* Тела у окна НЕТ намеренно: вопрос целиком укладывается в заголовок и
         пояснение, а придуманный ради симметрии абзац повторял бы их. */
      />
    </div>
  )
}
