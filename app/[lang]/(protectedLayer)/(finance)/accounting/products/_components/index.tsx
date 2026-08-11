import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { getAppConfig } from "@/config/app-config"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { accountingProductsUi } from "../_data/ui.i18n"
import { ProductsPanel } from "./products-panel.client"

// Вход страницы товаров бухгалтерии — СЕРВЕРНЫЙ компонент, и всё, что он рисует, статический
// каркас: крошки, заголовок, объяснение. Ни одного запроса к базе, поэтому
// страница предрендерена на каждый язык и открывается мгновенно.
//
// Защищённая страница — это статическая страница с динамическими дырами, а не
// динамическая страница. Дыру открывает островок ниже, по кнопке.
//
// Слова резолвятся ЗДЕСЬ и уезжают в островок пропсами: клиентский компонент,
// импортирующий словарь, увёз бы в браузер все его языки.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = accountingProductsUi(lang)
  // Общие слова списка — один словарь на все четыре слоя.
  const common = productListUi(lang)
  const currency = getAppConfig().commerce.currency

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Breadcrumbs lang={lang} trail={[{ label: t.title }]} />

        <header className="mb-8 mt-4">
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.subtitle}</p>
        </header>

        <ProductsPanel lang={lang} currency={currency} labels={t} common={common} />
      </div>
    </main>
  )
}
