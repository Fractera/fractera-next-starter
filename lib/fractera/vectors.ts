import { dataJson } from "./data-service";

// Vector memory — meaning-search over text you store.
//
// Use it when the question is asked loosely and the answer sits in one passage:
// product facts, policies, descriptions. It returns PASSAGES with a score, not a
// written answer. If you need an answer composed across many documents, that is
// the knowledge graph — see ./knowledge.
//
// Storage lives in the data service, in the same SQLite file as your rows, so a
// vector can point back at the row it describes through refTable/refId.

export type VectorRecord = {
  id: string;
  collection: string;
  refTable: string | null;
  refId: string | null;
  text: string;
  score: number;
};

/**
 * Store one piece of text so it can be found by meaning.
 *
 * `collection` groups records and is the only filter a search can apply, so
 * choose it as the thing you will want to search WITHIN: "docs", "products",
 * "tickets". `refTable`/`refId` tie the record back to a database row.
 *
 * Long documents must be split before storing: one vector for forty pages finds
 * nothing well. A few hundred to a thousand characters per piece works.
 */
export async function remember(input: {
  collection: string;
  text: string;
  id?: string;
  refTable?: string;
  refId?: string;
  /** Pass a ready vector to store without calling the embedding model. */
  embedding?: number[];
}): Promise<{ id: string }> {
  const data = await dataJson<{ ok: boolean; id: string }>("/vectors", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return { id: data.id };
}

/**
 * Find the passages closest in meaning to `query`.
 *
 * Omitting `collection` searches everything, which is rarely what you want in a
 * project that stores more than one kind of text.
 */
export async function recall(input: {
  query: string;
  collection?: string;
  k?: number;
}): Promise<VectorRecord[]> {
  const data = await dataJson<{ results: VectorRecord[] }>("/vectors/search", {
    method: "POST",
    body: JSON.stringify({ ...input, k: input.k ?? 5 }),
  });
  return data.results ?? [];
}

export async function forget(id: string): Promise<void> {
  await dataJson(`/vectors/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Is the store usable at all — key present, index in use, how many records. */
export async function vectorStatus(): Promise<{
  configured: boolean;
  model: string;
  index: "partitioned" | "flat" | "scan";
  count: number;
}> {
  return dataJson("/vectors/status");
}
