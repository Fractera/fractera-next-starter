// @api read, save and verify the Anthropic key used by the chat agent
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import {
  checkAnthropicKey,
  looksLikeAnthropicKey,
  readAnthropicKeyState,
  writeAnthropicKey,
} from "@/lib/architect/anthropic-key"

// ДВЕРЬ КЛЮЧА ANTHROPIC (113-1, 2026-09-04).
//
// 🔒 ЗЕРКАЛО СОСЕДНЕЙ ДВЕРИ КЛЮЧА OPENAI, И ЭТО НАМЕРЕННО. Две двери одного рода,
// ведущие себя по-разному, — источник вопросов «почему здесь сохранилось, а там
// нет». Приёмы те же: замок на самой двери, форма проверяется до записи, проверка
// идёт ключом, который УЖЕ на сервере.
//
// 🔒 НО ОДНО ОТЛИЧИЕ ЕСТЬ, И ОНО ГЛАВНОЕ: ЗДЕСЬ НЕТ ПЕРЕЗАПУСКА СЛУЖБЫ. Слот
// читает окружение при старте, поэтому после ключа OpenAI его перезапускают.
// Потребитель этого ключа — чат, а он читает файл при каждом обращении и подаёт
// значение полем `env` самому SDK. Перезапускать нечего, и обещать перезапуск
// значило бы заставить человека ждать события, которого не будет.
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ: через дверь едет секрет, а проверку в
// браузере в браузере же и отключают.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied
  return NextResponse.json(readAnthropicKeyState(), { headers: { "Cache-Control": "no-store" } })
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  // Проверка живого ключа — без тела запроса и без секрета в проводе.
  if (req.nextUrl.searchParams.get("check") === "1") {
    if (!readAnthropicKeyState().configured) {
      return NextResponse.json({ error: "no-key" }, { status: 409 })
    }
    return NextResponse.json(await checkAnthropicKey(), { headers: { "Cache-Control": "no-store" } })
  }

  let body: { key?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 })
  }

  const key = (body.key ?? "").trim()
  if (!key) return NextResponse.json({ error: "empty" }, { status: 400 })
  if (!looksLikeAnthropicKey(key)) {
    return NextResponse.json({ error: "bad-key-format" }, { status: 400 })
  }

  const res = writeAnthropicKey(key)
  if (!res.ok) {
    return NextResponse.json({ error: "write-failed", detail: res.detail }, { status: 500 })
  }

  // 🔒 ОТВЕТ ГОВОРИТ РОВНО ТО, ЧТО ПРОИЗОШЛО. `applies: true` здесь честно:
  // следующий вопрос агенту уже уйдёт с новым ключом, потому что чат читает файл
  // при каждом обращении. У соседней двери на этом месте стоял бы `false`.
  return NextResponse.json({ ok: true, applies: true }, { headers: { "Cache-Control": "no-store" } })
}
