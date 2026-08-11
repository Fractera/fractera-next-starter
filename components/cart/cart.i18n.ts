// Слова корзины заказа.
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`, сейчас
// `en,ru`). Корзина — ВОЗМОЖНОСТЬ ЭТОГО приложения, а не часть платформы: сайт
// услуг, портфолио или блог, собранные из того же стартера, её просто удалят.
// Готовить ей 82 языка впрок значит платить за перевод того, чего у соседнего
// проекта нет вовсе.
//
// Иначе устроены заголовки слоёв прав в ящике аккаунта: они есть в КАЖДОМ
// проекте на этом стартере, поэтому написаны на всех 82 (правило 4д).

export type CartUi = {
  /** Значок в шапке. */
  open: string
  title: string
  empty: string
  /** Строка подтверждения: `{name}`. */
  confirmAdd: string
  confirmAddNote: string
  yes: string
  cancel: string
  added: string
  /** Кнопка в строке таблицы. */
  addToCart: string
  increase: string
  decrease: string
  remove: string
  quantity: string
  total: string
  checkout: string
  reset: string
  resetConfirm: string
  /** Тост оформления — заголовок и мелкая подпись. */
  checkoutToast: string
  checkoutNote: string
  toAdminPanel: string
}

const UI: Record<string, CartUi> = {
  en: {
    open: "Order cart",
    title: "Your order",
    empty: "The cart is empty. Add a product from the catalogue.",
    confirmAdd: "Add {name} to the order?",
    confirmAddNote: "You can change the quantity or remove it in the cart at any time.",
    yes: "Add",
    cancel: "Cancel",
    added: "Added to the order",
    addToCart: "Add to order",
    increase: "One more",
    decrease: "One fewer",
    remove: "Remove from order",
    quantity: "Quantity",
    total: "Total",
    checkout: "Place the order",
    reset: "Clear the order",
    resetConfirm: "Remove everything from the order?",
    checkoutToast: "Next you would go to checkout",
    checkoutNote: "Not implemented in this demo. Take the project to your own machine and build the checkout you need with AI.",
    toAdminPanel: "Open the control panel",
  },
  ru: {
    open: "Корзина заказа",
    title: "Ваш заказ",
    empty: "Корзина пуста. Добавьте товар из каталога.",
    confirmAdd: "Добавить «{name}» в заказ?",
    confirmAddNote: "Количество можно изменить, а товар убрать — в корзине, в любой момент.",
    yes: "Добавить",
    cancel: "Отмена",
    added: "Добавлено в заказ",
    addToCart: "В заказ",
    increase: "На один больше",
    decrease: "На один меньше",
    remove: "Убрать из заказа",
    quantity: "Количество",
    total: "Итого",
    checkout: "Оформить заказ",
    reset: "Сбросить весь заказ",
    resetConfirm: "Убрать из заказа всё?",
    checkoutToast: "Далее вы переходите к оформлению заказа",
    checkoutNote: "В демонстрационном режиме это не реализовано. Заберите проект на свою машину и соберите нужное вам оформление с помощью искусственного интеллекта.",
    toAdminPanel: "Перейти в панель управления",
  },
}

export function cartUi(lang: string): CartUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
