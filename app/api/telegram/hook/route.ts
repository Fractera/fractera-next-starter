// @api receive one telegram message pushed by the channel service
import { NextRequest, NextResponse } from "next/server"
import { ingest, recordOutgoing } from "@/lib/products/telegram-desk/ingest"
import { answer } from "@/lib/products/telegram-desk/answer"
import { dataFetch } from "@/lib/fractera/data-service"
import {
  propose, speak, confirm, cancel,
  waitingNow, confirmEntry, cancelEntry,
  applyEntryCorrection, applyCalendarCorrection,
} from "@/lib/products/telegram-desk/calendar"
import { extractCorrection } from "@/lib/products/telegram-desk/branches/correct"
import { cityToZone } from "@/lib/products/telegram-desk/branches/where"
import { sendStoredFile } from "@/lib/products/telegram-desk/branches/files"
import { saveTimezone, timezoneOf } from "@/lib/products/telegram-desk/timezone"
import { WHERE_MARK } from "@/lib/products/telegram-desk/ingest"
import { card } from "@/lib/products/telegram-desk/card"
import { GREETING } from "@/lib/products/telegram-desk/persona"
import { meta } from "@/lib/products/telegram-desk/branches/meta"

// ДВЕРЬ, В КОТОРУЮ СЛУЖБА КАНАЛОВ ТОЛКАЕТ СООБЩЕНИЕ.
//
// 🔒 РОЛЬ ЗДЕСЬ НЕ ПРОВЕРЯЕТСЯ, И ЭТО НЕ ДЫРА. Стучится не человек, а служба с
// соседнего порта: сессии у неё нет и быть не может. Вместо роли — общий секрет,
// и он же причина, по которой префикс стоит в PUBLIC_API_PREFIXES: гейт закрывает
// /api/* целиком, и без записи дверь отвечала бы 401 самой платформе.
//
// 🔒 СЕКРЕТ ОБЯЗАТЕЛЕН. Пусто в окружении — дверь закрыта наглухо (503), а не
// открыта всем: незаданный секрет, читаемый как «проверять нечего», превратил бы
// её в бесплатный вход в чужую базу и в чужой ключ модели.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ЧТО ОТВЕТИТЬ — четыре разных случая, и путать их дорого.
//
// 🔒 ПОДТВЕРЖДЕНИЕ ПРОВЕРЯЕТСЯ ПЕРВЫМ. Человек, сказавший «да», отвечает на
// последний вопрос продукта, а не заводит новую заметку с текстом «да».
async function compose(
  text: string,
  chatId: string,
  r: Awaited<ReturnType<typeof ingest>>,
): Promise<string> {
  switch (r.intent) {
    case "command":
      return GREETING

    // О себе отвечает личность, а не поиск по чужим заметкам.
    case "meta":
      return await meta(text)

    case "confirm": {
      // 🔒 СНАЧАЛА — ПРЕДЛОЖЕННАЯ ЗАПИСЬ. Мы могли предложить прислать голосовое
      // последним ответом; «да» отвечает на ПОСЛЕДНЕЕ, о чём спрашивали, и
      // подтвердить им вчерашнее напоминание значит переставить чужое дело.
      const offered = await lastOfferedRecording(chatId)
      if (offered) {
        const sent = await sendStoredFile(chatId, offered, "Вот эта запись.")
        return sent ? "" : "Не смог достать запись. Она сохранена, но отдать её не получилось."
      }

      const waiting = await waitingNow(chatId)
      // Подтверждать нечего — человек согласился с воздухом. Сказать это
      // честно дешевле, чем промолчать: иначе он ждёт напоминания, которого нет.
      if (!waiting) return "Сейчас нечего подтверждать."
      if (r.confirmation === "no") {
        if (waiting.what === "calendar") {
          await cancel(waiting.id)
          return "Отменил. Назовите другое время, если нужно."
        }
        await cancelEntry(waiting.id)
        return "Отменил. Напишите, как правильно."
      }
      if (waiting.what === "calendar") {
        await confirm(waiting.id)
        return `Поставил: ${waiting.title}.`
      }
      await confirmEntry(waiting.id)
      return `Подтвердил: ${waiting.title}.`
    }

    // Ответ на наш вопрос о поясе: записываем и БОЛЬШЕ НЕ СПРАШИВАЕМ.
    case "where": {
      const zone = await cityToZone(text)
      if (!zone) return `Не понял место. Назовите город — например, «Мадрид».`
      // 🔒 Пишем сразу, а не отправляем человека в настройки: до поля в панели
      // почти никто не доходит, а пустой пояс молча ломает каждое напоминание.
      // Решение владельца 2026-08-23.
      if (!saveTimezone(zone)) {
        return "Понял, но записать не смог. Поставьте часовой пояс в настройках приложения."
      }
      return `Запомнил: ${zone}. Теперь время считаю по вашим часам.`
    }

    case "schedule": {
      // Время ПРОИЗНОСИТСЯ вслух и ждёт согласия — модель ошибается в датах,
      // а цена ошибки здесь не «неточность», а пропущенная встреча.
      if (r.schedule) {
        await propose(chatId, r.messageId, r.schedule)
        const said = speak(r.schedule)
        // 🔒 Пояс спрашивается ровно там, где он впервые НУЖЕН, и один раз.
        // Спросить при знакомстве значило бы задать вопрос человеку, который
        // ещё не понял, зачем он тут; спросить позже — поставить напоминание
        // не на то время и заставить его это обнаружить.
        if (!timezoneOf()) {
          return `${said}

И ещё: в каком городе вы живёте? Мне нужен ваш ${WHERE_MARK}, иначе время считаю по Гринвичу.`
        }
        return said
      }
      // Ветвь угадана, время — нет. Просить уточнить честнее, чем молча
      // превратить просьбу в заметку: так это и терялось четыре раза подряд.
      return "Записал. Когда напомнить? Назовите дату и время."
    }

    // Поправка: человек исправляет то, что мы ему прочитали. Меняется ТОЛЬКО
    // названное — поправив дату, он не перепроверял сумму.
    case "correct": {
      const waiting = await waitingNow(chatId)
      if (!waiting) return "Сейчас нечего исправлять."
      const c = await extractCorrection(text, waiting.title)

      if (waiting.what === "calendar") {
        if (!c.when) return `Не понял новое время. Назовите дату и час.`
        const shown = await applyCalendarCorrection(waiting.id, c.when)
        await confirm(waiting.id)
        return `Поправил и поставил: ${waiting.title} — ${shown}.`
      }

      const changed = Object.values(c).some((v) => v !== null)
      if (!changed) return "Не понял, что поправить. Назовите дату, сумму или продавца."
      const after = await applyEntryCorrection(waiting.id, c)
      await confirmEntry(waiting.id)
      const bits = [
        after.title,
        after.payload.amount !== undefined ? `${after.payload.amount} ${after.currency}`.trim() : "",
        after.payload.vendor ? String(after.payload.vendor) : "",
        after.date ? `дата ${after.date}` : "",
      ].filter(Boolean)
      return `Поправил: ${bits.join(" · ")}.`
    }

    case "question":
      return await answer(text)

    default:
      // 🔒 Один ответ на любой род: карточка показывает ТУ САМУЮ сводку,
      // что легла в базу. Ответ — расписка в понимании, а не вежливость.
      return card(r)
  }
}
// Метка предложения: узнаётся по нашему же последнему ответу, как и вопрос о
// поясе. Отдельного поля состояния для этого не заводим — состояние, живущее
// рядом с перепиской, расходится с ней при первом же сбое.
const OFFER_MARK = /#(d+)[^#]*прислать запись/i

async function lastOfferedRecording(chatId: string): Promise<number | null> {
  const { db } = await import("@/lib/db")
  const row = (await db
    .prepare(
      `SELECT text FROM tgdesk_messages
        WHERE chat_id = ? AND direction = 'out' ORDER BY id DESC LIMIT 1`,
    )
    .get(chatId)) as { text?: string } | undefined
  const m = OFFER_MARK.exec(String(row?.text ?? ""))
  return m ? Number(m[1]) : null
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_HOOK_SECRET ?? ""
  if (!secret) {
    return NextResponse.json({ ok: false, error: "hook-not-configured" }, { status: 503 })
  }
  if (req.headers.get("x-channel-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 })

  const text = String(body.text ?? "").trim()
  const chatId = String(body.chatId ?? "")
  const fileId = String(body.fileId ?? "")
  // Текст ИЛИ файл — одного достаточно. Снимок без подписи несёт смысл на себе.
  if ((!text && !fileId) || !chatId) {
    return NextResponse.json({ ok: false, error: "text or fileId, and chatId, are required" }, { status: 400 })
  }

  const result = await ingest({
    externalId: String(body.id ?? ""),
    at: String(body.at ?? ""),
    chatId,
    who: String(body.who ?? ""),
    kind: String(body.kind ?? "text"),
    text,
    fileId: fileId || undefined,
    objectType: body.objectType ? String(body.objectType) : undefined,
    forwardedFrom: body.forwardedFrom ? String(body.forwardedFrom) : undefined,
    // 🔒 КОНТАКТ ПРОПУСКАЕТСЯ НАСКВОЗЬ, ХОТЯ СЛУЖБА ЕГО ЕЩЁ НЕ ШЛЁТ (81-10):
    // дверь готова принять его в тот день, когда служба научится присылать, и
    // правка тогда будет РОВНО ОДНА. Форма проверена здесь, а не принята на веру.
    contact:
      body.contact && typeof body.contact === "object"
        ? {
            name: String((body.contact as Record<string, unknown>).name ?? "") || undefined,
            phone: String((body.contact as Record<string, unknown>).phone ?? "") || undefined,
          }
        : undefined,
    lat: typeof body.lat === "number" ? body.lat : undefined,
    lon: typeof body.lon === "number" ? body.lon : undefined,
  })

  // 🔒 ПАУЗА РАЗБОРА (режим отладки): отвечаем СТАТИЧЕСКОЙ строкой, не зовя
  // модель. Молчание бота человек читает как поломку, а любой сочинённый ответ
  // означал бы вызов модели — то есть ровно то, что пауза и запрещает.
  if (result.notes.includes("paused")) {
    return NextResponse.json({ ok: true, messageId: result.messageId, paused: true })
  }

  // Повтор доставки: строка уже есть, отвечать человеку второй раз не за что.
  if (result.duplicate) {
    return NextResponse.json({ ok: true, messageId: result.messageId, duplicate: true })
  }

  // Ответ человеку. Он идёт через службу — своего клиента Telegram здесь нет и
  // не будет: читатель бота один, и это она.
  // 🔒 РАССКАЗ И ВОПРОС — РАЗНЫЕ ОТВЕТЫ, И ЭТО НЕ ВЕЖЛИВОСТЬ.
  // Первый живой прогон показал: на фразу «вчера купил ноутбук» ассистент
  // пересказал её же, исправив пунктуацию. Формально правил он не нарушил —
  // ничего не выдумал; полезного тоже не сказал. Человеку, который делится
  // фактом, нужно подтверждение, что факт записан и КАК он понят; ответ на
  // вопрос строится по всей истории и стоит дороже — задавать его на каждое
  // утверждение значит платить за эхо.
  let replied = false
  try {
    let reply = await compose(text, chatId, result)

    // 🔒 ПОДСКАЗКА О КАНДИДАТЕ — ОТДЕЛЬНОЙ СТРОКОЙ В КОНЦЕ, А НЕ ВМЕСТО
    // ОТВЕТА (81-7). Спросили про пирожки — ответ про пирожки; предложение
    // завести признак приписывается после, и только когда есть что предложить.
    //
    // 🔒 ПРИПИСЫВАЕТСЯ К НЕПУСТОМУ ОТВЕТУ. Пустой ответ означает «я уже ответил
    // иначе» — прислал файл; подсказка вместо него превратилась бы во второе
    // сообщение о том, чего человек не спрашивал.
    if (result.candidate && reply.trim()) {
      reply +=
        String.fromCharCode(10, 10) +
        `Вы говорите о том, чего нет в реестре признаков, — похоже на «${result.candidate}». ` +
        "Чтобы это сохранялось и находилось, заведите признак в настройках бота."
    }

    // 🔒 ПУСТОЙ ОТВЕТ — ЭТО «Я УЖЕ ОТВЕТИЛ ИНАЧЕ». Так возвращается ветвь,
    // приславшая файл: слать вдогонку «вот» было бы вторым сообщением о том же.
    // Отправить пустую строку Telegram не даст, а молчание тут законно.
    if (!reply.trim()) {
      return NextResponse.json({ ok: true, messageId: result.messageId, replied: true, sentFile: true })
    }

    const res = await dataFetch("/service/channels/telegram/send", {
      method: "POST",
      body: JSON.stringify({ chatId, text: reply }),
    })
    replied = res.ok
    if (replied) await recordOutgoing(chatId, reply)
  } catch {
    // Ответ не ушёл — сообщение всё равно принято. Служба не должна повторять
    // доставку из-за того, что мы не смогли поговорить.
  }

  return NextResponse.json({
    ok: true,
    messageId: result.messageId,
    artifacts: result.artifacts.length,
    understood: result.understood,
    replied,
    notes: result.notes,
  })
}
