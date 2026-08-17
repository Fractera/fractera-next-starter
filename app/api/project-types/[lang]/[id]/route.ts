import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config"
import { PROJECT_TYPES, isProjectTypeId } from "@/config/project-types"
import { projectType } from "@/lib/i18n/project-types.i18n"

// Описание ОДНОГО направления — то, что показывает окно ленты на главной.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ АДРЕС, А НЕ ДАННЫЕ В СТРАНИЦЕ. Заголовки с подписями всех
// двадцати двух направлений весят 1.8 КБ и едут в разметке. Полные описания —
// 107 КБ на язык: определение, примеры, признаки и до тридцати вопросов на
// каждое. Положить их в главную значит утроить её вес ради содержимого, которое
// большинство посетителей никогда не откроет, — а главная это ровно та страница,
// где вес виден.
//
// 🔒 МАРШРУТ СТАТИЧЕСКИЙ, И ЭТО ОБЯЗАТЕЛЬНО. Канон проекта: «лучше ничего, чем
// динамика». `generateStaticParams` + `force-static` + `dynamicParams = false`
// означают, что на сборке рождаются готовые файлы — 22 направления × включённые
// языки, — а в рантайме не выполняется ничего. Динамики в публичном слое не
// появляется, и слой данных этот адрес не трогает.
//
// 🔒 `dynamicParams = false` ЗАКРЫВАЕТ ПОДБОР. Без него запрос на любой
// придуманный идентификатор уходил бы в рантайм; с ним чужой адрес отдаёт 404 из
// статики.

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.flatMap(lang => PROJECT_TYPES.map(id => ({ lang, id })))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; id: string }> },
) {
  const { lang, id } = await params
  // Проверка остаётся, хотя `dynamicParams = false` уже отсекает чужие адреса:
  // защита от подбора не должна держаться на одной настройке сегмента.
  if (!isProjectTypeId(id)) return new Response("Not found", { status: 404 })
  return Response.json(projectType(lang, id))
}
