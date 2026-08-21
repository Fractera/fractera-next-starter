"use client"

// ПОДМЕНА ПО ПОПАДАНИЮ В ПОЛЕ ЗРЕНИЯ — а не по нажатию.
//
// 🔒 ОТЛИЧИЕ ОТ ОБРАЗЦА `security-orbit`, И ОНО НАМЕРЕННОЕ. Образец в проекте
// подменяет близнеца после ПЕРВОГО НАЖАТИЯ; здесь владелец попросил дословно
// «когда блок попадает в поле зрения» — сам смысл счётчика в том, что отсчёт
// стартует, когда его УВИДЕЛИ, а не когда по нему нажали (по счётчику и нельзя
// нажать — на нём нет управляющего элемента, кликать не на что). Остальной
// закон движения соблюдён целиком без исключений:
//   1. сервер печатает покой (конечное число, без анимации);
//   2. островок держит близнеца и подменяет его после первого триггера;
//   3. анимированная версия грузится лениво, фолбэк подмены — тот же близнец;
//   4. `prefers-reduced-motion` уважается — внутри `animated.client.tsx`.
// Меняется РОВНО событие-триггер (`IntersectionObserver` вместо `click`), не
// архитектура вокруг него.
//
// 🔒 БЛИЗНЕЦ И АНИМАЦИЯ ПОКАЗЫВАЮТ ОДНО И ТО ЖЕ КОНЕЧНОЕ ЧИСЛО. Отсчёт стартует
// от нуля и ФИКСИРУЕТСЯ на `formatted` — том же значении, что уже отрисовал
// сервер, — а не на новом случайном числе: иначе после подмены число тихо
// поменялось бы у человека на глазах.

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react"

const CounterAnimated = lazy(() => import("./animated.client"))

export function CounterSwap(
  { value, formatted, caption, children }: {
    value: number
    formatted: string
    caption: string
    children: ReactNode
  },
) {
  const [live, setLive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || live) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setLive(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [live])

  return (
    <div ref={ref} data-widget="user-counter">
      {live
        ? (
          <Suspense fallback={children}>
            <CounterAnimated value={value} formatted={formatted} caption={caption} />
          </Suspense>
        )
        : children}
    </div>
  )
}
