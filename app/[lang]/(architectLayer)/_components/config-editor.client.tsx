"use client"

import { Fragment, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { H3, Small } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { FieldRow } from "./field-row.client"
import { patchAtPath, mergePatches, typedValue, type Section } from "../_lib/fields"
import type { FieldsUi } from "../_i18n/fields.i18n"

// ФОРМА ОДНОЙ ГРУППЫ (31-4, 2026-08-28). Порт `settings-editor.client.tsx` панели.
//
// 🔒 ОСТРОВОК ПОЛУЧАЕТ ГОТОВЫЕ ЗНАЧЕНИЯ И ГОТОВЫЕ СЛОВА, а не конфиг и не словарь.
// Слова резолвит сервер: клиентский компонент, импортирующий словарь, увёз бы в
// браузер все его языки. Значения приходят уже посчитанными для выбранного языка
// настроек — поэтому смена языка не требует ни запроса, ни вспышки чужого текста.
//
// 🔒 ОТПРАВЛЯЕТСЯ ЗАПЛАТА ИЗ ТРОНУТЫХ ПОЛЕЙ, А НЕ ВЕСЬ КОНФИГ. Дверь принимает
// только присланные ветки, поэтому страница физически не может затереть чужую
// настройку — даже ту, о существовании которой не знает. Причина целиком —
// в `lib/architect/app-config-writer.ts`.
//
// 🔒 ЯЗЫКОВОЕ ПОЛЕ ПИШЕТСЯ В ДВА РАЗНЫХ МЕСТА, И ПУТАТЬ ИХ НЕЛЬЗЯ: значение языка
// по умолчанию — это САМО поле (`name`), перевод — ветка `i18n["name"]["ru"]`.
// Запись перевода поверх основного значения выглядит как удачное сохранение и
// стирает оригинал: страница на языке по умолчанию начинает показывать чужой
// перевод. Пустой перевод УДАЛЯЕТСЯ, а не хранится пустым — «перевода нет» и
// «перевод пустой» одно и то же состояние.
export function ConfigEditor({
  sections,
  initial,
  lang,
  editLang,
  defaultLang,
  translatedPaths,
  ui,
}: {
  sections: readonly Section[]
  /** Значения полей для выбранного языка настроек: путь → строка. */
  initial: Record<string, string>
  /** Язык страницы — для слов инструмента голоса. */
  lang: string
  /** Язык, для которого правятся значения. */
  editLang: string
  /** Язык проекта по умолчанию: для него языковое поле пишется в само поле. */
  defaultLang: string
  /** Пути, у которых перевод на `editLang` уже есть. */
  translatedPaths: readonly string[]
  ui: FieldsUi
}) {
  const [values, setValues] = useState<Record<string, string>>(initial)
  // 🔒 ЧТО СЧИТАЕТСЯ СОХРАНЁННЫМ — ОТДЕЛЬНОЕ СОСТОЯНИЕ, а не приходящий проп.
  // Иначе после удачного сохранения сравнивать было бы не с чем: проп остаётся
  // прежним до перезагрузки страницы, и кнопка светилась бы вечно, предлагая
  // сохранить то, что уже на диске.
  const [saved, setSaved] = useState<Record<string, string>>(initial)
  const [busy, setBusy] = useState(false)

  // Тронутые поля: сравнение с тем, что лежит на сервере. Кнопка, отправляющая
  // неизменённое, — работа без результата, и она же тихо перезаписывает файл.
  const changed = useMemo(
    () => Object.keys(values).filter(path => values[path] !== (saved[path] ?? "")),
    [values, saved],
  )

  async function save() {
    if (changed.length === 0) {
      toast.info(ui.nothingToSave)
      return
    }
    setBusy(true)

    const all = sections.flatMap(s => s.fields)
    const patches = changed.map(path => {
      const field = all.find(f => f.path === path)
      const value = values[path]
      const perLangTranslation = field?.perLang && editLang !== defaultLang
      // 🔒 ЗНАЧЕНИЕ ПРИВОДИТСЯ К ТИПУ КОНФИГА. Форма держит всё строками, конфиг —
      // нет; строка `"true"` в булевом поле теряется молча, потому что проверка на
      // чтении щадящая и уронит её на умолчание.
      if (!perLangTranslation) return patchAtPath(path, field ? typedValue(field, value) : value)
      // Перевод всегда строка: языковыми бывают только текстовые поля.
      // Пустой перевод стирается: `null` в заплате удаляет ключ.
      return patchAtPath(`i18n.${path}.${editLang}`, value.trim() === "" ? null : value)
    })

    try {
      const res = await fetch("/api/architect/app-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch: mergePatches(patches) }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      toast.success(ui.saved)
      // Сохранённое становится новым «исходным»: кнопка гаснет до следующей правки.
      setSaved(values)
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  return (
    <div data-config-editor className="flex flex-col gap-8">
      {sections.map(section => (
        <section key={section.id} data-section={section.id} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <H3 variant="ui">{ui.sections[section.id] ?? section.id}</H3>
            {ui.sectionHints[section.id] && (
              <Small className="max-w-2xl">{ui.sectionHints[section.id]}</Small>
            )}
          </div>

          {/* 🔒 ГОРИЗОНТАЛЬНАЯ ЛИНИЯ ОТДЕЛЯЕТ ЗАГОЛОВОК ОТ ПОЛЕЙ (заказ владельца
              2026-08-28). Без неё подпись секции и первая подпись поля стоят
              одинаково набранными строками подряд, и глаз не видит, где кончилось
              название раздела и начались его настройки. */}
          <Separator />

          {/* 🔒 ДВЕ НАСТОЯЩИЕ КОЛОНКИ, А НЕ СЕТКА — И ЭТО СЛЕДСТВИЕ ЗАКАЗА
              ВЕРТИКАЛЬНОЙ ЛИНИИ. В сетке `grid-cols-2` разделителя между колонками
              не существует как элемента: линию пришлось бы рисовать подложкой
              посередине, и она перечёркивала бы любое поле, растянутое на обе
              колонки. Две колонки с сепаратором между ними — та же раскладка, но
              линия здесь настоящая и не пересекает ничего.
              ✗ Цена решения, названная вслух: порядок полей стал КОЛОНОЧНЫМ
              (первая половина слева, вторая справа), а был строчным. Для секции в
              5–9 полей это читается так же, и другого способа получить честную
              линию между колонками нет.
              На узком экране колонка одна, и линии нет: разделять нечего. */}
          <div className="flex flex-col gap-5 md:flex-row md:gap-8">
            {[0, 1].map(side => {
              const half = Math.ceil(section.fields.length / 2)
              const part = side === 0 ? section.fields.slice(0, half) : section.fields.slice(half)
              if (part.length === 0) return null
              return (
                <Fragment key={side}>
                  {side === 1 && (
                    <Separator orientation="vertical" className="hidden md:block" data-column-rule />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-5">
                    {part.map(field => (
                      <FieldRow
                        key={field.path}
                        field={field}
                        lang={lang}
                        value={values[field.path] ?? ""}
                        translationMode={editLang !== defaultLang}
                        translated={translatedPaths.includes(field.path)}
                        onChange={next => setValues(v => ({ ...v, [field.path]: next }))}
                        ui={ui}
                      />
                    ))}
                  </div>
                </Fragment>
              )
            })}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <Button data-save onClick={save} disabled={busy || changed.length === 0}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? ui.saving : ui.save}
        </Button>
      </div>
    </div>
  )
}
