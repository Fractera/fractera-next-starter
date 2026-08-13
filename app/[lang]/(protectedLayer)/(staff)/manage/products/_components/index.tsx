import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { platformErrors, OPENAI_BILLING_URL } from "@/lib/i18n/platform-errors"
import { translationsUi } from "@/components/i18n/translations-dialog.i18n"
import { getAppConfig } from "@/config/app-config"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { productsUi } from "../_data/ui.i18n"
import { ProductsPanel } from "./products-panel.client"

// Route entry — SERVER component, and everything it renders is the STATIC SHELL:
// heading, description, the note about where the data lives. None of it needs a
// query, so the page is prerendered per language and addressable instantly.
//
// 🔒 THE ONE DIVISION THIS FILE EXISTS TO SHOW. What you can render without
// asking anybody anything belongs here, in the prerender. What requires the
// database belongs inside the island below, behind a button the visitor presses.
// A protected page is a static page with dynamic holes — never a dynamic page.
//
// The island receives its words as PROPS. A client component that imports the
// dictionary itself would ship all ten languages to every browser.

// Каркас списка тоже статический: строки грузит островок по кнопке.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = productsUi(lang)
  // Общие слова списка — один словарь на все четыре слоя.
  const common = productListUi(lang)
  // 82 языка резолвятся ЗДЕСЬ, на сервере: в браузер уезжают только строки
  // текущего языка (/code/CLAUDE.md §4д).
  const errors = platformErrors(lang)
  const dialogUi = translationsUi(lang)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Breadcrumbs lang={lang} trail={[{ label: t.title }]} />

        <header className="mb-8 mt-4">
          <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.subtitle}</p>
        </header>

        <ProductsPanel
          lang={lang}
          common={common}
          currency={getAppConfig().commerce.currency}
          errors={errors}
          dialogUi={dialogUi}
          billingUrl={OPENAI_BILLING_URL}
          labels={{
            add: t.add, cancelAdd: t.cancelAdd, newProduct: t.newProduct,
            name: t.name, price: t.price, uploadPhoto: t.uploadPhoto, save: t.save,
            created: t.created, deleted: t.deleted, nothingFound: t.nothingFound,
            descriptionField: t.descriptionField,
          }}
        />

        <p className="mt-6 text-center font-mono text-[10px] text-muted-foreground">{t.storageNote}</p>
      </div>
    </main>
  )
}
