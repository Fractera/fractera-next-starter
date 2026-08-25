---
name: use-migration
description: >
  Moving an existing project onto this architecture — the nineteen stages in order, what each one ends
  with, and the laws of transfer that were paid for by a real move. Load it the moment the mode is
  `migration`, or whenever the owner says "we are moving this project", "port my app", "here is the
  repository we are migrating from". Also load it before the first route, the first table or the first
  door of such a project: the order is half the skill, and the two most expensive mistakes — copying
  code instead of value, and building screens over columns nobody filled — happen before any code is
  written. The mode itself, the four questions about rights, and the rules about foreign code live in
  `CLAUDE.md` §`migration`; this skill does not repeat them.
---

# use-migration

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.
>
> 🔒 One boundary, and it is the only one: the freedom is about **HOW** you build. It never covers
> whether the work is recorded as a step and whether the state is written down.

Everything below was earned by one real migration, not designed at a desk. Where a law is marked ✗,
that is the failure that paid for it.

## 0. Read first, and do not duplicate

`CLAUDE.md` §`migration` already carries: how the mode is switched on, that foreign code is read as a
DESCRIPTION and never rewritten, the four questions about application type and rights, why there is no
token for the source repository, and why foreign code is never executed on the server. **Read it, do
not restate it.** This file carries what it does not: the stages, and the laws of transfer.

## 1. 🔒 A migration MOVES, it does not develop

The single most expensive temptation. "Should this route be dynamic?", "should these two entities be
merged?" — those are questions about developing the product, and they are **outside the migration**.
Their time comes when the move is finished.

✗ Paid for live: an entity×role matrix was proposed as a design aid. It is a good architecture device
and a bad migration device — it makes you redesign instead of move, and redesigning throws away the
only support a migration has: **a working original**.

## 2. 🔒 The original is a source of QUESTIONS, not of answers

Two laws that look opposite and are the same law:

- **A property of the SOURCE does not transfer to a decision about the RESULT.** ✗ paid twice: the
  platform's Telegram service was taken for the sender the project needed; the source being
  single-language was taken for the result's language mode. The result's mode is decided by the
  result's CONFIG.
- **The ABSENCE of something in the source does not mean it is absent from the product.** The source
  describes what was **built**, not the boundary of what was intended. ✗ "the product needs no
  `account` group" was inferred from patients not logging in; the owner's answer said otherwise.

**Together:** the code answers exactly one question — *what is already built here*. Everything else is
answered by the owner.

## 3. The nineteen stages, and what each one ends with

The order IS half the skill. Do not reorder it to suit a project that "is different".

| # | Stage | Ends with |
|---|---|---|
| 1 | **Placement** — two repositories side by side, roles named in words | the session sits in the parent folder AND knows the reading addresses of the result |
| 2 | **Inventory of the source** — a map with the column *what it turns into* | it is visible what the result does not have yet |
| 3 | **Project passport** — knowledge about the project gets an address | a start light: while any ⛔ stands, no code |
| 4 | **First live update** — the work reaches the server | four proofs, not "the site opened" |
| 5 | **Application type and rights** — the four questions (`CLAUDE.md`) | the owner's decision, recorded verbatim |
| 6 | **Route design — in TWO answers with a stop between them** | an agreed tree, not one the agent chose |
| 7 | **Skeleton: the whole structure as stubs** | the owner walks the entire tree by navigation |
| 8 | **Deleting the template's own pages** | no address exists that the tree does not name |
| 9 | **Clearing the furniture: menus, header, drawer** | behind every element there is a live page |
| 10 | **Data foundation: tables and the domain model** | a query to any table answers — no screens, no doors, no integrations |
| 11 | **First live READ of the source — read only** | tables hold real data; a second run changes no counter |
| 12 | **First screens on live data + the AUDIT screen** | it is visible which numbers can be trusted |
| 13 | *(usually unplanned)* fetching fields the source did not give | born from the audit screen, not from the queue |
| 14 | **The first entity the PRODUCT fills, not the source** | its safety catches refuse a real person |
| 15 | **The core: automation that decides by itself** | its selection matches an independent query |
| 16 | **Reference data — from fact, not from a catalogue** | the catalogue carries a measure |
| 17 | **Screens waiting on external channels** | empty HONESTLY: the screen says in words why |
| 18 | **Analytics — second to last** | numbers match independent measurements |
| 19 | **Sweeping up the remaining stubs** | no stub is left in the tree |

### Three laws about the ORDER itself

🔒 **Between the data foundation and the first screen stands the LIVE READ, and the order is
unbreakable.** Stage 10 declares tables and fills nothing; 11 fills and draws nothing; 12 draws. Merge
them and a schema defect looks like a screen defect. ✗ proved in reverse: three silent defects found at
stage 12 turned out to belong to stages 10 and 11, and they could be told apart only because the stages
were separate.

🔒 **The audit screen is built EARLY and pays for itself the same day.** "Can these numbers be
trusted" appeared at stage 12 and immediately found two silent defects of the earlier stages — one of
which would have made the product write to 481 people who had refused contact in writing.

🔒 **Analytics comes second to last, and not because of importance.** It consumes all the data at once,
so it works as the last detector of silent defects. Put it earlier and it finds the same things on
incomplete data — that is, unconvincingly.

## 4. Stage 2 — the inventory that decides everything after it

🔒 **An inventory names, for every element, HOW it moves.** Four values, and the fourth is the one
people forget:

| How | Example from the real move |
|---|---|
| **literally** | a partial unique index; idempotent sync; webhook de-duplication |
| **by meaning** | "a person's own rhythm" — the median moved out of SQL into TypeScript |
| **by structure** | "a client is a STATE, not a flag" → a separate cases table beside the person |
| **does not move** | a multi-tenant `clinic_id`; one clinic's service names living in code |

An inventory without that column is a copy list, and copying foreign architecture carries its
compromises along with its decisions.

🔒 **The move is the one cheap moment to drop the original's compromises** — list them EXPLICITLY,
before code. Later they are your debt, not theirs.

🔒 **Add a second column: does this field have a CONSUMER?** ✗ in the original a flag existed and was
read by nothing — it only greyed a row. A flag without a consumer is a promise nobody kept: either it
does not move, or it moves with an obligation to give it a consumer in the next step.

🔒 **The most valuable line of the map is "no answer".**

## 5. Stage 6 — design is AGREEMENT, in two answers

🔒 First the agent shows the SOURCE's architecture as it is — the route tree, groups, the type of each
route, related entities, what is public. **Not one opinion in this answer.** The owner looks and says
continue. Only then does the agent propose its own.

**Why not in one answer:** merged, the owner loses the chance to see the original as it is — he
immediately sees an opinion about it.

🔒 **Route addresses move ONE TO ONE.** The only mandatory exception is the language prefix, which this
architecture always carries even with a single language enabled.

⚠️ **Two reasons stand behind that rule, and checking WHICH ONE applies to this project is part of the
law:** search rankings, and people's habits (bookmarks, links in documents). ✗ in the real move the
first reason barely applied — almost nothing was public — and repeating a memorised reason costs trust
exactly where you are right on the merits.

🔒 **Exactly three reasons let the result's structure differ from the source's, and they are
exhaustive:** permission-group folders · the mandatory language prefix · routes grown from the owner's
decisions that do not exist in the source.

**The form of the answer is a TREE IN CHAT, not a file** — the owner agrees by eye. Under it, exactly
one of three verdicts for EVERY source route: kept 1:1 · changed and why · not moved and what instead.
**A route lost in silence is the main defect of this stage.**

## 6. Stages 7–9 — skeleton, deletion, furniture

🔒 **Stage 7 builds the STRUCTURE ENTIRELY and finishes no page.** Passability first, content second.
`layout`, header and footer are not touched — otherwise the owner cannot walk the tree by ordinary
navigation and the stage becomes unverifiable.

🔒 **Two architectures coexist, and that is normal for the stage.** The template's own and the newly
agreed one live side by side while the move runs; reconciling them is the last action, not a running
one.

🔒 **The order of 7 and 8 is rigid and the reverse of the temptation.** Reproduce the template's
patterns in the NEW routes first, delete the old ones second. ✗ delete first and you lose the specimen:
whatever was not carried over vanishes with it, and there is nothing left to restore it from.

🔒 **A route counts as created when it can be REACHED by navigation, not only by typing its address.**

🔒 **Before deleting a page, ask the fourth question: WHO DEPENDS ON IT** — not only address, pattern
and links, but whether a guard, a generator or a `prebuild` step stands on it. ✗ one page passed all
three older questions and turned out to be the only specimen of all 31 catalogue kinds.

🔒 **Deletion is verified by a FULL `prebuild`, not by a list of gates** — the first `prebuild` step
failed before any gate would have run.

🔒 **"Remove the link" is not "delete the shared thing".** Links to deleted pages live in the sitemap,
the surface registry for machine readers, the PWA manifest, list generators. No file is deleted; each
loses the piece that pointed at nothing.

🔒 **Footer pages are NEVER deleted** (owner, 2026-08-25) — privacy, terms, cookies, accessibility,
architecture. Their absence from the agreed tree is not a decision to remove them: that tree mapped the
SOURCE's routes and never discussed them. If the moving project has its own footer pages, that is a
separate step and it is about CONTENT: our pages stay, his text arrives.

🔒 **Clearing the furniture is its own stage, after deletion, before the build.** Menus are not checked
by gates — visibility is courtesy, not protection — so they survive a deletion untouched and lead to
404. **A link to nowhere is worse than a missing page:** nobody looks for a missing page; a menu item
gets clicked. Check both menu sources, top menu and drawer, **under every role**, and prove it with a
negative control: not only that the extra items are gone, but that **every address of the agreed tree
is still reachable through the menu**.

🔒 **Silence in a list is not permission.** A widget of the template appeared in neither the "delete"
nor the "keep" list — the right move was to ask, not to decide.

## 7. Stages 10–19 — the laws of moving DATA, where migrations actually break

🔒 **An empty selection looks exactly like "there is nobody who matches".** ✗ the original selected
people by columns that its own code documented as filled for a minority. Moved literally, the rule
would have silently missed most of the people it exists to find — no error, no red gate. **Check the
FILLEDNESS of a source column across the whole base, never its existence.** A column filled for a
minority is not a data source, it is a trap.

🔒 **Take the DISTRIBUTION of every status field before writing a condition on it.** ✗ an attendance
field had four values, not two; "came = 1, everything else = did not come" put four thousand people
into no-shows and reported 79% instead of 4%. A rate is computed **only over decided values**; the
unmarked belong to neither numerator nor denominator and get their own tile — they measure sloppiness
in the source, not behaviour of people.

🔒 **Acceptance for a data move is an ARITHMETIC IDENTITY with named deductions**, never "the numbers
match". ✗ the plan demanded `people == meta.total_count`; the truth was
`1849 − 4 without a phone − 1 merged duplicate = 1844`. **The formulation was wrong, not the data.**
Every deduction owns a name and a counter, and the sync report proves the identity itself.

🔒 **A foreign API may silently return FEWER fields than you asked for.** ✗ a search endpoint ignored
the `fields` list entirely: seven asked, five returned; ask for one particular flag and only an id
comes back. **Check for the PRESENCE of the key, not its value — an absent field impersonates an empty
one.**

🔒 **Look for the bulk door before building a per-item crawl.** ✗ a per-record walk was planned at
fifteen minutes; the bulk route returned 25 fields for the whole base in 7.5 seconds.

🔒 **A rate limit belongs to the ADDRESS, not to the caller.** ✗ the pause lived in one loop and not in
the other; 27% of the base went unread and the run said nothing.

🔒 **A zero in a source field does not mean a value until you prove the field was ever used.** ✗ four
consent-ish flags were zero for ALL 1849 records: "nobody ever touched this", not "the person agreed".

🔒 **A capability with no data behind it is the OWNER'S decision, not a development task.** ✗ birthdays
were empty for 1845 of 1845 — no API call will change that. **Hand the owner a list of the source's
capabilities that have no data, as its own document, before screens are planned.** Otherwise you build
an interface onto nothing. Mark such a trigger as dead but do not forbid it: data may appear, and
silence would leave the owner waiting for months.

🔒 **A rule moved ahead of its data looks like it works.** ✗ a "no consent" safety catch sat in the code
for three stages and refused nobody, because the field was not being fetched. **Acceptance for a rule
is not its presence — it is a refusal that fired on a real person.**

🔒 **Identity mapping is measured before anything is built on it.** ✗ e-mail was filled for 242 of
1844, so a screen that hands out a role can only answer **"to whom", never "here, granted"**, and the
limit is named on the screen itself. Pretending the link exists ends with granting a right to the
wrong person.

🔒 **Safety catches live in the DOMAIN MODEL, not in the route.** A door is where the session is read
and the right is checked. Duplicate the rule into the route and the scheduler that one day calls the
same function outside HTTP runs without any catches.

🔒 **Reference data is born from FACT, not from a directory** — rows created by what was actually done.
A directory unconnected to history goes stale silently. And **the key that binds a row to its history
is never renamed**: rename it and the row detaches from everything, with the numbers zeroing out and no
explanation.

🔒 **Counts are computed, not stored.** A stored counter diverges from reality on the day history is
first corrected.

🔒 **A foreign DBMS limitation does not move together with its workaround.** ✗ the original merged three
queries in JavaScript and said why in its own code — its database was strict about grouping. Ours is
not, and three round trips would have been the price of somebody else's constraint. **Read the REASON
the author wrote down, not the shape of the code.** The same door swings the other way: changing
databases silently breaks things moved literally.

🔒 **A number that was never measured has no right to appear as a digit.** "Measured and empty" and "not
measured" are different facts, and the SCREEN must tell them apart, not only the code.

🔒 **Name your disagreement with the original out loud and leave the owner the right to reverse it.**
The wording to copy: *"this is my decision, said here; correct me if you see it otherwise"*.

## 8. Two things about the queue itself

🔒 **An agreed queue of stages is a hypothesis, not a schedule.** In the real move one step was born
from a defect the audit screen found, one was pushed back by the owner, and one was never in the queue
at all. **Unplanned steps are the NORM: record each the moment it appears, with its cause** — otherwise
the cost of the move is understated in the report and the next estimate lies, always downwards.

🔒 **Defects of the original are named in the step, not carried over in silence** — a line "what we do
NOT repeat".

## Proof

Two proofs from different planes, as everywhere here, and for a migration one of them is almost always
**the same number obtained twice by different routes** — the product's selection against an independent
query straight to the base. The build is never one of the two.
