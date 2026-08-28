import { H2, P, Small } from "@/components/ui/typography"
import { voiceStrings } from "@/lib/i18n/voice-field.i18n"
import { FormElementsSpecimen } from "./form-elements.client"

// СЕКЦИЯ «ЭЛЕМЕНТЫ ФОРМЫ» НА СТРАНИЦЕ КАТАЛОГА (шаг 32-6, 2026-08-28).
//
// 🔒 ЭТО ОБРАЗЕЦ, А НЕ ВИД БЛОКА — решение владельца. В каталоге 44 вида, и все
// они КОНТЕНТ: текст, таблицы, карточки. Поле ввода — первая вещь, которая
// что-то ПРИНИМАЕТ от человека, и на публичной странице ему нечего сохранять.
// Поэтому элементы живут в `components/form/` как части форм, а здесь стоит их
// живой образец: место, где владелец смотрит и проверяет.
//
// 🔒 ДВЕ КОМАНДЫ ОБМЕНА — ЧАСТЬ ОБРАЗЦА, А НЕ ССЫЛКА НА ДОКУМЕНТАЦИЮ. Владелец
// просил: «сообщи, где я могу открыть и получить пример реализации с двумя
// языками, чтобы самостоятельно масштабировать его без твоего участия». Ссылка
// на документ этого не даёт — команду надо видеть там же, где видишь результат.
//
// 🔒 РАЗДЕЛИТЕЛЬ `--` В КОМАНДЕ ОБЯЗАТЕЛЕН, И ОН ЗДЕСЬ НЕ ОПЕЧАТКА. Без него npm
// съедает всё после имени скрипта, и выгрузка честно отвечает «нет целевых
// языков». Я споткнулся об это первым же вызовом (32-4); владелец споткнулся бы
// вторым.
const EXPORT_CMD = "npm run i18n:export -- voice-field --langs es,fr,de,it,pt,pl,tr,nl"
const IMPORT_CMD = "npm run i18n:import -- voice-field <файл-ответа.json>"

export function FormElements({ lang }: { lang: string }) {
  const words = voiceStrings(lang)

  return (
    <section data-form-elements className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-l-2 border-primary/40 pl-4">
        <H2 variant="ui">{words.specimenTitle}</H2>
        <P className="max-w-3xl">{words.specimenNote}</P>
      </div>

      <FormElementsSpecimen lang={lang} words={words} />

      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border p-6">
        <H2 variant="ui" className="text-[length:var(--fs-h3)]">{words.specimenI18nTitle}</H2>
        <P className="max-w-3xl">{words.specimenI18nNote}</P>
        <div className="flex flex-col gap-2">
          {[EXPORT_CMD, IMPORT_CMD].map(cmd => (
            <code
              key={cmd}
              data-i18n-command
              className="block overflow-x-auto rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-[length:var(--fs-small)] text-foreground"
            >
              {cmd}
            </code>
          ))}
        </div>
        {/* Путь к словарю — машинная строка: она не переводится, потому что это
            адрес файла, а не обращение к человеку. */}
        <Small className="font-mono">lib/i18n/voice-field.i18n.json</Small>
      </div>
    </section>
  )
}
