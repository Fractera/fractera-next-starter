import { getAppConfig } from "@/config/app-config";

// /llms.txt — concise AI-discovery summary (step 131). Config-driven generic template
// describing THIS workspace (name/description/url from Site Settings), not any vendor
// marketing. Owners edit Site Settings (or this file) to fit their project.
export const dynamic = "force-static";
export const revalidate = 86_400;

export async function GET() {
  const cfg = getAppConfig();
  const body = `# ${cfg.name}

> ${cfg.description}

- **Site:** ${cfg.url}
- **Full version:** ${cfg.url}/llms-full.txt

## About
${cfg.name} is a self-hosted AI workspace. The public site is statically rendered and
works without JavaScript; content is served as complete HTML for readers and machines.

## Primary pages
- Home: ${cfg.url}/

## Contact
${cfg.mailSupport}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
