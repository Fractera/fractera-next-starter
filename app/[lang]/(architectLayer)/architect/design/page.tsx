import { PageHeader } from "@/components/content-page/page-header.server"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { DialogsCatalogue } from "../../_components/dialogs-catalogue.client"
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
import { SectionIntro } from "../../_components/section-intro.client"
import { HelpDetails } from "../../_components/help-details"
import { DesignTools } from "../../_components/design-tools.client"
import { ToolsCatalogue } from "../../_components/tools-catalogue"
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
            {/* ✗ ЭТО ОБЪЯСНЕНИЕ УЖЕ СТОЯЛО НА СТРАНИЦЕ И ЕГО НЕ ВИДЕЛ НИКТО
                (найдено 2026-08-30 тем, что владелец попросил его ТРЕТИЙ раз).
                Оно лежало свёрнутой раскрывашкой ПОСЛЕ каталога — то есть за
                полусотней образцов блоков, каждый из которых рисуется настоящим
                рендерером во весь рост. Долистать туда невозможно, и раскрыть
                тоже: сначала надо догадаться, что там что-то есть.

                🔒 МЕСТО ТЕКСТА — ЧАСТЬ ТЕКСТА. Объяснение, которое читают ПЕРЕД
                работой, стоит перед работой и раскрыто. Свёрнутая подсказка
                годится для того, что уточняют ПО ХОДУ, — у соседних разделов
                это «куда уедет значение», и там она на месте.

                🔒 ПОЧЕМУ ЭТО ВООБЩЕ ЗДЕСЬ, А НЕ В ДОКУМЕНТАЦИИ. Каталог
                показывает, ЧТО есть, и молчит о том, что мимо него страницу в
                этом проекте не построить. Человек, который этого не знает,
                начнёт верстать руками и потеряет перенос, порядок и перевод
                разом — причём узнает об этом через месяц. */}
            {active === "blocks" && (
              // 🔒 КЛЮЧ ВКЛЮЧАЕТ И РАЗДЕЛ, И ТИП БЛОКА: смена любой вкладки даёт
              // новый экземпляр, то есть снова свёрнутый вид. Владелец: «не надо
              // в памяти держать открытый контейнер» — это и есть исполнение.
              <SectionIntro
                name="blocks"
                key={`${active}:${rawKind ?? ""}`}
                moreLabel={ui.pages.blocks.helpMore}
                lessLabel={ui.pages.blocks.helpLess}
                summary={
                  <Small><strong className="text-foreground">{ui.pages.blocks.helpWhatTitle}</strong> {ui.pages.blocks.helpWhat}</Small>
                }
                rest={
                  <>
                    <Small><strong className="text-foreground">{ui.pages.blocks.helpThreeTitle}</strong> {ui.pages.blocks.helpThree}</Small>
                    <Small><strong className="text-foreground">{ui.pages.blocks.helpWidgetTitle}</strong> {ui.pages.blocks.helpWidget}</Small>
                    {/* 🪦 ЧЕТВЁРТЫЙ АБЗАЦ БОЛЬШЕ НЕ ВИДЕН ПО УМОЛЧАНИЮ. Решение
                        владельца 2026-08-30 требовало обратного, и его довод был
                        верен: «свёрнутый ответ на такой вопрос равен
                        отсутствующему». Отменено им же 2026-08-31, когда справка
                        выросла до четырёх абзацев и вытеснила каталог. Причина
                        записана в `section-intro.client.tsx` (файл назывался `blocks-intro` до 76-2). */}
                    <Small><strong className="text-foreground">{ui.pages.blocks.helpParallelTitle}</strong> {ui.pages.blocks.helpParallel}</Small>
                  </>
                }
              />
            )}

            {active === "blocks" && <BlocksCatalogue lang={lang} kind={rawKind} ui={ui} dialogUi={appDialogUi(lang)} />}
            {/* 🔒 РАЗДЕЛ ПОКАЗЫВАЕТ НАСТОЯЩЕЕ ОКНО, А НЕ ЕГО РИСУНОК. Витрина,
                перерисовывающая предмет по-своему, показывает себя, а не
                продукт, — тот же закон, по которому каталог блоков рисуют
                настоящие рендереры. */}
            {active === "dialogs" && (
              <DialogsCatalogue ui={ui.pages.dialogs} dialogUi={appDialogUi(lang)} />
            )}
            {/* 🔒 СПРАВКА РАЗДЕЛА СТОИТ ПЕРЕД РАБОТОЙ И СВЁРНУТА — тот же островок,
                что у «Блоков» (76-2). Место текста — часть текста: объяснение,
                которое читают ПЕРЕД работой, стоит перед работой.

                🔒 КЛЮЧ — САМ РАЗДЕЛ: переход на другой раздел и обратно даёт новый
                экземпляр, то есть снова свёрнутый вид. Типа блока здесь нет, и
                второй составляющей ключу не нужно. */}
            {active === "tools" && (
              <SectionIntro
                name="tools"
                key={active}
                moreLabel={ui.pages.tools.helpMore}
                lessLabel={ui.pages.tools.helpLess}
                summary={
                  <Small><strong className="text-foreground">{ui.pages.tools.helpWhatTitle}</strong> {ui.pages.tools.helpWhat}</Small>
                }
                rest={
                  <>
                    <Small><strong className="text-foreground">{ui.pages.tools.helpWhyTitle}</strong> {ui.pages.tools.helpWhy}</Small>
                    <Small><strong className="text-foreground">{ui.pages.tools.helpWidgetTitle}</strong> {ui.pages.tools.helpWidget}</Small>
                    <Small><strong className="text-foreground">{ui.pages.tools.helpExceptionTitle}</strong> {ui.pages.tools.helpException}</Small>
                  </>
                }
              />
            )}

            {/* 🔒 ЧИТАЕТСЯ ДЕЙСТВУЮЩЕЕ ЗНАЧЕНИЕ, А НЕ СЫРОЙ ФАЙЛ. У выключателя
                возможности есть умолчание проекта, и «владелец не высказался»
                обязано показываться в том положении, в каком возможность реально
                работает, — иначе страница спорит с сайтом. */}
            {/* 🔒 КАТАЛОГ ИДЁТ ПЕРВЫМ, ПРИБОР — ВТОРЫМ (76-4). Раздел называет
                себя витриной инструментов, и то, ради чего его открывают, стоит
                выше того, что оставлено здесь исключением. Обратный порядок
                объявил бы прибор главным предметом страницы. */}
            {active === "tools" && <ToolsCatalogue lang={lang} ui={ui} dialogUi={appDialogUi(lang)} />}
            {/* 🔒 ОСТРОВКУ ОТДАЮТСЯ ТОЛЬКО ЕГО СЛОВА, ПЕРЕЧИСЛЕННЫЕ ПОИМЁННО
                (76-4). Здесь стоял весь `ui`, и это уезжало в браузер целиком —
                включая справку раздела, подписи витрины и слова заявки. */}
            {active === "tools" && (
              <DesignTools
                initial={featureOn("viewportBadge")}
                ui={{
                  instrumentsTitle: ui.pages.tools.instrumentsTitle,
                  instrumentsLead: ui.pages.tools.instrumentsLead,
                  label: ui.viewportBadgeLabel,
                  hint: ui.viewportBadgeHint,
                  on: ui.toolsOn,
                  off: ui.toolsOff,
                  failed: ui.colors.failed,
                }}
              />
            )}

            {/* 🔒 СПРАВКА ЖИВЁТ НА СТРАНИЦЕ, А НЕ ВНУТРИ ОСТРОВКА (перенесено из
                панели, шаг 42). Она серверная и раскрывается без скриптов; уведи
                её в островок — и три абзаца текста уедут в браузер вместе с
                состоянием формы, которое к ним отношения не имеет.

                🪦 «У «ИНСТРУМЕНТОВ» СПРАВКИ НЕТ НАМЕРЕННО» — отменено 76-2,
                2026-08-31, словом владельца. Довод был верен, пока раздел состоял
                из одного выключателя: раскрывашка под ним обещала бы то, чего в
                ней нет. Раздел перестал быть выключателем и стал витриной
                инструментов — и у витрины объяснение обязано стоять ПЕРЕД
                работой, свёрнутым, как у «Блоков». Надгробие оставлено: иначе
                следующая сессия воскресит запрет по памяти и снимет справку. */}

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
