# ACCOUNT.md — one migration, told from the owner's side

**Read once, before your first migration. Do not load it every session.** `SKILL.md` beside this file
says what to do; this one says what the process looks like from inside and in what order understanding
arrives.

The project: a customer-loyalty service for a clinic. People come for an appointment, their records
live in a third-party CRM, and the product is supposed to decide by itself whom to message and when.
Written by a self-taught developer with an AI coding assistant, running on a serverless host.

Names, the client's revenue and the vendors have been removed — they belong to the owner of that
project, not to this template. Everything else is unchanged: **every failure below actually happened.**

---

## What the owner believed at the start — and why he was wrong twice

He thought a migration is *carrying the interface over*. There were working screens on one side and an
architecture on the other; the job looked like moving one into the other.

The reasons for moving were not architectural at all: the old host would not run a scheduler reliably on
its free plan, a regulator forbade keeping the data abroad, and hosting was expensive.

🔴 **The belief was wrong twice.** At stage 2, because **the product's core did not exist in the source
at all**. And again at stages 10–19, because the migration breaks on data, not on screens — the
interface turned out to be the cheapest part of the work.

**Therefore:** "succeeded" was never "the interface is carried over". It was *timed chains running on
our own server against our own database*. That definition comes from the REASON for moving, and it must
be written before the first step.

One more decision was made that day, and it paid off seven stages later: **first create the routes we
need, then delete the preinstalled ones.** Not the other way round.

## The first question was not about code

> *"Which repository do I need to be in — the common one, or inside the result? This question is itself
> part of the case, because I never understand which is more correct and why."*

The answer is a pair, and that is the whole point. You must stand in the **common** folder: a migration
is the one kind of work that needs two trees at once, and a session inside the result cannot see the
source. **But that is exactly what breaks the other half** — a session in the parent folder does not
load the result's instruction, so the entire corpus of laws is missing from the agent's context.

It showed immediately: the agent, finding nowhere to keep its accounting, **invented its own folder
with imitation steps**.

## Stage 1 — the inventory, and the blow

The first step was not code. It was a map of the source with a column *what this turns into*.

The report's opening finding: **not a single timer exists in the source.** Proved mechanically by one
grep over the whole tree — zero lines; the host configuration file had no scheduler key at all. Of the
five links in the product's chain — condition, queue, trigger, sending, aftermath — **two existed.**

So a "migration" was half a move and half new construction. Estimated by the interface, the volume of
work was understated by exactly the part that is not on any screen.

The owner also had to correct the agent here: it had found a messaging service inside the architecture
and analysed it as the candidate for sending. It was not — data arrives from one external source, and
sending happens through another. No harm done, but the attention went to the wrong thing. **A rich
template beside a task with no explicit prohibition reads as a catalogue of candidates.**

## Stage 2 — knowledge about the project had nowhere to live

Everything the owner had explained lived only in chat. The four addresses of memory describe the WORK;
**none of them describes the PROJECT.**

The passport was created at once, as its own step, "only because it does not exist". And with it the
owner's law:

> *"if the agent does not understand the project well enough at the start … the project must not start
> at all until the agent understands, from the passport, the minimally sufficient set of data for
> development"*.

His grounds were right in front of him: the agent had mixed things up not because it was poor, **but
because the information he had just given it had not been there at the beginning.**

## Three corrections the owner made against our own text

**Languages.** A rule demanding ten of them was quoted at the agent — wrongly. That rule is addressed to
whoever builds the template; a guest agent programs in the languages its CONFIG names. **A rule that
does not name its addressee gets obeyed by the wrong reader.**

**Context.** The advice to reset the session between steps was cancelled: stay in one session while the
gap between requests is short, and reset only on a long break or on real overload.

**A property of the source is not a decision about the result.** The source being single-language does
not make the result single-language — the result's CONFIG decides that. Same mechanism that produced the
messaging-service detour: transfer by plausibility.

## Stage 4 — the first live update, and a chain that lied

It worked: the code shipped, the page opened on the server, the lock returned `403` for a guest while
the health endpoint returned `200`.

Two findings came out of it, and both are about **diagnosis, not delivery**:

- **The agent's access key had never been issued.** The whole chain was built and shipped; the
  environment export skipped a block in silence; the script refused naming the *second* link ("set the
  variable") instead of the first ("no key was issued"). A chain that reports the wrong link looks
  exactly like an agent that will not obey.
- **The canonical proof of delivery was unobtainable by construction** — the build stamp it reads is
  written by only one of the two build paths. The law of proof demanded something the system could not
  produce.

And a smaller one, worth keeping: the agent hit a `403` while pushing and **found a legitimate second
route itself**. From "this path is closed" you cannot conclude "there are no paths".

## Stage 5 — the type of application and the rights

The owner's law, and it now stands in every layer of the architecture:

> *"the first thing we must determine is what type of application we are building, whether it has
> authentication, whether it has role-based access, and if so, which roles and what each restricts. If
> it is obvious to the agent from the existing example, it says: here is what I assume, please confirm.
> If not, it asks plainly."*

Because the answer decides the LAYOUT OF EVERYTHING — which layer a route lives in, which permission
group it joins, what lock its door carries, what a guest sees. Two of the four questions were derivable
from the source's own schema and auth module, so the agent owed an assumption, not a blank question.

**And one answer came back contradicting itself.** A person "will not be connected to the auth system at
all" — and in the same breath needed a role "so that they get into the system". The owner said himself
the purpose was unclear. That is not sloppiness; it is an honestly open question, and it was passed on
as open, with a ban on deciding it silently.

## Stage 6 — agreement, not choice

The owner rewrote the step when he saw where it was going:

> *"the point of this step is not to hand the agent a task to build a tree. The point is to require
> research and a proposed architecture for agreement. This is not the step where a decision is taken."*

Hence the form: **two answers with a mandatory stop between them.** First the source's architecture as
it is, with no evaluation at all; the owner says continue; only then the proposal. Merged, he never sees
the original — only an opinion about it.

Result: ten routes kept 1:1, two changed, one not moved, three new ones grown from his decisions. The
only difference in addresses was the language prefix.

**And here he cancelled a law the two of them had just invented.** They had drifted into which routes
ought to be dynamic:

> *"I miscalculated the task … on the contrary, we must NOT think about that. In this step we simply
> move the tree as it is … discussing the development of the project is outside the migration task."*

Note also how the address rule was kept honestly: the agent checked which of its two reasons applied
**here** and found the search-ranking one barely did — almost nothing in the source was public. So the
addresses were kept for the operators' habits, and that was said out loud. The same argument then
produced the one sensible address change: a page the operator never saw, and had no habit of.

## Stages 7–9 — skeleton, deletion, furniture

**Skeleton.** Thirteen routes, fourteen addresses with fourteen distinct headings, no data, no
components, no logic. Passability first, content second.

Three things it showed beyond the task:

1. **A public page and a protected page have different SHAPES.** What is normal in the protected layer
   is three violations at once in the public one — the public layer is stricter because crawlers and
   agents arrive there.
2. **Emptying content breaks what stood on it.** Removing the home page's blocks removed its heading
   too: a flag was set because a section printed the H1. **A setting explained by a neighbouring piece
   outlives that piece and lies in silence.**
3. **The agent's own note nearly made it dismiss a real failure.** An observation about false alarms,
   written at stage 4, was used at stage 7 to wave away a genuine gate failure — by its own author,
   three steps later.

**Deletion.** Eight template routes removed, seventeen addresses alive. The order paid off: four files
were lifted from a living specimen **before** the specimens were deleted. Two findings — a page that
turned out to be the only specimen behind a gate (returned), and a build step that would have failed
before any gate ran.

**Furniture.** Twenty addresses in the menus, all alive, **zero items removed.** The premise — "menus
surely still point at deleted pages" — did not hold, because the group manifests lived inside the
deleted section folders. 🔒 That could only be established by walking every menu, and **the walk is the
work of the stage**: a negative result proved by negative controls is worth exactly as much as a
positive one.

## Stages 10–14 — data, where the migration actually breaks

Up to here the work moved structure. From here the errors stopped being visible.

**Foundation.** Eight tables, a domain model, no screens and no doors. This is where the inventory's
best device appeared: every element labelled by HOW it moves — literally, by meaning, by structure, or
not at all. And the list of the original's compromises dropped on the way: one clinic's service names
left the code, a multi-tenant identifier did not travel, facts moved to being computed from visit
history rather than from columns the original's own author did not trust.

First silent defect of a database change: a composite string key was split on a space, and service names
have several words. **The code works, the numbers are wrong.**

**Live read.** About 1,800 people and several thousand visits, a full pass in 45 seconds. The acceptance
the owner had written **could not be met**: the CRM returns a few more records than the product stores.

    CRM total − records without a usable phone − one merged duplicate = stored people

**The acceptance wording was wrong, not the data.** It assumed a CRM card and a person are the same
thing. They are not, twice over.

And the sharpest silent defect of the first half: **idempotency was broken and said nothing.** The report
printed correct numbers while the database grew by two thousand rows per run. The mechanism was an empty
value inside a composite unique key.

**First screens — and the audit screen.** The audit screen answers one question: *can these numbers be
trusted*. It paid for itself the same day, finding three defects, none of which raised an error or a red
gate:

1. search did not search — a pattern degenerated into one that matches every row, so a common first name
   returned the entire base;
2. **consent was computed as always granted** — the CRM was not returning the field. The product would
   have written to people who had refused;
3. the birthday chain would never have fired once.

**Stage 13 was born from the audit screen and was never in the queue.** The CRM's search endpoint
**silently ignores the list of requested fields**: ask for seven, receive five. A bulk route was found —
the whole base with 25 fields in 7.5 seconds, against a per-record crawl estimated at fifteen minutes.

The result: **26% of the base turned out to be written refusals** the product had known nothing about.

Two product facts were settled for good: **there are no birthdays in this CRM** — asked for every card,
empty for every card, so that trigger type has no data source and no API call will change it; and **the
old flags are dead** — four of them are zero for every record, which means "nobody ever touched this",
not "the person agreed".

**And here the owner decided against the agent's advice.** Three quarters of the base has no consent
record at all; the agent argued that silence may mean "never asked". The owner ruled: **treat it as
permission.** The right response was the one taken — write that decision in three places, in the code,
in the door's answer and on the audit screen, so a later session cannot reverse it silently.

**The first entity the product fills.** A task queue with three safety catches. Two decisions worth
keeping: *"today" means the deadline has ARRIVED*, not "is today" — a task that falls out of the queue
because nobody got to it in time is a lost person; and **the catches live in the domain model, not in
the route**, because the scheduler will one day call the same function outside HTTP.

And the fact that justifies keeping stage 13 separate: **the first catch only started working now.**
Before the fields were fetched, consent was "granted" for everyone, so the rule sat in the code and
**refused nobody** while being green on every check.

## Stages 15–19 — the product

**The core.** A rule found 94 people, and an independently written query against the database returned
the same 94.

**And the original's defect was not repeated.** Its generator selected people by two date columns that
its own code documents as filled for a minority of cards. Moved literally, the rule would have silently
missed most of the people it exists to find — **an empty selection looks exactly like "nobody
matches"**.

Two of the original's laws were taken verbatim because they are right: **rights are asymmetric** — the
whole staff may see a rule, only an administrator may change or run it, since the rule decides who gets
messaged; and **a rule shows its usefulness as a number** — tasks created, of those how many booked,
how many open. *A rule without a measure lives forever, because nobody can see that it does not work.*

**Reference data.** The catalogue is born from FACT, not from a directory: rows are created by what was
actually done. Two flags got meaning — one had identified a course by matching one clinic's service
names inside the query itself, which the next institution would have broken silently; the other existed
and **was read by nothing**, merely greying a row.

**Conversations.** The screen is ready and empty, and empty **honestly** — it says in words why. Its law:
a thread is keyed by phone number, not by person, because an inbound message is recorded before the
number is matched to a card, and conversations from unknown numbers are exactly the ones the screen
exists for.

**Analytics** found two more silent defects: a common table expression returned **zero rows without an
error**, so the screen showed zeroes over a full database and the diagnosis took three probe queries —
*there was no refusal, there was a plausible answer*; and an attendance field turned out to have **four
values, not two**, which had put four thousand people into no-shows and reported 79% instead of 4%.

One question was handed back to the owner rather than decided: a large group of past visits carries a
status that is counted as attended nowhere.

**The last two screens.** *Overview is not analytics* — analytics answers "how is the clinic doing",
overview answers "what do I do now and is what we set up working". And the overview names **data
freshness in its first line**: silent staleness is plausible numbers that are already wrong.

The final screen ran into something absent from the data: the join key between a CRM person and a site
account exists for barely one in eight records. So the screen answers **"to whom", never "granted"**, and
says the limit on itself. Pretending the link exists ends with granting a right to the wrong person.

---

## What the owner took away, in his own order

1. **"Done" is written from the reason for moving, not from the volume of what is visible.**
2. **The first minute decides more than the first month** — where the session stands, what it reads at
   start, and whether the human confirmed it in words.
3. **Measure the core before planning.** Two links of five existed.
4. **Knowledge about the project must have an address.**
5. **Type of application and rights come before the first route.**
6. **Design is agreement in two answers with a stop.**
7. **We move, we do not develop.**
8. **Reproduce first, delete second.**
9. **Data breaks the move in silence** — filledness, distributions, presence of a key: checked by a
   command before code, not by reasoning after.
10. **Build the audit screen early.** It pays for itself the day it appears.
11. **A rule without its data looks like it works.**
12. **His own words can contradict each other** — a fresh sentence against a recorded decision is a
    question to him, not permission.

---

**One project, one domain, one stack.** The stages before data hold for any move; the order inside the
data phase reflects this product's shape, and a project with a different core may reorder it — saying so
out loud.
