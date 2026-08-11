// Слова страницы товаров АДМИНИСТРИРОВАНИЯ.
//
// Форма пути повторяет соседние слои: `<раздел>/products`. Сущность одна и та
// же во всех трёх, страницы различаются РОЛЬЮ: `/manage/products` ведёт
// менеджер, `/accounting/products` — бухгалтер, `/administration/products` —
// администратор.
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО В ПАНЕЛИ (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`,
// сейчас `en,ru`). Это строки одной страницы; заголовки слоёв прав в ящике
// аккаунта — другое дело, они переиспользуются в каждом проекте и написаны на 82.

export type AdministrationProductsUi = {
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
  /** Полоса над таблицей: чем это право отличается от соседних. */
  deleteOnly: string
  confirm: string
  deleted: string
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

const UI: Record<string, AdministrationProductsUi> = {
  en: {
    title: "Products",
    subtitle: "The catalogue as the administrator sees it: one action, and it is the irreversible one.",
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
    deleteOnly: "You may delete a product — and nothing else: the name, price and description are edited by the staff and finance layers, and the server refuses any edit from this page. Deleting has no undo, which is why it is a separate role.",
    confirm: "Delete this product? This cannot be undone.",
    deleted: "Product deleted",
    failed: "Could not delete. Try again.",
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
    subtitle: "Каталог глазами администратора: одно действие, и оно необратимое.",
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
    deleteOnly: "Вам доступно удаление товара — и больше ничего: название, цену и описание правят слои персонала и финансов, а серверу этой страницы правка запрещена. У удаления нет «отменить», поэтому оно и вынесено в отдельную роль.",
    confirm: "Удалить товар? Отменить это будет нельзя.",
    deleted: "Товар удалён",
    failed: "Не удалось удалить. Повторите.",
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

export function administrationProductsUi(lang: string): AdministrationProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
