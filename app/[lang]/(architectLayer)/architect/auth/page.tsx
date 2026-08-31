import { PageHeader } from "@/components/content-page/page-header.server"
import { Small } from "@/components/ui/typography"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { authUi } from "../../_i18n/auth.i18n"
import { AUTH_SECTIONS, resolveAuthSection, hrefOfAuthSection } from "../../_lib/auth-sections"
import { SectionIntro } from "../../_components/section-intro.client"
import { AuthProvider } from "../../_components/auth-provider"
import { readAuthMethods } from "@/lib/architect/auth-methods"

// АВТОРИЗАЦИЯ — ПЯТЫЙ ВХОД СЛОЯ АРХИТЕКТОРА (78-1, 2026-08-31).
//
// 🔒 УСТРОЙСТВО ОДИН В ОДИН С `architect/telegram/page.tsx` (77-1) — прямое
// требование владельца: «создать очень близкую заглушку, которая также будет
// иметь интерфейс `workspace02`… в точности повтори работу». Одинаковые входы
// обязаны быть одинаковыми и внутри: расхождение в устройстве всплывает не
// глазами, а на первой же общей правке.
//
// 🔒 РАСКЛАДКА ОБЩАЯ, А НЕ ПЯТАЯ КОПИЯ. `WorkspaceShell` зовётся, а не
// переписывается. Федеральный закон называет четвёртую копию пары «меню плюс
// колонка» порогом, за которым расхождение перестаёт замечаться; здесь она была
// бы пятой.
//
// 🔒 ЭТО СКЕЛЕТ, И ОН НАЗЫВАЕТ СЕБЯ СКЕЛЕТОМ. Владелец: «в остальном пока только
// заглушку». Разделы провайдеров показывают честную заглушку с адресом, где это
// работает СЕЙЧАС. ✗ молчащая заглушка читается как поломка — оплачено в 28-13.
//
// 🔒 ПАНЕЛЬНАЯ ВКЛАДКА «СПОСОБЫ ВХОДА» ОСТАЁТСЯ ЖИВОЙ. Решение владельца
// 2026-08-31: «не будем полностью избавляться от 3002, пусть остаётся». Пока
// логика не переехала, настройка обязана быть доступной там, где она есть, — тот
// же порядок, что в шаге 31: перенос → сверка полноты → и только потом удаление.
//
// 🔒 РАЗДЕЛ ВЫБИРАЕТСЯ ПАРАМЕТРОМ, А НЕ ОТДЕЛЬНЫМ МАРШРУТОМ — как у четырёх
// соседей: у трёх разделов одна шапка, и развёрстка по маршрутам дала бы три её
// копии.
//
// Динамическая: содержимое разделов станет живым, как только приедет логика.
export const dynamic = "force-dynamic"

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ section?: string }>
}) {
  const { lang } = await params
  const { section: rawSection } = await searchParams

  const t = architectLayerUi(lang)
  const ui = authUi(lang)
  const active = resolveAuthSection(rawSection)

  // 🔒 ЧИТАЕТСЯ НА СЕРВЕРЕ И ТОЛЬКО МАСКИ. Секреты в браузер не уезжают ни разу,
  // даже ради показа: `readAuthMethods()` возвращает `mask()`, а не значение.
  const methods = readAuthMethods()

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
          id="auth"
          menuTitle={ui.menuTitle}
          menuWord={t.menuTitle}
          menu={AUTH_SECTIONS.map(id => ({
            label: ui.pages[id].title,
            href: hrefOfAuthSection(lang, id),
            active: id === active,
          }))}
          title={ui.pages[active].title}
          lead={ui.pages[active].hint}
        >
          <div data-auth-page data-auth-section={active} className="flex min-w-0 flex-1 flex-col gap-6">
            {/* 🔒 «ОПИСАНИЕ» БЕРЁТ ОБЩУЮ СВЁРНУТУЮ СПРАВКУ — третий её потребитель
                после блоков и инструментов. Третий экземпляр разошёлся бы с
                первыми двумя на первой правке текста.

                🔒 КЛЮЧ — САМ РАЗДЕЛ: уход на другой раздел и обратно даёт новый
                экземпляр, то есть снова свёрнутый вид.

                🛑 ЗДЕСЬ БУДЕТ ТЕКСТ И ИЗОБРАЖЕНИЕ ВЛАДЕЛЬЦА. Пока их нет, справка
                говорит об этом прямо, а не показывает пустой контейнер. */}
            {active === "about" && (
              <SectionIntro
                name="auth-about"
                key={active}
                moreLabel={ui.helpMore}
                lessLabel={ui.helpLess}
                summary={
                  <Small>
                    <strong className="text-foreground">{ui.m.helpWhatTitle}</strong> {ui.m.helpWhat}
                  </Small>
                }
                rest={
                  <>
                    <Small>
                      <strong className="text-foreground">{ui.m.helpWhySecureTitle}</strong> {ui.m.helpWhySecure}
                    </Small>
                    <Small>
                      <strong className="text-foreground">{ui.m.helpEmptyTitle}</strong> {ui.m.helpEmpty}
                    </Small>
                    <Small>
                      <strong className="text-foreground">{ui.m.helpSecretsTitle}</strong> {ui.m.helpSecrets}
                    </Small>
                  </>
                }
              />
            )}

            {/* 🪦 ЗАГЛУШКИ ПРОВАЙДЕРОВ СТАЛИ РАБОЧИМИ СЕКЦИЯМИ (78-3, разрешение
                владельца: «в целом ты можешь полностью перенести авторизацию»).
                В 78-1 здесь стоял `SectionSoon` с адресом панельной вкладки —
                осознанное промежуточное состояние, а не забытый долг. Надгробие
                оставлено: иначе следующая сессия прочитает исчезновение заглушки
                как потерю и вернёт её.

                🔒 ОДИН КОМПОНЕНТ НА ОБА ПРОВАЙДЕРА — решение источника, а не моё:
                у Google и у почтовой ссылки одинаковый экран. */}
            {active !== "about" && (
              <AuthProvider kind={active} state={methods} ui={ui} />
            )}
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}
