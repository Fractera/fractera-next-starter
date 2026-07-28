import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { ALL_DOCS, type LegalDoc } from "@/app/[lang]/_components/legal/types";
import { downloadPayload, normalizeUpload, writeConfig } from "@/app/[lang]/_components/legal/legal-config";

// Legal config API (step 305). GET returns the current merged config for a document (the architect's
// "Download config" payload — complete: every language present, ready to translate). POST accepts an
// uploaded config and persists it — ARCHITECT ONLY. Both are reached only from the in-page architect
// controls; the page itself reads the config server-side (readLegalConfig), never through this route.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validDoc(doc: string): doc is LegalDoc {
  return (ALL_DOCS as readonly string[]).includes(doc);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!validDoc(doc)) return NextResponse.json({ error: "unknown_document" }, { status: 404 });
  return NextResponse.json(downloadPayload(doc));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!validDoc(doc)) return NextResponse.json({ error: "unknown_document" }, { status: 404 });

  const session = await getSession(req);
  if (!session?.roles?.includes("architect")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const norm = normalizeUpload(doc, body);
  if (!norm.ok) return NextResponse.json({ error: norm.error }, { status: 400 });

  writeConfig(doc, norm.value);
  return NextResponse.json({ ok: true });
}
