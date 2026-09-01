// @api save the bot token, switch the channel, set its schedule
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { CHANNELS_URL } from "@/lib/architect/channels"

// ДВЕРЬ НАСТРОЙКИ БОТА — ПЕРЕНЕСЕНА ИЗ ПАНЕЛИ (77-3, 2026-09-01).
//
// 🔒 ЧЕРЕЗ ЭТУ ДВЕРЬ ЕДЕТ СЕКРЕТ, И ИМЕННО ПОЭТОМУ ЗАМОК СТОИТ ЗДЕСЬ, А НЕ ТОЛЬКО
// НА СТРАНИЦЕ. Проверку в браузере в браузере же и отключают.
//
// 🔒 ТОКЕН ПРОЛЕТАЕТ НАСКВОЗЬ И НИГДЕ НЕ ОСЕДАЕТ: ни в файле проекта, ни в логе,
// ни в ответе. Хранит его служба, и она одна.
// ✗ Соблазн «залогировать для отладки» здесь стоит дороже всего: журнал переживёт
// отладку, а токен даёт полный доступ к боту любому, кто прочтёт строку.
//
// 🔒 ФОРМАТ ТОКЕНА ПРОВЕРЯЕТ СЛУЖБА (`^\d+:[A-Za-z0-9_-]+$` → 400), И ВТОРОЙ
// ПРОВЕРКИ ЗДЕСЬ НЕТ НАМЕРЕННО. Две копии одного правила расходятся молча: наша
// стала бы строже или мягче служебной на первой же правке Telegram.
// Ответ службы пересылается как есть — вместе с её словами об отказе.
//
// 🔒 ПЕРЕЗАПУСКАТЬ СЛУЖБУ НЕ НУЖНО — в отличие от службы входа (78-3). `:3500`
// перечитывает свой `config.json` на каждом запросе, поэтому запись действует
// сразу. Это проверено чтением службы, а не предположено по аналогии.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 })
  }

  try {
    const r = await fetch(`${CHANNELS_URL}/telegram/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, {
      status: r.status,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (e) {
    // 🔒 ОТКАЗ СЛУЖБЫ НАЗЫВАЕТ СЕБЯ ОТКАЗОМ СЛУЖБЫ. `503` с её именем ведёт к
    // `pm2 start fractera-channels`; безымянная «ошибка сохранения» отправила бы
    // человека искать опечатку в токене, которого он не портил.
    return NextResponse.json(
      { error: `channels-unreachable: ${String((e as Error).message ?? e)}` },
      { status: 503 },
    )
  }
}
