---
name: use-links
description: >
  LINKS — what this project does differently about them. Load it when you write body text with links,
  add a button or card that points somewhere, or the owner says "link these pages", "add a source",
  "mention their site". Short on purpose: link attributes, anchor text and interlinking practice you
  already know. Two things you cannot know are here — an outgoing link is the architect's decision,
  not yours, and this engine has its own written form for internal links, with a gate behind it.
---

# use-links

> A hint from experience, not a rulebook. If you see a better way for the case in front of you, take
> it and say so — this file exists to save you a defect somebody already paid for, not to replace your
> judgement.

## 1. Outgoing links belong to the architect

An external link hands part of this site's search weight to somebody else and invites the reader to
leave. That is his call, not a technical detail — **name what you would link and why, and ask.**

No answer yet? Write the fact and name the source in words. A source can be credited without a link,
and a link can be added in one edit later.

You may act without asking when it is not a new decision: he gave you the URL, the target is **this
project's own domain**, or you are repairing a dead link to the same destination.

## 2. Two written forms for internal links — the engine enforces both

| Form | What it is |
|---|---|
| `[%SITE%](/ru)` | the site root, in the language of that cell. The label is the literal token `%SITE%`, replaced at render with the site's name from `APP-CONFIG`. **Every language cell carries one** |
| `[любая подпись](/ru/about-us)` | another page of this same site. Label is free — a page's name belongs to the material |

Both resolve through `lib/content/blocks/links.ts`, which also strips the language segment in
single-language mode — a hand-glued address answers 301 there.

**Why not a plain relative link:** material travels between projects, and `/pricing` in another
project means a different page or none. So the gate verifies the target route exists here **and is
public** — `check:content`, rule `page-link-missing`. A link into the protected layer is refused: a
public link to a 403 is a promise the site does not keep.

🔒 **Where the interlinking should point is a product question, and the answer is not yours.** The
foundations that would decide it — the project passport and its neighbours — are not written yet.
Until they are: **follow the architect's direct instruction on what links where**, and do not invent a
web of cross-links because SEO advice says to.

## 3. What the gates catch

`check:content` — a relative link outside the two forms, a root link whose label is not `%SITE%`, a
cell with no link home (counted per file), a page link with no such public page.

None of them can tell whether a destination still exists on the internet. Request each external URL
once, and list the ones you added in your report — that list is what the architect approves.
