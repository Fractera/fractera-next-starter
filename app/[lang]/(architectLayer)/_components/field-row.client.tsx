"use client"

import { useRef } from "react"
import { Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Small } from "@/components/ui/typography"
import VoiceInput from "@/_tools/voice-input/client/voice-input.client"
import { ImageField } from "./image-field.client"
import { SocialsField } from "./socials-field.client"
import type { Field } from "../_lib/fields"
import type { FieldsUi } from "../_i18n/fields.i18n"

// ОДНА СТРОКА ФОРМЫ (31-4, 2026-08-28). Порт `field-row.client.tsx` панели —
// логика оттуда, размеры отсюда.
//
// 🔒 ШКАЛА ШРИФТА — СТРАНИЦЫ, А НЕ ПАНЕЛИ, и это прямое требование владельца
// 2026-08-28: «недостатком административной панели было то, что всё очень мелко;
// правильные высоты появились только в новой вкладке запуска — хочу такой же
// шрифт, в едином стиле со страницей». В исходнике подписи набраны `text-[10px]`
// и `text-[12px]`; здесь подпись — `--fs-small`, значение и поле ввода —
// `--fs-body` (16px). **Порт везёт логику, а не размеры.**
//
// 🔒 ГОЛОС — У КАЖДОГО ТЕКСТОВОГО ПОЛЯ (`text`, `textarea`), и это тоже прямое
// требование. У переключателя и списка его нет и быть не может: диктовать нечего,
// а кнопка рядом с ними обещала бы работу, которой не существует.
//
// 🔒 АДРЕС ДВЕРИ РАСШИФРОВКИ ЗАДАН ЯВНО. Инструмент по умолчанию стучится к
// соседу — относительно текущего пути, что дало бы
// `/{lang}/architect/app-config/api/transcribe`, двери, которой нет. Это записано
// в самом инструменте и стоило кому-то отладки; повторять не будем.
//
// 🔒 ЗАБЛОКИРОВАННОЕ ПОЛЕ ПОКАЗЫВАЕТСЯ, А НЕ ПРЯЧЕТСЯ. Человеку важно ВИДЕТЬ
// адрес своего сайта; спрятать поле значило бы заставить его искать значение,
// которое ему просто нельзя менять здесь. Рядом — замок и объяснение, где менять.
export function FieldRow({
  field,
  lang,
  value,
  translated,
  translationMode,
  onChange,
  ui,
}: {
  field: Field
  /** Язык страницы — для слов самого инструмента голоса. */
  lang: string
  value: string
  /** Есть ли перевод на выбранный язык настроек (только у языковых полей). */
  translated?: boolean
  /** Правится ли ДРУГОЙ язык, а не язык проекта по умолчанию. */
  translationMode: boolean
  onChange: (next: string) => void
  ui: FieldsUi
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  const words = ui.fields[field.path] ?? { label: field.path }
  const id = `field-${field.path.replace(/\./g, "-")}`
  const isText = field.type === "text" || field.type === "textarea"

  return (
    <div data-field={field.path} data-field-type={field.type} className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor={id} className="text-[length:var(--fs-small)] font-medium text-foreground">
          {words.label}
        </Label>

        {/* 🔒 НА ЯЗЫКЕ ПО УМОЛЧАНИЮ ПЕРЕВОДА НЕ СУЩЕСТВУЕТ — существует само
            значение. Здесь стояло «перевода нет» и на нём тоже: человек, правящий
            основной язык, читал это как незакрытый долг и шёл искать, где же
            перевести поле на его собственный язык. Поэтому в этом режиме поле лишь
            помечено языковым, а «есть/нет перевода» появляется только тогда, когда
            правится ДРУГОЙ язык. */}
        {field.perLang && (
          <Small
            data-per-lang
            data-translated={translationMode ? (translated ? "yes" : "no") : undefined}
            className={translationMode && translated ? "text-emerald-600 dark:text-emerald-400" : undefined}
          >
            {translationMode ? (translated ? ui.translated : ui.notTranslated) : ui.perLang}
          </Small>
        )}

        {field.locked && (
          <Small data-locked className="inline-flex items-center gap-1">
            <Lock className="size-3" aria-hidden />
            {ui.locked}
          </Small>
        )}
      </div>

      <div className="flex items-start gap-2">
        {field.type === "textarea" ? (
          <Textarea
            id={id}
            ref={areaRef}
            rows={3}
            value={value}
            placeholder={words.placeholder}
            disabled={field.locked}
            onChange={e => onChange(e.target.value)}
            className="text-[length:var(--fs-body)]"
          />
        ) : field.type === "switch" ? (
          <Switch
            id={id}
            checked={value === "true"}
            disabled={field.locked}
            onCheckedChange={next => onChange(next ? "true" : "false")}
          />
        ) : field.type === "image" ? (
          <ImageField id={id} value={value} disabled={field.locked} onChange={onChange} ui={ui} />
        ) : field.type === "socials" ? (
          <SocialsField value={value} disabled={field.locked} onChange={onChange} ui={ui} />
        ) : field.type === "select" ? (
          <select
            id={id}
            value={value}
            disabled={field.locked}
            onChange={e => onChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-[length:var(--fs-body)]"
          >
            {(field.options ?? []).map(option => (
              <option key={option} value={option}>{words.options?.[option] ?? option}</option>
            ))}
          </select>
        ) : (
          <Input
            id={id}
            ref={inputRef}
            type={field.type === "number" ? "number" : "text"}
            value={value}
            placeholder={words.placeholder}
            disabled={field.locked}
            onChange={e => onChange(e.target.value)}
            className="text-[length:var(--fs-body)]"
          />
        )}

        {isText && !field.locked && (
          <VoiceInput
            targetRef={field.type === "textarea" ? areaRef : inputRef}
            value={value}
            onChange={onChange}
            lang={lang}
            apiUrl="/api/transcribe"
          />
        )}
      </div>

      {(words.hint || field.locked) && (
        <Small>{field.locked ? (words.hint ?? ui.lockedHint) : words.hint}</Small>
      )}
    </div>
  )
}
