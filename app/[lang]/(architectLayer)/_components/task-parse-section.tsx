import { SectionIntro } from "./section-intro.client"
import type { TelegramUi } from "../_i18n/telegram.i18n"
import type { ChannelsState } from "@/lib/architect/channels"

// ВИД «РАЗБОР ЗАПРОСА» — ПЕРВЫЙ В ВЕРХНЕМ РЯДУ РАЗДЕЛА «ЛОГИ» (91-1).
//
// 🔒 ЭКРАН ПОКАЗЫВАЕТ ХОД РАССУЖДЕНИЯ, А НЕ ИТОГ, И ЭТО ЕГО СМЫСЛ. Требование
// владельца 2026-09-01: «вернёт последовательность принятых решений». Итог без
// основания — вердикт, с которым нечем спорить; а спорить придётся, потому что
// разбор идёт многократными вызовами модели и ошибается там, где ошибается.
//
// 🔒 ВКЛАДКА ОБЯЗАНА ОБЪЯСНЯТЬ СОБОЙ. Его же слова: «вкладку которая в своем
// описании подробно расскажет что здесь происходит». Таблица без объяснения
// читается как отчёт; здесь же показано, КАК думали, и без слов это технический
// мусор. Справка берётся общая на слой — третий экземпляр разошёлся бы с первыми
// двумя на первой правке текста.
//
// 🪦 НА ЭТОМ МЕСТЕ БЫЛА ЛЕНТА ПОСЛЕДНИХ 500 ВХОДЯЩИХ (80-6). Заменена целиком по
// прямому слову владельца: «Заменить ленту совсем». 🛑 Цена: вопрос «что бот
// слышал вчера» с этого экрана ответа больше не имеет — здесь всегда ТЕКУЩИЙ
// запрос и только он.

/** Что показывать вместо таблицы и почему. Порядок проверок — от внешнего к внутреннему. */
function emptyReason(state: ChannelsState, ui: TelegramUi): { key: string; text: string } {
  // 🔒 ПРИЧИН ТРИ, И ОНИ ЛЕЧАТСЯ ПО-РАЗНОМУ. «Ничего нет» выглядит одинаково при
  // мёртвой службе, непривязанном боте и просто молчании — а человеку в этих
  // трёх случаях надо делать разное. Молчание вместо причины читается как
  // поломка продукта, а не как «рано» (закон 28-13).
  if (!state.available) return { key: "service-down", text: ui.parse.emptyServiceDown }
  if (!state.telegram?.chatId) return { key: "not-linked", text: ui.parse.emptyNotLinked }
  return { key: "no-requests", text: ui.parse.emptyNoRequests }
}

export function TaskParseSection({ state, ui }: { state: ChannelsState; ui: TelegramUi }) {
  const empty = emptyReason(state, ui)

  return (
    <section data-task-parse className="flex flex-col gap-6">
      <SectionIntro
        name="task-parse"
        summary={ui.parse.summary}
        rest={
          // 🔒 АБЗАЦЫ РАЗДЕЛЯЮТСЯ ЗДЕСЬ, А НЕ В СЛОВАРЕ РАЗМЕТКОЙ. Словарь несёт
          // текст, а не вёрстку: строка с тегами внутри переводится хуже и
          // ломается тише.
          <>
            {ui.parse.details.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </>
        }
        moreLabel={ui.facts.more}
        lessLabel={ui.facts.less}
      />

      {/* 🔒 ПУСТОЕ СОСТОЯНИЕ НЕСЁТ СВОЙ КЛЮЧ В РАЗМЕТКЕ, А НЕ ТОЛЬКО ТЕКСТ.
          Текст переводится и меняется; ключ — то, по чему причина проверяется
          измерением, не завися от языка страницы. */}
      <div
        data-task-parse-empty={empty.key}
        className="rounded-md border border-dashed border-muted-foreground/30 p-6 text-[length:var(--fs-small)] text-muted-foreground"
      >
        {empty.text}
      </div>
    </section>
  )
}
