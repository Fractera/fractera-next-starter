import { prerenderSlugs } from "@/lib/catalogue"
import { platformErrors, OPENAI_BILLING_URL } from "@/lib/i18n/platform-errors"
import { translationsUi } from "@/_tools/translations-dialog/types/translations-dialog.i18n"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { productsUi } from "../../_data/ui.i18n"
import { productCardUi } from "../_widgets/product-card/ui.i18n"
import { ProductCard } from "../_widgets/product-card/index.client"
import { PageHeader } from "@/components/content-page/page-header.server"

// СТАТИЧЕСКИЙ КАРКАС карточки — серверный компонент.
//
// Здесь видно то, ради чего вся конструкция: маршрут динамический
// (`[productId]`), а страница — нет. Хлебные крошки, заголовок раздела и ссылка
// назад не зависят ни от идентификатора, ни от того, кто смотрит, поэтому они
// предрендерятся и появляются мгновенно.
//
// Название самого товара — данные, и оно приезжает в островок. Пока не приехало,
// на его месте скелетон, а не пустота и не «Загрузка…».
//
// 🔒 СТАТИКА И ЗДЕСЬ — ради этого слой и разводили. Каркас карточки (крошки,
// заголовок, рамка) не зависит ни от данных, ни от того, кто смотрит, поэтому
// он предрендерится; данные приезжают в островок после гидратации. Динамический
// МАРШРУТ не делает страницу динамической — это и есть закон «статический
// каркас + динамический контейнер», доказанный таблицей маршрутов сборки.
//
// 🔒 ЗДЕСЬ ОСТАЛСЯ ТОЛЬКО КАРКАС СТРАНИЦЫ (шаг 521). Карточка со своим
// поведением, полем правки на месте и собственными словами живёт в
// `_widgets/product-card/`.
//
// Товар вне среза родится при первом обращении и дальше будет отдаваться
// статикой (ISR, по умолчанию).
export async function generateStaticParams() {
  return (await prerenderSlugs()).map(productId => ({ productId }))
}

export default function ProductEntry({ lang, productId }: { lang: string; productId: string }) {
  const t = productsUi(lang)
  const ui = productCardUi(lang)
  // 82 языка резолвятся ЗДЕСЬ, на сервере: в браузер уезжают только строки
  // текущего языка (/code/CLAUDE.md §4д).
  const errors = platformErrors(lang)

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[
            { label: t.title, href: `/${lang}/manage/products` },
            { label: productId.slice(0, 8) },
          ]}
          title={t.one}
        />

        <div className="mt-5">
          <ProductCard
            productId={productId}
            lang={lang}
            ui={ui}
            errors={errors}
            translationsUi={translationsUi(lang)}
            dialogUi={appDialogUi(lang)}
            billingUrl={OPENAI_BILLING_URL}
            labels={{
              name: t.name, price: t.price,
              notFoundTitle: t.notFoundTitle, notFoundBody: t.notFoundBody,
              back: t.back,
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
