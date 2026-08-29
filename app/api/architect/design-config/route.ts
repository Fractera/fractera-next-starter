// @api read and save this project's design tokens: fonts, type scale, shape, colors
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readRawDesignConfig, writeDesignPatch } from "@/lib/architect/design-config-writer"
import { getDesignConfig } from "@/config/design-config"

// ДВЕРЬ ОФОРМЛЕНИЯ ПРОЕКТА (шаг 39-2, 2026-08-29).
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ. `AccessGate` в макете объясняет
// человеку, почему его не пустили; проверку в браузере в браузере же и отключают.
// Дверь, отдающая и меняющая состояние машины, обязана спрашивать сама.
//
// 🔒 ДВА ЧТЕНИЯ, И ПУТАТЬ ИХ НЕЛЬЗЯ.
//   `config`    — СЫРОЙ файл: только то, что владелец действительно выбирал.
//   `effective` — полная картина: выбранное плюс умолчания темы проекта.
// Форме нужны обе: она правит первое и ПОКАЗЫВАЕТ второе — иначе поле цвета,
// который владелец не трогал, стояло бы пустым, хотя цвет на сайте есть.
//
// 🔒 ЗАПЛАТА, А НЕ ВЕСЬ КОНФИГ: четыре ветки правятся порознь и в разное время.
//
// Динамическая по природе: отдаёт и меняет состояние машины.
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  return NextResponse.json({
    ok: true,
    config: readRawDesignConfig(),
    effective: getDesignConfig(),
  })
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 })
  }

  const patch = (body as { patch?: unknown } | null)?.patch
  const result = writeDesignPatch(patch)

  if (!result.ok) {
    const status = result.reason === "bad-body" ? 400 : 500
    return NextResponse.json({ ok: false, error: result.reason, detail: result.detail }, { status })
  }

  return NextResponse.json({ ok: true, config: result.config })
}
