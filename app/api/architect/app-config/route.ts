// @api read and save this project's application settings
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readRawConfig, writeConfigPatch } from "@/lib/architect/app-config-writer"
import { getAppConfig } from "@/config/app-config"

// ДВЕРЬ НАСТРОЕК ПРОЕКТА (шаг 31-2, 2026-08-28).
//
// 🔒 РОЛЬ ПРОВЕРЯЕТСЯ ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ. `AccessGate` в макете слоя —
// честная вывеска: она объясняет человеку, почему его не пустили. Но проверку в
// браузере в браузере же и отключают, а адрес двери виден в любой вкладке
// разработчика. Настоящий замок — этот.
//
// 🔒 ДВА РАЗНЫХ ЧТЕНИЯ, И ПУТАТЬ ИХ НЕЛЬЗЯ.
//   `config` — СЫРОЙ файл: только то, что владелец действительно сохранял.
//              Форма правит его, и она же шлёт обратно заплату; покажи ей
//              слитое с умолчаниями — и первое же сохранение заморозило бы все
//              умолчания шаблона в файле как «решения владельца».
//   `effective` — то, что РЕАЛЬНО видит сайт: файл, слитый с умолчаниями и
//              вылеченный `normalize()`. Форме он нужен как подсказка «сейчас
//              работает вот это», когда своего значения нет.
//
// 🔒 ЗАПЛАТА, А НЕ ВЕСЬ КОНФИГ. Тело `POST` — только те ветки, которые человек
// правил. Так чужие ветки защищены конструкцией: страница физически не может
// затереть то, чего не присылала. Причина в `lib/architect/app-config-writer.ts`.
//
// Динамическая по природе: отдаёт и меняет состояние машины.
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  return NextResponse.json({
    ok: true,
    config: readRawConfig(),
    effective: getAppConfig(),
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

  // Тело — объект с полем `patch`. Отдельное поле, а не «всё тело есть заплата»:
  // завтра рядом появится, например, «сохранить как черновик», и менять форму
  // запроса задним числом придётся у всех, кто её уже шлёт.
  const patch = (body as { patch?: unknown } | null)?.patch
  const result = writeConfigPatch(patch)

  if (!result.ok) {
    const status = result.reason === "bad-body" ? 400 : 500
    return NextResponse.json({ ok: false, error: result.reason, detail: result.detail }, { status })
  }

  return NextResponse.json({ ok: true, config: result.config })
}
