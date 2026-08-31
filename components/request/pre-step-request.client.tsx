"use client"

import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import { pageRequestWords } from "@/lib/pages/page-request.words"

// ЗАЯВКА В ПРИЁМНУЮ ПРОЕКТА (шаг 61, 2026-08-30; поднят и обобщён 69, 2026-08-31).
//
// 🔒 ФАЙЛ ЖИВЁТ В `components/`, А НЕ В СЛОЕ, И ЭТО ЗАКОН, А НЕ ВКУС. Потребителей
// стало двое из РАЗНЫХ групп прав: каталог блоков в слое архитектора и четыре
// страницы подвала в публичном слое. «A permission group never imports from a
// sibling: shared code rises into `components/` and `lib/`» — значит островок
// поднимается, а не копируется. Вторая копия дала бы две разные заявки об одном
// и том же и разошлась бы на первой правке.
//
// Один островок на три пути, названных владельцем:
//   вариант А — карандаш у кода образца: «этот блок нужно изменить так-то»;
//   вариант Б — кнопка в категории: «сюда нужен новый блок такой-то»;
//   вариант В — кнопка под заглушкой страницы подвала: «напиши сюда текст».
//
// 🔒 ТРЕТИЙ ВАРИАНТ ОТЛИЧАЕТСЯ ПРЕДМЕТОМ, А НЕ УСТРОЙСТВОМ. Заявка на текст
// страницы просит не блок, а ДОКУМЕНТ: политику, условия, заявление о
// доступности. Поле роли ему не нужно — у страницы уже есть назначение, и
// спрашивать его значило бы просить человека объяснить, зачем нужна политика
// конфиденциальности.
//
// 🔒 ДВА РЕЖИМА, А НЕ ДВА КОМПОНЕНТА. Отличаются они тремя вещами — заголовком,
// двумя полями и тем, что уезжает в заявку; всё остальное совпадает до пикселя.
// Две копии разошлись бы на первой правке, и увидеть это можно было бы только
// открыв оба окна подряд.
//
// ✗ ЗДЕСЬ БЫЛ СОБРАН СВОЙ `DialogContent`, И ЭТО СТОИЛО ВЛАДЕЛЬЦУ ОТКРЫТИЯ
// ОКНА БЕЗ ПРОКРУТКИ (найдено им же, 2026-08-30: «ты не добавил вертикальный
// скролл в модальное окно»). Голый примитив не знает ни предела высоты, ни
// прокручиваемого тела: два поля и подсказка вырастают за нижний край экрана
// вместе с кнопкой «Отправить», и до неё не добраться вовсе.
//
// 🔒 ОКНО ПРОДУКТА ОДНО, И ЭТО `AppDialog`, А НЕ `DialogContent`. Оно приносит
// `max-h-[85vh]`, неподвижные заголовок и подвал и ПРОКРУЧИВАЕМОЕ тело между
// ними — ровно ту тройку, которую здесь пришлось бы изобретать заново. Гейт
// `check:dialogs` этого обхода не поймал: он ловит подложку, собранную руками,
// и `createPortal`, а импорт примитива выглядит законно. Дыра закрыта тем же
// шагом.
//
// 🔒 УРОК ШИРЕ СЛУЧАЯ: стандарт, который знает только тот, кто его писал, — не
// стандарт. Я сам обошёл собственное правило через сутки после того, как
// сослался на него в комментарии.
//
// 🔒 СЛОВА ПРИХОДЯТ ПРОПСОМ, А НЕ ИМПОРТОМ. Клиентский файл, импортирующий
// словарь значением, увёз бы в браузер все его языки на каждой странице — это
// ловит тот же гейт. Здесь резолвит сервер, сюда приезжают только нужные строки.
//
// 🔒 ЗАЯВКА НЕ ЗАПУСКАЕТ АГЕНТА. Кнопки «сделать немедленно» здесь нет и не
// будет: приёмная — канал просьб, а не пульт исполнения. Что с заявкой станет,
// решает владелец в разговоре, и об этом прямо говорит тост.

/**
 * Слова, общие ВСЕМ трём вариантам: поле «что нужно», кнопки, тост.
 *
 * 🔒 РАЗВЕДЕНО НАДВОЕ В 69, И ЭТО НЕ ПЕРЕСТАНОВКА ПОЛЕЙ. Пока тип был один, он
 * требовал от страницы подвала слова про блоки — «предложить правку блока»,
 * «роль и ограничения», подсказку о переиспользовании стилей, — которых она не
 * покажет никогда. Тип обязан описывать то, что есть, а не то, что удобно
 * передать; иначе каждый новый потребитель тащит чужой словарь.
 */
export type RequestCommonUi = {
  whatLabel: string
  whatPlaceholder: string
  send: string
  sending: string
  cancel: string
  toastTitle: string
  toastWhere: string
  toastNext: string
  toastGot: string
  toastFailed: string
}

/** Слова вариантов А и Б — они про БЛОКИ и живут в словаре слоя архитектора. */
export type BlockWordsUi = {
  /** Подпись карандаша для читалки: «предложить правку блока %s». */
  editLabel: string
  editTitle: string
  editLead: string
  createLabel: string
  createTitle: string
  createLead: string
  roleLabel: string
  roleHint: string
  rolePlaceholder: string
  stylesHint: string
}

/** Прежнее имя — полный набор каталога блоков; его словарь уже такой. */
export type BlockRequestUi = RequestCommonUi & BlockWordsUi

/**
 * Слова варианта Г — заявка на новый ИНСТРУМЕНТ (76-5).
 *
 * 🔒 ЧЕТВЁРТЫЙ ТИП СЛОВ, А НЕ ЧЕТВЁРТЫЙ КОМПОНЕНТ — та же развилка, что в 69.
 * Предмет другой: инструменту не нужны ни «роль блока», ни подсказка о
 * переиспользовании чужих стилей, а нужен свой вопрос — ГДЕ его будут применять.
 * Это не оформление: именно этот вопрос отличает инструмент от виджета, и
 * задать его надо в ту минуту, когда человек формулирует просьбу, а не потом.
 */
export type ToolWordsUi = {
  createLabel: string
  createTitle: string
  createLead: string
  whereLabel: string
  whereHint: string
  wherePlaceholder: string
  /** Подпись карандаша для читалки: «предложить правку инструмента %s». */
  editLabel: string
  editTitle: string
  editLead: string
}

type Props = {
  /** Слова каталога блоков. У варианта В их нет: он берёт свои сам. */
  ui?: RequestCommonUi
  /** Слова вариантов А и Б. Обязательны там, где предмет — блок. */
  blockUi?: BlockWordsUi
  /** Слова самого окна (крестик и т. п.) — резолвятся на сервере. */
  dialogUi: AppDialogUi
  /** Код образца — вариант А. */
  code?: string
  /** Тип каталога — вариант Б. */
  kind?: string
  /** Как тип называется по-человечески; печатается в заголовке окна. */
  kindTitle?: string
  /** Имя страницы подвала — вариант В (`privacy`, `terms`…). */
  pageSlug?: string
  /** Как страница называется по-человечески; печатается в заголовке окна. */
  pageTitle?: string
  /** Язык страницы: слова варианта В островок берёт сам (см. page-request.words). */
  pageLang?: string
  /**
   * Вариант Г — заявка на новый ИНСТРУМЕНТ (76-5).
   *
   * 🔒 ПРИЗНАК ОТДЕЛЬНЫЙ, А НЕ «КОДА И ТИПА НЕТ». Вариант Б узнаётся именно по
   * отсутствию кода, и молчаливо занять четвёртым предметом ту же пустоту значило
   * бы объявить любую заявку без кода заявкой на инструмент. Предмет называется
   * прямо — тем же способом, каким назван `pageSlug`.
   */
  tool?: boolean
  /**
   * Какой именно инструмент правим — `_tools/code-view`.
   *
   * 🔒 ЕГО НАЛИЧИЕ И ЕСТЬ РАЗНИЦА МЕЖДУ «ПРАВКОЙ» И «НОВЫМ», ровно как у блоков:
   * там код образца отличает карандаш от кнопки создания. Один и тот же признак
   * на два предмета — не совпадение, а то, что делает каталоги одинаковыми на
   * ощупь.
   */
  toolId?: string
  /** Слова варианта Г. Обязательны там, где предмет — инструмент. */
  toolUi?: ToolWordsUi
  page: string
}

export function PreStepRequest({ ui, blockUi, dialogUi, code, kind, kindTitle, pageSlug, pageTitle, pageLang, tool, toolId, toolUi, page }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [role, setRole] = useState("")
  const [busy, setBusy] = useState(false)

  // Четыре предмета, и признак у каждого свой. Порядок проверок здесь и есть
  // определение вариантов: инструмент и страница объявляются прямо, правка
  // образца узнаётся по коду, новый блок остаётся тем, что не подошло никуда.
  const isTool = Boolean(tool)
  // Правка существующего инструмента против просьбы о новом — та же развилка,
  // что у блоков: назван предмет — карандаш, не назван — карточка создания.
  const isToolEdit = isTool && Boolean(toolId)
  const isPage = Boolean(pageSlug)
  // 🔒 СЛОВА ВАРИАНТА В РЕЗОЛВЯТСЯ ЗДЕСЬ, В БРАУЗЕРЕ, А НЕ ПРИЕЗЖАЮТ ПРОПСОМ.
  // Иначе они уезжают в полезной нагрузке каждому посетителю статической
  // страницы — даже когда кнопка не нарисована. Измерено на живом сервере.
  const w = pageRequestWords(pageLang ?? "en")
  // 🔒 ОБЩИЕ СЛОВА: у блоков приходят пропсом из словаря слоя архитектора, у
  // страницы подвала берутся здесь же. Один островок, два источника — потому что
  // словари принадлежат разным группам прав и объединить их нечем.
  const u = ui ?? w
  const isCreate = !code && !isPage && !isTool

  async function send() {
    if (!text.trim() || busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/architect/pre-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🔒 ВТОРОЕ ПОЛЕ ЕДЕТ ОДНИМ КЛЮЧОМ `role`, А ПОДПИСЬ ЕМУ ДАЁТ ПРЕДМЕТ.
        // У блока это «роль и ограничения», у инструмента — «где будете
        // применять»; вопросы разные, а место в заявке одно. Второй ключ ради
        // подписи развёл бы форму и файл: писателю пришлось бы знать оба и
        // выбирать, а он и так знает предмет.
        body: JSON.stringify({ text, code, kind, pageSlug, tool: tool || undefined, toolId, role: role || undefined, page }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; file?: string } | null

      if (!res.ok || !data?.ok || !data.file) {
        toast.error(u.toastFailed, { duration: Infinity })
        return
      }

      setOpen(false)
      setText("")
      setRole("")

      // 🔒 ЭТОТ ТОСТ НЕ ИСЧЕЗАЕТ САМ, И ЭТО ПРЯМОЕ ТРЕБОВАНИЕ ВЛАДЕЛЬЦА:
      // «нельзя закрыть до тех пор, пока пользователь его не прочтёт».
      //
      // 🔒 ПРОЧТЕНО КАК «НЕ ИСЧЕЗАЕТ САМ», А НЕ КАК «НЕТ ВЫХОДА». Тост без
      // выхода — ловушка: он перекрывает интерфейс, не убирается с клавиатуры и
      // на узком экране закрывает собой то, ради чего человек пришёл. Здесь нет
      // ни автозакрытия, ни крестика: уйти можно только своей кнопкой, то есть
      // ответив. Это исполняет просьбу и не создаёт ловушки.
      //
      // 🔒 ТРИ ВЕЩИ ОБЯЗАТЕЛЬНЫ, И ТРЕТЬЯ ВАЖНЕЕ ДВУХ ПЕРВЫХ. Что создано (имя
      // файла — им человек назовёт заявку агенту), где лежит и ЧТО БУДЕТ ДАЛЬШЕ.
      // Без третьей строки человек уверен, что работа началась, а она не
      // начиналась: заявка ждёт его слова.
      toast.success(`${u.toastTitle} ${data.file}`, {
        description: `${u.toastWhere} · ${u.toastNext}`,
        duration: Infinity,
        closeButton: false,
        action: { label: u.toastGot, onClick: () => {} },
      })
    } catch {
      toast.error(u.toastFailed, { duration: Infinity })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {isPage || isCreate || (isTool && !isToolEdit) ? (

        <button
          type="button"
          data-create-block={isCreate ? kind : undefined}
          data-request-page={isPage ? pageSlug : undefined}
          data-create-tool={isTool ? "" : undefined}
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-[length:var(--fs-body)] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
        >
          <Plus size={16} aria-hidden />
          {isTool ? (toolUi?.createLabel ?? "") : isPage ? w.label : (blockUi?.createLabel ?? "")}
        </button>
      ) : (
        <button
          type="button"
          data-edit-block={isToolEdit ? undefined : code}
          data-edit-tool={isToolEdit ? toolId : undefined}
          onClick={() => setOpen(true)}
          aria-label={isToolEdit ? (toolUi?.editLabel ?? "").replace("%s", toolId ?? "") : (blockUi?.editLabel ?? "").replace("%s", code ?? "")}
          title={isToolEdit ? (toolUi?.editLabel ?? "").replace("%s", toolId ?? "") : (blockUi?.editLabel ?? "").replace("%s", code ?? "")}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <Pencil size={12} aria-hidden />
        </button>
      )}

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        ui={dialogUi}
        size="md"
        title={isToolEdit ? (toolUi?.editTitle ?? "").replace("%s", toolId ?? "") : isTool ? (toolUi?.createTitle ?? "") : isPage ? w.title.replace("%s", pageTitle ?? pageSlug ?? "") : isCreate ? (blockUi?.createTitle ?? "").replace("%s", kindTitle ?? kind ?? "") : (blockUi?.editTitle ?? "").replace("%s", code ?? "")}
        description={isToolEdit ? (toolUi?.editLead ?? "") : isTool ? (toolUi?.createLead ?? "") : isPage ? w.lead : isCreate ? (blockUi?.createLead ?? "") : (blockUi?.editLead ?? "")}
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:text-foreground"
            >
              {u.cancel}
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!text.trim() || busy}
              className="rounded-md bg-primary px-4 py-2 text-[length:var(--fs-small)] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? u.sending : u.send}
            </button>
          </>
        }
      >
        {/* 🔒 ПОДВАЛ ОТДАН ОКНУ, А НЕ ТЕЛУ. Кнопки обязаны стоять на месте, пока
            человек прокручивает длинное описание: уехавшая за край кнопка
            «Отправить» — это и была жалоба владельца. */}
        <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[length:var(--fs-small)] font-medium text-foreground">{u.whatLabel}</span>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={5}
                maxLength={4000}
                placeholder={u.whatPlaceholder}
                className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-[length:var(--fs-small)] leading-relaxed outline-none focus:border-primary/50"
              />
            </label>

            {/* Второе поле и подсказка о стилях — только у варианта Б. Роль
                НЕОБЯЗАТЕЛЬНА: человек часто знает, ЧТО хочет видеть, и не знает,
                где вид сломается. Обязательное поле заставило бы выдумывать. */}
            {isCreate && (
              <>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[length:var(--fs-small)] font-medium text-foreground">{(blockUi?.roleLabel ?? "")}</span>
                  <span className="text-[length:var(--fs-small)] text-muted-foreground">{(blockUi?.roleHint ?? "")}</span>
                  <textarea
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder={(blockUi?.rolePlaceholder ?? "")}
                    className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-[length:var(--fs-small)] leading-relaxed outline-none focus:border-primary/50"
                  />
                </label>

                {/* 🔒 ПОДСКАЗКА, А НЕ ПОЛЕ. Ссылку или CSS человек кладёт в то же
                    описание. Отдельное поле «стили» обещало бы, что их кто-то
                    разберёт машинно, — а разбирать будет агент, читая текст. */}
                <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                  {(blockUi?.stylesHint ?? "")}
                </p>
              </>
            )}

            {/* 🔒 У ИНСТРУМЕНТА ВТОРОЙ ВОПРОС ДРУГОЙ, И ЭТО НЕ ПЕРЕИМЕНОВАНИЕ
                ПОЛЯ. «Где будете применять» — тот самый вопрос, который решает
                «инструмент или виджет»: захочет ли ВТОРОЙ вызывающий ровно эту
                вещь. Задать его надо в минуту, когда человек формулирует
                просьбу, — потом он ответит уже под влиянием построенного.

                🔒 ПОДСКАЗКИ О ЧУЖИХ СТИЛЯХ ЗДЕСЬ НЕТ НАМЕРЕННО. Она про блок:
                вид можно повторить по CSS. У инструмента предмет — работа, а не
                облик, и обещание «пришлите стили» увело бы разговор не туда.

                🔒 У ПРАВКИ СУЩЕСТВУЮЩЕГО ИНСТРУМЕНТА ЭТОГО ПОЛЯ НЕТ, и это не
                экономия: он уже где-то применяется, и спрашивать «где будете
                применять» значило бы задать вопрос, на который отвечает сама
                карточка строкой «Уже применяется». Тот же порядок у блоков:
                карандаш спрашивает одно, кнопка создания — два. */}
            {isTool && !isToolEdit && (
              <label className="flex flex-col gap-1.5">
                <span className="text-[length:var(--fs-small)] font-medium text-foreground">{(toolUi?.whereLabel ?? "")}</span>
                <span className="text-[length:var(--fs-small)] text-muted-foreground">{(toolUi?.whereHint ?? "")}</span>
                <textarea
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder={(toolUi?.wherePlaceholder ?? "")}
                  className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-[length:var(--fs-small)] leading-relaxed outline-none focus:border-primary/50"
                />
              </label>
            )}
        </div>
      </AppDialog>
    </>
  )
}
