"use client"

// Состояние диалога переводов: черновики, автоперевод, сохранение.
//
// Вынесено из компонента по тому же признаку, что и везде в этом проекте:
// компонент отвечает за вид, а это — поведение. Здесь же единственное место, где
// решается, ЧТО отправить переводчику и что считать заполненным.

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
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

export function useTranslations(fields: TranslatableField[], baseLang: string, failedLabel: string) {
  // Языки, на которые вообще переводим: все языки приложения, кроме базового —
  // базовый и есть само значение, дублировать его переводом незачем.
  const targets = useMemo(
    () => getAvailableLanguages().map(l => l.code).filter(l => l !== baseLang),
    [baseLang],
  )

  const [drafts, setDrafts] = useState<Drafts>({})
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)

  const setCell = useCallback((lang: string, key: string, value: string) => {
    setDrafts(prev => ({ ...prev, [lang]: { ...(prev[lang] ?? {}), [key]: value } }))
  }, [])

  /**
   * Перевести. `only` — один ключ поля; без него переводятся все поля сразу.
   *
   * Один запрос на все языки и все поля: запрос на каждую пару «поле × язык»
   * даёт десятки вызовов на одну запись и разваливается частично, оставляя
   * половину переводов.
   */
  const translate = useCallback(async (only?: string) => {
    const source = fields.filter(f => (only ? f.key === only : true) && f.value.trim())
    if (!source.length || !targets.length) return
    setBusy(true)
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
      if (!res.ok) throw new Error(String(res.status))
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
    } catch {
      toast.error(failedLabel)
    } finally {
      setBusy(false)
    }
  }, [fields, targets, baseLang, failedLabel])

  const save = useCallback(async (onSave: (d: Drafts) => Promise<boolean>) => {
    setSaving(true)
    const ok = await onSave(drafts)
    setSaving(false)
    return ok
  }, [drafts])

  /** Есть ли хоть один непустой перевод — по нему решается, активна ли кнопка. */
  const filled = useMemo(
    () => Object.values(drafts).some(v => Object.values(v).some(s => s.trim())),
    [drafts],
  )

  return { targets, drafts, setCell, translate, save, busy, saving, filled }
}
