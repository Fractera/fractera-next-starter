// @api recognise a social network from a free-form phrase and check the profile
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { resolveSocial } from "@/_tools/socials-ai/server/resolve"

// ДВЕРЬ ИНСТРУМЕНТА «СОЦСЕТИ ЧЕРЕЗ ИИ» (31-25, 2026-08-29).
//
// ТОНКАЯ ОБЁРТКА над серверной половиной инструмента: проверяет входящего и зовёт
// функцию. Вся работа с моделью живёт в `_tools/socials-ai/` — повторить её здесь
// значило бы завести вторую реализацию того же.
//
// 🔒 РОЛЬ ТА ЖЕ, ЧТО У ОСТАЛЬНЫХ ДВЕРЕЙ СЛОЯ АРХИТЕКТОРА. Дверь ходит к модели за
// деньги владельца и лазает по внешним адресам: открытая, она превращается в чужой
// бесплатный сервис проверки профилей, оплаченный им же.
//
// 🔒 ОТВЕЧАЕТ 200 ДАЖЕ НА ОТКАЗ МОДЕЛИ, и это не небрежность. `{ok:false,reason}` —
// нормальный исход разговора, а не сбой сервера: клиент по причине показывает
// подсказку и открывает ручной ввод. Код 5xx здесь означал бы, что сломан конструктор
// соцсетей, тогда как сломан только необязательный помощник.

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  let phrase = ""
  let lang = "en"
  try {
    const body = (await req.json()) as { phrase?: unknown; lang?: unknown }
    phrase = typeof body.phrase === "string" ? body.phrase.trim() : ""
    lang = typeof body.lang === "string" ? body.lang : "en"
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  if (!phrase) return NextResponse.json({ error: "Empty phrase" }, { status: 400 })

  const result = await resolveSocial(phrase, lang)
  return NextResponse.json(result)
}
