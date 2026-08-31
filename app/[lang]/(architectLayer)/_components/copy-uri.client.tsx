"use client"

import { useRef, useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

// КОПИРОВАНИЕ АДРЕСА ВОЗВРАТА OAuth — ПЕРЕНЕСЕНО ИЗ ПАНЕЛИ С ПОПРАВКОЙ
// (78-3, 2026-08-31).
//
// Зачем он вообще: адрес нужно перенести в консоль Google, и набирать его руками
// — верный способ опечататься так, что вход будет отказывать без объяснимой
// причины.
//
// 🔒 САМ АДРЕС ОТРИСОВАН СЕРВЕРОМ И ВИДЕН ТЕКСТОМ. Кнопка добавляет удобство, а
// не является единственным путём: откажи браузер в буфере — адрес всё равно
// можно выделить и скопировать. Это правило переехало из источника дословно.
//
// ✗ ПОПРАВКА ПРОТИВ ИСТОЧНИКА, И ОНА ОПЛАЧЕНА (75-9). Панель лечила отказ буфера
// одним словом в тосте. `navigator.clipboard` существует ТОЛЬКО в защищённом
// контексте — `https` или `localhost`, — а этот слой открывается по
// `http://<IP>` ровно до того дня, когда человек назначит домен. То есть отказ
// здесь не край, а ОБЫЧНОЕ состояние первых дней.
//
// 🔒 ЛЕЧЕНИЕ ТРЁХСЛОЙНОЕ, И СРЕДНИЙ СЛОЙ ЗДЕСЬ ОСНОВНОЙ, А НЕ ЗАПАСНОЙ:
//   1) современный путь, если браузер его даёт;
//   2) `document.execCommand` — объявлен устаревшим и работает ровно там, где
//      первого нет вовсе;
//   3) не вышло ничем — текст ВЫДЕЛЯЕТСЯ САМ, а сообщение говорит, что делать.
//
// ✗ И ВТОРАЯ ЧАСТЬ ТОГО ЖЕ УРОКА: в отказе показывалась ПОДПИСЬ КНОПКИ вместо
// объяснения — человек читал в тосте то же слово, что на кнопке, и был уверен,
// что получилось. Здесь у отказа свои слова.

export function CopyUri({
  value,
  copyLabel,
  copiedLabel,
  failedLabel,
}: {
  value: string
  copyLabel: string
  copiedLabel: string
  /** Что ДЕЛАТЬ, а не «не удалось»: текст выделен, нажмите Ctrl+C. */
  failedLabel: string
}) {
  const [done, setDone] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  function selectSelf() {
    const el = textRef.current
    if (!el) return
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  async function copy() {
    // Слой 1 — современный путь.
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value)
        setDone(true)
        toast.success(copiedLabel)
        setTimeout(() => setDone(false), 2000)
        return
      }
    } catch {
      // Падаем ниже — это ожидаемо вне защищённого контекста.
    }

    // Слой 2 — основной на `http://<IP>`.
    try {
      const ta = document.createElement("textarea")
      ta.value = value
      // Вне экрана, но в документе: иначе выделение не работает.
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      ta.style.pointerEvents = "none"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      if (ok) {
        setDone(true)
        toast.success(copiedLabel)
        setTimeout(() => setDone(false), 2000)
        return
      }
    } catch {
      // Падаем ниже.
    }

    // Слой 3 — выделяем сами и говорим, что делать.
    selectSelf()
    toast.error(failedLabel, { duration: 8000 })
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span
        ref={textRef}
        data-copy-uri
        className="break-all rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[length:var(--fs-small)] text-foreground"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={copy}
        data-copy-uri-button
        aria-label={copyLabel}
        title={copyLabel}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-border px-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        {done ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
        {done ? copiedLabel : copyLabel}
      </button>
    </span>
  )
}
