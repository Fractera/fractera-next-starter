// Legal / compliance layer (step 305) — shared types.
//
// The public app (port 3000) is the CUSTOMER's product and must carry the standard legal pages required in
// the strictest EU/US jurisdictions (GDPR/ePrivacy, §5 DDG Impressum, CCPA, EAA/ADA) + a cookie-consent
// banner, in all ten supported languages. But the legal TEXT belongs to the customer, not the platform, and
// cannot be hand-translated into ten languages. So the platform ships page SHELLS (localized title +
// description, always visible) and the BODY comes from a per-document JSON config the architect supplies:
// download the config → fill every language with an AI (keeping the markup) → upload it back.

export const LEGAL_LANGS = ["en", "es", "fr", "it", "ru", "de", "pt", "pl", "tr", "nl"] as const;
export type LegalLang = (typeof LEGAL_LANGS)[number];

// The five content documents (step 305 decision: strict EU/US set). "cookie-banner" is a sibling config
// (the consent-banner strings) handled by the same download/upload machinery but with its own field set.
export const CONTENT_DOCS = ["privacy", "cookies", "terms", "imprint", "accessibility"] as const;
export type ContentDoc = (typeof CONTENT_DOCS)[number];

export const ALL_DOCS = [...CONTENT_DOCS, "cookie-banner"] as const;
export type LegalDoc = (typeof ALL_DOCS)[number];

// One language's content for a legal page. `body` is an array of paragraphs; each string supports the
// minimal inline markup pattern — **bold**, *italic*, _underline_, [text](url) — rendered safely (never
// dangerouslySetInnerHTML). An empty body means "the customer has not provided this yet" → the page shows a
// notice instead of the body (title + description still render).
export type LegalLangEntry = { title: string; description: string; body: string[] };

export type LegalConfig = {
  document: ContentDoc;
  help: string; // instruction handed to the AI + the architect (what the markup is, fill every language)
  updatedAt?: string;
  languages: Record<string, LegalLangEntry>;
};

// The cookie-consent banner's translatable strings (one set per language).
export type BannerLangEntry = { message: string; policyLinkLabel: string; accept: string; reject: string };

export type BannerConfig = {
  document: "cookie-banner";
  help: string;
  updatedAt?: string;
  languages: Record<string, BannerLangEntry>;
};

export function isContentDoc(x: string): x is ContentDoc {
  return (CONTENT_DOCS as readonly string[]).includes(x);
}
