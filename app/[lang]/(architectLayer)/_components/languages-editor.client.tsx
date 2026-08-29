"use client"

import { useMemo, useState } from "react"
import { Check, Loader2, Search, Star, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { AdviceNote } from "./advice-note"
import type { GroupsUi } from "../_i18n/groups.i18n"

/** Одна строка каталога: всё уже разобрано сервером. */
export type LangRow = {
  code: string
  flag: string
  nativeName: string
  englishName: string
  /** Качество машинного перевода: `A` — высокое, `community` — данных мало. */
  tier: string
}

// НАБОР ЯЗЫКОВ САЙТА (31-16, 2026-08-29). Поиск и подсветка — 31-20.
//
// 🔒 РЕЧЬ О ЯЗЫКАХ ЭТОГО САЙТА, А НЕ ЭКРАНОВ НАСТРОЕК. Два разных набора, и путать
// их нельзя: снять здесь язык — значит перестать собирать для него страницы сайта.
//
// 🔒 ПРЕДУПРЕЖДЕНИЕ О ЦЕНЕ СТОИТ ПЕРЕД СПИСКОМ, А НЕ ПОСЛЕ. Свежий проект приходит
// с готовым набором, и страницу проскакивают с мыслью «потом разберусь» — набор
// выглядит как отметки, а стоит как переводы всех страниц навсегда и умноженное
// время каждой сборки. Увидевший сначала список выбирает языки; увидевший сначала
// цену решает, сколько их ему нужно.
//
// 🔒 СОХРАНЕНО ≠ ПРИМЕНЕНО, И ЭТО ГЛАВНОЕ ОТЛИЧИЕ ЭТОЙ ГРУППЫ ОТ ОСТАЛЬНЫХ. Набор
// запекается на сборке. Сказать «Сохранено» и замолчать значило бы отдать человеку
// зелёную отметку на настройку, которой сайт не видит: он откроет сайт, увидит
// прежние языки и решит, что сохранение не работает.

// 🔒 СРАВНЕНИЕ ИДЁТ ПО РАЗЛОЖЕННОЙ ФОРМЕ, А НЕ ПО СЫРОЙ СТРОКЕ. `NFD` разбивает
// букву со знаком на букву и знак, `\p{M}` убирает знак. Так «Francais» находит
// «Français», «Portugues» — «Português», а арабское слово находится и без огласовок:
// они в Unicode — те же комбинирующие знаки. Без этого поиск работает только у того,
// кто печатает диакритику, то есть почти ни у кого.
function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase().trim()
}

// 🔒 ЧЕЛОВЕК ИЩЕТ ЯЗЫК ТЕМ СЛОВОМ, КОТОРОЕ ЗНАЕТ САМ, — И ЭТО ЧЕТВЁРТОЕ ИМЯ.
// У строки каталога есть родное имя (العربية), английское (Arabic) и код (ar).
// Русскоязычный человек напишет «арабский», немецкоязычный — «Arabisch», и ни одно
// из трёх ему не поможет. Четвёртое имя даёт сам браузер: `Intl.DisplayNames` знает
// название языка на языке читателя. Спрашиваем его на языке страницы И на языке
// браузера — это разные вещи: страница может быть открыта на английском человеком,
// который думает по-арабски.
//
// Всё в `try`: `Intl.DisplayNames` есть не везде и для части языков молчит. Молчание
// здесь законно — поиск просто теряет четвёртое имя, а первые три работают.
function localNames(codes: readonly string[]): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const locales: string[] = []
  try {
    const pageLang = document.documentElement.lang
    if (pageLang) locales.push(pageLang)
    if (navigator.language && !locales.includes(navigator.language)) locales.push(navigator.language)
  } catch {
    /* среды без DOM — остаёмся с тремя именами */
  }

  for (const locale of locales) {
    let dn: Intl.DisplayNames
    try {
      dn = new Intl.DisplayNames([locale], { type: "language" })
    } catch {
      continue
    }
    for (const code of codes) {
      try {
        const name = dn.of(code)
        // `of` возвращает сам код, когда названия не знает: это не имя, а эхо.
        if (!name || name === code) continue
        const list = out.get(code) ?? []
        if (!list.includes(name)) list.push(name)
        out.set(code, list)
      } catch {
        /* один язык без названия не должен ронять весь список */
      }
    }
  }
  return out
}

export function LanguagesEditor({
  catalogue,
  initial,
  initialDefault,
  built,
  ui,
}: {
  /** Все языки, которые проект умеет: разобраны на сервере. */
  catalogue: readonly LangRow[]
  /** Что записано в окружении сейчас. */
  initial: readonly string[]
  initialDefault: string
  /** С каким набором проект СОБРАН. Расхождение и есть «ждёт пересборки». */
  built: readonly string[]
  ui: GroupsUi
}) {
  const t = ui.langs
  const [selected, setSelected] = useState<string[]>(() => [...initial])
  const [def, setDef] = useState(initialDefault)
  const [saved, setSaved] = useState(() => JSON.stringify([[...initial].sort(), initialDefault]))
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState("")

  const changed = useMemo(
    () => JSON.stringify([[...selected].sort(), def]) !== saved,
    [selected, def, saved],
  )

  // 🔒 «ЖДЁТ ПЕРЕСБОРКИ» СЧИТАЕТСЯ ПО СОХРАНЁННОМУ, А НЕ ПО ТЕКУЩЕМУ ВЫБОРУ.
  // Иначе строка мигала бы при каждом щелчке по языку, ещё до сохранения, — и
  // перестала бы значить что-либо. Сравниваются два факта: что записано в
  // окружении и с чем проект СОБРАН.
  const pending = useMemo(() => {
    const [savedSet] = JSON.parse(saved) as [string[], string]
    return savedSet.join(",") !== [...built].sort().join(",")
  }, [saved, built])

  // Стог сена собирается один раз на весь каталог, а не на каждое нажатие клавиши.
  const haystack = useMemo(() => {
    const local = localNames(catalogue.map(r => r.code))
    const map = new Map<string, string>()
    for (const r of catalogue) {
      map.set(
        r.code,
        fold([r.code, r.englishName, r.nativeName, ...(local.get(r.code) ?? [])].join(" ")),
      )
    }
    return map
  }, [catalogue])

  const q = fold(query)
  const shown = useMemo(
    () => (q ? catalogue.filter(r => (haystack.get(r.code) ?? "").includes(q)) : catalogue),
    [q, catalogue, haystack],
  )

  function toggle(code: string) {
    setSelected(prev => {
      if (prev.includes(code)) {
        if (prev.length === 1) {
          toast.error(t.atLeastOne)
          return prev
        }
        if (code === def) {
          // Основной язык снять нельзя: сайт остался бы без главной страницы.
          toast.error(t.defaultMustBeSelected)
          return prev
        }
        return prev.filter(c => c !== code)
      }
      return [...prev, code]
    })
  }

  async function save() {
    if (!changed) {
      toast.info(ui.nothingToSave)
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/architect/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ languages: selected, defaultLanguage: def }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      // 🔒 У ЭТОЙ ГРУППЫ СВОЁ СООБЩЕНИЕ, И ЭТО ЕДИНСТВЕННОЕ ИСКЛЮЧЕНИЕ. Остальные
      // настройки читаются на каждом запросе, и чтобы увидеть их, довольно обновить
      // страницу. Набор языков запекается на сборке — «обновите страницу» здесь было
      // бы советом, который ничего не меняет, и человек решил бы, что сохранение
      // сломано.
      //
      // 🔒 СКАЗАНО «ВСТУПЯТ В СИЛУ ПОСЛЕ ПЕРЕСБОРКИ», А НЕ «ПЕРЕСБОРКА ЗАПУЩЕНА»:
      // отсюда её никто не запускает. Обещание запуска было бы ложью, которую человек
      // проверит через две минуты. Запуск пересборки из слоя архитектора — отдельная
      // способность, названная долгом.
      toast.success(t.savedRebuild)
      setSaved(JSON.stringify([[...selected].sort(), def]))
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  return (
    <div data-languages-editor className="flex flex-col gap-8">
      {/* Цена — до списка. Она и есть решение, которое здесь принимают. */}
      <AdviceNote probe="lang-cost" title={t.costTitle} text={t.cost} />

      {/* Строка про пересборку — не украшение: без неё «Сохранено» лжёт. */}
      <div data-lang-rebuild={pending ? "pending" : "clean"} className="flex flex-col gap-1">
        <P className="text-[length:var(--fs-body)] font-medium">{t.rebuildTitle}</P>
        <Small className="max-w-2xl">{t.rebuild}</Small>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.title}</H3>
          <Small className="max-w-2xl">{t.hint}</Small>
          <Small data-lang-count className="font-medium text-foreground">
            {selected.length} {t.selected}
            {q && ` · ${shown.length} ${t.found}`}
          </Small>
          {/* 🔒 ЗНАЧОК ОБЪЯСНЯЕТСЯ ТАМ, ГДЕ ОН СТОИТ. Подпись у самой кнопки видит
              только тот, кто уже навёл на неё мышь, — то есть тот, кто и так
              догадался. Легенда стоит над списком и читается до первого щелчка. */}
          <Small data-star-legend className="flex items-center gap-1.5">
            <Star className="size-3.5 shrink-0" aria-hidden />
            {t.starLegend}
          </Small>
        </div>

        {/* 🔒 ПОЛЕ ПОИСКА С `dir="auto"`. Человек ищет язык словом, которое знает сам,
            и слово это может быть арабским или ивритом — письмом справа налево.
            Поле с жёстким направлением показало бы такой запрос задом наперёд:
            курсор слева, знаки препинания не на своей стороне. `auto` отдаёт
            направление первой значащей букве набранного. */}
        <div className="relative max-w-xl">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            data-lang-search
            type="search"
            dir="auto"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
            className="h-11 ps-9 pe-10"
          />
          {query && (
            <button
              type="button"
              data-lang-search-clear
              onClick={() => setQuery("")}
              aria-label={t.clearSearch}
              title={t.clearSearch}
              className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <Small className="max-w-xl">{t.searchHint}</Small>

        <Separator />

        {shown.length === 0 ? (
          <div data-lang-empty className="flex flex-col gap-1 rounded-lg border border-border px-4 py-6">
            <P className="text-[length:var(--fs-body)] font-medium">{t.nothingFound}</P>
            <Small>{t.nothingFoundHint}</Small>
          </div>
        ) : (
          <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {shown.map(row => {
              const on = selected.includes(row.code)
              const isDefault = row.code === def
              return (
                <li
                  key={row.code}
                  data-lang={row.code}
                  data-on={on ? "true" : "false"}
                  data-default={isDefault ? "true" : "false"}
                  // 🔒 ВЫБРАННАЯ КАРТОЧКА ЗАЛИТА ОСНОВНЫМ ЦВЕТОМ, А НЕ ОБВЕДЕНА
                  // (решение владельца 2026-08-29). Восемьдесят две карточки в три
                  // колонки: тонкая рамка и заливка в пять процентов различимы только
                  // рядом, а выбранные разбросаны по всему списку. Заливка видна
                  // краем глаза — по ней набор читается, не читая.
                  className={
                    "flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors " +
                    (on ? "border-primary bg-primary text-primary-foreground" : "border-border")
                  }
                >
                  <button
                    type="button"
                    onClick={() => toggle(row.code)}
                    aria-pressed={on}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span aria-hidden className="text-[length:var(--fs-h3)] leading-none">{row.flag}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[length:var(--fs-body)]">{row.nativeName}</span>
                      {/* 🔒 НА ЗАЛИВКЕ ВТОРАЯ СТРОКА БЕРЁТ ТОТ ЖЕ ТОКЕН, ЧТО ПЕРВАЯ,
                          и различается только кеглем. Приглушённый цвет рассчитан на
                          фон страницы и на основном нечитаем, а доля от токена
                          (`/80`) запрещена гейтом контраста: прозрачность даёт цвет,
                          которого никто не проверял. */}
                      <span
                        className={
                          "block truncate text-[length:var(--fs-small)] " +
                          (on ? "text-primary-foreground" : "text-muted-foreground")
                        }
                      >
                        {row.englishName} · {row.tier === "A" ? t.tierA : t.tierCommunity}
                      </span>
                    </span>
                    {on && <Check data-lang-check className="size-4 shrink-0" aria-hidden />}
                  </button>

                  {/* Основным можно сделать только выбранный язык: иначе сайт
                      остался бы с умолчанием, страниц для которого не собирают. */}
                  {on && (
                    <Button
                      type="button"
                      variant={isDefault ? "secondary" : "ghost"}
                      size="icon"
                      aria-label={isDefault ? t.defaultLabel : t.makeDefault}
                      title={isDefault ? t.defaultLabel : t.makeDefault}
                      data-make-default={row.code}
                      onClick={() => setDef(row.code)}
                      className={
                        "size-9 shrink-0 " +
                        (isDefault
                          ? ""
                          : "text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground")
                      }
                    >
                      <Star className={"size-4 " + (isDefault ? "fill-current" : "")} aria-hidden />
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={busy || !changed} data-save className="h-10 px-5">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? ui.saving : ui.save}
        </Button>
        {!changed && <P className="text-[length:var(--fs-small)] text-muted-foreground">{ui.nothingToSave}</P>}
      </div>
    </div>
  )
}
