"use client"

import { useState } from "react"
import { VoiceField } from "@/components/form/voice-field.client"
import { VoiceTextarea } from "@/components/form/voice-textarea.client"
import { Small } from "@/components/ui/typography"
import type { VoiceStrings } from "@/lib/i18n/voice-field.i18n"

// ЖИВОЙ ОБРАЗЕЦ ДВУХ ЭЛЕМЕНТОВ ФОРМЫ (шаг 32-6, 2026-08-28).
//
// 🔒 ОБРАЗЕЦ ЖИВОЙ, А НЕ КАРТИНКА. Микрофон здесь работает, полоса рисуется,
// расшифровка приходит — иначе владелец не увидел бы главного: как три состояния
// сменяют друг друга на одном месте. Снимок или неактивная заглушка показали бы
// форму и умолчали о поведении, ради которого элементы и делались.
//
// 🔒 ОСТРОВОК ПОЛУЧАЕТ ГОТОВЫЕ СЛОВА, А НЕ СЛОВАРЬ. Резолвит их серверная
// половина: клиентский компонент, импортирующий словарь, увёз бы в браузер все его
// языки — сегодня десять, завтра восемьдесят два.
//
// 🔒 СОСТОЯНИЕ У КАЖДОГО СВОЁ. Два элемента с общим значением выглядели бы связкой
// «одно поле в двух видах»; они разные, и это должно быть видно с первого касания.
export function FormElementsSpecimen({ lang, words }: { lang: string; words: VoiceStrings }) {
  const [field, setField] = useState("")
  const [area, setArea] = useState("")

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-border p-6">
        <Small className="font-medium text-foreground">{words.specimenFieldCaption}</Small>
        <VoiceField
          value={field}
          onChange={setField}
          lang={lang}
          title={words.fieldTitle}
          hint={words.fieldHint}
          comment={words.fieldComment}
          micLabel={words.mic}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border p-6">
        <Small className="font-medium text-foreground">{words.specimenAreaCaption}</Small>
        <VoiceTextarea
          value={area}
          onChange={setArea}
          lang={lang}
          title={words.fieldTitle}
          hint={words.fieldHint}
          comment={words.fieldComment}
        />
      </div>
    </div>
  )
}
