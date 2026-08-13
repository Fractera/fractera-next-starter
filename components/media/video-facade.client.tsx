"use client"

// Обложка вместо чужого плеера (шаг 506.2, дефект найден владельцем 2026-08-13).
//
// 🔒 ЧТО БЫЛО СЛОМАНО. В посте стоял голый `<iframe src="youtube.com/embed/…">`.
// С выключенным JavaScript YouTube отдаёт в этот кадр СВОЮ страницу ошибки —
// «Произошла ошибка. Включите JavaScript в браузере…», — и посетитель видел
// сообщение о поломке там, где ожидал видео. Проект, который обещает работу без
// скриптов, обязан держать это обещание и в материалах, иначе обещание ложно
// ровно на той странице, ради которой человек пришёл.
//
// РЕШЕНИЕ — ФАСАД. По умолчанию рисуется обложка, обёрнутая в обычную ссылку на
// страницу видео. Без скриптов это работает как любая ссылка: нажал — смотришь
// видео на YouTube. Со скриптами нажатие подменяет обложку встроенным плеером,
// и видео играет здесь же.
//
// ПОБОЧНАЯ ВЫГОДА, КОТОРАЯ ЗДЕСЬ ГЛАВНАЯ ПО ВЕСУ. Встроенный плеер тянет
// сторонние скрипты при КАЖДОЙ загрузке страницы, даже если видео никто не
// включит. Фасад не грузит ничего, пока не нажали, — страница с материалом
// перестаёт платить за плеер, который чаще всего не смотрят.
//
// Обложку не тащим в репозиторий: это кадр чужого видео, и его место — на
// стороне, которая им владеет.

import { useState } from "react"

type Props = {
  /** Адрес встроенного плеера — подставляется только после нажатия. */
  embedSrc: string
  /** Страница видео: сюда ведёт ссылка, когда скрипты выключены. */
  watchHref: string
  poster: string
  title: string
  /** Подпись действия — приходит из словаря вкладки, не пишется здесь. */
  label: string
}

export function VideoFacade({ embedSrc, watchHref, poster, title, label }: Props) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="my-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-background">
        <iframe
          src={`${embedSrc}${embedSrc.includes("?") ? "&" : "?"}autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }

  return (
    <a
      href={watchHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => {
        // Скрипты работают — оставляем человека на странице. Без них этот
        // обработчик просто не выполнится, и сработает обычный переход.
        e.preventDefault()
        setPlaying(true)
      }}
      className="group relative my-8 block aspect-video w-full overflow-hidden rounded-2xl border border-border bg-background"
      aria-label={`${title} — ${label}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        loading="lazy"
        className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-background/85 shadow-lg ring-1 ring-border">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1 text-foreground">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border">
        {label}
      </span>
    </a>
  )
}
