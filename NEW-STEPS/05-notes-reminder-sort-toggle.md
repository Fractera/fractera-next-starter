# 05 — Notes reminder sort toggle

> Development step · importance: mandatory · status: in-progress

## Owner Request

Add an accessible Russian sort-order toggle to `/projects/automation/notes-reminder` so the results table can switch between the current order and newest-first order by the run timestamp.

## Planned Result

- The Results table keeps the existing default order on first render.
- A visible button/toggle with Russian labels switches between `Новые сверху` and `Старые сверху`.
- Sorting uses the available timestamp field (`started_at`, equivalent to the run creation timestamp in this route).
- The route remains static-first compatible: the page stays a server entry, with client state isolated in a leaf component.
- Verification includes build/test output and manual route instructions.

## Checklist

- [ ] Inspect route data flow and component boundaries.
- [ ] Add client-side sort toggle for the already-loaded result array.
- [ ] Add or update component test if the project has component test infrastructure.
- [ ] Run validation commands.
- [ ] Commit changes and report branch/commit.

<!-- fractera:step
{"number":5,"name":"Notes reminder sort toggle","importance":"mandatory","status":"in-progress","description":"Add accessible Russian sort-order toggle to the notes-reminder results table while preserving static-first route shape.","tasks":[{"title":"Inspect route data flow and component boundaries","status":"pending"},{"title":"Add client-side sort toggle","status":"pending"},{"title":"Validate with tests/build","status":"pending"},{"title":"Commit and report","status":"pending"}]}
-->
