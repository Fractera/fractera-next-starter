"use client"

// ПОДМЕНА ПО ПЕРВОМУ ПРОБУЖДЕНИЮ.
//
// Устройство: сервер рисует статического близнеца и отдаёт его сюда `children`.
// Островок ничего не перерисовывает, пока человек не разбудил; после этого
// подтягивается анимированная версия и встаёт на то же место.
//
// 🔒 ТРИ ВЕЩИ, КОТОРЫЕ ЭТО ПОКУПАЕТ, И НИ ОДНА НЕ КОСМЕТИЧЕСКАЯ:
//   1. Страница работает без JavaScript — близнец приходит из разметки сервера.
//   2. Первый экран не платит за библиотеку движения: она грузится отдельным
//      куском, и только у того, кто разбудил.
//   3. Подмена не мигает: пока кусок летит по сети, на экране остаётся ТОТ ЖЕ
//      близнец (`fallback={children}`), а не пустота и не «загрузка».
//
// 🔒 СЛУШАТЕЛЬ ВЕШАЕТСЯ НА ОБЁРТКУ, А НЕ КНОПКОЙ. Нажатие здесь лишь оживляет
// уже показанное: не разбудил — не потерял ничего, поэтому управляющего элемента
// с ролью и клавиатурным близнецом эта вещь не требует.

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react"
import type { OrbitLayersUi } from "./parts"

const OrbitLayersAnimated = lazy(() => import("./animated.client"))

export function OrbitLayersSwap({ ui, children }: { ui: OrbitLayersUi; children: ReactNode }) {
  const [live, setLive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 🔒 ДВА СЛУШАТЕЛЯ, А НЕ ОДИН, И ОБА ТОЛЬКО НА ШИРОКОМ ЭКРАНЕ. Нажатие требует
  // намерения — человек, который просто читает страницу, движения не увидел бы
  // никогда. Указатель, вошедший в область секции, — то же согласие, только без
  // требования что-то нажать. `pointerenter`, а не `mouseenter`: на пере и
  // тачпаде событие то же, а на пальце его не бывает вовсе.
  //
  // 🔒 НА ТЕЛЕФОНЕ ДВИЖЕНИЯ НЕТ ВОВСЕ. Не «оно там мельче»: на узком экране
  // подмена обходится дороже всего — библиотека едет по мобильной связи, кадры
  // считает процессор телефона, — а разбудить её пальцем можно только нажатием,
  // то есть человек, листавший страницу, получил бы анимацию в ответ на попытку
  // пролистнуть. Близнец при этом уже нарисован сервером и выглядит законченным.
  //
  // Порог `767px` — граница `md` дизайн-системы, а не своя выдуманная цифра.
  //
  // Слушатели НЕ помечены `once`: на узком экране `wake` ничего не делает, и
  // пометка сняла бы их после первого касания — тогда поворот телефона в альбом
  // уже не разбудил бы вид никогда. Снимает их уборка эффекта.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const narrow = window.matchMedia("(max-width: 767px)")

    const wake = () => {
      if (narrow.matches) return
      setLive(true)
    }
    // Экран стал узким уже ПОСЛЕ подмены (поворот, изменение окна) — возвращаем
    // близнеца: правило про телефон обязано действовать и здесь.
    const stop = () => {
      if (narrow.matches) setLive(false)
    }

    narrow.addEventListener("change", stop)
    if (!live) {
      el.addEventListener("click", wake)
      el.addEventListener("pointerenter", wake)
    }
    return () => {
      narrow.removeEventListener("change", stop)
      el.removeEventListener("click", wake)
      el.removeEventListener("pointerenter", wake)
    }
  }, [live])

  return (
    <div ref={ref} data-orbit-layers-swap>
      {live ? <Suspense fallback={children}><OrbitLayersAnimated ui={ui} /></Suspense> : children}
    </div>
  )
}
