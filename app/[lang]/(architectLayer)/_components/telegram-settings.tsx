import { MessagesSquare, CheckCircle2, ChevronRight, XCircle, AlertTriangle, Timer, ScrollText } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { TelegramSetup } from "./telegram-setup.client"
import {
  type AddBotLabels,
  TelegramAddBot,
  TelegramRemoveBot,
} from "./telegram-add-bot.client"
import { TelegramSchedule } from "./telegram-schedule.client"
import { OpenAiKeySection } from "./openai-key"
import { AnthropicKeySection } from "./anthropic-key"
import { FactsRegistrySection } from "./facts-registry"
import { ToolsRegistry } from "./tools-registry"
import { InProgress } from "./in-progress"
import { SettingsCard } from "./settings-card"
import type { ChannelsState, TelegramState } from "@/lib/architect/channels"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// РАЗДЕЛ «НАСТРОЙКИ» ВХОДА «TELEGRAM-БОТ» — ПЕРЕНЕСЁН ИЗ ПАНЕЛИ (77-4),
// ПЕРЕЛОЖЕН И ДОПОЛНЕН (77-8, 77-9, 2026-09-01).
//
// 🔒 ТРИ КАРТОЧКИ В СМЫСЛОВОМ ПОРЯДКЕ, И ПОРЯДОК НАЗВАН ВЛАДЕЛЬЦЕМ:
//   1) «Telegram» — какой это бот, включён ли канал, кому он пишет;
//   2) «Ключ OpenAI» — без него бот не расшифрует голос и не соберёт ответ,
//      поэтому он стоит ВТОРЫМ, а не в отдельном разделе: «в одной настройке мы
//      должны пробросить сразу две»;
//   3) «Расписание» — как часто дёргать проект.
//
// 🔒 ТРИ СОСТОЯНИЯ БОТА РАЗЛИЧАЮТСЯ ВИДОМ, А НЕ ОТТЕНКОМ ОДНОГО, И ПРИЧИНА
// ПЕРЕЕХАЛА ВМЕСТЕ С НИМИ: лечение у них разное.
//   • служба не запущена → `pm2 start fractera-channels`;
//   • токен не сохранён  → взять у @BotFather;
//   • токен есть, Telegram его не узнаёт → он набран с ошибкой или отозван.
//
// 🔒 СЕРВЕРНЫЙ: резолвит слова и отдаёт островкам СТРОКИ ПОИМЁННО (76-4).

export function TelegramSettings({
  lang,
  state,
  ui,
}: {
  lang: string
  state: ChannelsState
  ui: TelegramUi
}) {
  const w = ui.settings
  const tg = state.telegram

  // 🔒 СЛУЖБА НЕ ОТВЕТИЛА — ЭТО ОТДЕЛЬНЫЙ ЭКРАН, А НЕ ПУСТАЯ ФОРМА. И это
  // НОРМАЛЬНОЕ состояние на машине человека: служба каналов принадлежит
  // платформе и живёт на сервере.
  if (!state.available) {
    return (
      <div className="flex flex-col gap-4">
        <div
          data-telegram-settings="service-down"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <Small className="text-destructive">{w.serviceDown}</Small>
            <code className="w-fit rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[length:var(--fs-small)]">
              pm2 start fractera-channels
            </code>
          </div>
        </div>

        {/* 🔒 РЕЕСТР ВИДЕН, ДАЖЕ КОГДА СЛУЖБА ЛЕЖИТ, И ЭТО НЕ МЕЛОЧЬ.
            ✗ Найдено измерением 81-3: карточка была смонтирована ВНУТРИ раздела,
            который при отказе службы исчезает целиком, — и на машине человека,
            где службы каналов нет по устройству, реестра не существовало вовсе.
            Реестр описывает ПРОЕКТ, а не бота: он про то, что система умеет
            вынимать из любого сообщения, и от живости Telegram не зависит. */}
        <FactsRegistrySection lang={lang} ui={ui} />
        <ToolsRegistry />
      </div>
    )
  }

  const configured = Boolean(tg?.configured)

  // 🔒 БОТОВ МОЖЕТ БЫТЬ НЕСКОЛЬКО (99-4, слово владельца 2026-09-03: «нет никакой
  // разницы, сколько подключится телеграммов — каждый из них создаст просто свой
  // чат»). Список приходит от службы; пустой заменяется одной пустой строкой,
  // чтобы человеку было куда вписать первый токен.
  const bots = state.bots.length > 0 ? state.bots : tg ? [tg] : [{ ...EMPTY_BOT }]

  // 🔒 ОТКРЫТА КАРТОЧКА ТОГО, КОМУ НУЖНО ВНИМАНИЕ, А НЕ ПРОСТО ПЕРВАЯ. Только
  // что добавленный бот — без токена, и человек добавил его именно затем, чтобы
  // вписать токен: заставлять его после этого раскрывать карточку руками значит
  // требовать лишнего движения там, где намерение очевидно.
  // Все настроены — открыт первый. Тот же довод, что у пульсирующей кнопки
  // привязки: зовём туда, где действие ещё не сделано.
  const needsToken = bots.findIndex(b => !b.configured)
  const openAt = needsToken >= 0 ? needsToken : 0

  // 🔒 СЛОВА СОБИРАЮТСЯ ОДИН РАЗ И ОТДАЮТСЯ ОСТРОВКАМ ПОИМЁННО (закон слоя):
  // тип не сужает рантайм, и по проводу уезжает всё переданное.
  const addLabels: AddBotLabels = {
    add: w.addBot,
    added: w.addedBot,
    adding: w.addingBot,
    confirmRemove: w.confirmRemoveBot,
    failed: w.failed,
    remove: w.removeBot,
    removed: w.removedBot,
    removing: w.removingBot,
  }

  return (
    <div data-telegram-settings="ready" className="flex flex-col gap-4">
      {/* ── 1. Telegram: по строке на бота ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <MessagesSquare className="size-4 text-muted-foreground" />
          <H4 variant="ui">{w.botsTitle.replace("{n}", String(bots.length))}</H4>
        </span>
        <TelegramAddBot labels={addLabels} />
      </div>

      {bots.map((b, i) => (
        <TelegramBotCard
          key={b.id ?? `bot-${i}`}
          bot={b}
          index={i}
          open={i === openAt}
          w={w}
          addLabels={addLabels}
        />
      ))}

      {/* ── 2. Ключ OpenAI ──────────────────────────────────────────────── */}
      <OpenAiKeySection ui={ui} />

      {/* ── 2а. Ключ Anthropic (113-2) ───────────────────────────────────
          🔒 СТОИТ РЯДОМ С КЛЮЧОМ OPENAI, А НЕ В РАЗДЕЛЕ СТРАТЕГИИ. Оба отвечают
          на один вопрос — «чем оплачен ответ», — и человек, пришедший заводить
          ключи, ищет их в одном месте. Раздел стратегии отвечает на другой
          вопрос: КАКИМ путём идёт автоматизация.
          🛑 И ключ OpenAI нужен в ЛЮБОМ режиме: голос, векторная память и граф
          знаний живут на нём. Разнеси их по разным экранам — и это перестанет
          быть видно рядом. */}
      <AnthropicKeySection />
      <TelegramTail configured={configured} lang={lang} tg={tg} ui={ui} />
    </div>
  )
}

/** Пустой бот — строка, в которую человек вписывает первый токен. */
const EMPTY_BOT = {
  bot: null,
  chatId: null,
  configured: false,
  enabled: true,
  reachable: false,
  who: null,
}

/**
 * Одна строка аккордеона — один бот.
 *
 * 🔒 РАСКРЫТИЕ ДЕЛАЕТ `<details>` БРАУЗЕРА, БЕЗ ЕДИНОЙ СТРОКИ JS. Закон проекта:
 * сначала спроси, нужен ли островок вообще. Здесь не нужен — состояние
 * «раскрыто» браузер держит сам, и это работает даже без скриптов.
 *
 * 🔒 ОТКРЫТ РОВНО ОДИН, И ЭТО ПРАВКА ВЛАДЕЛЬЦА 2026-09-03, ДОСЛОВНО: «я ожидал,
 * чтобы это было в формате карточек, которые закрываются и открываются, причём
 * чтобы зараз можно было видеть только одного бота, потому что в проекте может
 * быть множество ботов, и это неудобно, когда все открыты».
 *
 * 🔒 ВЗАИМНОЕ ИСКЛЮЧЕНИЕ ДАЁТ АТРИБУТ `name` — ЭТО РОДНОЕ СВОЙСТВО БРАУЗЕРА, А
 * НЕ НАШ КОД. Общее имя у группы `<details>` означает «открыт может быть только
 * один»: открывая соседа, браузер сам закрывает предыдущий. Своё состояние
 * потребовало бы островка и дало бы то же самое хуже.
 *
 * 🛑 В СТАРОМ БРАУЗЕРЕ, НЕ ЗНАЮЩЕМ `name`, КАРТОЧКИ ПРОСТО ОТКРЫВАЮТСЯ ВСЕ —
 * это ухудшение вида, а не потеря способности, и оно названо здесь, чтобы
 * следующий не счёл его дефектом.
 */
function TelegramBotCard({
  bot: tg,
  index,
  open,
  w,
  addLabels,
}: {
  bot: TelegramState
  index: number
  open: boolean
  w: TelegramUi["settings"]
  addLabels: AddBotLabels
}) {
  const configured = Boolean(tg?.configured)
  const heading = tg.bot ? `@${tg.bot}` : w.botUnnamed.replace("{n}", String(index + 1))

  return (
    <details
      className="rounded-lg border border-border"
      data-telegram-bot={tg.id ?? `b${index + 1}`}
      name="telegram-bot"
      open={open}
    >
      <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-3 py-2 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform [details[open]_&]:rotate-90" />
        <span className="flex flex-1 items-center gap-2">
          <MessagesSquare className="size-4 text-muted-foreground" />
          <H4 variant="ui">{heading}</H4>
        </span>

          {tg?.chatId ? (
            <span
              data-telegram-link="linked"
              className="inline-flex items-center gap-1.5 text-[length:var(--fs-small)] text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-3.5" />
              {w.linkedTo.replace("{who}", tg.who ?? tg.chatId)}
            </span>
          ) : configured ? (
            <span
              data-telegram-link="not-linked"
              className="text-[length:var(--fs-small)] text-amber-700 dark:text-amber-300"
            >
              {w.notLinked}
            </span>
          ) : (
            <span
              data-telegram-link="no-token"
              className="text-[length:var(--fs-small)] text-muted-foreground"
            >
              {w.noToken}
            </span>
          )}
        {tg.id ? <TelegramRemoveBot botId={tg.id} labels={addLabels} /> : null}
      </summary>

      <div className="border-border border-t">
        <div className="flex flex-col gap-4 p-3">
          {/* 🔒 ТОКЕН ЕСТЬ, НО TELEGRAM ЕГО НЕ УЗНАЁТ — ОТДЕЛЬНОЕ СОСТОЯНИЕ, а не
              приписка в подписи поля: лечение у него своё. */}
          {configured && !tg?.reachable && (
            <p
              data-telegram-state="rejected"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-2.5"
            >
              <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              <Small className="text-destructive">{w.tokenRejected}</Small>
            </p>
          )}

          {configured && tg?.reachable && tg.bot && (
            <Small data-telegram-state="ok" className="text-muted-foreground">
              {w.currentBot} <span className="font-mono text-foreground">@{tg.bot}</span>
            </Small>
          )}

          <TelegramSetup
            botId={tg.id}
            configured={configured}
            // 🔒 ФОРМА ЗНАЕТ О ПРИВЯЗКЕ, ПОТОМУ ЧТО ЕЙ НУЖНО ЗВАТЬ ЧЕЛОВЕКА
            // (правка владельца 2026-09-03): «после добавления токена нужно
            // сделать чтобы кнопка привязать учётную запись становилась
            // пульсирующей с фирменным цветом, потому что пользователь забывает
            // нажать эту кнопку». Признак — сам факт привязки, а не отдельное
            // «показать пульсацию»: правда о состоянии живёт там же, где сама
            // способность, и не может разойтись с ней.
            linked={Boolean(tg?.chatId)}
            enabled={tg?.enabled !== false}
            labels={{
              tokenLabel: w.tokenLabel,
              tokenPlaceholder: w.tokenPlaceholder,
              tokenReplace: w.tokenReplace,
              save: w.save,
              saving: w.saving,
              saved: w.saved,
              failed: w.failed,
              // Кнопка называет то, что произойдёт: у привязанного чата это
              // ЗАМЕНА привязки, а не первая её постановка.
              connect: tg?.chatId ? w.relink : w.connect,
              relink: w.relink,
              waiting: w.waiting,
              openTelegram: w.openTelegram,
              linked: w.linkedToast,
              linkTimeout: w.linkTimeout,
              linkExpired: w.linkExpired,
              linkFailed: w.linkFailed,
              channelOn: w.channelOn,
              // 🔒 ТЕКСТ НЕ ПЕРЕПИСАН — ПЕРЕЕХАЛ. Он же был внизу экрана сноской;
              // теперь стоит предупреждением у кнопки, к которой относится.
              afterLink: `${w.answersFrom} ${w.neverInvents}`,
            }}
          />
        </div>
      </div>
    </details>
  )
}

/**
 * Всё, что принадлежит ПРОЕКТУ, а не боту.
 *
 * 🔒 РАСПИСАНИЕ, РЕЕСТР ПРИЗНАКОВ, ИНСТРУМЕНТЫ И ИНСТРУКЦИЯ ОСТАЮТСЯ В
 * ЕДИНСТВЕННОМ ЧИСЛЕ, И ЭТО НЕ ЛЕНЬ. Реестр говорит, что система умеет вынимать
 * из ЛЮБОГО сообщения; расписание дёргает ПРОЕКТ по времени. Раздать их по
 * ботам значило бы завести по копии правды на бота — ровно то, чего мы избегаем.
 */
function TelegramTail({
  configured,
  lang,
  tg,
  ui,
}: {
  configured: boolean
  lang: string
  tg: TelegramState | null
  ui: TelegramUi
}) {
  const w = ui.settings
  return (
    <>
      {/* ── 3. Расписание ───────────────────────────────────────────────── */}
      <SettingsCard
        mark={{ "data-schedule-card": "" }}
        icon={<Timer className="size-4 text-muted-foreground" />}
        title={w.scheduleLabel}
      >
          <TelegramSchedule
            configured={configured}
            tickSeconds={Number(tg?.tickSeconds ?? 0)}
            labels={{
              scheduleOff: w.scheduleOff,
              scheduleEvery: w.scheduleEvery,
              scheduleSaved: w.scheduleSaved,
              scheduleHint: w.scheduleHint,
              failed: w.failed,
            }}
          />
      </SettingsCard>
      {/* ── 4. Реестр признаков (81-3) ──────────────────────────────────
          🔒 МЕСТО НАЗВАНО ВЛАДЕЛЬЦЕМ: он ответил адресом этого раздела на
          прямой вопрос, где живёт реестр. Стоит ПЕРЕД инструкцией боту:
          реестр говорит, что система умеет вынимать, а инструкция — как ей
          об этом рассказывать. Порядок смысловой, как у трёх карточек выше. */}
      <FactsRegistrySection lang={lang} ui={ui} />
      <ToolsRegistry />

      {/* ── 5. Ваша инструкция боту — каркас (77-15) ─────────────────────────
          🔒 МЕСТО ЗАНЯТО ЗАРАНЕЕ ПО ПРЯМОМУ СЛОВУ ВЛАДЕЛЬЦА: «создаём на этой
          странице ещё одну вкладку ниже расписание и также пишем там просто текст
          что скоро будет добавлена». Раздел, появившийся потом из ниоткуда,
          заметить труднее, чем тот, который сам сказал, что он будет (28-13).
          🛑 ЗДЕСЬ БУДЕТ ТЕКСТ, КОТОРЫЙ ЕДЕТ В ИНСТРУКЦИЮ БОТА ДОБАВКОЙ к его
          собственным правилам — а значит это поле влияет на поведение продукта,
          и его ТЗ (77-19) отдельно называет, что оно НЕ отменяет. */}
      <div className="rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex flex-1 items-center gap-2">
            <ScrollText className="size-4 text-muted-foreground" />
            <H4 variant="ui">{ui.skeleton.instructionTitle}</H4>
          </span>
        </div>
        <div className="p-3">
          <InProgress
            where="instruction"
            label={ui.skeleton.inProgress}
            lead={ui.skeleton.instructionLead}
          />
        </div>
      </div>
    </>
  )
}
