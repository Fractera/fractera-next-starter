"use client"

import { useMemo, useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { H3, P, Small } from "@/components/ui/typography"
import { SLOT_ORDER, LOCKED_SLOTS, DEFAULT_SLOTS, type RoutingMode, type SlotName } from "../_lib/routing"
import { SlotLayoutPreview } from "./slot-layout-preview.client"
import { AdviceNote } from "./advice-note"
import type { GroupsUi } from "../_i18n/groups.i18n"

// РЕЖИМ СБОРКИ СТРАНИЦЫ И СОСТАВ ОБЛАСТЕЙ (31-12, 2026-08-29).
//
// 🔒 РЕЖИМ — ДВА БОЛЬШИХ КОНТЕЙНЕРА, А НЕ ПЕРЕКЛЮЧАТЕЛЬ. Это выбор устройства
// всех страниц проекта разом, и он заслуживает того же размера, что выбор пути в
// мастере запуска (28-2): у каждого варианта своё имя и своя строка о том, что он
// значит. Переключатель «параллельный: вкл/выкл» назвал бы один из двух режимов
// отсутствием другого — а они равноправны.
//
// 🔒 ОБЛАСТИ ПОКАЗЫВАЮТСЯ ВСЕГДА, НО В ОБЫЧНОМ РЕЖИМЕ НЕДОСТУПНЫ. Спрятать их
// значило бы скрыть, ЧТО именно даёт параллельный режим: человек выбирает между
// двумя словами, не видя разницы. Видимые и погашенные — они и есть объяснение.
//
// 🔒 ШАПКА И ПОДВАЛ ЗАПЕРТЫ, И ЗАМОК ВИДЕН. Без них страница не собирается;
// выключатель, который молча не срабатывает, хуже отсутствующего.
//
// ЖИВОЙ ЧЕРТЁЖ ДОБАВЛЕН 31-17 (2026-08-29) — перенос интерфейса панели управления
// (`bridges/app/app/[lang]/parallel-routing`), где он живёт с шага 501.
// 🔒 СПИСОК ГОВОРИТ «ЧТО ВКЛЮЧЕНО», ЧЕРТЁЖ — «ЧТО ПОЛУЧИТСЯ», и первым второго не
// заменить. Наведение на строку подсвечивает блок: иначе восемь служебных имён
// приходится сопоставлять с прямоугольниками в уме.

// 🔒 ЗАПИСЬ ВЫКЛЮЧЕНА (решение владельца 2026-08-29, дословно: «добавь это пока я
// не подключил параллельную маршрутизацию в корневой layout»).
//
// Приложение параллельную маршрутизацию ещё не исполняет: корневой layout отдаёт
// плоское дерево, и применить сохранённый режим некому. Записать его в файл значило
// бы развести систему с реальностью — конфиг сказал бы «параллельный», экран остался
// бы прежним, и следующий разбор начался бы с вопроса «почему не работает».
//
// Пока способности нет, «Сохранить» отвечает «будет доступно в ближайшем обновлении»
// и ВОЗВРАЩАЕТ выбор к сохранённому состоянию: экран не должен показывать режим,
// которого в файле не будет.
//
// 🔒 КАК ВКЛЮЧИТЬ, КОГДА КОРНЕВОЙ LAYOUT НАУЧИТСЯ ЧИТАТЬ КОНФИГ: поставить здесь
// `true`. Код записи ниже сохранён целиком и соответствует стандарту формата
// (`ARCHITECTURE-PARALLEL-ROUTING.md` §0.1) — писать его заново не придётся.
//
// Тот же выключатель с тем же именем стоит в панели управления
// (`bridges/app/app/[lang]/parallel-routing/_components/slot-picker.client.tsx`).
// 🔒 ДВА РЕДАКТОРА ПИШУТ В ОДИН ФАЙЛ, значит и молчат они вместе: включённый здесь
// и выключенный там дал бы дверь, о существовании которой знает только один экран.
const WRITE_ENABLED = false

export function RoutingEditor({
  initialMode,
  initialSlots,
  ui,
}: {
  initialMode: RoutingMode
  /** Включённые области на момент открытия страницы. */
  initialSlots: readonly SlotName[]
  ui: GroupsUi
}) {
  const t = ui.routing
  const [mode, setMode] = useState<RoutingMode>(initialMode)
  const [slots, setSlots] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SLOT_ORDER.map(s => [s, initialSlots.includes(s)])),
  )
  const [savedMode, setSavedMode] = useState<RoutingMode>(initialMode)
  const [savedSlots, setSavedSlots] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SLOT_ORDER.map(s => [s, initialSlots.includes(s)])),
  )
  const [busy, setBusy] = useState(false)
  /** Область под курсором в списке — подсвечивает свой блок на чертеже. */
  const [hovered, setHovered] = useState<SlotName | null>(null)

  const changed = useMemo(
    () => mode !== savedMode || SLOT_ORDER.some(s => slots[s] !== savedSlots[s]),
    [mode, savedMode, slots, savedSlots],
  )

  // 🔒 ЧЕРТЁЖ РИСУЕТ ВЫБРАННЫЙ РЕЖИМ, А НЕ СМЕСЬ ДВУХ. В обычном режиме состав
  // областей не выбирают — их три; нарисовать там колонки значило бы пообещать
  // раскладку, которой этот режим не даёт.
  const previewActive = useMemo(() => {
    if (mode !== "parallel") return new Set<SlotName>(DEFAULT_SLOTS)
    return new Set<SlotName>(SLOT_ORDER.filter(s => LOCKED_SLOTS.includes(s) || Boolean(slots[s])))
  }, [mode, slots])

  // 🔒 ЦЕНТР ТЯНЕТ ЗА СОБОЙ СВОИ ПОЛОСЫ. «Над содержимым» и «под содержимым» живут
  // ВНУТРИ центра: без него им негде стоять, и включённые сами по себе они описывали
  // бы раскладку, которую нельзя нарисовать.
  function toggleSlot(slot: SlotName, next: boolean) {
    setSlots(prev =>
      slot === "center"
        ? { ...prev, center: next, centerHeader: next, centerFooter: next }
        : { ...prev, [slot]: next },
    )
  }

  async function save() {
    // Записи пока нет — см. `WRITE_ENABLED` над компонентом. «Сохранить» честно
    // говорит, что способности ещё нет, и возвращает выбор к сохранённому
    // состоянию: иначе экран остался бы показывать режим, которого в файле нет.
    if (!WRITE_ENABLED) {
      toast.message(t.comingSoon)
      setMode(savedMode)
      setSlots({ ...savedSlots })
      setHovered(null)
      return
    }

    if (!changed) {
      toast.info(ui.nothingToSave)
      return
    }
    setBusy(true)

    // 🔒 ПИШЕТСЯ ТОЛЬКО НОВОЕ ИМЯ РЕЖИМА, А СТАРОЕ СТИРАЕТСЯ (`null` в заплате).
    // Оставить оба значило бы держать на диске два ответа на один вопрос — и
    // однажды они разойдутся, а читатель предпочтёт старое.
    const patch: Record<string, unknown> = {
      routingMode: mode,
      parallelRouting: null,
      slots: Object.fromEntries(SLOT_ORDER.map(s => [s, Boolean(slots[s])])),
    }

    try {
      const res = await fetch("/api/architect/platform-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patch }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        toast.error(ui.failed)
        setBusy(false)
        return
      }
      toast.success(ui.savedReload)
      setSavedMode(mode)
      setSavedSlots({ ...slots })
      setBusy(false)
    } catch {
      toast.error(ui.failed)
      setBusy(false)
    }
  }

  const modes: { id: RoutingMode; title: string; hint: string }[] = [
    { id: "standard", title: t.modeStandard, hint: t.modeStandardHint },
    { id: "parallel", title: t.modeParallel, hint: t.modeParallelHint },
  ]

  return (
    <div data-routing-editor className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.title}</H3>
          <Small className="max-w-2xl">{t.hint}</Small>
        </div>
        <Separator />

        {/* 🔒 ПРАВДА О СОСТОЯНИИ СТОИТ ВЫШЕ УПРАВЛЕНИЯ, а не в подсказке под ним:
            человек должен узнать, что экран не изменится, ДО того как выберет режим
            и нажмёт «Сохранить», а не после. */}
        {/* 🔒 СОВЕТ ВЛАДЕЛЬЦА СТОИТ ПЕРВЫМ, А ПРЕДУПРЕЖДЕНИЕ О НЕПРИМЕНЯЕМОСТИ —
            вторым, и порядок не случаен: первый говорит, КАК этим пользоваться, и
            останется навсегда; второй говорит, что сегодня оно ещё не исполняется, и
            исчезнет вместе с `WRITE_ENABLED`. */}
        <AdviceNote probe="one-slot-at-a-time" title={t.adviceTitle} text={t.advice} />

        {!WRITE_ENABLED && (
          <AdviceNote tone="warning" probe="not-consumed" title={t.comingSoon} text={t.notConsumed} />
        )}

        <div className="flex flex-col gap-4 md:flex-row">
          {modes.map(m => {
            const chosen = mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                data-routing-mode={m.id}
                data-chosen={chosen ? "true" : "false"}
                aria-pressed={chosen}
                onClick={() => setMode(m.id)}
                className={
                  "flex-1 rounded-2xl border p-6 text-left transition-colors " +
                  (chosen
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/40")
                }
              >
                <span className="block text-[length:var(--fs-h3)] font-semibold text-foreground">{m.title}</span>
                <span className="mt-2 block text-[length:var(--fs-small)] leading-normal text-muted-foreground">
                  {m.hint}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <H3 variant="ui">{t.areasTitle}</H3>
          <Small className="max-w-2xl">{mode === "parallel" ? t.areasHint : t.standardAreasHint}</Small>
        </div>
        <Separator />

        {/* Чертёж и список стоят рядом: выбор слева отражается справа в ту же секунду.
            На узком экране чертёж уходит наверх — он объясняет список, а не наоборот. */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start">
            <Small className="font-medium text-foreground">{t.previewTitle}</Small>
            <SlotLayoutPreview
              active={previewActive}
              hovered={hovered}
              labels={t.areas}
              centerLabel={mode === "parallel" ? t.areas.center : t.childrenLabel}
            />
          </div>

          <ul data-slot-list className="flex flex-col gap-3">
            {SLOT_ORDER.map(slot => {
              const locked = LOCKED_SLOTS.includes(slot)
              // Полосы центра без самого центра поставить некуда.
              const orphan = (slot === "centerHeader" || slot === "centerFooter") && !slots.center
              // В обычном режиме состав областей не выбирают: раскладка задана.
              const disabled = locked || orphan || mode !== "parallel"
              return (
                <li
                  key={slot}
                  data-slot={slot}
                  data-on={slots[slot] ? "true" : "false"}
                  onMouseEnter={() => setHovered(slot)}
                  onMouseLeave={() => setHovered(null)}
                  className={
                    "flex items-start justify-between gap-4 rounded-lg border px-4 py-3 transition-colors " +
                    (mode === "parallel"
                      ? hovered === slot
                        ? "border-primary bg-muted/50"
                        : "border-border"
                      : "border-border opacity-60")
                  }
                >
                  <div className="min-w-0">
                    <span className="flex items-center gap-2 text-[length:var(--fs-body)] text-foreground">
                      {t.areas[slot] ?? slot}
                      {locked && <Lock className="size-3.5 shrink-0 opacity-60" aria-hidden />}
                    </span>
                    <Small className="mt-0.5 block">
                      {locked ? t.lockedHint : (t.areaHints[slot] ?? "")}
                    </Small>
                  </div>
                  <Switch
                    checked={locked ? true : Boolean(slots[slot])}
                    disabled={disabled}
                    aria-label={t.areas[slot] ?? slot}
                    onCheckedChange={next => toggleSlot(slot, next)}
                  />
                </li>
              )
            })}
          </ul>
        </div>
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
