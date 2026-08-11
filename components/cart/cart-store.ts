"use client"

// КОРЗИНА ЗАКАЗА — состояние в браузере покупателя.
//
// 🔒 ПОЧЕМУ БРАУЗЕР, А НЕ БАЗА. Корзина до оформления — это намерение, а не
// факт: человек кладёт, передумывает, уходит и возвращается. Держать намерение в
// базе значит писать туда на каждое нажатие и хранить брошенные корзины вечно.
// Оформленный заказ — другое дело, он станет строкой в базе, когда оформление
// появится (сейчас его нет: демонстрационный режим).
//
// 🔒 ЦЕНА И НАЗВАНИЕ СОХРАНЯЮТСЯ СНИМКОМ. Иначе окно корзины пришлось бы на
// каждое открытие спрашивать базу о каждом товаре — ради строки, которую человек
// уже видел. Расплата честная и названа здесь: если товар подорожал, пока лежал
// в корзине, в корзине останется старая цена до её пересоздания. Для оформления
// это неприемлемо — и оформление обязано пересчитать всё по базе, когда появится.
//
// 🔒 СОБЫТИЕ, А НЕ ГЛОБАЛЬНОЕ СОСТОЯНИЕ. Корзину меняет страница товаров, а
// показывает значок в шапке — это разные ветви дерева. Хранилище браузера само по
// себе о правках не сообщает (событие `storage` приходит только в ДРУГИЕ вкладки),
// поэтому свои изменения мы объявляем сами, а чужие слушаем через `storage`.

export type CartLine = {
  id: string
  name: string
  price: number
  qty: number
}

const KEY = "fractera-cart"
const EVENT = "fractera-cart-changed"

function read(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as CartLine[]) : []
  } catch {
    // Испорченное значение (чужая вкладка, ручная правка) — не повод падать
    // страницей: пустая корзина честнее белого экрана.
    return []
  }
}

function write(lines: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines))
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function getCart(): CartLine[] {
  return read()
}

/** Добавить товар. Если он уже в корзине — количество складывается. */
export function addToCart(line: Omit<CartLine, "qty">, qty: number) {
  const n = Math.max(1, Math.floor(qty))
  const lines = read()
  const found = lines.find(l => l.id === line.id)
  if (found) found.qty += n
  else lines.push({ ...line, qty: n })
  write(lines)
}

/** Задать количество. Ноль и меньше — строка уходит из корзины. */
export function setQty(id: string, qty: number) {
  const n = Math.floor(qty)
  const lines = read().flatMap(l => (l.id !== id ? [l] : n > 0 ? [{ ...l, qty: n }] : []))
  write(lines)
}

export function clearCart() {
  write([])
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0)
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0)
}

/** Подписка на изменения — свои (событие) и из соседних вкладок (`storage`). */
export function subscribeCart(onChange: () => void): () => void {
  const mine = () => onChange()
  const other = (e: StorageEvent) => { if (e.key === KEY) onChange() }
  window.addEventListener(EVENT, mine)
  window.addEventListener("storage", other)
  return () => {
    window.removeEventListener(EVENT, mine)
    window.removeEventListener("storage", other)
  }
}
