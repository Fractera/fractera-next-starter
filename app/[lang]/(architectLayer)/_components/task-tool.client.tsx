"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// КОЛОНКА «ИНСТРУМЕНТ»: ИМЯ НА ЭКРАНЕ, УМЕНИЕ ПОД КУРСОРОМ (правка владельца).
//
// 🔒 ЕГО СЛОВА: «всегда на вкладке инструмент мы наводим курсор и читаем его
// описание — что этот инструмент умеет делать». Имя без описания не отличает
// один инструмент от другого: их будет много, и все с похожими именами.
//
// 🔒 «МОДЕЛЬ» ИМЕНЕМ ИНСТРУМЕНТА НЕ БЫВАЕТ. Модель — то, чем инструмент внутри
// пользуется; в колонке стоит имя того, кто СДЕЛАЛ строку.

export function TaskTool({ name, what }: { name: string; what?: string }) {
  if (!name) return null
  if (!what) return <span className="whitespace-nowrap">{name}</span>

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help whitespace-nowrap underline decoration-dotted underline-offset-4">
            {name}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm whitespace-pre-wrap">{what}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
