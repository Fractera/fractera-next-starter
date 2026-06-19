import { NextRequest, NextResponse } from "next/server"
import { createStep, updateStep, type Importance, type StepTask } from "@/lib/dev-steps/step-file"
import { listTree, readDraft, deleteDraft } from "@/lib/ai-draft/draft-file"
import type { Draft, DraftTree } from "@/lib/ai-draft/draft-format"

// Create a development step. FS source of truth, no DB — same write path for the human
// UI and an agent. Three shapes:
//   POST { name, importance }  → an empty step the user fills in.
//   POST { draftId }           → promote ONE AI-draft into a step, then delete it.
//   POST { bundleAll: true }   → flow-A "Launch": every PENDING draft on the page becomes
//                                ONE detailed, free-form step (a brief handed to an agent),
//                                and all those drafts are removed — the wishes live in one
//                                place: the new step.
const VALID: Importance[] = ["optional", "mandatory", "critical"]

function allDrafts(tree: DraftTree): Draft[] {
  const out: Draft[] = []
  for (const a of tree.agents) {
    out.push(...a.instructions)
    for (const r of a.skills.refs) if (r.draft) out.push(r.draft)
    out.push(...a.skills.extras)
    for (const r of a.mcp.refs) if (r.draft) out.push(r.draft)
    out.push(...a.mcp.extras)
  }
  return out
}

// One draft → a labelled section of the bundled step description.
function section(d: Draft, i: number): string {
  const where = d.target ? `over ${d.target}` : "new record"
  const lines = [`### ${i + 1}. ${d.kind} — "${d.name}" · ${d.agent} (${d.mode}, ${where})`]
  if (d.source.trim()) lines.push("", "```", d.source.trim(), "```")
  const wishes = d.tasks.filter(t => t.kind !== "delete")
  if (wishes.length) { lines.push("", "Wishes:", ...wishes.map(w => `- ${w.body}`)) }
  const dels = d.tasks.filter(t => t.kind === "delete")
  if (dels.length) { lines.push("", "Deletion requests:", ...dels.map(w => `- ${w.body}${w.outcome ? ` → ${w.outcome}` : ""}`)) }
  return lines.join("\n")
}

function bundleBrief(drafts: Draft[]): string {
  const head = [
    `This step bundles ${drafts.length} wish${drafts.length === 1 ? "" : "es"} captured on /ai-draft-settings.`,
    "Apply each to the real file of its agent — the originals are never edited from the draft page;",
    "an agent reads this brief and makes the change. Each section is one wish.",
  ]
  return [head.join("\n"), ...drafts.map(section)].join("\n\n")
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  // Launch: bundle every pending draft into one step, then remove them all (flow-A).
  if (body?.bundleAll) {
    const pending = allDrafts(await listTree()).filter(d => d.pending)
    if (pending.length === 0) {
      return NextResponse.json({ error: "No pending drafts to send" }, { status: 400 })
    }
    const step = await createStep(`Apply ${pending.length} AI-draft ${pending.length === 1 ? "wish" : "wishes"}`, "mandatory")
    const tasks: StepTask[] = pending.map((d, i) => ({
      id: `d${i + 1}`, body: `Materialize the ${d.kind} "${d.name}" for ${d.agent} (mode ${d.mode}).`,
    }))
    const full = await updateStep(step.id, { description: bundleBrief(pending), tasks })
    for (const d of pending) await deleteDraft(d.id)
    return NextResponse.json({ step: full ?? step, drafted: pending.length }, { status: 201 })
  }

  // Promote a single draft, then remove it.
  if (body?.draftId) {
    const draft = await readDraft(String(body.draftId))
    if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    const step = await createStep(draft.name || `${draft.kind} draft`, "mandatory")
    const full = await updateStep(step.id, { description: bundleBrief([draft]), tasks: [{ id: "d1", body: `Materialize the ${draft.kind} "${draft.name}" for ${draft.agent}.` }] })
    await deleteDraft(draft.id)
    return NextResponse.json({ step: full ?? step, draftDeleted: true }, { status: 201 })
  }

  // Direct creation: an empty step the user (or agent) fills in.
  const { name, importance } = body
  if (!name?.trim()) {
    return NextResponse.json({ error: "A step name is required" }, { status: 400 })
  }
  const imp: Importance = VALID.includes(importance) ? importance : "optional"
  const step = await createStep(String(name).trim(), imp)
  return NextResponse.json({ step }, { status: 201 })
}
