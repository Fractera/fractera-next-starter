"use client"

import { useState } from "react"
import { Check, CircleSlash, HelpCircle, Loader2, Sparkles } from "lucide-react"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Small, P } from "@/components/ui/typography"
import { socialIcon } from "@/components/icons/socials"
import type { SocialCandidate, SocialProposal, SocialResolveResult } from "../types/socials-ai"

// ОКНО ИНСТРУМЕНТА «СОЦСЕТИ ЧЕРЕЗ ИИ» (31-25, 2026-08-29).
//
// Перенос из панели управления по слову владельца, со ЗНАЧИТЕЛЬНОЙ переделкой
// облика: «он требует адаптации стилей нашим существующим стандартам этого
// приложения». В панели это был встроенный в форму блок с кеглями 10–11px и
// самодельной подложкой; здесь — окно продукта `AppDialog`, примитивы
// `components/ui/*` и шкала `--fs-*`.
//
// 🔒 САМОДЕЛЬНОЕ ОКНО ЗАПРЕЩЕНО ГЕЙТОМ `check:dialogs`, И ЗАПРЕЩЕНО ПО ДЕЛУ. Ручная
// подложка не несёт ни `role="dialog"`, ни ловушки фокуса, ни Escape, ни замка
// прокрутки: выглядит одинаково, пользоваться с клавиатуры нельзя.
//
// 🔒 ЧЕЛОВЕК ВЫБИРАЕТ ПРОФИЛЬ, МОДЕЛЬ ТОЛЬКО ПРЕДЛАГАЕТ. Из фразы рождается
// несколько кандидатов, и каждый проверен обращением к сети. Автоматический выбор
// «самого вероятного» ошибётся молча — а ссылка в подвале сайта ведёт на чужой
// профиль до тех пор, пока кто-нибудь не нажмёт.
//
// 🔒 У ТРЁХ ИСХОДОВ ПРОВЕРКИ РАЗНЫЙ ВИД, А НЕ РАЗНЫЙ ОТТЕНОК ОДНОГО. `closed`
// значит «сеть не отвечает посторонним», и это НЕ «профиля нет»: Instagram и
// LinkedIn закрываются от ботов независимо от существования профиля.

export type SocialsAiUi = {
  open: string
  title: string
  description: string
  phraseLabel: string
  phrasePlaceholder: string
  recognize: string
  recognizing: string
  proposalTitle: string
  valueLabel: string
  ownValue: string
  add: string
  outcomeExists: string
  outcomeAbsent: string
  outcomeClosed: string
  noKey: string
  unknownNetwork: string
  modelFailed: string
  cancel: string
}

export type ResolvedSocial = {
  name: string
  urlTemplate: string
  value: string
  icon?: string
}

const OUTCOME_TONE = {
  exists: "text-emerald-700 dark:text-emerald-400",
  absent: "text-muted-foreground",
  closed: "text-amber-700 dark:text-amber-400",
} as const

function OutcomeIcon({ outcome }: { outcome: SocialCandidate["outcome"] }) {
  if (outcome === "exists") return <Check className="size-4 shrink-0" aria-hidden />
  if (outcome === "absent") return <CircleSlash className="size-4 shrink-0" aria-hidden />
  return <HelpCircle className="size-4 shrink-0" aria-hidden />
}

export function SocialsAiDialog({
  lang,
  ui,
  dialogUi,
  onAdd,
  disabled,
}: {
  lang: string
  ui: SocialsAiUi
  dialogUi: AppDialogUi
  /** Принятая запись едет в конструктор; сохраняет её владелец кнопкой формы. */
  onAdd: (link: ResolvedSocial) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [phrase, setPhrase] = useState("")
  const [busy, setBusy] = useState(false)
  const [proposal, setProposal] = useState<SocialProposal | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [ownValue, setOwnValue] = useState("")

  function reset() {
    setPhrase("")
    setProposal(null)
    setNote(null)
    setOwnValue("")
  }

  async function recognize() {
    if (!phrase.trim() || busy) return
    setBusy(true)
    setNote(null)
    setProposal(null)
    try {
      const res = await fetch("/api/architect/social-resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phrase, lang }),
      })
      const data = (await res.json()) as SocialResolveResult
      if (data.ok) {
        setProposal(data)
        setOwnValue("")
        return
      }
      // 🔒 ОТКАЗ НАЗЫВАЕТСЯ СВОИМ ИМЕНЕМ. Без ключа помощник не работает, а
      // конструктор соцсетей работает: окно закрывают и заводят сеть руками.
      setNote(
        data.reason === "no-key"
          ? ui.noKey
          : data.reason === "unknown-network"
            ? ui.unknownNetwork
            : ui.modelFailed,
      )
    } catch {
      setNote(ui.modelFailed)
    } finally {
      setBusy(false)
    }
  }

  function accept(value: string) {
    const v = value.trim().replace(/^@/, "")
    if (!v || !proposal) return
    onAdd({
      name: proposal.name,
      urlTemplate: proposal.urlTemplate,
      value: v,
      icon: proposal.iconKey || undefined,
    })
    setOpen(false)
    reset()
  }

  const Icon = socialIcon(proposal?.iconKey)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        data-socials-ai
        onClick={() => setOpen(true)}
      >
        <Sparkles className="size-4" aria-hidden />
        {ui.open}
      </Button>

      <AppDialog
        open={open}
        onOpenChange={next => {
          setOpen(next)
          if (!next) reset()
        }}
        title={ui.title}
        description={ui.description}
        ui={dialogUi}
        size="lg"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Small className="font-medium text-foreground">{ui.phraseLabel}</Small>
            {/* Область текста, а не строка: фраза здесь описательная — «мой
                инстаграм, псевдоним транслитерацией через дефис». */}
            <Textarea
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
              placeholder={ui.phrasePlaceholder}
              rows={3}
              dir="auto"
              className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
            />
            <div>
              <Button type="button" onClick={recognize} disabled={busy || !phrase.trim()} data-socials-ai-run>
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
                {busy ? ui.recognizing : ui.recognize}
              </Button>
            </div>
          </div>

          {note && (
            <p
              data-socials-ai-note
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-[length:var(--fs-small)] leading-relaxed text-amber-800 dark:text-amber-200"
            >
              {note}
            </p>
          )}

          {proposal && (
            <div data-socials-ai-proposal className="flex flex-col gap-4 rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <Icon className="size-6 shrink-0" />
                <div className="min-w-0">
                  <P className="text-[length:var(--fs-body)] font-medium">{proposal.name}</P>
                  <Small className="block truncate font-mono">{proposal.urlTemplate}</Small>
                </div>
              </div>

              {proposal.valueHint && <Small>{proposal.valueHint}</Small>}

              {proposal.candidates.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {proposal.candidates.map(c => (
                    <li
                      key={c.value}
                      data-socials-ai-candidate={c.outcome}
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                    >
                      <span className={"flex min-w-0 items-center gap-2 " + OUTCOME_TONE[c.outcome]}>
                        <OutcomeIcon outcome={c.outcome} />
                        <span className="min-w-0">
                          <span className="block truncate text-[length:var(--fs-body)] text-foreground">{c.value}</span>
                          <span className="block truncate text-[length:var(--fs-small)]">
                            {c.url} ·{" "}
                            {c.outcome === "exists"
                              ? ui.outcomeExists
                              : c.outcome === "absent"
                                ? ui.outcomeAbsent
                                : ui.outcomeClosed}
                          </span>
                        </span>
                      </span>
                      <Button type="button" size="sm" onClick={() => accept(c.value)} className="shrink-0">
                        {ui.add}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Свой вариант нужен всегда: модель могла не угадать ни одного, а
                  правило сборки адреса она уже дала — это половина работы. */}
              <div className="flex flex-col gap-2">
                <Small className="font-medium text-foreground">{ui.ownValue}</Small>
                <div className="flex items-center gap-2">
                  <Input
                    value={ownValue}
                    onChange={e => setOwnValue(e.target.value)}
                    placeholder={ui.valueLabel}
                    dir="auto"
                    className="text-[length:var(--fs-body)] md:text-[length:var(--fs-body)]"
                  />
                  <Button type="button" onClick={() => accept(ownValue)} disabled={!ownValue.trim()} className="shrink-0">
                    {ui.add}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppDialog>
    </>
  )
}
