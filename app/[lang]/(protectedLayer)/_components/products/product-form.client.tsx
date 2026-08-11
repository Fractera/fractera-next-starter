"use client"

import { useRef, type Dispatch, type SetStateAction } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUploadField } from "@/services/upload/file-upload-field.client"
import VoiceInput from "@/_tools/voice-input/client/voice-input.client"
import type { UploadedFile } from "@/services/upload/upload.service"

type Props = {
  form: { name: string; price: string }
  setForm: Dispatch<SetStateAction<{ name: string; price: string }>>
  saving: boolean
  onSave: () => void
  onUpload: (f: UploadedFile | null) => void
  lang: string
  labels: { newProduct: string; name: string; price: string; uploadPhoto: string; save: string }
}

export function ProductForm({ form, setForm, saving, onSave, onUpload, lang, labels }: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  return (
    <div className="mb-6 p-4 rounded-xl border border-border bg-muted/30">
      <p className="text-xs font-medium text-foreground mb-3">{labels.newProduct}</p>
      <div className="flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          placeholder={labels.name}
          ref={nameRef}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && onSave()}
          className="flex-1 min-w-[160px] h-8 px-3 rounded-md border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <input
          type="number"
          placeholder={labels.price}
          min={0}
          step={0.01}
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          className="w-28 h-8 px-3 rounded-md border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <FileUploadField
          accept="image"
          preview
          label={labels.uploadPhoto}
          onUpload={f => onUpload(f)}
        />
      </div>
      {/* Голос — под полями, слева: он ПИШЕТ в название, а не решает, что
          делать дальше. Та же раскладка, что у Quiz в панели. */}
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
        <button
          onClick={onSave}
          disabled={saving || !form.name.trim() || !form.price}
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {saving && <Loader2 size={11} className="animate-spin" />}
          Save
        </button>
      </div>
    </div>
  )
}
