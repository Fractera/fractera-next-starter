"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { AppDialogUi } from "./app-dialog.i18n"

// ЕДИНСТВЕННОЕ МОДАЛЬНОЕ ОКНО ПРОДУКТА. Всё, что открывается поверх страницы и
// требует внимания, собирается здесь; боковая панель — это `Sheet`, и она к
// этому файлу отношения не имеет.
//
// 🔒 ЗАЧЕМ ОБЁРТКА, ЕСЛИ ЕСТЬ shadcn `Dialog`. Затем, что примитив — это шесть
// деталей, и собирать их заново приходилось в каждом окне. К 2026-08-17 в
// приложении жили ВОСЕМЬ окон трёх разных пород: три на shadcn, два на `Sheet` и
// ТРИ СОБРАННЫХ РУКАМИ из голых `div` — без `role="dialog"`, без `aria-modal`,
// без ловушки фокуса, без Escape и без замка прокрутки. Ни одно из трёх не было
// доступно с клавиатуры, и ни одно из этого не видно на экране: окно выглядит
// правильным ровно до того момента, когда им пробуют пользоваться не мышью.
//
// 🔒 СЛОИ ПЕРЕКРЫТИЯ ПРИНАДЛЕЖАТ ПРИМИТИВУ, А НЕ ВЫЗЫВАЮЩЕМУ. Самописные окна
// назначали себе `z-[70]` и `z-[200]` кто во что горазд. Дефект такого рода уже
// случался в панели: два окна оказались открыты друг поверх друга, внешнее
// перехватывало нажатия внутреннего, и кнопки переставали работать вовсе.
// Здесь слой один — тот, что приносит shadcn, — и спорить в разметке нечему.
//
// 🔒 СЛОВА ПРИХОДЯТ ПРОПСАМИ, СЛОВАРЬ ОСТАЁТСЯ СЕРВЕРНЫМ. `ui` резолвит
// серверный компонент через `appDialogUi(lang)`; отсюда идёт только `import
// type`. Восемьдесят два языка × словарь в браузер на каждой странице — это
// сотни килобайт, и тот же закон действует в панели управления.

const SIZE = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
} as const

export type AppDialogSize = keyof typeof SIZE

export type AppDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Заголовок окна. Обязателен: окно без имени не читается голосом.
   * Допускается разметка — значок перед словом читалка пропускает, слово нет.
   */
  title: React.ReactNode
  /** Классы заголовка — например, тревожный цвет у отказа в доступе. */
  titleClassName?: string
  /** Пояснение под заголовком. Связывается с окном через `aria-describedby`. */
  description?: string
  /** Слова окна на языке страницы — резолвятся на сервере. */
  ui: AppDialogUi
  /**
   * Полоса под заголовком, которая НЕ прокручивается вместе с телом: вкладки,
   * кнопки действия над списком, сообщение об отказе. Без неё такие элементы
   * уезжают вверх при первой же прокрутке длинного списка — а именно к ним
   * человек возвращается чаще всего.
   */
  toolbar?: React.ReactNode
  /**
   * Подвал с кнопками. НЕ ПЕРЕДАН — окно содержит только крестик, и это
   * полноценный, часто правильный вид окна: справочное окно закрывают, а не
   * подтверждают.
   */
  footer?: React.ReactNode
  /**
   * `false` — окно нельзя закрыть ни крестиком, ни Escape, ни нажатием мимо.
   * Единственный законный случай — отказ в доступе, где закрытие оставило бы
   * человека на странице, которую ему нельзя видеть.
   */
  dismissible?: boolean
  size?: AppDialogSize
  /** Классы для прокручиваемого тела окна. */
  bodyClassName?: string
  /**
   * Классы подвала. По умолчанию подвал раскладывает КНОПКИ в строку; если туда
   * едет не ряд кнопок, а блок (итог заказа, например), раскладку переопределяют
   * здесь, а не разметкой внутри.
   */
  footerClassName?: string
  /**
   * Тело окна. НЕОБЯЗАТЕЛЬНО: вопрос вида «положить три штуки в заказ?»
   * укладывается в заголовок и пояснение целиком, и пустое тело нарисовало бы
   * полосу воздуха под ними — придуманную ради симметрии, а не ради смысла.
   */
  children?: React.ReactNode
}

export function AppDialog({
  open,
  onOpenChange,
  title,
  titleClassName,
  description,
  ui,
  toolbar,
  footer,
  dismissible = true,
  size = "md",
  bodyClassName,
  footerClassName,
  children,
}: AppDialogProps) {
  // Свой идентификатор нужен потому, что `DialogContent` по умолчанию гасит
  // `aria-describedby` (иначе Radix ругается на окна без пояснения). Пояснение
  // есть — значит связь надо восстановить руками, иначе читалка его не назовёт.
  const descId = React.useId()

  // Запрет закрытия — это ТРИ разных пути, а не один. Погасив только Escape,
  // получаем окно, которое всё равно закрывается нажатием мимо, и запрет
  // выглядит работающим ровно до первого промаха мышью.
  const block = dismissible
    ? undefined
    : (e: Event) => {
        e.preventDefault()
      }

  return (
    <Dialog open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <DialogContent
        className={cn("flex max-h-[85vh] flex-col gap-0 p-0", SIZE[size])}
        showCloseButton={dismissible}
        closeLabel={ui.close}
        aria-describedby={description ? descId : undefined}
        onEscapeKeyDown={block}
        onPointerDownOutside={block}
        onInteractOutside={block}
      >
        <DialogHeader className="shrink-0 gap-1 border-b border-border px-5 py-4 pr-12 text-left">
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && <DialogDescription id={descId}>{description}</DialogDescription>}
        </DialogHeader>

        {toolbar && <div className="shrink-0 border-b border-border px-5 py-3">{toolbar}</div>}

        {/* Прокручивается ТЕЛО, а не окно целиком: заголовок и подвал обязаны
            оставаться на месте, иначе на телефоне кнопка подтверждения уезжает
            за нижний край и до неё не добраться. */}
        {children !== undefined && (
          <div className={cn("min-h-0 flex-1 overflow-auto px-5 py-4", bodyClassName)}>
            {children}
          </div>
        )}

        {footer && (
          <DialogFooter className={cn("shrink-0 border-t border-border px-5 py-4", footerClassName)}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
