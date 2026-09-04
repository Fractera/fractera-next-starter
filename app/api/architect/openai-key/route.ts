// @api read, save and verify the OpenAI key of this project
import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readOpenAiKeyState, writeOpenAiKey, checkOpenAiKey } from "@/lib/architect/openai-key"

// ДВЕРЬ КЛЮЧА OPENAI (77-8, 2026-09-01).
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ: через дверь едет секрет, а проверку в
// браузере в браузере же и отключают.
//
// 🔒 КЛЮЧ НЕ ВОЗВРАЩАЕТСЯ НИ В ОДНОМ ОТВЕТЕ. Наружу — `configured` у каждого
// потребителя и хвост из четырёх символов для узнавания.
//
// 🔒 ПРОВЕРКА ИДЁТ ТЕМ КЛЮЧОМ, ЧТО УЖЕ ЛЕЖИТ НА СЕРВЕРЕ, а не присланным с
// клиента: иначе «проверить» превратилось бы в способ гонять чужие ключи через
// наш сервер.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * 🔒 СЛОТ ЧИТАЕТ ОКРУЖЕНИЕ ПРИ СТАРТЕ — БЕЗ ПЕРЕЗАПУСКА «СОХРАНЕНО» БУДЕТ
 * ПРАВДОЙ ПРО ФАЙЛ И ЛОЖЬЮ ПРО ПОВЕДЕНИЕ. Служба каналов, наоборот, читает файл
 * на каждом вызове — ей перезапуск не нужен, и мы его не делаем.
 * Отсоединён и не ожидается: ответ не должен ждать pm2.
 */
function restartSlot(): void {
  try {
    const child = spawn("sh", ["-c", "sleep 0.5; pm2 restart fractera-app --update-env"], {
      detached: true,
      stdio: "ignore",
    })
    child.unref()
  } catch {
    // Молча: pm2 может не существовать вовсе — на машине человека это норма.
  }
}

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied
  return NextResponse.json(await readOpenAiKeyState(), { headers: { "Cache-Control": "no-store" } })
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  // Проверка живого ключа — без тела запроса и без секрета в проводе.
  if (req.nextUrl.searchParams.get("check") === "1") {
    const state = await readOpenAiKeyState()
    if (!state.app.configured) {
      return NextResponse.json({ error: "no-key" }, { status: 409 })
    }
    // Значение берётся на сервере и наружу не уходит.
    const { readEnvValue } = await import("@/lib/architect/env-writer")
    const key = readEnvValue("OPENAI_API_KEY", process.env.SLOT_ENV_PATH ?? "/opt/fractera/app/.env.local")
    const result = await checkOpenAiKey((key ?? "").trim())
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
  }

  let body: { key?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 })
  }

  const key = (body.key ?? "").trim()
  if (!key) return NextResponse.json({ error: "empty" }, { status: 400 })

  // 🔒 ФОРМА ПРОВЕРЯЕТСЯ ДО ЗАПИСИ. Опечатка, уехавшая в четыре файла, тише всего
  // ломает встраивание документов: приём отвечает 200 и молча ничего не делает.
  if (!key.startsWith("sk-")) {
    return NextResponse.json({ error: "bad-key-format" }, { status: 400 })
  }

  const { written, failed } = await writeOpenAiKey(key)
  if (!written.length) {
    return NextResponse.json({ error: "no-consumers" }, { status: 409 })
  }
  restartSlot()
  return NextResponse.json(
    { ok: true, written, failed },
    { headers: { "Cache-Control": "no-store" } },
  )
}
