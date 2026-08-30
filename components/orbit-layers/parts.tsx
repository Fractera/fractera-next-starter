import type { CSSProperties, ElementType, ReactNode } from "react"
import {
  Bot, Mic, ShieldCheck, Database, DatabaseBackup, GitBranch, Gauge,
  ShoppingCart, Globe, Target, Split, LayoutGrid, Map as MapIcon, Send, Search,
} from "lucide-react"
import { H2, H3, Lead, Small } from "@/components/ui/typography"
import { badgeClass } from "@/sections/tone"
import type { FeatureIcon, OrbitLayerCard } from "@/lib/content/blocks/types"

// РАЗМЕТКА ВИДА `orbitLayers` — ОДНА НА ОБЕ ВЕРСИИ (шаг 60, 2026-08-30).
//
// 🔒 ОТКУДА ЭТО ВЗЯЛОСЬ. Рисунок перенесён из виджета
// `app/[lang]/(publicLayer)/_widgets/static/security-orbit` по прямому указанию
// владельца: «значит мы можем сейчас перенести этот блок в блоки… пусть остаётся
// и в виджетах, и в блоках, а я потом в виджеты придумаю, что поставить».
//
// 🔒 ЭТО ПОРТ, А НЕ ОБЩАЯ БИБЛИОТЕКА, И ЭТО СОЗНАТЕЛЬНО. Импортировать разметку
// из папки виджета значило бы протянуть зависимость из `sections/` внутрь
// маршрута: виджет перестал бы быть удаляемым, а опыт удаления — единственная
// его приёмка. Владелец сказал, что виджет он заменит; две копии РАЗОЙДУТСЯ, и
// это ожидаемо, а не дефект.
//
// 🔒 ЧТО ИЗМЕНИЛОСЬ ПРИ ПЕРЕНОСЕ — РОВНО ОДНО: слова больше не приходят из
// словаря виджета, они поля блока. Значок карточки назван СЛОВОМ, а не взят по
// порядку: массив значков, раздаваемый по индексу, молча сдвигается при вставке
// строки посередине. Тот же закон уже оплачен у `featureGrid`.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ ФАЙЛ, ЕСЛИ ВЕРСИЙ ВСЕГО ДВЕ. Статический близнец и
// анимированная версия обязаны совпадать по геометрии до пикселя на ЛЮБОЙ
// ширине. Две копии разметки расходятся на первой же правке — и расходятся
// молча, потому что вторую видит только тот, кто разбудил движение. Поэтому
// раскладка живёт здесь один раз, а версии отличаются ровно одним: чем обёрнут
// элемент. `Wrapper` — это `div` у близнеца и `motion.div` у анимированной.

/**
 * Значки — по имени из общего словаря `FeatureIcon`.
 *
 * 🔒 `Record<FeatureIcon, …>` ИСЧЕРПЫВАЮЩ, И В ЭТОМ ВЕСЬ СМЫСЛ. Появится новый
 * значок в словаре — этот файл перестанет компилироваться, и разойтись со
 * словарём молча он не сможет.
 */
const ICONS: Record<FeatureIcon, typeof Bot> = {
  agent: Bot, voice: Mic, shield: ShieldCheck, data: Database, backup: DatabaseBackup,
  branch: GitBranch, speed: Gauge, shop: ShoppingCart, globe: Globe, target: Target,
  split: Split, layout: LayoutGrid, map: MapIcon, channel: Send, search: Search,
}

// 🔒 КОЛЬЦА ЗАПИСАНЫ КЛАССАМИ ЦЕЛИКОМ, а не собраны из кусков в цикле. Tailwind
// читает исходник ТЕКСТОМ: класса, склеенного в рантайме (`border-primary/${n}`),
// в сборке не окажется вовсе, и кольцо выйдет невидимым — при зелёных типах.
export const RINGS = [
  "absolute inset-0 rounded-full border border-primary/15",
  "absolute inset-[8%] rounded-full border border-primary/20",
  "absolute inset-[18%] rounded-full border border-primary/25",
] as const

/** Классы, от которых зависит РАЗМЕР И МЕСТО: обе версии берут их отсюда. */
export const CLS = {
  orbit: "relative mx-auto aspect-square w-full max-w-[440px] xl:max-w-[480px]",
  shield:
    "relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60",
  // 🔒 ПОДСВЕТКА — ОБЩИЙ КЛАСС `flow-card` ИЗ `styles/globals.css`, а не свой
  // набор. Он зажигает рамку акцентом, кладёт свечение и приподнимает карточку в
  // её такт — чистым CSS, без JavaScript, и сам замирает при «уменьшить
  // движение». Свои классы здесь означали бы вторую подсветку в проекте, которая
  // разойдётся с первой на первой же правке палитры.
  card:
    "flow-card group relative flex items-start gap-4 overflow-hidden rounded-2xl border bg-card p-5 sm:gap-5 sm:p-6",
  cardIcon:
    "relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20",
  chip:
    "mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.07] px-2.5 py-0.5 font-mono text-[length:var(--fs-eyebrow)] tracking-wider text-primary",
  corner: "absolute w-[42%] xl:w-[40%]",
} as const

/** Вращающийся сектор кольца. Цвет — токен, а не значение: тема его слышит. */
export const SWEEP_STYLE = {
  backgroundImage:
    "conic-gradient(transparent 0deg, color-mix(in oklab, var(--primary) 25%, transparent) 45deg, transparent 90deg)",
  maskImage: "radial-gradient(circle, transparent 50%, black 75%)",
  WebkitMaskImage: "radial-gradient(circle, transparent 50%, black 75%)",
} as const

/** Слова рамы: всё, что рисуется вокруг орбиты. */
export type OrbitLayersUi = {
  badge?: string
  title: string
  accent?: string
  lead?: string
  cards: readonly OrbitLayerCard[]
  /** Значок в центре орбиты. Нет — щит, как в источнике. */
  core?: FeatureIcon
}

type WrapProps = { Wrapper?: ElementType; wrapperProps?: Record<string, unknown> }

/**
 * Орбита: три кольца, подложка, вращающийся сектор и значок в центре.
 *
 * `sweep` — узел сектора: близнец рисует его неподвижным, анимированная версия
 * оборачивает в `motion.div` и вращает. Свечение центра сделано размытым пятном
 * под ним, а не тенью со значением цвета, — пятно тоже слышит палитру.
 */
export function Orbit(
  { sweep, core, Wrapper = "div", wrapperProps }: WrapProps & { sweep?: ReactNode; core?: FeatureIcon },
) {
  const Core = core ? ICONS[core] : ShieldCheck
  return (
    <div className={CLS.orbit}>
      {RINGS.map(ring => <div key={ring} aria-hidden className={ring} />)}
      <div
        aria-hidden
        className="absolute inset-[28%] rounded-full bg-primary/[0.06] ring-1 ring-inset ring-primary/15 backdrop-blur"
      />
      {sweep ?? <div aria-hidden className="absolute inset-[8%] rounded-full" style={SWEEP_STYLE} />}

      <div className="absolute inset-0 flex items-center justify-center">
        <Wrapper className={CLS.shield} {...wrapperProps}>
          <span aria-hidden className="absolute inset-0 -z-10 rounded-3xl bg-primary/50 blur-2xl" />
          <Core size={56} strokeWidth={1.8} className="text-primary-foreground" aria-hidden />
        </Wrapper>
      </div>
    </div>
  )
}

/**
 * Карточка слоя.
 *
 * 🔒 НОМЕР — ЧАСТЬ СМЫСЛА, а не украшение: он связывает карточку с её местом на
 * орбите. Поэтому он приходит сюда числом, а не рисуется счётчиком разметки.
 */
export function Card(
  { card, index, Wrapper = "div", wrapperProps }: WrapProps & { card: OrbitLayerCard; index: number },
) {
  const Icon = card.icon ? ICONS[card.icon] : null
  return (
    // `--flow-i` — очередь карточки в такте: та же переменная, что у шагов
    // раздела о переносе, поэтому зажигаются они по очереди одинаково.
    <Wrapper className={CLS.card} style={{ "--flow-i": index } as CSSProperties} {...wrapperProps}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {Icon ? (
        <span className={CLS.cardIcon}>
          <Icon size={20} aria-hidden />
        </span>
      ) : null}
      <div className="relative min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <H3 variant="ui" className="leading-snug tracking-[-0.01em]">{card.title}</H3>
          {/* Номер бледный, но НЕ прозрачный: доля от токена (`/50`) ломает
              контраст в одной из двух тем и стережётся `check:contrast`. */}
          <span className="font-mono text-[length:var(--fs-eyebrow)] tabular-nums tracking-wider text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <Small className="mt-2 leading-relaxed">{card.text}</Small>
        {card.chip ? <span className={CLS.chip}>{card.chip}</span> : null}
      </div>
    </Wrapper>
  )
}

/**
 * Рама вида: заголовок и ДВЕ раскладки, сохранённые дословно.
 *
 * 🔒 ДО `lg` — столбик: орбита сверху, под ней сетка из двух колонок. ОТ `lg` —
 * орбита в центре поля высотой 560, четыре карточки по углам абсолютом. Обе
 * раскладки рисуют одни и те же карточки, поэтому `card()` и `orbit()` —
 * функции, а не готовые узлы: каждой раскладке нужен свой экземпляр, иначе
 * анимированные обёртки поделили бы состояние.
 *
 * 🔒 ПОРЯДОК УГЛОВ ЗНАЧИМ И ПЕРЕНЕСЁН КАК ЕСТЬ: 01 сверху слева, 03 сверху
 * справа, 02 снизу слева, 04 снизу справа — читается по диагонали.
 */
export function Frame(
  { ui, orbit, card }: { ui: OrbitLayersUi; orbit: () => ReactNode; card: (index: number) => ReactNode },
) {
  return (
    <section className="relative py-20 md:py-28" data-orbit-layers>
      {/* `flow` здесь ради ПЕРЕМЕННЫХ ритма (`--flow-beat`, `--flow-cycle`): без
          них `flow-card` не знает длительности и не зажигается вовсе. */}
      <div className="flow relative mx-auto max-w-6xl px-4 sm:px-6" style={{ "--flow-n": 4 } as CSSProperties}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 🔒 ЯРЛЫК РАЗДЕЛА — КЛАСС ПЛАТФОРМЫ (`sections/tone`), а не свои
              классы: тон ярлыка один на страницу, и написанный здесь он
              разошёлся бы с соседями на первой же смене палитры. */}
          {ui.badge ? <span className={`mb-4 ${badgeClass("data")}`}>{ui.badge}</span> : null}
          <H2>
            {ui.title}
            {ui.accent ? (
              <>
                {" "}
                <span className="bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">
                  {ui.accent}
                </span>
              </>
            ) : null}
          </H2>
          {ui.lead ? <Lead className="mx-auto mt-5 max-w-xl">{ui.lead}</Lead> : null}
        </div>

        {/* До `lg` — столбик. */}
        <div className="mt-12 flex flex-col items-center gap-8 lg:hidden">
          {orbit()}
          <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4">
            {ui.cards.map((_, i) => <div key={i}>{card(i)}</div>)}
          </div>
        </div>

        {/* От `lg` — орбита в центре, карточки по углам. */}
        <div className="relative mt-20 hidden lg:block">
          <div className="relative mx-auto min-h-[560px]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="pointer-events-auto w-[440px] xl:w-[480px]">{orbit()}</div>
            </div>
            <div className={`${CLS.corner} left-0 top-0`}>{card(0)}</div>
            <div className={`${CLS.corner} right-0 top-0`}>{card(2)}</div>
            <div className={`${CLS.corner} bottom-0 left-0`}>{card(1)}</div>
            <div className={`${CLS.corner} bottom-0 right-0`}>{card(3)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
