# PLATFORM-TOOLS.md — what you already have

You have no access to external tools. This file is the only way you learn what the platform under this app
already provides. **Read it before designing anything that stores, searches, sends or locates.** Almost
every wrong answer here is a second copy of something listed below.

The rule for all of them: **you call these, you do not rebuild them.** They are shared with the deployed
app, they are backed up as one, and a second copy splits the data so that neither half is complete.

---

## One door

Everything below is reached through the **data service** on `:3300`, behind a single secret. Not a port
per service — one address, one key, and a route per capability. Ready clients sit next to you in
`lib/fractera/`.

| What | How you reach it | Use it for |
|---|---|---|
| **Rows / tables** | `lib/fractera/data-service.ts` | Any structured data your app owns. There is already a database — do not add Postgres, Neon or Supabase. |
| **Uploaded files** | media routes of the same service | Images, documents, video. Stored once, referenced by URL. |
| **Vector store** | `lib/fractera/vectors.ts` | Meaning-based search: "find things similar to this". Lives beside the rows it describes. |
| **Knowledge graph** | `/service/rag` via `lib/fractera/knowledge.ts` | Questions over a body of documents where the answer is spread across several of them. |
| **Map and routing** | `/service/geo` | Address ↔ coordinates, driving routes, distance matrices, visiting order. Own engines, no third-party keys. |
| **Channels** | `/service/channels` | Messaging out and in — Telegram first. |

## Not through that door

| What | Where | Note |
|---|---|---|
| **Accounts, sessions, roles** | auth service on `:3001` | Never write a second login. Adding a sign-in provider is a platform setting, not app code. |
| **Settings of this app** | control panel on `:3002` | Name, description, branding, SEO, analytics. Read them with `npm run read:app-config`; change them in the panel. |

---

## Choosing between the vector store and the knowledge graph

They look similar and are not. **Vector store** answers "what resembles this?" — one item at a time,
cheap, exact about similarity. **Knowledge graph** answers "what does this body of text say about X?" —
it connects facts across documents, costs more per question and needs an OpenAI key to be useful.

Reach for the vector store first. Move to the graph when the answer genuinely lives in the links between
documents rather than in any single one.

---

---

## Micro-tools — finished pieces you install instead of writing

Beyond the services above, the platform ships small reusable **tools**: a component plus its server half,
already working, meant to be taken rather than rebuilt. They are not called over the network — the owner
installs a **copy** into this project from the panel's *Tools* section.

**Where they land.** `tools/<id>/` in the project root, each next to an `INSTALLED.json` recording which
version was taken and when.

```
tools/
  image-crop/   client/image-cropper.client.tsx          INSTALLED.json
  video-trim/   client/video-trimmer.client.tsx          INSTALLED.json
  voice-input/  client/voice-input.client.tsx            INSTALLED.json
                client/voice-input-i18n.ts
                server/transcribe.ts
                types/voice-input.ts
```

**Check `tools/` before building anything of this shape.** A cropper, a trimmer or a microphone button
written from scratch beside an installed one is duplicated work that then has to be maintained twice.

| Tool | What it does | What it needs | How you use it |
|---|---|---|---|
| `image-crop` | Pan/zoom selection of a picture, fixed 16:9 · 1:1 · 9:16, returns a JPEG blob. `force="square"` locks the aspect where purpose decides it. | browser only | `import { ImageCropper } from "@/tools/image-crop/client/image-cropper.client"` — render it over the page, take the blob in `onDone(blob, mode)`. |
| `video-trim` | Keeps the middle of a clip, drops the rest; the cut happens on the server and replaces the stored object. | server-side ffmpeg (the data service has it) | `import { VideoTrimmer } from "@/tools/video-trim/client/video-trimmer.client"` — it posts to the media service itself. |
| `voice-input` | Microphone beside a text field; speech is transcribed and inserted **at the cursor**. Carries its own interface strings in ten languages. | the OpenAI key, and HTTPS — browsers hand out a microphone on secure origins only | `import { VoiceInput } from "@/tools/voice-input/client/voice-input.client"`, give it `targetRef`, `value`, `onChange`, `lang`. Server half: `transcribeAudio()` from `server/transcribe.ts`, wrapped by a thin `api/transcribe` route of your own. |
| `code-view` | Source code with real syntax colouring — a parser, not a set of regexes, so nested CSS inside HTML and generics in TypeScript come out right. Language detected from the file extension. | **`npm install shiki`** — see below | `import { CodeView } from "@/tools/code-view/client/code-view.client"` — pass `code` and `filename`, or an explicit `lang`. |

### Does installing a tool need `npm install`?

**Usually no — and the tool's page tells you before you install it.**

Three of the four tools use only what this project already has: React, Next, `lucide-react`, `sonner` and
the shadcn button. For those, copying the files IS the whole installation — there is nothing to run
afterwards.

**`code-view` is the exception, and the reason is worth understanding.** Syntax colouring is not string
matching; it needs the grammar of every language it colours, and those grammars ship in a package. So the
tool arrives with an unresolved import and **will not build** until you run:

```
npm install shiki
```

**How to tell in general.** A tool needs a package when it imports something that is not in this project's
`package.json`. If a build fails right after installing a tool with `Module not found: Can't resolve 'x'`,
that is the whole diagnosis — install `x` and build again. The panel states the requirement up front
precisely so this does not have to be discovered by failure.

**They are yours once installed.** The copy is ordinary project code: change it, rename it, delete what you
do not need. It travels with a push like any other file. Re-installing from the panel overwrites the copy
and loses local edits — so if you changed a tool, say so before anyone updates it.

**A missing capability is a request, not an improvisation.** If the shape you need is close to a tool but
not it, adapt the installed copy. If nothing is close, say so — the panel's *Add a tool* page is where a
new one is asked for.

---

## When something is missing

Say so plainly and name the layer it belongs to. Do not improvise a local imitation: a hand-rolled store,
a second login, or your own geocoder will work in your session and break the moment the platform's own
version is used somewhere else in the project.
