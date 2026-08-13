// Загруженная картинка — с размерами и размытым превью (шаг 506.3).
//
// ОТЛИЧИЕ ОТ `StaticImage`. Тот работает с файлами из `public/`, чьи размеры и
// подложка посчитаны на сборке. Здесь картинка появилась ПОСЛЕ сборки — её
// загрузил владелец, — поэтому и размеры, и подложку присылает слой данных
// вместе с записью о ней (колонки `width`, `height`, `blur`).
//
// 🔒 РАЗМЕРЫ НЕ УГАДЫВАЮТСЯ И НЕ ПОДСТАВЛЯЮТСЯ «ПРИМЕРНЫЕ». Неверное отношение
// сторон у `next/image` — это не косметика: браузер резервирует под картинку не
// ту высоту, страница дёргается, и мы платим ровно тем, ради чего всё это
// затевалось. Нет размеров в записи — рисуем обычный `<img>`, честно.
//
// УЖИМАЕТ КАРТИНКУ САМ NEXT, и отдельного механизма для этого не нужно: медиа
// отдаётся с НАШЕГО адреса (`/api/media/<id>/file`), то есть для оптимизатора
// это свой источник — `remotePatterns` не требуется. Он и нарежет размеры под
// экран; наше дело — сообщить то, чего он знать не может.

import Image from "next/image"

/** То немногое, что нужно от записи медиа. Совместимо с `UploadedFile`. */
export type MediaImageSource = {
  url: string
  width?: number | null
  height?: number | null
  /** Строка `data:` из слоя данных. У записей старше шага 506.3 пустая. */
  blur?: string | null
}

type Props = {
  media: MediaImageSource
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function MediaImage({ media, alt, className, fill, sizes, priority }: Props) {
  const { url, width, height, blur } = media

  const usable = fill || (Boolean(width) && Boolean(height))
  if (!url || !usable) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />
  }

  // Подложка ставится, ТОЛЬКО когда она есть: `placeholder="blur"` без строки —
  // это ошибка времени выполнения, а не мягкая деградация.
  const blurProps = blur ? { placeholder: "blur" as const, blurDataURL: blur } : {}

  if (fill) {
    return <Image src={url} alt={alt} fill sizes={sizes ?? "100vw"} className={className} priority={priority} {...blurProps} />
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width!}
      height={height!}
      sizes={sizes}
      className={className}
      priority={priority}
      {...blurProps}
    />
  )
}
