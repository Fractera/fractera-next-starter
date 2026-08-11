import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// shadcn/ui Pagination — стандартный компонент набора, его в проекте не было.
// Добавлен целиком, без правок формы: самопис под ту же задачу разошёлся бы с
// остальным интерфейсом, а закон проекта требует один набор примитивов.
//
// Ссылки, а не кнопки: страница списка адресуема, и переход по ней обязан
// работать средним щелчком и с выключенным JS там, где список серверный.

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  // Промежуток крошечный намеренно: четыре стрелки, номер страницы и выбор
  // шага стоят в одну строку и обязаны помещаться на телефоне.
  return <ul className={cn("flex flex-row items-center gap-0.5", className)} {...props} />
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  size?: "default" | "sm" | "lg" | "icon"
} & React.ComponentProps<"a">

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        "size-8 cursor-pointer sm:size-9",
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, label, ...props }: React.ComponentProps<typeof PaginationLink> & { label?: string }) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 px-1.5 sm:px-2.5", className)} {...props}>
      <ChevronLeft />
      {label && <span className="hidden sm:block">{label}</span>}
    </PaginationLink>
  )
}

function PaginationNext({ className, label, ...props }: React.ComponentProps<typeof PaginationLink> & { label?: string }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 px-1.5 sm:px-2.5", className)} {...props}>
      {label && <span className="hidden sm:block">{label}</span>}
      <ChevronRight />
    </PaginationLink>
  )
}

// Края списка — «в начало» и «в конец». Одного шага мало: на сотне страниц
// вернуться к первой можно было только сотней нажатий. Двойная стрелка —
// узнаваемая форма этого действия, поэтому иконка, а не слово.
function PaginationFirst({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" className={cn(className)} {...props}>
      <ChevronsLeft />
    </PaginationLink>
  )
}

function PaginationLast({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to last page" className={cn(className)} {...props}>
      <ChevronsRight />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden className={cn("flex size-9 items-center justify-center", className)} {...props}>
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
}
