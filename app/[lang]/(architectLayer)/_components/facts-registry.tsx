import { Layers } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { SectionIntro } from "./section-intro.client"
import { FactsAdd } from "./facts-add.client"
import { allFacts } from "@/lib/facts/registry"
import { needsTable } from "@/lib/facts/table"
import type { Fact, FactLevel } from "@/lib/facts/types"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// КАРТОЧКА «РЕЕСТР ПРИЗНАКОВ» — четвёртой в разделе «Настройки» бота (81-3).
//
// 🔒 МЕСТО НАЗВАНО ВЛАДЕЛЬЦЕМ прямым ответом на прямой вопрос:
// `/{lang}/architect/telegram?section=settings`. Агент предлагал отдельный вход в
// слое архитектора и был поправлен.
//
// 🔒 ОПРЕДЕЛЕНИЕ ПОКАЗЫВАЕТСЯ ЧЕЛОВЕКУ, А НЕ ЖИВЁТ В КОММЕНТАРИИ. Правило,
// которое негде увидеть, исполняется по памяти — то есть не исполняется. Тот же
// закон, что у каталога модальных окон (шаг 62) и у карточек видов секций (51-1):
// комментарий читает тот, кто уже открыл файл, а карточку — каждый.
//
// 🔒 ПРИЗНАКИ ГРУППИРУЮТСЯ ПО УРОВНЮ, И УРОВЕНЬ ОТВЕЧАЕТ НА ВОПРОС «КОГДА ЭТО
// ИЗВЕСТНО». Плоский список из двадцати пяти строк ничего не объясняет: род входа
// известен до всякого разбора, намерение — после первого вызова модели, поле —
// после второго. Смешав их, мы обещали бы, что температура воздуха узнаётся так
// же, как «это голосовое».
//
// 🔒 КАРТОЧКА СЕРВЕРНАЯ, КЛИЕНТСКАЯ ТОЛЬКО ФОРМА (81-4). Список читается на
// сервере и приезжает готовой разметкой; в браузер уезжает лишь то, что обязано
// там жить, — поля ввода и обращение к двери. Тот же приём, что у ленты
// направлений: словари резолвятся на сервере, островок получает готовые строки.

const ORDER: FactLevel[] = ["material", "intent", "entity", "destination", "field"]

export async function FactsRegistrySection({ lang, ui }: { lang: string; ui: TelegramUi }) {
  const w = ui.facts
  const facts = await allFacts()
  const byLevel = new Map<FactLevel, Fact[]>()
  for (const f of facts) byLevel.set(f.level, [...(byLevel.get(f.level) ?? []), f])

  return (
    <div className="rounded-lg border border-border" data-facts-registry="ready">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <span className="flex flex-1 items-center gap-2">
          <Layers className="size-4 text-muted-foreground" />
          <H4 variant="ui">{w.title}</H4>
        </span>
        <Small data-facts-count className="text-muted-foreground">
          {w.counted.replace("{n}", String(facts.length))}
        </Small>
      </div>

      <div className="flex flex-col gap-4 p-3">
        <SectionIntro
          name="facts"
          summary={<Small className="leading-relaxed text-muted-foreground">{w.summary}</Small>}
          rest={<Small className="leading-relaxed text-muted-foreground">{w.rest}</Small>}
          moreLabel={w.more}
          lessLabel={w.less}
        />

        {/* 🔒 ФОРМА СТОИТ МЕЖДУ СПРАВКОЙ И СПИСКОМ, И ПОРЯДОК СМЫСЛОВОЙ:
            человек сперва читает, что такое признак, потом заводит свой, потом
            видит его среди встроенных. Кнопка внизу списка означала бы, что
            добавление — редкая операция; здесь она главная. */}
        <FactsAdd
          lang={lang}
          labels={{
            addTitle: w.addTitle,
            keyLabel: w.keyLabel,
            keyHint: w.keyHint,
            titleLabel: w.titleLabel,
            descriptionLabel: w.descriptionLabel,
            valueTypeLabel: w.valueTypeLabel,
            howToFindLabel: w.howToFindLabel,
            howToFindHint: w.howToFindHint,
            onMissingLabel: w.onMissingLabel,
            onMissing: w.onMissingWords,
            valueTypes: w.valueTypes,
            submit: w.submit,
            submitting: w.submitting,
            saved: w.savedWithTable,
            errors: w.errors,
            errorOther: w.errorOther,
            draftNotes: w.draftNotes,
            draft: {
              title: w.draftTitle,
              hint: w.draftHint,
              placeholder: w.draftPlaceholder,
              submit: w.draftSubmit,
              submitting: w.draftSubmitting,
              notesPrefix: w.draftNotes,
              failures: w.draftFailures,
            },
          }}
        />

        {ORDER.map(level => {
          const rows = byLevel.get(level) ?? []
          if (!rows.length) return null
          return (
            <section key={level} data-facts-level={level} className="flex flex-col gap-2">
              <Small className="font-medium text-foreground">{w.levels[level]}</Small>
              <ul className="flex flex-col gap-2">
                {rows.map(f => (
                  <FactRow key={f.key} fact={f} w={w} />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Одна запись реестра.
 *
 * 🔒 ПОКАЗЫВАЮТСЯ ВСЕ ПЯТЬ ЧАСТЕЙ, В ТОМ ЧИСЛЕ ИНСТРУКЦИЯ УЗНАВАНИЯ. Именно она
 * едет в модель и именно её человек будет писать сам — спрятав её, мы оставили бы
 * на экране красивый список без того, ради чего он существует.
 * 🔒 «ГДЕ ЖИВЁТ» НАЗЫВАЕТСЯ ВСЛУХ: у признака это его таблица, у связи — прямая
 * оговорка, что таблицы нет и почему.
 */
function FactRow({ fact, w }: { fact: Fact; w: TelegramUi["facts"] }) {
  return (
    <li
      data-facts-row={fact.key}
      className="flex flex-col gap-1 rounded-md border border-border p-2.5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-[length:var(--fs-small)] text-foreground">{fact.title}</span>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[length:var(--fs-small)] text-muted-foreground">
          {fact.key}
        </code>
        {fact.builtin && (
          <Small data-facts-builtin className="text-muted-foreground">
            {w.builtin}
          </Small>
        )}
        {fact.required && (
          <Small data-facts-required className="text-muted-foreground">
            {w.required}
          </Small>
        )}
      </div>

      {fact.description && (
        <Small className="leading-relaxed text-muted-foreground">{fact.description}</Small>
      )}

      <Small className="text-muted-foreground">
        {fact.howToFind}
      </Small>

      <Small data-facts-stored className="text-muted-foreground">
        {needsTable(fact) ? fact.storedIn : w.noTable}
      </Small>
    </li>
  )
}
