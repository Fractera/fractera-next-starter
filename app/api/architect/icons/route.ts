// @api slice one square image into the app icon set and save it
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { writeConfigPatch } from "@/lib/architect/app-config-writer"

// НАРЕЗКА НАБОРА ЗНАЧКОВ ПРИЛОЖЕНИЯ (31-8, 2026-08-28).
//
// 🔒 ЭТА ДВЕРЬ ЗАМЕНЯЕТ СОБОЙ РАЗДЕЛ ПАНЕЛИ, и заведена по прямому слову
// владельца: «мы всё удалим из панели администратора — значит нужно всё
// перенести, там убрать, тут сделать».
//
// ✗ ЧЕМ ОПЛАЧЕНА ЕЁ ЗАДЕРЖКА НА ОДИН ПОДШАГ. Я доложил, что перенести значки
// нельзя: «двери, которая набор порождает, здесь нет вовсе». Неверно. Двери нет в
// API гостевого приложения — но она есть ЭТАЖОМ НИЖЕ, в слое данных
// (`POST /media/generate-icons`), а приложение уже разговаривает с ним через
// прокси `/api/media/*`. Я проверил свой слой и объявил тупик по всему пути.
//
// 🔒 ЦЕПОЧКА ЖИВЁТ НА СЕРВЕРЕ, А НЕ В БРАУЗЕРЕ. Три шага подряд — положить файл,
// попросить нарезать, записать результат в конфиг — требуют ключа слоя данных
// (`X-Data-Secret`). Сложить их в островке значило бы отдать этот ключ в браузер.
//
// 🔒 НАРЕЗКА НЕ ПОВТОРЯЕТСЯ ЗДЕСЬ. `sharp` есть и в этом проекте, и соблазн
// нарезать самому велик — но слой данных уже умеет это и хранит наборы у себя,
// раздавая их по `/api/media/icons/<id>/file/<имя>`. Вторая реализация разошлась
// бы с первой в размерах, обрезке и составе файлов, и разошлась бы молча.

const DATA_URL = process.env.REMOTE_DATA_URL ?? "http://localhost:3300"
const DATA_SECRET = process.env.DATA_SECRET || process.env.DATA_API_KEY || ""

function dataHeaders(req: NextRequest): Record<string, string> {
  if (DATA_SECRET) return { "X-Data-Secret": DATA_SECRET }
  // Ключа нет — пересылаем сессию посетителя: так же ведёт себя дверь загрузки.
  const cookie = req.headers.get("cookie") ?? ""
  return cookie ? { Cookie: cookie } : {}
}

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  // 🔒 РАЗБОР ТЕЛА — ОТДЕЛЬНО ОТ РАБОТЫ, и это не педантизм: `formData()` БРОСАЕТ
  // на запросе без нужного типа содержимого, и без этой развилки такой запрос
  // получал `502 unreachable-data-layer` — то есть обвинение слоя данных в чужой
  // ошибке. Поймано собственным замером.
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: "expected-multipart-form" }, { status: 400 })
  }

  try {
    const file = form.get("file")
    // Уже загруженную картинку можно нарезать по её `mediaId`, не заливая заново:
    // логотип обычно уже лежит в хранилище.
    let mediaId = typeof form.get("mediaId") === "string" ? String(form.get("mediaId")) : ""

    if (!mediaId) {
      if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, error: "file-or-mediaId-required" }, { status: 400 })
      }
      const up = new FormData()
      up.append("file", file)
      const upRes = await fetch(`${DATA_URL}/media/upload`, {
        method: "POST",
        headers: dataHeaders(req),
        body: up,
      })
      const upData = (await upRes.json().catch(() => ({}))) as { ok?: boolean; item?: { id?: string } }
      if (!upRes.ok || !upData.ok || !upData.item?.id) {
        return NextResponse.json({ ok: false, error: "upload-failed" }, { status: 502 })
      }
      mediaId = upData.item.id
    }

    const genRes = await fetch(`${DATA_URL}/media/generate-icons`, {
      method: "POST",
      headers: { ...dataHeaders(req), "Content-Type": "application/json" },
      body: JSON.stringify({ media_id: mediaId }),
    })
    const gen = (await genRes.json().catch(() => ({}))) as {
      ok?: boolean
      id?: string
      files?: Record<string, string>
    }
    if (!genRes.ok || !gen.ok || !gen.id || !gen.files) {
      return NextResponse.json({ ok: false, error: "generate-failed" }, { status: 502 })
    }

    // 🔒 В КОНФИГ УХОДИТ ЗАПЛАТА ИЗ ОДНОЙ ВЕТКИ. Набор значков не имеет отношения
    // ни к одной другой настройке, и присылать вместе с ним что-либо ещё значило
    // бы дать этой двери право затирать чужое.
    const saved = writeConfigPatch({ iconSet: { id: gen.id, files: gen.files } })
    if (!saved.ok) {
      return NextResponse.json({ ok: false, error: saved.reason, detail: saved.detail }, { status: 500 })
    }

    return NextResponse.json({ ok: true, iconSet: { id: gen.id, files: gen.files } })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "unreachable-data-layer", detail: String(e) }, { status: 502 })
  }
}

// Снятие набора: значки возвращаются к тем, что лежат в проекте по умолчанию.
// 🔒 Отдельный метод, а не «сохранить пустоту» формой: набор — не текстовое поле,
// и стирание его руками в поле ввода было бы приглашением написать туда мусор.
export async function DELETE(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const saved = writeConfigPatch({ iconSet: null })
  if (!saved.ok) {
    return NextResponse.json({ ok: false, error: saved.reason }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
