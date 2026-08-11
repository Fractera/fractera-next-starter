import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { getAppConfig } from "@/config/app-config"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { administrationProductsUi } from "../_data/ui.i18n"
import { ProductsPanel } from "./products-panel.client"

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
