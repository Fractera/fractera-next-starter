"use client"

// Редактируемое поле карточки — один компонент на все поля.
//
// 🔒 ПРАВКА НА МЕСТЕ, А НЕ ФОРМА РЯДОМ. Человек видит значение там же, где его
// меняет: нажал — поле стало вводом, сохранил — снова текст. Отдельная форма
// заставляет сверять глазами два места на экране и отвечать на вопрос «а это
// то же самое поле?».
//
// 🔒 СОХРАНЯЕТСЯ ОДНО ПОЛЕ, а не весь объект. Запрос вида «вот вся карточка»
// затирает чужую правку, сделанную секундой раньше в соседней вкладке, и
// делает это молча. Поэтому `PATCH` с единственным ключом.
//
// Отмена возвращает исходное значение и молчит: человек уже решил не менять,
// и рассказывать ему об этом уведомлением незачем.

import { useState } from "react"
import { Check, Loader2, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type EditableLabels = {
  edit: string; save: string; cancel: string; saved: string; failed: string
}

export function EditableField(
  { label, value, multiline, numeric, labels, onSave }: {
    label: string
    value: string
    multiline?: boolean
    numeric?: boolean
    labels: EditableLabels
    onSave: (next: string) => Promise<boolean>
  },
) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  async function commit() {
    setSaving(true)
    const ok = await onSave(draft)
    setSaving(false)
    if (ok) setEditing(false)
  }

  if (!editing) {
    return (
      <div className="group flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
          {/* Пустое поле показывается чертой, а не пустотой: иначе неясно, есть
              ли здесь значение вообще и можно ли его задать. */}
          <p className={`mt-0.5 text-sm ${value ? "text-foreground" : "text-muted-foreground"}`}>
            {value || "—"}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          onClick={() => { setDraft(value); setEditing(true) }}
          title={labels.edit}
        >
          <Pencil size={12} />
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-start gap-2">
        {multiline ? (
          <Textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={4}
            className="flex-1 text-sm"
            autoFocus
          />
        ) : (
          <Input
            value={draft}
            type={numeric ? "number" : "text"}
            step={numeric ? "0.01" : undefined}
            min={numeric ? 0 : undefined}
            onChange={e => setDraft(e.target.value)}
            // Enter сохраняет, Escape отменяет — обе клавиши здесь означают то
            // же, что и в любом другом поле ввода на свете.
            onKeyDown={e => {
              if (e.key === "Enter") void commit()
              if (e.key === "Escape") setEditing(false)
            }}
            className="h-8 flex-1 text-sm"
            autoFocus
          />
        )}
        <Button size="sm" onClick={commit} disabled={saving} title={labels.save}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving} title={labels.cancel}>
          <X size={12} />
        </Button>
      </div>
    </div>
  )
}
