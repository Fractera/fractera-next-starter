import { PageHeader } from "@/components/content-page/page-header.server"
import { P } from "@/components/ui/typography"
import { getAppConfig } from "@/config/app-config"
import { adminUrlFromSite } from "@/lib/site-urls"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/translations/translations.config"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { fieldsUi } from "../../_i18n/fields.i18n"
import { resolveGroup } from "../../_lib/architect-menu"
import { sectionsOfGroup, atPath } from "../../_lib/fields"
import { LayerMenu } from "../../_components/layer-menu"
import { EditLangSwitch } from "../../_components/edit-lang-switch"
import { ConfigEditor } from "../../_components/config-editor.client"
import { readRawConfig } from "@/lib/architect/app-config-writer"

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

  // 🔒 ФОРМА ПРАВИТ СЫРОЙ ФАЙЛ, А ПОКАЗЫВАЕТ ДЕЙСТВУЮЩЕЕ. Значение берётся из
  // файла; если владелец его ещё не сохранял — из того, что реально работает на
  // сайте (`getAppConfig()`, файл, слитый с умолчаниями). Иначе поле выглядело бы
  // пустым при живом значении, и человек «исправлял» бы пустоту, записывая в файл
  // умолчание шаблона как собственное решение.
  const fw = fieldsUi(lang)
  const sections = sectionsOfGroup(group)
  const raw = readRawConfig()
  const effective = getAppConfig() as unknown as Record<string, unknown>
  const i18n = (raw.i18n ?? {}) as Record<string, Record<string, string>>

  const asText = (v: unknown): string =>
    typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : ""

  const values: Record<string, string> = {}
  const translatedPaths: string[] = []
  for (const field of sections.flatMap(s => s.fields)) {
    // Языковое поле на языке по умолчанию — это само поле; на другом языке —
    // перевод, а при его отсутствии показывается основное значение, как и на
    // сайте (`configValueForLang`). Показать пустоту значило бы солгать о том,
    // что сейчас видит посетитель.
    const isTranslation = field.perLang && editLang !== DEFAULT_LANGUAGE
    const translation = isTranslation ? i18n[field.path]?.[editLang] : undefined
    if (isTranslation && typeof translation === "string" && translation.trim() !== "") {
      translatedPaths.push(field.path)
    }
    values[field.path] =
      translation ?? asText(atPath(raw, field.path) ?? atPath(effective, field.path))
  }

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

            {/* 🔒 ЗНАЧЕНИЯ СЧИТАЮТСЯ ЗДЕСЬ, НА СЕРВЕРЕ, для выбранного языка
                настроек — островок получает готовые строки и готовые слова.
                Отдать ему конфиг целиком значило бы увезти в браузер и чужие
                ветки, и весь словарь; отдать словарь — все его языки. */}
            <div data-config-grid className="mt-6">
              {sections.length > 0 ? (
                <ConfigEditor
                  sections={sections}
                  initial={values}
                  lang={lang}
                  editLang={editLang}
                  defaultLang={DEFAULT_LANGUAGE}
                  translatedPaths={translatedPaths}
                  ui={fw}
                />
              ) : (
                <P>{t.appConfigSoon}</P>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
