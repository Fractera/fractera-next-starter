import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"
import { adminUrlFromSite } from "@/lib/site-urls"
import { getAppConfig } from "@/config/app-config"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { devModeUi } from "../../_i18n/dev-mode.i18n"
import { devModeOf, devModeChosen, resolveDevMode, migrationOf } from "../../_lib/dev-mode"
import { LayerMenu } from "../../_components/layer-menu"
import { DevModeMenu } from "../../_components/dev-mode-menu"
import { AdviceNote } from "../../_components/advice-note"
import { ModeCard } from "../../_components/mode-card.client"
import { MigrationSourceEditor } from "../../_components/migration-source.client"
import { readRawPlatformConfig } from "@/lib/architect/platform-config-writer"

// РЕЖИМ РАЗРАБОТКИ ВНУТРИ ПРОЕКТА (33-1, 2026-08-29).
//
// 🔒 СВОЙ АДРЕС, А НЕ ДЕВЯТАЯ ГРУППА НА СТРАНИЦЕ НАСТРОЕК. У режима ЧЕТЫРЕ
// подвкладки; вложить второй уровень меню в страницу, которая сама выбирается
// левым меню, значит поставить рядом два меню одного вида — и человек перестанет
// понимать, какое из них где он находится.
//
// 🔒 ЗАЧЕМ ЭТО ВООБЩЕ НАСТРОЙКА, А НЕ ФРАЗА В РАЗГОВОРЕ. Режим обязан пережить
// сессию: агент читает его на старте, а сказанное вчера в чате до сегодняшнего
// окна не доезжает. Поэтому значение живёт в `PLATFORM-CONFIG` рядом с
// выключателями возможностей — там же, откуда агент берёт остальное состояние.
//
// 🔒 ПОЧЕМУ ОН ПЕРЕЕХАЛ СЮДА (решение владельца 2026-08-29). Вкладку «Настройки
// приложения» нельзя удалить из панели, пока там же живёт режим разработки: он
// часть того же раздела. Перенос режима — условие удаления, а не отдельное
// украшение.
//
// Динамическая: значение живое, и правит его островок.
export const dynamic = "force-dynamic"

export default async function DevModePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { lang } = await params
  const { mode: rawMode } = await searchParams

  const t = architectLayerUi(lang)
  const ui = devModeUi(lang)
  // Адрес панели выводится из адреса сайта — тем же способом, что на соседней
  // странице слоя: пустая строка означает «настроек ещё нет», и меню покажет
  // неготовую группу без ссылки вместо выдуманного адреса.
  const adminUrl = adminUrlFromSite(getAppConfig().url)

  // 🔒 ЧИТАЕТСЯ СЫРОЙ ФАЙЛ, А НЕ СЛИТЫЙ С УМОЛЧАНИЯМИ. Разница здесь
  // содержательная: по слитому «режим не выбирали» неотличимо от «выбран
  // классический» — умолчание подставило бы `classic` в обоих случаях.
  const config = readRawPlatformConfig()
  const current = devModeOf(config)
  const chosen = devModeChosen(config)
  const active = resolveDevMode(rawMode, current)
  const words = ui.modes[active]

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: ui.title }, { label: words.label }]}
          eyebrow={t.layer}
          title={ui.title}
          subtitle={ui.subtitle}
        />

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:gap-10">
          <LayerMenu lang={lang} active="devMode" adminUrl={adminUrl} ui={t} />

          <div data-dev-mode-page className="flex min-w-0 flex-1 flex-col gap-6">
            {/* Что режим решает — до вкладок: иначе человек выбирает из четырёх
                слов, не зная, о чём вообще выбор. */}
            <Small className="max-w-3xl">{ui.lead}</Small>

            {/* 🔒 «РЕЖИМ НЕ ВЫБИРАЛИ» — ОТДЕЛЬНОЕ СОСТОЯНИЕ, А НЕ ЗНАЧЕНИЕ.
                Молчание конфига действует как классический, поэтому по значению
                этого не увидеть никогда; спрашивается факт записи. */}
            {!chosen && <AdviceNote probe="mode-never-chosen" title={ui.title} text={ui.neverChosen} />}

            <DevModeMenu lang={lang} active={active} current={current} ui={ui} />

            <ModeCard mode={active} current={current} chosen={chosen} ui={ui} />

            {/* 🔒 ПОЛЕ ИСТОЧНИКА — ТОЛЬКО У ПЕРЕЕЗДА. Показать его на всех вкладках
                значило бы предложить назвать чужой проект тому, кто никуда не
                переезжает: рычаг, который в трёх режимах из четырёх ничего не
                двигает. */}
            {active === "migration" && <MigrationSourceEditor initial={migrationOf(config)} ui={ui} />}

            <AdviceNote probe="mode-law" title={ui.lawTitle} text={ui.law} />
          </div>
        </div>
      </div>
    </main>
  )
}
