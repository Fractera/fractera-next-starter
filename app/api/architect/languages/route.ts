// @api read and save the language set this project builds pages for
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { readEnvValue, writeEnvValue } from "@/lib/architect/env-writer"
import { ALL_LANGUAGE_METADATA } from "@/config/translations/language-metadata"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/translations/translations.config"

// ДВЕРЬ НАБОРА ЯЗЫКОВ ПРОЕКТА (шаг 31-16, 2026-08-29).
//
// 🔒 ЗДЕСЬ ПИШЕТСЯ ОКРУЖЕНИЕ, А НЕ КОНФИГ, И ПОСЛЕДСТВИЕ ЭТОГО ОДНО: сохранённое
// не действует до пересборки. Дверь честно отвечает `pendingRebuild: true`, чтобы
// страница сказала об этом словами, а не оставила человека думать, что он
// переключил языки сайта одним щелчком.
//
// 🔒 ЗАПИСЫВАЮТСЯ ДВЕ ПЕРЕМЕННЫЕ, И ВТОРАЯ ОБЯЗАТЕЛЬНА. Язык по умолчанию живёт
// отдельно (`NEXT_PUBLIC_DEFAULT_LOCALE`), и набор без него — это набор, из
// которого проект возьмёт первый попавшийся: сняли английский, а он и был
// умолчанием — и сайт молча сменил основной язык.
//
// 🔒 ПРОВЕРКА НА СЕРВЕРЕ, А НЕ ТОЛЬКО В ФОРМЕ. Пустой набор оставил бы проект без
// единого языка, а умолчание вне набора — без главной страницы. Форма это
// показывает; дверь это ЗАПРЕЩАЕТ, потому что дверь видна в любой вкладке
// разработчика.
export const dynamic = "force-dynamic"

const KEY_LANGS = "NEXT_PUBLIC_SUPPORTED_LANGUAGES"
const KEY_DEFAULT = "NEXT_PUBLIC_DEFAULT_LOCALE"

/** Что записано в файле сейчас; пусто — работает то, с чем собран проект. */
function currentFromFile(): { languages: string[]; defaultLanguage: string } {
  const raw = readEnvValue(KEY_LANGS)
  const languages = raw
    ? raw.split(",").map(s => s.trim()).filter(Boolean)
    : [...SUPPORTED_LANGUAGES]
  const def = readEnvValue(KEY_DEFAULT) ?? DEFAULT_LANGUAGE
  return { languages, defaultLanguage: def }
}

export async function GET(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const file = currentFromFile()
  return NextResponse.json({
    ok: true,
    ...file,
    // Собранный набор — то, что сайт отдаёт ПРЯМО СЕЙЧАС. Расхождение с файлом и
    // есть «сохранено, но не пересобрано», и увидеть его должен человек, а не мы.
    built: [...SUPPORTED_LANGUAGES],
    builtDefault: DEFAULT_LANGUAGE,
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

  const b = body as { languages?: unknown; defaultLanguage?: unknown } | null
  const languages = Array.isArray(b?.languages)
    ? (b.languages as unknown[]).filter((x): x is string => typeof x === "string")
    : null
  const defaultLanguage = typeof b?.defaultLanguage === "string" ? b.defaultLanguage : null

  if (!languages || languages.length === 0) {
    return NextResponse.json({ ok: false, error: "empty-set" }, { status: 400 })
  }
  // Неизвестный код прошёл бы в сборку и уронил бы её на разборе — отказываем
  // здесь, где ошибку ещё видно человеку.
  const unknown = languages.filter(code => !ALL_LANGUAGE_METADATA[code])
  if (unknown.length > 0) {
    return NextResponse.json({ ok: false, error: "unknown-language", detail: unknown.join(",") }, { status: 400 })
  }
  if (!defaultLanguage || !languages.includes(defaultLanguage)) {
    return NextResponse.json({ ok: false, error: "default-not-in-set" }, { status: 400 })
  }

  const one = writeEnvValue(KEY_LANGS, languages.join(","))
  if (!one.ok) {
    return NextResponse.json({ ok: false, error: one.reason, detail: one.detail }, { status: 500 })
  }
  const two = writeEnvValue(KEY_DEFAULT, defaultLanguage)
  if (!two.ok) {
    return NextResponse.json({ ok: false, error: two.reason, detail: two.detail }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    languages,
    defaultLanguage,
    // 🔒 ГОВОРИМ ПРЯМО: СОХРАНЕНО, НО ЕЩЁ НЕ ПРИМЕНЕНО. Промолчать здесь значило
    // бы отдать человеку зелёное «Сохранено» на настройку, которой сайт не видит.
    pendingRebuild: true,
  })
}
