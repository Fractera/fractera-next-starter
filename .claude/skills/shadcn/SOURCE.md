# Where this skill came from, and how it is updated

**This folder is FOREIGN CODE, vendored on purpose. Do not hand-edit a single file in it.**
A hand edit survives exactly until the next update and then disappears without a trace — silently,
because the updater overwrites rather than merges. Everything WE have to say about this skill lives
in `../use-shadcn/SKILL.md`, which is ours and is never overwritten.

| | |
|---|---|
| skill | `shadcn` — shadcn/ui components, CLI, registries, styling rules |
| source | `github.com/shadcn/ui`, path `skills/shadcn/` |
| installed with | `npx skills add shadcn/ui -a claude-code` (`skills@1.5.23`, `vercel-labs/skills`) |
| installed as | **copies, not symlinks** — a symlink in a repository that is cloned on Windows is a missing file, not a link |
| recorded in | `skills-lock.json` at the repository root, with the content hash |
| installed on | 2026-08-31, step 63 |
| update | `npx skills update` — then read the diff before committing it |

## Two things worth knowing before you trust it

1. **It runs a command to learn about your project.** Its `SKILL.md` embeds
   `!`npx shadcn@latest info --json``, executed when the skill loads: on a machine with no network
   that line simply yields nothing, and the skill still works from its written rules.
2. **A second skill ships in the same repository and was deliberately NOT installed.**
   `migrate-radix-to-base` rewrites a project from Radix to Base UI. This project holds both
   libraries at once, and such a migration is a project-wide rewrite nobody ordered — the kind of
   change that is the owner's decision, not an agent's. Need it one day? One command brings it back:
   `npx skills add shadcn/ui -s migrate-radix-to-base -a claude-code`.

## What it may NOT decide here

This skill knows shadcn. It does not know this project, and on every point below **our law wins** —
the reasons are in `../use-shadcn/SKILL.md`:

- what a page is made of (a catalogue block, a route widget or a platform primitive — nothing else);
- who owns a genus of thing (one dialog, one heading — `use-primitives`);
- that no file under `sections/` may be a client component;
- that colour is taken as a token and never as a literal.
