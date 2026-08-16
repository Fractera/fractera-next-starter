import { getAppConfig } from "@/config/app-config"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { administrationProductsUi } from "../_data/ui.i18n"
import { ProductsPanel } from "./products-panel.client"
import { H1 } from '@/components/ui/typography'
import { PageHeader } from "@/components/content-page/page-header.server"

// Вход страницы товаров АДМИНИСТРИРОВАНИЯ — серверный компонент, статический
// каркас: крошки, заголовок, объяснение единственного права. Ни одного запроса к
// базе, поэтому страница предрендерена на каждый язык.
//
// Форма пути та же, что у соседних слоёв: `<раздел>/products`. Сущность одна,
// различает страницы роль — и это видно в адресе до открытия файлов.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = administrationProductsUi(lang)
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
