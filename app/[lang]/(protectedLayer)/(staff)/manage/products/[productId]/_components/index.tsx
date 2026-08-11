import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { prerenderSlugs } from "@/lib/catalogue"
import { platformErrors, OPENAI_BILLING_URL } from "@/lib/i18n/platform-errors"
import { translationsUi } from "@/components/i18n/translations-dialog.i18n"
import { productListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import { productsUi } from "../../_data/ui.i18n"
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
// 🔒 СТАТИКА И ЗДЕСЬ — ради этого слой и разводили. Каркас карточки (крошки,
// заголовок, рамка) не зависит ни от данных, ни от того, кто смотрит, поэтому
// он предрендерится; данные приезжают в островок после гидратации. Динамический
// МАРШРУТ не делает страницу динамической — это и есть закон «статический
// каркас + динамический контейнер», доказанный таблицей маршрутов сборки.
//
// Товар вне среза родится при первом обращении и дальше будет отдаваться
// статикой (ISR,  по умолчанию ).
export async function generateStaticParams() {
  return (await prerenderSlugs()).map(productId => ({ productId }))
}

export default function ProductEntry({ lang, productId }: { lang: string; productId: string }) {
  const t = productsUi(lang)
  // Общие слова списка — один словарь на все четыре слоя.
  const common = productListUi(lang)
  // 82 языка резолвятся ЗДЕСЬ, на сервере: в браузер уезжают только строки
  // текущего языка (/code/CLAUDE.md §4д).
  const errors = platformErrors(lang)
  const dialogUi = translationsUi(lang)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Breadcrumbs
          lang={lang}
          trail={[
            { label: t.title, href: `/${lang}/manage/products` },
            { label: productId.slice(0, 8) },
          ]}
        />

        <h1 className="mt-4 text-xl font-semibold text-foreground">{t.one}</h1>

        <div className="mt-5">
          <ProductCard
            productId={productId}
            lang={lang}
            errors={errors}
            dialogUi={dialogUi}
            billingUrl={OPENAI_BILLING_URL}
            labels={{
              name: t.name, price: t.price, colId: common.colId,
              notFoundTitle: t.notFoundTitle, notFoundBody: t.notFoundBody,
              failed: common.failed, back: t.back,
              edit: t.edit, saveField: t.saveField, cancelEdit: t.cancelEdit,
              fieldSaved: t.fieldSaved, descriptionField: t.descriptionField,
              translations: t.translations,
            }}
            backHref={`/${lang}/manage/products`}
          />
        </div>
      </div>
    </main>
  )
}
