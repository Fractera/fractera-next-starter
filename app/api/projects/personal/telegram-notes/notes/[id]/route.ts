import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/get-session";
import { noteType } from "@/app/(projects)/projects/personal/telegram-notes/_lib/note-type";

// Full original text of one telegram_notes row (step 188 Phase 3). Fetched lazily by
// the "Full text" modal so the list feed stays light. Role-gated like the list feed.
export const runtime = "nodejs";

const READ_ROLES = ["architect", "manager", "agent"];

type Row = {
  id: number;
  hook_action: string;
  summary: string;
  full_text: string;
  reminder_due: number | null;
  created_at: number;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(req);
  if (!session?.roles?.some((r) => READ_ROLES.includes(r))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const row = (await db
      .prepare(
        `SELECT id, hook_action, summary, full_text, reminder_due, created_at
           FROM telegram_notes WHERE id = ? AND project_slug = 'telegram-notes'`,
      )
      .get(id)) as Row | null;
    if (!row) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: String(row.id),
      type: noteType(row.hook_action),
      summary: row.summary,
      fullText: row.full_text,
      reminderDue: row.reminder_due,
      createdAt: row.created_at,
    });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
