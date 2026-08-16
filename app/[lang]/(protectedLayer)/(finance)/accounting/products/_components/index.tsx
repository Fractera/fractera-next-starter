import { getAppConfig } from "@/config/app-config"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { accountingProductsUi } from "../_data/ui.i18n"
import { ProductsPanel } from "./products-panel.client"
import { H1 } from '@/components/ui/typography'
import { PageHeader } from "@/components/content-page/page-header.server"

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
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />

        <ProductsPanel lang={lang} currency={currency} labels={t} common={common} />
      </div>
    </main>
  )
}
