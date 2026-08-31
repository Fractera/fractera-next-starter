"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { AdviceNote } from "./advice-note"
import { adminBase } from "@/lib/runtime-urls"
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
 * зависит от того, что уже переехало в этот слой.
 *
 * 🔒 ОБЕ ДВЕРИ ВЕДУТ В ПАНЕЛЬ (решение владельца 2026-08-29): «для навигации
 * используем новую архитектуру, для работы старую». Пока способность живёт и
 * работает там, слой обязан вести к ней, а не заводить свою копию.
 *
 * ✗ ОПЛАЧЕНО 2026-08-31, И ОШИБКА БЫЛА НЕ В РАСЧЁТЕ, А В ПОИСКЕ. Адрес брался
 * ТОЛЬКО из настроек (`adminUrlFromSite(APP-CONFIG.url)`), пустых у каждого
 * нового сервера, — и дверь либо исчезала, либо (после 66-3) объявляла адрес
 * неизвестным. Владелец ответил ровно то, что следовало проверить самому:
 * «как это неизвестен… спуститесь в подвал и нажмите кнопку панель управления,
 * там всё известно».
 *
 * 🔒 ЭТУ ЖЕ ЗАДАЧУ ПРОЕКТ РЕШИЛ 2026-08-29 ДЛЯ КНОПКИ В ПОДВАЛЕ, и решение
 * лежало готовым: `lib/runtime-urls.ts`. Два источника, и ни один не угадывает —
 * сервер даёт адрес из настроек, когда они есть; иначе он ВЫЧИСЛЯЕТСЯ из адреса
 * окна (IP → `<хост>:3002`, домен → `admin.<апекс>`). Закон «выдуманный адрес
 * хуже отсутствующего» запрещает ВЫДУМЫВАТЬ, а не ВЫЧИСЛЯТЬ.
 *
 * 🔒 ВЫЧИСЛЕНИЕ ИДЁТ ПОСЛЕ ГИДРАТАЦИИ, И ЭТО НЕ ОСТОРОЖНОСТЬ, А НЕОБХОДИМОСТЬ.
 * На сервере `adminBase()` отдаёт `http://localhost:3002` — адрес МАШИНЫ
 * ПОСЕТИТЕЛЯ, а не сервера. Поставь его в ссылку на этапе разметки, и человек
 * уйдёт в никуда на собственном компьютере. Поэтому база приходит сюда готовой,
 * а считает её `useEffect` — тем же приёмом, что `AdminLink` в подвале.
 */
function doorHref(mode: DevMode, lang: string, base: string): string {
  if (!base) return ""
  return mode === "migration" ? `${base}/${lang}/migration` : `${base}/${lang}/products`
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

  // Адрес панели: сервер даёт его из настроек, когда они есть; иначе браузер
  // выводит из собственного адреса окна — после гидратации, не в разметке.
  const [base, setBase] = useState(adminUrl)
  useEffect(() => {
    if (!adminUrl) setBase(adminBase())
  }, [adminUrl])

  const isCurrent = mode === savedMode
  // 🔒 КНОПКИ НЕТ У ДЕЙСТВУЮЩЕГО РЕЖИМА — ТОЧКА (владелец 2026-08-31: «ты видишь,
  // что это шаг активный, но при этом кнопка продолжает гореть; я тебе раньше
  // давал задание: если шаг активный, то кнопка исчезает»).
  //
  // 🪦 ЗДЕСЬ СТОЯЛО `isCurrent && savedChosen`, и довод при нём был не пустой:
  // умолчание — `steps`, поэтому режим ДЕЙСТВУЕТ ещё до того, как его выбрали, и
  // без кнопки записать это решение было бы нечем. Довод верен, вывод был неверен:
  // кнопка «выбрать» на карточке, где сверху написано «сейчас», читается как
  // сломанная — человек нажимает её, чтобы проверить, а не чтобы решить.
  //
  // 🔒 ПОДТВЕРЖДЕНИЕ ПЕРЕЕХАЛО ТУДА, ГДЕ О НЁМ И ГОВОРЯТ — во врезку «режим ещё не
  // выбирали». Действие принадлежит тому блоку, который объясняет, почему оно
  // нужно; на карточке действующего режима ему делать нечего.
  const done = isCurrent

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
      {/* 🔒 ДВЕРЬ ЕСТЬ ВСЕГДА, ПОТОМУ ЧТО АДРЕС ВСЕГДА ВЫЧИСЛИМ (66-3 → 68).
          ✗ Дважды подряд здесь стояло условие на настройки: сперва блок исчезал
          молча, потом (66-3) честно объявлял адрес неизвестным. Второе было
          вежливее и так же неверно — владелец ответил тем, что следовало
          проверить самому: «спуститесь в подвал и нажмите кнопку панель
          управления, там всё известно». Адрес неизвестен не был никогда.

          🔒 ПОКА ПОВЕРХНОСТЬ КЕЙСОВ ПЕРЕЕЗЖАЕТ, ДВЕРЬ ВЕДЁТ В ПАНЕЛЬ, И ОБ ЭТОМ
          СКАЗАНО ПРЯМО. Данные при этом одни и те же — панель пишет в ту же папку
          продуктов. */}
      {words.door && doorHref(mode, lang, base) && (
        <div data-mode-door={mode} className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3">
          {/* 🔒 ПАНЕЛЬ ОТКРЫВАЕТСЯ НОВОЙ ВКЛАДКОЙ: это другое приложение и другой
              домен, и увести туда текущую вкладку значит выбросить человека из его
              проекта. `noopener` обязателен вместе с `_blank`. */}
          <a
            href={doorHref(mode, lang, base)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex w-fit items-center gap-2 text-[length:var(--fs-body)] font-medium text-primary hover:underline"
          >
            {words.door.label}
            <ArrowRight className="size-4" aria-hidden />
          </a>
          <Small>{words.door.hint}</Small>
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
