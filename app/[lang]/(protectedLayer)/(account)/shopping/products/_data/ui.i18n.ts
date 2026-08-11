// Слова страницы товаров ПОКУПАТЕЛЯ.
//
// Четвёртый слой той же сущности; форма пути та же, что у соседей:
// `<раздел>/products`. Различает страницы роль, а не сущность.
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО В ПАНЕЛИ — это строки одной страницы.
// Слова самой корзины лежат отдельно (`components/cart/cart.i18n.ts`): корзина
// показывается ещё и в шапке, то есть у неё двое потребителей, и общий предок им
// не эта папка.

export type ShoppingProductsUi = {
  title: string
  subtitle: string
  /** Полоса над таблицей: что здесь можно, чего нельзя. */
  buyOnly: string
}

const UI: Record<string, ShoppingProductsUi> = {
  en: {
    title: "Products",
    subtitle: "The catalogue as a customer sees it: choose a quantity and put it in the order.",
    buyOnly: "You may add products to your order. Names, prices and the catalogue itself belong to the staff, finance and administration layers — the server refuses any change from this page.",
  },
  ru: {
    title: "Товары",
    subtitle: "Каталог глазами покупателя: выберите количество и положите в заказ.",
    buyOnly: "Вам доступно добавление товаров в заказ. Названия, цены и сам каталог принадлежат слоям персонала, финансов и администрирования — серверу этой страницы любое изменение запрещено.",
  },
}

export function shoppingProductsUi(lang: string): ShoppingProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
