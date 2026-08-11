import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
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

export default function ProductsEntry({ lang }: { lang: string }) {
  const t = productsUi(lang)

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
          labels={{
            reveal: t.reveal, revealHint: t.revealHint, loading: t.loading,
            tableTitle: t.tableTitle, empty: t.empty, count: t.count,
            add: t.add, cancelAdd: t.cancelAdd, newProduct: t.newProduct,
            name: t.name, price: t.price, uploadPhoto: t.uploadPhoto, save: t.save,
            colPhoto: t.colPhoto, colName: t.colName, colPrice: t.colPrice, colId: t.colId,
            created: t.created, deleted: t.deleted, failed: t.failed,
            searchPlaceholder: t.searchPlaceholder, find: t.find, reset: t.reset, nothingFound: t.nothingFound,
            perPage: t.perPage, prev: t.prev, next: t.next, pageOf: t.pageOf,
            first: t.first, last: t.last, descriptionField: t.descriptionField,
          }}
        />

        <p className="mt-6 text-center font-mono text-[10px] text-muted-foreground/50">{t.storageNote}</p>
      </div>
    </main>
  )
}
