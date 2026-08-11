"use client"

// ДИАЛОГ ДОБАВЛЕНИЯ ПЕРЕВОДОВ — общий инструмент проекта.
//
// Подключается любой сущностью с переводимыми полями: продукт сегодня,
// категория и страница завтра.
//
// 🔒 ОДНОЯЗЫЧНОЕ ПРИЛОЖЕНИЕ ЭТОГО ДИАЛОГА НЕ ВИДИТ. Переводить не на что, и
// спрашивать об этом человека — отнимать время вопросом без ответа. Проверка
// стоит первой строкой: вызывающему о ней помнить не надо.
//
// 🔒 ВЫСОТА — ДОЛЯ ЭКРАНА, А НЕ ЧИСЛО ПИКСЕЛЕЙ. Фиксированные 600 px выходили за
// нижний край на ноутбуке вместе с кнопками сохранения. Ограничен ВЕСЬ диалог
// (80 % высоты окна), а прокручивается только список языков — шапка с кнопками
// перевода и подвал с сохранением остаются на месте всегда.
//
// 🔒 КРЕСТИК = «ПРОПУСТИТЬ». Запись уже создана: она живёт значением языка
// интерфейса, переводы добавляются позже с карточки. Второй вопрос «точно
// выйти?» — плата за случай, которого здесь нет.

import { useState } from "react"
import { AlertTriangle, ExternalLink, HelpCircle, Languages, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { SINGLE_LANG_MODE } from "@/config/translations/translations.config"
import { adminBase } from "@/lib/runtime-urls"
import type { PlatformErrors } from "@/lib/i18n/platform-errors"
import { TranslationCell } from "./translation-cell.client"
import type { TranslationsUi } from "./translations-dialog.i18n"
import { useTranslations, type Drafts, type TranslatableField } from "./use-translations"

export type { TranslatableField, Drafts }

// 🔒 СООБЩЕНИЯ ОБ ОТКАЗАХ ПРИХОДЯТ ПРОПСОМ, а не импортом. Их 82 языка, и
// импорт из клиентского компонента увёз бы весь словарь в браузер на каждой
// странице. Серверный компонент резолвит их и передаёт готовыми — тот же закон,
// что у панели (/code/CLAUDE.md §4д).

export function TranslationsDialog(
  { open, lang, fields, ui, errors, billingUrl, onSave, onSkip }: {
    open: boolean
    /** Язык интерфейса — он же язык исходных значений. */
    lang: string
    fields: TranslatableField[]
    /** Слова диалога на языке страницы — резолвятся на сервере (§4д). */
    ui: TranslationsUi
    /** Сообщения об отказах на языке страницы — из lib/i18n/platform-errors. */
    errors: PlatformErrors
    billingUrl: string
    /** Сохранить переводы ОДНОГО языка. Возвращает успех. */
    onSave: (drafts: Drafts) => Promise<boolean>
    onSkip: () => void
  },
) {
  const t = ui
  const [active, setActive] = useState(0)
  const [savingLang, setSavingLang] = useState<string | null>(null)
  const { targets, drafts, setCell, translate, busy, error, saved, markSaved } =
    useTranslations(fields, lang)

  if (!open || SINGLE_LANG_MODE || targets.length === 0) return null

  const field = fields[active] ?? fields[0]

  async function saveOne(code: string) {
    setSavingLang(code)
    const ok = await onSave({ [code]: drafts[code] ?? {} })
    setSavingLang(null)
    if (ok) {
      markSaved(code)
      toast.success(t.saved)
    }
  }

  const errorText =
    error === "no-key" ? errors.noKey
    : error === "bad-key" ? errors.badKey
    : error === "no-funds" ? errors.noFunds
    : error === "rate-limit" ? errors.rateLimit
    : error ? errors.upstream : null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg border border-border bg-background shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
            <Languages size={13} />{t.title}
          </p>
          <button type="button" onClick={onSkip} title={t.close} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>

        <div className="shrink-0 space-y-3 px-4 pt-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t.intro}</p>

          {/* Вкладки полей — только когда полей больше одного. */}
          {fields.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {fields.map((f, i) => (
                <Button
                  key={f.key}
                  size="sm"
                  variant={i === active ? "default" : "outline"}
                  className="h-7 min-w-7 px-2 text-[11px]"
                  onClick={() => setActive(i)}
                  title={f.label}
                >
                  {i + 1}
                </Button>
              ))}
              <span className="ml-1 text-[11px] text-muted-foreground">{field?.label}</span>
            </div>
          )}

          {/* ДВЕ кнопки перевода, и обе про ВКЛАДКИ: эту и все. «Перевести это
              поле» отсюда убрано — поле и вкладка здесь одно и то же, а два
              имени одного действия заставляли выбирать между синонимами. */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => translate(field?.key)} disabled={busy}>
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
              {busy ? t.translating : t.translateTab}
            </Button>
            {fields.length > 1 && (
              <Button size="sm" onClick={() => translate()} disabled={busy}>
                {t.translateAllTabs}
              </Button>
            )}
          </div>

          {errorText && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-2.5 text-[11px] leading-relaxed text-destructive">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <div>
                <p>{errorText}</p>
                {(error === "no-key" || error === "bad-key") && (
                  <a href={`${adminBase()}/${lang}/openai`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 underline">
                    {errors.keyLink}<ExternalLink size={10} />
                  </a>
                )}
                {error === "no-funds" && (
                  <a href={billingUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 underline">
                    {errors.fundsLink}<ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Прокручивается ТОЛЬКО список языков. */}
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
          {targets.map(code => {
            const value = drafts[code]?.[field?.key ?? ""] ?? ""
            return (
              <TranslationCell
                key={code}
                lang={code}
                value={value}
                multiline={field?.multiline}
                dirty={Boolean(field) && value.trim() !== field.value.trim()}
                saved={Boolean(saved[code])}
                saving={savingLang === code}
                labels={{ save: t.saveOne, saving: t.saving, savedMark: t.savedMark }}
                onChange={v => field && setCell(code, field.key, v)}
                onSave={() => saveOne(code)}
              />
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 border-t border-border px-4 py-2.5">
          <Button size="sm" variant="ghost" onClick={onSkip}>{t.skip}</Button>
          {/* Родной `title`: работает на касании и переживает выключенный JS. */}
          <span title={t.hint} className="cursor-help text-muted-foreground">
            <HelpCircle size={13} />
          </span>
        </div>
      </div>
    </div>
  )
}
