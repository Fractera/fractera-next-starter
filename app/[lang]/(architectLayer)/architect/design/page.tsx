import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"
import { adminUrlFromSite } from "@/lib/site-urls"
import { getAppConfig } from "@/config/app-config"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { designUi } from "../../_i18n/design.i18n"
import { DESIGN_SECTIONS, resolveDesignSection, hrefOfDesignSection } from "../../_lib/design-sections"
import { LayerMenu } from "../../_components/layer-menu"
import { DesignFonts } from "../../_components/design-fonts.client"
import { readRawDesignConfig } from "@/lib/architect/design-config-writer"

// ОФОРМЛЕНИЕ ПРОЕКТА ВНУТРИ ПРОЕКТА (39-2 … 39-5, 2026-08-29).
//
// 🔒 СВОЙ АДРЕС, А НЕ ОДИННАДЦАТАЯ ГРУППА НА СТРАНИЦЕ НАСТРОЕК — по той же
// причине, что у режима разработки: внутри пять разделов, и вложить второй
// уровень меню в страницу, которая сама выбирается меню, значит поставить рядом
// два меню одного вида.
//
// 🔒 ПОЧЕМУ ОН ВООБЩЕ ПЕРЕЕХАЛ. Панель лежит ВНЕ репозитория пользователя, а
// `DESIGN-CONFIG` — внутри него. Пока шрифты и цвет правились из панели, человек,
// забравший проект на свою машину, не видел рядом с кодом того, чем этот код
// настраивается.
//
// 🔒 РАЗДЕЛ ВЫБИРАЕТСЯ ПАРАМЕТРОМ, А НЕ ОТДЕЛЬНЫМ МАРШРУТОМ. Так же устроен режим
// разработки (`?mode=`), и это не экономия файлов: у всех пяти разделов ОДНО
// хранилище и один заголовок, и разведи их по маршрутам — общая шапка окажется в
// пяти копиях, которые разъедутся на первой правке.
//
// 🔒 ЧИТАЕТСЯ СЫРОЙ ФАЙЛ. Слитый с умолчаниями показал бы выбранным каждый цвет
// темы проекта, и «владелец выбрал» стало бы неотличимо от «так приехало».
//
// Динамическая: значения живые, и правят их островки.
export const dynamic = "force-dynamic"

export default async function DesignPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ section?: string; kind?: string }>
}) {
  const { lang } = await params
  const { section: rawSection } = await searchParams

  const t = architectLayerUi(lang)
  const ui = designUi(lang)
  const adminUrl = adminUrlFromSite(getAppConfig().url)
  const active = resolveDesignSection(rawSection)
  const config = readRawDesignConfig()

  // Подписи разделов берутся из словаря группы, а не набираются в разметке:
  // левое меню и заголовок обязаны называть раздел одинаково.
  const subItems = DESIGN_SECTIONS.map(id => ({
    id,
    href: hrefOfDesignSection(lang, id),
    label: ui.pages[id]?.title ?? id,
    active: id === active,
  }))

  const fonts = (config.fonts ?? {}) as Record<string, { family: string; import?: string }>

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: t.groups.design }, { label: ui.pages[active].title }]}
          eyebrow={t.layer}
          title={ui.pages[active].title}
          subtitle={ui.pages[active].hint}
        />

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-10">
          <LayerMenu lang={lang} active="design" adminUrl={adminUrl} ui={t} subItems={subItems} />

          <div data-design-page data-design-section={active} className="flex min-w-0 flex-1 flex-col gap-6">
            {/* 🔒 ЧИТАЕТСЯ НА КАЖДОМ ЗАПРОСЕ — И ОБ ЭТОМ СКАЗАНО СЛОВАМИ. Без этой
                строки зелёное «Сохранено» двусмысленно: человек не знает, нужна ли
                ему пересборка. Здесь она не нужна, и молчать об этом нельзя. */}
            <Small className="max-w-3xl">{t.appConfigSubtitle}</Small>

            {active === "fonts" && <DesignFonts initial={fonts} ui={ui.fonts} />}
          </div>
        </div>
      </div>
    </main>
  )
}
