"use client"

import { useId, useRef } from "react"
import { Field, FieldDescription } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { H3, Small } from "@/components/ui/typography"
import { useVoiceRecorder, VOICE_BAR } from "@/_tools/voice-input/client/use-voice-recorder"

// ФИРМЕННОЕ ПОЛЕ ВВОДА С ГОЛОСОМ (шаг 32-3, 2026-08-28).
//
// 🔒 УСТРОЙСТВО НАЗВАНО ВЛАДЕЛЬЦЕМ ДОСЛОВНО: «слева текстовый ввод справа кнопка
// встроенная нажать микрофон; если микрофон нажимается, то под этим инпутом
// появляется та самая анимированная полоса эквалайзера; когда запись
// заканчивается, полоса эквалайзера заменяется областью textArea… чтобы этот
// блок имел сверху заголовок третьего уровня, подсказку, под всей этой областью
// комментарий».
//
//   H3 заголовок
//   подсказка
//   [ Input ……………………………………… | 🎤 ]   ← ButtonGroup: одна рамка на двоих
//   ▁▃▅▂▇▃▁ 00:07                       ← полоса ПОД полем, пока идёт запись
//   [ область расшифровки ]              ← НА МЕСТЕ полосы, когда запись кончилась
//   комментарий под всей областью
//
// 🔒 ПОЛОСА И РАСШИФРОВКА ЗАНИМАЮТ ОДНО МЕСТО И СМЕНЯЮТ ДРУГ ДРУГА. Так сказал
// владелец, и так честнее: состояние одно — либо идёт запись, либо есть что
// решить. В маленькой кнопке полоса стоит СБОКУ и сжимает саму кнопку; отсюда и
// теснота, на которую он жаловался.
//
// 🔒 ШКАЛА — СТРАНИЦЫ, А НЕ ИНСТРУМЕНТА. Заголовок `H3`, подсказка и комментарий
// `Small` (`--fs-small`, 14px), поле и расшифровка `--fs-body` (16px). Ни одного
// `text-xs`, `text-[10px]`, `text-[11px]`, которыми набран старый инструмент; с
// поля снимается `md:text-sm` — размер, убывающий с экраном, запрещён гейтом
// типографики и был главной причиной ощущения мелкоты.
//
// 🔒 ТРИ ОТКАЗА ВИДНЫ ЧЕЛОВЕКУ, А НЕ ПРЯЧУТСЯ В ПОДСКАЗКЕ КНОПКИ. Владелец назвал
// их поимённо: нет ключа · браузер не дал разрешения · соединение не защищено.
// В старом инструменте они живут в `title` кнопки, то есть на телефоне невидимы
// вовсе. Здесь у них своё место — там же, где полоса.
//
// 🔒 МЕХАНИКА НЕ ДУБЛИРУЕТСЯ: запись, уровень звука, таймер, расшифровка и память
// курсора берутся из общего хука (32-2). Второй `AudioContext` в проекте
// разошёлся бы с первым молча.

export function VoiceField({
  value,
  onChange,
  lang,
  title,
  hint,
  comment,
  placeholder,
  micLabel,
  disabled,
  apiUrl = "/api/transcribe",
}: {
  value: string
  onChange: (next: string) => void
  /** Язык страницы — на нём говорят кнопка и объяснения отказа. */
  lang: string
  /** Заголовок третьего уровня над полем. */
  title: string
  /** Подсказка под заголовком: зачем это поле. */
  hint?: string
  /** Комментарий под ВСЕЙ областью — последнее, что читают. */
  comment?: string
  placeholder?: string
  /** Подпись кнопки микрофона для читалок экрана. */
  micLabel: string
  disabled?: boolean
  apiUrl?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const titleId = id + "-title"
  const hintId = id + "-hint"
  const v = useVoiceRecorder({ targetRef: inputRef, value, onChange, lang, disabled, apiUrl })
  const L = v.strings

  // Отказ показывается, только когда он есть: `note` приходит от механики
  // (микрофон запрещён, устройства нет, ключа нет), а неподдержка среды известна
  // заранее — до всякого нажатия.
  const failure = v.note || (!v.supported ? L.tipInsecure : "")

  return (
    <Field data-voice-field className="gap-3">
      {/* 🔒 ЗАГОЛОВОК — НАСТОЯЩИЙ `H3`, А НЕ ПОДПИСЬ ПОЛЯ, ПОХОЖАЯ НА ЗАГОЛОВОК.
          Владелец просил «заголовок третьего уровня», и закон проекта требует, чтобы
          заголовки шли через примитив типографики. `FieldLabel` — это `<label>` с
          зашитым `text-sm`, и нарядить его в размеры заголовка значило бы обойти
          примитив, а не использовать его.
          Поле получает имя через `aria-labelledby`: читалка экрана называет его
          заголовком, хотя разметка — не `<label>`. */}
      <div className="flex flex-col gap-1">
        <H3 variant="ui" id={titleId}>{title}</H3>
        {hint && <Small id={hintId}>{hint}</Small>}
      </div>

      {/* 🔒 ОДНА РАМКА НА ПОЛЕ И КНОПКУ — это и значит «кнопка встроенная».
          `ButtonGroup` снимает скругления и границу на стыке, поэтому шва не
          видно, а фокус остаётся у каждого своим. */}
      <ButtonGroup className="w-full">
        <Input
          id={id}
          ref={inputRef}
          aria-labelledby={titleId}
          aria-describedby={hint ? hintId : undefined}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className="h-10 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
        />
        <Button
          type="button"
          variant="outline"
          aria-label={micLabel}
          title={v.supported ? L.tipOk : L.tipInsecure}
          disabled={disabled || v.busy || !v.supported}
          data-voice-mic
          data-recording={v.recording ? "true" : "false"}
          onPointerDown={e => { e.preventDefault(); v.start() }}
          onPointerUp={v.stop}
          onPointerLeave={v.stop}
          onPointerCancel={v.stop}
          className={"h-10 px-3 " + (v.recording ? "border-rose-500/50 text-rose-700 dark:text-rose-400" : "")}
        >
          <MicIcon off={!v.supported} />
        </Button>
      </ButtonGroup>

      {/* 🔒 ОДНО МЕСТО, ТРИ СОСТОЯНИЯ, И ОНИ ВЗАИМНО ИСКЛЮЧАЮТ ДРУГ ДРУГА: идёт
          запись → полоса; запись кончилась и есть что решить → область текста;
          ни того, ни другого → пусто. Показать полосу и расшифровку разом значило
          бы утверждать, что человек одновременно говорит и правит сказанное. */}
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
          {/* 🔒 ТЕКСТ ПРАВИТСЯ ПРЯМО ЗДЕСЬ, до вставки: одно неверно услышанное
              слово не должно стоить повторной диктовки всего абзаца. И расшифровка
              не вставляется сама — она встаёт в СЕРЕДИНУ поля, и выловить там
              чужую фразу дороже, чем один раз её прочитать. */}
          <Textarea
            value={v.draft}
            onChange={e => v.setDraft(e.target.value)}
            rows={Math.min(8, Math.max(2, v.draft.split("\n").length + 1))}
            className="text-[length:var(--fs-body)]"
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

      {/* Причина отказа — словами и на своём месте, а не в подсказке кнопки,
          которой на телефоне не существует. */}
      {failure && (
        <Small data-voice-failure className="text-amber-700 dark:text-amber-400">
          {failure}
        </Small>
      )}

      {/* Комментарий — под ВСЕЙ областью, как просил владелец: последнее, что
          читают, а не примечание к полю ввода. */}
      {comment && <FieldDescription className="text-[length:var(--fs-small)]">{comment}</FieldDescription>}
    </Field>
  )
}

function MicIcon({ off }: { off?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-4"
      aria-hidden
    >
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
      {off ? <path d="M3 3l18 18" /> : null}
    </svg>
  )
}
