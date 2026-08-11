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
  /** Полоса над таблицей: чем это право отличается от соседних. */
  deleteOnly: string
  confirm: string
  deleted: string
}

const UI: Record<string, AdministrationProductsUi> = {
  en: {
    title: "Products",
    subtitle: "The catalogue as the administrator sees it: one action, and it is the irreversible one.",
    deleteOnly: "You may delete a product — and nothing else: the name, price and description are edited by the staff and finance layers, and the server refuses any edit from this page. Deleting has no undo, which is why it is a separate role.",
    confirm: "Delete this product? This cannot be undone.",
    deleted: "Product deleted",
  },
  ru: {
    title: "Товары",
    subtitle: "Каталог глазами администратора: одно действие, и оно необратимое.",
    deleteOnly: "Вам доступно удаление товара — и больше ничего: название, цену и описание правят слои персонала и финансов, а серверу этой страницы правка запрещена. У удаления нет «отменить», поэтому оно и вынесено в отдельную роль.",
    confirm: "Удалить товар? Отменить это будет нельзя.",
    deleted: "Товар удалён",
  },
}

export function administrationProductsUi(lang: string): AdministrationProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
