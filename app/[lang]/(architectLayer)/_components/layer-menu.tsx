import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { H3, Small } from "@/components/ui/typography"
import { ARCHITECT_GROUPS } from "../_lib/architect-menu"
import type { ArchitectLayerUi } from "../_i18n/architect-layer.i18n"

// ЛЕВОЕ МЕНЮ СЛОЯ (31-3, 2026-08-28). Серверный компонент: ничего не решает в
// браузере, поэтому и островком быть незачем.
//
// 🔒 ДВА РОДА ПУНКТОВ, И РАЗЛИЧИЕ ВИДНО ГЛАЗОМ, А НЕ ТОЛЬКО ПО АДРЕСУ. Готовая
// группа — обычная ссылка внутри страницы; неготовая помечена словом «в панели» и
// значком внешнего перехода. Человек, нажавший на неё, уходит на другой домен, и
// узнать об этом он должен ДО нажатия, а не после.
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
    <nav data-layer-menu aria-label={ui.menuTitle} className="shrink-0 md:w-60">
      <H3 variant="ui" className="mb-3">{ui.menuTitle}</H3>
      <ul className="flex flex-col gap-1">
        {ARCHITECT_GROUPS.map(group => {
          const label = ui.groups[group.id] ?? group.id
          const base = "block rounded-md px-3 py-2 text-[length:var(--fs-body)] transition-colors"

          if (group.state.kind === "here") {
            const isActive = group.id === active
            return (
              <li key={group.id}>
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
            <span className="flex items-center justify-between gap-2">
              <span>{label}</span>
              <Small className="shrink-0">{ui.inPanel}</Small>
            </span>
          )

          return (
            <li key={group.id}>
              {href ? (
                <a
                  href={href}
                  rel="nofollow"
                  data-group={group.id}
                  data-in-panel="true"
                  className={base + " text-muted-foreground hover:bg-muted/60 hover:text-foreground"}
                >
                  {inner}
                  <ExternalLink className="sr-only" aria-hidden />
                </a>
              ) : (
                <span data-group={group.id} data-in-panel="true" className={base + " text-muted-foreground"}>
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
