import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { telegramUi } from "../../_i18n/telegram.i18n"
import {
  TELEGRAM_SECTIONS,
  resolveTelegramSection,
  hrefOfTelegramSection,
} from "../../_lib/telegram-sections"
import { SectionIntro } from "../../_components/section-intro.client"
import { TelegramSettings } from "../../_components/telegram-settings"
import { TelegramLogsSection } from "../../_components/telegram-logs-section"
import { TelegramAbout } from "../../_components/telegram-about"
import { readChannels } from "@/lib/architect/channels"

// TELEGRAM-БОТ — ЧЕТВЁРТЫЙ ВХОД СЛОЯ АРХИТЕКТОРА (77-1, 2026-08-31).
//
// 🔒 СВОЙ ВХОД, А НЕ ГРУППА ВНУТРИ НАСТРОЕК — заказ владельца дословно: «я хочу,
// чтоб мы создали Telegram-бот внутри footer. И эта вкладка будет иметь в
// точности всё то же самое… тот же самый интерфейс». Довод тот же, которым
// заведены дизайн (шаг 41) и режим разработки (шаг 66): вкладка настроек уже
// несёт десять групп, и вложенный туда бот со своими тремя разделами превратил бы
// одно меню в список, из которого каждый раз выбирают одну строку.
//
// 🔒 РАСКЛАДКА ОБЩАЯ, А НЕ ЧЕТВЁРТАЯ КОПИЯ. `WorkspaceShell` держит меню, правую
// колонку и выдвижной ящик на телефоне. Федеральный закон называет четвёртую
// копию пары «меню плюс колонка» тем порогом, за которым расхождение перестаёт
// замечаться, — и здесь она была бы именно четвёртой. Поэтому её нет.
//
// 🪦 «ЭТО СКЕЛЕТ» — БОЛЬШЕ НЕПРАВДА, И СТРОКА ИСПРАВЛЕНА ВМЕСТЕ С КОДОМ
// (2026-09-01). Здесь стояло: разделы «Логи» и «Настройки» показывают честную
// заглушку. Шаг 77 продолжен словом владельца, и оба раздела построены:
// «Настройки» перенесены из панели целиком (77-4), «Логи» построены заново
// поверх склада входящих службы (77-5). Заглушки в этом входе не осталось ни
// одной. ✗ комментарий, переживший свой код, — тот же класс, что список,
// написанный руками: он не падает и не краснеет, он просто врёт.
//
// 🔒 ПАНЕЛЬНАЯ ВКЛАДКА «КАНАЛЫ СВЯЗИ» ОСТАЁТСЯ ЖИВОЙ. Решение владельца
// 2026-08-31: «не будем полностью избавляться от 3002, пусть остаётся». Две
// поверхности сосуществуют намеренно; удаление панельной — отдельное его слово,
// как это было со «Способами входа» (78-6).
//
// 🔒 РАЗДЕЛ ВЫБИРАЕТСЯ ПАРАМЕТРОМ, А НЕ ОТДЕЛЬНЫМ МАРШРУТОМ — как у дизайна и
// режима разработки: у трёх разделов один заголовок и одна шапка, и развёрстка их
// по маршрутам дала бы три её копии.
//
// Динамическая: содержимое разделов станет живым, как только приедет логика.
export const dynamic = "force-dynamic"

export default async function TelegramPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ section?: string }>
}) {
  const { lang } = await params
  const { section: rawSection } = await searchParams

  const t = architectLayerUi(lang)
  const ui = telegramUi(lang)
  const active = resolveTelegramSection(rawSection)

  // 🔒 ОДИН ВОПРОС СЛУЖБЕ НА СТРАНИЦУ, А НЕ ПО ОДНОМУ НА РАЗДЕЛ. Служба ходит в
  // Telegram за именем бота, то есть вызов не бесплатный; и разделы обязаны
  // показывать ОДНО состояние, а не каждый своё, снятое в разные секунды.
  const channels = await readChannels()

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: ui.title }, { label: ui.pages[active].title }]}
          eyebrow={t.layer}
          title={ui.title}
          subtitle={ui.subtitle}
        />

        <WorkspaceShell
          id="telegram"
          menuTitle={ui.menuTitle}
          menuWord={t.menuTitle}
          menu={TELEGRAM_SECTIONS.map(id => ({
            label: ui.pages[id].title,
            href: hrefOfTelegramSection(lang, id),
            active: id === active,
          }))}
          title={ui.pages[active].title}
          lead={ui.pages[active].hint}
        >
          {/* 🔒 СОСТОЯНИЕ ЧИТАЕТ СЕРВЕР ДО ОТДАЧИ HTML (77-3) — как это делала
              панель. Значит без JS видно главное: жива ли служба каналов, сохранён
              ли токен, узнаёт ли его сам Telegram, привязан ли чат. Признаки стоят
              на контейнере раздела, а не внутри островка: островок появляется
              позже, а правда о боте нужна разметке сразу. */}
          <div
            data-telegram-page
            data-telegram-section={active}
            data-channels-available={String(channels.available)}
            data-telegram-configured={String(Boolean(channels.telegram?.configured))}
            data-telegram-reachable={String(Boolean(channels.telegram?.reachable))}
            data-telegram-linked={String(Boolean(channels.telegram?.chatId))}
            className="flex min-w-0 flex-1 flex-col gap-6"
          >
            {/* 🔒 «ОПИСАНИЕ» БЕРЁТ ОБЩУЮ СВЁРНУТУЮ СПРАВКУ, А НЕ СВОЮ. Тот же
                островок, что у блоков и у инструментов; третий экземпляр разошёлся
                бы с первыми двумя на первой правке текста.

                🔒 КЛЮЧ — САМ РАЗДЕЛ: уход на другой раздел и обратно даёт новый
                экземпляр, то есть снова свёрнутый вид.

                🪦 «ЗДЕСЬ БУДЕТ ТЕКСТ ВЛАДЕЛЬЦА» — БОЛЬШЕ НЕ ТАК (77-6). Описание
                написано по первоисточникам: коду службы каналов и продукта.
                Строки `aboutSoonTitle`/`aboutSoon` остались в словаре историей. */}
            {active === "about" && (
              <>
                <SectionIntro
                  name="telegram-about"
                  key={active}
                  moreLabel={ui.helpMore}
                  lessLabel={ui.helpLess}
                  summary={
                    <Small>
                      <strong className="text-foreground">{ui.about.whatTitle}</strong>{" "}
                      {ui.about.what}
                    </Small>
                  }
                  rest={
                    <Small>
                      <strong className="text-foreground">{ui.about.arrangedTitle}</strong>{" "}
                      {ui.about.arranged}
                    </Small>
                  }
                />
                <TelegramAbout ui={ui} />
              </>
            )}

            {/* 🔒 «НАСТРОЙКИ» ПЕРЕЕХАЛИ ИЗ ПАНЕЛИ ЦЕЛИКОМ (77-4): справка сверху,
                состояние и форма ниже. Справка — тот же общий островок, что у
                «Описания»: четыре её блока объясняют ровно то, что на этом
                экране делают, и в источнике они лежали на той же странице. */}
            {active === "settings" && (
              <>
                <SectionIntro
                  name="telegram-settings"
                  key={active}
                  moreLabel={ui.helpMore}
                  lessLabel={ui.helpLess}
                  summary={
                    <Small>
                      <strong className="text-foreground">{ui.settings.helpWhatTitle}</strong>{" "}
                      {ui.settings.helpWhat}
                    </Small>
                  }
                  rest={
                    <div className="flex flex-col gap-2">
                      <Small>
                        <strong className="text-foreground">{ui.settings.helpWhyTitle}</strong>{" "}
                        {ui.settings.helpWhy}
                      </Small>
                      <Small>
                        <strong className="text-foreground">{ui.settings.helpLinkTitle}</strong>{" "}
                        {ui.settings.helpLink}
                      </Small>
                      <Small>
                        <strong className="text-foreground">{ui.settings.helpOffTitle}</strong>{" "}
                        {ui.settings.helpOff}
                      </Small>
                    </div>
                  }
                />
                <TelegramSettings state={channels} ui={ui} />
              </>
            )}

            {/* 🔒 «ЛОГИ» — ЕДИНСТВЕННЫЙ РАЗДЕЛ ВХОДА, КОТОРЫЙ НЕ ПЕРЕНОС (77-5).
                В панели такого экрана нет: служба хранила входящие с самого
                начала, и читал их только код. Способность не новая — новой стала
                поверхность, на которой её видно. */}
            {active === "logs" && <TelegramLogsSection state={channels} ui={ui} />}
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}
