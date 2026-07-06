// Hook phrase normalization + near-duplicate detection (step 187). A hook is a
// spoken trigger phrase bound to a project action; phrases are GLOBALLY unique so
// the chat/Telegram router maps one phrase to exactly one action. Normalization is
// the dedup key; near-duplicate detection additionally refuses phrases that are
// merely a punctuation/whitespace/word-order variant of an existing one.
//
// Pure module (no fs/db) so both the API route and any client preview can import it.

// Lowercase, strip punctuation/symbols (Unicode-aware), collapse whitespace. Keeps
// letters and digits of any script (Cyrillic, CJK, Latin, …) so 82 languages work.
export function normalizePhrase(phrase: string): string {
  return (phrase ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Token set of a normalized phrase.
function tokenSet(normalized: string): Set<string> {
  return new Set(normalized.split(" ").filter(Boolean));
}

// Jaccard similarity of two token sets (order-independent) — catches reordered or
// lightly-edited phrases ("remind me about X" vs "about X remind me").
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

// Levenshtein distance on the normalized strings — catches typo-level variants and
// works for scripts without whitespace word boundaries (e.g. CJK), where the token
// set collapses to one token.
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// True when two phrases are the same OR close enough that the router could not tell
// them apart. Exact normalized match, high token-set overlap, or small edit distance
// relative to length all count. Thresholds are deliberately conservative — better to
// refuse a genuine near-duplicate than to let two phrases fight over the router.
export function isNearDuplicate(aRaw: string, bRaw: string): boolean {
  const a = normalizePhrase(aRaw);
  const b = normalizePhrase(bRaw);
  if (!a || !b) return false;
  if (a === b) return true;

  const sim = jaccard(tokenSet(a), tokenSet(b));
  if (sim >= 0.8) return true;

  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  // ≤15% of the longer string edited → treat as the same phrase.
  if (dist <= Math.max(2, Math.floor(maxLen * 0.15))) return true;

  return false;
}
