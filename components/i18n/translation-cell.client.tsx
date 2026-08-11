"use client"

// Один контейнер перевода — один язык.
//
// Заголовок несёт флаг и РОДНОЕ имя языка: человек, добавляющий испанский, ищет
// глазами «Español», а не «Spanish». Пустой контейнер остаётся пустым до тех пор,
// пока не нажат перевод, — заполнять его исходным текстом значило бы выдать
// непереведённое за перевод.
//
// Голос — у каждого контейнера свой: перевести одну карточку голосом на своём
// языке быстрее, чем печатать, и это ровно то, ради чего инструмент переносили
// в приложение.

import { useRef } from "react"
import VoiceInput from "@/_tools/voice-input/client/voice-input.client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getLanguageFlag, getLanguageNativeName, type SupportedLanguage } from "@/config/translations/translations.config"

export function TranslationCell(
  { lang, value, multiline, placeholder, onChange }: {
    lang: string
    value: string
    multiline?: boolean
    placeholder: string
    onChange: (next: string) => void
  },
) {
  const field = useRef<HTMLInputElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="rounded-lg border border-border p-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-foreground">
        <span aria-hidden>{getLanguageFlag(lang as SupportedLanguage)}</span>
        {getLanguageNativeName(lang as SupportedLanguage)}
        <span className="font-mono text-[10px] uppercase text-muted-foreground">{lang}</span>
      </p>

      {multiline ? (
        <Textarea
          ref={area}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="text-xs"
        />
      ) : (
        <Input
          ref={field}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-xs"
        />
      )}

      <div className="mt-1.5 flex items-center">
        {/* Голос диктуется НА ЯЗЫКЕ КОНТЕЙНЕРА, а не интерфейса: человек
            наговаривает испанский перевод по-испански. */}
        <VoiceInput
          targetRef={multiline ? area : field}
          value={value}
          onChange={onChange}
          lang={lang}
          apiUrl="/api/transcribe"
        />
      </div>
    </div>
  )
}
