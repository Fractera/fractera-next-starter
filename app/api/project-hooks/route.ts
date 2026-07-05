import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth/get-session"
import { normalizePhrase, isNearDuplicate } from "@/lib/hooks/normalize"

// Automation hooks API (step 187) — GLOBAL registry of trigger phrases. A hook binds
// a spoken phrase to a project action; phrases are unique across the WHOLE app so the
// chat/Telegram router maps one phrase to exactly one action. POST refuses a phrase
// that duplicates or near-duplicates any existing hook (409). Role-gated like the slot
// env setter (186.4): architect/manager/agent.
export const runtime = "nodejs"

const WRITE_ROLES = ["architect", "manager", "agent"]
const VALID_ACTIONS = new Set(["save", "remind", "recall", "custom"])

async function authorize(req: NextRequest): Promise<boolean> {
  const session = await getSession(req)
  return Boolean(session?.roles?.some((r) => WRITE_ROLES.includes(r)))
}

type HookRow = {
  id: string
  category: string
  project: string
  phrase: string
  normalized_phrase: string
  action: string
  lang: string
  description: string
  created_at: string
  created_by: string
}

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const category = req.nextUrl.searchParams.get("category")
  const project = req.nextUrl.searchParams.get("project")
  const rows =
    category && project
      ? await db
          .prepare(
            "SELECT * FROM project_hooks WHERE category = ? AND project = ? ORDER BY created_at",
          )
          .all(category, project)
      : await db.prepare("SELECT * FROM project_hooks ORDER BY created_at").all()
  return NextResponse.json({ hooks: rows })
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  let body: {
    category?: string
    project?: string
    phrase?: string
    action?: string
    lang?: string
    description?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const category = (body.category ?? "").trim()
  const project = (body.project ?? "").trim()
  const phrase = (body.phrase ?? "").trim()
  const action = (body.action ?? "custom").trim()
  const lang = (body.lang ?? "en").trim() || "en"
  const description = (body.description ?? "").trim()

  if (!category || !project) {
    return NextResponse.json({ error: "category and project are required" }, { status: 400 })
  }
  if (!phrase) {
    return NextResponse.json({ error: "phrase is required" }, { status: 400 })
  }
  if (!VALID_ACTIONS.has(action)) {
    return NextResponse.json({ error: "invalid action" }, { status: 422 })
  }

  const normalized = normalizePhrase(phrase)
  if (!normalized) {
    return NextResponse.json({ error: "phrase has no usable content" }, { status: 422 })
  }

  // GLOBAL near-duplicate guard: compare against every existing hook, not just this
  // project's. A conflict returns 409 naming the colliding hook so the UI can explain.
  const existing = (await db
    .prepare("SELECT * FROM project_hooks")
    .all()) as unknown as HookRow[]
  const clash = existing.find(
    (h) => h.normalized_phrase === normalized || isNearDuplicate(phrase, h.phrase),
  )
  if (clash) {
    return NextResponse.json(
      {
        error: "phrase too similar to an existing hook",
        conflict: {
          phrase: clash.phrase,
          category: clash.category,
          project: clash.project,
          action: clash.action,
        },
      },
      { status: 409 },
    )
  }

  const session = await getSession(req)
  const id = crypto.randomUUID()
  try {
    await db
      .prepare(
        "INSERT INTO project_hooks (id, category, project, phrase, normalized_phrase, action, lang, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(id, category, project, phrase, normalized, action, lang, description, session?.email ?? "unknown")
  } catch (e) {
    // The UNIQUE(normalized_phrase) constraint is the last-line global guard against a
    // race between the read above and this insert.
    const msg = e instanceof Error ? e.message : String(e)
    if (/unique/i.test(msg)) {
      return NextResponse.json({ error: "phrase already registered" }, { status: 409 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const hook = await db.prepare("SELECT * FROM project_hooks WHERE id = ?").get(id)
  return NextResponse.json({ hook }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const id = req.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }
  await db.prepare("DELETE FROM project_hooks WHERE id = ?").run(id)
  return NextResponse.json({ ok: true })
}
