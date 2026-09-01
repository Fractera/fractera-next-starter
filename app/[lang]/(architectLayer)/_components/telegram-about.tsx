import { Check, Minus, Info } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// РАЗДЕЛ «ОПИСАНИЕ» ВХОДА «TELEGRAM-БОТ» (77-6, 2026-09-01).
//
// 🔒 НАПИСАН ПО ПЕРВОИСТОЧНИКУ — КОДУ СЛУЖБЫ И ПРОДУКТА, — А НЕ ПО НАВЫКУ.
// Проверка трёх «общеизвестных» ограничений показала, что все три устарели:
//   • голос НЕ отбрасывается — `voiceToText()` службы его расшифровывает;
//   • push в проект ЕСТЬ — служба зовёт `/api/telegram/hook` с общим секретом;
//   • файл НЕ теряется — `branches/files.ts` кладёт его в медиатеку и читает.
// ✗ Все три были записаны в навыке `use-channels` как отсутствующие способности.
// **Устаревший закон опаснее отсутствующего:** он лежит ровно там, где кто-то
// строит, и заставляет обходить то, что работает.
//
// 🔒 «ЧЕГО НЕ УМЕЕТ» СТОИТ РЯДОМ С «УМЕЕТ» И НАПИСАН ПЕРВЫМ (закон шага 65):
// обещание, которого продукт не держит, человек проверяет в свой худший день.
//
// 🔒 ЗАГОЛОВКИ — ПРИМИТИВЫ, А НЕ КЛАССЫ РУКАМИ (гейт `check:typography`).

export function TelegramAbout({ ui }: { ui: TelegramUi }) {
  const a = ui.about

  return (
    <div data-telegram-about className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <H4 variant="ui">{a.canTitle}</H4>
        <ul className="flex flex-col gap-1.5">
          {a.can.map(line => (
            <li key={line} className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <Small className="leading-relaxed text-muted-foreground">{line}</Small>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <H4 variant="ui">{a.cannotTitle}</H4>
        <ul className="flex flex-col gap-1.5">
          {a.cannot.map(line => (
            <li key={line} className="flex items-start gap-2">
              <Minus className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <Small className="leading-relaxed text-muted-foreground">{line}</Small>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔒 ГРАНИЦА НОУТБУКА — ОДИН СПОКОЙНЫЙ БЛОК, А НЕ ТРЕВОГА. Тон тревоги на
          этом экране занят «Настройками»; один цвет тревоги на экран, иначе к
          третьему разу он не значит ничего (стандарт секции, шаг 28). */}
      <div
        data-telegram-about-boundary
        className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3"
      >
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-2">
          <Small className="leading-relaxed text-muted-foreground">
            <strong className="text-foreground">{a.boundaryTitle}</strong> {a.boundary}
          </Small>
          <Small className="leading-relaxed text-muted-foreground">
            <strong className="text-foreground">{a.startTitle}</strong> {a.start}
          </Small>
        </div>
      </div>
    </div>
  )
}
