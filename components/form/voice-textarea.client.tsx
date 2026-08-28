"use client"

import { useId } from "react"
import { Field, FieldDescription } from "@/components/ui/field"
import { H3, Small } from "@/components/ui/typography"
import { VoiceControl } from "./voice-control.client"

// ОБЛАСТЬ ТЕКСТА С ГОЛОСОМ (32-5; обёрткой стала в 32-8).
//
// 🔒 КНОПКА СНИЗУ ВО ВСЮ ШИРИНУ — ПРЯМОЙ ЗАПРЕТ ВЛАДЕЛЬЦА: «в области ввода текста
// справа устанавливать кнопку микрофона запрещено». У однострочного поля правый
// край стоит на высоте текста, и микрофон встаёт внутрь; у области на три-четыре
// строки такого края нет — кнопка справа висела бы напротив пустоты.
//
// 🔒 СВЯЗКА ЖИВЁТ В `VoiceControl`, И ЗДЕСЬ ЕЁ БОЛЬШЕ НЕТ (32-8). Различие двух
// раскладок принадлежит самому элементу управления и выражено его `variant`: так
// правка полосы или расшифровки не может достаться одному облику и не достаться
// другому.
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
  apiUrl,
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
  const id = useId()
  const titleId = id + "-title"
  const hintId = id + "-hint"

  return (
    <Field data-voice-textarea className="gap-3">
      <div className="flex flex-col gap-1">
        <H3 variant="ui" id={titleId}>{title}</H3>
        {hint && <Small id={hintId}>{hint}</Small>}
      </div>

      <VoiceControl
        id={id}
        variant="textarea"
        value={value}
        onChange={onChange}
        lang={lang}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        labelledBy={titleId}
        describedBy={hint ? hintId : undefined}
        apiUrl={apiUrl}
      />

      {comment && <FieldDescription className="text-[length:var(--fs-small)]">{comment}</FieldDescription>}
    </Field>
  )
}
