"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ВРЕМЯ СТРОКИ РАЗБОРА: ЧАСЫ НА ЭКРАНЕ, ДАТА ПОД КУРСОРОМ (91-6, правка владельца).
//
// 🔒 ДАТА УБРАНА ИЗ КОЛОНКИ ПО ЕГО ПРЯМОМУ СЛОВУ: «время сжимай таким образом
// чтобы было видно только часы минуты секунды и миллисекунды, дату показывают
// только при наведении». Разбор живёт минуты — в колонке дата повторяется в
// каждой строке и не различает ничего, а миллисекунды различают.
//
// 🔒 ОСТРОВОК, А НЕ АТРИБУТ `title`. Свой всплывающий текст браузера выглядит
// чужим в проекте, где у подсказки есть хозяин (`components/ui/tooltip`), и
// правило «одна реализация на род вещи» здесь то же, что у модальных окон.
//
// 🛑 `UTC` УБРАН ВОВСЕ — тоже его слово. Метка времени остаётся в `dateTime`
// разметки: машине она нужна целиком, человеку в колонке — нет.

/** Часы, минуты, секунды и миллисекунды. Дата — в подсказке. */
function clock(iso: string): string {
  return iso.slice(11, 23)
}

/** Полная дата и время — то, что видно при наведении. */
function full(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 23)}`
}

export function TaskTime({ at }: { at: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <time dateTime={at} className="cursor-default">
            {clock(at)}
          </time>
        </TooltipTrigger>
        <TooltipContent>{full(at)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
