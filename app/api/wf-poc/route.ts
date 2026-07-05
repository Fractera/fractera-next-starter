import { start } from "workflow/api";
import { NextResponse } from "next/server";
import { pocDurable } from "@/workflows/poc-durable";

// 183.B PoC trigger. Starts the durable workflow asynchronously and returns its
// runId immediately (the workflow keeps running in the World after this handler
// returns). Reach it with the agent-identity header, since proxy.ts gates every
// /api/* route except /api/health:
//   curl -X POST http://localhost:3000/api/wf-poc \
//        -H "Content-Type: application/json" -H "X-Agent-Identity: wf-poc" \
//        --data '{"label":"hello"}'
// The WDK's own internal routes (/.well-known/workflow/v1/*) are NOT gated: the
// proxy.ts matcher excludes any path containing a dot, and ".well-known" has one.

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const label = typeof body.label === "string" ? body.label : "poc";

  const run = await start(pocDurable, [label]);
  console.log(`[wf-poc] started run ${run.runId} label=${label}`);

  return NextResponse.json({ runId: run.runId, label });
}
