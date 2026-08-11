// Слова страницы цен.
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО В ПАНЕЛИ (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`,
// сейчас `en,ru`). Это строки ОДНОЙ страницы: они рождаются вместе с ней и умрут
// вместе с ней. Не путать с заголовками слоёв прав в ящике аккаунта — те
// переиспользуются в каждом проекте и потому написаны на всех 82 языках.

export type PricesUi = {
  title: string
  subtitle: string
  reveal: string
  revealHint: string
  loading: string
  tableTitle: string
  empty: string
  count: string
  colName: string
  colPrice: string
  colId: string
  /** Подсказка над таблицей: почему правится только цена. */
  priceOnly: string
  saved: string
  failed: string
  invalidPrice: string
  save: string
  cancel: string
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

const UI: Record<string, PricesUi> = {
  en: {
    title: "Prices",
    subtitle: "The same catalogue, priced. Everything else about a product belongs to the staff layer.",
    reveal: "Show prices",
    revealHint: "Nothing is requested until you ask — the page opens instantly and costs the database nothing.",
    loading: "Loading…",
    tableTitle: "Catalogue",
    empty: "The catalogue is empty.",
    count: "{count} products",
    colName: "Product",
    colPrice: "Price",
    colId: "ID",
    priceOnly: "You may change the price. The name, description and photo are edited by the staff layer — the server refuses anything else from this page.",
    saved: "Price updated",
    failed: "Could not save. Try again.",
    invalidPrice: "Price must be a number, zero or greater.",
    save: "Save",
    cancel: "Cancel",
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
    title: "Цены",
    subtitle: "Тот же каталог, вид со стороны денег. Всё остальное о товаре — слой персонала.",
    reveal: "Показать цены",
    revealHint: "Пока не попросите, ничего не запрашивается — страница открывается мгновенно и не стоит базе ничего.",
    loading: "Загружаю…",
    tableTitle: "Каталог",
    empty: "Каталог пуст.",
    count: "Товаров: {count}",
    colName: "Товар",
    colPrice: "Цена",
    colId: "Идентификатор",
    priceOnly: "Вам доступна цена. Название, описание и фотографию правит слой персонала — сервер откажет этой странице в любом другом поле.",
    saved: "Цена изменена",
    failed: "Не удалось сохранить. Повторите.",
    invalidPrice: "Цена — число не меньше нуля.",
    save: "Сохранить",
    cancel: "Отмена",
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

export function pricesUi(lang: string): PricesUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
