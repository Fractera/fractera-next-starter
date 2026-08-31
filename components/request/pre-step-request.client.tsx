"use client"

import { useState } from "react"
import { Pencil, Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"

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
 * Слова варианта В — ОТДЕЛЬНЫМ ТИПОМ, А НЕ ПОЛЯМИ ОБЩЕГО (69).
 *
 * 🔒 Требовать их от каталога блоков значило бы заставить его носить три строки,
 * которых он никогда не покажет, — и завести в словаре слоя слова про страницы
 * подвала. Тип обязан описывать то, что есть, а не то, что удобно передать.
 */
export type PageRequestUi = { label: string; title: string; lead: string }

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

type Props = {
  ui: RequestCommonUi
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
  /** Слова варианта В. Есть только у заявки на текст страницы. */
  pageUi?: PageRequestUi
  page: string
}

export function PreStepRequest({ ui, blockUi, dialogUi, code, kind, kindTitle, pageSlug, pageTitle, pageUi, page }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [role, setRole] = useState("")
  const [busy, setBusy] = useState(false)

  // Три предмета, и признак у каждого свой: кода нет и типа нет — значит это
  // страница. Порядок проверок здесь и есть определение вариантов.
  const isPage = Boolean(pageSlug)
  const isCreate = !code && !isPage

  async function send() {
    if (!text.trim() || busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/architect/pre-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, code, kind, pageSlug, role: role || undefined, page }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; file?: string } | null

      if (!res.ok || !data?.ok || !data.file) {
        toast.error(ui.toastFailed, { duration: Infinity })
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
      toast.success(`${ui.toastTitle} ${data.file}`, {
        description: `${ui.toastWhere} · ${ui.toastNext}`,
        duration: Infinity,
        closeButton: false,
        action: { label: ui.toastGot, onClick: () => {} },
      })
    } catch {
      toast.error(ui.toastFailed, { duration: Infinity })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {isPage ? (
        /* 🔒 КНОПКА СТРАНИЦЫ ВЫГЛЯДИТ КАК ДЕЙСТВИЕ, А НЕ КАК ПУСТОЕ МЕСТО. У
           категории каталога кнопка пунктирная — она стоит в ряду карточек и
           говорит «здесь можно добавить». Здесь она стоит под готовым абзацем
           заглушки и предлагает единственное осмысленное действие на странице. */
        <button
          type="button"
          data-request-page={pageSlug}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-[length:var(--fs-body)] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Sparkles size={16} aria-hidden />
          {pageUi?.label}
        </button>
      ) : isCreate ? (
        <button
          type="button"
          data-create-block={kind}
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-[length:var(--fs-body)] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
        >
          <Plus size={16} aria-hidden />
          {(blockUi?.createLabel ?? "")}
        </button>
      ) : (
        <button
          type="button"
          data-edit-block={code}
          onClick={() => setOpen(true)}
          aria-label={(blockUi?.editLabel ?? "").replace("%s", code ?? "")}
          title={(blockUi?.editLabel ?? "").replace("%s", code ?? "")}
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
        title={isPage ? (pageUi?.title ?? "").replace("%s", pageTitle ?? pageSlug ?? "") : isCreate ? (blockUi?.createTitle ?? "").replace("%s", kindTitle ?? kind ?? "") : (blockUi?.editTitle ?? "").replace("%s", code ?? "")}
        description={isPage ? pageUi?.lead : isCreate ? (blockUi?.createLead ?? "") : (blockUi?.editLead ?? "")}
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:text-foreground"
            >
              {ui.cancel}
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!text.trim() || busy}
              className="rounded-md bg-primary px-4 py-2 text-[length:var(--fs-small)] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? ui.sending : ui.send}
            </button>
          </>
        }
      >
        {/* 🔒 ПОДВАЛ ОТДАН ОКНУ, А НЕ ТЕЛУ. Кнопки обязаны стоять на месте, пока
            человек прокручивает длинное описание: уехавшая за край кнопка
            «Отправить» — это и была жалоба владельца. */}
        <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[length:var(--fs-small)] font-medium text-foreground">{ui.whatLabel}</span>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={5}
                maxLength={4000}
                placeholder={ui.whatPlaceholder}
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
        </div>
      </AppDialog>
    </>
  )
}
