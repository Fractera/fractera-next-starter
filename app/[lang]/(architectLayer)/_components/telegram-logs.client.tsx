"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, RefreshCw, MapPin, Mic, Paperclip, CornerUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Small } from "@/components/ui/typography"
import type { InboxMessage } from "@/lib/architect/channels"

// ЛЕНТА ВХОДЯЩИХ (77-5, 2026-09-01).
//
// 🔒 ЭТО НЕ ПЕРЕНОС — В ПАНЕЛИ ТАКОГО ЭКРАНА НЕТ. Служба хранила последние 500
// сообщений с самого начала, и читал их только код. Поэтому здесь нет источника,
// с которого списывать поведение, и всё, что нужно объяснить, объяснено на месте.
//
// 🔒 ПЕРВЫЕ ЗАПИСИ ПРИХОДЯТ С СЕРВЕРА, А НЕ ЗАПРАШИВАЮТСЯ ПОСЛЕ ЗАГРУЗКИ. Иначе
// раздел на секунду показывал бы пустоту, неотличимую от «вам никто не писал», —
// а это самое частое настоящее состояние, и путать его с загрузкой нельзя.
//
// 🔒 ОПРОС ЖИВЁТ, ПОКА ОТКРЫТ РАЗДЕЛ, И ХОДИТ ПО КУРСОРУ. Уходит только новое
// (`after=lastId`), а не пятьсот записей каждые десять секунд. Уход со страницы
// снимает таймер: невидимая вкладка, стучащая в службу вечно, — это счёт за
// трафик, которого никто не заказывал.
//
// 🔒 ЛЕНТА ТОЛЬКО ЧИТАЕТ. Ни ответа, ни пересылки, ни удаления здесь нет: склад —
// журнал службы, а не почтовый ящик проекта.

export type TelegramLogsLabels = {
  refresh: string
  refreshing: string
  live: string
  counted: string
  ringNote: string
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
        // Новые сверху: человек читает ленту как разговор, а не как файл.
        setRows(prev => [...fresh].reverse().concat(prev).slice(0, 500))
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

      {rows.length === 0 ? (
        <Small data-logs-empty className="rounded-md border border-border bg-muted/40 p-3 leading-relaxed text-muted-foreground">
          {labels.empty}
        </Small>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map(m => (
            <li
              key={m.id}
              data-logs-row
              className="flex flex-col gap-1 rounded-md border border-border p-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[length:var(--fs-small)] text-foreground">
                  {m.who}
                </span>
                <time
                  dateTime={m.at}
                  className="text-[length:var(--fs-small)] text-muted-foreground"
                >
                  {m.at.replace("T", " ").slice(0, 16)}
                </time>
                {m.kind === "voice" && (
                  <span className="inline-flex items-center gap-1 text-[length:var(--fs-small)] text-muted-foreground">
                    <Mic className="size-3" />
                    {labels.kindVoice}
                  </span>
                )}
                {m.fileId && (
                  <span className="inline-flex items-center gap-1 text-[length:var(--fs-small)] text-muted-foreground">
                    <Paperclip className="size-3" />
                    {labels.kindFile}
                  </span>
                )}
                {m.lat != null && m.lon != null && (
                  <span className="inline-flex items-center gap-1 text-[length:var(--fs-small)] text-muted-foreground">
                    <MapPin className="size-3" />
                    {labels.kindLocation}
                  </span>
                )}
                {m.forwardedFrom && (
                  <span className="inline-flex items-center gap-1 text-[length:var(--fs-small)] text-muted-foreground">
                    <CornerUpRight className="size-3" />
                    {labels.forwarded} {m.forwardedFrom}
                  </span>
                )}
              </div>
              {/* 🔒 ТЕКСТ ЧЕЛОВЕКА ПОКАЗЫВАЕТСЯ ТЕКСТОМ. Никакой разметки из
                  сообщения: сюда пишут посторонние люди, и содержимое чужого
                  сообщения — данные, а не инструкция и не HTML. */}
              {m.text && (
                <p className="break-words text-[length:var(--fs-small)] leading-relaxed text-foreground">
                  {m.text}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <Small className="text-muted-foreground">{labels.ringNote}</Small>
    </div>
  )
}
