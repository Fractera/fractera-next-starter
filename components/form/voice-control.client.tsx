"use client"

import { useRef } from "react"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Small } from "@/components/ui/typography"
import { useVoiceRecorder, VOICE_BAR } from "@/_tools/voice-input/client/use-voice-recorder"
import { MicIcon } from "./mic-icon"

// УПРАВЛЯЮЩИЙ ЭЛЕМЕНТ С ГОЛОСОМ — поле, микрофон, полоса, расшифровка (32-8).
//
// 🔒 ОДИН ЭЛЕМЕНТ, ТРИ ПОТРЕБИТЕЛЯ. Его зовут `VoiceField` (поле с заголовком),
// `VoiceTextarea` (область с заголовком) и строка формы настроек, у которой свой
// заголовок секции и никакого собственного. Скопировать связку «поле + микрофон +
// полоса + расшифровка» в третье место значило бы завести третью копию того, что
// уже дважды одинаково, — и разошлись бы они молча, ровно как разошлись бы
// механики без хука в 32-2.
//
// 🔒 ЗДЕСЬ НЕТ НИ ЗАГОЛОВКА, НИ ПОДСКАЗКИ, НИ КОММЕНТАРИЯ — И ЭТО ГЛАВНОЕ.
// ✗ Оплачено сегодня: подставить в форму настроек контейнер целиком значило бы
// получить **62 заголовка `H3` подряд** — по одному на каждое поле. Владелец
// выбрал вариант, где заголовки остаются у СЕКЦИЙ, а поле получает только то, что
// делает его полем с голосом.
//
// 🔒 ДВЕ РАСКЛАДКИ МИКРОФОНА, И ВЫБОР ЗА ТИПОМ ПОЛЯ, А НЕ ЗА ВКУСОМ. Однострочное
// поле имеет правый край на высоте текста — микрофон встаёт внутрь, одной рамкой
// (`ButtonGroup`). У области на три строки такого края нет, и кнопка уходит под
// неё во всю ширину. Слова владельца: «в области ввода текста справа устанавливать
// кнопку микрофона запрещено».

export type VoiceControlVariant = "input" | "textarea"

export function VoiceControl({
  id,
  variant = "input",
  value,
  onChange,
  lang,
  placeholder,
  rows = 3,
  disabled,
  /** Поле только для чтения: микрофон не показывается вовсе. */
  readOnly,
  labelledBy,
  describedBy,
  type = "text",
  inputMode,
  voice = true,
  apiUrl = "/api/transcribe",
}: {
  id: string
  variant?: VoiceControlVariant
  value: string
  onChange: (next: string) => void
  lang: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  readOnly?: boolean
  labelledBy?: string
  describedBy?: string
  /** Для однострочного поля: `text` или `number`. */
  type?: "text" | "number"
  /**
   * Клавиатура браузера: `email`, `url`, `tel`.
   *
   * 🔒 ЭТО НЕ КОСМЕТИКА, А КЛАВИАТУРА ТЕЛЕФОНА: на `email` появляется «@», на `tel` —
   * цифровая панель. Ровно там, где у поля забрали микрофон, человеку и нужен самый
   * быстрый ручной ввод.
   */
  inputMode?: "email" | "url" | "tel"
  /**
   * Есть ли у поля микрофон.
   *
   * 🔒 УМОЛЧАНИЕ — «ЕСТЬ», И ЭТО НАМЕРЕННО. Два потребителя из трёх (`VoiceField`,
   * `VoiceTextarea`) созданы ради голоса, и требовать от них признак значило бы
   * повторять очевидное в каждом вызове. Третий — форма настроек — решает по полю.
   */
  voice?: boolean
  apiUrl?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const v = useVoiceRecorder({
    targetRef: variant === "textarea" ? areaRef : inputRef,
    value,
    onChange,
    lang,
    disabled: disabled || readOnly,
    apiUrl,
  })
  const L = v.strings

  // Микрофона нет там, где диктовать некуда: поле только для чтения — или само поле
  // не про речь (координаты, токен, цвет), и это решает тот, кто его ставит.
  const withVoice = voice && !readOnly
  const failure = withVoice ? v.note || (!v.supported ? L.tipInsecure : "") : ""

  const mic = (
    <Button
      type="button"
      variant="outline"
      aria-label={L.mic}
      title={v.supported ? L.tipOk : L.tipInsecure}
      disabled={disabled || v.busy || !v.supported}
      data-voice-mic
      data-recording={v.recording ? "true" : "false"}
      onPointerDown={e => { e.preventDefault(); v.start() }}
      onPointerUp={v.stop}
      onPointerLeave={v.stop}
      onPointerCancel={v.stop}
      className={
        (variant === "textarea" ? "h-10 w-full justify-center gap-2 " : "h-10 px-3 ") +
        (v.recording ? "border-rose-500/50 text-rose-700 dark:text-rose-400" : "")
      }
    >
      <MicIcon off={!v.supported} />
      {variant === "textarea" ? (v.busy ? L.transcribing : v.recording ? L.recording : L.mic) : null}
    </Button>
  )

  return (
    <div data-voice-control={variant} className="flex w-full flex-col gap-2">
      {variant === "textarea" ? (
        <>
          <Textarea
            id={id}
            ref={areaRef}
            rows={rows}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            onChange={e => onChange(e.target.value)}
            className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
          />
          {withVoice && mic}
        </>
      ) : (
        // 🔒 БЕЗ МИКРОФОНА ПОЛЕ НЕ ОБОРАЧИВАЕТСЯ В `ButtonGroup`: группа из одного
        // элемента срезала бы ему скругления справа, и заблокированное поле
        // выглядело бы обрубленным без всякой причины.
        withVoice ? (
          <ButtonGroup className="w-full">
            <Input
              id={id}
              ref={inputRef}
              type={type}
              inputMode={inputMode}
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              onChange={e => onChange(e.target.value)}
              className="h-10 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            />
            {mic}
          </ButtonGroup>
        ) : (
          <Input
            id={id}
            type={type}
            inputMode={inputMode}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            onChange={e => onChange(e.target.value)}
            className="h-10 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
          />
        )
      )}

      {/* Одно место, три состояния, взаимно исключающие друг друга. */}
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
    </div>
  )
}
