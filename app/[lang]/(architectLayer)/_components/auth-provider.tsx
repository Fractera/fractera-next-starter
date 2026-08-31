import { CheckCircle2, CircleOff, AlertTriangle, Info } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { MethodForm, type MethodField, type MethodFormLabels } from "./method-form.client"
import { CopyUri } from "./copy-uri.client"
import type { AuthMethods } from "@/lib/architect/auth-methods"
import type { AuthUi } from "../_i18n/auth.i18n"

// СЕКЦИЯ ОДНОГО ПРОВАЙДЕРА ВХОДА (78-3, 2026-08-31).
//
// 🔒 ОДИН КОМПОНЕНТ НА ОБА ПРОВАЙДЕРА — то же решение, что у формы, и по той же
// причине: у Google и у почтовой ссылки одинаковый экран (состояние, объяснение,
// поля, кнопки). Разное — поля, адрес возврата и слова. Два почти одинаковых
// файла пришлось бы потом править дважды.
//
// 🔒 СЕРВЕРНЫЙ: он резолвит слова и отдаёт островку СТРОКИ ПОИМЁННО. Клиентский
// компонент, импортирующий словарь значением, увёз бы в браузер все его языки —
// оплачено замером в 76-4.
//
// 🔒 ТРИ СОСТОЯНИЯ РАЗЛИЧАЮТСЯ ВИДОМ, А НЕ ОТТЕНКОМ ОДНОГО, И ЭТО ПЕРЕЕХАЛО ИЗ
// ПАНЕЛИ ВМЕСТЕ С ПРИЧИНОЙ: лечение у них разное.
//   • не дотянулись до окружения → «вы не на сервере», править нечего;
//   • не защищённый режим       → «сначала домен», поля только для чтения;
//   • настроено / не настроено  → обычная работа.
// Панель знала два последних; первое — новое, потому что проект человека уезжает
// на его машину, и там отсутствие файла — норма, а не поломка.

export function AuthProvider({
  kind,
  state,
  ui,
}: {
  kind: "google" | "resend"
  state: AuthMethods
  ui: AuthUi
}) {
  const w = ui.m
  const isGoogle = kind === "google"
  const p = isGoogle ? state.google : state.resend
  const configured = p.configured
  const masked = isGoogle ? state.google.clientIdMasked : state.resend.keyMasked

  // 🔒 ПОЛЯ ОПИСАНЫ ЗДЕСЬ, А НЕ В ФОРМЕ. Форма умеет рисовать любой набор; знание
  // о том, ЧТО спрашивают у Google и что у Resend, принадлежит провайдеру.
  const fields: MethodField[] = isGoogle
    ? [
        { key: "googleClientId", placeholder: configured ? w.googleIdReplace : w.googleId },
        { key: "googleClientSecret", secret: true, placeholder: configured ? w.googleSecretReplace : w.googleSecret },
      ]
    : [
        { key: "resendApiKey", secret: true, placeholder: configured ? w.resendKeyReplace : w.resendKey },
        { key: "resendFrom", placeholder: w.resendFrom, initial: state.resend.from },
      ]

  const labels: MethodFormLabels = {
    save: w.save,
    saving: w.saving,
    remove: w.remove,
    removeConfirm: w.removeConfirm,
    saved: w.saved,
    removed: w.removed,
    failed: w.failed,
    errInsecure: w.errInsecure,
    errUnreachable: w.errUnreachable,
    errResendKey: w.errResendKey,
  }

  return (
    <section data-auth-provider={kind} className="flex flex-col gap-4">
      {/* Состояние — первой строкой: человек пришёл узнать, работает ли способ. */}
      <div className="flex flex-wrap items-center gap-2">
        <H4 variant="ui">{isGoogle ? w.googleTitle : w.emailTitle}</H4>
        <span
          data-provider-state={configured ? "configured" : "empty"}
          className={
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[length:var(--fs-small)] " +
            (configured
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
              : "border-border text-muted-foreground")
          }
        >
          {configured ? <CheckCircle2 size={12} aria-hidden /> : <CircleOff size={12} aria-hidden />}
          {configured ? w.configured : w.notSet}
        </span>
        {/* 🔒 МАСКА, А НЕ СЕКРЕТ. Её собрал сервер; сам ключ в браузер не уезжает
            даже ради показа. */}
        {masked && (
          <code data-provider-mask className="font-mono text-[length:var(--fs-small)] text-muted-foreground">
            {masked}
          </code>
        )}
      </div>

      <Small className="text-muted-foreground">{isGoogle ? w.googleHint : w.emailHint}</Small>

      {/* Адрес возврата — только у Google и только когда он существует. */}
      {isGoogle && (
        <div className="flex flex-col gap-1.5">
          <Small className="font-medium text-foreground">{w.redirectUriLabel}</Small>
          {state.googleCallbackUrl ? (
            <CopyUri
              value={state.googleCallbackUrl}
              copyLabel={w.uriCopy}
              copiedLabel={w.uriCopied}
              failedLabel={w.uriCopyFailed}
            />
          ) : (
            // 🔒 НЕТ ДОМЕНА — НЕТ АДРЕСА, И ЭТО ГОВОРИТСЯ СЛОВАМИ. Показать
            // шаблон с плейсхолдером хуже молчания: человек скопировал бы его в
            // консоль Google и получил отказ входа без объяснимой причины.
            <Small data-uri-missing className="text-muted-foreground">{w.redirectUriMissing}</Small>
          )}
        </div>
      )}

      {/* 🔒 ДВА ЗАПРЕТА ПОКАЗЫВАЮТСЯ ДО ФОРМЫ, А НЕ ПОСЛЕ ОТКАЗА. Человек должен
          знать, почему поля не работают, прежде чем в них печатать. */}
      {!state.reachable ? (
        <div data-auth-blocked="unreachable" className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3">
          <Info size={14} aria-hidden className="mt-0.5 shrink-0 text-muted-foreground" />
          <Small className="text-muted-foreground">
            <strong className="text-foreground">{w.unreachableTitle}</strong> {w.unreachable}
          </Small>
        </div>
      ) : !state.secure ? (
        <div data-auth-blocked="insecure" className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
          <AlertTriangle size={14} aria-hidden className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
          <Small className="text-amber-800 dark:text-amber-200">{w.needsSecure}</Small>
        </div>
      ) : (
        <>
          <MethodForm
            fields={fields}
            clearKey={isGoogle ? "clearGoogle" : "clearResend"}
            configured={configured}
            labels={labels}
          />
          {/* 🔒 ПЕРЕЗАПУСК СЛУЖБЫ НАЗВАН ЗАРАНЕЕ. Он занимает секунды, и человек,
              не предупреждённый о нём, читает моргнувший вход как поломку. */}
          <Small className="text-muted-foreground">{w.restartNote}</Small>
        </>
      )}
    </section>
  )
}
