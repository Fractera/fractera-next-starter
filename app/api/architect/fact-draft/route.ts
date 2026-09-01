// @api turn a free-form description into a typed draft of a fact
import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { ARCHITECT_LAYER_ROLES } from "@/lib/roles"
import { draftFromWords } from "@/_tools/fact-draft/server/draft"
import { FACT_ON_MISSING, FACT_VALUE_TYPES } from "@/lib/facts/types"
import type { DraftField } from "@/_tools/fact-draft/types/fact-draft"

// ДВЕРЬ ЧЕРНОВИКА (81-5).
//
// 🔒 СХЕМА ПОЛЕЙ ЖИВЁТ ЗДЕСЬ, А НЕ В ИНСТРУМЕНТЕ. Инструмент не знает слова
// «признак» — он разбирает описание по ПЕРЕДАННОЙ схеме. Знай он про реестр,
// второй потребитель копировал бы его целиком; ровно та ошибка, ради устранения
// которой в шаге 80 чат стал инструментом.
//
// 🔒 ЗАКРЫТЫЕ СПИСКИ БЕРУТСЯ ИЗ КОНСТАНТ, А НЕ ПЕРЕЧИСЛЯЮТСЯ ЗДЕСЬ. Добавится
// форма значения — модель узнает о ней сама. Второй список разошёлся бы с первым
// молча, и модель предлагала бы значения, которых дверь реестра не принимает.
//
// 🔒 ЗАМОК ТОТ ЖЕ, ЧТО У ДВЕРИ РЕЕСТРА. Через неё уходит вызов модели — то есть
// деньги владельца; открытая, она станет способом тратить их бесплатно для чужого.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const FIELDS: readonly DraftField[] = [
  {
    name: "key",
    about: "machine name, latin lowercase, no spaces, derived from the meaning",
    required: true,
  },
  { name: "title", about: "short human name in the person's language", required: true },
  { name: "description", about: "one sentence: what this is and what goes into it" },
  { name: "valueType", about: "the form of the value", oneOf: FACT_VALUE_TYPES, required: true },
  {
    name: "howToFind",
    about:
      "the instruction for recognising it in a message: which words and shapes it appears in. This is the point of the whole record",
    required: true,
  },
  {
    name: "onMissing",
    about: "what to do when it is implied but not extractable",
    oneOf: FACT_ON_MISSING,
    required: true,
  },
]

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, ARCHITECT_LAYER_ROLES)
  if (denied) return denied

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, reason: "too-short" }, { status: 400 })

  const result = await draftFromWords(
    String(body.words ?? ""),
    FIELDS,
    String(body.lang ?? "en"),
  )

  // 🔒 ОТКАЗ — ЭТО 200 С ПРИЧИНОЙ, А НЕ ОШИБКА HTTP. «Не понял описание» и «нет
  // ключа» — законные исходы работы, а не поломка двери; интерфейс показывает их
  // словами, и различать их по коду состояния незачем.
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
}
