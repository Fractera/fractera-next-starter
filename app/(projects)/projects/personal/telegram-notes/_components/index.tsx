import Link from "next/link";
import { getAppConfig } from "@/config/app-config";
import { PROJECT_DESCRIPTION } from "../_data/description";
import { DEFAULT_HOOKS } from "../_data/hooks";
import { projectTabStrings } from "../_data/tab-i18n";
import { getCronJobs, getHooks, getNotes } from "../_lib/project-data";
import { AboutAccordion } from "./about-accordion.client";
import { CronJobsTable } from "./cron-jobs-table.server";
import { HooksPanel } from "./hooks-panel.client";
import { MissingKeysModal } from "./missing-keys-modal.client";
import { NotesTable } from "./notes-table.client";
import { ProcessFlow } from "./process-flow.client";
import { ProjectFooter } from "./project-footer.client";
import { RunPanel } from "./run-panel.client";
import { StatusIndicator } from "./status-indicator.client";

// The Projects zone renders in English for now (owner, step 188 — multilingual is a
// separate later step). The canvas + settings were always English.
const LANG = "en";

// Approximate the run-countdown period from a 5-field cron schedule: "* * * * *" =
// every minute; "*/N * * * *" = every N minutes. Phase 4 makes the interval adjustable.
function schedulePeriodSec(schedule: string): number {
  const minute = schedule.trim().split(/\s+/)[0] ?? "*";
  if (minute === "*") return 60;
  const m = /^\*\/(\d+)$/.exec(minute);
  if (m) return Math.max(30, Number(m[1]) * 60);
  return 60;
}

// The project's standalone page (contract R9), reshaped for step 188 Phase 2: a status
// pill by the title, the "About" accordion, the process canvas (R6), a run panel with a
// countdown to the next scheduled run, the Hooks layer, and the scheduled-runs queue.
// The two repetitive process/results tables are replaced by one unified table in Phase 3.
export default async function TelegramNotesProjectEntry() {
  const [cronJobs, hooks, notes] = await Promise.all([
    getCronJobs(),
    getHooks(),
    getNotes(20),
  ]);
  // The Hooks layer (187.4) shows only for automations that use spoken triggers.
  const showHooks = DEFAULT_HOOKS.length > 0 || hooks.length > 0;
  const d = PROJECT_DESCRIPTION;
  const t = projectTabStrings(LANG);
  const enabledJob = cronJobs.find((j) => j.enabled);
  const cronEnabled = Boolean(enabledJob);
  const periodSec = schedulePeriodSec(
    enabledJob?.schedule ?? cronJobs[0]?.schedule ?? "* * * * *",
  );

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      {/* Native missing-keys modal (186.3): prompts for any declared integration
          key absent from the runtime env; renders nothing when none are required. */}
      <MissingKeysModal lang={LANG} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/projects/personal"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← personal
          </Link>
          <h1 className="mt-2 text-3xl font-semibold">{d.title}</h1>
        </div>
        {/* Running / degraded / broken pill on the breadcrumb row. */}
        <StatusIndicator cronEnabled={cronEnabled} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">{t.about}</h2>
        <AboutAccordion />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">{t.diagram}</h2>
        <ProcessFlow />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">{t.run}</h2>
        <RunPanel periodSec={periodSec} enabled={cronEnabled} />
      </section>

      {showHooks && (
        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t.hooks}</h2>
          <HooksPanel initialHooks={hooks} />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Records &amp; requests</h2>
        <NotesTable initialRows={notes.rows} initialTotal={notes.total} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">{t.scheduled}</h2>
        <CronJobsTable jobs={cronJobs} />
      </section>

      {/* Per-project footer (186.2): brand + deep-links + day/night theme toggle. */}
      <ProjectFooter shortName={getAppConfig().short_name} lang={LANG} />
    </main>
  );
}
