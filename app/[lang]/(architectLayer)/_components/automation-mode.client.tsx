"use client"

import { useState, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Small } from "@/components/ui/typography"
import type { AutomationMode as Mode } from "../_lib/automation-strategy"

// ПЕРЕКЛЮЧАТЕЛЬ СТРАТЕГИИ АВТОМАТИЗАЦИИ (112-3, 2026-09-04).
//
// 🔒 ОБЕ ПАНЕЛИ ПРИХОДЯТ ГОТОВОЙ РАЗМЕТКОЙ, ОСТРОВОК ЛИШЬ ПОКАЗЫВАЕТ ОДНУ. Закон
// слоя: содержимое рисует сервер, в браузер уезжает только то, что обязано там
// жить. Собери островок панели сам — и он потянул бы за собой словари, реестр и
// половину серверного дерева.
//
// 🛑 ЦЕНА ЭТОГО ВЫБОРА НАЗВАНА: обе панели лежат в разметке всегда, значит
// невыбранная тоже отдана браузеру. Это осознанно — панели маленькие, а
// переключение мгновенное и работает даже на медленной связи. Будь они тяжёлыми,
// правильным был бы поход на сервер за второй.
//
// 🔒 ЗАПИСЬ ИДЁТ ЗАПЛАТОЙ В `PLATFORM-CONFIG` — в этом файле живут режим
// разработки, выключатели возможностей и состояние переезда, и снимок целиком
// затирал бы их при каждом переключении. Сюда же пишет чат, из другого процесса.
//
// 🛑 ПОВЕДЕНИЯ ЗА РЕЖИМОМ СЕГОДНЯ НЕТ НИ В ОДНОМ ПОЛОЖЕНИИ — слово владельца
// 2026-09-04: «Пусть оно переключается но ни на что не влияет пока». Поэтому под
// переключателем стоит строка, которая это ГОВОРИТ: молчание вместо причины
// читается как поломка (28-13).

export function AutomationMode({
  cloudPanel,
  initial,
  manualPanel,
}: {
  cloudPanel: ReactNode
  initial: Mode
  manualPanel: ReactNode
}) {
  const [mode, setMode] = useState<Mode>(initial)
  const [busy, setBusy] = useState<Mode | null>(null)

  async function choose(next: Mode) {
    if (next === mode || busy) return
    setBusy(next)
    // 🔒 ЭКРАН МЕНЯЕТСЯ СРАЗУ, А НЕ ПОСЛЕ ОТВЕТА СЕРВЕРА: человек нажал на
    // переключатель и обязан увидеть результат нажатия. При отказе значение
    // возвращается назад и отказ называется вслух — тихий откат читался бы как
    // «кнопка не работает».
    const before = mode
    setMode(next)
    try {
      const res = await fetch("/api/architect/platform-config", {
        body: JSON.stringify({ patch: { automationMode: next } }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean }
      if (!res.ok || !data.ok) {
        setMode(before)
        toast.error("Режим не сохранён")
        return
      }
      toast.success("Режим сохранён")
    } catch {
      setMode(before)
      toast.error("Режим не сохранён")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-col gap-2 rounded-lg border border-border p-3"
        data-automation-switch
      >
        <ModeRow
          busy={busy === "claude"}
          checked={mode === "claude"}
          label="Агент Anthropic по подписке (Claude Code на сервере)"
          onPick={() => void choose("claude")}
          value="claude"
        />
        <ModeRow
          busy={busy === "openai"}
          checked={mode === "openai"}
          label="Ручной режим: AI SDK с моделями OpenAI"
          onPick={() => void choose("openai")}
          value="openai"
        />
        <Small className="text-muted-foreground">
          Режим сохраняется в настройках проекта и виден в чате, в области ввода. Поведение за ним
          ещё не построено — ответ пока одинаковый в обоих положениях.
        </Small>
      </div>

      {mode === "claude" ? cloudPanel : manualPanel}
    </div>
  )
}

/**
 * Одна строка переключателя.
 *
 * 🔒 ЭТО `radio`, А НЕ ДВЕ КНОПКИ: режимы взаимоисключающие, и браузер знает про
 * такую группу всё — стрелки клавиатуры, чтение вслух, состояние «выбран». Пара
 * кнопок повторяла бы это руками и хуже.
 */
function ModeRow({
  busy,
  checked,
  label,
  onPick,
  value,
}: {
  busy: boolean
  checked: boolean
  label: string
  onPick: () => void
  value: string
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2 text-[length:var(--fs-body)]"
      data-automation-mode={value}
      data-automation-checked={String(checked)}
    >
      <input
        checked={checked}
        className="size-4 accent-primary"
        name="automation-mode"
        onChange={onPick}
        type="radio"
        value={value}
      />
      <span className="flex-1">{label}</span>
      {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />}
    </label>
  )
}
