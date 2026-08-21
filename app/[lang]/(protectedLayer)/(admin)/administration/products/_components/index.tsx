import { getAppConfig } from "@/config/app-config"
import { administrationProductsUi } from "../_data/ui.i18n"
import { catalogueTableUi } from "../_widgets/catalogue-table/ui.i18n"
import { CatalogueTable } from "../_widgets/catalogue-table/index.client"
import { PageHeader } from "@/components/content-page/page-header.server"

// Вход страницы товаров АДМИНИСТРИРОВАНИЯ — серверный компонент, статический
// каркас: крошки, заголовок, объяснение единственного права. Ни одного запроса к
// базе, поэтому страница предрендерена на каждый язык.
//
// Форма пути та же, что у соседних слоёв: `<раздел>/products`. Сущность одна,
// различает страницы роль — и это видно в адресе до открытия файлов.
//
// 🔒 ЗДЕСЬ ОСТАЛСЯ ТОЛЬКО КАРКАС СТРАНИЦЫ (шаг 521). Таблица со всей начинкой —
// поведением, скелетоном, управлением, подвалом, строкой и словами — живёт в
// `_widgets/catalogue-table/`. Страница отвечает за место и заголовок, виджет —
// за то, что внутри.
//
// Слова резолвятся ЗДЕСЬ и уезжают в островок пропсами: клиентский компонент,
// импортирующий словарь, увёз бы в браузер все его языки.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = administrationProductsUi(lang)
  const ui = catalogueTableUi(lang)
  const currency = getAppConfig().commerce.currency

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />

        <CatalogueTable
          lang={lang}
          currency={currency}
          ui={ui}
          labels={{ deleteOnly: t.deleteOnly, confirm: t.confirm, deleted: t.deleted }}
        />
      </div>
    </main>
  )
}
