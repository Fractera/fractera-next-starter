# Using MCP for App Settings in Agentic Engineering | How an Agent Changes the App Config

> Complete reference for a hybrid reader — a technical human **and** an AI agent. It explains,
> plainly, how a deployed app lets an AI agent change what the app says about itself (name,
> description, SEO, PWA, languages) by a plain request, and how that change reaches visitors on
> the next page load with no rebuild. Connector: `app-settings-bridge` MCP (:3218).
> Companion skill: `manage-app-settings` (in every agent). Store: `app/APP-CONFIG/app-config.json`.

Change your site's name, description, or SEO — even its languages — just by asking an AI agent, in
chat or by voice. No admin panel to click through. No rebuild to wait for. That is what this page
explains. Fractera is an **Agentic Engineering Infrastructure**: a secure, self-hosted workspace
where AI models write and run your application on your own server — and this is the piece that lets
an agent change the app's own settings.

---

## What we automated: project settings by an agent's voice

Before, to change the site name, description, SEO or an icon, you opened the admin panel and clicked
through fields. Now you do the same thing by simply **asking an AI agent in words** — in chat or by
voice. The agent finds the right field, checks the value, and writes it. The change shows up on the
**next page load**, with no full rebuild.

> The panel built for humans is now mirrored by a tool built for AI. Same settings, two doors —
> click them yourself, or just ask.

---

## Where the settings live — a simple model

Picture a single plain text file, `app/APP-CONFIG/app-config.json` — the **passport of your site**:

```json
{
  "name": "Fractera",
  "description": "Production-Coding AI Server ...",
  "url": "https://fractera.ai",
  "seo": { "titleTemplate": "%s | Fractera" },
  "jsonLd": { "organization": false }
}
```

Why a file — and not a database or environment variables:

| Store | Nested structure | Applies without rebuild | Transparent to an agent | Verdict |
|---|---|---|---|---|
| **JSON file** (`app-config.json`) | Yes (`seo.*`, `jsonLd.*`, `geo.*`) | Yes (read at render / ISR) | Yes — reads it directly | **Substrate** |
| Env vars (`NEXT_PUBLIC_*`) | No (flat keys) | No (baked into the build) | Weak | Languages only |
| Database (SQLite) | Yes | Read at build for static pages | No — needs a query layer | Rejected for config |

Editing the file by hand is risky — one broken brace and the site falls over. So a change never goes
in raw: it goes through a **validated setter** that checks the value against a catalog and writes it
cleanly and atomically (temp file + rename). The file is *where the bytes live*; the setter is *how
they are written* — and only the setter writes. The fragile part was never the store; it was the
write path.

---

## How it works under the hood: a five-step flow

```
You (chat/voice): "change the description to 'Acme Corp'"
        |
        v
The agent calls the MCP tool on :3218  ->  set_text_value { path:"description", value:"Acme Corp" }
        |
        v
The setter checks (field exists? type ok?) and writes app-config.json  (atomic -- no corruption)
        |
        v
The setter pings /api/revalidate  <-- the piece that makes the change instant
        |
        v
The site drops the page cache  ->  on the next load the new description is visible
```

**In plain words about the cache (ISR).** A public page is built ahead of time and stored so it
opens instantly. "Revalidation" is the command "rebuild that stored copy." We taught the setter to
send that command automatically — so a change no longer waits out a cache window; it appears on the
very next visit, while pages stay static and work even with JavaScript off.

---

## The tools every agent now has

| Tool | What it does |
|---|---|
| `owner_app_settings_list_text_fields` | Show ALL settings: path, what it means, current value, whether it is set |
| `owner_app_settings_list_unfilled_fields` | Show only the empty ones, so the agent can nudge you to fill them |
| `owner_app_settings_set_text_value` | Change one field by path (validate → write → revalidate) |
| `owner_app_settings_list_languages` / `owner_app_settings_set_languages` | Read / change the language set |

Server: `bridges/platforms/app-settings-mcp-server.js` (class `AppSettingsMcpServer`, port 3218).
Field catalog (the single source of paths, types, defaults and roles):
`bridges/platforms/app-settings-catalog.js`.

---

## Cases: what it looks like in practice

- **Description.** You: "Change the description to 'Acme Corp'." → `set_text_value { path:"description", value:"Acme Corp" }` → new text in the search snippet and social shares on the next load. No panel, no rebuild.
- **Your own domain.** You: "My domain is now example.com." → the agent sets `url` and `seo.canonicalBase` → canonical links and OG tags follow the new domain.
- **Schema for Google.** You: "Turn on the Organization schema." → `set_text_value { path:"jsonLd.organization", value:true }` → structured Organization data appears in the page HTML.
- **Languages (the special case).** You: "Add French." → `set_languages(["en","ru","fr"])` → written to env, and the agent answers honestly: "French appears after a rebuild, a few minutes." Languages decide which pages get generated — settled at build time, so it cannot be instant.
- **Help filling things in.** You: "What else should I fill in for SEO?" → `list_unfilled_fields` → "not set: keywords, Google verification, the author's Twitter…" and the agent offers to complete them.

---

## One capability, in all six agents of the agentic engineering workspace

A capability is only real if it survives no matter which single agent is present — a project may run
just one, with no orchestrator. So the connector **and** the skill are duplicated into every agent:

| Agent | MCP :3218 registered in | Skill `manage-app-settings` |
|---|---|---|
| Claude Code | `.mcp.json` | own copy in `.claude/skills` |
| Codex | `.codex/config.toml` | reads `.agents/skills` |
| Gemini CLI | `.gemini/settings.json` | own copy in `.gemini/skills` |
| Qwen Code | `.qwen/settings.json` | own copy in `.qwen/skills` |
| Kimi Code | `.kimi/config.toml` | reads `.agents/skills` |
| Hermes (orchestrator) | its config (`mcp_servers`) | `services/hermes-skills/manage-app-settings.md` |

---

## Request flow: a single agent vs. the orchestrator

Directly on one coding agent — the real "single-agent" case, no orchestrator:

```
You -> Codex: "change the description to 'Acme Corp'"
  1. Codex sees the manage-app-settings skill (its description is loaded) -> knows the steps
  2. Codex connects to :3218 via .codex/config.toml (with the secret)
  3. (optional) list_text_fields -> { path:"description", current:"...", is_set:false }
  4. set_text_value { path:"description", value:"Acme Corp" }
       -> validate -> write app-config.json (atomic) -> ping /api/revalidate
  5. response: { ok:true, path:"description", value:"Acme Corp", is_set:true }
  -> Codex: "Done -- it shows on the next page load."
```

Through Hermes, the orchestrator — same tools, plus coordination:

```
You -> Hermes: "change the description to 'Acme Corp' and turn on the Organization schema"
  1. Hermes holds the same tools in its MCP client
  2. set_text_value { path:"description", value:"Acme Corp" }
     set_text_value { path:"jsonLd.organization", value:true }
  3. Hermes gathers both results, replies once, and can chain next steps
     (verify the page, log it to memory, coordinate other agents)
```

The difference in one line: the write mechanics are identical — both hit the same `:3218` connector.
Hermes only adds **orchestration** (several steps, autonomous loops, multi-agent coordination). For a
single change it is not required, and a project with one lone Codex does the whole job by itself.

---

## How an agent knows this natively

1. **The skill** — its description is loaded into the agent's list of skills at session start, so it knows a "manage app settings" capability exists.
2. **The MCP tools** — the agent asks `:3218` for `tools/list`; the tools appear in its toolset with descriptions, ready to call.
3. **Vector memory** — this document is ingested into the shared memory (LightRAG), so a memory-equipped agent recalls the deeper how and why on demand.

Even with no memory and no orchestrator, the agent still has the skill and the MCP locally — that is
the whole point of self-sufficiency. Languages stay the deliberate exception: they feed static page
generation, so they are build-time, and the agent says so rather than pretending the change is
instant.

---

## Security and external access in agentic engineering

Configuration is a change to the file system, so access to the connector is constrained by design,
in depth:

- **Identity, not just a key.** Writing configuration (and the database) is restricted to the **architect** role, checked at every layer — the MCP connector, the HTTP config routes, and the data service. Reading can be broader; writing is architect-only.
- **Network isolation.** The connector listens on `127.0.0.1` only and is never exposed to the internet. The public surface sits behind nginx and the auth gate; the connector is reachable solely from inside the workspace.
- **A per-deploy secret.** Every call to the connector carries a secret unique to your deployment, so only your in-workspace agents can reach it.
- **Confirm before changing.** A writing tool restates the change (old → new) and waits for your go-ahead before it writes.

> In one phrase: your project settings became manageable in natural language — the agent reads them
> as an open file, changes them through a guarded tool, and the site updates on the next load: no
> panel, no rebuild (except languages, where a rebuild is unavoidable and you are told so up front).

---

> Experiment relentlessly. If you work "the way it's done," your ceiling is known in advance. Try to
> do things differently — not like everyone else.
> — Roma Armstrong, Founder at Fractera

---

*Companion files:* skill `manage-app-settings` (every agent) · catalog `app-settings-catalog.js` ·
server `app-settings-mcp-server.js` (:3218) · runtime store `app/APP-CONFIG/app-config.json`.
