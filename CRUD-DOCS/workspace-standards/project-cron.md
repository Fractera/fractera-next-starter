# Project cron — declaring scheduled processes (Projects layer)

Every project of the Projects layer (`app/(projects)/projects/<category>/<project>/`) can run
scheduled processes. The scheduler is NOT part of this app: it is the substrate PM2 process
**`fractera-cron`** — it survives a slot rebuild/swap, scans the slot for declarations on every
tick (~15–30 s) and idles when the slot is empty. You never start, restart or configure the
runner; you only DECLARE jobs.

## The declaration — `cron.json`

One file per project, next to its `page.tsx`:

```
app/(projects)/projects/<category>/<project>/cron.json
```

```json
{
  "jobs": [
    {
      "id": "publish-daily",
      "title": "Publish daily article",
      "schedule": "0 9 * * *",
      "action": { "type": "http", "url": "http://127.0.0.1:3000/api/...", "method": "POST", "body": {} },
      "enabled": true,
      "timeoutMs": 600000
    },
    {
      "id": "collect-metrics",
      "title": "Collect metrics",
      "schedule": "*/15 * * * *",
      "action": { "type": "script", "file": "_cron/collect.mjs" }
    }
  ]
}
```

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | Stable job identifier, unique within the project. The journal key is `<category>/<project>#<id>`. |
| `title` | no | Human name shown in the page tables (defaults to `id`). |
| `schedule` | yes | Standard 5-field cron (`minute hour dom month dow`), **server local time**. Supports `*`, values, ranges (`1-5`), steps (`*/15`), lists (`1,15,30`); `dow` 0 or 7 = Sunday. |
| `action` | yes | What to run — see below. |
| `enabled` | no | `false` pauses the job without deleting the declaration (default `true`). |
| `timeoutMs` | no | Kill/abort limit per run. Default 10 min, max 60 min. |

The runner re-reads declarations every tick: adding/editing/removing `cron.json` needs **no
restart and no rebuild** (the file is data, not build input). Removing a job removes its row
from the jobs table; the runs journal is kept.

## Actions (v1)

- **`{ "type": "http", "url", "method"?, "body"? }`** — an HTTP call, typically to a local
  endpoint of this app (`http://127.0.0.1:3000/api/...`). `method` defaults to `POST`; `body`
  is sent as JSON. Non-2xx → the run is `failed` with the response text as the error.
- **`{ "type": "script", "file" }`** — a Node script run as `node <file>`. `file` is relative
  to the project folder and MUST stay inside it (co-location; an escaping path is refused).
  `cwd` = the project folder. `process.env` additionally carries every key of the slot's
  `app/.env.local` — integration keys persisted via `persist-env-var-with-rebuild` are
  available at run time. Non-zero exit (or timeout kill) → `failed` with stderr as the error.

## Result contract

A run may report a produced artifact by returning

```json
{ "resultTitle": "Article published", "artifactUrl": "/en/news/my-article" }
```

— for `http` as the response JSON, for `script` as the **last stdout line**. Both fields are
optional; a run without them is journaled with its status only (it appears in the queue table
but not in the results table).

## Journal & the project page

The runner writes two tables in the shared app DB (declared in `SCHEMA`, `lib/db/index.ts`;
the runner carries a textually identical DDL so an empty slot still gets them):

- **`project_cron_jobs`** — the declaration mirror + last run state (synced from `cron.json`).
- **`project_cron_runs`** — one row per firing: `in-progress` → `completed`/`failed`,
  started/finished timestamps, `result_title`/`result_url`/`error`.

The project page (frozen `project-page` primitive) reads `project_cron_runs` in
`_lib/project-data.ts`: the queue table shows recent runs, the results table shows completed
runs that reported a `resultTitle`. No wiring is needed — compose the project, drop a
`cron.json`, and the tables fill.

## Guarantees & limits

- **Overlap = skip**: while a job's previous run is still going, a new firing is skipped
  (logged, not journaled).
- One firing per matching minute; if the runner was down during the minute, the firing is
  missed (no catch-up in v1).
- Job stdout/stderr are not persisted beyond the error excerpt — a job that needs rich output
  should write it to the DB or the filesystem itself and report an `artifactUrl`.
