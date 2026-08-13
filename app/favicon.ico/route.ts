// `/favicon.ico` — значок вкладки, который РЕШАЕТ ПАНЕЛЬ (шаг 506, вопрос
// владельца 2026-08-13: «как обновить иконку в проекте?»).
//
// 🔒 ЧТО БЫЛО СЛОМАНО. Здесь лежал ФАЙЛ `app/favicon.ico` — картинка 32×32,
// попавшая в репозиторий 23 июня. Next обслуживает такой файл по соглашению и
// вставляет ссылку на него ПЕРВОЙ в `<head>`, с `sizes="any"`, то есть сильнее
// наших `/icons/favicon-32.png`. Итог: владелец загружает свой логотип, панель
// честно нарезает набор, а браузер продолжает показывать картинку из чужого
// репозитория — и поменять её можно только правкой кода. Ровно тот же дефект,
// что и знак бренда на главной, только заметить его труднее: значок вкладки
// маленький, и на него не смотрят, пока не спросят.
//
// Ответ на вопрос «как обновить иконку»: Панель → Настройки приложения →
// изображение бренда. Пересборка НЕ нужна — этот маршрут читает настройки на
// каждый запрос, как и всё остальное в `APP-CONFIG`.
//
// 🔒 ПОЧЕМУ МАРШРУТ, А НЕ ПРОСТО УДАЛЕНИЕ ФАЙЛА. Браузеры, поисковики и читалки
// просят `/favicon.ico` сами, без всякой ссылки в разметке. Удалив файл, мы
// получили бы 404 в журнале у каждого посетителя и пустой значок там, где клиент
// не удосужился поставить свой. Поэтому адрес остаётся, а отвечает на него
// живая настройка.
//
// Порядок тот же, что у знака бренда: логотип владельца → нарезанный набор →
// нейтральная заглушка проекта.

import { getAppConfig } from "@/config/app-config"
import { iconUrl } from "@/config/app-config.defaults"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// Настройки читаются на каждый запрос — иначе смена логотипа в панели требовала
// бы пересборки, а весь смысл `APP-CONFIG` в обратном.
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const cfg = getAppConfig()
  const source = cfg.logo ?? iconUrl(cfg, "favicon_32") ?? iconUrl(cfg, "icon_192")

  if (source) {
    try {
      // Свой адрес (`/api/media/...` или загруженный логотип) — забираем через
      // тот же origin, чтобы не заводить второй путь к хранилищу.
      const res = await fetch(new URL(source, request.url), { cache: "no-store" })
      if (res.ok) {
        const body = await res.arrayBuffer()
        return new Response(body, {
          headers: {
            "Content-Type": res.headers.get("content-type") ?? "image/png",
            // Коротко: значок меняется в панели, и посетитель не обязан ждать
            // сутки, чтобы увидеть новый.
            "Cache-Control": "public, max-age=300",
          },
        })
      }
    } catch {
      /* хранилище недоступно — отдаём заглушку ниже, значок не повод для ошибки */
    }
  }

  const fallback = await readFile(join(process.cwd(), "public", "icons", "favicon-48.png"))
  return new Response(new Uint8Array(fallback), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=300" },
  })
}
