import Link from "next/link"
import { MediaImage } from "@/components/media/media-image.server"
import { H1 } from "@/components/ui/typography"
import type { LocalizedProduct } from "@/lib/products/localize"

// ВИДЖЕТ «карточка товара» — облик одной страницы товара (шаг 64).
//
// 🔒 ПОЧЕМУ ВИДЖЕТ. Он принадлежит одному маршруту и ни одной другой странице
// проекта не подойдёт: снимок, название, цена в валюте проекта и возврат в
// каталог. Вид каталога обязан подходить любой странице — этот не подходит
// никакой, кроме своей.
//
// 🔒 ЧЕГО ЗДЕСЬ НЕТ И БЫТЬ НЕ ДОЛЖНО: разметки для поисковика и крошек. Это не
// облик товара, а объявление СТРАНИЦЫ о себе — отвечает поисковику адрес, а не
// картинка. Уехав сюда, разметка исчезла бы из поля зрения `check:seo`.
export function ProductDetail({
  lang,
  product,
  currency,
  backLabel,
}: {
  lang: string
  product: LocalizedProduct
  currency: string
  backLabel: string
}) {
  const p = product

  return (
    <article className="mt-6">
      {p.media_url && (
        <figure className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
          <MediaImage media={{ url: p.media_url!, width: p.media_width, height: p.media_height, blur: p.media_blur }} alt={p.localizedName} sizes="(max-width: 640px) 50vw, 280px" className="mx-auto h-72 w-full object-contain p-6" />
        </figure>
      )}

      <H1>{p.localizedName}</H1>
      <p className="mt-2 text-xl font-medium text-foreground">
        {/* Валюта показывается человеку тем же значением, что уезжает в разметку:
            цифра без валюты не значит ничего ни для того, ни для другого. */}
        {new Intl.NumberFormat(lang, { style: "currency", currency }).format(p.price)}
      </p>

      {p.localizedDescription && (
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">{p.localizedDescription}</p>
      )}

      <Link
        href={`/${lang}/products`}
        className="mt-8 inline-block text-xs text-muted-foreground underline hover:text-foreground"
      >
        ← {backLabel}
      </Link>
    </article>
  )
}
