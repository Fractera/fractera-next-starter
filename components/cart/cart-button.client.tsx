"use client"

// Значок корзины в шапке и окно заказа за ним.
//
// 🔒 СТОИТ СЛЕВА ОТ КНОПКИ АККАУНТА И ПОКАЗЫВАЕТСЯ ТОЛЬКО ВОШЕДШЕМУ. Корзина —
// возможность зарегистрированного покупателя; гостю она обещала бы действие,
// которого у него нет.
//
// 🔒 ОКНО ВЫСОТОЙ НЕ БОЛЬШЕ 80% ЭКРАНА. Список заказа растёт, а окно во весь
// экран перестаёт быть окном: пропадает ощущение, что за ним осталась страница,
// и некуда нажать, чтобы выйти. Прокручивается ВНУТРИ окна только список — итог
// и кнопки остаются на виду, иначе за длинным заказом теряется главное число.

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { adminBase } from "@/lib/runtime-urls"
import { getCart, setQty, clearCart, cartTotal, cartCount, subscribeCart, type CartLine } from "./cart-store"
import type { CartUi } from "./cart.i18n"

export function CartButton({ lang, currency, labels }: { lang: string; currency: string; labels: CartUi }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<CartLine[]>([])

  // Корзина живёт в браузере, поэтому читается ПОСЛЕ гидратации: прочитать её на
  // сервере невозможно, а отрисовать пустую и молча заменить — это скачок числа
  // на глазах у человека. Первый кадр честно пустой, дальше — настоящее.
  useEffect(() => {
    const sync = () => setLines(getCart())
    sync()
    return subscribeCart(sync)
  }, [])

  const money = new Intl.NumberFormat(lang, { style: "currency", currency })
  const count = cartCount(lines)

  function openProduct(id: string) {
    // Окно закрывается ДО перехода: оставить его открытым поверх новой страницы
    // значит показать человеку товар, загороженный списком, из которого он ушёл.
    setOpen(false)
    router.push(`/${lang}/products/${id}`)
  }

  function checkout() {
    toast.success(labels.checkoutToast, {
      description: (
        <span className="block text-[11px] leading-relaxed">
          {labels.checkoutNote}{" "}
          <a
            href={adminBase()}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {labels.toAdminPanel}
          </a>
        </span>
      ),
    })
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={labels.open} title={labels.open}>
        <span className="relative inline-flex">
          <ShoppingCart />
          {count > 0 && (
            <span className="absolute -right-2 -top-1.5 min-w-4 rounded-full bg-foreground px-1 text-center text-[10px] font-medium leading-4 text-background">
              {count}
            </span>
          )}
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[80vh] flex-col gap-0 p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle className="text-base">{labels.title}</DialogTitle>
            {lines.length === 0 && <DialogDescription className="text-xs">{labels.empty}</DialogDescription>}
          </DialogHeader>

          {lines.length > 0 && (
            <>
              {/* Прокручивается только список. */}
              <ul className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
                {lines.map(l => (
                  <li key={l.id} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => openProduct(l.id)}
                        className="block truncate text-left text-sm font-medium text-foreground hover:underline"
                      >
                        {l.name}
                      </button>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {money.format(l.price)} × {l.qty} = {money.format(l.price * l.qty)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="sm" aria-label={labels.decrease} onClick={() => setQty(l.id, l.qty - 1)}>
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums text-foreground">{l.qty}</span>
                      <Button variant="ghost" size="sm" aria-label={labels.increase} onClick={() => setQty(l.id, l.qty + 1)}>
                        <Plus />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={labels.remove} onClick={() => setQty(l.id, 0)}>
                        <X />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Итог и действия — вне прокрутки: за длинным заказом теряется
                  главное число, а оно и есть причина открыть корзину. */}
              <div className="border-t border-border px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{labels.total}</span>
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    {money.format(cartTotal(lines))}
                  </span>
                </div>

                <Button className="mt-3 w-full" onClick={checkout}>{labels.checkout}</Button>

                <Separator className="my-3" />

                <button
                  type="button"
                  onClick={() => { if (confirm(labels.resetConfirm)) clearCart() }}
                  className="w-full text-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  {labels.reset}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
