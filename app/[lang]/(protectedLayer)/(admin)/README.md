# (admin) — the project itself

**Roles:** `admin`, `architect`.

**The test:** the page administers the PROJECT rather than serving its business — accounts and their
roles, configuration, deployment history, diagnostics.

**Where the boundary with the control panel runs.** Anything that belongs to the platform — settings
storage, the data layer, authorization, deployment — lives in the control panel on `:3002`, outside this
repository and outside the customer's git. What belongs here is administration of THIS application:
screens whose data is the project's own. When a request sounds like "add a setting to the panel", say
which layer it belongs to instead of building a second panel here.

**Empty for now** — the project-users page is the first one planned.
