"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Small } from "@/components/ui/typography"
import type { InboxMessage } from "@/lib/architect/channels"
import type { ChatAttachment, ChatMessage, ChatUi } from "@/_tools/chat/types/chat"
import Chat from "@/_tools/chat/client/chat.client"

// ЛЕНТА ВХОДЯЩИХ (77-5, 2026-09-01; переселена на инструмент 80-6).
//
// 🔒 ЛЕНТУ РИСУЕТ ИНСТРУМЕНТ `_tools/chat`, А НЕ ЭТОТ ФАЙЛ. Здесь остаётся ровно
// то, чего инструмент знать не должен: опрос склада по курсору, счётчик,
// кнопка обновления и ПЕРЕВОД записи службы в сообщение ленты. Инструмент в сеть
// не ходит вовсе — поэтому один и тот же островок годится и журналу, и виду
// блока, и будущему мессенджеру.
//
// ✗ ОПЛАЧЕНО ЭТИМ ЖЕ ЭКРАНОМ. До 80-6 здесь лежала своя вёрстка ленты: список,
// пузыри, своя строка «кто · когда», свои значки родов. Библиотека AI Elements
// при этом уже лежала в репозитории — просто никто не сказал, что ею положено
// пользоваться. Ровно ради этого заведён шаг 80.
//
// 🔒 ПОЛЯ ВВОДА ЗДЕСЬ НЕТ НАМЕРЕННО, И ЭТО НЕ ОГРАНИЧЕНИЕ ИНСТРУМЕНТА. Склад —
// журнал службы, а не почтовый ящик проекта: ни ответа, ни пересылки, ни
// удаления. Инструменту просто не даётся обработчик отправки, и он честно
// остаётся лентой.
//
// 🔒 ПЕРВЫЕ ЗАПИСИ ПРИХОДЯТ С СЕРВЕРА, А НЕ ЗАПРАШИВАЮТСЯ ПОСЛЕ ЗАГРУЗКИ. Иначе
// раздел на секунду показывал бы пустоту, неотличимую от «вам никто не писал», —
// а это самое частое настоящее состояние, и путать его с загрузкой нельзя.
//
// 🔒 ОПРОС ЖИВЁТ, ПОКА ОТКРЫТ РАЗДЕЛ, И ХОДИТ ПО КУРСОРУ. Уходит только новое
// (`after=lastId`), а не пятьсот записей каждые десять секунд. Уход со страницы
// снимает таймер: невидимая вкладка, стучащая в службу вечно, — это счёт за
// трафик, которого никто не заказывал.

export type TelegramLogsLabels = {
  refresh: string
  refreshing: string
  live: string
  counted: string
  ringNote: string
  fromBot: string
  fromPerson: string
  kindVoice: string
  kindFile: string
  kindLocation: string
  forwarded: string
  empty: string
}

const POLL_MS = 10_000

export function TelegramLogs({
  initial,
  initialLastId,
  labels,
}: {
  initial: InboxMessage[]
  initialLastId: number
  labels: TelegramLogsLabels
}) {
  const [rows, setRows] = useState<InboxMessage[]>(initial)
  const [busy, setBusy] = useState(false)
  const lastId = useRef(initialLastId)

  const pull = useCallback(async (manual: boolean) => {
    if (manual) setBusy(true)
    try {
      const r = await fetch(
        `/api/architect/channels/telegram/inbox?after=${lastId.current}&limit=50`,
        { cache: "no-store" },
      )
      if (!r.ok) return
      const d = (await r.json()) as { messages?: InboxMessage[]; lastId?: number }
      const fresh = Array.isArray(d.messages) ? d.messages : []
      if (fresh.length) {
        lastId.current = Number(d.lastId ?? lastId.current)
        // 🔒 НОВОЕ ВНИЗУ, СТАРОЕ ВВЕРХУ (77-13, правка владельца): лента читается
        // как разговор, а разговор идёт сверху вниз. ✗ я сделал наоборот, по
        // привычке журнала — но журнал листают, а переписку читают.
        // 🔒 ОБРЕЗАЕМ НАЧАЛО, А НЕ КОНЕЦ: лишними становятся САМЫЕ СТАРЫЕ.
        setRows(prev => prev.concat(fresh).slice(-500))
      }
    } catch {
      // 🔒 МОЛЧА. Один пропущенный такт опроса — обычное дело; красная строка на
      // каждую сетевую заминку приучает не читать красные строки вовсе.
    } finally {
      if (manual) setBusy(false)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => void pull(false), POLL_MS)
    return () => clearInterval(timer)
  }, [pull])

  const messages = useMemo(() => rows.map(m => toChatMessage(m, labels)), [rows, labels])

  // 🔒 ПУСТОТА ОБЪЯСНЯЕТСЯ СЛОВАМИ, ПРИШЕДШИМИ С СЕРВЕРА. Причин три — нет
  // токена, чат не привязан, никто не писал, — и выбирает её серверная половина
  // раздела: ей одной видно состояние бота (77-5).
  const ui: ChatUi = {
    emptyTitle: labels.empty,
    emptyNote: "",
    placeholder: "",
    send: "",
    attach: "",
    place: labels.kindLocation,
    // 🔒 ЖУРНАЛ НЕ ПОРОЖДАЕТ КАЛЕНДАРНЫХ СОБЫТИЙ, И ПОДПИСЬ ОСТАЁТСЯ ПУСТОЙ.
    // Договор инструмента требует ключ целиком; подставить сюда чужое слово
    // («место») значило бы приготовить ложную подпись на день, когда события
    // появятся, — и никто бы её не заметил, потому что сегодня она не видна.
    event: "",
    forwarded: labels.forwarded,
  }

  return (
    <div data-telegram-logs className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => void pull(true)} disabled={busy}>
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {busy ? labels.refreshing : labels.refresh}
        </Button>
        <Small className="text-muted-foreground">{labels.live}</Small>
        <Small data-logs-count className="ml-auto text-muted-foreground">
          {labels.counted.replace("{n}", String(rows.length))}
        </Small>
      </div>

      {/* 🔒 ВЫСОТА ЗАДАЁТСЯ ЗДЕСЬ, А НЕ ИНСТРУМЕНТОМ: он держит низ ленты, но
          сколько места ему дали — дело хозяина экрана. */}
      <div data-logs-feed className="h-[560px]">
        <Chat messages={messages} ui={ui} className="h-full" />
      </div>

      <Small className="text-muted-foreground">{labels.ringNote}</Small>
    </div>
  )
}

/**
 * Запись склада службы → сообщение ленты. ЕДИНСТВЕННОЕ место перевода.
 *
 * 🔒 `direction: "out"` — РЕПЛИКА БОТА, И ОТЛИЧАЕТСЯ ОНА СТОРОНОЙ, А НЕ ПОДПИСЬЮ
 * (77-11). У инструмента роль `assistant` рисуется справа и своей заливкой —
 * ровно то, что раньше делалось вручную сдвигом и рамкой.
 * 🔒 ЗАПИСЬ БЕЗ `direction` — ВХОДЯЩАЯ: склад был полон до того, как поле
 * появилось, и правка формата не имеет права сделать прежние сообщения чужими.
 */
function toChatMessage(m: InboxMessage, labels: TelegramLogsLabels): ChatMessage {
  const out = m.direction === "out"
  return {
    id: String(m.id),
    from: out ? "assistant" : "user",
    text: m.text || null,
    // Время показывается так же, как показывалось до переселения: дата и часы
    // без секунд и без зоны — журнал читают глазами, а не сверяют по нему часы.
    at: m.at.replace("T", " ").slice(0, 16),
    who: out ? labels.fromBot : (m.who ?? labels.fromPerson),
    forwardedFrom: m.forwardedFrom ?? null,
    attachments: toAttachments(m, labels),
  }
}

/**
 * Три рода вложения, которые склад службы знает.
 *
 * 🔒 У ГОЛОСА И ФАЙЛА ЕСТЬ РОД И НЕТ АДРЕСА: служба хранит идентификатор файла
 * Telegram, а не ссылку. Инструмент с 80-6 умеет такое вложение — рисует строку
 * со значком рода и подписью. Прежний экран показывал ровно столько же, значками
 * «голос» и «файл», и ни байтом больше.
 */
function toAttachments(m: InboxMessage, labels: TelegramLogsLabels): ChatAttachment[] | undefined {
  const out: ChatAttachment[] = []
  if (m.kind === "voice") out.push({ kind: "audio", name: labels.kindVoice })
  if (m.fileId) out.push({ kind: "document", name: labels.kindFile })
  if (m.lat != null && m.lon != null) {
    out.push({ kind: "place", lat: m.lat, lon: m.lon, label: labels.kindLocation })
  }
  return out.length ? out : undefined
}
