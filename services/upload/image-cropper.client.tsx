"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import type { ImageCropperUi } from "./image-cropper.i18n"

export type CropMode = "horizontal" | "square" | "vertical"

const RATIOS: Record<CropMode, { w: number; h: number }> = {
  horizontal: { w: 16, h: 9 },
  square:     { w: 1,  h: 1 },
  vertical:   { w: 9,  h: 16 },
}

type Props = {
  src: string
  /** Слова обрезчика на языке страницы — резолвятся на сервере. */
  ui: ImageCropperUi
  /** Слова общего окна — резолвятся на сервере (`appDialogUi(lang)`). */
  dialogUi: AppDialogUi
  onDone: (blob: Blob, cropMode: CropMode) => void
  onCancel: () => void
}

export function ImageCropper({ src, ui, dialogUi, onDone, onCancel }: Props) {
  const MAX = 280
  const [cropMode, setCropMode] = useState<CropMode>("horizontal")
  const ratio = RATIOS[cropMode]
  const r   = ratio.w / ratio.h
  const W   = r >= 1 ? MAX : Math.round(MAX * r)
  const H   = r >= 1 ? Math.round(MAX / r) : MAX
  const outW = Math.min(ratio.w * 512, 1200)
  const outH = Math.round(outW * ratio.h / ratio.w)

  const [scale, setScale]   = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef   = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new globalThis.Image()
    img.onload = () => {
      imgRef.current = img
      setScale(Math.min(W / img.naturalWidth, H / img.naturalHeight))
      setOffset({ x: 0, y: 0 })
    }
    img.src = src
  }, [src, cropMode])

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(img, offset.x + (W - w) / 2, offset.y + (H - h) / 2, w, h)
  }, [scale, offset, W, H])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      setOffset({ x: dragRef.current.ox + ev.clientX - dragRef.current.startX, y: dragRef.current.oy + ev.clientY - dragRef.current.startY })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const handleDone = () => {
    const out = document.createElement("canvas")
    out.width = outW
    out.height = outH
    const ctx = out.getContext("2d")
    const img = imgRef.current
    if (!ctx || !img) return
    const rx = outW / W, ry = outH / H
    ctx.drawImage(
      img,
      offset.x * rx + (outW - img.naturalWidth * scale * rx) / 2,
      offset.y * ry + (outH - img.naturalHeight * scale * ry) / 2,
      img.naturalWidth * scale * rx,
      img.naturalHeight * scale * ry
    )
    out.toBlob((blob) => { if (blob) onDone(blob, cropMode) }, "image/jpeg", 0.92)
  }

  // 🔒 ОКНО СОБИРАЛОСЬ РУКАМИ: свой `createPortal`, своя подложка, свой слой
  // `z-[200]` — самый высокий в приложении, назначенный без чьего-либо ведома.
  // Ни `role="dialog"`, ни ловушки фокуса, ни Escape здесь не было; четыре слова
  // интерфейса стояли по-английски прямо в разметке. Портал, подложку, слой и
  // доступность теперь приносит общий `AppDialog`, слова — словарь рядом.
  return (
    <AppDialog
      open
      onOpenChange={v => { if (!v) onCancel() }}
      ui={dialogUi}
      size="sm"
      title={ui.title}
      titleClassName="text-xs font-semibold"
      bodyClassName="flex flex-col gap-3"
      toolbar={
        /* Соотношение сторон — не оформление, а решение о кадре, и оно должно
           оставаться на виду, пока человек двигает картинку. */
        <div className="flex justify-center gap-1">
          {(["horizontal", "square", "vertical"] as CropMode[]).map((m) => (
            <Button
              key={m}
              type="button"
              size="sm"
              variant={cropMode === m ? "default" : "outline"}
              className="h-7 px-2 text-[10px]"
              onClick={() => setCropMode(m)}
            >
              {m === "horizontal" ? "16:9" : m === "square" ? "1:1" : "9:16"}
            </Button>
          ))}
        </div>
      }
      footer={
        <>
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>{ui.cancel}</Button>
          <Button type="button" size="sm" onClick={handleDone}>{ui.apply}</Button>
        </>
      }
    >
      <canvas
        ref={canvasRef} width={W} height={H}
        className="self-center cursor-grab rounded-lg border border-border bg-muted/30 select-none active:cursor-grabbing"
        style={{ width: W, height: H }}
        onMouseDown={onMouseDown}
      />
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-muted-foreground">{ui.scale}</span>
        <input type="range" min={0.05} max={4} step={0.01} value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full accent-primary" />
      </div>
    </AppDialog>
  )
}
