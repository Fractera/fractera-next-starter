"use client"

// ПОДМЕНА ПО ПЕРВОМУ НАЖАТИЮ — решение владельца 2026-08-22.
//
// Устройство: сервер рисует статического близнеца и отдаёт его сюда `children`.
// Островок ничего не перерисовывает, пока человек не нажал; после нажатия
// подтягивается анимированная версия и встаёт на то же место.
//
// 🔒 ТРИ ВЕЩИ, КОТОРЫЕ ЭТО ПОКУПАЕТ, И НИ ОДНА НЕ КОСМЕТИЧЕСКАЯ:
//   1. Страница работает без JavaScript — близнец приходит из разметки сервера.
//   2. Первый экран не платит за библиотеку движения: она грузится отдельным
//      куском, и только у того, кто нажал.
//   3. Подмена не мигает: пока кусок летит по сети, на экране остаётся ТОТ ЖЕ
//      близнец (`fallback={children}`), а не пустота и не «загрузка».
//
// 🔒 СЛУШАТЕЛЬ ВЕШАЕТСЯ ССЫЛКОЙ, А НЕ `onClick` НА `div`. Обработчик на «диве»
// требует клавиатурного близнеца и роли — то есть превращает украшение в
// управляющий элемент, которым оно не является. Здесь нажатие лишь оживляет уже
// показанное: не нажал — не потерял ничего.

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react"
import type { SecurityOrbitUi } from "./ui.i18n"

const SecurityAnimated = lazy(() => import("./animated.client"))

export function SecuritySwap({ ui, children }: { ui: SecurityOrbitUi; children: ReactNode }) {
  const [live, setLive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 🔒 ДВА СЛУШАТЕЛЯ, А НЕ ОДИН (владелец 2026-08-22). Нажатие требовало
  // намерения — человек, который просто читает страницу, движения не увидел бы
  // никогда. Указатель, вошедший в область секции, — то же самое согласие, только
  // без требования что-то нажать.
  //
  // `pointerenter`, а не `mouseenter`: на пере и на тачпаде событие то же, а на
  // пальце его не бывает вовсе — и это правильно, на телефоне «наведения» нет, там
  // остаётся нажатие.
  //
  // Оба слушателя `once` и оба снимаются вместе: разбудить можно только раз.
  useEffect(() => {
    const el = ref.current
    if (!el || live) return
    const wake = () => setLive(true)
    el.addEventListener("click", wake, { once: true })
    el.addEventListener("pointerenter", wake, { once: true })
    return () => {
      el.removeEventListener("click", wake)
      el.removeEventListener("pointerenter", wake)
    }
  }, [live])

  return (
    <div ref={ref} data-widget="security-orbit">
      {live ? <Suspense fallback={children}><SecurityAnimated ui={ui} /></Suspense> : children}
    </div>
  )
}
