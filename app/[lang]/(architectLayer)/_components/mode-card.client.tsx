"use client"

import { useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { AdviceNote } from "./advice-note"
import { isAlphaMode, type DevMode } from "../_lib/dev-mode"
import type { DevModeUi } from "../_i18n/dev-mode.i18n"

// КАРТОЧКА ОДНОГО РЕЖИМА (33-2 … 33-4, 2026-08-29).
//
// 🔒 ОСТРОВОК РАДИ ОДНОГО ДЕЙСТВИЯ — ВЫБРАТЬ И СОХРАНИТЬ. Описание, требования и
// отметка «действует сейчас» приходят с сервера готовыми: страница читается и без
// JavaScript, а словарь слоя в браузер не уезжает.
//
// 🔒 ЗАПИСЬ ИДЁТ ЧЕРЕЗ СУЩЕСТВУЮЩУЮ ДВЕРЬ `api/architect/platform-config`. Новой
// не заводим: режим лежит в том же файле, что и выключатели, а второй писатель
// одного файла — это две гонки за одну запись и второе место, где надо помнить про
// заплату.
//
// 🔒 ПИШЕТСЯ ЗАПЛАТА ИЗ ОДНОГО КЛЮЧА. В файле рядом живут `routingMode`, `slots`,
// `features` и ветка переезда, и туда же пишет панель из другого процесса. Снимок
// целиком стёр бы их при каждом выборе режима.
//
// 🔒 «ОСТАВИТЬ ТЕКУЩИЙ РЕЖИМ» — ТАКОЙ ЖЕ ОСОЗНАННЫЙ ВЫБОР, КАК СМЕНИТЬ ЕГО, И ОН
// ТОЖЕ ЗАПИСЫВАЕТСЯ. Молчание конфига действует как `classic`; не запиши мы
// подтверждение — «не выбирал» осталось бы неотличимо от «выбрал классический»
// навсегда. Поэтому кнопка активна и у действующего режима, пока выбор не записан.
export function ModeCard({
  mode,
  current,
  chosen,
  ui,
  lang,
  adminUrl,
}: {
  mode: DevMode
  /** Режим, записанный в конфиге на момент загрузки страницы. */
  current: DevMode
  /** Записан ли выбор вообще. */
  chosen: boolean
  ui: DevModeUi
  lang: string
  /** Адрес панели. Пусто — настроек ещё нет, и дверь туда не рисуется. */
  adminUrl: string
}) {
  const words = ui.modes[mode]
  const [savedMode, setSavedMode] = useState<DevMode>(current)
  const [savedChosen, setSavedChosen] = useState(chosen)
  const [busy, setBusy] = useState(false)

  const isCurrent = mode === savedMode
  // Кнопка гаснет, только когда этот режим И действует, И выбран осознанно.
  const done = isCurrent && savedChosen

  async function choose() {
    setBusy(true)
    try {
      const res = await fetch("/api/architect/platform-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch: { developmentMode: mode } }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      toast.success(ui.saved)
      setSavedMode(mode)
      setSavedChosen(true)
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  return (
    <section
      data-mode-card={mode}
      data-mode-current={isCurrent ? "true" : "false"}
      className={
        "flex flex-col gap-4 rounded-2xl border p-6 " +
        (isCurrent ? "border-primary bg-primary/5" : "border-border")
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <H3 variant="ui">{words.label}</H3>
        {isAlphaMode(mode) && (
          <span
            data-mode-alpha={mode}
            className="inline-flex items-center rounded-full bg-destructive px-3 py-1 text-[length:var(--fs-small)] text-destructive-foreground"
          >
            {ui.alpha}
          </span>
        )}
        {isCurrent && (
          <span
            data-mode-current-badge
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[length:var(--fs-small)] text-primary-foreground"
          >
            <Check className="size-3.5" aria-hidden />
            {ui.current}
          </span>
        )}
      </div>

      {/* 🔒 СОВЕТ СТОИТ НАД ОПИСАНИЕМ, А НЕ ПОД КНОПКОЙ. Он про то, КАК работать
          в этом режиме, и прочитать его надо до выбора: под кнопкой он стал бы
          сноской к уже принятому решению. Контейнер общий (`AdviceNote`, тон
          `advice`) — тот же жанр, что «добавляйте по одному слоту». */}
      {words.advice && <AdviceNote probe={`mode-advice-${mode}`} title={ui.adviceTitle} text={words.advice} />}

      <P className="max-w-3xl text-[length:var(--fs-body)]">{words.body}</P>
      <Small className="max-w-3xl">{words.when}</Small>

      {/* 🔒 ТРЕБОВАНИЯ — ЦЕНА, НАЗВАННАЯ ДО РЕШЕНИЯ, А НЕ ПОХВАЛА РЕЖИМУ. У
          классического их нет вовсе, и пустой ряд на его карточке выглядел бы
          недоделкой — значит ряда там нет совсем.

          🔒 ОНИ НАЗЫВАЮТСЯ, А НЕ ПРОВЕРЯЮТСЯ. У слоя нет способа узнать, есть ли у
          владельца подписка; нарисовать галочку «выполнено» значило бы соврать
          уверенно. Строка называет условие, а судит человек — то же правило, по
          которому шаг мастера запуска бывает «отмечен», а не «проверен». */}
      {words.requires.length > 0 && (
        <>
          <Separator />
          <ul className="flex flex-wrap gap-2">
            {words.requires.map(req => (
              <li
                key={req}
                data-mode-req
                className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-[length:var(--fs-small)] text-muted-foreground"
              >
                {req}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 🔒 ДВЕРЬ РЕЖИМА — ГЛАВНОЕ, ЧЕГО НЕ ХВАТАЛО (владелец 2026-08-29: «я не могу
          провалиться внутрь режима»). Выбрать режим и не иметь, куда пойти дальше, —
          это выбор без последствия: человек нажал и остался на той же странице.

          🔒 ПОКА ПОВЕРХНОСТЬ КЕЙСОВ ПЕРЕЕЗЖАЕТ, ДВЕРЬ ВЕДЁТ В ПАНЕЛЬ, И ОБ ЭТОМ
          СКАЗАНО ПРЯМО. Тот же приём, что у неготовой группы меню: пока раздел не
          переехал, настройка обязана оставаться доступной там, где она есть. Данные
          при этом одни и те же — панель пишет в ту же папку продуктов. */}
      {words.door && (words.door.href(lang, adminUrl).startsWith("/") || adminUrl) && (
        <div data-mode-door={mode} className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3">
          <a
            href={words.door.href(lang, adminUrl)}
            className="inline-flex w-fit items-center gap-2 text-[length:var(--fs-body)] font-medium text-primary hover:underline"
          >
            {words.door.label}
            <ArrowRight className="size-4" aria-hidden />
          </a>
          <Small>{words.door.hint}</Small>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={choose} disabled={busy || done} data-mode-choose={mode} className="h-10 px-5">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? ui.saving : done ? ui.chosen : ui.choose}
        </Button>
      </div>
    </section>
  )
}
