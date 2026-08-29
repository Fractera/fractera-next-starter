import Link from "next/link"
import { Check } from "lucide-react"
import { DEV_MODES, isAlphaMode, type DevMode } from "../_lib/dev-mode"
import type { DevModeUi } from "../_i18n/dev-mode.i18n"

// ЧЕТЫРЕ ПОДВКЛАДКИ РЕЖИМА (33-1, 2026-08-29). Серверный компонент: ничего не
// решает в браузере — выбранная вкладка живёт в адресе.
//
// 🔒 ВКЛАДКА ВЫБИРАЕТСЯ АДРЕСОМ, А НЕ СОСТОЯНИЕМ ОСТРОВКА. Ссылку на конкретный
// режим пересылают и открывают из закладки; вкладка, живущая в памяти, теряется
// при обновлении страницы, и человек каждый раз возвращается на первую.
//
// 🔒 ЭТО ВТОРОЙ УРОВЕНЬ МЕНЮ, И ОН ВЫГЛЯДИТ ИНАЧЕ, ЧЕМ ПЕРВЫЙ. Левое меню слоя —
// вертикальный столбец разделов; здесь горизонтальный ряд внутри одного раздела.
// Одинаковый вид у двух уровней читается как одно меню, показанное дважды.
//
// 🔒 ОТМЕТКА «ДЕЙСТВУЕТ СЕЙЧАС» СТОИТ У ВКЛАДКИ, А НЕ ТОЛЬКО ВНУТРИ КАРТОЧКИ.
// Человек приходит сюда с вопросом «в каком режиме мой проект» — ответ обязан
// читаться до того, как он выберет вкладку, иначе за ответом придётся обойти все
// четыре.
export function DevModeMenu({
  lang,
  active,
  current,
  ui,
}: {
  lang: string
  /** Открытая вкладка. */
  active: DevMode
  /** Режим, записанный в конфиге, — у него отметка. */
  current: DevMode
  ui: DevModeUi
}) {
  return (
    <nav data-dev-mode-menu aria-label={ui.title} className="border-b border-border">
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1">
        {DEV_MODES.map(mode => {
          const isActive = mode === active
          const isCurrent = mode === current
          return (
            <li key={mode} className="shrink-0">
              <Link
                href={`/${lang}/architect/dev-mode?mode=${mode}`}
                data-dev-mode-tab={mode}
                data-dev-mode-tab-current={isCurrent ? "true" : "false"}
                aria-current={isActive ? "page" : undefined}
                className={
                  "flex items-center gap-2 whitespace-nowrap rounded-t-md border-b-2 px-4 py-3 text-[length:var(--fs-body)] transition-colors " +
                  (isActive
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground")
                }
              >
                {ui.modes[mode].label}
                {/* 🔒 КРАСНЫЙ БЕЙДЖ АЛЬФЫ СТОИТ ДО ВЫБОРА, А НЕ ВНУТРИ РЕЖИМА.
                    Человек читает список и решает, куда идти; предупреждение,
                    спрятанное за щелчком, он увидит уже выбрав. */}
                {isAlphaMode(mode) && (
                  <span
                    data-mode-alpha={mode}
                    className="shrink-0 rounded-full bg-destructive px-2 py-0.5 text-[length:var(--fs-small)] leading-none text-destructive-foreground"
                  >
                    {ui.alpha}
                  </span>
                )}
                {isCurrent && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
