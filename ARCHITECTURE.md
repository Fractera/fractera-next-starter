# ARCHITECTURE.md — how THIS application is built

**Self-evolving. Starts empty on purpose.** A starter cannot describe an application that does not
exist yet; what stands here after the first weeks is the real shape of your project, written by the
agent as it builds.

## What belongs here

- **The layers of this app and who owns what** — which parts are yours to change, and which belong to
  the platform underneath (database, authorization, storage, knowledge graph, map, channels).
- **The decisions that are expensive to reverse** — why a store was chosen, why a page is static, why
  a boundary sits where it sits. A decision without its reason gets undone by the next session.
- **The paths a request actually takes**, when they are not obvious from the folder names.

## What does NOT belong here

Anything git already records: file lists, what changed when, who wrote it. This document answers
"how is it arranged and why", not "what happened".

## For the agent

Append here the moment a structural decision is made — not at the end of the step. The next session
reads this file instead of re-deriving the structure from the code, and re-derivation is both slower
and wrong more often.
