import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";

// Media proxy (step 207.18d): image URLs are stored as http://localhost:3300/media/<id>/file — the
// media service's OWN address, reachable only from the server. The browser cannot fetch it in EITHER
// mode: in IP mode "localhost" is the viewer's machine; in secure mode :3300 is firewalled behind
// nginx. This same-origin route streams the bytes through the app (:3000), so the Preview modals work
// identically in both modes. Role-gated like the record APIs (receipts are private data).
export const runtime = "nodejs";

const ROLES = ["architect", "manager", "agent"];
const DATA_URL = (process.env.REMOTE_DATA_URL ?? "http://localhost:3300").replace(/\/+$/, "");
// Only media paths pass through — this is a media proxy, not an open relay.
const SAFE = /^[a-zA-Z0-9\-_.\/]+$/;

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const session = await getSession(req);
  if (!session?.roles?.some((r) => ROLES.includes(r))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { path } = await ctx.params;
  const rel = (path ?? []).join("/");
  if (!rel || !SAFE.test(rel) || rel.includes("..")) {
    return NextResponse.json({ error: "bad path" }, { status: 400 });
  }
  try {
    const upstream = await fetch(`${DATA_URL}/media/${rel}`, { signal: AbortSignal.timeout(15000) });
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: `media ${upstream.status}` }, { status: 502 });
    }
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "media unreachable" }, { status: 502 });
  }
}
