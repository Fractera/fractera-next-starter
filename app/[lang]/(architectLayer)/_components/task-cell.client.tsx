"use client"

import { useState } from "react"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageResponse } from "@/components/ai-elements/message"

// ЯЧЕЙКА ТАБЛИЦЫ РАЗБОРА — ОДНА СТРОКА, ПОДСКАЗКА, ОКНО (правка владельца).
//
// 🔒 СТАНДАРТ ОДИН НА ТРИ КОЛОНКИ — «Выход», «Инструкция», «Экшен». Его слова:
// «максимальное количество символов, одна строка; при наведении показываешь
// тултип такой же, как для времени; внизу кнопка "посмотреть всё" — открываешь
// модальное окно, весь текст с Markdown-разметкой и вертикальной прокруткой».
//
// ✗ ОПЛАЧЕНО ТЕМ, ЧТО Я СДЕЛАЛ ИНАЧЕ: под фразой печаталась вторая строка с
// разобранными значениями. Владелец запретил это прямо — строка таблицы обязана
// быть строкой, а не абзацем, иначе таблица перестаёт читаться взглядом.
//
// 🔒 ОКНО БЕРЁТСЯ ГОТОВОЕ (`AppDialog`), А НЕ СОБИРАЕТСЯ ИЗ ПРИМИТИВА: у
// модального окна в проекте один хозяин, и прокрутка длинного тела живёт в нём.

/** Длиннее этого — есть что открывать в окне. */
const LONG = 60

export function TaskCell({
  text,
  title,
  ui,
  viewAll,
}: {
  text: string
  /** Заголовок окна: имя колонки, из которой его открыли. */
  title: string
  ui: AppDialogUi
  viewAll: string
}) {
  const [open, setOpen] = useState(false)
  if (!text) return null
  const long = text.length > LONG

  return (
    <div className="min-w-0 max-w-[36rem]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* 🔒 ОДНА СТРОКА: перенос запрещён, хвост срезается многоточием.
                Ширина ограничена, иначе длинный текст растягивает всю таблицу. */}
            <div className="truncate">{text}</div>
          </TooltipTrigger>
          {/* Подсказка та же, что у времени: полный текст под курсором. */}
          <TooltipContent className="max-w-md whitespace-pre-wrap">{text}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {long ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-1 text-[0.85em] underline underline-offset-2 hover:no-underline"
          >
            {viewAll}
          </button>
          <AppDialog open={open} onOpenChange={setOpen} title={title} ui={ui} size="xl">
            {/* Markdown и вертикальная прокрутка — тело окна прокручивается само. */}
            <MessageResponse>{text}</MessageResponse>
          </AppDialog>
        </>
      ) : null}
    </div>
  )
}
