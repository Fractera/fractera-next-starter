"use client"

import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"

// ЗАЯВКА ИЗ КАТАЛОГА БЛОКОВ (шаг 61, 2026-08-30).
//
// Один островок на два пути, названных владельцем:
//   вариант А — карандаш у кода образца: «этот блок нужно изменить так-то»;
//   вариант Б — кнопка в категории: «сюда нужен новый блок такой-то».
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

export type BlockRequestUi = {
  /** Подпись карандаша для читалки: «предложить правку блока %s». */
  editLabel: string
  editTitle: string
  editLead: string
  /** Кнопка и заголовок варианта Б. */
  createLabel: string
  createTitle: string
  createLead: string
  /** Поля. */
  whatLabel: string
  whatPlaceholder: string
  roleLabel: string
  roleHint: string
  rolePlaceholder: string
  /** Подсказка о переиспользовании стилей — только в варианте Б. */
  stylesHint: string
  /** Кнопки. */
  send: string
  sending: string
  cancel: string
  /** Тост. */
  toastTitle: string
  toastWhere: string
  toastNext: string
  toastGot: string
  toastFailed: string
}

type Props = {
  ui: BlockRequestUi
  /** Слова самого окна (крестик и т. п.) — резолвятся на сервере. */
  dialogUi: AppDialogUi
  /** Код образца — вариант А. */
  code?: string
  /** Тип каталога — вариант Б. */
  kind?: string
  /** Как тип называется по-человечески; печатается в заголовке окна. */
  kindTitle?: string
  page: string
}

export function BlockRequest({ ui, dialogUi, code, kind, kindTitle, page }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [role, setRole] = useState("")
  const [busy, setBusy] = useState(false)

  const isCreate = !code

  async function send() {
    if (!text.trim() || busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/architect/pre-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, code, kind, role: role || undefined, page }),
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
      {isCreate ? (
        <button
          type="button"
          data-create-block={kind}
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-[length:var(--fs-body)] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground"
        >
          <Plus size={16} aria-hidden />
          {ui.createLabel}
        </button>
      ) : (
        <button
          type="button"
          data-edit-block={code}
          onClick={() => setOpen(true)}
          aria-label={ui.editLabel.replace("%s", code ?? "")}
          title={ui.editLabel.replace("%s", code ?? "")}
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
        title={isCreate ? ui.createTitle.replace("%s", kindTitle ?? kind ?? "") : ui.editTitle.replace("%s", code ?? "")}
        description={isCreate ? ui.createLead : ui.editLead}
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
                  <span className="text-[length:var(--fs-small)] font-medium text-foreground">{ui.roleLabel}</span>
                  <span className="text-[length:var(--fs-small)] text-muted-foreground">{ui.roleHint}</span>
                  <textarea
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder={ui.rolePlaceholder}
                    className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-[length:var(--fs-small)] leading-relaxed outline-none focus:border-primary/50"
                  />
                </label>

                {/* 🔒 ПОДСКАЗКА, А НЕ ПОЛЕ. Ссылку или CSS человек кладёт в то же
                    описание. Отдельное поле «стили» обещало бы, что их кто-то
                    разберёт машинно, — а разбирать будет агент, читая текст. */}
                <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                  {ui.stylesHint}
                </p>
              </>
            )}
        </div>
      </AppDialog>
    </>
  )
}
