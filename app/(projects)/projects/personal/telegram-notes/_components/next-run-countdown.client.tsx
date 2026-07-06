"use client";

import { useEffect, useState } from "react";

// Countdown to the next scheduled (cron) run of the automation (step 188 Phase 2).
// Mirrors the Admin live-refresh bar: a shrinking bar + "in Xs" text, so the owner
// sees when the pipeline will next tick. The period comes from the co-located
// cron.json schedule (minute cron = 60s); Phase 4 makes the interval adjustable.
export function NextRunCountdown({ periodSec, enabled }: { periodSec: number; enabled: boolean }) {
  const [remaining, setRemaining] = useState(periodSec);

  useEffect(() => {
    if (!enabled) return;
    function tick() {
      const now = Math.floor(Date.now() / 1000);
      const rem = periodSec - (now % periodSec);
      setRemaining(rem === 0 ? periodSec : rem);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [periodSec, enabled]);

  if (!enabled) {
    return (
      <p className="text-sm text-muted-foreground">
        Automation stopped — no scheduled runs.
      </p>
    );
  }

  const pct = Math.max(0, Math.min(100, (remaining / periodSec) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Next automatic run</span>
        <span>in {remaining}s</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
