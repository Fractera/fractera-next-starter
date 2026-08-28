"use client"

import { Input } from "@/components/ui/input"

// ПОЛЕ ЦВЕТА: ОБРАЗЕЦ, ПАЛИТРА БРАУЗЕРА И ТЕ ЖЕ ШЕСТНАДЦАТЬ ЗНАКОВ (32-10).
//
// 🔒 ЦВЕТ ХРАНИТСЯ СТРОКОЙ И ПРИ ЭТОМ НЕ ЯВЛЯЕТСЯ ТЕКСТОМ. Человек не помнит, что
// светло-серый — это `#f4f4f5`; он его УЗНАЁТ. Поле, где цвет только пишут,
// заставляет держать в голове то, что глаз проверяет за долю секунды, — а ошибка
// здесь не видна вовсе: `#09090b` и `#090b09` набираются одинаково легко.
//
// 🔒 ОБРАЗЕЦ — ЭТО НАСТОЯЩИЙ `input type="color"`, А НЕ КВАДРАТИК РЯДОМ. Он
// открывает палитру операционной системы: пипетка, недавние цвета, ползунки. Своя
// палитра была бы худшей копией той, к которой человек привык.
//
// 🔒 ТЕКСТОВОЕ ПОЛЕ ОСТАЁТСЯ И СТОИТ ПЕРВЫМ ПО ВАЖНОСТИ. Цвет чаще всего приходит
// из макета — его ВСТАВЛЯЮТ из буфера, а не подбирают заново; палитра, оставшаяся
// единственным способом ввода, превратила бы вставку в подбор на глаз.
//
// 🔒 ПУСТОЕ ЗНАЧЕНИЕ ЗАКОННО, И ОБРАЗЕЦ ТОГДА ПОКАЗЫВАЕТ БЕЛЫЙ. Пустой цвет
// означает «настройки нет, работает умолчание проекта», и подставлять сюда что-то
// осмысленное нельзя: `input type="color"` не умеет быть пустым, и любое значение
// в нём выглядело бы выбором, которого человек не делал. Поэтому в конфиг уезжает
// то, что стоит в ТЕКСТОВОМ поле, а образец лишь показывает и предлагает.
export function ColorField({
  id,
  value,
  placeholder,
  disabled,
  onChange,
}: {
  id: string
  value: string
  placeholder?: string
  disabled?: boolean
  onChange: (next: string) => void
}) {
  // Палитра принимает только `#rrggbb`. Пришло сокращённое или пустое — показываем
  // белый, но НЕ пишем его в значение: показ и запись здесь разные вещи.
  const full = /^#[0-9a-fA-F]{6}$/.test(value)
  const short = /^#[0-9a-fA-F]{3}$/.test(value)
  const swatch = full
    ? value
    : short
      ? "#" + value.slice(1).split("").map(c => c + c).join("")
      : "#ffffff"

  return (
    <div data-color-field className="flex w-full items-center gap-2">
      <input
        type="color"
        aria-hidden
        tabIndex={-1}
        value={swatch}
        disabled={disabled}
        data-color-swatch
        onChange={e => onChange(e.target.value)}
        className="size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        onChange={e => onChange(e.target.value)}
        className="h-10 font-mono text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
      />
    </div>
  )
}
