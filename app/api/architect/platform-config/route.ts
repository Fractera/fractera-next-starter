// @api read and save this project's platform switches and routing mode
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readRawPlatformConfig, writePlatformPatch } from "@/lib/architect/platform-config-writer"
import { getPlatformConfig } from "@/config/platform-config"

// ДВЕРЬ ПЛАТФОРМЕННЫХ НАСТРОЕК ПРОЕКТА (шаг 31-12, 2026-08-29).
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ — по той же причине, что и у соседней
// двери настроек приложения: `AccessGate` в макете объясняет человеку, почему его
// не пустили, но проверку в браузере в браузере же и отключают.
//
// 🔒 ДВА ЧТЕНИЯ, И ПУТАТЬ ИХ НЕЛЬЗЯ — здесь разница больше, чем у app-config.
//   `config` — СЫРОЙ файл: только то, что владелец действительно решал.
//   `effective` — полная картина: значение каждого выключателя ПЛЮС карта
//              `decided`, отвечающая «это решение владельца или умолчание
//              шаблона». Форме нужны обе: она правит первое и показывает второе.
//
// 🔒 ЗАПЛАТА, А НЕ ВЕСЬ КОНФИГ. В этом файле живут чужие ветки — режим разработки,
// выключатели документов агента, состояние переезда. Панель пишет сюда же из
// другого процесса; снимок целиком затирал бы её работу при каждой галочке.
//
// Динамическая по природе: отдаёт и меняет состояние машины.
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  return NextResponse.json({
    ok: true,
    config: readRawPlatformConfig(),
    effective: getPlatformConfig(),
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
  const result = writePlatformPatch(patch)

  if (!result.ok) {
    const status = result.reason === "bad-body" ? 400 : 500
    return NextResponse.json({ ok: false, error: result.reason, detail: result.detail }, { status })
  }

  // 🔒 ЗАПИСЬ БЕЗ СБРОСА КЭША ЧИТАЕТСЯ КАК НЕРАБОТАЮЩИЙ ВЫКЛЮЧАТЕЛЬ (78-4,
  // 2026-08-31). Публичные страницы статические с `revalidate = 600`: конфиг
  // применяется без пересборки, но результат доезжает до посетителя лишь когда
  // истечёт окно ISR. Человек щёлкает, открывает сайт, ничего не видит и делает
  // единственный доступный ему вывод — «сломано».
  //
  // ✗ ЭТО НЕ ДОГАДКА И НЕ НОВЫЙ ДЕФЕКТ: он найден владельцем 2026-08-19 ровно на
  // ЭТОМ выключателе («выключил авторизацию — кнопка входа осталась в шапке») и
  // разобран в `reports/errors-panel-switch-invisible-until-isr-expires.md`.
  // Панель лечила его, вызывая `/api/revalidate` после записи; дверь слоя
  // архитектора эту половину не унаследовала — и воспроизвела дефект в новой
  // поверхности.
  //
  // 🔒 СБРАСЫВАЕТСЯ ВЕСЬ ПУБЛИЧНЫЙ СЛОЙ, А НЕ СТРАНИЦА. Выключатели кормят шапку,
  // подвал, мета и манифест — то есть каждую страницу; точечный сброс оставил бы
  // часть сайта в прежнем виде, и расхождение было бы хуже задержки.
  //
  // 🔒 СТРАНИЦЫ ОСТАЮТСЯ СТАТИЧЕСКИМИ. Это очистка кэша, а не перевод в динамику:
  // инвариант статической генерации не задет ни на одну страницу.
  revalidatePath("/", "layout")
  revalidatePath("/[lang]", "layout")

  return NextResponse.json({ ok: true, config: result.config })
}
