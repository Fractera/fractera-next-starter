import Link from "next/link"
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
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link href={`/${lang}/products`} className="hover:text-foreground">{t.title}</Link>
          <span className="mx-1.5 text-muted-foreground/40">/</span>
          <span className="font-mono">{productId.slice(0, 8)}</span>
        </nav>

        <h1 className="text-xl font-semibold text-foreground">{t.one}</h1>

        <div className="mt-5">
          <ProductCard
            productId={productId}
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
