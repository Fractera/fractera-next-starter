// @api list, add, toggle and delete rows of the demo todo list
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// ДВЕРЬ СПИСКА ДЕЛ — образец работающей вещи, а не разметки.
//
// 🔒 ЗАЧЕМ ОН В СТАРТЕРЕ. Стартер несёт приложения, а не пустые страницы, и это
// надо не утверждать, а показывать. Здесь третья ступень лестницы «что кладут на
// страницу»: таблица в `SCHEMA`, дверь, островок. Скопировать этот файл и
// заменить в нём три запроса — быстрее, чем выводить порядок заново.
//
// 🔒 ОДНА ДВЕРЬ НА ВСЕ ДЕЙСТВИЯ. Четыре маршрута (`/add`, `/toggle`, `/delete`)
// повторяли бы разбор тела и проверку ввода четыре раза. Действие называется
// полем `op`, и неизвестное значение — отказ, а не молчание.
//
// Роль не проверяется: список демонстрационный и общий. Настоящему списку дел
// нужна колонка владельца и сессия — тогда страница переезжает в
// `(protectedLayer)`, а данные приходят за `/api/*` уже с проверкой роли.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Row = { id: string; title: string; done: number; created_at: string }

const MAX_TITLE = 200

export async function GET() {
  const rows = (await db
    .prepare("SELECT id, title, done, created_at FROM todos ORDER BY created_at DESC LIMIT 100")
    .all()) as unknown as Row[]
  return NextResponse.json({ ok: true, rows })
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { op?: string; id?: string; title?: string; done?: boolean }
    | null

  switch (body?.op) {
    case "add": {
      // Заголовок обрезается ЗДЕСЬ, а не в браузере: браузер — не то место, где
      // проверяют ввод, он лишь первым о нём сообщает.
      const title = (body.title ?? "").trim().slice(0, MAX_TITLE)
      if (!title) return NextResponse.json({ error: "title_required" }, { status: 400 })
      const id = crypto.randomUUID()
      await db.prepare("INSERT INTO todos (id, title) VALUES (?, ?)").run(id, title)
      return NextResponse.json({ ok: true, id })
    }
    case "toggle": {
      if (!body.id) return NextResponse.json({ error: "id_required" }, { status: 400 })
      await db.prepare("UPDATE todos SET done = ? WHERE id = ?").run(body.done ? 1 : 0, body.id)
      return NextResponse.json({ ok: true })
    }
    case "delete": {
      if (!body.id) return NextResponse.json({ error: "id_required" }, { status: 400 })
      await db.prepare("DELETE FROM todos WHERE id = ?").run(body.id)
      return NextResponse.json({ ok: true })
    }
    default:
      return NextResponse.json({ error: "unknown_op" }, { status: 400 })
  }
}
