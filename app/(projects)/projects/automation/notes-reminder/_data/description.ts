export const PROJECT_DESCRIPTION = {
  title: "Notes Reminder",
  category: "automation",
  purpose: "Collect pending notes automatically every day at 09:00 UTC.",
  automation: "A cron process collects all pending notes and stores the collection results in reminders_history.",
  how: "The diagram shows the flow: pending notes are collected at the scheduled time (09:00 UTC), the collection is processed, and results are saved to the reminders_history table for tracking and auditing.",
} as const;
