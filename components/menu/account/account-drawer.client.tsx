"use client";

import Link from "next/link";
import { useState } from "react";
import { User, LogOut, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { AuthShellSide } from "@/components/menu/account/account-config";
import type { AccountLabels } from "@/components/menu/account/account-menu.i18n";

// Full-height account drawer (step 161). Opens from the side set by NEXT_PUBLIC_APP_SHELL_AUTH;
// taller than the left/right page drawers (which start below the header). Three zones:
//   (top) sticky title; (middle) scroll area — the Projects accordion for architect/manager
//   (step 177), empty for everyone else; (bottom) fixed: sign out, then the identity row
//   (info icon → role tooltip + the email).
// Owns its OWN open state — DrawerProvider is structurally two-sided (left/right) and must not
// carry a third drawer. UI standard: shadcn Sheet (Radix) + lucide; trigger = shadcn Button
// (Base UI, no asChild) driving controlled state.
// 🔒 ПУНКТЫ ПРИХОДЯТ СПИСКОМ, А НЕ ЗАШИТЫ ЗДЕСЬ. Ящик — переиспользуемая часть
// продукта, живущая на всех 82 языках; страницы проекта у каждого клиента свои.
// Впиши сюда «Управление товарами» — и слово либо соврёт про 82 языка, либо
// потребует перевода на 82 ради страницы, которой в соседнем проекте нет.
// Поэтому ящик знает форму пункта (адрес, подпись, роли), а чем его наполнить,
// решает приложение — там же, где живут слова этой страницы.
export type DrawerLink = {
  href: string;
  label: string;
  /** Кому пункт виден. Пусто — виден всем вошедшим. */
  roles?: readonly string[];
};

export function AccountDrawer({ lang, side, labels, email, roles, links, appName, appDescription }: {
  lang: string;
  side: AuthShellSide;
  labels: AccountLabels;
  email?: string;
  roles?: string[];
  /** Пункты рабочих разделов — их состав задаёт приложение. */
  links?: DrawerLink[];
  // Step 500 — identity of this workspace, read from APP-CONFIG by the server
  // component that mounts the drawer. The same pair the home page renders.
  appName?: string;
  appDescription?: string;
}) {
  const [open, setOpen] = useState(false);
  const roleList = roles && roles.length ? roles : [];
  const visible = (links ?? []).filter(
    (l) => !l.roles?.length || l.roles.some((r) => roleList.includes(r)),
  );

  return (
    <>
      {/* Mobile: avatar only (no "My account" text) — the label stays for ≥ sm and
          as the accessible name at every width. */}
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={labels.account} title={labels.account}>
        <User /><span className="hidden sm:inline">{labels.account}</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side} className="w-80 sm:max-w-sm p-0 gap-0 flex flex-col">
          <SheetHeader className="border-b border-border">
            <SheetTitle>{labels.account}</SheetTitle>
          </SheetHeader>

          {/* Middle (step 500) — the Projects accordion is gone together with the
              projects layer. The drawer now says whose workspace this is: name and
              description straight from APP-CONFIG, the same pair the home renders. */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {appName ? <p className="text-base font-semibold text-foreground">{appName}</p> : null}
            {appDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{appDescription}</p>
            ) : null}

            {/* Рабочие разделы. Роль сверяется ЗДЕСЬ только ради того, чтобы не
                показывать заведомо закрытую дверь: настоящая проверка стоит на
                самой странице (layout подгруппы). Спрятанный пункт — вежливость,
                а не защита; порядок проверок разный, и путать их нельзя. */}
            {visible.length > 0 && (
              <nav className="mt-5 flex flex-col gap-1 border-t border-border pt-4">
                {visible.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start")}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Bottom — fixed: identity row on top, sign out below; both left-aligned. */}
          <div className="mt-auto border-t border-border p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {roleList.length ? (
                      <ul className="flex flex-col gap-0.5">
                        {roleList.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    ) : "—"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-foreground truncate">{email}</span>
            </div>
            <Separator />
            {/* Sign out mirrors sign-in (step 169): a RELATIVE /logout link that proxy.ts
                (AUTH_FORM_PATHS) redirects to the auth service with an absolute redirectUrl
                back to this site. Never a bare /api/auth/* path — this app has none (404). */}
            <Link href={`/logout?lang=${lang}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start")}>
              <LogOut />{labels.signOut}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
