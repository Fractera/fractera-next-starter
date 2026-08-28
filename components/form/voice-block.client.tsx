"use client"

import { useState } from "react"
import { VoiceField } from "./voice-field.client"
import { VoiceTextarea } from "./voice-textarea.client"

// ОСТРОВОК ВИДА `voiceField` (шаг 32-9, 2026-08-28).
//
// 🔒 ЗАЧЕМ НУЖЕН ПОСРЕДНИК, А НЕ ПРЯМОЙ ВЫЗОВ ЭЛЕМЕНТА ИЗ РЕНДЕРЕРА. Оба элемента
// управляемые: значение и `onChange` им отдаёт тот, кто их ставит. У блока
// страницы такого хозяина нет — материал страницы это данные, а не состояние.
// Поэтому строку держит островок: он владеет ею и больше ничем.
//
// 🔒 СОСТОЯНИЕ ЖИВЁТ ДО ОБНОВЛЕНИЯ СТРАНИЦЫ, И ЭТО РЕШЕНИЕ ВЛАДЕЛЬЦА, А НЕ
// НЕДОДЕЛКА (2026-08-28, вариант 1 из двух). Приёмник данных — таблица, дверь и
// защита от спама — отдельная работа. Сделать вид, что текст куда-то уходит,
// было бы хуже, чем честно ничего не обещать.
//
// 🔒 СЛОВА ПРИХОДЯТ ГОТОВЫМИ, СЛОВАРЯ ЗДЕСЬ НЕТ. Резолвит его серверный рендерер
// вида: клиентский компонент, импортирующий словарь, увёз бы в браузер все его
// языки — сегодня десять, завтра восемьдесят два.
export function VoiceBlock({
  lang,
  variant = "line",
  title,
  hint,
  comment,
  placeholder,
}: {
  lang: string
  /** `line` — микрофон внутри рамки поля; `area` — кнопка снизу во всю ширину. */
  variant?: "line" | "area"
  title: string
  hint?: string
  comment?: string
  placeholder?: string
}) {
  const [value, setValue] = useState("")

  if (variant === "area") {
    return (
      <VoiceTextarea
        value={value}
        onChange={setValue}
        lang={lang}
        title={title}
        hint={hint}
        comment={comment}
        placeholder={placeholder}
      />
    )
  }

  return (
    <VoiceField
      value={value}
      onChange={setValue}
      lang={lang}
      title={title}
      hint={hint}
      comment={comment}
      placeholder={placeholder}
    />
  )
}
