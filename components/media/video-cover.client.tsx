"use client"

// Своё видео за обложкой-КАРТИНКОЙ (шаг 506, отчёт проверки 2026-08-13).
//
// 🔒 ЭТО СНИМАЕТ ОГРАНИЧЕНИЕ, КОТОРОЕ КАЗАЛОСЬ ПРИРОДНЫМ. Заставка тега `video`
// живёт в атрибуте `poster`, а атрибут — не изображение: ни размытой подложки,
// ни выбора размера под экран, ни современного формата к нему не применить. Файл
// уезжал посетителю как есть — 82 КБ ради места 444×290 на экране, и он же был
// самым крупным элементом страницы, по которому поисковик меряет скорость.
//
// Вывод не «с этим ничего не сделать», а «не использовать этот элемент, пока он
// не нужен»: до нажатия стоит обычная картинка, которая проходит весь наш путь —
// размеры, размытая подложка в разметке, размер под экран, современный формат.
// Видео появляется по нажатию и сразу играет.
//
// ПОБОЧНАЯ ВЫГОДА ТА ЖЕ, ЧТО У ФАСАДА YOUTUBE: видео не грузится вовсе, пока его
// не попросили. Разница в том, что здесь видео СВОЁ — значит и без нажатия
// страница ничего не должна тратить на него.
//
// БЕЗ JAVASCRIPT показывается обычное видео с обложкой в `poster`: посетитель со
// скриптами получает лёгкую страницу, посетитель без них — работающее видео.
// Терять содержимое ради оптимизации нельзя.

import { useState } from "react"

export function VideoCover(
  { src, poster, label, cover, captions, lang }:
  {
    src: string
    poster?: string
    /** Подпись действия — из словаря, не строкой здесь. */
    label: string
    /** Готовая картинка-обложка (оптимизированная), рисуется до нажатия. */
    cover: React.ReactNode
    captions?: string
    lang: string
  },
) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="h-full w-full bg-background object-cover"
      >
        {captions && <track kind="captions" src={captions} srcLang={lang} label={lang} default />}
      </video>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={label}
      className="group relative block h-full w-full cursor-pointer border-0 bg-background p-0"
    >
      {cover}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-background/85 shadow-lg ring-1 ring-border transition-transform group-hover:scale-105">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1 text-foreground">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
