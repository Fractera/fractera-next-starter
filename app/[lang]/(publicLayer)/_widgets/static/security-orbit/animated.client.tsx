"use client"

// АНИМИРОВАННАЯ ВЕРСИЯ — приходит после первого нажатия и подменяет близнеца.
//
// 🔒 ПОЧЕМУ ПОДМЕНА НЕ ВИДНА. Разметка у обеих версий общая (`parts.tsx`), а
// движение объявлено `animate`, без `initial`: `motion` начинает с ТЕКУЩЕГО
// состояния элемента, ничего не сбрасывая. Появления «из прозрачности» здесь нет
// намеренно — оно и было бы тем самым мельканием, которое владелец запретил.
//
// 🔒 ГРУЗИТСЯ ЛЕНИВО. Файл вытягивается отдельным куском только когда человек
// нажал (`swap.client.tsx` берёт его через `lazy`). Первый экран не платит за
// `motion` ни байтом — а платил бы, будь импорт обычным.
//
// 🔒 «УМЕНЬШИТЬ ДВИЖЕНИЕ» УВАЖАЕТСЯ. При системной настройке подмена всё равно
// происходит (нажатие обязано что-то сделать), но версия остаётся неподвижной:
// вращение и пульсация выключены. Головокружение от движения на экране — не
// метафора, а диагноз.

import { motion, useReducedMotion } from "motion/react"
import { Frame, Orbit, Card, SWEEP_STYLE } from "./parts"
import type { SecurityOrbitUi } from "./ui.i18n"

export default function SecurityAnimated({ ui }: { ui: SecurityOrbitUi }) {
  const still = useReducedMotion()

  // Сектор кольца: один оборот за восемнадцать секунд. Медленно намеренно —
  // элемент стоит за текстом, и быстрое вращение мешало бы читать.
  const sweep = () =>
    still ? undefined : (
      <motion.div
        aria-hidden
        className="absolute inset-[8%] rounded-full"
        style={SWEEP_STYLE}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
    )

  return (
    <Frame
      ui={ui}
      orbit={() => (
        <Orbit
          sweep={sweep()}
          Wrapper={motion.div}
          wrapperProps={
            still
              ? {}
              : {
                  animate: { scale: [1, 1.035, 1] },
                  transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                }
          }
        />
      )}
      card={i => (
        <Card
          card={ui.cards[i]}
          index={i}
          Wrapper={motion.div}
          wrapperProps={
            still
              ? {}
              : {
                  whileHover: { y: -4 },
                  transition: { type: "spring", stiffness: 260, damping: 22 },
                }
          }
        />
      )}
    />
  )
}
