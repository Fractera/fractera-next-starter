import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { getAppConfig } from "@/config/app-config"
import { cartUi } from "@/components/cart/cart.i18n"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { shoppingProductsUi } from "../_data/ui.i18n"
import { ProductsPanel } from "./products-panel.client"

// Вход страницы товаров ПОКУПАТЕЛЯ — серверный компонент, статический каркас.
//
// Четвёртый слой той же сущности: `/manage/products` ведёт менеджер,
// `/accounting/products` — бухгалтер, `/administration/products` — администратор,
// `/shopping/products` — сам покупатель. Меняется не сущность, а то, что человек
// с ней делает.
//
// Слова корзины приходят СЮДА и уезжают в островок пропсами: словарь читается на
// сервере, как и везде.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = shoppingProductsUi(lang)
  // Общие слова списка — один словарь на все четыре слоя.
  const common = productListUi(lang)
  const cart = cartUi(lang)
  const currency = getAppConfig().commerce.currency

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Breadcrumbs lang={lang} trail={[{ label: t.title }]} />

        <header className="mb-8 mt-4">
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.subtitle}</p>
        </header>

        <ProductsPanel lang={lang} currency={currency} labels={t} common={common} cart={cart} />
      </div>
    </main>
  )
}
