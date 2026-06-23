import { getAppConfig } from "@/config/app-config";

// /llms-full.txt — expanded AI-discovery document (step 131). Config-driven generic
// template about THIS workspace, not vendor marketing. Owners tailor it to their project
// (via Site Settings for name/description/url, or by editing this file).
export const dynamic = "force-static";
export const revalidate = 86_400;

export async function GET() {
  const cfg = getAppConfig();
  const body = `# ${cfg.name} — full description

> ${cfg.description}

- **Site:** ${cfg.url}
- **Contact:** ${cfg.mailSupport}

## What this is
${cfg.name} is a self-hosted AI workspace built on the Next.js App Router. It ships a
static-first public site (every public page is prerendered as static/ISR and works with
JavaScript disabled) plus an architect-only service area for managing the project.

## Architecture (static-first)
- The public, localized surface lives under /<lang> and is statically generated.
- Architect-only service pages (dashboard, architecture, documents, etc.) are dynamic
  and are not indexed.
- Routing is server-generated; no public route is owned by a client component, so the
  site is readable without JavaScript.

## How to use this site
- Start at the home page: ${cfg.url}/
- Machine-readable summary: ${cfg.url}/llms.txt

## Notes for AI agents
This document is a generic template. The owner of this deployment can replace it with a
project-specific description (capabilities, endpoints, domains) via Site Settings or by
editing app/llms-full.txt/route.ts.

## Contact
${cfg.mailSupport}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
