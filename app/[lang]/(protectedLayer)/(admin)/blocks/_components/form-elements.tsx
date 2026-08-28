import { H2, P, Small } from "@/components/ui/typography"
import { voiceStrings } from "@/lib/i18n/voice-field.i18n"

// ОБМЕН ПЕРЕВОДАМИ ЭЛЕМЕНТОВ ФОРМЫ — рамка с двумя командами (32-6, сужена 32-9).
//
// 🔒 ЖИВЫХ ЭЛЕМЕНТОВ ЗДЕСЬ БОЛЬШЕ НЕТ, И ЭТО ИСПРАВЛЕНИЕ ОШИБКИ, А НЕ ПЕРЕЕЗД.
// В 32-6 я нарисовал их тут руками, потому что вида каталога у них не было. С
// 32-9 вид есть (`voiceField`), и оба элемента рисует НАСТОЯЩИЙ рендерер в общем
// списке образцов ниже. Оставить рукописную пару значило бы держать на одной
// странице два изображения одного и того же — и правка одного из них молча
// разошлась бы со вторым, ровно как расходятся любые две копии.
//
// 🔒 РАМКА ОСТАЁТСЯ, ПОТОМУ ЧТО ОНА ПРО СЛОВАРЬ, А НЕ ПРО ЭЛЕМЕНТ. Владелец
// просил: «сообщи, где я могу открыть и получить пример реализации с двумя
// языками, чтобы самостоятельно масштабировать его без твоего участия». Ссылка на
// документ этого не даёт — команду надо видеть там же, где видишь результат.
//
// 🔒 РАЗДЕЛИТЕЛЬ `--` В КОМАНДЕ ОБЯЗАТЕЛЕН И НЕ ЯВЛЯЕТСЯ ОПЕЧАТКОЙ. Без него npm
// съедает всё после имени скрипта, и выгрузка честно отвечает «нет целевых
// языков». Я споткнулся об это первым же вызовом (32-4); владелец споткнулся бы
// вторым.
const EXPORT_CMD = "npm run i18n:export -- voice-field --langs es,fr,de,it,pt,pl,tr,nl"
const IMPORT_CMD = "npm run i18n:import -- voice-field <файл-ответа.json>"

export function FormElements({ lang }: { lang: string }) {
  const words = voiceStrings(lang)

  return (
    <section data-form-elements className="flex flex-col gap-3 rounded-2xl border border-dashed border-border p-6">
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
    </section>
  )
}
