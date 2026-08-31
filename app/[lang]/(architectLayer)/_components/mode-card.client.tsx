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
/**
 * Адрес двери по имени режима.
 *
 * 🔒 СЧИТАЕТСЯ ЗДЕСЬ, А НЕ В СЛОВАРЕ. Адрес — не слово: он не переводится и
 * зависит от того, что уже переехало в этот слой. Кейсы пока живут в панели,
 * переезд — на своей же вкладке.
 */
function doorHref(mode: DevMode, lang: string, adminUrl: string): string {
  // 🔒 ОБЕ ДВЕРИ ВЕДУТ В ПАНЕЛЬ (решение владельца 2026-08-29): «для навигации
  // используем новую архитектуру, для работы старую». Пока способность живёт и
  // работает там, слой обязан вести к ней, а не заводить свою копию.
  if (!adminUrl) return ""
  return mode === "migration" ? `${adminUrl}/${lang}/migration` : `${adminUrl}/${lang}/products`
}

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
        {/* 🔒 БЕЙДЖЕЙ БОЛЬШЕ НЕТ (владелец 2026-08-29: «в проекте есть бейджи,
            убери все»). СЛОВА ОСТАЛИСЬ: пилюля — форма, а не смысл, и её уход не
            имеет права уносить с собой информацию. Альфа и «действует сейчас»
            теперь обычный текст, цветом отличающийся от заголовка. */}
        {isAlphaMode(mode) && (
          <span data-mode-alpha={mode} className="text-[length:var(--fs-small)] text-destructive">
            {ui.alpha}
          </span>
        )}
        {isCurrent && (
          <span data-mode-current-badge className="flex items-center gap-1.5 text-[length:var(--fs-small)] text-primary">
            <Check className="size-3.5" aria-hidden />
            {ui.current}
          </span>
        )}
      </div>

      {/* 🔒 СОВЕТ СТОИТ НАД ОПИСАНИЕМ, А НЕ ПОД КНОПКОЙ. Он про то, КАК работать
          в этом режиме, и прочитать его надо до выбора: под кнопкой он стал бы
          сноской к уже принятому решению. Контейнер общий (`AdviceNote`, тон
          `advice`) — тот же жанр, что «добавляйте по одному слоту». */}
      {/* 🔒 ЗЕЛЁНАЯ КАРТОЧКА СТОИТ ПЕРВОЙ, ВЫШЕ ОРАНЖЕВОЙ. Порядок отвечает на два
          разных вопроса по очереди: сначала «стоит ли брать этот режим», потом
          «как в нём работать». Обратный порядок начинал бы с оговорок к выбору,
          которого человек ещё не сделал. */}
      {words.recommend && (
        <AdviceNote tone="recommended" probe={`mode-recommend-${mode}`} title={ui.recommendTitle} text={words.recommend} />
      )}

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
          {/* 🔒 СПИСОК С МАРКЕРАМИ, А НЕ ГАЛОЧКАМИ (владелец 2026-08-29: «as list»).
              Пустой квадратик читается как «отметь, когда выполнишь» — а отмечать
              здесь нечего: слой не знает и не может узнать, есть ли у человека
              подписка. Галочка, которую никто не поставит, обещает работу, которой
              нет; галочка, которую ставит сам человек, хранится нигде и не значит
              ничего. Точка ничего не обещает и делает список списком. */}
          <ul className="flex list-disc flex-col gap-1 ps-5 marker:text-muted-foreground">
            {words.requires.map(req => (
              <li key={req} data-mode-req className="text-[length:var(--fs-small)] text-muted-foreground">
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
      {/* 🔒 БЛОК ДВЕРИ НЕ ИСЧЕЗАЕТ НИКОГДА (66-3, 2026-08-31, решение владельца).
          ✗ Здесь стояло `words.door && doorHref(...) &&` — и адрес панели считается
          из адреса САЙТА, который у нового сервера пуст. Весь блок пропадал молча,
          и владелец, не найдя кнопок, сообщил, что их нет вовсе. Измерено на живом
          сервере до правки: дверей 0 на обоих режимах при HTTP 200.

          Лечение — не «настроить адрес», а перестать молчать: настроить можно за
          минуту, но у КАЖДОГО нового клиента в первый день адрес пуст, и кнопки
          пропадут точно так же. Правда о ненастроенном берётся у самой способности
          и произносится словами (закон 31-14).

          🔒 ПОКА ПОВЕРХНОСТЬ КЕЙСОВ ПЕРЕЕЗЖАЕТ, ДВЕРЬ ВЕДЁТ В ПАНЕЛЬ, И ОБ ЭТОМ
          СКАЗАНО ПРЯМО. Данные при этом одни и те же — панель пишет в ту же папку
          продуктов. */}
      {words.door && (
        <div data-mode-door={mode} data-mode-door-known={doorHref(mode, lang, adminUrl) ? "true" : "false"} className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3">
          {doorHref(mode, lang, adminUrl) ? (
            /* 🔒 ПАНЕЛЬ ОТКРЫВАЕТСЯ НОВОЙ ВКЛАДКОЙ: это другое приложение и другой
               домен, и увести туда текущую вкладку значит выбросить человека из его
               проекта. `noopener` обязателен вместе с `_blank`. */
            <a
              href={doorHref(mode, lang, adminUrl)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex w-fit items-center gap-2 text-[length:var(--fs-body)] font-medium text-primary hover:underline"
            >
              {words.door.label}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          ) : (
            /* Адреса нет — на месте кнопки стоит то, чего не хватает, и дорога туда,
               где это заполняют. Ссылка СВОЯ, поэтому обычная и без нового окна. */
            <a
              href={`/${lang}/architect/app-config?group=basics`}
              data-mode-door-fix={mode}
              rel="nofollow"
              className="inline-flex w-fit items-center gap-2 text-[length:var(--fs-body)] font-medium text-primary hover:underline"
            >
              {ui.doorUnknownLink}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          )}
          <Small>{doorHref(mode, lang, adminUrl) ? words.door.hint : ui.doorUnknown}</Small>
        </div>
      )}

      {/* 🔒 ВЫБРАННЫЙ РЕЖИМ НЕ ПОКАЗЫВАЕТ КНОПКУ ВОВСЕ (владелец 2026-08-29).
          Погашенная кнопка — обещание действия, которого нет: человек видит её,
          тянется нажать и получает отказ. Отсутствие кнопки говорит то же самое
          честнее и короче, а «действует сейчас» уже сказано над карточкой. */}
      {!done && (
        <div className="flex items-center gap-3">
          <Button type="button" onClick={choose} disabled={busy} data-mode-choose={mode} className="h-10 px-5">
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {busy ? ui.saving : ui.choose}
          </Button>
        </div>
      )}
    </section>
  )
}
