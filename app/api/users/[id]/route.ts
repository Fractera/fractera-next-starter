// @api change the roles of one user account through the auth service
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { authBaseFromHost } from "@/lib/auth-base-server"
import { ALL_ROLES } from "@/lib/roles"

// Смена ролей одной учётной записи. Правило то же, что у соседней двери: право
// проверяется здесь И у службы, адрес выводится из заголовка запроса, cookie
// посетителя едет дальше.
//
// 🔒 ПРИНИМАЕМ ТОЛЬКО РОЛИ, КОТОРЫЕ ЗНАЕТ ПРИЛОЖЕНИЕ. Тело запроса приходит из
// браузера, то есть от кого угодно: без сверки со списком `ALL_ROLES` сюда
// можно было бы записать любую строку, и она осела бы в базе людей навсегда.
// Роль, которой нет в приложении, не отказывает громко — она просто ничего не
// открывает, и разбираться в этом будут через месяцы.
//
// 🔒 ПУСТОЙ СПИСОК ЗАПРЕЩЁН. Учётная запись без единой роли перестаёт быть
// кем-либо: она не гость (гость — это отсутствие записи) и не пользователь.
// Такое состояние не создаётся случайной отправкой формы.
export const runtime = "nodejs"

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireRoles(req, ["architect"])
  if (denied) return denied

  const { id } = await ctx.params
  const body = (await req.json().catch(() => null)) as { roles?: unknown } | null
  const roles = Array.isArray(body?.roles) ? body.roles.filter((r): r is string => typeof r === "string") : null

  if (!roles || roles.length === 0) {
    return NextResponse.json({ error: "roles required" }, { status: 400 })
  }
  const unknown = roles.filter(r => !(ALL_ROLES as readonly string[]).includes(r))
  if (unknown.length > 0) {
    return NextResponse.json({ error: `unknown roles: ${unknown.join(", ")}` }, { status: 400 })
  }

  const base = authBaseFromHost(
    req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
    req.headers.get("x-forwarded-proto") ?? "http",
  )

  try {
    const res = await fetch(`${base}/api/admin/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { cookie: req.headers.get("cookie") ?? "", "content-type": "application/json" },
      body: JSON.stringify({ roles }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      // Служба знает про себя больше нас: она же не даёт снять `architect` с
      // самого себя. Её причину передаём как есть, а не подменяем своей.
      return NextResponse.json({ error: data?.error ?? "auth service refused" }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "auth service unreachable" }, { status: 502 })
  }
}
