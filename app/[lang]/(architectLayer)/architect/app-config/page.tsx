import { PageHeader } from "@/components/content-page/page-header.server"
import { P } from "@/components/ui/typography"
import { getAppConfig } from "@/config/app-config"
import { adminUrlFromSite } from "@/lib/site-urls"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/translations/translations.config"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { resolveGroup } from "../../_lib/architect-menu"
import { LayerMenu } from "../../_components/layer-menu"
import { EditLangSwitch } from "../../_components/edit-lang-switch"

// НАСТРОЙКИ ПРИЛОЖЕНИЯ ВНУТРИ ПРОЕКТА — оболочка (31-1 каркас, 31-3 раскладка).
//
// 🔒 СЕГМЕНТ `architect` В АДРЕСЕ НАСТОЯЩИЙ, А НЕ ГРУППА. Скобки `(architectLayer)`
// адреса не дают вовсе, и без этого сегмента страница называлась бы просто
// `/{lang}/app-config` — адрес, по которому не видно, чья это работа.
//
// 🔒 РАСКЛАДКА — РЕШЕНИЕ ВЛАДЕЛЬЦА 2026-08-28: меню слева, переключатель языка
// НАД двумя колонками и СПРАВА от меню, под ним поля в две колонки. Переключатель
// стоит именно там, потому что он относится к полям, а не к странице: подними его
// над меню — и он станет выглядеть настройкой всего экрана, включая навигацию.
//
// 🔒 ШКАЛА ШРИФТА — СТРАНИЦЫ, А НЕ ПАНЕЛИ. Прямое требование владельца: «в панели
// всё очень мелко… хочу правильной высоты шрифт, в едином стиле со страницей».
// Отсюда `PageHeader`, `P` и токены `--fs-*` вместо зашитых кеглей — и это же
// правило переживёт перенос движка формы из панели в 31-4: порт везёт логику, а
// не размеры.
//
// Две колонки пока пусты: поля приходят в 31-4. Оболочка предъявляется отдельно,
// чтобы меню, переключатель и сетка были доказаны без формы, а не вместе с ней.
export default async function ArchitectAppConfigPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ group?: string; edit?: string }>
}) {
  const { lang } = await params
  const { group: rawGroup, edit } = await searchParams
  const t = architectLayerUi(lang)

  const group = resolveGroup(rawGroup)
  // Неизвестный язык в адресе падает на язык проекта по умолчанию — по той же
  // причине, что и неизвестная группа: ссылку правят руками и присылают друг
  // другу, а пустой экран в ответ читается как поломка.
  const editLang = edit && (SUPPORTED_LANGUAGES as readonly string[]).includes(edit) ? edit : DEFAULT_LANGUAGE

  // Адрес панели выводится из адреса сайта, как и в подвале: настроек ещё нет —
  // адрес пуст, и неготовые группы показываются без ссылки.
  const adminUrl = adminUrlFromSite(getAppConfig().url)

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

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-10">
          <LayerMenu lang={lang} active={group} adminUrl={adminUrl} ui={t} />

          <div className="min-w-0 flex-1">
            <EditLangSwitch
              lang={lang}
              group={group}
              langs={SUPPORTED_LANGUAGES}
              active={editLang}
              ui={t}
            />

            {/* 🔒 ДВЕ КОЛОНКИ НА `md` И ОДНА НА УЗКОМ — решение владельца. Поля
                придут сюда в 31-4; сетка объявлена уже сейчас, потому что именно
                она проверяется в этом подшаге. */}
            <div data-config-grid className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <P>{t.appConfigSoon}</P>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
