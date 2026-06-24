import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// On-demand revalidation of the PUBLIC surface after an App Settings change.
// The App Settings MCP (:3218) and the Admin config panel write app-config.json in
// a DIFFERENT process, then POST here so the change shows on the NEXT page load
// instead of waiting out the ISR window (revalidate=600). The public pages stay
// STATIC (ISR) — this only purges their cache, it never makes them dynamic. The
// config feeds metadata / JSON-LD / manifest on every page, so we purge the whole
// public tree. → CRUD-DOCS/workspace-standards/app-settings.md.
//
// Auth: when REVALIDATE_SECRET is set a matching Bearer is required; when it is unset
// (current servers) the endpoint still works — it sits behind the proxy.ts API gate
// (the caller sends x-agent-identity) and only purges cache, which cannot corrupt
// data. Role-based enforcement across all mutating surfaces is unified in step 135.

const SECRET = process.env.REVALIDATE_SECRET ?? "";

export async function POST(req: NextRequest) {
  if (SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ") || auth.slice(7) !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  // Purge the whole public tree. "/" covers the root + app-root routes (manifest,
  // robots, sitemap, llms.txt); "/[lang]" covers every localized content route.
  revalidatePath("/", "layout");
  revalidatePath("/[lang]", "layout");
  return NextResponse.json({ ok: true, revalidated: ["/", "/[lang]"], ts: Date.now() });
}
