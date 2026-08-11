import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSession } from "./get-session"
import { PROTECTED_GROUP_ROLES, type ProtectedGroup } from "@/lib/roles"

// 🔒 НАСТОЯЩИЙ ЗАМОК ЗАЩИЩЁННОГО СЛОЯ. Всё остальное — вывеска.
//
// Страница проверяет роль на клиенте (`AccessGate`), и это честная вывеска: она
// объясняет человеку, почему его не пустили. Но проверку в браузере в браузере же
// и отключают, а адрес маршрута данных виден в любой вкладке разработчика.
// Поэтому маршрут, отдающий защищённые данные, обязан спросить роль сам.
//
// Чего НЕ делает за нас `proxy.ts`: он требует лишь наличие сессии — то есть
// пускает ЛЮБОГО авторизованного к данным ЛЮБОЙ роли. Этого достаточно, чтобы
// отсечь анонима, и недостаточно для всего остального.
//
// Возвращает `null`, когда доступ есть, и готовый ответ, когда нет: вызывающий
// пишет одну строку и не может забыть вернуть отказ.
export async function requireRoles(
  req: NextRequest,
  allowed: readonly string[],
): Promise<NextResponse | null> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const mine = session.roles ?? []
  if (!mine.some(r => allowed.includes(r))) {
    // 403, а не 404: человек авторизован, и скрывать существование маршрута не
    // от кого. Ответ называет требуемые роли — интерфейсу есть что показать.
    return NextResponse.json({ error: "Forbidden", requires: allowed }, { status: 403 })
  }
  return null
}

/**
 * К каким слоям прав принадлежит вызывающий.
 *
 * Нужно там, где доступ решается не «пустить/не пустить», а «что именно можно»:
 * персонал правит карточку товара целиком, финансист — только цену. Двумя
 * вызовами `requireRoles` подряд это не выражается: каждый читает сессию заново
 * и каждый умеет только отказать целиком.
 *
 * Возвращает пустой список и для анонима — вызывающий отличает его сам, если
 * различие ему важно.
 */
export async function groupsOf(req: NextRequest): Promise<ProtectedGroup[]> {
  const session = await getSession(req)
  const mine = session?.roles ?? []
  return (Object.keys(PROTECTED_GROUP_ROLES) as ProtectedGroup[])
    .filter(g => PROTECTED_GROUP_ROLES[g].some(r => mine.includes(r)))
}
