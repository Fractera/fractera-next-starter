import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { designUi } from "../../_i18n/design.i18n"
import { DESIGN_SECTIONS, resolveDesignSection, hrefOfDesignSection } from "../../_lib/design-sections"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { DesignFonts } from "../../_components/design-fonts.client"
import { DesignType } from "../../_components/design-type.client"
import { DesignShape } from "../../_components/design-shape.client"
import { DesignColors } from "../../_components/design-colors.client"
import { BlocksCatalogue } from "../../_components/blocks-catalogue"
import { HelpDetails } from "../../_components/help-details"
import { DesignTools } from "../../_components/design-tools.client"
import { featureOn } from "@/config/platform-config"
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
  const { section: rawSection, kind: rawKind } = await searchParams

  const t = architectLayerUi(lang)
  const ui = designUi(lang)
  const active = resolveDesignSection(rawSection)
  const config = readRawDesignConfig()


  const fonts = (config.fonts ?? {}) as Record<string, { family: string; import?: string }>
  const type = (config.type ?? {}) as { scale?: number; leading?: number }
  const shape = (config.shape ?? {}) as { radius?: string; borderWidth?: string; spaceScale?: number; appWidth?: string }
  const rawColors = (config.colors ?? {}) as { light?: Record<string, string>; dark?: Record<string, string> }
  const colors = { light: rawColors.light ?? {}, dark: rawColors.dark ?? {} }

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: t.groups.design }, { label: ui.pages[active].title }]}
          eyebrow={t.layer}
          title={t.groups.design}
          subtitle={t.appConfigSubtitle}
        />

        {/* 🔒 ТА ЖЕ РАСКЛАДКА, ЧТО У НАСТРОЕК ПРОЕКТА И У ВИДА `workspace`
            (шаг 49, 2026-08-30). Здесь стояла ТРЕТЬЯ копия пары «меню плюс
            колонка» — со своим меню-компонентом, своими отступами и своей
            горизонтальной лентой на телефоне. Третья копия и есть тот порог, за
            которым расхождение перестаёт замечаться глазами.

            🔒 РАЗДЕЛЫ ДИЗАЙНА ИДУТ В МЕНЮ, А НЕ ВО ВКЛАДКИ. Вкладки — второй
            уровень ВНУТРИ раздела; здесь же это сам выбор раздела, то есть
            первый. Ряд типов блоков остаётся внутри каталога, где ему и место:
            он вкладки СВОЕГО раздела, а не страницы. */}
        <WorkspaceShell
          id="design"
          menuTitle={t.groups.design}
          menuWord={t.menuTitle}
          menu={DESIGN_SECTIONS.map(id => ({
            label: ui.pages[id].title,
            href: hrefOfDesignSection(lang, id),
            active: id === active,
          }))}
          title={ui.pages[active].title}
          lead={ui.pages[active].hint}
        >
          <div data-design-page data-design-section={active} className="flex min-w-0 flex-1 flex-col gap-6">

            {active === "fonts" && <DesignFonts initial={fonts} ui={ui.fonts} />}
            {active === "type" && <DesignType initial={type} ui={ui.type} />}
            {active === "shape" && <DesignShape initial={shape} ui={ui.shape} />}
            {active === "colors" && <DesignColors initial={colors} ui={ui.colors} />}
            {active === "blocks" && <BlocksCatalogue lang={lang} kind={rawKind} ui={ui} />}
            {/* 🔒 ЧИТАЕТСЯ ДЕЙСТВУЮЩЕЕ ЗНАЧЕНИЕ, А НЕ СЫРОЙ ФАЙЛ. У выключателя
                возможности есть умолчание проекта, и «владелец не высказался»
                обязано показываться в том положении, в каком возможность реально
                работает, — иначе страница спорит с сайтом. */}
            {active === "tools" && <DesignTools initial={featureOn("viewportBadge")} ui={ui} />}

            {/* 🔒 СПРАВКА ЖИВЁТ НА СТРАНИЦЕ, А НЕ ВНУТРИ ОСТРОВКА (перенесено из
                панели, шаг 42). Она серверная и раскрывается без скриптов; уведи
                её в островок — и три абзаца текста уедут в браузер вместе с
                состоянием формы, которое к ним отношения не имеет.

                🔒 У «Инструментов» справки нет намеренно: выключатель объяснён
                своей же подписью, и раскрывашка под ним обещала бы то, чего в ней
                не будет. */}
            {active === "fonts" && (
              <HelpDetails label={ui.fonts.helpLabel}>
                <p><strong>{ui.fonts.helpWhereTitle}</strong> {ui.fonts.helpWhere}</p>
                <p><strong>{ui.fonts.helpHowTitle}</strong> {ui.fonts.helpHow}</p>
                <p><strong>{ui.fonts.helpPrivacyTitle}</strong> {ui.fonts.helpPrivacy}</p>
                <p><strong>{ui.fonts.helpAlphabetTitle}</strong> {ui.fonts.helpAlphabet}</p>
                <p><strong>{ui.fonts.helpSystemTitle}</strong> {ui.fonts.helpSystem}</p>
              </HelpDetails>
            )}
            {active === "type" && (
              <HelpDetails label={ui.type.helpLabel}>
                <p><strong>{ui.type.helpWhyTitle}</strong> {ui.type.helpWhy}</p>
                <p><strong>{ui.type.helpRangeTitle}</strong> {ui.type.helpRange}</p>
                <p><strong>{ui.type.helpLiveTitle}</strong> {ui.type.helpLive}</p>
              </HelpDetails>
            )}
            {active === "shape" && (
              <HelpDetails label={ui.shape.helpLabel}>
                <p><strong>{ui.shape.helpRadiusTitle}</strong> {ui.shape.helpRadius}</p>
                <p><strong>{ui.shape.helpSpaceTitle}</strong> {ui.shape.helpSpace}</p>
                <p><strong>{ui.shape.helpWidthTitle}</strong> {ui.shape.helpWidth}</p>
              </HelpDetails>
            )}
            {active === "colors" && (
              <HelpDetails label={ui.colors.helpLabel}>
                <p><strong>{ui.colors.helpPairTitle}</strong> {ui.colors.helpPair}</p>
                <p><strong>{ui.colors.helpThemesTitle}</strong> {ui.colors.helpThemes}</p>
                <p><strong>{ui.colors.helpContrastTitle}</strong> {ui.colors.helpContrast}</p>
              </HelpDetails>
            )}
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}
