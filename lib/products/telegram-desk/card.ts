import type { IngestResult } from "./ingest"

// КАРТОЧКА ЗАПИСИ — единый ответ на любое сообщение.
//
// 🔒 ОТВЕТ ПОКАЗЫВАЕТ ТУ САМУЮ СВОДКУ, ЧТО ЛЕГЛА В БАЗУ (закон владельца
// 2026-08-23). Тогда ответ перестаёт быть вежливостью и становится РАСПИСКОЙ В
// ПОНИМАНИИ: человек видит, что именно понято, и ловит ошибку в ту же секунду, а
// не через месяц, когда ищет и не находит.
//
// ✗ до этого продукт отвечал «Записал» на рассказ, «Записал» на снимок чека и
// внятной карточкой только на напоминание. Асимметрию заметил владелец: разные
// ответы на разные роды означают, что о половине записей он не знает ничего.
//
// 🔒 ПЕЧАТАЕТСЯ ТОЛЬКО ТО, ЧТО ДЕЙСТВИТЕЛЬНО ЗАПИСАНО. Строка «в графе знаний»
// при неудавшейся загрузке — это ложь, которую обнаружат месяцем позже и уже не
// свяжут с этим ответом.

const KIND_RU: Record<string, string> = {
  memo: "запомнить",
  note: "заметка",
  task: "задача",
  receipt: "чек",
  place: "место",
  idea: "идея",
}

const FIELD_RU: Record<string, string> = {
  amount: "сумма",
  vendor: "продавец",
  address: "адрес",
  due: "срок",
  who: "кто",
  count: "количество",
}

/** Поля записи человеческими словами: `сумма 300 EUR · продавец Worten`. */
function fields(payload: Record<string, unknown> | null, currency: string): string {
  if (!payload) return ""
  const parts: string[] = []
  for (const [k, v] of Object.entries(payload)) {
    if (v === null || v === undefined || v === "") continue
    const label = FIELD_RU[k] ?? k
    const value = k === "amount" && currency ? `${String(v)} ${currency}` : String(v)
    parts.push(`${label} ${value}`)
  }
  return parts.slice(0, 5).join(" · ")
}

export function card(r: IngestResult): string {
  const lines: string[] = []

  // Первая строка — сама сводка. Пусто бывает: разбор не удался, а сообщение
  // сохранено. Тогда так и говорим, вместо бодрого «записал».
  lines.push(r.summary ? `Записал: ${r.summary}` : "Сохранил, но разобрать не смог.")

  const kind = r.kind ? KIND_RU[r.kind] ?? r.kind : ""
  const f = fields(r.payload, r.currency)
  if (kind || f) lines.push([kind && `Тип: ${kind}`, f].filter(Boolean).join(" · "))

  if (r.currencyFromConfig && r.currency) {
    lines.push(`Валюта ${r.currency} — из настроек проекта, на чеке её не видно.`)
  }
  if (r.happenedAt) lines.push(`Событие: ${r.happenedAt}`)
  if (r.fileRead) lines.push(`Вложение: ${r.fileRead}`)

  // Куда легло — по факту, а не по намерению.
  const where: string[] = []
  if (r.artifacts.some((a) => a.kind === "vector")) where.push("найдётся по смыслу")
  if (r.artifacts.some((a) => a.kind === "rag")) where.push("в графе знаний")
  if (r.artifacts.some((a) => a.kind === "media")) where.push("файл сохранён")
  if (where.length) lines.push(where.join(" · "))

  // 🔒 Денежная запись ЖДЁТ согласия — та же дисциплина, что у времени в
  // календаре: цифра, записанная неверно, всплывает при подсчёте расходов, когда
  // проверять её уже поздно.
  if (r.needsConfirm) lines.push("Всё верно? Ответьте «да» или поправьте.")

  return lines.join(String.fromCharCode(10))
}
