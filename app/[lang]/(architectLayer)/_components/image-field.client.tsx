"use client"

import { useRef, useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Small } from "@/components/ui/typography"
import type { FieldsUi } from "../_i18n/fields.i18n"

// ПОЛЕ-КАРТИНКА (31-7, 2026-08-28).
//
// 🔒 В КОНФИГЕ ЛЕЖИТ АДРЕС, А НЕ ФАЙЛ. Файл уезжает в хранилище через дверь
// `POST /api/media/upload` (та же, которой пользуется остальное приложение), и она
// возвращает адрес вида `/api/media/<id>/file`. Класть в конфиг байты или путь на
// диске значило бы завести второе хранилище картинок рядом с существующим.
//
// 🔒 АДРЕС ОСТАЁТСЯ РЕДАКТИРУЕМЫМ ВРУЧНУЮ. Загрузка — удобство, а не единственный
// путь: у владельца может уже лежать картинка в `public/` или на своём домене, и
// заставлять его перезаливать её ради формы — работа без причины.
//
// 🔒 ПРЕДПРОСМОТР ЧЕРЕЗ ОБЫЧНЫЙ `<img>`, А НЕ `next/image`. Адрес приходит из
// настроек в рантайме, оптимизатору он неизвестен на сборке, а домен может быть
// чужим — `next/image` на таком адресе отвечает ошибкой, и человек видит сломанную
// картинку вместо своей.
export function ImageField({
  id,
  value,
  disabled,
  onChange,
  ui,
}: {
  id: string
  value: string
  disabled?: boolean
  onChange: (next: string) => void
  ui: FieldsUi
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function upload(file: File) {
    setBusy(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/media/upload", { method: "POST", body: form, credentials: "include" })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; item?: { url?: string } }
      if (!res.ok || !data.ok || !data.item?.url) {
        toast.error(ui.uploadFailed)
        setBusy(false)
        return
      }
      onChange(data.item.url)
      toast.success(ui.uploaded)
    } catch {
      toast.error(ui.uploadFailed)
    }
    setBusy(false)
  }

  return (
    <div data-image-field className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={value}
          disabled={disabled}
          placeholder="/api/media/… "
          onChange={e => onChange(e.target.value)}
          className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={() => fileRef.current?.click()}
          data-upload
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
          {ui.upload}
        </Button>
        {value && !disabled && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")} aria-label={ui.clear}>
            <X className="size-4" aria-hidden />
          </Button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) void upload(file)
          // Один и тот же файл, выбранный дважды подряд, не вызывает событие —
          // сбрасываем значение, иначе повтор загрузки выглядит как отказ.
          e.target.value = ""
        }}
      />

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          data-image-preview
          className="max-h-24 w-auto rounded-md border border-border bg-muted/40 object-contain p-1"
        />
      ) : (
        <Small>{ui.noImage}</Small>
      )}
    </div>
  )
}
