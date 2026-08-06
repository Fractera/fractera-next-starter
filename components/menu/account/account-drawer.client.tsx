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
export function AccountDrawer({ lang, side, labels, email, roles, appName, appDescription }: {
  lang: string;
  side: AuthShellSide;
  labels: AccountLabels;
  email?: string;
  roles?: string[];
  // Step 500 — identity of this workspace, read from APP-CONFIG by the server
  // component that mounts the drawer. The same pair the home page renders.
  appName?: string;
  appDescription?: string;
}) {
  const [open, setOpen] = useState(false);
  const roleList = roles && roles.length ? roles : [];

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
