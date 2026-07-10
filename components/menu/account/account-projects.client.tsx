"use client";

import { FolderKanban } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projectsBase } from "@/lib/runtime-urls";

// Projects entry of the account drawer. Since step 197 the Projects layer runs in its OWN process
// (fractera-projects :3003, projects.<apex> in domain mode), NOT in this slot — so this is a plain
// LAUNCHER into that service, not a per-project accordion fed by an fs-scan of the slot (which no
// longer holds the zone). The projects service carries its own navigation (zone header + the four
// category hubs). Rendered ONLY for architect/manager (gate in account-drawer). The href is derived
// from the browser host at click time (IP vs domain), so it works in both modes with one build.
export function AccountProjects({ label }: { label: string }) {
  return (
    <a
      href={`${projectsBase()}/projects/personal`}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "w-full justify-start gap-2 py-3 font-normal",
      )}
    >
      <FolderKanban className="size-4 text-muted-foreground" aria-hidden />
      {label}
    </a>
  );
}
