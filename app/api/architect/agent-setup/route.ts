// @api thin proxy to the chat door that owns the agent channel token
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { AGENT_SETUP_URL } from "@/lib/architect/agent-channel"

// ДВЕРЬ КАНАЛА АГЕНТА — ТОНКИЙ ПРОВОДНИК К ЧАТУ (шаг 117, 2026-09-05).
//
// 🔒 ТОНКАЯ НАМЕРЕННО, КАК ДВЕРИ СЛУЖБЫ КАНАЛОВ. Токен агента пишет чат `:3600`
// в файл, который читает плагин каналов Anthropic. Записать его отсюда своими
// руками значило бы завести ВТОРОГО писателя одного файла — ровно тот дефект,
// которым оплачено удаление панельной вкладки «Способы входа»: два экрана из
// двух процессов писали один `.env`, и разошлись бы они молча.
//
// 🔒 ЗАМОК СТОИТ ДВАЖДЫ, И ЭТО НЕ ДУБЛИРОВАНИЕ ПРАВИЛА. Здесь — потому что через
// дверь едет секрет, а проверку в браузере в браузере же и отключают. Там —
// потому что дверь чата обязана быть закрытой сама по себе, её зовут и без нас.
// Роль проверяется в двух местах, но РЕШЕНИЕ о том, кому можно, живёт в одном:
// `ARCHITECT_LAYER_ROLES` здесь и `architect` там — один и тот же круг.
//
// 🛑 КУКИ ПЕРЕСЫЛАЮТСЯ, ПОТОМУ ЧТО СЕССИЯ ОДНА НА ВСЕ СЛУЖБЫ (закон шага 96).
// Без них дверь чата ответит `403` даже тому, кого мы уже впустили.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Заголовки к чату: только куки, ничего лишнего из запроса браузера. */
function forward(req: NextRequest, json: boolean): HeadersInit {
  const cookie = req.headers.get("cookie") ?? ""
  const h: Record<string, string> = {}
  if (cookie) h.cookie = cookie
  if (json) h["content-type"] = "application/json"
  return h
}

/**
 * Ответ чата пересылается КАК ЕСТЬ, включая код.
 *
 * 🔒 Свой код ответа здесь был бы третьей правдой о том, что случилось: чат уже
 * сказал `400 bad-format` или `500 write-failed` со своей причиной, и подменять
 * это на общее «не получилось» значит отнять у человека единственную подсказку.
 */
async function relay(r: Response): Promise<NextResponse> {
  const text = await r.text()
  return new NextResponse(text, {
    status: r.status,
    headers: { "Cache-Control": "no-store", "content-type": "application/json" },
  })
}

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied
  try {
    return await relay(await fetch(AGENT_SETUP_URL, { cache: "no-store", headers: forward(req, false) }))
  } catch {
    // 🛑 ЧАТ НЕ ОТВЕТИЛ — ЭТО СОСТОЯНИЕ, А НЕ ПОЛОМКА НАШЕЙ ДВЕРИ. На машине
    // человека службы `:3600` нет вовсе, и страница обязана сказать это словами.
    return NextResponse.json({ error: "chat-unreachable" }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied
  const body = await req.text()
  try {
    return await relay(
      await fetch(AGENT_SETUP_URL, { method: "POST", headers: forward(req, true), body })
    )
  } catch {
    return NextResponse.json({ error: "chat-unreachable" }, { status: 503 })
  }
}
