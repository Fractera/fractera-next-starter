"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Переключатель — shadcn поверх `radix-ui` (шаг 31-4, 2026-08-28).
//
// 🔒 ЗАВЕДЁН ПОТОМУ, ЧТО ЕГО НЕ БЫЛО, а поля-переключатели в конфиге есть
// (`analytics.enabled`, три схемы `jsonLd.*`). Владелец видел это сам: «на вкладке
// Blocks я не видел подходящих блоков, которые имеют Input». Каталог блоков
// презентационный, а из элементов формы в проекте были `input`, `textarea`,
// `select`, `checkbox` и `label` — переключателя не было ни одного.
//
// 🔒 ЧЕКБОКС ЕГО НЕ ЗАМЕНЯЕТ, И РАЗНИЦА СОДЕРЖАТЕЛЬНАЯ. Галочка означает «я
// подтверждаю» и живёт в форме, которую отправляют; переключатель означает
// «включено сейчас» и меняет состояние сразу. Настройка — второе.
//
// Импорт из общего пакета `radix-ui`, как у всех соседей по `components/ui`:
// отдельный `@radix-ui/react-switch` притащил бы вторую копию тех же примитивов.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
