"use client";

import Link from "next/link";
import { useState } from "react";
import { User, LogOut, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { AuthShellSide } from "@/components/menu/account/account-config";
import type { AccountLabels } from "@/components/menu/account/account-menu.i18n";

// Full-height account drawer (step 161). Opens from the side set by NEXT_PUBLIC_APP_SHELL_AUTH;
// taller than the left/right page drawers (which start below the header). Three zones:
//   (top) sticky title; (middle) empty scroll area — future links, out of this step's scope;
//   (bottom) fixed: sign out, then the identity row (info icon → role tooltip + the email).
// Owns its OWN open state — DrawerProvider is structurally two-sided (left/right) and must not
// carry a third drawer. UI standard: shadcn Sheet (Radix) + lucide; trigger = shadcn Button
// (Base UI, no asChild) driving controlled state.
export function AccountDrawer({ side, labels, email, roles }: {
  side: AuthShellSide;
  labels: AccountLabels;
  email?: string;
  roles?: string[];
}) {
  const [open, setOpen] = useState(false);
  const roleList = roles && roles.length ? roles : [];

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <User />{labels.account}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side} className="w-80 sm:max-w-sm p-0 gap-0 flex flex-col">
          <SheetHeader className="border-b border-border">
            <SheetTitle>{labels.account}</SheetTitle>
          </SheetHeader>

          {/* Middle — future account links/buttons; intentionally empty this step. */}
          <div className="flex-1 overflow-y-auto" />

          {/* Bottom — fixed: sign out + the identity row. */}
          <div className="mt-auto border-t border-border p-3 flex flex-col gap-3">
            <Link href="/api/auth/signout" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <LogOut />{labels.signOut}
            </Link>
            <Separator />
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
