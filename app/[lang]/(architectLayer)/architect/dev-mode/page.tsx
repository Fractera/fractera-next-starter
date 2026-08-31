import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"
import { adminUrlFromSite } from "@/lib/site-urls"
import { getAppConfig } from "@/config/app-config"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { devModeUi } from "../../_i18n/dev-mode.i18n"
import { DEV_MODES, devModeOf, devModeChosen, resolveDevMode } from "../../_lib/dev-mode"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { devModeItemLabel } from "../../_components/dev-mode-menu"
import { AdviceNote } from "../../_components/advice-note"
import { ProductsList } from "../../_components/products-list"
import { getProducts } from "@/config/products-config"
import { ModeCard } from "../../_components/mode-card.client"
import { readRawPlatformConfig } from "@/lib/architect/platform-config-writer"

// РЕЖИМ РАЗРАБОТКИ — СВОЙ ВХОД СЛОЯ (33-1, 2026-08-29; переехал 66-1, 2026-08-31).
//
// 🔒 ТРЕТИЙ ВХОД СЛОЯ, А НЕ ГРУППА ВНУТРИ НАСТРОЕК (решение владельца
// 2026-08-31, дословно: «раньше у нас во вкладке архитектуры была единая левая
// колонка, в которой содержалось и шаги разработки, и дизайн. Но мы провели
// работу и перенесли дизайн в отдельную вкладку. Вот также я хочу, чтобы мы
// перенесли шаги разработки»). Довод тот же, что у дизайна в шаге 41: одна
// вкладка, несущая девять групп настроек плюс четыре режима, перестаёт быть
// местом, где что-то находят.
//
// ✗ ЧЕМ ОПЛАЧЕНО. Эта страница была ПОСЛЕДНИМ потребителем старого общего меню
// слоя (`_components/layer-menu.tsx`): соседи переехали на общую раскладку ещё
// шагом 49, а она осталась в чужой оболочке — и рисовала слева восемь групп
// настроек проекта. Владелец увидел ровно это: «избыточные и не связанные
// инструменты».
//
// 🔒 РАСКЛАДКА ОБЩАЯ, А НЕ ТРЕТЬЯ КОПИЯ. `WorkspaceShell` держит столбец, правую
// колонку и выдвижной ящик на телефоне. Третья пара «меню плюс колонка» — тот
// самый порог, за которым расхождение перестаёт замечаться: на телефоне две
// прежние копии уже разошлись, и нашли это не глаза, а замер (шаг 49).
//
// 🔒 ЧЕТЫРЕ РЕЖИМА СТАЛИ ПЕРВЫМ УРОВНЕМ МЕНЮ. Пока режим был группой настроек,
// они были вторым и потому рисовались горизонтальным рядом — надгробие прежнему
// закону стоит в `_components/dev-mode-menu.tsx`.
//
// 🔒 ЗАЧЕМ ЭТО ВООБЩЕ НАСТРОЙКА, А НЕ ФРАЗА В РАЗГОВОРЕ. Режим обязан пережить
// сессию: агент читает его на старте, а сказанное вчера в чате до сегодняшнего
// окна не доезжает. Значение живёт в `PLATFORM-CONFIG` рядом с выключателями
// возможностей — там же, откуда агент берёт остальное состояние.
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
  // Адрес панели выводится из адреса сайта. Пустая строка означает «адрес сайта
  // не настроен», и карточка режима говорит об этом словами — молча дверь больше
  // не исчезает (66-3).
  const adminUrl = adminUrlFromSite(getAppConfig().url)

  // 🔒 ЧИТАЕТСЯ СЫРОЙ ФАЙЛ, А НЕ СЛИТЫЙ С УМОЛЧАНИЯМИ. Разница здесь
  // содержательная: по слитому «режим не выбирали» неотличимо от «выбран
  // классический» — умолчание подставило бы `classic` в обоих случаях.
  const config = readRawPlatformConfig()
  const current = devModeOf(config)
  const chosen = devModeChosen(config)
  const active = resolveDevMode(rawMode, current)
  const words = ui.modes[active]

  // 🔒 ПРОДУКТЫ ЧИТАЕТ СУЩЕСТВУЮЩИЙ ЧИТАТЕЛЬ СЛОТА, А НЕ СВОЙ. `getProducts()`
  // читает ту же папку, в которую пишет панель. Второй читатель означал бы
  // вторую правду о том же файле.
  const products = active === "cases" ? getProducts() : []

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

        <WorkspaceShell
          id="dev-mode"
          menuTitle={ui.title}
          menuWord={t.menuTitle}
          menu={DEV_MODES.map(mode => ({
            label: ui.modes[mode].label,
            href: `/${lang}/architect/dev-mode?mode=${mode}`,
            active: mode === active,
          }))}
          // 🔒 ПОДПИСЬ РИСУЕТ НЕ РАСКЛАДКА: она не знает ни про альфу, ни про
          // действующий режим, и знать не должна — это свойства этой страницы.
          renderItem={(_item, i) => devModeItemLabel(DEV_MODES[i], current, ui)}
          title={words.label}
          lead={ui.lead}
        >
          <div data-dev-mode-page data-dev-mode-active={active} className="flex min-w-0 flex-1 flex-col gap-6">
            {/* 🔒 «РЕЖИМ НЕ ВЫБИРАЛИ» — ОТДЕЛЬНОЕ СОСТОЯНИЕ, А НЕ ЗНАЧЕНИЕ.
                Молчание конфига действует как классический, поэтому по значению
                этого не увидеть никогда; спрашивается факт записи. */}
            {!chosen && <AdviceNote probe="mode-never-chosen" title={ui.title} text={ui.neverChosen} />}

            <ModeCard mode={active} current={current} chosen={chosen} ui={ui} lang={lang} adminUrl={adminUrl} />

            {/* 🔒 КАРТОЧКИ ЗДЕСЬ, РАБОТА В ПАНЕЛИ — решение владельца. Нажатие
                открывает продукт там, где он уже существует и работает. */}
            {active === "cases" && (
              <ProductsList products={products} lang={lang} adminUrl={adminUrl} ui={ui} />
            )}

            <AdviceNote probe="mode-law" title={ui.lawTitle} text={ui.law} />
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}
