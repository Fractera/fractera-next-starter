// @api list user accounts from the auth service for the administration page
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { authBaseFromHost } from "@/lib/auth-base-server"

// Список учётных записей. Строки принадлежат службе авторизации `:3001`, а не
// приложению: здесь нет ни таблицы `users`, ни её копии, и заводить их нельзя —
// вторая копия людей разошлась бы с первой в тот же день, когда кто-то сменит
// почту.
//
// 🔒 ПОЧЕМУ ЭТА ДВЕРЬ ВООБЩЕ СУЩЕСТВУЕТ, ЕСЛИ СТРАНИЦА МОГЛА БЫ СПРОСИТЬ СЛУЖБУ
// НАПРЯМУЮ. Так делает панель управления, и для неё это верно: её страницы
// динамические по природе. Здесь наоборот — оболочка страницы обязана остаться
// предрендеренной, а чтение чужой сессии (`headers()`, cookie) делает
// динамическим ВСЁ поддерево. Поэтому данные забирает островок, а дверь — то
// место, где сессия читается законно.
//
// 🔒 ГЕЙТ НЕ МОЖЕТ БЫТЬ МЯГЧЕ СЛУЖБЫ ЗА НИМ. План шага говорил
// `['admin','architect']`, но `:3001` пускает к `/api/admin/users` ТОЛЬКО
// `architect` — проверено чтением её маршрута. Пусти мы сюда `admin`, он прошёл
// бы наш замок и получил 403 от службы: интерфейс показал бы отказ там, где
// обещал доступ, и разбираться пришлось бы в двух местах сразу. Дверь-посредник
// повторяет право источника, а не выдумывает своё.
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ["architect"])
  if (denied) return denied

  const url = new URL(req.url)
  const params = new URLSearchParams({ page: String(Math.max(1, Number(url.searchParams.get("page")) || 1)) })
  const q = url.searchParams.get("q")?.trim()
  if (q) params.set("q", q.slice(0, 100))

  // Адрес службы выводится из ЗАГОЛОВКА ЗАПРОСА, а не из `NEXT_PUBLIC_*`: те
  // запекаются на сборке и устаревают при переходе с IP на домен, который
  // проходит без пересборки приложения.
  const base = authBaseFromHost(
    req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
    req.headers.get("x-forwarded-proto") ?? "http",
  )

  try {
    const res = await fetch(`${base}/api/admin/users?${params}`, {
      // Cookie посетителя едет дальше: служба отвечает по ЕГО сессии, а не по
      // праву приложения. Без этого дверь стала бы обходом авторизации.
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ error: data?.error ?? "auth service refused" }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch {
    // Служба недоступна — это 502, а не 500: отказал не мы, а тот, к кому мы
    // обратились, и интерфейсу есть что сказать человеку.
    return NextResponse.json({ error: "auth service unreachable" }, { status: 502 })
  }
}
