import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { getAppConfig } from "@/config/app-config"
import { pricesUi } from "../_data/ui.i18n"
import { PricesPanel } from "./prices-panel.client"

// Вход страницы цен — СЕРВЕРНЫЙ компонент, и всё, что он рисует, статический
// каркас: крошки, заголовок, объяснение. Ни одного запроса к базе, поэтому
// страница предрендерена на каждый язык и открывается мгновенно.
//
// Защищённая страница — это статическая страница с динамическими дырами, а не
// динамическая страница. Дыру открывает островок ниже, по кнопке.
//
// Слова резолвятся ЗДЕСЬ и уезжают в островок пропсами: клиентский компонент,
// импортирующий словарь, увёз бы в браузер все его языки.
export default function PricesEntry({ lang }: { lang: string }) {
  const t = pricesUi(lang)
  const currency = getAppConfig().commerce.currency

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Breadcrumbs lang={lang} trail={[{ label: t.title }]} />

        <header className="mb-8 mt-4">
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.subtitle}</p>
        </header>

        <PricesPanel lang={lang} currency={currency} labels={t} />
      </div>
    </main>
  )
}
