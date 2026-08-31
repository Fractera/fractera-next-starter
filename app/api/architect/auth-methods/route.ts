// @api read and save the sign-in providers of this project (Google, Resend)
import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { writeEnvValue } from "@/lib/architect/env-writer"
import { readAuthMethods, isSecureMode } from "@/lib/architect/auth-methods"

// ДВЕРЬ СПОСОБОВ ВХОДА — ПЕРЕНЕСЕНА ИЗ ПАНЕЛИ (78-3, 2026-08-31).
//
// 🔒 ЗДЕСЬ ЖИВЁТ ВСЯ ЛОГИКА, И ИМЕННО ПОЭТОМУ ОНА ПЕРЕНЕСЕНА ЦЕЛИКОМ. Форма
// видная и приятная, но самое дорогое лежит в двери и невидимо: режим
// безопасности, проверка формата ключа, перезапуск службы. ✗ 31-18 оплачен тем,
// что перенесли вид, а запрет остался в источнике.
//
// 🔒 ЗАМОК ЗДЕСЬ, А НЕ ТОЛЬКО НА СТРАНИЦЕ — как у трёх соседних дверей слоя:
// проверку в браузере в браузере же и отключают, а эта дверь пишет СЕКРЕТЫ.
//
// 🔒 ДВЕРЬ ОТДАЁТ ТОЛЬКО МАСКИ. Ни один секрет наружу не уходит ни разу, ни в
// одном ответе — включая ответ на сохранение.
//
// Динамическая по природе: читает и меняет состояние машины.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const AUTH_ENV = process.env.AUTH_ENV_PATH ?? "/opt/fractera/services/auth/.env.local"

/**
 * Перезапуск службы входа, отпущенный на волю.
 *
 * 🔒 БЕЗ ЭТОГО ЗАПИСЬ НИЧЕГО НЕ ЗНАЧИТ: служба читает окружение ПРИ СТАРТЕ.
 * Файл был бы правильным, а поведение — прежним; самый обидный род отказа, где
 * всё «сохранено» и ничего не изменилось.
 *
 * 🔒 ОТСОЕДИНЁН И НЕ ОЖИДАЕТСЯ. Ответ не должен ждать pm2: перезапуск идёт
 * секунды, а человеку нужно знать, что запись прошла. Задержка — чтобы ответ
 * успел уйти раньше, чем служба моргнёт.
 * 🔒 Отказ перезапуска НЕ отменяет запись: ключи уже в файле, и повторное
 * сохранение ничего не исправит — исправит перезапуск руками.
 */
function restartAuthService(): void {
  try {
    const child = spawn("sh", ["-c", "sleep 0.5; pm2 restart fractera-auth"], {
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
  return NextResponse.json(readAuthMethods())
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const state = readAuthMethods()

  // 🔒 ЗАПРЕТ ПЕРВЫЙ: НЕТ ФАЙЛА — НЕТ ПРАВКИ, И ОТКАЗ ОБЪЯСНЯЕТ СЕБЯ. На машине
  // человека окружения службы входа не существует; писать его туда значило бы
  // создать файл, которого никто не читает.
  if (!state.reachable) {
    return NextResponse.json(
      { error: "auth-env-unreachable" },
      { status: 409 },
    )
  }

  // 🔒 ЗАПРЕТ ВТОРОЙ, САМЫЙ ДОРОГОЙ: ПРАВКА ТОЛЬКО В ЗАЩИЩЁННОМ РЕЖИМЕ.
  // Здешний аналог `WRITE_ENABLED` панели. Google OAuth требует HTTPS-адреса
  // возврата, ссылка в письме — настоящего домена: в режиме «IP без домена» оба
  // способа не заработают, как бы верно ни были введены ключи. Разреши здесь
  // запись — и человек уйдёт искать ошибку в ключах, которых не портил.
  if (!isSecureMode()) {
    return NextResponse.json({ error: "insecure-mode" }, { status: 403 })
  }

  let body: {
    googleClientId?: string
    googleClientSecret?: string
    resendApiKey?: string
    resendFrom?: string
    clearGoogle?: boolean
    clearResend?: boolean
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 })
  }

  // 🔒 ЗАПРЕТ ТРЕТИЙ: КЛЮЧ RESEND ПРОВЕРЯЕТСЯ ДО ЗАПИСИ, А НЕ ПОСЛЕ. Опечатка,
  // уехавшая в файл, перезапустит службу и молча перестанет слать письма —
  // отказ, который человек заметит через день и не свяжет с этой минутой.
  const resendKey = (body.resendApiKey ?? "").trim()
  if (!body.clearResend && resendKey && !resendKey.startsWith("re_")) {
    return NextResponse.json({ error: "bad-resend-key" }, { status: 400 })
  }

  const writes: { key: string; value: string }[] = []

  if (body.clearGoogle) {
    writes.push({ key: "GOOGLE_CLIENT_ID", value: "" })
    writes.push({ key: "GOOGLE_CLIENT_SECRET", value: "" })
  } else {
    const id = (body.googleClientId ?? "").trim()
    const secret = (body.googleClientSecret ?? "").trim()
    // Пустое поле НЕ стирает сохранённое: человек мог править только одно из
    // двух, и второе он видит маской, а не значением.
    if (id) writes.push({ key: "GOOGLE_CLIENT_ID", value: id })
    if (secret) writes.push({ key: "GOOGLE_CLIENT_SECRET", value: secret })
  }

  if (body.clearResend) {
    writes.push({ key: "RESEND_API_KEY", value: "" })
  } else if (resendKey) {
    writes.push({ key: "RESEND_API_KEY", value: resendKey })
  }
  if (body.resendFrom !== undefined) {
    writes.push({ key: "AUTH_RESEND_FROM", value: (body.resendFrom ?? "").trim() })
  }

  // 🔒 ПУСТАЯ ОТПРАВКА НЕ ПЕРЕЗАПУСКАЕТ СЛУЖБУ. Запрет стоит и в форме, и здесь:
  // форму видит человек, а дверь видна в любой вкладке разработчика. Перезапуск
  // ни за чем — это секунда, на которую вход отваливается без причины.
  if (writes.length === 0) {
    return NextResponse.json({ ok: true, changed: false, ...readAuthMethods() })
  }

  for (const w of writes) {
    const res = writeEnvValue(w.key, w.value, AUTH_ENV)
    if (!res.ok) {
      return NextResponse.json({ error: "write-failed", detail: res.detail }, { status: 500 })
    }
  }

  restartAuthService()

  // Ответ несёт свежее состояние — страница перерисуется по нему и покажет новые
  // маски, не спрашивая дверь второй раз.
  return NextResponse.json({ ok: true, changed: true, ...readAuthMethods() })
}
