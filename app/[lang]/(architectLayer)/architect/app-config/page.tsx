import { PageHeader } from "@/components/content-page/page-header.server"
import { P, Small } from "@/components/ui/typography"
import { getAppConfig } from "@/config/app-config"
import { getPlatformConfig } from "@/config/platform-config"
import { adminUrlFromSite } from "@/lib/site-urls"
import { resolveSocialLinks } from "@/config/app-config.defaults"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/translations/translations.config"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { fieldsUi } from "../../_i18n/fields.i18n"
import { resolveGroup, sourceOfGroup } from "../../_lib/architect-menu"
import { modeOf, activeSlots } from "../../_lib/routing"
import { sectionsOfGroup, atPath } from "../../_lib/fields"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { ARCHITECT_GROUPS, hrefOfGroup } from "../../_lib/architect-menu"
import { EditLangSwitch } from "../../_components/edit-lang-switch"
import { ConfigEditor } from "../../_components/config-editor.client"
import { imageCropperUi } from "@/services/upload/image-cropper.i18n"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { RoutingEditor } from "../../_components/routing-editor.client"
import { FeaturesEditor } from "../../_components/features-editor.client"
import { NavEditor } from "../../_components/nav-editor.client"
import { LanguagesEditor, type LangRow } from "../../_components/languages-editor.client"
import { ALL_LANGUAGE_METADATA } from "@/config/translations/language-metadata"
import { readEnvValue } from "@/lib/architect/env-writer"
import { parseNavItems, type NavCandidate } from "../../_lib/nav"
import { publicSurfaces } from "@/lib/aio/surfaces"
import { getMenuGroups } from "@/lib/menu/group-menus"
import { defaultFooterGroups } from "@/lib/menu/nav-config"
import Link from "next/link"
import { groupsUi } from "../../_i18n/groups.i18n"
import { readRawPlatformConfig } from "@/lib/architect/platform-config-writer"
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
  const gw = groupsUi(lang)

  // 🔒 ЗАГОЛОВОК СТРАНИЦЫ — ИМЯ ОТКРЫТОЙ ГРУППЫ, А НЕ ИМЯ СТРАНИЦЫ (31-12).
  // Пока групп было три и все они были настройками приложения, общий заголовок
  // говорил правду. Теперь на том же адресе живут языки, раскладка и куки-баннер —
  // и «Настройки приложения» над списком языков просто неверно. Крошка остаётся
  // общей: она про место, заголовок — про предмет.
  const groupTitle = t.groups[group] ?? t.appConfigTitle

  // Источник значений группы: настройки приложения, платформенный конфиг или
  // окружение. От него зависит и редактор, и то, применится ли правка без сборки.
  const source = sourceOfGroup(group)
  const sections = sectionsOfGroup(group)
  const raw = readRawConfig()
  // 🔒 ЧИТАЕТСЯ СЫРОЙ ФАЙЛ, А НЕ КАРТИНА ЧИТАТЕЛЯ. Записать обратно полную
  // картину значило бы объявить решением владельца каждое умолчание шаблона —
  // и следующая версия шаблона уже не смогла бы поменять ни одного.
  const platform = source === "platform" ? readRawPlatformConfig() : {}
  // 🔒 ВЫКЛЮЧАТЕЛЬ ЧИТАЕТСЯ ИЗ ПОЛНОЙ КАРТИНЫ, А ПИШЕТСЯ В СЫРОЙ ФАЙЛ, и это не
  // противоречие. Показать надо ДЕЙСТВУЮЩЕЕ значение — иначе выключатель
  // нетронутой возможности выглядел бы выключенным при работающем баннере.
  // Записывать же можно только то, что владелец действительно тронул.
  const features = getPlatformConfig().features

  // 🔒 КАНДИДАТЫ В МЕНЮ — ПУБЛИЧНЫЕ ПОВЕРХНОСТИ ПРОЕКТА, а не отдельный список.
  // Тот же реестр отдаёт карту сайта и машинные версии страниц: список, который
  // ведут вручную, устаревает первым — новая страница появляется в дереве, а в
  // меню её предложить нельзя, и человек считает, что страницу нельзя добавить.
  //
  // 🔒 ЗАГОЛОВОК БЕРЁТСЯ ГОТОВЫМ И НА ЯЗЫКЕ СТРАНИЦЫ: поверхность знает своё имя,
  // а выдумывать имя по адресу значило бы показать `products` вместо «Товары».
  const navSlot = group === "header" ? "top" : "footer"
  const navCandidates: NavCandidate[] =
    source === "app-config" && (group === "header" || group === "footer")
      ? publicSurfaces(lang)
          // 🔒 В ХЕДЕР НЕ ПРЕДЛАГАЮТСЯ СТРАНИЦЫ ПОДВАЛА (решение владельца 2026-08-29,
          // как было в панели). Правовые страницы — политика, условия, куки,
          // доступность — живут в футере по своей природе: их ищут, когда они
          // понадобились, а не выбирают из шапки. Предлагать их наверху значит
          // предлагать испортить шапку, и однажды это сделают.
          //
          // Признак берётся у самой поверхности (`section`), а не из списка адресов
          // рядом: список пришлось бы вести руками, и новая правовая страница
          // молча оказалась бы в кандидатах шапки.
          .filter(s => (group === "header" ? s.section !== "legal" : true))
          .map(s => ({
            id: s.subPath.replace(/^\//, "") || "home",
            href: s.subPath || "/",
            title: s.title,
            section: s.section,
          }))
      : []

  // Ветка меню в СЫРОМ файле: её отсутствие значит «владелец не открывал раздел»,
  // и тогда сайт строит меню сам. Пустой массив значит «убрал все кнопки».
  const navRaw = (raw.nav as Record<string, unknown> | undefined)?.[navSlot]
  const navConfigured = Array.isArray(navRaw)
  // 🔒 НЕНАСТРОЕННОЕ МЕНЮ ПОКАЗЫВАЕТСЯ ТЕМ, ЧТО СЕЙЧАС СТОИТ НА САЙТЕ, и берётся
  // это у САМОГО САЙТА, а не собирается здесь заново.
  //
  // ✗ Первая редакция подставляла сюда все публичные поверхности проекта, и это
  // была ложь ровно того сорта, что труднее всего заметить: список выглядел
  // правдоподобно — девять настоящих страниц, — но в шапке сайта их не девять.
  // Верхнее меню ненастроенного проекта строят МАНИФЕСТЫ РАЗДЕЛОВ, подвал —
  // список правовых страниц. Сохранив показанное, человек не «взял бы меню в свои
  // руки», а молча заменил бы его семью новыми кнопками.
  // предложила бы настроить пустоту, тогда как в шапке стоят кнопки.
  const navItems = navConfigured
    ? parseNavItems(navRaw)
    : (navSlot === "top" ? getMenuGroups("top", lang) : defaultFooterGroups(lang))
        // У группы верхнего меню собственного адреса может не быть — тогда он
        // ведёт на первого ребёнка, ровно как на самом сайте.
        .map(g => ({ ...g, href: g.href ?? g.children[0]?.href ?? `/${g.slug}` }))
        .map((g, i) => ({ id: g.slug, href: g.href, order: (i + 1) * 10, label: "" }))
  // 🔒 КАТАЛОГ ЯЗЫКОВ РАЗБИРАЕТСЯ НА СЕРВЕРЕ И УЕЗЖАЕТ ГОТОВЫМИ СТРОКАМИ. В нём
  // 84 записи с флагами, родными именами и регионами; тащить их в браузер незачем —
  // разметку строит сервер, а островку нужны имя, флаг и качество перевода.
  //
  // 🔒 ЧИТАЕТСЯ ФАЙЛ, А НЕ `process.env`. Это разные ответы, и в этом весь смысл
  // группы: в окружении процесса живёт набор, с которым проект СОБРАН, а в файле —
  // то, что владелец сохранил последним. Расхождение и есть «ждёт пересборки».
  const langCatalogue: LangRow[] = group !== "multilang" ? [] :
    Object.values(ALL_LANGUAGE_METADATA)
      .map(m => ({
        code: m.code,
        flag: m.flag,
        nativeName: m.nativeName,
        englishName: m.englishName,
        tier: m.aiTier,
      }))
      .sort((a, b) => a.englishName.localeCompare(b.englishName))

  const envLangs = readEnvValue("NEXT_PUBLIC_SUPPORTED_LANGUAGES")
  const savedLangs = envLangs
    ? envLangs.split(",").map(s => s.trim()).filter(Boolean)
    : [...SUPPORTED_LANGUAGES]
  const savedDefaultLang = readEnvValue("NEXT_PUBLIC_DEFAULT_LOCALE") ?? DEFAULT_LANGUAGE

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
    // 🔒 СПИСОК СОЦСЕТЕЙ ЕДЕТ СТРОКОЙ JSON — движок держит значения полей
    // строками, и второе хранилище ради одного поля дало бы два правила «что
    // считать изменённым». Читается он общим резолвером (`resolveSocialLinks`),
    // тем же, которым подвал сайта решает, что показывать: два места, считающие
    // список по-разному, разойдутся на первой же старой записи.
    if (field.type === "icons") {
      // Полю нужен только идентификатор действующего набора: сами файлы живут в
      // слое данных и адресуются от него.
      const set = getAppConfig().iconSet
      values[field.path] = set?.id ?? ""
      continue
    }

    if (field.type === "socials") {
      const cfg = getAppConfig()
      values[field.path] = JSON.stringify(resolveSocialLinks(cfg.seo))
      continue
    }

    values[field.path] =
      translation ?? asText(atPath(raw, field.path) ?? atPath(effective, field.path))
  }

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        {/* 🔒 ЗАГОЛОВОК СТРАНИЦЫ И ЗАГОЛОВОК РАЗДЕЛА РАЗВЕДЕНЫ (шаг 49). До
            переноса шапка печатала имя ОТКРЫТОЙ ГРУППЫ, потому что другого места
            для него не было. Теперь оно есть — заголовок правой части рабочего
            экрана, — и оставить имя группы в шапке значило бы напечатать его
            дважды подряд. Шапка отвечает на вопрос «где я» (крошки и страница),
            рабочий экран — «что я открыл». */}
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: t.appConfigTitle }, { label: groupTitle }]}
          eyebrow={t.layer}
          title={t.appConfigTitle}
          subtitle={t.appConfigSubtitle}
        />

        {/* 🔒 РАСКЛАДКА — ОБЩАЯ С ВИДОМ `workspace` (шаг 49, 2026-08-30, заказ
            владельца: «перенеси страницу настройки проекта на этот блок»).
            Здесь стояла своя пара «меню плюс колонка» — та самая, с которой вид и
            был срисован. Пока копий было две, они совпадали; третья страница
            развела бы их молча, а на телефоне они уже разошлись: у вида ящик, у
            страницы оставалась горизонтальная лента, которую владелец назвал
            неправильной.

            🔒 МЕНЮ ПРИХОДИТ ДАННЫМИ, А НЕ КОМПОНЕНТОМ. `LayerMenu` рисовал те же
            восемь пунктов сам; теперь страница отдаёт их раскладке списком, и
            подпись каждого по-прежнему считает она — раскладка не знает ни про
            группы, ни про их адреса, и знать не должна. */}
        <WorkspaceShell
          id="app-config"
          menuTitle={t.menuTitle}
          menuWord={t.menuTitle}
          menu={ARCHITECT_GROUPS.map(g => ({
            label: t.groups[g.id] ?? g.id,
            href: hrefOfGroup(lang, g.id),
            active: g.id === group,
          }))}
          title={groupTitle}
        >
          <div className="min-w-0 flex-1">
            {/* 🔒 ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА НАСТРОЕК — ТОЛЬКО У НАСТРОЕК ПРИЛОЖЕНИЯ.
                Он переключает язык ЗНАЧЕНИЙ (имя сайта по-русски и по-английски),
                а у раскладки, языков и куки-баннера языковых значений нет вовсе:
                там булевы выключатели и списки. Оставить его на всех группах
                значило бы показать рычаг, который ничего не двигает. */}
            {source === "app-config" && (
            <EditLangSwitch
              lang={lang}
              group={group}
              langs={SUPPORTED_LANGUAGES}
              active={editLang}
              ui={t}
            />
            )}

            {/* 🔒 ЗНАЧЕНИЯ СЧИТАЮТСЯ ЗДЕСЬ, НА СЕРВЕРЕ, для выбранного языка
                настроек — островок получает готовые строки и готовые слова.
                Отдать ему конфиг целиком значило бы увезти в браузер и чужие
                ветки, и весь словарь; отдать словарь — все его языки. */}
            <div data-config-grid className="mt-6">
              {/* 🔒 РЕДАКТОР ВЫБИРАЕТСЯ ПО ГРУППЕ, И ЭТО НЕ ВЕТВЛЕНИЕ РАДИ
                  УДОБСТВА. У групп разные ХРАНИЛИЩА: настройки приложения, файл
                  платформы, окружение сборки. Один редактор на всех означал бы
                  либо общий знаменатель (галочки и строки), либо один компонент,
                  знающий про три двери сразу. */}
              {group === "multilang" ? (
                <LanguagesEditor
                  catalogue={langCatalogue}
                  initial={savedLangs}
                  initialDefault={savedDefaultLang}
                  built={SUPPORTED_LANGUAGES}
                  ui={gw}
                />
              ) : group === "parallelRouting" ? (
                <RoutingEditor
                  initialMode={modeOf(platform)}
                  initialSlots={activeSlots(platform)}
                  ui={gw}
                />
              ) : group === "header" || group === "footer" ? (
                <FeaturesEditor
                  title={group === "header" ? gw.nav.topTitle : gw.nav.footerTitle}
                  hint={group === "header" ? gw.nav.topHint : gw.nav.footerHint}
                  switches={[
                    {
                      key: group === "header" ? "topMenu" : "footerPages",
                      label: gw.nav.enable,
                      hint: group === "header" ? gw.nav.enableTop : gw.nav.enableFooter,
                      initial: group === "header" ? features.topMenu : features.footerPages,
                    },
                  ]}
                  ui={gw}
                  childrenGatedBy={group === "header" ? "topMenu" : "footerPages"}
                >
                  {/* 🔒 ВЫКЛЮЧАТЕЛЬ И ПУНКТЫ СОХРАНЯЮТСЯ ОТДЕЛЬНО, И ЭТО ЧЕСТНО:
                      они пишут в РАЗНЫЕ файлы — выключатель в платформенный конфиг,
                      пункты в настройки приложения. Одна кнопка на два файла
                      означала бы, что половина сохранения может не пройти, а
                      человек увидит одно слово «Сохранено». */}
                  <NavEditor
                    slot={navSlot}
                    initial={navItems}
                    configured={navConfigured}
                    candidates={navCandidates}
                    editLang={editLang}
                    ui={gw}
                  />
                </FeaturesEditor>
              ) : group === "cookieBanner" ? (
                <FeaturesEditor
                  title={gw.cookies.title}
                  hint={gw.cookies.hint}
                  switches={[
                    {
                      key: "cookieBanner",
                      label: gw.cookies.enable,
                      hint: gw.cookies.enableHint,
                      notice: { on: gw.cookies.onNotice, off: gw.cookies.offNotice },
                      initial: features.cookieBanner,
                    },
                  ]}
                  ui={gw}
                >
                  {/* 🔒 ССЫЛКА НА САМУ СТРАНИЦУ ПОЛИТИКИ, А НЕ ПОЛЕ С ЕЁ АДРЕСОМ.
                      Адрес не настраивается: страница — часть правового раздела
                      проекта и живёт по своему маршруту. Поле для него было бы
                      рычагом, который ничего не двигает; ссылка — способ дойти
                      до текста, который человек как раз и захочет прочесть. */}
                  <section className="flex flex-col gap-2">
                    <Link
                      href={`/${lang}/cookies`}
                      className="text-[length:var(--fs-body)] text-primary hover:underline"
                      data-cookie-policy-link
                    >
                      {gw.cookies.linkTitle}
                    </Link>
                    <Small>{gw.cookies.linkHint}</Small>
                  </section>
                </FeaturesEditor>
              ) : sections.length > 0 ? (
                <ConfigEditor
                  sections={sections}
                  initial={values}
                  lang={lang}
                  editLang={editLang}
                  defaultLang={DEFAULT_LANGUAGE}
                  translatedPaths={translatedPaths}
                  ui={fw}
                  // Словари обрезчика резолвятся здесь, на сервере: клиентскому
                  // файлу их импортировать нельзя.
                  cropUi={{ cropper: imageCropperUi(lang), dialog: appDialogUi(lang) }}
                />
              ) : (
                <P>{t.appConfigSoon}</P>
              )}
            </div>
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}
