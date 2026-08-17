// @api answer whether this application process is alive right now
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
