import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { productsUi } from "../../_data/products.i18n"
import { ProductCard } from "./product-card.client"

// СТАТИЧЕСКИЙ КАРКАС карточки — серверный компонент.
//
// Здесь видно то, ради чего вся конструкция: маршрут динамический
// (`[productId]`), а страница — нет. Хлебные крошки, заголовок раздела и ссылка
// назад не зависят ни от идентификатора, ни от того, кто смотрит, поэтому они
// предрендерятся и появляются мгновенно.
//
// Название самого товара — данные, и оно приезжает в островок. Пока не приехало,
// на его месте скелетон, а не пустота и не «Загрузка…».
export default function ProductEntry({ lang, productId }: { lang: string; productId: string }) {
  const t = productsUi(lang)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Breadcrumbs
          lang={lang}
          trail={[
            { label: t.title, href: `/${lang}/products` },
            { label: productId.slice(0, 8) },
          ]}
        />

        <h1 className="mt-4 text-xl font-semibold text-foreground">{t.one}</h1>

        <div className="mt-5">
          <ProductCard
            productId={productId}
            lang={lang}
            labels={{
              name: t.name, price: t.price, colId: t.colId,
              notFoundTitle: t.notFoundTitle, notFoundBody: t.notFoundBody,
              failed: t.failed, loading: t.loading, back: t.back,
            }}
            backHref={`/${lang}/products`}
          />
        </div>
      </div>
    </main>
  )
}
