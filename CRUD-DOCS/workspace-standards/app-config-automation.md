# App Config Automation — the MCP connector for managing project configuration by AI agents

> Complete reference for a hybrid reader: a technically-minded human **and** an AI agent.
> It documents how a deployed Fractera app exposes its own settings (App Config) so that any
> agent — by a plain natural-language request — can read and change them, and how that change
> reaches visitors without a rebuild. Companion skill: `manage-app-settings` (in every agent).
> Raw store: `app/APP-CONFIG/app-config.json`. Connector: `app-settings-bridge` MCP (:3218).

---

## 1. What we achieved

A deployed app carries a set of **owner-editable settings** that brand it and control how it
appears to visitors, search engines, social shares and PWA installs: name, description, canonical
URL, SEO, OpenGraph, PWA/theme, author, social profiles, JSON-LD, local-business address — and the
**language set**.

Before, you changed these by hand in the Admin → App Settings panel. Now the same job is done by
**asking an AI agent in plain words** — in chat or by voice. The agent finds the right field,
validates the value, writes it, and — thanks to on-demand revalidation — the change shows up on the
**next page load**, with no full rebuild. The panel still exists; the agent path is simply the new
primary way.

In one line: **an automated MCP connector for managing project configuration in an
[Agentic Engineering Infrastructure](/en)** — the same workspace where AI writes your app now also
lets AI retune the app's own identity.

---

## 2. Where settings live (and why)

The settings are a plain JSON file on disk — `app/APP-CONFIG/app-config.json` — read by the Shell on
every render and deep-merged over the code defaults (so a partial file is always valid). A change to
a text field applies on the next page load; the **language set** is the one exception (build-time —
see §8).

Three candidate stores were weighed; the file wins for agent-native work:

| Store | Holds nested structure? | Applies without rebuild? | Transparent to an agent? | Verdict |
|---|---|---|---|---|
| **JSON file** (`app-config.json`) | Yes (`seo.*`, `jsonLd.*`, `geo.*`) | Yes (read at render / ISR) | Yes — a plain file it can read directly | **Substrate** |
| Env vars (`NEXT_PUBLIC_*`) | No (flat keys only) | No (baked into the bundle at build) | Weak | Languages only |
| Database (SQLite) | Yes | Read at build for static pages | No — needs a query layer | Rejected for config |

The key distinction is **substrate vs. write path**:

- *Where the bytes live* (substrate) = the file. It is small, single-owner, low-frequency, and an
  agent can read it as-is.
- *How a change is written* (write path) = the **validated setter**, never raw hand-editing. Editing
  raw JSON risks broken braces, clobbered keys, wrong types, or a write race. The setter validates
  against a catalog, writes atomically, and triggers revalidation — the safety of a database without
  the opacity.

So the fragile part was never the substrate; it was the *write path*. The fix is to forbid raw edits
and route every write through the validated setter — not to change the store.

---

## 3. How it works (the path of one change)

```
You (chat/voice): "change the description to 'Acme Corp'"
        │
        ▼
The agent calls the MCP tool on :3218  →  set_text_value { path: "description", value: "Acme Corp" }
        │
        ▼
The setter validates against the catalog (field exists? type ok?) and writes app-config.json
        │   (atomic: temp file + rename — a crash mid-write never leaves a corrupt config)
        ▼
The setter POSTs /api/revalidate on the Shell (:3000)  ← purges the ISR cache
        │
        ▼
On the next page load the new value is live — pages stay static, no rebuild
```

> **What "applies on next load" means.** Public pages are pre-built and cached for speed (SSG/ISR).
> A naive setup would leave a change waiting out the cache window (up to minutes). The setter instead
> asks the Shell to revalidate immediately, so the next request rebuilds just the affected pages —
> still static, still working with JavaScript off.

---

## 4. The connector and its tools

- **MCP server:** `app-settings-bridge`, file `bridges/platforms/app-settings-mcp-server.js`, class
  `AppSettingsMcpServer`, port **3218** (owner tier).
- **Field catalog:** `bridges/platforms/app-settings-catalog.js` (path · label · kind · section ·
  default · role) — the single source the tools enumerate and validate against.

| Tool | Mutates? | What it does |
|---|---|---|
| `owner_app_settings_list_text_fields` | no | Every text setting: path, label, role (what it does / why it matters), current value, and `is_set` (filled by the owner vs still the default). |
| `owner_app_settings_list_unfilled_fields` | no | Only the settings still empty or on the default — so the agent can prompt the owner to complete them. |
| `owner_app_settings_set_text_value` | yes | Set ONE field by dot-path. `choice` must match its options; `flag` takes true/false; `number` takes a number; image fields are rejected. Validates → writes atomically → revalidates. |
| `owner_app_settings_list_languages` | no | Read the supported language set + default locale. |
| `owner_app_settings_set_languages` | yes | Set the language set (`en` always kept as fallback). Build-time — needs a rebuild to appear. |

---

## 5. Worked cases

| You say | The agent does | Result |
|---|---|---|
| "Change my description to 'Acme Corp'" | `set_text_value(path="description", value="Acme Corp")` | New meta description / OG snippet on next load. No rebuild. |
| "Use my domain example.com" | sets `url`, usually also `seo.canonicalBase` | Canonical links + OG url follow the new domain. |
| "Turn on the Organization schema" | `set_text_value(path="jsonLd.organization", value=true)` | Organization JSON-LD emitted in the page `<head>`. |
| "Add French" | `set_languages(languages=["en","ru","fr"])` | Saved to env; the agent says it appears after a rebuild (a few minutes). |
| "What should I still fill in for SEO?" | `list_unfilled_fields` | Lists empty fields (keywords, verification codes, …) and prompts you. |
| "Change the logo" | (rejected for images) | The agent tells you to upload it in the panel (crop + storage are panel-only). |

---

## 6. Available to every agent (parity 6/6)

A capability is only real if it survives no matter which single agent is present — a project may run
one agent with no orchestrator. So the connector **and** the skill are duplicated to all agents.

| Agent | MCP `:3218` | Skill `manage-app-settings` |
|---|---|---|
| Claude Code | `.mcp.json` | own copy in `.claude/skills` |
| Codex | `.codex/config.toml` | reads `.agents/skills` |
| Gemini CLI | `.gemini/settings.json` | own copy in `.gemini/skills` |
| Qwen Code | `.qwen/settings.json` | own copy in `.qwen/skills` |
| Kimi Code | `.kimi/config.toml` | reads `.agents/skills` |
| Hermes (orchestrator) | registered in its config (`mcp_servers: app-settings-bridge`) | `services/hermes-skills/manage-app-settings.md` |

The skill canon lives in `.agents/skills/manage-app-settings/`; Claude/Gemini/Qwen keep their own
copies (they only read their own folder), while Codex/Kimi read `.agents/skills` directly.

---

## 7. Request flow — directly vs. through the orchestrator

**Directly on a single coding agent (e.g. Codex), no orchestrator:**

```
You → Codex (CLI chat): "change the description to 'Acme Corp'"
   1. Codex sees the manage-app-settings skill (its description is loaded) → knows the procedure
   2. Codex connects to :3218 via .codex/config.toml (Bearer secret)
   3. (optional) list_text_fields → { path:"description", current:"…", is_set:false, role:"meta description…" }
   4. Codex calls set_text_value { path:"description", value:"Acme Corp" }
        → validate → write app-config.json (atomic) → POST /api/revalidate
   5. Response: { ok:true, path:"description", value:"Acme Corp", is_set:true }
   → Codex: "Done — it shows on the next page load."
```

No orchestrator is involved. A project with a single Codex does the whole job by itself.

**Through Hermes (the orchestrator):**

```
You → Hermes: "change the description to 'Acme Corp' and turn on the Organization schema"
   1. Hermes has the same tools in its MCP client
   2. set_text_value { path:"description", value:"Acme Corp" }
      set_text_value { path:"jsonLd.organization", value:true }
   3. Hermes collects both results, replies once, and can chain adjacent steps
      (verify the page, log to memory, coordinate other agents)
```

**The difference in one line:** the write mechanics are identical (both hit the same `:3218`
server). Hermes adds **orchestration** — multiple steps, autonomous loops, multi-agent coordination.
For a single change it is not required.

---

## 8. Native discoverability

An agent knows these capabilities natively through three channels:

1. **Skill** — the `manage-app-settings` frontmatter description is loaded into the agent's list of
   available skills at session start, so it knows a settings-management capability exists.
2. **MCP tools** — the agent queries `tools/list` from `:3218`; the tools appear in its toolset with
   descriptions, ready to call.
3. **Vector memory** — this document is ingested into the shared memory (LightRAG), so a
   memory-equipped agent recalls the deeper how/why on demand.

A project with no memory and no orchestrator still has the skill and the MCP locally — that is the
point of self-sufficiency.

**Languages are the deliberate exception.** They feed static page generation (one route per
language), so they are build-time: changing them needs a rebuild, and the agent says so honestly
rather than implying an instant change.

---

## 9. Security and external access — solved at the project level

Configuration is a mutation of the file system, so access to the connector is constrained by design,
in depth:

- **Identity, not just a key.** Mutating operations (writing config, writing the database) are
  restricted to the **architect** role. Reading may be broader; **writing/mutating is
  architect-only**, and the role is checked at every layer — the MCP connector, the HTTP config
  routes, and the data service — not merely by possession of a secret.
- **Network isolation.** The MCP connector binds to `127.0.0.1` (localhost) and is never exposed to
  the internet. The public surface sits behind nginx and the auth gate; the connector is reachable
  only from inside the workspace.
- **Credential.** Every connector call carries a per-deploy Bearer secret, so only in-workspace
  agents can reach it.
- **Confirm before mutating.** A mutating tool restates the change (old → new) and waits for the
  owner's confirmation before writing.

The result: the owner — and only the owner's authorized agents — can retune the app, from inside
their own server, with no path for an outside caller to change anything.

---

> Experiment relentlessly. If you work "the way it's done," your ceiling is known in advance. Try to
> do things "differently" — not like everyone else.
> — Roma Armstrong, Founder at Fractera

---

*Companion files:* skill `manage-app-settings` (every agent) · catalog `app-settings-catalog.js` ·
server `app-settings-mcp-server.js` (:3218) · runtime store `app/APP-CONFIG/app-config.json`.
