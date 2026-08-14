"use client"

// Догрузка каталога — «показать ещё».
//
// 🔒 ЭТОТ ОСТРОВОК НЕ РИСУЕТ ПЕРВУЮ ПАРТИЮ. Она уже в статическом HTML, отданном
// сервером; здесь только продолжение. Если бы сетку рисовал клиент, страница
// потеряла бы и SEO, и работу без JS разом — а это публичный слой, где то и
// другое обязательно.
//
// Кнопка, а не бесконечная прокрутка: прокрутка отнимает у человека подвал сайта
// и не даёт понять, сколько осталось. Счётчик «показано N из M» отвечает на этот
// вопрос прямо.

import { useState } from "react"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaImage } from "@/components/media/media-image.server"

type Row = {
  id: string
  name: string
  price: number
  media_url: string | null
  // Приезжают вместе со строкой из того же ответа, что и остальные поля: без них
  // догруженная карточка рисовалась бы без подложки, и вторая половина каталога
  // выглядела бы иначе, чем первая.
  media_width?: number | null
  media_height?: number | null
  media_blur?: string | null
}

export function LoadMore(
  { lang, total, loaded, currency, labels }: {
    lang: string
    total: number
    loaded: number
    /** Валюта витрины — пропом, потому что настройки читаются на сервере. */
    currency: string
    labels: { more: string; loading: string; failed: string; shown: string }
  },
) {
  const [rows, setRows] = useState<Row[]>([])
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const shown = loaded + rows.length
  const money = new Intl.NumberFormat(lang, { style: "currency", currency })

  async function more() {
    setBusy(true)
    setFailed(false)
    try {
      const res = await fetch(`/api/catalogue?offset=${shown}&lang=${lang}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setRows(prev => [...prev, ...(data.products ?? [])])
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {rows.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map(p => (
            <li key={p.id}>
              <Link
                href={`/${lang}/products/${p.id}`}
                className="group block overflow-hidden rounded-xl border border-border transition-colors hover:border-foreground/30"
              >
                <div className="aspect-square bg-muted/30 p-4">
                  {p.media_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <MediaImage media={{ url: p.media_url!, width: p.media_width, height: p.media_height, blur: p.media_blur }} alt={p.name} sizes="(max-width: 640px) 50vw, 280px" className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">—</div>
                  )}
                </div>
                <div className="border-t border-border p-3">
                  <p className="truncate text-sm font-medium text-foreground group-hover:underline">{p.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{money.format(p.price)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col items-center gap-1.5">
        {shown < total && (
          <Button size="sm" variant="outline" onClick={more} disabled={busy}>
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {busy ? labels.loading : labels.more}
          </Button>
        )}
        <p className="text-[10px] text-muted-foreground">
          {labels.shown.replace("{shown}", String(shown)).replace("{total}", String(total))}
        </p>
        {failed && <p className="text-[10px] text-destructive">{labels.failed}</p>}
      </div>
    </>
  )
}
