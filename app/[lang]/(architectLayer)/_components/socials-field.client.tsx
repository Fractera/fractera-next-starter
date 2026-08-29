"use client"

import { ChevronDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Small } from "@/components/ui/typography"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { socialHref, type SocialLink } from "@/config/app-config.defaults"
import { SOCIAL_BRANDS, isUploadedIcon } from "@/lib/socials/catalogue"
import { socialIcon } from "@/components/icons/socials"
import { SocialsAiDialog } from "@/_tools/socials-ai/client/socials-ai-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import type { FieldsUi } from "../_i18n/fields.i18n"

// КОНСТРУКТОР СОЦСЕТЕЙ (31-7, 2026-08-28). Колонка значка — 31-26, 2026-08-29.
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
// 🔒 `id` ЗАПИСИ ВЕЧНЫЙ, НО ЗНАЧОК НА НЁМ БОЛЬШЕ НЕ ДЕРЖИТСЯ — и это исправление
// настоящего дефекта, а не косметика. Подвал сайта выбирал встроенный значок по
// `link.id`, а `id` новой записи рождается как `s<время>`: совпасть с `github` он не
// может НИКОГДА, и каждая заведённая владельцем сеть получала запасной кубик.
// Теперь значок выбирается явно и живёт в поле `icon`.
//
// 🔒 ВЫБОР ЗНАЧКА СТОИТ ПЕРВЫМ СЛЕВА (решение владельца 2026-08-29). Он и есть
// опознавательный знак строки: глазами ряд читается по значкам, а не по подписям.
export function SocialsField({
  value,
  disabled,
  onChange,
  ui,
  lang,
  dialogUi,
}: {
  /** Список в виде строки JSON: движок держит все значения полей строками. */
  value: string
  disabled?: boolean
  onChange: (next: string) => void
  ui: FieldsUi
  /** Язык страницы — для слов инструмента и подсказки модели. */
  lang: string
  dialogUi: AppDialogUi
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

  // 🔒 ВЫБОР СЕТИ ЗАПОЛНЯЕТ ПУСТОЕ И НЕ ТРОГАЕТ ЗАПОЛНЕННОЕ. Человек, выбравший
  // «GitHub» в пустой строке, ждёт готовую запись, а не три поля для ручного
  // заполнения. Но тот, кто выбрал значок к уже настроенной сети, ждёт, что его
  // шаблон останется: молча переписать введённый адрес — потерять работу без
  // предупреждения.
  function pickBrand(index: number, key: string) {
    const brand = SOCIAL_BRANDS.find(b => b.key === key)
    const link = links[index]
    if (!brand) {
      patch(index, { icon: undefined })
      return
    }
    patch(index, {
      icon: brand.key,
      name: link.name?.trim() ? link.name : brand.name,
      urlTemplate: link.urlTemplate?.trim() ? link.urlTemplate : brand.urlTemplate,
    })
  }

  return (
    <div data-socials-field className="flex flex-col gap-4">
      {links.length === 0 && <Small>{ui.socialsEmpty}</Small>}

      {links.map((link, index) => {
        // Загруженная картинка остаётся картинкой: поле `icon` держит две формы, и
        // выбор из списка не отменяет прежнюю возможность положить свой файл.
        const uploaded = isUploadedIcon(link.icon)
        const Icon = socialIcon(uploaded ? undefined : link.icon)
        return (
          <div key={link.id || index} data-social-row className="rounded-md border border-border p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr_1fr_1fr]">
              <div className="flex flex-col gap-1">
                <Label className="text-[length:var(--fs-small)]">{ui.socialIcon}</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      data-social-icon={link.icon ?? ""}
                      aria-label={ui.socialIcon}
                      className="h-10 w-full justify-between gap-2 px-3 md:w-auto"
                    >
                      {uploaded ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={link.icon} alt="" aria-hidden className="size-5 object-contain" />
                      ) : (
                        <Icon className="size-5" />
                      )}
                      <ChevronDown className="size-4 opacity-60" aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
                    {SOCIAL_BRANDS.map(brand => {
                      const BrandIcon = socialIcon(brand.key)
                      return (
                        <DropdownMenuItem
                          key={brand.key}
                          data-social-icon-option={brand.key}
                          onSelect={() => pickBrand(index, brand.key)}
                          className="gap-2"
                        >
                          <BrandIcon className="size-4" />
                          {brand.name}
                        </DropdownMenuItem>
                      )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      data-social-icon-option="none"
                      onSelect={() => pickBrand(index, "")}
                      className="gap-2"
                    >
                      {ui.socialIconNone}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[length:var(--fs-small)]">{ui.socialName}</Label>
                <Input
                  value={link.name ?? ""}
                  disabled={disabled}
                  onChange={e => patch(index, { name: e.target.value })}
                  className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[length:var(--fs-small)]">{ui.socialValue}</Label>
                <Input
                  value={link.value ?? ""}
                  disabled={disabled}
                  placeholder="@handle"
                  onChange={e => patch(index, { value: e.target.value })}
                  className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[length:var(--fs-small)]">{ui.socialTemplate}</Label>
                <Input
                  value={link.urlTemplate ?? ""}
                  disabled={disabled}
                  placeholder="https://t.me/{value}"
                  onChange={e => patch(index, { urlTemplate: e.target.value })}
                  className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
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
        )
      })}

      {/* 🔒 ДВЕ КНОПКИ РЯДОМ, А НЕ ОДНА С РЕЖИМАМИ (решение владельца 2026-08-29).
          Ручное добавление обязано остаться первым и работать без ключа модели:
          помощник необязателен, а сети заводят всегда. */}
      <div className="flex flex-wrap items-center gap-2">
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
        <SocialsAiDialog
          lang={lang}
          ui={ui.ai}
          dialogUi={dialogUi}
          disabled={disabled}
          onAdd={link =>
            write([
              ...links,
              { id: `s${Date.now()}`, name: link.name, value: link.value, urlTemplate: link.urlTemplate, icon: link.icon },
            ])
          }
        />
      </div>
    </div>
  )
}
