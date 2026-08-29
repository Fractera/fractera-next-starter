import "server-only"
import { mutate, readProduct } from "./product-store"

// ШАГ РАЗБОРА — РОЖДАЕТСЯ В ДОСЬЕ, А НЕ В ТАБЛИЦЕ (34-B, 2026-08-29).
//
// 🔒 ЕДИНСТВЕННОЕ СОДЕРЖАТЕЛЬНОЕ ОТКЛОНЕНИЕ ОТ ИСТОЧНИКА, И ОНО НАЗВАНО ВСЛУХ.
// В панели это `lib/dev-steps.ts`: шаг пишется в таблицу `development_steps`
// базы `/opt/fractera/app/data/app.db` — панель живёт СНАРУЖИ слота и дотягивается
// до его базы напрямую. Здесь такой ход невозможен и не нужен: **у продукта уже
// есть свой список шагов внутри досье** (`steps[]`), и он — то самое оглавление,
// которое панель отдельно дописывала в `PRODUCTS-CONFIG` после записи в таблицу.
//
// То есть источник вёл ОДИН факт в ДВУХ местах и сам называл это дефектом:
// «оглавление, которое заполняет ОДИН из двух писателей, хуже отсутствующего».
// Здесь второго места нет — значит и расходиться нечему.
//
// 🔒 ЗАГОЛОВОК И ЗАДАНИЕ ПЕРЕНЕСЕНЫ ДОСЛОВНО. Их же печатает MCP панели, и два
// пути к одному состоянию обязаны давать ОДИНАКОВУЮ запись: иначе владелец увидит
// разный текст в зависимости от того, кто успел первым, и решит, что шагов два
// разных вида. Английский — машинный слой: это задание читает агент.

const DECOMPOSITION_TITLE =
  "decompose confirmed use cases into an ordered development step queue"

const DECOMPOSITION_PLAN =
  "Read every confirmed use case of this product and turn it into an ordered queue of development "
  + "steps through steps_create.\n\n"
  + "The FIRST step of that queue is always the same and is not negotiable: the minimal working "
  + "skeleton — the whole architecture present in the filesystem, the API routes in place, and "
  + "navigation walking end to end on stubs. Nothing real behind it yet. Everything after it fills "
  + "the stubs in, one case at a time.\n\n"
  + "Every step names the cases it serves and carries a title of 6-12 words. When the queue is "
  + "written, close this step with steps_close."

/**
 * Завести шаг разбора, если его ещё нет.
 *
 * 🔒 ИДЕМПОТЕНТНА, КАК И ИСТОЧНИК. Её зовут дважды разными путями — при
 * подтверждении кейса и на входе агента в сессию; второй вызов обязан вернуть
 * существующий номер, а не завести второй такой же шаг.
 *
 * Ничего не делает, пока не подтверждён ни один кейс: разбирать нечего.
 */
export function ensureDecompositionStep(
  productId: string,
  confirmedCaseIds: string[],
): { created: boolean; number: number } | null {
  if (!productId || !confirmedCaseIds.length) return null

  const product = readProduct(productId)
  if (!product) return null

  const existing = product.steps.find(s => s.kind === "decomposition")
  if (existing) return { created: false, number: existing.number }

  // 🔒 НОМЕР — СЛЕДУЮЩИЙ ПОСЛЕ НАИБОЛЬШЕГО, А НЕ ДЛИНА СПИСКА. Отменённый или
  // удалённый шаг не должен освобождать свой номер: на номера ссылаются итоги,
  // коммиты и разговоры. То же правило, по которому живёт `maxId` продуктов.
  const number = product.steps.reduce((m, s) => Math.max(m, s.number), 0) + 1
  const now = new Date().toISOString()

  mutate(productId, p => {
    p.steps.push({
      number,
      title: DECOMPOSITION_TITLE,
      status: "new",
      importance: "critical",
      kind: "decomposition",
      cases: confirmedCaseIds,
      plan: DECOMPOSITION_PLAN,
      result: "",
      createdAt: now,
      updatedAt: now,
    })
  })

  return { created: true, number }
}
