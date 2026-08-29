import { ArrowUpRight } from "lucide-react"
import { H3, P, Small } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import type { ProductDossier } from "@/config/products-config.defaults"
import type { DevModeUi } from "../_i18n/dev-mode.i18n"

// СПИСОК ПРОДУКТОВ — НАВИГАЦИЯ ЗДЕСЬ, РАБОТА В ПАНЕЛИ (решение владельца 2026-08-29).
//
// 🔒 ДОСЛОВНО: «вкладка продукты этого проекта показывает карточки проекта,
// нажатие на карточку открывает соответствующий продукт в административной панели,
// там где он ещё существует… для навигации используем новую архитектуру, для
// работы старую».
//
// ✗ ЧЕМ ЭТО ОПЛАЧЕНО. Я потратил день на перенос хранилища, дверей, Quiz и доски
// кейсов — и получил вторую реализацию того, что уже работает. Владелец: «это
// просто издевательство надо мной… нажатие на кнопку создать новый продукт
// отправляет меня на несуществующую страницу». Всё перенесённое удалено тем же
// коммитом, что появился этот файл.
//
// 🔒 ПРАВИЛО, КОТОРОЕ ИЗ ЭТОГО СЛЕДУЕТ: «ПЕРЕНЕСТИ» И «СВЯЗАТЬ» — РАЗНЫЕ РАБОТЫ,
// И ВЫБИРАЕТ МЕЖДУ НИМИ ВЛАДЕЛЕЦ, А НЕ Я. Пока способность живёт и работает в
// панели, новый слой обязан ВЕСТИ к ней, а не заводить свою копию: копия стоит
// дня работы, расходится с оригиналом на первой же правке и ломается там, где
// оригинал цел.
//
// 🔒 СЕРВЕРНЫЙ КОМПОНЕНТ. Здесь нечему быть островком: список читается на сервере,
// карточка — обычная ссылка. Состояния в браузере у этого экрана нет вовсе.
export function ProductsList({
  products,
  lang,
  adminUrl,
  ui,
}: {
  products: ProductDossier[]
  lang: string
  /** Адрес панели. Пусто — настроек ещё нет, и карточка не ведёт никуда. */
  adminUrl: string
  ui: DevModeUi
}) {
  const t = ui.products

  return (
    <section data-products-list className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <H3 variant="ui">{t.title}</H3>
        <Small className="max-w-3xl">{t.hint}</Small>
      </div>
      <Separator />

      {products.length === 0 ? (
        <div data-products-empty className="flex flex-col gap-1 rounded-lg border border-dashed border-border px-4 py-6">
          <P className="text-[length:var(--fs-body)]">{t.empty}</P>
          <Small className="max-w-2xl">{t.emptyHint}</Small>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {products.map(p => {
            const confirmed = p.cases.filter(c => c.confirmed).length
            const href = adminUrl ? `${adminUrl}/${lang}/products/${p.id}` : ""
            const inner = (
              <>
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[length:var(--fs-body)] font-medium text-foreground">
                      {p.title || p.id}
                    </span>
                    <Small className="block truncate font-mono">
                      {p.id} · {p.route || "—"} · {p.surface}
                    </Small>
                  </span>
                  {/* Значок внешнего перехода: карточка уводит на другой адрес, и
                      сказать об этом обязана до нажатия, а не после. */}
                  {href && <ArrowUpRight className="size-4 shrink-0 opacity-60" aria-hidden />}
                </span>

                {/* Счёт кейсов — ответ на вопрос «сколько тут работы», читаемый
                    без открытия продукта. */}
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    data-product-phase={p.phase}
                    className="rounded-full border border-border px-3 py-1 text-[length:var(--fs-small)] text-muted-foreground"
                  >
                    {p.phase}
                  </span>
                  <span data-product-cases={p.cases.length} className="text-[length:var(--fs-small)] text-muted-foreground">
                    {confirmed}/{p.cases.length}
                  </span>
                </span>
              </>
            )

            const className =
              "flex flex-col gap-3 rounded-2xl border border-border p-5 transition-colors " +
              (href ? "hover:border-primary/50 hover:bg-muted/40" : "opacity-70")

            // 🔒 БЕЗ АДРЕСА ПАНЕЛИ КАРТОЧКА НЕ ССЫЛКА. Ссылка в никуда хуже её
            // отсутствия: человек нажимает и попадает на несуществующую страницу —
            // ровно то, на что владелец и указал.
            return (
              <li key={p.id} data-product={p.id}>
                {href ? (
                  <a href={href} rel="nofollow" data-product-link={p.id} className={className}>
                    {inner}
                  </a>
                ) : (
                  <div className={className}>{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
