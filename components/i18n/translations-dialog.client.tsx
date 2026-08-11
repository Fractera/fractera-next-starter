"use client"

// ДИАЛОГ ДОБАВЛЕНИЯ ПЕРЕВОДОВ — общий инструмент проекта.
//
// Подключается любой сущностью, у которой есть переводимые поля: продукт
// сегодня, категория и страница завтра. Форма одна, потому что задача одна —
// заполнить языки приложения значениями одной записи.
//
// 🔒 ОДНОЯЗЫЧНОЕ ПРИЛОЖЕНИЕ НЕ ВИДИТ ЭТОГО ДИАЛОГА ВООБЩЕ. Переводить не на что,
// и спрашивать об этом человека — отнимать у него время вопросом без ответа.
// Проверка стоит первой строкой: вызывающему не нужно о ней помнить.
//
// 🔒 КРЕСТИК = «ПРОПУСТИТЬ». Запись к этому моменту уже создана, терять нечего:
// она живёт значением языка интерфейса, переводы добавляются позже с карточки.
// Второй вопрос «точно выйти?» на каждом закрытии — плата за случай, которого
// здесь нет.
//
// Пустые контейнеры до нажатия перевода — не заготовка, а честность: заполнить
// их исходным текстом значило бы выдать непереведённое за перевод, и оно уехало
// бы в базу настоящим значением.

import { useState } from "react"
import { HelpCircle, Languages, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { SINGLE_LANG_MODE } from "@/config/translations/translations.config"
import { TranslationCell } from "./translation-cell.client"
import { translationsUi } from "./translations-dialog.i18n"
import { useTranslations, type Drafts, type TranslatableField } from "./use-translations"

export type { TranslatableField, Drafts }

export function TranslationsDialog(
  { open, lang, fields, onSave, onSkip }: {
    open: boolean
    /** Язык интерфейса — он же язык исходных значений. */
    lang: string
    fields: TranslatableField[]
    onSave: (drafts: Drafts) => Promise<boolean>
    onSkip: () => void
  },
) {
  const t = translationsUi(lang)
  const [active, setActive] = useState(0)
  const { targets, drafts, setCell, translate, save, busy, saving, filled } =
    useTranslations(fields, lang, t.failed)

  if (!open || SINGLE_LANG_MODE || targets.length === 0) return null

  const field = fields[active] ?? fields[0]

  async function commit() {
    const ok = await save(onSave)
    if (ok) toast.success(t.saved)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="mt-8 w-full max-w-2xl rounded-lg border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
            <Languages size={13} />{t.title}
          </p>
          <button type="button" onClick={onSkip} title={t.close} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">{t.intro}</p>

          {/* Разделы цифрами — только когда полей больше одного. На единственном
              поле ряд из одной кнопки ничего не сообщает. */}
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

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => translate()} disabled={busy}>
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
              {busy ? t.translating : t.translateAll}
            </Button>
            {fields.length > 1 && field && (
              <Button size="sm" variant="outline" onClick={() => translate(field.key)} disabled={busy}>
                {t.translateField}
              </Button>
            )}
          </div>

          {/* Высота тела зафиксирована: список языков может быть длинным, и
              диалог не имеет права уезжать за нижний край экрана вместе со
              своими кнопками. */}
          <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1">
            {targets.map(code => (
              <TranslationCell
                key={code}
                lang={code}
                value={drafts[code]?.[field?.key ?? ""] ?? ""}
                multiline={field?.multiline}
                placeholder={t.empty}
                onChange={v => field && setCell(code, field.key, v)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" onClick={onSkip}>{t.skip}</Button>
            {/* Родной `title` вместо всплывающей подсказки: работает на касании,
                переживает выключенный JS и не требует ещё одного примитива. */}
            <span title={t.hint} className="cursor-help text-muted-foreground">
              <HelpCircle size={13} />
            </span>
          </div>
          <Button size="sm" onClick={commit} disabled={saving || !filled}>
            {saving && <Loader2 size={12} className="animate-spin" />}
            {saving ? t.saving : t.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
