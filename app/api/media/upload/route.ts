import { NextRequest, NextResponse } from "next/server"

const DATA_URL    = process.env.REMOTE_DATA_URL ?? "http://localhost:3300"
// 🔒 ИМЯ КЛЮЧА — DATA_SECRET (найдено на живом сайте 2026-08-13). Здесь стояло
// DATA_API_KEY: такой переменной в окружении сервера нет, ключ получался пустым,
// и прокси пересылал в слой данных COOKIE ПОСЕТИТЕЛЯ. У анонимного гостя сессии
// нет — картинка отвечала 401, а оптимизатор поверх неё 400. То есть ни одно
// изображение из хранилища никогда не было видно публике; не всплывало это лишь
// потому, что показывали статические файлы из public/.
// Оба имени приняты: старое могло попасть в чьё-то окружение.
const DATA_SECRET = process.env.DATA_SECRET || process.env.DATA_API_KEY || ""
const IS_REMOTE   = !!process.env.REMOTE_DATA_URL

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const headers: Record<string, string> = {}
    if (DATA_SECRET) {
      headers["X-Data-Secret"] = DATA_SECRET
    } else {
      const cookie = req.headers.get("cookie") ?? ""
      if (cookie) headers["Cookie"] = cookie
    }

    const res = await fetch(`${DATA_URL}/media/upload`, {
      method: "POST",
      headers,
      body: formData,
    })

    const data = await res.json() as { ok: boolean; item?: { id: string; url: string } }

    // In remote/dev mode rewrite the URL to go through local proxy
    if (IS_REMOTE && data.ok && data.item) {
      data.item.url = `/api/media/${data.item.id}/file`
    }

    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
