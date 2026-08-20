"use client"

// Состояние диалога переводов: черновики, автоперевод, сохранение.
//
// Вынесено из компонента по тому же признаку, что и везде в проекте: компонент
// отвечает за вид, а это — поведение.

import { useState, useCallback, useMemo, useEffect } from "react"
import { getAvailableLanguages } from "@/config/translations/translations.config"

/** Одно переводимое поле записи. */
export type TranslatableField = {
  key: string
  label: string
  value: string
  multiline?: boolean
}

/** Черновики: язык → поле → значение. Та же форма, что у колонки `i18n`. */
export type Drafts = Record<string, Record<string, string>>

/** Код отказа двери перевода — интерфейс показывает по нему свою подсказку. */
export type TranslateError = "no-key" | "bad-key" | "no-funds" | "rate-limit" | "upstream" | null

export function useTranslations(fields: TranslatableField[], baseLang: string) {
  // Языки, на которые переводим: все языки приложения, кроме базового — базовый
  // и есть само значение.
  const targets = useMemo(
    () => getAvailableLanguages().map(l => l.code).filter(l => l !== baseLang),
    [baseLang],
  )

  const [drafts, setDrafts] = useState<Drafts>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<TranslateError>(null)
  /** Языки, уже сохранённые в этом сеансе, — по ним прячется кнопка карточки. */
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  // 🔒 КАРТОЧКИ ЗАПОЛНЕНЫ ИСХОДНЫМ ТЕКСТОМ, А НЕ ПУСТЫ (владелец 2026-08-11).
  // Пустое поле не говорит, ЧТО переводить: человек видит рамку и не знает, о
  // какой строке речь. Значение языка интерфейса в каждой карточке — и текст
  // перед глазами, и рабочее состояние «переводов ещё нет»: запись живёт языком
  // интерфейса, пока его не заменили.
  useEffect(() => {
    setDrafts(prev => {
      const next: Drafts = { ...prev }
      for (const lang of targets) {
        const cell = { ...(next[lang] ?? {}) }
        for (const f of fields) if (cell[f.key] === undefined) cell[f.key] = f.value
        next[lang] = cell
      }
      return next
    })
  }, [targets, fields])

  const setCell = useCallback((lang: string, key: string, value: string) => {
    setDrafts(prev => ({ ...prev, [lang]: { ...(prev[lang] ?? {}), [key]: value } }))
    // Правка после сохранения снова делает язык несохранённым: иначе кнопка
    // исчезла бы, а изменение осталось бы в браузере.
    setSaved(prev => (prev[lang] ? { ...prev, [lang]: false } : prev))
  }, [])

  const markSaved = useCallback((lang: string) => {
    setSaved(prev => ({ ...prev, [lang]: true }))
  }, [])

  /**
   * Перевести. `only` — ключ одного поля (текущая вкладка); без него все поля.
   * Один запрос на все языки: вызов на каждую пару «поле × язык» даёт десятки
   * обращений и разваливается частично, оставляя половину переводов.
   */
  const translate = useCallback(async (only?: string) => {
    const source = fields.filter(f => (only ? f.key === only : true) && f.value.trim())
    if (!source.length || !targets.length) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/i18n/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: Object.fromEntries(source.map(f => [f.key, f.value])),
          from: baseLang,
          to: targets,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data?.error as TranslateError) ?? "upstream")
        return
      }
      const data = await res.json() as { translations?: Drafts }
      // Сливаем, а не заменяем: перевод одного поля не должен стирать то, что
      // человек уже поправил руками в соседнем.
      setDrafts(prev => {
        const next: Drafts = { ...prev }
        for (const [lang, values] of Object.entries(data.translations ?? {})) {
          next[lang] = { ...(next[lang] ?? {}), ...values }
        }
        return next
      })
      setSaved({})
    } catch {
      setError("upstream")
    } finally {
      setBusy(false)
    }
  }, [fields, targets, baseLang])

  return { targets, drafts, setCell, translate, busy, error, setError, saved, markSaved }
}
