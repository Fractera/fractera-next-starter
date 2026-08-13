// Статическая картинка проекта — с размерами и размытым превью (шаг 506.2).
//
// ЗАЧЕМ ОБЁРТКА, А НЕ ПРЯМОЙ `next/image`. Чтобы поставить `placeholder="blur"`,
// нужны три вещи: ширина, высота и сама размытая строка. Для пути, записанного
// СТРОКОЙ (а посты хранят именно строку — данные обязаны оставаться данными),
// Next их не знает: первоисточник говорит прямо, что для динамического или
// удалённого источника `blurDataURL` предоставляет автор. Всё это уже посчитано
// на сборке в `lib/images/previews.generated.ts`; обёртка просто соединяет
// адрес с его записью, чтобы каждое место вызова не делало это заново — и не
// забывало.
//
// ЧЕСТНЫЙ ФОЛБЭК ВМЕСТО ПАДЕНИЯ. Картинки, которой нет в карте, может не быть по
// двум причинам: это SVG (мы их не трогаем намеренно) или файл появился без
// пересборки. В обоих случаях правильное поведение — показать обычный `<img>`,
// а не уронить страницу: изображение без превью хуже изображения с превью и
// НЕСРАВНИМО лучше пустого места.

import Image from "next/image"
import { IMAGE_PREVIEWS } from "@/lib/images/previews.generated"

type Props = {
  src: string
  alt: string
  className?: string
  /** Растянуть по контейнеру (у контейнера должен быть свой размер). */
  fill?: boolean
  /** Ширина в вёрстке — обязательна для `fill`, иначе браузер грузит самый большой файл. */
  sizes?: string
  /** Первый экран: грузить сразу, без ленивой загрузки. */
  priority?: boolean
}

export function StaticImage({ src, alt, className, fill, sizes, priority }: Props) {
  const preview = IMAGE_PREVIEWS[src]

  if (!preview) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />
  }

  const blur = { placeholder: "blur" as const, blurDataURL: preview.blurDataURL }

  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} className={className} priority={priority} {...blur} />
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={preview.width}
      height={preview.height}
      sizes={sizes}
      className={className}
      priority={priority}
      {...blur}
    />
  )
}
