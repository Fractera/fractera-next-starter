"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "../_lib/project-data";

// Calendar section (step 205 §H): a two-column layout — a month calendar (left, ~300px) whose dates with
// events are marked, and a text list (right, same height) showing the selected date's events. Records live
// in a table below (rendered by the page). Self-contained: a plain month grid, NO external calendar dep,
// works with JavaScript off degrading to "no interactivity" (the marks still render for the current month).
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function ymd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function CalendarSection({ events }: { events: CalendarEvent[] }) {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<string | null>(ymd(now.getFullYear(), now.getMonth(), now.getDate()));

  // date → events (all months); and the set of marked dates for quick lookup.
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  // Build the grid cells for the viewed month, Monday-first.
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startOffset = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: Array<{ day: number; date: string } | null> = [];
    for (let i = 0; i < startOffset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push({ day: d, date: ymd(view.y, view.m, d) });
    return out;
  }, [view]);

  const selectedEvents = selected ? byDate.get(selected) ?? [] : [];

  function shift(delta: number) {
    setView((v) => {
      const m = v.m + delta;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  }

  return (
    // Left column: a FIXED 300px-wide calendar on desktop (never stretches with the viewport); full
    // width on mobile with the events column dropping below. Height is DYNAMIC — the calendar sizes to
    // its own weeks (5-6 rows) so the last date rows never overflow (step 205 calendar fix).
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      {/* Left: month calendar — 300px wide, height fits content */}
      <div className="w-full rounded-lg border p-3 sm:w-[300px] sm:shrink-0">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" onClick={() => shift(-1)} className="rounded p-1 hover:bg-muted" aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-medium">{MONTHS[view.m]} {view.y}</span>
          <button type="button" onClick={() => shift(1)} className="rounded p-1 hover:bg-muted" aria-label="Next month">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-0.5">{w}</div>
          ))}
        </div>
        <div className="mt-0.5 grid grid-cols-7 gap-0.5 text-center text-xs">
          {cells.map((c, i) => {
            if (!c) return <div key={i} />;
            const marked = byDate.has(c.date);
            const isSel = c.date === selected;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(c.date)}
                className={`relative aspect-square rounded hover:bg-muted ${isSel ? "bg-primary text-primary-foreground" : ""}`}
              >
                {c.day}
                {marked && (
                  <span className={`absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full ${isSel ? "bg-primary-foreground" : "bg-primary"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: events of the selected date — takes the remaining width; height grows with content. */}
      <div className="w-full rounded-lg border p-3 sm:flex-1">
        <p className="mb-2 text-sm font-medium">{selected ?? "Pick a date"}</p>
        {selectedEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground">No events on this date.</p>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((e, i) => (
              <li key={i} className="text-sm">
                <span className="font-mono text-xs text-muted-foreground">{e.time}</span> — {e.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
