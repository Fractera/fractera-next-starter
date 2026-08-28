import { PageHeader } from "@/components/content-page/page-header.server"
import { P } from "@/components/ui/typography"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"

// НАСТРОЙКИ ПРИЛОЖЕНИЯ ВНУТРИ ПРОЕКТА — каркас страницы (шаг 31-1, 2026-08-28).
//
// 🔒 СЕГМЕНТ `architect` В АДРЕСЕ НАСТОЯЩИЙ, А НЕ ГРУППА. Скобки `(architectLayer)`
// адреса не дают вовсе, и без этого сегмента страница называлась бы просто
// `/{lang}/app-config` — адрес, по которому не видно, чья это работа. Адрес
// читает человек, и он должен говорить, куда ведёт.
//
// 🔒 ШКАЛА ШРИФТА — СТРАНИЦЫ, А НЕ ПАНЕЛИ. Прямое требование владельца
// 2026-08-28: «недостатком административной панели было то, что всё очень мелко;
// правильные высоты шрифта появились только в новой вкладке запуска проекта —
// хочу, чтобы разработка внутри проекта была правильной высоты шрифта, в едином
// стиле со страницей». Поэтому здесь `PageHeader` и `P` из общей типографики
// (`--fs-h1` 30/36/48, `--fs-body` 16px), а не зашитые `text-[10px]`/`text-[12px]`,
// которыми набрана панель. Это же правило переживёт перенос движка формы из
// панели в 31-4: порт везёт логику, а не размеры.
//
// Пока это каркас: левое меню слоя приходит в 31-3, поля настроек — в 31-4 и
// дальше. Страница специально предъявляется пустой — чтобы адрес, замок и вход
// из подвала были доказаны отдельно от формы, а не вместе с ней.
export default async function ArchitectAppConfigPage(
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params
  const t = architectLayerUi(lang)

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: t.appConfigTitle }]}
          eyebrow={t.layer}
          title={t.appConfigTitle}
          subtitle={t.appConfigSubtitle}
        />
        <P className="mt-6 max-w-2xl">{t.appConfigSoon}</P>
      </div>
    </main>
  )
}
