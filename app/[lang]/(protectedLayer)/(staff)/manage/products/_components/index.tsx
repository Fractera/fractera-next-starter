import { platformErrors, OPENAI_BILLING_URL } from "@/lib/i18n/platform-errors"
import { translationsUi } from "@/_tools/translations-dialog/types/translations-dialog.i18n"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { imageCropperUi } from "@/services/upload/image-cropper.i18n"
import { getAppConfig } from "@/config/app-config"
import { productsUi } from "../_data/ui.i18n"
import { manageTableUi } from "../_widgets/manage-table/ui.i18n"
import { ManageTable } from "../_widgets/manage-table/index.client"
import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"

// Вход страницы товаров ПЕРСОНАЛА — СЕРВЕРНЫЙ компонент, и всё, что он рисует,
// статический каркас: крошки, заголовок, объяснение, подпись о хранилище. Ни
// одного запроса к базе, поэтому страница предрендерена на каждый язык и
// открывается мгновенно.
//
// Защищённая страница — это статическая страница с динамическими дырами, а не
// динамическая страница. Дыру открывает ВИДЖЕТ ниже, по кнопке.
//
// 🔒 ЗДЕСЬ ОСТАЛСЯ ТОЛЬКО КАРКАС СТРАНИЦЫ (шаг 521). Всё, что относится к самой
// таблице — её поведение, скелетон, управление, форма заведения, подвал, строка
// и слова, — уехало в `_widgets/manage-table/`. Граница простая: страница
// отвечает за место и заголовок, виджет — за то, что внутри.
//
// Слова резолвятся ЗДЕСЬ и уезжают в островок пропсами: клиентский компонент,
// импортирующий словарь, увёз бы в браузер все его языки.
export default function ProductsEntry({ lang }: { lang: string }) {
  const t = productsUi(lang)
  const ui = manageTableUi(lang)

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />

        <ManageTable
          lang={lang}
          currency={getAppConfig().commerce.currency}
          ui={ui}
          labels={{
            add: t.add, cancelAdd: t.cancelAdd, newProduct: t.newProduct,
            name: t.name, price: t.price, uploadPhoto: t.uploadPhoto, save: t.save,
            created: t.created, nothingFound: t.nothingFound,
          }}
          errors={platformErrors(lang)}
          translationsUi={translationsUi(lang)}
          dialogUi={appDialogUi(lang)}
          cropperUi={imageCropperUi(lang)}
          billingUrl={OPENAI_BILLING_URL}
        />

        <Small className="mt-6 text-center font-mono">{t.storageNote}</Small>
      </div>
    </main>
  )
}
