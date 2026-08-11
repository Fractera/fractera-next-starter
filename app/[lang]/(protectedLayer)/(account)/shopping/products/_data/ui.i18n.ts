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
  reveal: string
  revealHint: string
  loading: string
  tableTitle: string
  empty: string
  count: string
  colPhoto: string
  colName: string
  colPrice: string
  colId: string
  /** Полоса над таблицей: что здесь можно, чего нельзя. */
  buyOnly: string
  failed: string
  searchPlaceholder: string
  find: string
  reset: string
  perPage: string
  prev: string
  next: string
  pageOf: string
  first: string
  last: string
}

const UI: Record<string, ShoppingProductsUi> = {
  en: {
    title: "Products",
    subtitle: "The catalogue as a customer sees it: choose a quantity and put it in the order.",
    reveal: "Show products",
    revealHint: "Nothing is requested until you ask — the page opens instantly and costs the database nothing.",
    loading: "Loading…",
    tableTitle: "Catalogue",
    empty: "The catalogue is empty.",
    count: "{count} products",
    colPhoto: "Photo",
    colName: "Product",
    colPrice: "Price",
    colId: "ID",
    buyOnly: "You may add products to your order. Names, prices and the catalogue itself belong to the staff, finance and administration layers — the server refuses any change from this page.",
    failed: "Could not do that. Try again.",
    searchPlaceholder: "Search by name…",
    find: "Find",
    reset: "Reset",
    perPage: "Per page",
    prev: "Back",
    next: "Forward",
    pageOf: "Page {page} of {pages}",
    first: "First",
    last: "Last",
  },
  ru: {
    title: "Товары",
    subtitle: "Каталог глазами покупателя: выберите количество и положите в заказ.",
    reveal: "Показать товары",
    revealHint: "Пока не попросите, ничего не запрашивается — страница открывается мгновенно и не стоит базе ничего.",
    loading: "Загружаю…",
    tableTitle: "Каталог",
    empty: "Каталог пуст.",
    count: "Товаров: {count}",
    colPhoto: "Фото",
    colName: "Товар",
    colPrice: "Цена",
    colId: "Идентификатор",
    buyOnly: "Вам доступно добавление товаров в заказ. Названия, цены и сам каталог принадлежат слоям персонала, финансов и администрирования — серверу этой страницы любое изменение запрещено.",
    failed: "Не получилось. Повторите.",
    searchPlaceholder: "Поиск по названию…",
    find: "Найти",
    reset: "Сбросить",
    perPage: "На странице",
    prev: "Назад",
    next: "Вперёд",
    pageOf: "Страница {page} из {pages}",
    first: "Первая",
    last: "Последняя",
  },
}

export function shoppingProductsUi(lang: string): ShoppingProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
