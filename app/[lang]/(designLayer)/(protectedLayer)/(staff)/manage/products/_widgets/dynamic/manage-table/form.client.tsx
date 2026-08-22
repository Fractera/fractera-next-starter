"use client"

// Форма заведения товара — часть таблицы персонала, а не общего слоя.
//
// 🔒 ПОЧЕМУ ОНА ЗДЕСЬ, А НЕ НАВЕРХУ. Заводить товары умеет ОДНА роль из четырёх.
// Общий предок хранил форму, которой пользовался единственный слой: три
// остальных несли её в дереве импортов, не имея права её показать. Вещь,
// принадлежащая одному месту, там и живёт.
//
// 🔒 КНОПКА СОХРАНЕНИЯ ПОДПИСАНА СЛОВОМ ИЗ СЛОВАРЯ. В общей форме здесь стояло
// зашитое английское «Save» — на десяти языках подпись была одна. Дефект прожил
// незамеченным ровно потому, что форма была ничьей.
//
// Голос — под полями, слева: он ПИШЕТ в название, а не решает, что делать
// дальше. Та же раскладка, что у Quiz в панели.

import { useRef, type Dispatch, type SetStateAction } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUploadField } from "@/services/upload/file-upload-field.client"
import VoiceInput from "@/_tools/voice-input/client/voice-input.client"
import type { UploadedFile } from "@/services/upload/upload.service"
import type { ImageCropperUi } from "@/services/upload/image-cropper.i18n"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"

export function NewProductForm(
  { form, setForm, saving, onSave, onUpload, lang, labels, cropperUi, dialogUi }: {
    form: { name: string; price: string }
    setForm: Dispatch<SetStateAction<{ name: string; price: string }>>
    saving: boolean
    onSave: () => void
    onUpload: (f: UploadedFile | null) => void
    lang: string
    labels: { newProduct: string; name: string; price: string; uploadPhoto: string; save: string }
    /** Слова обрезчика и общего окна — резолвятся на сервере. */
    cropperUi: ImageCropperUi
    dialogUi: AppDialogUi
  },
) {
  const nameRef = useRef<HTMLInputElement>(null)
  return (
    <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 text-xs font-medium text-foreground">{labels.newProduct}</p>
      <div className="mb-3 flex flex-wrap gap-3">
        <Input
          ref={nameRef}
          placeholder={labels.name}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && onSave()}
          className="h-8 min-w-[160px] flex-1 text-xs"
        />
        <Input
          type="number"
          placeholder={labels.price}
          min={0}
          step={0.01}
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          className="h-8 w-28 text-xs"
        />
        <FileUploadField
          accept="image"
          cropperUi={cropperUi}
          dialogUi={dialogUi}
          preview
          label={labels.uploadPhoto}
          onUpload={f => onUpload(f)}
        />
      </div>

      <div className="mb-3 flex items-center">
        <VoiceInput
          targetRef={nameRef}
          value={form.name}
          onChange={v => setForm(f => ({ ...f, name: v }))}
          lang={lang}
          apiUrl="/api/transcribe"
        />
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={onSave} disabled={saving || !form.name.trim() || !form.price}>
          {saving && <Loader2 size={11} className="animate-spin" />}
          {labels.save}
        </Button>
      </div>
    </div>
  )
}
