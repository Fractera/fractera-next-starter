import { Bot, ScanSearch, Sparkles } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { readRawPlatformConfig } from "@/lib/architect/platform-config-writer"
import { AgentCapabilities } from "./agent-capabilities"
import { AutomationMode } from "./automation-mode.client"
import { SettingsCard } from "./settings-card"
import { InProgress } from "./in-progress"
import { automationModeOf } from "../_lib/automation-strategy"

// РАЗДЕЛ «СТРАТЕГИЯ АВТОМАТИЗАЦИИ» (112-3, 112-4, 2026-09-04).
//
// 🔒 ЭТОТ ЭКРАН — ВТОРАЯ ДВЕРЬ К ЧУЖОМУ ЗНАЧЕНИЮ, А НЕ ЕГО ХОЗЯИН. Решение
// владельца дословно: переключатель в поле ввода чата «будет по факту первичный и
// основной», а эта секция — «просто дополнительный механизм управления, дверь»,
// «ядро живёт порт 3600». Поэтому здесь нет ни своего ключа, ни своего умолчания:
// и то и другое живёт в `_lib/automation-strategy.ts` рядом с чатовым близнецом.
//
// 🔒 ДВА ОПИСАНИЯ ПОКАЗАНЫ РАСКРЫТЫМИ, И ЭТО НЕ ЗАБЫТЫЙ АККОРДЕОН. Складываются
// НАСТРОЙКИ — их прячут законно; здесь же объяснение самого выбора, и спрятав его
// под складку, мы предложили бы выбирать вслепую. Ниже, в панелях режимов, всё
// складное и закрыто по умолчанию — прямое слово владельца.
//
// 🛑 СЕГОДНЯ ЗА ПЕРЕКЛЮЧАТЕЛЕМ НЕТ ПОВЕДЕНИЯ НИ В ОДНОМ ПОЛОЖЕНИИ, И ЭТО СКАЗАНО
// СЛОВАМИ. Владелец 2026-09-04: «Сейчас она в чат ни в одном из режимов ничего
// делать не умеет… Пусть оно переключается но ни на что не влияет пока». Молча
// ничего не делающий орган управления читается как поломка, а не как «рано»
// (закон 28-13, оплачен погашенной кнопкой 33-12).
//
// 🔒 СЕРВЕРНЫЙ: обе панели рисует сервер и отдаёт островку готовой разметкой —
// островок лишь показывает одну из двух. Так переключение мгновенное, а
// содержимое остаётся серверным, как велит закон слоя.

export function AutomationStrategySection({ lang }: { lang: string }) {
  const mode = automationModeOf(readRawPlatformConfig())

  return (
    <div className="flex flex-col gap-4" data-automation-strategy="ready">
      <div className="flex flex-col gap-3">
        <H4 variant="ui">
          Архитектура Fractera предлагает вам на выбор два стандартных способа работы с
          автоматизацией агентов
        </H4>

        {/* 🔒 ПОРЯДОК ОПИСАНИЙ ПОВТОРЯЕТ ПОРЯДОК ПЕРЕКЛЮЧАТЕЛЯ: сперва то, что
            действует по умолчанию. Обратный порядок заставлял бы читать снизу вверх. */}
        <StrategyBlurb
          icon={<Sparkles className="size-4 text-muted-foreground" />}
          title="Claude Agent SDK"
          mark="claude"
        >
          Работает на стандартных алгоритмах Anthropic; автоматизация управляется через создание
          навыков и MCP. Подходит для не очень активного использования агентной автоматизации.
          <br />
          <strong className="text-foreground">OpenAI нужен всё равно:</strong> расшифровка голоса
          при голосовом вводе, агентный RAG и векторная память работают на нём в любом режиме.
        </StrategyBlurb>

        <StrategyBlurb
          icon={<Bot className="size-4 text-muted-foreground" />}
          title="Ручное управление через AI SDK с моделями OpenAI"
          mark="openai"
        >
          Вы сами выбираете, достаточно ли вашим процессам экстремально дешёвых моделей в
          комбинации с дорогими на отдельных участках. Это позволяет тоньше разработать
          архитектуру и при необходимости масштабировать её на промышленное использование с
          большим числом пользователей.
        </StrategyBlurb>
      </div>

      {/* 🔒 ПЕРЕКЛЮЧАТЕЛЬ ОДИН НА ДВЕ ПОВЕРХНОСТИ: этот и тот, что в поле ввода
          чата, пишут ОДИН ключ. Своё состояние здесь было бы второй правдой,
          расходящейся с чатом на первом же переключении. */}
      <AutomationMode
        initial={mode}
        cloudPanel={<CloudPanel />}
        manualPanel={<ManualPanel lang={lang} />}
      />
    </div>
  )
}

/**
 * Описание одного способа — раскрыто всегда.
 *
 * 🔒 ПРИЗНАК РАЗМЕТКИ СТОИТ ЗДЕСЬ, А НЕ НА ПАНЕЛИ: описание видно в ОБОИХ режимах,
 * а панель — только в своём. Считая одно вместо другого, доказательство мерило бы
 * присутствие слова, а не показ описания.
 */
function StrategyBlurb({
  children,
  icon,
  mark,
  title,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  mark: string
  title: string
}) {
  return (
    <div className="rounded-lg border border-border p-3" data-automation-blurb={mark}>
      <span className="mb-1.5 flex items-center gap-2">
        {icon}
        <H4 variant="ui">{title}</H4>
      </span>
      <Small className="block leading-relaxed text-muted-foreground">{children}</Small>
    </div>
  )
}

/**
 * Панель автоматического режима.
 *
 * 🔒 ДВА АККОРДЕОНА, У КАЖДОГО ВЛОЖЕННЫЙ — форма названа владельцем дословно:
 * «два аккордеона каждая из которых будет иметь вложенные аккордеоны, первый это
 * скилы второй это MCP, пока нигде ничего нет». Вложенность даёт сам `<details>`
 * внутри `<details>`, без единой строки JS.
 */
function CloudPanel() {
  return (
    <div className="flex flex-col gap-3" data-automation-panel="claude">
      <H4 variant="ui">Настройка автоматического режима</H4>

      {/* 🪦 ЗДЕСЬ СТОЯЛИ ДВЕ ЗАГЛУШКИ «Пока ничего нет» (112-4). Заменены живой
          витриной 2026-09-04 (113-4): она спрашивает у чата, что видит САМ SDK,
          а не рисует обещание. Пустой список остался — но теперь он пуст по
          измерению, а не по замыслу, и называет адрес, куда класть навык. */}
      <AgentCapabilities />
    </div>
  )
}

/**
 * Панель ручного режима.
 *
 * 🔒 ОДИН АККОРДЕОН С ВЛОЖЕННЫМ — тоже дословно: «Первый аккордеон разбор
 * входящего сообщения — агенты AI SDK». Больше в этом шаге не строится, и это
 * названо в ТЗ, а не забыто.
 */
function ManualPanel({ lang }: { lang: string }) {
  return (
    <div className="flex flex-col gap-3" data-automation-panel="openai">
      <H4 variant="ui">Настройка ручного конвейера автоматизации</H4>

      <SettingsCard
        mark={{ "data-automation-group": "intake" }}
        icon={<ScanSearch className="size-4 text-muted-foreground" />}
        title="Разбор входящего сообщения"
      >
        <SettingsCard
          mark={{ "data-automation-slot": "intake-agents" }}
          icon={<Bot className="size-4 text-muted-foreground" />}
          title="Агенты AI SDK"
        >
          {/* 🛑 ЗДЕСЬ БУДУТ ПЕРСОНАЛЬНЫЕ НАСТРОЙКИ КАЖДОГО АГЕНТА, И ИМЕННО РАДИ
              НИХ ИЗ ЧАТА УБРАН ВЫБОР МОДЕЛИ. Слово владельца: «мы позволим
              пользователю самостоятельно определить для каких агентов он выберет
              слабую модель, а для каких сильную… для каждого элемента реестра
              признаков создан свой агент». Пока их нет, сказать об этом честнее,
              чем показать пустую таблицу. */}
          <InProgress
            where="automation-intake-agents"
            label="Пока ничего нет"
            lead={`Здесь у каждого агента появится своя модель: слабая там, где хватает, сильная там, где нужно. Агент заводится под каждый элемент реестра признаков — сам реестр уже есть, на вкладке «Настройки» (/${lang}/architect/telegram?section=settings).`}
          />
        </SettingsCard>
      </SettingsCard>
    </div>
  )
}
