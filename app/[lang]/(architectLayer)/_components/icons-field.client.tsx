"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Scissors, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Small } from "@/components/ui/typography"
import type { FieldsUi } from "../_i18n/fields.i18n"
import { ImageCropper } from "@/_tools/image-crop/client/image-cropper.client"
import type { CropUi } from "./crop-ui"

// НАБОР ЗНАЧКОВ ПРИЛОЖЕНИЯ (31-8, 2026-08-28).
//
// 🔒 ЭТО НЕ ПОЛЕ ВВОДА, А ДЕЙСТВИЕ. Значения здесь человек не пишет: он даёт одну
// квадратную картинку, а восемь файлов рождает сервер. Поэтому кнопка сохранения
// формы к этому полю отношения не имеет — набор записывается своей дверью сразу.
//
// 🔒 ПОСЛЕ НАРЕЗКИ СТРАНИЦА ОБНОВЛЯЕТСЯ С СЕРВЕРА (`router.refresh()`), а не
// правит своё состояние сама: набор посчитан ТАМ, и рисовать здесь предположение
// о том, что получилось, значит завести второй источник правды на один экран.
export function IconsField({
  current,
  ui,
  cropUi,
}: {
  /** Идентификатор действующего набора; пусто — набора нет. */
  current: string
  ui: FieldsUi
  cropUi: CropUi
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  // Выбранная картинка ждёт обрезки: на сервер ещё ничего не ушло.
  const [pending, setPending] = useState<{ src: string; name: string } | null>(null)

  async function slice(file: File) {
    setBusy(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/architect/icons", { method: "POST", body: form, credentials: "include" })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.iconsFailed)
      } else {
        toast.success(ui.iconsDone)
        router.refresh()
      }
    } catch {
      toast.error(ui.iconsFailed)
    }
    setBusy(false)
  }

  async function drop() {
    setBusy(true)
    try {
      const res = await fetch("/api/architect/icons", { method: "DELETE", credentials: "include" })
      if (res.ok) {
        toast.success(ui.iconsDropped)
        router.refresh()
      } else {
        toast.error(ui.iconsFailed)
      }
    } catch {
      toast.error(ui.iconsFailed)
    }
    setBusy(false)
  }

  return (
    <div data-icons-field className="flex flex-col gap-2">
      {pending && (
        <ImageCropper
          src={pending.src}
          labels={cropUi.cropper}
          dialogUi={cropUi.dialog}
          force="square"
          onDone={blob => {
            const name = pending.name.replace(/.[^.]+$/, "") + ".jpg"
            URL.revokeObjectURL(pending.src)
            setPending(null)
            void slice(new File([blob], name, { type: "image/jpeg" }))
          }}
          onCancel={() => {
            URL.revokeObjectURL(pending.src)
            setPending(null)
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy} data-icons-slice onClick={() => fileRef.current?.click()}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Scissors className="size-4" aria-hidden />}
          {ui.iconsSlice}
        </Button>
        {current && (
          <Button type="button" variant="ghost" size="sm" disabled={busy} data-icons-drop onClick={drop}>
            <Trash2 className="size-4" aria-hidden />
            {ui.iconsDrop}
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
          // 🔒 ЗНАЧКИ РЕЖУТСЯ ИЗ КВАДРАТА, И КВАДРАТ ЗАПЕРТ. Пропорция здесь не вкус,
          // а требование формата: сервер делает из картинки восемь квадратных файлов,
          // и присланный прямоугольник он всё равно обрежет — вслепую и не там, где
          // хотел человек.
          if (file) setPending({ src: URL.createObjectURL(file), name: file.name })
          e.target.value = ""
        }}
      />

      {current ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/media/icons/${current}/file/icon-192.png`}
            alt=""
            data-icons-preview
            className="size-12 rounded-md border border-border bg-muted/40 object-contain p-1"
          />
          <Small>{ui.iconsCurrent}</Small>
        </div>
      ) : (
        <Small>{ui.iconsNone}</Small>
      )}
    </div>
  )
}
