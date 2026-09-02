import { SectionIntro } from "./section-intro.client"
import { TaskTime } from "./task-time.client"
import { TaskCell } from "./task-cell.client"
import { TaskTool } from "./task-tool.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import { readTask } from "@/lib/task/store"
import type { RequestChannel, TaskRow } from "@/lib/task/types"
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
 * Полоса колонки.
 *
 * 🔒 ЧЕРЕДОВАНИЕ ПО КОЛОНКАМ, А НЕ ПО СТРОКАМ — прямое слово владельца:
 * «поочерёдно колонки разделены разным цветом, сейчас у тебя всё тело таблицы
 * выглядит одинаково». Полосы по строкам здесь врали бы: строка — это шаг
 * разбора, и подсветка через одну намекала бы на чередование, которого нет.
 */
function stripe(col: number): string {
  return col % 2 === 1 ? "bg-muted/25" : ""
}

const CELL = "px-4 py-3 align-top"

/** Одна строка таблицы: номер, род, содержимое, чем добыто, время. */
function Row({
  no,
  kind,
  fact,
  what,
  source,
  toolWhat,
  instruction,
  action,
  confidence,
  at,
  mark,
  dialogUi,
  cols,
}: {
  no: number
  kind: string
  fact?: string
  what: string
  source: string
  toolWhat?: string
  instruction?: string
  action?: string
  confidence?: number
  at: string
  mark: Record<string, string | undefined>
  dialogUi: AppDialogUi
  cols: { what: string; instruction: string; action: string; viewAll: string }
}) {
  return (
    <tr {...mark} className="border-t">
      {/* 🔒 НОМЕР — ПОРЯДОК ПОЯВЛЕНИЯ, А НЕ ПОРЯДОК ПОКАЗА. Сортировка обратная,
          значит сверху идут бо́льшие числа: так видно, что первая строка разбора
          лежит внизу, а не что нумерация сбилась. */}
      <td className={`${CELL} ${stripe(0)} w-10 text-right font-mono text-muted-foreground`}>{no}</td>
      <td className={`${CELL} ${stripe(1)} whitespace-nowrap text-muted-foreground`}>
        {kind}
        {/* 🔒 КЛЮЧ ПРИЗНАКА ПОКАЗЫВАЕТСЯ РЯДОМ С РОДОМ, А НЕ ВМЕСТО НЕГО:
            человек говорит о признаке его ключом — так он назван и в реестре. */}
        {fact ? <span className="ml-2 font-mono text-[0.85em] text-foreground">{fact}</span> : null}
      </td>
      <td className={`${CELL} ${stripe(2)} text-foreground`}>
        <TaskCell text={what} title={cols.what} ui={dialogUi} viewAll={cols.viewAll} />
      </td>
      <td className={`${CELL} ${stripe(3)} whitespace-nowrap text-muted-foreground`}>
        <TaskTool name={source} what={toolWhat} />
        {typeof confidence === "number" ? (
          <span className="ml-2">{Math.round(confidence * 100)}%</span>
        ) : null}
      </td>
      {/* 🔒 КОЛОНКА «ИНСТРУКЦИЯ» ЗАВЕДЕНА ПУСТОЙ ПО СЛОВУ ВЛАДЕЛЬЦА: работать с
          ней будем следующим шагом. Пустая ячейка честнее отсутствующей колонки —
          видно, что место под инструкцию есть и оно пока не наполнено. */}
      <td className={`${CELL} ${stripe(4)} text-muted-foreground`}>
        <TaskCell text={instruction ?? ""} title={cols.instruction} ui={dialogUi} viewAll={cols.viewAll} />
      </td>
      {/* Экшен — предпоследняя колонка, по слову владельца. В первой записи пусто. */}
      <td className={`${CELL} ${stripe(5)} text-muted-foreground`}>
        <TaskCell text={action ?? ""} title={cols.action} ui={dialogUi} viewAll={cols.viewAll} />
      </td>
      <td className={`${CELL} ${stripe(6)} whitespace-nowrap font-mono text-muted-foreground`}>
        <TaskTime at={at} />
      </td>
    </tr>
  )
}

export async function TaskParseSection({
  state,
  ui,
  dialogUi,
}: {
  state: ChannelsState
  ui: TelegramUi
  dialogUi: AppDialogUi
}) {
  const cols = {
    what: ui.parse.colWhat,
    instruction: ui.parse.colInstruction,
    action: ui.parse.colAction,
    viewAll: ui.parse.viewAll,
  }
  // 🔒 ЧИТАЕТ САМ ВИД, А НЕ СТРАНИЦА. Объект разбора нужен ровно здесь; чтение
  // его на странице стоило бы запроса к слою данных на КАЖДОМ виде верхнего
  // ряда, включая те, которым он не нужен.
  const task = await readTask()
  const empty = emptyReason(state, ui)

  // 🔒 ПОРЯДОК ПРЯМОЙ: СТАРОЕ СВЕРХУ, НОВОЕ ВНИЗУ — правка владельца 2026-09-02.
  // Таблица читается как ход разбора: строка называет следующее действие, и оно
  // стоит ПОД ней. Обратный порядок разрывал эту сцепку — «следующее» оказывалось
  // выше того, что его породило.
  const rows: TaskRow[] = task ? task.rows : []

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

      {/* 🔒 ЛИБО ТАБЛИЦА, ЛИБО ПРИЧИНА ПУСТОТЫ — И НИКОГДА ОБЕ. Пустая таблица с
          заголовками столбцов выглядит как работающий экран, которому нечего
          сказать, и человек ждёт строк, которых не будет.

          🔒 ПУСТОЕ СОСТОЯНИЕ НЕСЁТ СВОЙ КЛЮЧ В РАЗМЕТКЕ, А НЕ ТОЛЬКО ТЕКСТ:
          текст переводится и меняется, ключ — то, по чему причина проверяется
          измерением, не завися от языка страницы. */}
      {task ? (
        // 🔒 ШИРОКОЕ СОДЕРЖИМОЕ ПРОКРУЧИВАЕТСЯ ВНУТРИ СВОЕГО КОНТЕЙНЕРА: текст
        // запроса приходит какой угодно длины, а страница не имеет права ехать
        // вбок целиком.
        <div data-task-parse-table className="task-scroll overflow-x-auto rounded-md border">
          {/* 🔒 ПОЛОСА ПРОКРУТКИ БЕЗ БОРДЮРА И БЕЗ КНОПОК, ТОНКАЯ — правка владельца.
              🛑 ПОРЯДОК ПРАВИЛ ЗДЕСЬ ЗНАЧИМ (урок 57-10): увидев стандартные
              `scrollbar-width`/`scrollbar-color`, Chrome игнорирует ВЕСЬ набор
              `::-webkit-scrollbar-*` целиком — поэтому стандартные свойства
              объявлены только там, где вебкитовых не существует. */}
          <style>
            {[
              ".task-scroll::-webkit-scrollbar { height: 6px; }",
              ".task-scroll::-webkit-scrollbar-track { background: transparent; border: 0; }",
              ".task-scroll::-webkit-scrollbar-button { display: none; width: 0; height: 0; }",
              ".task-scroll::-webkit-scrollbar-thumb { border: 0; border-radius: 9999px;" +
                " background: color-mix(in oklab, currentColor 30%, transparent); }",
              "@supports not selector(::-webkit-scrollbar) {",
              "  .task-scroll { scrollbar-width: thin;" +
                " scrollbar-color: color-mix(in oklab, currentColor 30%, transparent) transparent; }",
              "}",
            ].join("\n")}
          </style>
          <table className="w-full min-w-[36rem] border-collapse text-[length:var(--fs-small)]">
            {/* 🛑 ШАПКА ОТДЕЛЕНА ОТ ТЕЛА ЦВЕТОМ, И ЭТО ПОЧИНКА, А НЕ УКРАШЕНИЕ.
                ✗ строки разбора стояли ВНУТРИ `<thead>` — фон шапки красил их
                все, и «обычной» выглядела одна последняя строка. Владелец описал
                это точно: «сейчас с цветом у тебя отделена последняя строка». */}
            <thead className="border-b-2 bg-muted text-left text-muted-foreground">
              <tr>
                <th className={`px-4 py-2 text-right font-normal ${stripe(0)}`}>{ui.parse.colNo}</th>
                <th className={`px-4 py-2 font-normal ${stripe(1)}`}>{ui.parse.colKind}</th>
                <th className={`px-4 py-2 font-normal ${stripe(2)}`}>{ui.parse.colWhat}</th>
                <th className={`px-4 py-2 font-normal ${stripe(3)}`}>{ui.parse.colSource}</th>
                <th className={`px-4 py-2 font-normal ${stripe(4)}`}>{ui.parse.colInstruction}</th>
                <th className={`px-4 py-2 font-normal ${stripe(5)}`}>{ui.parse.colAction}</th>
                <th className={`px-4 py-2 font-normal ${stripe(6)}`}>{ui.parse.colTime}</th>
              </tr>
            </thead>
            <tbody>
              {/* 🔒 СЫРЬЁ — НЕ ИЗ `rows`, И ЛЕЖИТ ОНО ОТДЕЛЬНЫМ ПОЛЕМ ОБЪЕКТА.
                  Остальные строки — интерпретация и живут списком; эта одна есть
                  у КАЖДОГО разбора по устройству.

                  🔒 ТЕКСТ ДОСЛОВНО, С ПЕРЕВОДАМИ СТРОК: он и есть то, с чем
                  сверяют всё остальное. Обрезанный «для вида» оригинал перестаёт
                  быть оригиналом. */}
              <Row
                no={1}
                kind={ui.parse.kinds.intake}
                what={task.intake.text || ui.parse.noWords}
                source={`${channelName(task.intake.channel)}${task.intake.who ? ": " + task.intake.who : ""}`}
                toolWhat={ui.parse.intakeToolWhat}
                action={ui.parse.nextAfterIntake}
                at={task.intake.at}
                mark={{
                  "data-task-row": "intake",
                  "data-task-channel": task.intake.channel,
                  "data-task-at": task.intake.at,
                }}
                dialogUi={dialogUi}
                cols={cols}
              />

              {rows.map(row => (
                <Row
                  key={row.id}
                  // Номер — порядок появления: сырьё №1, дальше по ходу разбора.
                  no={row.id + 1}
                  kind={ui.parse.kinds[row.kind]}
                  fact={row.fact}
                  what={row.phrase}
                  source={row.tool ?? ui.parse.sources[row.source]}
                  toolWhat={row.toolWhat}
                  instruction={row.instruction}
                  action={row.next}
                  confidence={row.confidence}
                  at={row.at}
                  mark={{ "data-task-row": row.kind, "data-task-fact": row.fact }}
                  dialogUi={dialogUi}
                  cols={cols}
                />
              ))}

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
