import type { SectionRenderer } from '@/sections/contract'
import type { FeatureIcon, Tone } from '@/lib/content/blocks/types'
import {
  Bot, Mic, ShieldCheck, Database, DatabaseBackup, GitBranch, Zap,
  ShoppingBag, Globe, Crosshair, Split, LayoutTemplate, Map, MessageSquare, Search,
} from 'lucide-react'
import { H4, P } from '@/components/ui/typography'
import { inline } from '@/lib/content/blocks/inline'
import { SectionHead } from '@/sections/section-head.server'
import { badgeClass } from '@/sections/tone'

// СЕТКА ВОЗМОЖНОСТЕЙ — ПЕРЕНОС ИЗ `features-grid.tsx` ВИТРИНЫ (шаг 54, 2026-08-30).
//
// Форма взята готовой: две колонки на телефоне, три на мониторе; у каждой ячейки
// значок, заголовок, ярлык-пилюля под ним и описание.
//
// 🔒 ЗНАЧОК ВЫБИРАЕТСЯ ИМЕНЕМ, А НЕ ПОРЯДКОМ, И ЭТО ЕДИНСТВЕННОЕ ОТСТУПЛЕНИЕ ОТ
// ИСТОЧНИКА ПО УСТРОЙСТВУ. Там значки лежат массивом и раздаются по индексу:
// двенадцатая возможность получает двенадцатый значок. Вставка новой строки
// посередине сдвигает все последующие — молча, потому что каждая ячейка
// по-прежнему со значком, просто не со своим. У витрины список правит один
// человек; каталогом пользуются чужие проекты, и там такая связь не выживет.
//
// 🔒 ЦВЕТ — СМЫСЛОВАЯ ГРУППА, А НЕ ПРИЗНАК `vip`. В источнике булево поле красит
// ячейку в жёлтый. Булево умеет только «да» и «нет»: третья категория потребует
// второго поля, четвёртая — третьего. Тон отвечает на вопрос «что это за группа»
// и уже работает у `badges` и `noBill` — общая карта `sections/tone.ts`.
//
// 🔒 ЗНАЧОК И ЯРЛЫК КРАСЯТСЯ ОДНИМ ТОНОМ. Разные цвета у метки и её же значка
// читаются как две разные пометки на одной ячейке.
const ICONS: Record<FeatureIcon, typeof Bot> = {
  agent: Bot,
  voice: Mic,
  shield: ShieldCheck,
  data: Database,
  backup: DatabaseBackup,
  branch: GitBranch,
  speed: Zap,
  shop: ShoppingBag,
  globe: Globe,
  target: Crosshair,
  split: Split,
  layout: LayoutTemplate,
  map: Map,
  channel: MessageSquare,
  search: Search,
}

// 🔒 КЛАССЫ ПЕРЕЧИСЛЕНЫ ЦЕЛИКОМ, А НЕ СОБРАНЫ ИЗ КУСКОВ. Первая редакция писала
// `text-tone-${tone}` шаблонной строкой — и это молчаливый отказ: Tailwind ищет
// имена классов ТЕКСТОМ в исходнике, собранного из переменной он не видит, класс
// не попадает в сборку, и значок остаётся чёрным. Ни один гейт этого не ловит:
// разметка верна, класс написан, стиля нет. Та же причина, по которой рядом в
// `tone.ts` перечислены все пять строк.
const ICON_TONE: Record<Tone, string> = {
  data: 'text-tone-data',
  reach: 'text-tone-reach',
  access: 'text-tone-access',
  code: 'text-tone-code',
  muted: 'text-muted-foreground',
}

export const featureGrid: SectionRenderer<'featureGrid'> = (b, { key: k }) => (
  <section key={k} className="mt-8 flex w-full flex-col gap-6">
    {b.title && (
      <SectionHead
        id={`${k}-t`}
        badge={b.badge}
        title={b.title}
        note={b.note ? inline(b.note, `${k}-n`) : undefined}
      />
    )}

    {/* Промежутки между строками ЗАМЕТНО больше, чем между колонками: ячейки без
        рамок, и только расстояние отделяет одну возможность от другой. Одинаковый
        зазор превратил бы сетку в сплошное поле текста. */}
    <ul data-feature-grid className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-8">
      {b.items.map((item, i) => {
        const Icon = item.icon ? ICONS[item.icon] : null
        const tone = item.tone ?? 'muted'
        return (
          <li key={`${k}-i-${i}`} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {Icon && <Icon className={`h-[22px] w-[22px] shrink-0 ${ICON_TONE[tone]}`} aria-hidden />}
              <H4>{inline(item.title, `${k}-i-${i}-t`)}</H4>
            </div>
            {item.label && <span className={`self-start ${badgeClass(tone)}`}>{item.label}</span>}
            <P className="text-muted-foreground">{inline(item.text, `${k}-i-${i}-x`)}</P>
          </li>
        )
      })}
    </ul>
  </section>
)
