import type { ReactNode } from "react";

// SAFE inline markup renderer (step 305). Turns the config's plain body strings into React nodes — never
// dangerouslySetInnerHTML, so an uploaded config can never inject HTML/scripts. Supported marks (the pattern
// the shipped English example demonstrates): **bold**, *italic*, _underline_, [text](url). Links are
// sanitized to http(s) or internal (/…) targets only; anything else collapses to "#".
//
// Bold is listed before italic in the alternation so `**x**` matches as bold, not two italics. Marks are not
// nested (the example never nests them) — good enough and robust for legal copy.
const TOKEN = /(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/g;

function safeHref(href: string): { href: string; external: boolean } {
  if (/^https?:\/\//i.test(href)) return { href, external: true };
  if (href.startsWith("/")) return { href, external: false };
  return { href: "#", external: false };
}

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `t${i++}`;
    if (tok.startsWith("[")) {
      const lm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
      if (lm) {
        const { href, external } = safeHref(lm[2]);
        nodes.push(
          <a
            key={key}
            href={href}
            className="underline underline-offset-2 hover:no-underline"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {lm[1]}
          </a>,
        );
      }
    } else if (tok.startsWith("**")) {
      nodes.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else {
      nodes.push(<u key={key}>{tok.slice(1, -1)}</u>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
