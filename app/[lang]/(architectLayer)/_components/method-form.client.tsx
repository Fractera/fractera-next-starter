"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ВВОД УЧЁТНЫХ ДАННЫХ СПОСОБА ВХОДА — ПЕРЕНЕСЁН ИЗ ПАНЕЛИ (78-3, 2026-08-31).
//
// 🔒 ОСТРОВОК ЗДЕСЬ НЕИЗБЕЖЕН, И ПРИЧИНА ПЕРЕЕХАЛА ВМЕСТЕ С НИМ: сюда вводят
// СЕКРЕТЫ. Форма без JS отправила бы их обычным `POST` с перезагрузкой — секрет
// попал бы в историю навигации, а при ошибке его пришлось бы набирать заново.
//
// 🔒 ОДИН КОМПОНЕНТ НА ОБА ПРОВАЙДЕРА, И ЭТО РЕШЕНИЕ ИСТОЧНИКА, А НЕ МОЁ. У
// Google и у почтовой ссылки одинаковая форма: поля, «сохранить», «удалить»,
// состояние с маской. Разные только имена полей и что послать для стирания.
// Два почти одинаковых файла пришлось бы потом править дважды.
//
// 🔒 МАСКА ПРИХОДИТ С СЕРВЕРА, А НЕ СЧИТАЕТСЯ ЗДЕСЬ. Замаскировать на клиенте
// значило бы сначала отправить секрет в браузер. Правило двери, не облика.
//
// 🔒 СЛОВА ПРИХОДЯТ ПРОПСОМ, А НЕ ИМПОРТОМ. Клиентский файл, импортирующий
// словарь слоя значением, увёз бы в браузер все его языки на каждой странице —
// оплачено замером в 76-4.
//
// ✗ ЧТО ИЗМЕНЕНО ПРОТИВ ИСТОЧНИКА, И ТОЛЬКО ЭТО: адрес двери
// (`/api/architect/auth-methods` вместо панельной), кегли `text-[11px]` заменены
// шкалой `--fs-*` этого проекта, отказы двери переведены в слова человека.
// Поведение не изменено ни в одном месте.

export type MethodFormLabels = {
  save: string
  saving: string
  remove: string
  removeConfirm: string
  saved: string
  removed: string
  failed: string
  /** Отказы двери, названные словами. */
  errInsecure: string
  errUnreachable: string
  errResendKey: string
}

export type MethodField = {
  key: string
  placeholder: string
  secret?: boolean
  /** Заполнено значением с сервера (адрес отправителя), а не пустое. */
  initial?: string
}

/** Ответ двери переводится в человеческую фразу здесь, а не показывается кодом. */
function messageOf(error: string | undefined, labels: MethodFormLabels): string {
  if (error === "insecure-mode") return labels.errInsecure
  if (error === "auth-env-unreachable") return labels.errUnreachable
  if (error === "bad-resend-key") return labels.errResendKey
  return labels.failed
}

export function MethodForm({
  fields,
  clearKey,
  configured,
  labels,
}: {
  fields: MethodField[]
  /** Что послать, чтобы стереть настройку: `clearGoogle`, `clearResend`. */
  clearKey: string
  configured: boolean
  labels: MethodFormLabels
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, f.initial ?? ""])),
  )
  const [busy, setBusy] = useState<null | "save" | "clear">(null)

  // 🔒 ПУСТАЯ ОТПРАВКА ЗАПЕРТА. Она ничего не изменила бы, но перезапустила бы
  // службу входа — то есть вход отвалился бы на секунду без причины.
  const dirty = fields.some(f => {
    const v = (values[f.key] ?? "").trim()
    return v !== "" && v !== (f.initial ?? "")
  })

  async function send(payload: Record<string, unknown>, okMessage: string, tag: "save" | "clear") {
    setBusy(tag)
    try {
      const r = await fetch("/api/architect/auth-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const d = (await r.json().catch(() => ({}))) as { error?: string }
      if (!r.ok || d?.error) throw new Error(messageOf(d?.error, labels))
      toast.success(okMessage)
      // 🔒 СЕКРЕТ В ПОЛЕ НЕ ОСТАЁТСЯ: он сохранён, и показывать его повторно
      // нечем — сервер отдаёт только маску.
      setValues(Object.fromEntries(fields.map(f => [f.key, f.initial ?? ""])))
      startTransition(() => router.refresh())
    } catch (e) {
      toast.error(e instanceof Error ? e.message : labels.failed)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div data-method-form className="flex flex-col gap-2">
      {fields.map(f => (
        <Input
          key={f.key}
          type={f.secret ? "password" : "text"}
          value={values[f.key] ?? ""}
          onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
          placeholder={f.placeholder}
          autoComplete="off"
          className="font-mono text-[length:var(--fs-small)]"
        />
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          disabled={busy !== null || !dirty}
          onClick={() =>
            send(
              Object.fromEntries(fields.map(f => [f.key, values[f.key] ?? ""])),
              labels.saved,
              "save",
            )
          }
        >
          {busy === "save" && <Loader2 size={13} className="animate-spin" />}
          {busy === "save" ? labels.saving : labels.save}
        </Button>

        {configured && (
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            disabled={busy !== null}
            onClick={() => {
              // 🔒 УДАЛЕНИЕ СПРАШИВАЮТ, ПОТОМУ ЧТО ЕГО ВИДЯТ ПОСТОРОННИЕ: оно
              // скрывает кнопку на публичной странице входа.
              if (!confirm(labels.removeConfirm)) return
              void send({ [clearKey]: true }, labels.removed, "clear")
            }}
          >
            {busy === "clear" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            {labels.remove}
          </Button>
        )}
      </div>
    </div>
  )
}
