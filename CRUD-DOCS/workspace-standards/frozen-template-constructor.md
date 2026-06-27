# The Frozen Template Constructor

> Authoritative strategy, from first principles, for how this platform adds a **whole structure** to a site
> (a news feed, a documentation tree, a catalogue) by **composing** it from proven, frozen building blocks —
> with **zero code generation**, so any AI model produces the identical result. Russian mirror:
> `public/docs/frozen-template-constructor.md` (FES). Companion engine doc: `content-engine.md` (how one
> rendered page works internally). The earlier prototype note (`frozen-archetypes.md`) has been retired —
> this is the single source.

---

## 1. The problem, stated honestly

We want an AI agent to add an entire structure — "make me a news section", "add documentation" — without
hand-writing dozens of files (slow, token-heavy, drifts from the standard) and **without generating code**
(non-deterministic, untested combinations, different result per model).

The naïve fix is a **catalogue of finished templates**: one frozen template for news, one for blog, one for
docs, one for a 2-level docs tree, one for a database catalogue… This does not scale. The real space of
structures has several independent dimensions (how deep the hierarchy is, where the data comes from, who may
see it, which languages). A catalogue would need a template for **every combination** — hundreds of them —
and each new dimension multiplies the count. A thousand templates is not a strategy.

The other naïve fix — **generate the structure with an LLM each time** — brings back exactly what we are
fleeing: untested code, a different result per model, and risk baked into every creation.

The answer is neither. It is a **constructor**.

---

## 2. The core idea: a constructor, not a catalogue

> **A constructor is a deterministic function that COMPOSES a structure from a small basis of proven, frozen
> primitives, parameterised by a description of what you need. It never generates code.**

Think LEGO: a handful of well-made bricks compose into an enormous space of models. We do not pre-build every
model; we keep a small set of **vetted bricks** and a small set of **composition rules**. The combinatorial
explosion moves out of "how many templates" and into "how few, how orthogonal, the bricks are".

Two consequences make this safe:
- **Determinism.** Composition copies and wires vetted, frozen pieces — it does not invent code. The built-in
  brain (Hermes) and every coding agent (Codex / Claude / Gemini / Qwen / Kimi) produce the **identical**
  result. *Freeze a pattern, not a guess.*
- **Open/Closed.** A new capability is a **new brick added to the basis**, never a rewrite of the constructor
  core. The core is closed for modification, open for extension.

Our existing emitter is already the seed of this: it takes parameters and assembles two layers. The
constructor generalises that seed from one knob (`format`) to a full description.

---

## 3. 🔒 The Two-Slot Law (this is what makes it additive, not N²)

Every property of a structure must live in **exactly one of two slots — and never interact across them**:

| Slot | Holds | Examples |
|---|---|---|
| **A. List provider** (data) | *where the children come from* | filesystem scan · database-at-build · (future) runtime |
| **B. Uniform aspect** (layout) | *a cross-cutting rule applied identically at every level* | i18n · roles/access · theme |

**The law:**

> A property is either a **list provider** or a **uniform aspect**. There is no third slot. A uniform aspect
> is embedded the **same way at every level** of the structure (it lives in the layout), **independent of how
> deep the hierarchy is and where the data comes from**. **Cross-slot interaction is forbidden.**

Why this matters: it is the difference between **additive** and **quadratic** cost. If aspects had to behave
differently per depth or per data source, every (aspect × depth × source) combination would be a special case
— the N² trap that kills product-lines. By **law**, they do not: the role gate is one rule, embedded into
every layout level identically, whether the tree is 1 level or 4, file-backed or DB-backed.

**Enforcement (a smell to reject, not accommodate):** if a proposed feature *requires* a special case by
depth or by data source, that is a design smell. We **reject** it, we do not bend the constructor to fit it.
The two slots are the whole contract; nothing else is added.

---

## 4. The basis: the base grid + the dynamic descriptor

### 4.1 The base = {data source} × {depth}

The structural skeleton is fixed by two base dimensions:

```
            depth 1        depth 2          depth 3            depth 4
          (flat list)   (section→items)  (taxonomy)        (deep tree)
files     ▢ news/blog    ▢ docs-by-cat     ▢ knowledge base   ▢ deep manual
DB        ▢ DB list      ▢ DB sections     ▢ catalogue        ▢ deep catalogue
```

- **Data source** is a swappable **list provider** (Slot A): today a filesystem scan (`parser-fs` builds the
  child list); for DB, a **build-time query** (the output is still a static page). Same seam, different provider.
- **Depth** is structural nesting (how many index/hub levels). It is a **recursive parameter** of one skeleton,
  not four hand-written files: each level is a hub that lists the level below; the leaf is the document.

That is **8 static skeletons** — every cell is `(source, depth)`, and static-first holds across all of them
(a DB catalogue reads the DB **at build** and ships static pages; see `static-first.md`).

### 4.2 The 9th: the dynamic descriptor

When a structure **genuinely cannot be static** (its data is per-user, per-request, transactional — a live
dashboard, a cart) the constructor does **not** force a static skeleton. It returns a **dynamic descriptor**:
not pages, but a **specification** — the data-access context, the access rules, the boundaries — that hands
the work to classic development under the platform's rules. This is the honest exit, not a bad fit.

### 4.3 Static-first governs the data axis

The data axis is a spectrum: `files → DB-at-build (+ISR) → DB-per-request → write input → transactions`. The
platform canon (`static-first.md`) keeps the default in the **left/middle** (files · DB-at-build · ISR); the
right side (per-request dynamic, writes, transactions) is allowed only when **absolutely necessary** and with
the architect's double confirmation. So "a DB template" means, by default, **DB-at-build → static output**.

---

## 5. The aspects (Slot B): uniform, toggled, level-independent

Aspects are cross-cutting toggles, each embedded **identically at every level** via the layout:

- **i18n** — every level localised the same way (`[lang]` + per-tab UI chrome with per-key EN fallback). Proven
  in the prototype; this is the canonical example of a uniform aspect.
- **Roles / access** — who may see the structure. Two layers: the **enforced tiers** (`guest` / `user` /
  `architect`) and the **business RBAC** (`ALL_ROLES`: `vip_user`, `subscriber_lite/standard/max`, `buyer`,
  `manager`, …). A structure declares its access; the gate is **one rule embedded into every layout level**,
  the same at depth 1 or depth 4. (Access is decided *before* the structure is built — see `HOW-USE-AUTH.md`.)
  On a wrong-role visit the gate shows a **localized access-denied toast** (all 82 languages, manual close)
  then soft-redirects — the owner sees *why*, not a silent bounce (`services/access-feedback`, see `HOW-USE-AUTH.md`).
- (future) theme, and any other rule that is genuinely the same at every level.

An aspect that cannot be expressed as "the same rule at every level" is **not an aspect** — it does not belong
in Slot B, and by the Two-Slot Law it does not belong anywhere. Reject it.

---

## 6. The envelope: matching a request to a primitive

A primitive declares its **envelope** — its position on every axis. A request is matched by **projecting it
onto the same axes** and checking fit:

| Axis | Example values | Slot |
|---|---|---|
| data source | files · DB-at-build · runtime | A |
| depth | 1 · 2 · 3 · 4 | base |
| static vs dynamic | static · dynamic-descriptor | base |
| roles/access | public · guest · `[role,…]` | B (aspect) |
| i18n | mono · multi | B (aspect) |
| (later) scale | units · thousands (SSG vs ISR) | base hint |

> **The 100%-fit test.** A request matches a primitive only if it fits on **every** axis. A partial fit is
> **not** that primitive. A refusal is therefore **explainable by the specific axis** that failed ("does not
> fit: the *roles* axis is `architect`, this primitive is `public`").

This is the machine-checkable form of "fits 100% or not at all", and it is the content-space instance of
**capability-grounded selection at scale**: match against a real declared capability, never guess from
keywords. (Keyword hints — "fits/does-not-serve" prose — may accompany the envelope as a human aid, but the
envelope is the authority.)

---

## 7. Decision flow: compose, find another, or refuse honestly

```
request
  └─ project onto the envelope axes
       ├─ a primitive fits 100% ───────────► COMPOSE it (deterministic, no codegen)
       ├─ another primitive fits ──────────► compose that one
       └─ none fits ───────────────────────► HONEST REFUSAL (name the failing axis), then ONE of:
             (a) propose to the architect to FREEZE A NEW PRIMITIVE
                   — only if the shape is PROVEN by live development, REPEATS (rule-of-three),
                     and parameterises cleanly. The agent PROPOSES; it does not self-create.
                     The heavy "study all primitives + docs, extract the pattern" analysis runs
                     ONLY after the architect says "go" (never speculatively, per request).
             (b) CLASSIC DEVELOPMENT within the existing architecture
                   — if the shape is new / one-off / unstable / risky.
```

(a) and (b) are **not either/or** — they are a **maturity gradient**. A new shape starts as classic
development (b); when it has proven itself and repeats, it **earns** the right to be frozen into a primitive
(a). *Freeze a pattern, not a guess.*

---

## 8. Engine versioning: side-by-side, pinned

The rendering engine evolves. An evolution must never break a structure that already exists.

- **An installed engine version is immutable.** A breaking major ships **beside** the old in its own
  namespace: `lib/content-v1/**` + `components/content-page-v1/**`, then `lib/content-v2/**` a year later.
- **Each structure pins the version it was built against** (its imports point at `@/lib/content-v1/…`), so an
  old "news" tab keeps rendering on v1 even after v2 arrives. Collision is impossible — the namespaces differ.
- **The version sentinel is per-version** (install copy-if-absent *for that version*; never touch another).
- **Identity is NOT versioned.** `brand` and `author` are the site's one identity across every version; the
  language set and trivial infra are likewise shared and unversioned.

The conscious trade-off: two structures on different engine majors **may look different** until the owner
explicitly **migrates** one. We trade "one look everywhere" for "an old structure never breaks" — the right
trade for a self-evolving, AI-driven system, where a year-later agent cannot be trusted to preserve
backward-compatibility, so we remove the need for it. (Classic pattern: side-by-side versioning + consumer
pinning — .NET SxS assemblies, Go modules, Nix.)

---

## 9. 🛑 Harvest discipline (the most important rule)

The grid in §4 is a **map for matching and a roadmap** — it is **not a plan to build all cells**. Building a
template for every cell up front is the same non-scalability from the other end (premature abstraction).

> Pave the road where the traffic is. **Freeze a cell into a primitive only when it is (1) proven by live
> development, (2) repeating, (3) cleanly parameterisable.** Everything else is served by classic development
> until it earns its primitive. The constructor is **Open/Closed**: grow the basis one proven brick at a time.

Today the basis has **one** composed primitive — `(files × depth-1)` — the reference. The roadmap (build each
when proven, not now): `(files × depth-2)` (docs-by-category) · `(DB-at-build × depth-1)` (catalogue) · the
dynamic descriptor.

---

## 10. The reference primitive — `(files × depth-1, i18n on, roles off)`

The first and reference brick: a flat, file-backed, multilingual list of documents (a news feed / a blog).
It demonstrates the constructor's seams, so the next brick slots in without touching the core:

- **List-provider seam (Slot A):** the child list comes from a filesystem scan at build (`parser-fs`). Swapping
  in a DB-at-build provider changes only this seam.
- **Aspect seam (Slot B):** i18n is embedded uniformly in the layout. Turning on the roles aspect adds a gate
  to the same layout seam — no change to depth or provider.
- **Depth:** depth-1 is the base case of the recursive depth parameter.
- **Versioned engine:** the renderer is installed into `lib/content-v1/…`; the structure pins v1.

It is content, not a feature: the composed structure ships placeholder documents (Lorem body + placeholder
image) that the owner replaces; adding the next document is one folder.

---

## 11. Invariants (do not violate)

- Composition only — **never LLM code generation**; the same result from any model.
- **Two-Slot Law:** a property is a list-provider (data) or a uniform aspect (layout); **no cross-slot
  interaction**; reject features that need a special case by depth/source.
- **Envelope 100%-fit** or it is not that primitive; refusals name the failing axis.
- **Static-first / no-JS**; the only dynamic path is the dynamic-descriptor primitive, under the rules.
- **Versioning side-by-side, pinned; identity never versioned.**
- **Harvest discipline:** freeze a proven, repeating, cleanly-parameterisable shape — never a guess; grow the
  basis Open/Closed, one brick at a time.
- **Self-sufficient capability** (skill + MCP + composer shipped to every agent; works for a lone agent, no
  orchestrator) — see `authoring-skills-instructions-mcp.md`.
