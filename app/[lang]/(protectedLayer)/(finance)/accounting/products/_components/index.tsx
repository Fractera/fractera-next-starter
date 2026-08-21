import { getAppConfig } from "@/config/app-config"
import { accountingProductsUi } from "../_data/ui.i18n"
import { priceTableUi } from "../_widgets/price-table/ui.i18n"
import { PriceTable } from "../_widgets/price-table/index.client"
import { PageHeader } from "@/components/content-page/page-header.server"

// Вход страницы цен — СЕРВЕРНЫЙ компонент, и всё, что он рисует, статический
// каркас: крошки, заголовок, объяснение. Ни одного запроса к базе, поэтому
// страница предрендерена на каждый язык и открывается мгновенно.
//
// Защищённая страница — это статическая страница с динамическими дырами, а не
// динамическая страница. Дыру открывает ВИДЖЕТ ниже, по кнопке.
//
// 🔒 ЗДЕСЬ ОСТАЛСЯ ТОЛЬКО КАРКАС СТРАНИЦЫ (шаг 521). Всё, что относится к самой
// таблице — её поведение, скелетон, управление, подвал, строка и слова, — уехало
// в `_widgets/price-table/`. Граница простая: страница отвечает за место и
// заголовок, виджет — за то, что внутри.
//
// Слова резолвятся ЗДЕСЬ и уезжают в островок пропсами: клиентский компонент,
// импортирующий словарь, увёз бы в браузер все его языки.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = accountingProductsUi(lang)
  const ui = priceTableUi(lang)
  const currency = getAppConfig().commerce.currency

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />

        <PriceTable
          lang={lang}
          currency={currency}
          ui={ui}
          labels={{
            priceOnly: t.priceOnly,
            save: t.save, cancel: t.cancel, saved: t.saved, invalidPrice: t.invalidPrice,
          }}
        />
      </div>
    </main>
  )
}
