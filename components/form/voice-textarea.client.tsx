"use client"

import { useId, useRef } from "react"
import { Field, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { H3, Small } from "@/components/ui/typography"
import { useVoiceRecorder, VOICE_BAR } from "@/_tools/voice-input/client/use-voice-recorder"
import { MicIcon } from "./mic-icon"

// ФИРМЕННАЯ ОБЛАСТЬ ТЕКСТА С ГОЛОСОМ (шаг 32-5, 2026-08-28).
//
// 🔒 ВТОРОЙ ЭЛЕМЕНТ, А НЕ ВТОРОЙ РЕЖИМ ПЕРВОГО. Владелец, увидев готовое поле:
// «если мы говорим о области ввода текста, то естественно в нём справа
// устанавливать кнопку микрофона ЗАПРЕЩЕНО, поэтому область текста будет иметь
// кнопку снизу, которая будет занимать всю ширину такую же, как занимает
// контейнер для области ввода текста, так как кнопка находится под ним».
//
// Причина не в оформлении, а в геометрии: у ОДНОСТРОЧНОГО поля правый край лежит
// на той же высоте, что и текст, — кнопка встаёт рядом и читается как часть поля.
// У области на три строки такого края НЕ СУЩЕСТВУЕТ: кнопка либо липнет к верхней
// строке, либо болтается по центру пустоты, и в обоих случаях выглядит чужой.
//
// ✗ Развилка `multiline?: boolean` внутри `VoiceField` дала бы один компонент с
// двумя раскладками, двумя наборами классов и вечным вопросом «работает ли этот
// проп в том режиме». Два облика над ОДНИМ хуком честнее — ровно та конструкция,
// что принята в 32-2.
//
//   H3 заголовок
//   подсказка
//   ┌ область текста ───────────────────┐
//   └───────────────────────────────────┘
//   [ 🎤 кнопка — ВО ВСЮ ШИРИНУ области ]
//   ▁▃▅▂▇▃▁ 00:07        ← полоса, пока идёт запись
//   [ расшифровка ]       ← на её месте, когда запись кончилась
//   комментарий под всей областью
//
// 🔒 КНОПКА ШИРИНОЙ В ПОЛЕ — требование владельца дословно. Она стоит под полем и
// принадлежит ему; кнопка уже поля читалась бы как отдельный элемент, случайно
// оказавшийся рядом.
//
// 🔒 МЕХАНИКА — ТОТ ЖЕ ХУК. Третьей реализации работы с микрофоном в проекте не
// появляется; `targetRef` указывает на область текста, и память курсора работает
// так же — расшифровка встаёт туда, где курсор стоял в момент начала речи.

export function VoiceTextarea({
  value,
  onChange,
  lang,
  title,
  hint,
  comment,
  placeholder,
  rows = 4,
  disabled,
  apiUrl = "/api/transcribe",
}: {
  value: string
  onChange: (next: string) => void
  /** Язык страницы — на нём говорят кнопка и объяснения отказа. */
  lang: string
  /** Заголовок третьего уровня над областью. */
  title: string
  /** Подсказка под заголовком: зачем это поле. */
  hint?: string
  /** Комментарий под ВСЕЙ областью — последнее, что читают. */
  comment?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  apiUrl?: string
}) {
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const id = useId()
  const titleId = id + "-title"
  const hintId = id + "-hint"
  const v = useVoiceRecorder({ targetRef: areaRef, value, onChange, lang, disabled, apiUrl })
  const L = v.strings

  const failure = v.note || (!v.supported ? L.tipInsecure : "")

  return (
    <Field data-voice-textarea className="gap-3">
      {/* Заголовок — настоящий `H3`, а не подпись поля, наряженная под заголовок:
          причина та же, что в `VoiceField`. Поле получает имя через
          `aria-labelledby`. */}
      <div className="flex flex-col gap-1">
        <H3 variant="ui" id={titleId}>{title}</H3>
        {hint && <Small id={hintId}>{hint}</Small>}
      </div>

      <Textarea
        id={id}
        ref={areaRef}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-labelledby={titleId}
        aria-describedby={hint ? hintId : undefined}
        onChange={e => onChange(e.target.value)}
        className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
      />

      {/* 🔒 КНОПКА ПОД ПОЛЕМ И ВО ВСЮ ЕГО ШИРИНУ. Здесь она подписана словами, а не
          одним значком: у неё есть место, и молчаливый значок во всю ширину экрана
          выглядел бы кнопкой неизвестного назначения. */}
      <Button
        type="button"
        variant="outline"
        title={v.supported ? L.tipOk : L.tipInsecure}
        disabled={disabled || v.busy || !v.supported}
        data-voice-mic
        data-recording={v.recording ? "true" : "false"}
        onPointerDown={e => { e.preventDefault(); v.start() }}
        onPointerUp={v.stop}
        onPointerLeave={v.stop}
        onPointerCancel={v.stop}
        className={
          "h-10 w-full justify-center gap-2 " +
          (v.recording ? "border-rose-500/50 text-rose-700 dark:text-rose-400" : "")
        }
      >
        <MicIcon off={!v.supported} />
        {v.busy ? L.transcribing : v.recording ? L.recording : L.mic}
      </Button>

      {/* Одно место, три состояния, взаимно исключающие друг друга — как в
          `VoiceField`: идёт запись → полоса; есть что решить → область текста;
          иначе пусто. */}
      {v.recording ? (
        <div
          data-voice-bar
          ref={el => {
            if (el) v.setBarCapacity(Math.floor(el.clientWidth / (VOICE_BAR.width + VOICE_BAR.gap)))
          }}
          className="relative h-12 w-full overflow-hidden rounded-lg border border-border bg-muted/40"
        >
          <div className="absolute inset-0 flex items-center" style={{ gap: `${VOICE_BAR.gap}px`, paddingInline: 4 }}>
            {v.bars.map((h, i) => (
              <span
                key={i}
                className="shrink-0 rounded-sm bg-primary/70"
                style={{ width: `${VOICE_BAR.width}px`, height: `${h}px` }}
              />
            ))}
          </div>
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-md bg-background px-2.5 py-1 text-[length:var(--fs-small)] font-medium tabular-nums text-foreground shadow-sm">
            {v.elapsed}
          </span>
        </div>
      ) : v.draft !== null ? (
        <div data-voice-draft className="flex w-full flex-col gap-2">
          <Small>{L.draftTitle}</Small>
          <Textarea
            value={v.draft}
            onChange={e => v.setDraft(e.target.value)}
            rows={Math.min(8, Math.max(2, v.draft.split("\n").length + 1))}
            className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
          />
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" onClick={v.accept} disabled={!v.draft.trim()} data-voice-accept>
              {L.accept}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={v.discard} data-voice-discard>
              {L.discard}
            </Button>
          </div>
        </div>
      ) : null}

      {failure && (
        <Small data-voice-failure className="text-amber-700 dark:text-amber-400">
          {failure}
        </Small>
      )}

      {comment && <FieldDescription className="text-[length:var(--fs-small)]">{comment}</FieldDescription>}
    </Field>
  )
}
