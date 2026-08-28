"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Small } from "@/components/ui/typography"
import { socialHref, type SocialLink } from "@/config/app-config.defaults"
import type { FieldsUi } from "../_i18n/fields.i18n"

// КОНСТРУКТОР СОЦСЕТЕЙ (31-7, 2026-08-28).
//
// 🔒 ЗАПИСЬ НЕСЁТ ПРАВИЛО ВМЕСТЕ СО ЗНАЧЕНИЕМ. Раньше в настройках стояли четыре
// поля с зашитыми сетями, и пятая не добавлялась вовсе; а свободное поле не знало,
// как собрать адрес, — владелец вводил псевдоним и молча получал нерабочую ссылку.
// Поэтому у каждой записи есть `urlTemplate` (`https://t.me/{value}`), и адрес
// СЧИТАЕТСЯ, а не угадывается. Правило считает `socialHref()` — та же функция, что
// рисует ссылки в подвале сайта: два места, считающие адрес по-разному, разойдутся.
//
// 🔒 БЕЗ `{value}` ШАБЛОН СЧИТАЕТСЯ ПОЛНЫМ АДРЕСОМ — так выражается сеть без
// предсказуемой формы профиля. Это не особый случай в коде, а свойство записи.
//
// 🔒 `id` ЗАПИСИ ВЕЧНЫЙ. На нём держатся порядок и значок; менять его при правке
// имени значило бы терять значок и место в ряду при каждой опечатке.
export function SocialsField({
  value,
  disabled,
  onChange,
  ui,
}: {
  /** Список в виде строки JSON: движок держит все значения полей строками. */
  value: string
  disabled?: boolean
  onChange: (next: string) => void
  ui: FieldsUi
}) {
  let links: SocialLink[] = []
  try {
    const parsed: unknown = JSON.parse(value || "[]")
    if (Array.isArray(parsed)) links = parsed as SocialLink[]
  } catch {
    links = []
  }

  const write = (next: SocialLink[]) => onChange(JSON.stringify(next))

  const patch = (index: number, part: Partial<SocialLink>) =>
    write(links.map((l, i) => (i === index ? { ...l, ...part } : l)))

  return (
    <div data-socials-field className="flex flex-col gap-4">
      {links.length === 0 && <Small>{ui.socialsEmpty}</Small>}

      {links.map((link, index) => (
        <div key={link.id || index} data-social-row className="rounded-md border border-border p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Label className="text-[length:var(--fs-small)]">{ui.socialName}</Label>
              <Input
                value={link.name ?? ""}
                disabled={disabled}
                onChange={e => patch(index, { name: e.target.value })}
                className="text-[length:var(--fs-body)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[length:var(--fs-small)]">{ui.socialValue}</Label>
              <Input
                value={link.value ?? ""}
                disabled={disabled}
                placeholder="@handle"
                onChange={e => patch(index, { value: e.target.value })}
                className="text-[length:var(--fs-body)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[length:var(--fs-small)]">{ui.socialTemplate}</Label>
              <Input
                value={link.urlTemplate ?? ""}
                disabled={disabled}
                placeholder="https://t.me/{value}"
                onChange={e => patch(index, { urlTemplate: e.target.value })}
                className="text-[length:var(--fs-body)]"
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            {/* Итоговый адрес показывается сразу: правило, посчитанное на глазах,
                избавляет от «сохранил и пошёл проверять в подвал». */}
            <Small data-social-href className="truncate">
              {link.urlTemplate ? socialHref(link) : ""}
            </Small>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => write(links.filter((_, i) => i !== index))}
              aria-label={ui.socialRemove}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ))}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          data-social-add
          onClick={() =>
            write([
              ...links,
              // `id` рождается из времени: он лишь обязан быть уникальным и вечным,
              // и человеку никогда не показывается.
              { id: `s${Date.now()}`, name: "", value: "", urlTemplate: "" },
            ])
          }
        >
          <Plus className="size-4" aria-hidden />
          {ui.socialAdd}
        </Button>
      </div>
    </div>
  )
}
