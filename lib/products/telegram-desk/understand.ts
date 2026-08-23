import { routeIntent, type Intent } from "./route-intent"
import { capture, EMPTY_CAPTURE, ENTRY_KINDS, type Capture, type EntryKind } from "./branches/capture"
import { extractSchedule, type Schedule } from "./branches/schedule"

// ДИСПЕТЧЕР: маршрут → ветка. Своих промптов здесь нет и быть не должно.
//
// 🔒 ФОРМА РАБОТЫ (решение владельца 2026-08-23): сперва определить, ЧТО за
// просьба, и только потом исполнять её отдельной короткой инструкцией. Ветвление
// живёт в коде, где его видно и можно проверить, а не внутри промпта, где оно
// исполняется «по настроению» и отказывает молча.
//
// Что этим куплено, кроме надёжности: «да» и «/start» больше не гоняют полный
// разбор, а вопрос о самом ассистенте не поднимает двадцать сообщений из базы.

export { ENTRY_KINDS }
export type { EntryKind, Schedule }

export type Understanding = Capture & {
  /** Ветвь, по которой пошло сообщение. Дверь строит ответ по ней. */
  intent: Intent
  /** Заполнено только у ветви schedule. */
  schedule: Schedule | null
  /** yes/no — только у ветви confirm. */
  confirmation: "yes" | "no" | null
}

const NOTHING: Understanding = {
  ...EMPTY_CAPTURE,
  intent: "capture",
  schedule: null,
  confirmation: null,
}

// Согласие и отказ распознаются СЛОВАМИ, без модели: ветвь confirm уже
// определена маршрутизатором, и спрашивать второй раз «это да или нет» значит
// платить за то, что видно глазом.
const YES = /^(да|ага|давай|ставь|верно|точно|ок|окей|ok|yes|yep|sure)\b/i
const NO = /^(нет|не надо|отмени|отбой|no|nope|cancel)\b/i

export async function understand(text: string, awaiting = false): Promise<Understanding> {
  const t = text.trim()
  const intent = await routeIntent(t, awaiting)

  switch (intent) {
    // Две ветви не стоят ни одного вызова модели.
    case "command":
      return { ...NOTHING, intent }
    case "confirm":
      return { ...NOTHING, intent, confirmation: NO.test(t) ? "no" : YES.test(t) ? "yes" : "yes" }

    // Вопросы моделью здесь не разбираются: на них отвечают answer() и meta(),
    // каждый своим путём. Разбирать вопрос как рассказ значило бы засорять
    // историю записями «сколько я потратил» вперемешку с тратами.
    // Поправка разбирается отдельной веткой в двери: там известно, ЧТО именно
    // ждёт исправления, а без этого «20 августа» не к чему приложить.
    case "correct":
    case "question":
    case "meta":
      return { ...NOTHING, intent, summary: t.slice(0, 200) }

    case "schedule": {
      // 🔒 РАССКАЗ ВНУТРИ ПРОСЬБЫ НЕ ТЕРЯЕТСЯ. «Купил билеты, напомни завтра
      // распечатать» — это и покупка, и напоминание; две ветви работают
      // параллельно, потому что человек сказал обе вещи разом.
      const [sched, cap] = await Promise.all([extractSchedule(t), capture(t)])
      return { ...cap, intent, schedule: sched, confirmation: null }
    }

    default: {
      const cap = await capture(t)
      return { ...cap, intent: "capture", schedule: null, confirmation: null }
    }
  }
}
