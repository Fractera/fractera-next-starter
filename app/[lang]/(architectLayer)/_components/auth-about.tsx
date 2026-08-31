import { AlertTriangle, ShieldCheck, UserPlus } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import {
  PROVIDERS_ALL,
  PROVIDERS_ON,
  AUTH_LIB,
  AUTH_LIB_SNAPSHOT,
  SUPPORT_EMAIL,
  ACCESS_TIERS,
  ALL_ROLES,
} from "../_lib/auth-catalogue"
import type { AuthUi } from "../_i18n/auth.i18n"

// РАЗДЕЛ «ОПИСАНИЕ» ВХОДА — ЧТО ЕЩЁ БЫВАЕТ, КТО ТАКИЕ РОЛИ, ЧТО ТАКОЕ ГОСТЬ
// (78-5, заказ владельца 2026-09-01).
//
// 🔒 СЕРВЕРНЫЙ. Здесь только текст и данные; островку тут делать нечего, а
// словарь слоя в браузер не уезжает.
//
// 🔒 ЧЕТЫРЕ БЛОКА, И ПОРЯДОК ЗАДАН ВЛАДЕЛЬЦЕМ: бейджи провайдеров ниже абзаца
// про секреты · отдельно роли · отдельно гостевая роль · и оранжевая карточка
// про режим localhost. «Отдельно» в его словах значит своим блоком, а не абзацем
// внутри соседнего: это три разных вопроса, и человек приходит с одним из них.

const ON = new Set<string>(PROVIDERS_ON)

export function AuthAbout({ ui }: { ui: AuthUi }) {
  const w = ui.m

  return (
    <div data-auth-about className="flex flex-col gap-8">
      {/* ── 1. Провайдеры ─────────────────────────────────────────────── */}
      <section data-auth-providers-catalogue className="flex flex-col gap-3">
        <H4 variant="ui">{w.catTitle}</H4>
        <Small className="text-muted-foreground">
          {w.catLead.replace("{n}", String(PROVIDERS_ALL.length)).replace("{lib}", AUTH_LIB)}
        </Small>

        {/* 🔒 НАСТРОЕННЫЕ ОТЛИЧАЮТСЯ ВИДОМ, А НЕ ПОРЯДКОМ. Вынести их наверх
            значило бы сломать алфавит, по которому человек ищет своё имя; они
            различимы цветом и остаются на своих местах. */}
        <div className="flex flex-wrap gap-1.5">
          {PROVIDERS_ALL.map(p => {
            const on = ON.has(p)
            return (
              <span
                key={p}
                data-provider-badge={p}
                data-provider-on={on ? "yes" : undefined}
                title={on ? w.catOnHint : undefined}
                className={
                  "rounded-md border px-2 py-0.5 font-mono text-[length:var(--fs-small)] " +
                  (on
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                    : "border-border text-muted-foreground")
                }
              >
                {p}
              </span>
            )
          })}
        </div>

        {/* 🔒 СНИМОК НАЗВАН СНИМКОМ. Список нельзя порождать: пакет стоит у
            службы входа, а не здесь. Раз он написан руками — у него обязаны быть
            версия и дата, иначе через полгода никто не поймёт, чему он
            соответствовал. */}
        <Small className="text-muted-foreground">
          {w.catSnapshot.replace("{date}", AUTH_LIB_SNAPSHOT)}
        </Small>

        {/* 🔒 АДРЕС ПОДДЕРЖКИ, А НЕ КНОПКА «ВКЛЮЧИТЬ». Ни один из этих
            провайдеров не появляется нажатием: нужны ключи, адрес возврата и
            кнопка на странице входа. Кнопка обещала бы работу, которой нет. */}
        <Small className="text-muted-foreground">
          {w.catAsk}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </Small>
      </section>

      {/* ── 2. Роли ───────────────────────────────────────────────────── */}
      <section data-auth-roles className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} aria-hidden className="shrink-0 text-muted-foreground" />
          <H4 variant="ui">{w.rolesTitle}</H4>
        </div>
        <Small className="text-muted-foreground">{w.rolesLead}</Small>

        {/* 🔒 ТРИ ЯРУСА ДОСТУПА ОТДЕЛЕНЫ ОТ ОСТАЛЬНЫХ, И ЭТО НЕ ОФОРМЛЕНИЕ.
            Только их ПРИНУЖДАЕТ подложка; остальные двенадцать — словарь, на
            который приложение опирается само. Смешать их в один ряд значило бы
            обещать, что `manager` кого-то останавливает сам по себе. */}
        <div className="flex flex-col gap-1.5">
          <Small className="font-medium text-foreground">{w.rolesTiersTitle}</Small>
          <div className="flex flex-wrap gap-1.5">
            {ACCESS_TIERS.map(r => (
              <span
                key={r}
                data-role-tier={r}
                className="rounded-md border border-primary/40 bg-primary/5 px-2 py-0.5 font-mono text-[length:var(--fs-small)] text-foreground"
              >
                {r}
              </span>
            ))}
          </div>
          <Small className="text-muted-foreground">{w.rolesTiersHint}</Small>
        </div>

        <div className="flex flex-col gap-1.5">
          <Small className="font-medium text-foreground">{w.rolesVocabTitle}</Small>
          <div className="flex flex-wrap gap-1.5">
            {ALL_ROLES.filter(r => !(ACCESS_TIERS as readonly string[]).includes(r)).map(r => (
              <span
                key={r}
                data-role-vocab={r}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-[length:var(--fs-small)] text-muted-foreground"
              >
                {r}
              </span>
            ))}
          </div>
          <Small className="text-muted-foreground">{w.rolesVocabHint}</Small>
        </div>
      </section>

      {/* ── 3. Гостевая роль ──────────────────────────────────────────── */}
      <section data-auth-guest className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <UserPlus size={15} aria-hidden className="shrink-0 text-muted-foreground" />
          <H4 variant="ui">{w.guestTitle}</H4>
        </div>
        <Small className="text-muted-foreground">{w.guestLead}</Small>
        <Small className="text-muted-foreground">{w.guestHow}</Small>
        <Small className="text-muted-foreground">
          <strong className="text-foreground">{w.guestReadyTitle}</strong> {w.guestReady}
        </Small>
      </section>

      {/* ── 4. Оранжевое предупреждение о режиме разработки ───────────── */}
      {/* 🔒 ОРАНЖЕВЫЙ — «ЧТО СДЕЛАТЬ», И ЭТО ЕДИНСТВЕННАЯ ТРЕВОГА НА СТРАНИЦЕ.
          Закон стандарта секции: один цвет тревоги на экран, и лучше ни одного;
          тон, стоящий у каждого абзаца, к третьему разу не значит ничего. */}
      <section
        data-auth-devwarning
        className="flex items-start gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
      >
        <AlertTriangle size={15} aria-hidden className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
        <div className="flex min-w-0 flex-col gap-2">
          <H4 variant="ui">{w.devTitle}</H4>
          <Small className="text-amber-800 dark:text-amber-200">{w.devLead}</Small>
          <Small className="text-amber-800 dark:text-amber-200">{w.devWhy}</Small>
        </div>
      </section>
    </div>
  )
}
