"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// ПОЛОСА ОБНОВЛЕНИЯ НАД ЗАГОЛОВКОМ (правка владельца).
//
// 🔒 ЕГО СЛОВА: «в верхней части над заголовком сделай на всю ширину слайдер,
// который движется справа налево каждые 5 секунд, и в тот момент, когда он
// завершает свой цикл, обновлять страницу, чтобы показать новые результаты».
// Полоса здесь — не украшение: она отвечает на вопрос «когда обновится», и без
// неё обновление выглядит самопроизвольным дёрганьем экрана.
//
// 🔒 `router.refresh()`, А НЕ ПЕРЕЗАГРУЗКА ОКНА. Перезагрузка теряет прокрутку и
// раскрытые окна и стоит полной загрузки страницы; `refresh` перерисовывает
// серверную часть на месте — то есть ровно строки таблицы.

const CYCLE_MS = 5000

export function AutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => router.refresh(), CYCLE_MS)
    return () => clearInterval(t)
  }, [router])

  return (
    <div
      data-auto-refresh
      aria-hidden
      className="mb-4 h-1 w-full overflow-hidden rounded-full bg-muted"
    >
      <div className="task-refresh-bar h-full w-1/3 rounded-full bg-primary" />
      {/* Движение справа налево, ровно один цикл на обновление. Разметка стилей
          лежит рядом с полосой: это её собственное поведение, а не тема сайта. */}
      <style>{`
        @keyframes task-refresh-slide {
          from { transform: translateX(300%); }
          to { transform: translateX(-100%); }
        }
        .task-refresh-bar {
          animation: task-refresh-slide ${CYCLE_MS}ms linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .task-refresh-bar { animation: none; width: 100%; opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
