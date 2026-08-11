"use client"

// AccessGate — the one door of the protected layer.
//
// 🔒 WHAT THIS IS AND IS NOT. This is HONEST SIGNAGE, not a lock. A check that
// runs in the browser can be switched off in the browser. The lock is the
// server: every `/api/*` route that returns protected data re-checks the
// session and the role, and refuses without one. If you ever find a page whose
// data is safe only because this component rendered, the data route is broken —
// fix it there, not here.
//
// 🔒 WHY IT IS AN ISLAND AND NOT A LAYOUT CHECK. Reading the session in a
// layout (`auth()`, `cookies()`, `headers()`) turns the entire subtree dynamic
// in one line, and the protected layer is built on a prerendered shell. So the
// shell renders instantly for everyone, and this island answers "may I?" after
// hydration. The visitor sees the frame of the page immediately and the verdict
// a moment later — instead of a blank wait for an answer they usually get.
//
// The dialog is deliberately a DIALOG and not a toast. Three actions do not fit
// legibly in a toast, and a person who cannot open a page needs a decision, not
// a notification that slides away while they read it.

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { registerRedirectUrl } from "@/lib/runtime-urls"
import type { AccessGateUi } from "./access-gate.i18n"

type Verdict = "checking" | "allowed" | "denied"

export function AccessGate(
  { roles, lang, ui, children }:
  { roles: readonly string[]; lang: string; ui: AccessGateUi; children: React.ReactNode },
) {
  const router = useRouter()
  const t = ui
  const [verdict, setVerdict] = useState<Verdict>("checking")

  useEffect(() => {
    let alive = true
    fetch("/api/me")
      .then(res => (res.ok ? res.json() : null))
      .then((me: { roles?: string[] } | null) => {
        if (!alive) return
        const mine = me?.roles ?? []
        setVerdict(mine.some(r => roles.includes(r)) ? "allowed" : "denied")
      })
      .catch(() => alive && setVerdict("denied"))
    return () => { alive = false }
  }, [roles])

  // Пока идёт проверка, содержимое УЖЕ на экране: каркас статический и ничьих
  // данных не несёт. Прятать его на время вопроса значит показывать пустоту там,
  // где нечего скрывать.
  if (verdict !== "denied") return <>{children}</>

  return (
    <>
      {children}
      <Dialog open>
        <DialogContent className="max-w-md" onEscapeKeyDown={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert size={16} /> {t.title}
            </DialogTitle>
          </DialogHeader>

          {/* Роли названы поимённо. «Недостаточно прав» без перечня — тупик:
              человек не знает, чего просить и у кого. */}
          <p className="text-sm text-muted-foreground">
            {t.needRoles.replace("{roles}", roles.join(", "))}
          </p>
          <p className="text-sm text-muted-foreground">{t.haveAccess}</p>
          <p className="text-sm text-muted-foreground">{t.wrongPlace}</p>

          <div className="mt-2 flex flex-col gap-2">
            {/* Адрес возврата — ЭТА страница: после входа человек оказывается
                там, куда шёл, а не на чужой стартовой. */}
            <Button
              onClick={() => { window.location.href = registerRedirectUrl(window.location.href, "user") }}
            >
              {t.signIn}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/${lang}`)}>
              {t.goHome}
            </Button>
            {/* «Отмена» = назад. По прямой ссылке истории нет — тогда это тот же
                корень, потому что кнопка, которая ничего не делает, хуже её
                отсутствия. */}
            <Button
              variant="ghost"
              onClick={() => {
                if (window.history.length > 1) router.back()
                else router.push(`/${lang}`)
              }}
            >
              {t.cancel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** Полоска ожидания для страниц, которым нужно показать, что проверка идёт. */
export function AccessChecking({ ui }: { ui: AccessGateUi }) {
  const t = ui
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 size={12} className="animate-spin" /> {t.checking}
    </span>
  )
}

