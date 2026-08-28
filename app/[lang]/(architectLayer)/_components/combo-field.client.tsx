"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// СПИСОК С ВОЗМОЖНОСТЬЮ СВОЕГО ЗНАЧЕНИЯ (32-10, решение владельца 2026-08-28).
//
// 🔒 ЗАЧЕМ ТРЕТИЙ ВИД ПОЛЯ, КОГДА ЕСТЬ СПИСОК И ЕСТЬ ВВОД. Дословно: «должны
// получить выпадающий список… например четыре основные валюты, но также
// возможность текстового ввода». Ни один из двух существующих видов этого не
// делает: `select` запер бы проект в четырёх странах, а голое поле оставило бы
// человека вспоминать, что код валюты — три заглавные буквы по ISO 4217. «Евро»
// вместо «EUR» ломает разметку товара молча: поисковик отвергает карточку с ценой
// целиком, и узнают об этом по пропавшему товару, а не по сообщению.
//
// 🔒 КНОПКИ, А НЕ РАСКРЫВАЮЩИЙСЯ СПИСОК. Вариантов четыре, и все они умещаются в
// строку: раскрывающийся список прятал бы за щелчком ровно то, ради чего он здесь.
// Заодно видно СРАЗУ, что выбрано, — у `select` это читается только развернув его.
//
// 🔒 ПОЛЕ ВВОДА ВИДНО ВСЕГДА, А НЕ ПОЯВЛЯЕТСЯ ПО КНОПКЕ «ДРУГОЕ». Спрятанный ввод
// читается как «другого не бывает»: человек с гривной или тенге решит, что список
// закрыт, — и уйдёт искать настройку, которой нет.
export function ComboField({
  id,
  value,
  options,
  optionLabels,
  placeholder,
  disabled,
  onChange,
}: {
  id: string
  value: string
  /** Значения, уходящие в конфиг: их не переводят никогда. */
  options: readonly string[]
  /** Подписи вариантов — человеческий текст, если он у варианта есть. */
  optionLabels?: Record<string, string>
  placeholder?: string
  disabled?: boolean
  onChange: (next: string) => void
}) {
  return (
    <div data-combo-field className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const chosen = value === option
          return (
            <Button
              key={option}
              type="button"
              variant={chosen ? "default" : "outline"}
              disabled={disabled}
              data-combo-option={option}
              data-chosen={chosen ? "true" : "false"}
              // Повторный щелчок по выбранному снимает выбор: иначе поставленную
              // случайно валюту нельзя стереть, не выделяя текст в поле руками.
              onClick={() => onChange(chosen ? "" : option)}
              className="h-10 px-4 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            >
              {optionLabels?.[option] ?? option}
            </Button>
          )
        })}
      </div>

      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="h-10 text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
      />
    </div>
  )
}
