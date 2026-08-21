"use client"

// АНИМИРОВАННАЯ ВЕРСИЯ — отсчёт от нуля до конечного значения за три секунды
// (просьба владельца, дословно), приходит после первого попадания блока в поле
// зрения и подменяет близнеца.
//
// 🔒 ГРУЗИТСЯ ЛЕНИВО, КАК И У `security-orbit`. Первый экран не платит за этот
// код ни байтом, пока блок не показался целиком (`swap.client.tsx` берёт файл
// через `lazy`).
//
// 🔒 «УМЕНЬШИТЬ ДВИЖЕНИЕ» — ПОДМЕНА ВСЁ РАВНО ПРОИСХОДИТ, СЧЁТ — НЕТ. При
// системной настройке число сразу встаёт на конечное значение, минуя
// анимацию промежуточных кадров: мельтешащие цифры — тот же диагноз, что и
// вращение у орбиты.
//
// 🔒 БЕЗ ВНЕШНЕЙ БИБЛИОТЕКИ ДВИЖЕНИЯ. Считается число, а не трансформ и не
// прозрачность — `requestAnimationFrame` дешевле и не тянет `motion` ради
// одной цифры; сам хук проверки «уменьшить движение» у проекта уже есть в
// `motion/react`, и он единственное, что отсюда берётся.

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { CounterFrame } from "./parts"
import { formatCount } from "./format"

const DURATION_MS = 3000

export default function CounterAnimated(
  { value, formatted, caption }: { value: number; formatted: string; caption: string },
) {
  const still = useReducedMotion()
  const [display, setDisplay] = useState(still ? formatted : formatCount(0))
  const started = useRef(false)

  useEffect(() => {
    if (still || started.current) return
    started.current = true
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      const eased = 1 - (1 - t) ** 3 // плавное замедление к концу (ease-out cubic)
      if (t < 1) {
        setDisplay(formatCount(Math.round(value * eased)))
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(formatted) // фиксация — то же форматирование, что у близнеца
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [still, value, formatted])

  return <CounterFrame digits={display} caption={caption} />
}
