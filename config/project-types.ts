// Структура проекта — 22 направления, из которых владелец выбирает своё.
//
// 🔒 КОПИЯ КАТАЛОГА ПАНЕЛИ, И ЭТО ОСОЗНАННО. Оригинал живёт в панели управления
// (`bridges/app/lib/project-types.ts`), где владелец выбирает направление и
// получает вопросы под него. Здесь тот же список нужен витрине: лента на главной
// показывает, ЧТО именно можно построить, посетителю, который до панели ещё не
// дошёл. Общего кода у двух приложений нет — они разные сборки на разных портах,
// и "вынести в библиотеку" их нельзя, не заведя третий репозиторий.
//
// 🔒 ПОРЯДОК = ПОРЯДОК КАРТОЧЕК, И ОН ПО СЛОЖНОСТИ. Простое сверху, тяжёлое
// внизу, `custom` всегда последним: человек ищет своё по масштабу задачи, а не
// по популярности.
//
// 🔒 ЗДЕСЬ ТОЛЬКО МАШИННЫЕ ДАННЫЕ. Слова — заголовок, подпись, определение,
// примеры, признаки и вопросы — живут в `lib/i18n/project-types.i18n.json` под
// тем же идентификатором. Идентификаторы машинные и НЕ переводятся.

export const PROJECT_TYPES = [
  "landing",
  "portfolio",
  "corporate",
  "media",
  "directory",
  "booking",
  "qr-menu",
  "store",
  "learning",
  "tours",
  "delivery",
  "marketplace",
  "saas",
  "crm",
  "attestation",
  "scheduler",
  "ai-coach",
  "agents",
  "competitors",
  "company-brain",
  "business-brain",
  "custom",
] as const

export type ProjectTypeId = (typeof PROJECT_TYPES)[number]

export function isProjectTypeId(v: unknown): v is ProjectTypeId {
  return typeof v === "string" && (PROJECT_TYPES as readonly string[]).includes(v)
}
