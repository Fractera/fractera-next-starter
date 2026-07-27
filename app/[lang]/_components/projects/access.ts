import { cookies, headers } from "next/headers";
import { shouldBypassAuth } from "@/lib/auth/auth-bypass";
import type { AccessTier } from "./catalog";

// PUBLIC BODY GATE (step 304) — the automation page always shows its header, breadcrumbs, hero (title +
// description) and footer, regardless of access. Only the BODY is gated: this reads the caller's roles and,
// if they don't meet the automation's required tier, the page renders an error container instead of the body.
//
// This is the NON-REDIRECTING sibling of lib/auth/require-role.ts: requireRole() redirects the whole request
// (zone gate); here we must stay on the page and only swap the body, so we RETURN the roles and decide inline.
// Reading cookies()/headers() forces dynamic rendering — exactly what these routes want (owner's decision).
//
// IP/onboarding mode (shouldBypassAuth) is open → architect, like the rest of the onboarding surface.
export async function getSessionRoles(): Promise<string[]> {
  if (shouldBypassAuth()) return ["architect"];

  const h = await headers();
  if (h.get("x-agent-identity")) return ["agent"];

  const authUrl =
    process.env.AUTH_SERVICE_URL ?? process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
  const cookie = (await cookies()).toString();
  try {
    const res = await fetch(`${authUrl}/api/session`, { headers: { cookie }, cache: "no-store" });
    if (res.ok) {
      const s = (await res.json()) as { roles?: string[] } | null;
      return s?.roles ?? [];
    }
  } catch {
    /* fall through to anonymous */
  }
  return []; // anonymous → guest tier only
}

// The three tiers the auth substrate enforces (lib/roles.ts ACCESS_TIERS): guest < user < architect.
const REQUIRED_RANK: Record<AccessTier, number> = { guest: 0, user: 1, architect: 2 };

// Collapse a session's roles to the highest tier it satisfies. `architect`/`admin` are the top tier; ANY
// other real (non-guest) role means an authenticated user; nothing/guest is the public tier.
function sessionRank(roles: string[]): number {
  if (roles.includes("architect") || roles.includes("admin")) return 2;
  const authed = roles.some((r) => r && r !== "guest");
  return authed ? 1 : 0;
}

export function meetsTier(roles: string[], required: AccessTier): boolean {
  return sessionRank(roles) >= REQUIRED_RANK[required];
}
