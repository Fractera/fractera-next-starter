import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { H3 } from "@/components/ui/typography"
import { ARCHITECT_GROUPS } from "../_lib/architect-menu"
import type { ArchitectLayerUi } from "../_i18n/architect-layer.i18n"

// ЛЕВОЕ МЕНЮ СЛОЯ (31-3, 2026-08-28). Серверный компонент: ничего не решает в
// браузере, поэтому и островком быть незачем.
//
// 🔒 СЛОВА «В ПАНЕЛИ» ЗДЕСЬ БОЛЬШЕ НЕТ — ПРЯМОЕ УКАЗАНИЕ ВЛАДЕЛЬЦА 2026-08-28:
// «в левом меню ты используешь слово „в панели“, чтобы показать, что интерфейс ещё
// не готов, — убери его, пусть будет так, что всё готово». Пометка описывала не
// пункт, а СОСТОЯНИЕ НАШЕЙ РАБОТЫ, и человеку, который открыл свой проект, знать о
// нашем переезде незачем: для него это просто раздел настроек.
//
// 🔒 НО ВНЕШНИЙ ПЕРЕХОД ОСТАЁТСЯ ОБОЗНАЧЕННЫМ — ЗНАЧКОМ, А НЕ СЛОВОМ. Стрелка «в
// другое окно» не говорит ничего о готовности: это обычная типографская
// конвенция, и человек читает её как «откроется вне страницы». Убрать вместе со
// словом и её значило бы увести на другой домен молча.
//
// 🔒 СОСТАВ И ПОРЯДОК — ИЗ `_lib/architect-menu.ts`. Здесь только рисование:
// список, набранный в разметке руками, расходится с законом молча.
//
// 🔒 ШКАЛА ШРИФТА — СТРАНИЦЫ. Заголовок меню `H3`, пункты `--fs-body`. Требование
// владельца 2026-08-28: «в панели всё очень мелко… хочу правильной высоты шрифт,
// в едином стиле со страницей».
export function LayerMenu({
  lang,
  active,
  adminUrl,
  ui,
}: {
  lang: string
  /** Открытая группа — её пункт помечен и не является ссылкой. */
  active: string
  /**
   * Адрес панели, выведенный из адреса сайта. `null` — настроек ещё нет, адрес
   * неизвестен, и пункт показывается без ссылки: выдуманный адрес панели хуже
   * отсутствующего.
   */
  adminUrl: string | null
  ui: ArchitectLayerUi
}) {
  return (
    // 🔒 ОДНО МЕНЮ, ДВА ПОЛОЖЕНИЯ (заказ владельца 2026-08-28): на широком экране
    // оно левое и вертикальное, на узком становится ВЕРХНИМ — рядом кнопок с
    // горизонтальной прокруткой. Это не «то же меню поуже»: восемь вертикальных
    // пунктов на телефоне съедают экран целиком, и человек прокручивает страницу,
    // не дойдя до полей, ради которых пришёл.
    //
    // 🔒 РАЗДЕЛИТЕЛЬ ЕДЕТ ВСЛЕД ЗА МЕНЮ. Наверху граница нижняя, слева — правая:
    // линия отделяет меню от содержимого, а с какой оно стороны, решает ширина.
    // Оставить правую границу у верхнего ряда значило бы прочертить экран поперёк
    // чтения.
    <nav
      data-layer-menu
      aria-label={ui.menuTitle}
      className="shrink-0 border-b border-border pb-3 md:w-60 md:border-r md:border-b-0 md:pr-6"
    >
      <H3 variant="ui" className="mb-3">{ui.menuTitle}</H3>
      {/* 🔒 ОТРИЦАТЕЛЬНЫЙ ОТСТУП + `px-1` — чтобы полоса прокрутки не обрезала
          подсветку крайних пунктов: фон активного пункта шире его текста, и без
          этого зазора он упирался бы в край и выглядел срезанным. */}
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-col md:overflow-x-visible">
        {ARCHITECT_GROUPS.map(group => {
          const label = ui.groups[group.id] ?? group.id
          // 🔒 В ВЕРТИКАЛЬНОМ МЕНЮ ДЛИННОЕ НАЗВАНИЕ ОБРЕЗАЕТСЯ МНОГОТОЧИЕМ, В
          // ГОРИЗОНТАЛЬНОМ — НЕТ, И ЭТО НЕ НЕПОСЛЕДОВАТЕЛЬНОСТЬ. Слева ширина задана
          // (`md:w-60`), и «Параллельная маршрутизация» вылезала за границу меню — на
          // это владелец и указал 2026-08-28: «если она не помещается в своей области,
          // пусть заканчивается — например: параллельная Мар…». Наверху ширины нет
          // вовсе: ряд прокручивается, ширину пункту даёт его содержимое, и многоточие
          // там появилось бы у КАЖДОГО пункта, ничего не решив.
          const base =
            "block whitespace-nowrap rounded-md px-3 py-2 text-[length:var(--fs-body)] transition-colors md:truncate"

          if (group.state.kind === "here") {
            const isActive = group.id === active
            return (
              <li key={group.id} className="shrink-0 md:shrink">
                <Link
                  href={`/${lang}/architect/app-config?group=${group.id}`}
                  data-group={group.id}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    base +
                    (isActive
                      ? " bg-muted font-medium text-foreground"
                      : " text-muted-foreground hover:bg-muted/60 hover:text-foreground")
                  }
                >
                  {label}
                </Link>
              </li>
            )
          }

          const href = adminUrl ? `${adminUrl}/${lang}/${group.state.slug}` : null
          const inner = (
            <span className="flex items-center gap-2">
              {/* 🔒 ОБРЕЗАЕТСЯ ИМЕННО ЭТА ЧАСТЬ, А НЕ ПУНКТ ЦЕЛИКОМ. Многоточие
                  должно съедать длинное НАЗВАНИЕ, оставляя значок на месте: обрежь
                  строку вместе со значком — и признак внешнего перехода исчезнет
                  ровно у тех пунктов, где название длиннее всего. */}
              <span className="md:truncate">{label}</span>
              <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
            </span>
          )

          return (
            <li key={group.id} className="shrink-0 md:min-w-0 md:shrink">
              {href ? (
                <a
                  href={href}
                  rel="nofollow"
                  data-group={group.id}
                  data-in-panel="true"
                  title={label}
                  className={base + " text-muted-foreground hover:bg-muted/60 hover:text-foreground"}
                >
                  {inner}
                </a>
              ) : (
                <span data-group={group.id} data-in-panel="true" title={label} className={base + " text-muted-foreground"}>
                  {inner}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
