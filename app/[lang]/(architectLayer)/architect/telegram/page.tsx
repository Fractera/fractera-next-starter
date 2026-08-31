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
import { SectionSoon } from "../../_components/section-soon"

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
// 🔒 ЭТО СКЕЛЕТ, И ОН НАЗЫВАЕТ СЕБЯ СКЕЛЕТОМ. Владелец сказал: «о содержимом
// правой вкладки я тебе расскажу позже — создавай скелет». Разделы «Логи» и
// «Настройки» показывают честную заглушку с адресом, где это работает СЕЙЧАС.
// ✗ молчащая заглушка читается как поломка — оплачено в 28-13.
//
// 🔒 ПАНЕЛЬНАЯ ВКЛАДКА ОСТАЁТСЯ ЖИВОЙ. Решение владельца 2026-08-31: «не будем
// полностью избавляться от 3002, пусть остаётся». Пока логика не переехала,
// настройка обязана быть доступной там, где она есть, — тот же порядок, что в
// шаге 31.
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
          <div
            data-telegram-page
            data-telegram-section={active}
            className="flex min-w-0 flex-1 flex-col gap-6"
          >
            {/* 🔒 «ОПИСАНИЕ» БЕРЁТ ОБЩУЮ СВЁРНУТУЮ СПРАВКУ, А НЕ СВОЮ. Тот же
                островок, что у блоков и у инструментов; третий экземпляр разошёлся
                бы с первыми двумя на первой правке текста.

                🔒 КЛЮЧ — САМ РАЗДЕЛ: уход на другой раздел и обратно даёт новый
                экземпляр, то есть снова свёрнутый вид.

                🛑 ЗДЕСЬ БУДЕТ ТЕКСТ И ИЗОБРАЖЕНИЕ ВЛАДЕЛЬЦА. Пока их нет, справка
                говорит об этом прямо, а не показывает пустой контейнер. */}
            {active === "about" && (
              <SectionIntro
                name="telegram-about"
                key={active}
                moreLabel={ui.helpMore}
                lessLabel={ui.helpLess}
                summary={
                  <Small>
                    <strong className="text-foreground">{ui.aboutSoonTitle}</strong> {ui.aboutSoon}
                  </Small>
                }
                rest={null}
              />
            )}

            {/* 🔒 ДВЕ ЗАГЛУШКИ — ОДИН КОМПОНЕНТ. Они отличаются только словами
                раздела; два блока, написанные по отдельности, разъехались бы, и
                это уже замерено на анатомии шага (28-2). */}
            {active !== "about" && (
              <SectionSoon
                section={active}
                title={ui.soonTitle}
                lead={ui.soonLead}
                whereLabel={ui.soonWhere}
                where={ui.soonPanel}
              />
            )}
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}
