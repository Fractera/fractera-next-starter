// Слова страницы товаров БУХГАЛТЕРИИ.
//
// Форма пути повторяет слой персонала: `<раздел>/products`. Сущность одна и та
// же, страницы разные ролью, а не сущностью, — и это должно быть видно в адресе
// прежде, чем откроешь файл: `/manage/products` ведёт менеджер, `/accounting/products`
// ведёт бухгалтер.
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО В ПАНЕЛИ (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`,
// сейчас `en,ru`). Это строки ОДНОЙ страницы: они рождаются вместе с ней и умрут
// вместе с ней. Не путать с заголовками слоёв прав в ящике аккаунта — те
// переиспользуются в каждом проекте и потому написаны на всех 82 языках.

export type AccountingProductsUi = {
  title: string
  subtitle: string
  /** Подсказка над таблицей: почему правится только цена. */
  priceOnly: string
  saved: string
  invalidPrice: string
  save: string
  cancel: string
}

const UI: Record<string, AccountingProductsUi> = {
  en: {
    title: "Products",
    subtitle: "The same catalogue, priced. Everything else about a product belongs to the staff layer.",
    priceOnly: "You may change the price. The name, description and photo are edited by the staff layer — the server refuses anything else from this page.",
    saved: "Price updated",
    invalidPrice: "Price must be a number, zero or greater.",
    save: "Save",
    cancel: "Cancel",
  },
  ru: {
    title: "Товары",
    subtitle: "Тот же каталог, вид со стороны денег. Всё остальное о товаре — слой персонала.",
    priceOnly: "Вам доступна цена. Название, описание и фотографию правит слой персонала — сервер откажет этой странице в любом другом поле.",
    saved: "Цена изменена",
    invalidPrice: "Цена — число не меньше нуля.",
    save: "Сохранить",
    cancel: "Отмена",
  },
}

export function accountingProductsUi(lang: string): AccountingProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
