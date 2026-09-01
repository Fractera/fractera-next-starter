// @api read the breakdown of the current request
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readTask, isStale } from "@/lib/task/store"

// ДВЕРЬ РАЗБОРА ЗАПРОСА (91-2).
//
// 🔒 ТОЛЬКО ЧТЕНИЕ, И ДВЕРИ НА ЗАПИСЬ НЕ БУДЕТ. Объект рождается из ВХОДЯЩЕГО
// СООБЩЕНИЯ, а не из браузера: разбор — это то, что система сделала сама, и
// возможность положить туда что-нибудь снаружи превратила бы экран наблюдения
// в экран сочинения.
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ. Объект несёт текст сообщений человека
// целиком — то есть личные данные, — и проверку в браузере в браузере же и
// отключают.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const task = await readTask()

  // 🔒 «РАЗБОРА НЕТ» — ЗАКОННЫЙ ОТВЕТ 200, А НЕ 404. Пустой стол не есть
  // отсутствие маршрута: 404 читается как «страница сломалась», и человек идёт
  // чинить то, что работает.
  return NextResponse.json(
    { ok: true, task, stale: task ? isStale(task) : false },
    { headers: { "Cache-Control": "no-store" } },
  )
}
