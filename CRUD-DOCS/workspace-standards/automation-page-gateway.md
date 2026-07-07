# The Automation⇄Page Gateway — the one standard for automation-owned surfaces

> **This single file is self-sufficient.** It is the authoritative standard for HOW an automation (a project
> of the Projects layer) creates, moderates and operates a **page** it owns — the realization of a `page`
> output port from the automation ontology (`automation-ontology.md` §E, entity 14 **Port**). If every other
> doc were deleted and only this one kept, the gateway contract could be understood and built without reading
> any prior step. This doc is agent-facing and English-only (read by AI agents — no RU translation). The
> site's download button serves the identical English copy at FES `public/docs/automation-page-gateway.md`.
>
> **Scope note (read first):** this is the **STANDARD** — the typed contract. The **RUNTIME** that implements
> it (provision endpoint, operate endpoint, introspection endpoint, the first stateful Kanban primitive) is
> step **198**. Nothing runs yet: today a page is still born through the agent-time `owner_template_compose_*`
> + rebuild path. This doc defines the target the runtime builds toward.

---

## 0. Why this exists — an automation cannot compose a page at a cron tick

The ontology (`automation-ontology.md` §E) forces every automation to declare a typed **boundary**: input
ports and output ports. One port type is `page` — the automation MATERIALIZES or updates a public/owner
surface (a form, a dashboard, a course, a Kanban). The **forcing motive** is real: the `189-child-language-
courses` seed degenerated to Telegram→Telegram because nothing made it declare its true output — an
autonomous learner **page**. §E now forces the port; **this doc is HOW that `page` port is realized.**

The obvious realization — "let a step write the page files" — is **forbidden** (§E boundary rule 3). Page
files are the frozen constructor's territory (deterministic, no codegen, vetted bricks); a step hand-writing
JSX is exactly the untested, model-dependent code the whole system exists to avoid. The other obvious path —
the agent-time `owner_template_compose_*` MCP + a full slot rebuild — is a **human-in-the-loop, whole-file,
minutes-long** operation. A running automation, ticking on the **cheapest model** every night, cannot invoke
an agent and wait for a full rebuild. It needs a **runtime, typed, network boundary** it can call by name.

**That boundary is the gateway.** It is the concrete form of the frozen constructor's Slot A `(future)
runtime` list-provider seam (`frozen-template-constructor.md` §3/§4) — the seam was named there and is filled
here.

> **Economic core (embed everywhere).** A typed gateway manifest is exactly what a weak runtime model needs
> to act reliably without re-deriving intent: **design once (expensive) → run forever (cheap)**. The owner
> designs the automation + its page contract once with the smartest model; a cheap model then calls declared
> verbs indefinitely. Public framing: a job seeker spends minutes designing a LinkedIn-outreach automation
> with a strong model, then a cheap model runs it every day — versus driving a strong model directly per
> request, which devours an unemployed person's whole budget.

---

## 1. The contract in one sentence

> **An automation never touches a page's files. It calls DECLARED VERBS by name — each a `{ verb, JSON
> schema, role }` triple — over a versioned, token-authed network API. The contract is the page-type id + its
> verb manifest; the surface's internals are private.**

This is **loose coupling**, deliberately mirroring the ontology's §D pub/sub, where the contract between two
automations is the **event name**. Here the contract between an automation and a page is the **page-type id +
its manifest**. Rename or re-implement a Kanban internally and every automation that calls `addCard` keeps
working — the manifest is the seam, not the code. The gateway is **introspectable**: an automation fetches a
surface's manifest, discovers what it offers, and selects a verb ("analyze what the Kanban exposes, pick the
right API") — never hardcoded knowledge of one surface.

---

## 2. Two API planes (intent × access — never one create-vs-mutate axis)

A page-type exposes its capability as **two planes**, split by intent AND by who calls them:

| Plane | Holds | Who calls | Present for |
|---|---|---|---|
| **Management / provision** | create · configure · **moderate** the surface; provision (born once) | **privileged** — the owner + the automation-**as-builder** | **EVERY** page-type (always) |
| **Interaction** | runtime verbs over the surface's entities (`addCard` · `moveCard` · `submit`) | end-users + the automation-**as-participant**; gated by the surface's declared roles | **ONLY stateful/interactive** page-types |

- **Management is universal.** It generalizes today's agent-time `owner_template_*` / `owner_content_*` into
  something **runtime-callable + introspectable**. It includes **provision** — the surface is born exactly
  once from a frozen page-type + a payload validated against that type's schema, then published incrementally
  (ISR revalidate, not a full rebuild — a runtime detail delivered in 198).
- **Interaction is OPTIONAL and conditional.** It exists **only** for page-types that carry **State**.

> **🔒 The presence law.** *Interaction plane present ⇔ the surface carries State ⇔ its position on the
> static↔dynamic axis* (`frozen-template-constructor.md` §4/§6; `static-first.md`). A **blog has NO
> interaction plane** — it is read-only, and that is **correct, not a gap**. A **Kanban has a rich one** — it
> is a live, stateful board. Never bolt an operate API onto static content to "make it symmetric": that
> violates static-first. The static↔dynamic axis of a page-type **is** the test for whether the interaction
> plane exists.

---

## 3. The verb manifest — declared, never bespoke

Both planes are **declared verb manifests**, never hand-written endpoints. One manifest per page-type; each
entry is a triple:

```
{ verb, args (JSON schema), role, plane: "management" | "interaction" }
```

- **`verb`** — a stable name (`createBoard`, `configureColumns`, `moderateCard`, `addCard`, `moveCard`,
  `submit`). The name is the contract; renaming it is a breaking change (version it — §6).
- **`args`** — a JSON schema the gateway validates the call against **before** it reaches the surface. A
  malformed call is refused at the boundary, so a weak runtime model cannot corrupt state.
- **`role`** — who may invoke it (the enforced tiers `guest`/`user`/`architect` + business `ALL_ROLES`); the
  gateway gates every call by the surface's **declared** roles, exactly as the frozen layout gate does at
  build time (`frozen-template-constructor.md` §5).

**Introspection.** The gateway answers "what does this surface offer?" by returning its manifest. An
automation `GET`s the manifest, reads the verbs + schemas + roles, and picks one. This is what lets a generic
runtime model operate a surface it has never seen: it **reads the contract**, it does not guess. No verb is
implied; if it is not in the manifest, it does not exist (mirroring the ontology R6: what is not on the
diagram does not exist).

> **🔒 Open/Closed, no N².** A new page-type = a **new declared manifest**, never a new gateway and never an
> endpoint hand-coded per type. One gateway routes every call by `{ page-type, verb }` to the type's
> declared handler. This is the same anti-N² discipline as the frozen constructor's Two-Slot Law and the
> config-driven records table (step 194): **one universal mechanism reading declared config**, never a
> bespoke component per case.

---

## 4. Bidirectional — the callback (page → automation, port I5)

The gateway is **not one-way**. A page is often an **autonomous** output (`autonomous: true`, §E) — a
standing surface that outlives the run and then becomes an **input**. When a visitor submits it, that
submission flows **back into the automation** as input port **I5** (`page` submission, ontology §E). The
gateway carries this reverse direction: the surface emits a callback into the owning automation's `/run`
route (the same seam cron and §D pub/sub already use), carrying the submitted payload — a **Record** is
written, or a **Subject** transition fires (§D). Canonical example: a generated quiz **page** (`page` OUTPUT,
autonomous) → the child answers → the answers callback (`page` INPUT, I5) → the automation scores + reports.
The same surface is both an output port (created) and an input port (submitted) — the bidirectional case §E
names explicitly.

---

## 5. Kanban — the worked stateful example (the reference primitive)

The Kanban is to this standard what `telegram-notes` is to the ontology: the **reference example** — and it
is deliberately **NOT a new component**.

> **A Kanban is a declared VIEW + OPERATIONS over declared State.** Cards = **rows** (the config-driven
> records table, step 194 / ontology §12); a **column = a status field** on those rows; `moveCard` = **update
> the status field**. Nothing here is bespoke: it reuses the ONE universal `RecordsTable` reading declared
> columns, plus a status-bearing State table (§10 State). No N², no hand-coded board component.

Its manifest carries **both** planes (it is stateful):

| Plane | Verbs (illustrative) | Role |
|---|---|---|
| management | `createBoard` · `configureColumns` (the status set) · `moderateCard` (owner/automation-as-builder) | privileged |
| interaction | `addCard` · `moveCard` (update status) · `editCard` · `submit` | declared board roles |

Contrast — a **blog** page-type: management-only (`createPost` · `configurePost` · `moderatePost`); **no
interaction plane** (read-only content). The difference is not a limitation of the blog — it is the presence
law (§2): the blog carries no State, so it has no operate surface.

---

## 6. Network-API contract — a cross-service call from day one

The gateway is a **network API from the first line of the standard**, even though today the automation and
the page live in the same slot. Why now: step **197** splits the `projects` layer into its **own PM2 process
+ subdomain**; after that split, automation→page is a **cross-service call**. Designing the contract as a
network boundary now = **no rewrite** when the layer separates (the migration premise is real — a run route
and a workflow definition live in the app build; an app-build break 500s the run route and every cron tick
dies; refs `reports/patterns/path-based-subdomain-migration.md`, `basepath-migration-lessons.md`).

The boundary follows the existing substrate conventions — it is **not a new auth model**:

- **Token-auth**, exactly like the memory service (`/api/rag/*`) and the data service (`:3300`): a shared
  secret / token header, verified at the boundary. An unauthenticated call is refused.
- **Versioned path** — `…/api/gateway/v1/…` (side-by-side versioning, `frozen-template-constructor.md` §9): a
  breaking manifest change ships a `v2` beside `v1`; an old automation keeps calling `v1`. Verbs are
  versioned with the plane, never mutated in place.
- **Two entry shapes** — `GET` introspection (return a manifest) + `POST` invoke (`{ pageType, surface,
  verb, args }`), validated against the manifest schema, gated by role, then dispatched to the type's
  handler. Provision is idempotent (born once); a re-provision of an existing surface is a no-op, not a
  duplicate.

(The concrete endpoints, the revalidate-on-provision, and the first handlers are the **runtime**, step 198 —
not this standard.)

---

## 7. Relationship to the frozen constructor (two seams, not a rival)

The gateway does **not** replace the frozen template constructor — they occupy **different times**:

| | Frozen constructor | Gateway |
|---|---|---|
| **When** | agent-time (compose a page-type's skeleton) | runtime (provision + operate instances) |
| **What** | copies vetted frozen bricks + tokens → files | calls declared verbs over a network API |
| **Fills** | the page-type's shape | Slot A `(future) runtime` list-provider (§3/§4) |

The frozen constructor gains (P6, `frozen-template-constructor.md`) a **two-section capability manifest** as a
new **declared page-type entity** beside the envelope axes — a page-type declares its management verbs and,
if stateful, its interaction verbs. **That manifest IS exactly what the gateway introspects at runtime.** The
Two-Slot Law is preserved: the manifest is registration/contract metadata (like the group manifest §8),
never a third composition slot.

---

## 8. Self-sufficiency & prefer-hermes-native

- **Self-sufficient (iron rule).** The gateway is a substrate capability, not a Hermes feature. A **lone
  coding agent** (a project with only Codex, no Hermes, no orchestrator) uses the identical gateway: the
  manifest + the network API ARE the capability. Nothing here depends on Hermes existing; it **degrades
  gracefully** to a direct call by any single agent.
- **prefer-hermes-native.** Content that FEEDS a page (research, a browser pull, a generated image) is
  **not** the gateway's job and must **not** grow a new bridge: it defers to Hermes native
  (`web_search`/`web_extract`, `image_generate`) per `hermes-native-capabilities.md` and the
  `prefer-hermes-native` law. The gateway carries the **page boundary** (create/operate/callback); it never
  becomes a content-fetching detour. A project without Hermes uses its own tools for that pull — the boundary
  is unchanged.

---

## 9. Invariants (do not violate)

- **A `page` port is realized ONLY through the gateway** — never a step writing page files (§E boundary rule
  3). Files are the frozen constructor's territory (deterministic, no codegen).
- **Two planes, split by intent × access** — management/provision (always, privileged) + interaction
  (optional, only stateful, role-gated). Never collapse them to one create-vs-mutate axis.
- **Presence law** — interaction plane present ⇔ the surface carries State ⇔ its static↔dynamic position. A
  blog has none (correct); a Kanban has a rich one. Never force an operate API onto static content.
- **Declared verb manifests only** — `{ verb, JSON schema, role, plane }`; introspectable; no bespoke
  endpoint and no gateway-per-type (Open/Closed, no N²).
- **Bidirectional** — the gateway carries the callback (page → automation, port I5); an autonomous page is an
  output when created and an input when submitted.
- **Kanban = view + operations over declared State** — cards are rows (config-driven records table, step
  194), a column is a status field, `moveCard` updates status; never a hand-coded board component.
- **Network API from day one** — token-auth + versioned (`…/gateway/v1/…`), like `/api/rag/*` and data
  `:3300`; anticipates the step 197 layer split so automation→page needs no rewrite when it becomes
  cross-service.
- **Standard now, runtime in 198** — this doc defines the contract; the provision/operate/introspection
  endpoints and the first Kanban primitive are built in step 198.
- **Self-sufficient + prefer-hermes-native** — works for a lone agent without Hermes; content-fetching defers
  to Hermes native, never a new bridge.
- **Economic thesis** — the typed manifest is what lets a cheap runtime model act reliably: design once
  (expensive) → run forever (cheap).
