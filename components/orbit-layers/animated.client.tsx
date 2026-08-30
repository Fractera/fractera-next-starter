"use client"

// АНИМИРОВАННАЯ ВЕРСИЯ — приходит после пробуждения и подменяет близнеца.
//
// 🔒 ПОЧЕМУ ПОДМЕНА НЕ ВИДНА. Разметка у обеих версий общая (`parts.tsx`), а
// движение объявлено `animate`, без `initial`: `motion` начинает с ТЕКУЩЕГО
// состояния элемента, ничего не сбрасывая. Появления «из прозрачности» здесь нет
// намеренно — оно и было бы мельканием.
//
// 🔒 ГРУЗИТСЯ ЛЕНИВО. Файл вытягивается отдельным куском только когда человек
// разбудил вид (`swap.client.tsx` берёт его через `lazy`). Первый экран не
// платит за `motion` ни байтом — а платил бы, будь импорт обычным.
//
// 🔒 «УМЕНЬШИТЬ ДВИЖЕНИЕ» УВАЖАЕТСЯ. При системной настройке подмена всё равно
// происходит, но версия остаётся неподвижной: вращение и пульсация выключены.

import { motion, useReducedMotion } from "motion/react"
import { Frame, Orbit, Card, SWEEP_STYLE, type OrbitLayersUi } from "./parts"

export default function OrbitLayersAnimated({ ui }: { ui: OrbitLayersUi }) {
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
          core={ui.core}
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
          // 🔒 ПОДЪЁМА ПРИ НАВЕДЕНИИ ЗДЕСЬ НЕТ — И ЭТО НЕ ЗАБЫВЧИВОСТЬ. Карточка
          // уже приподнимается в свой такт классом `flow-card`, а тот двигает
          // `transform` ключевыми кадрами; кадры сильнее инлайнового стиля, и
          // `whileHover` был бы проглочен молча. Одно движение — один хозяин.
          wrapperProps={{}}
        />
      )}
    />
  )
}
