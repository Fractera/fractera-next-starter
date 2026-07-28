import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { readLegalConfig } from "./legal-config";
import { renderInline } from "./markup";
import { legalUi } from "./legal.i18n";
import { LegalAdmin } from "./legal-admin.client";
import type { ContentDoc } from "./types";

// One legal page (step 305). Header/footer/cookie banner come from the [lang] layout. Here: breadcrumb,
// then the HERO — title + description, ALWAYS shown and localized (seeded in all ten languages) — then the
// body from the config, or the "not published yet" notice when the customer hasn't filled that language.
// The architect Download/Upload controls mount at the bottom (self-hiding for everyone else). No cockpit.
export function LegalPage({ doc, lang }: { doc: ContentDoc; lang: string }) {
  const cfg = readLegalConfig(doc);
  const ui = legalUi(lang);
  const entry = cfg.languages[lang] ?? cfg.languages.en;
  const en = cfg.languages.en;
  const title = entry.title || en.title;
  const description = entry.description || en.description;
  const body = Array.isArray(entry.body) ? entry.body : [];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {ui.home}
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      {cfg.updatedAt && (
        <p className="mt-1 text-xs text-muted-foreground">{new Date(cfg.updatedAt).toISOString().slice(0, 10)}</p>
      )}

      <div className="mt-8 flex flex-col gap-4 text-base leading-relaxed">
        {body.length > 0 ? (
          body.map((p, i) => <p key={i}>{renderInline(p)}</p>)
        ) : (
          <p className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">{ui.pending}</p>
        )}
      </div>

      <LegalAdmin
        doc={doc}
        ui={{
          download: ui.download,
          upload: ui.upload,
          uploaded: ui.uploaded,
          uploadFailed: ui.uploadFailed,
          markupHelp: ui.markupHelp,
        }}
      />
    </main>
  );
}
