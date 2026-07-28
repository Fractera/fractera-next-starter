import Link from "next/link";
import { CONTENT_DOCS } from "./types";
import { legalDocTitle } from "./default-content";
import { legalUi } from "./legal.i18n";

// The legal section of the footer (step 305) — the five required pages, localized, rendered inside the
// FooterMenu so it appears on EVERY public page (home, category, automation, and the legal pages themselves)
// via the [lang] layout. Pure static data, no fs read: labels are the stable standard page names.
export function LegalFooterNav({ lang }: { lang: string }) {
  const ui = legalUi(lang);
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{ui.heading}</h3>
      <ul className="flex flex-col gap-2">
        {CONTENT_DOCS.map((doc) => (
          <li key={doc}>
            <Link
              href={`/${lang}/legal/${doc}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {legalDocTitle(doc, lang)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
