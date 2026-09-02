import { SectionIntro } from "./section-intro.client"
import { readTask } from "@/lib/task/store"
import type { RequestChannel } from "@/lib/task/types"
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

/**
 * Имя канала для показа.
 *
 * 🔒 ПОРОЖДАЕТСЯ ИЗ КЛЮЧА, А НЕ ПИШЕТСЯ ВТОРЫМ СПИСКОМ. Список каналов один —
 * `REQUEST_CHANNELS`; словарь имён рядом с ним разошёлся бы на первом же
 * добавленном канале, и экран назвал бы WhatsApp телеграмом.
 */
function channelName(c: RequestChannel): string {
  return c.charAt(0).toUpperCase() + c.slice(1)
}

/**
 * Метка времени: дата и время С МИЛЛИСЕКУНДАМИ.
 *
 * 🔒 МИЛЛИСЕКУНДЫ ПОКАЗЫВАЮТСЯ, А НЕ ТОЛЬКО ХРАНЯТСЯ — прямое требование
 * владельца. Отрезанные при показе, они неотличимы от неписанных.
 *
 * 🔒 UTC НАЗВАН ВСЛУХ И НЕ ПЕРЕВОДИТСЯ В МЕСТНОЕ ВРЕМЯ. Время, показанное без
 * пояса, читается как своё; сервер, человек и Telegram живут в разных поясах, и
 * молчаливый сдвиг на три часа выглядит не ошибкой показа, а ошибкой разбора.
 */
function stamp(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 23)} UTC`
}

export async function TaskParseSection({ state, ui }: { state: ChannelsState; ui: TelegramUi }) {
  // 🔒 ЧИТАЕТ САМ ВИД, А НЕ СТРАНИЦА. Объект разбора нужен ровно здесь; чтение
  // его на странице стоило бы запроса к слою данных на КАЖДОМ виде верхнего
  // ряда, включая те, которым он не нужен.
  const task = await readTask()
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
      {/* 🔒 ЛИБО ТАБЛИЦА, ЛИБО ПРИЧИНА ПУСТОТЫ — И НИКОГДА ОБЕ. Пустая таблица с
          заголовками столбцов выглядит как работающий экран, которому нечего
          сказать, и человек ждёт строк, которых не будет. */}
      {task ? (
        // 🔒 ШИРОКОЕ СОДЕРЖИМОЕ ПРОКРУЧИВАЕТСЯ ВНУТРИ СВОЕГО КОНТЕЙНЕРА: текст
        // запроса приходит какой угодно длины, а страница не имеет права ехать
        // вбок целиком.
        <div data-task-parse-table className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[36rem] border-collapse text-[length:var(--fs-small)]">
            <thead className="border-b bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-normal">{ui.parse.colKind}</th>
                <th className="px-4 py-2 font-normal">{ui.parse.colWhat}</th>
                <th className="px-4 py-2 font-normal">{ui.parse.colSource}</th>
                <th className="px-4 py-2 font-normal">{ui.parse.colTime}</th>
              </tr>
              {/* 🔒 ОСТАЛЬНЫЕ СТРОКИ — ИНТЕРПРЕТАЦИЯ, И ОНИ ИДУТ ПОД СЫРЬЁМ (91-4).
                  Порядок в списке — порядок появления: разбор виден как ход, а не
                  как отсортированный отчёт. */}
              {task.rows.map(row => (
                <tr key={row.id} data-task-row={row.kind} data-task-fact={row.fact}>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
                    {ui.parse.kinds[row.kind]}
                    {/* 🔒 КЛЮЧ ПРИЗНАКА ПОКАЗЫВАЕТСЯ РЯДОМ С РОДОМ, А НЕ ВМЕСТО НЕГО:
                        человек говорит о признаке его ключом — так он назван и в реестре. */}
                    {row.fact ? (
                      <span className="ml-2 font-mono text-[0.85em] text-foreground/70">{row.fact}</span>
                    ) : null}
                  </td>
                  <td className="whitespace-pre-wrap break-words px-4 py-3 align-top text-foreground">
                    {row.phrase}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
                    {ui.parse.sources[row.source]}
                    {typeof row.confidence === "number" ? (
                      <span className="ml-2">{Math.round(row.confidence * 100)}%</span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-muted-foreground">
                    <time dateTime={row.at}>{stamp(row.at)}</time>
                  </td>
                </tr>
              ))}
            </thead>
            <tbody>
              {/* 🔒 ПЕРВАЯ СТРОКА — СЫРЬЁ, КАКИМ ОНО ПРИШЛО, И ОНА НЕ ИЗ `rows`.
                  Остальные строки таблицы — интерпретация, и живут они списком;
                  эта одна есть у КАЖДОГО разбора по устройству, потому и лежит
                  отдельным полем объекта. */}
              <tr
                data-task-row="intake"
                data-task-channel={task.intake.channel}
                data-task-at={task.intake.at}
              >
                <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
                  {ui.parse.kinds.intake}
                </td>
                {/* 🔒 ТЕКСТ ДОСЛОВНО, С ПЕРЕВОДАМИ СТРОК: он и есть то, с чем
                    сверяют всё остальное. Обрезанный «для вида» оригинал
                    перестаёт быть оригиналом. */}
                <td className="whitespace-pre-wrap break-words px-4 py-3 align-top text-foreground">
                  {task.intake.text || ui.parse.noWords}
                </td>
                <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
                  {ui.parse.via.replace("{name}", channelName(task.intake.channel))}
                </td>
                <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-muted-foreground">
                  <time dateTime={task.intake.at}>{stamp(task.intake.at)}</time>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div
          data-task-parse-empty={empty.key}
          className="rounded-md border border-dashed border-muted-foreground/30 p-6 text-[length:var(--fs-small)] text-muted-foreground"
        >
          {empty.text}
        </div>
      )}
    </section>
  )
}
