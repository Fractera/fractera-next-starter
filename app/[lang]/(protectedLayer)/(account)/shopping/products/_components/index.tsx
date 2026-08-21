import { getAppConfig } from "@/config/app-config"
import { cartUi } from "@/components/cart/cart.i18n"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { shoppingProductsUi } from "../_data/ui.i18n"
import { shopTableUi } from "../_widgets/shop-table/ui.i18n"
import { ShopTable } from "../_widgets/shop-table/index.client"
import { PageHeader } from "@/components/content-page/page-header.server"

// Вход страницы товаров ПОКУПАТЕЛЯ — серверный компонент, статический каркас.
//
// Четвёртый слой той же сущности: `/manage/products` ведёт менеджер,
// `/accounting/products` — бухгалтер, `/administration/products` — администратор,
// `/shopping/products` — сам покупатель. Меняется не сущность, а то, что человек
// с ней делает.
//
// 🔒 ЗДЕСЬ ОСТАЛСЯ ТОЛЬКО КАРКАС СТРАНИЦЫ (шаг 521). Таблица со всей начинкой —
// поведением, скелетоном, управлением, подвалом, строкой, покупкой и словами —
// живёт в `_widgets/shop-table/`.
//
// Слова корзины и словарь виджета читаются СЮДА, на сервере, и уезжают в островок
// пропсами: клиентский компонент, импортирующий словарь, увёз бы в браузер все
// его языки.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = shoppingProductsUi(lang)
  const ui = shopTableUi(lang)
  const currency = getAppConfig().commerce.currency

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />

        <ShopTable
          lang={lang}
          currency={currency}
          ui={ui}
          labels={{ buyOnly: t.buyOnly }}
          cart={cartUi(lang)}
          dialogUi={appDialogUi(lang)}
        />
      </div>
    </main>
  )
}
