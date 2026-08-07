import { dataJson } from "./data-service";

// The knowledge graph — agentic RAG, reached through the data service.
//
// Everything here goes to /service/rag, which the data service forwards to the
// graph engine on the server's loopback. That indirection is deliberate: the
// engine is not published to the internet, and routing through the one door
// that already checks a secret means a project cloned onto a laptop can use the
// knowledge base without a second address, a second key, or a second open port.
//
// How this differs from vector memory (./vectors): the graph is asked a question
// and RETURNS AN ANSWER, composed from entities and relations it extracted when
// the documents were loaded. Vector memory returns passages and leaves the
// writing to you. The graph is the right tool when the answer is spread across
// several documents; vector memory is right when it sits in one paragraph and
// speed matters.
//
// Cost, stated plainly because it is easy to trip over: LOADING is expensive —
// the model reads every chunk to extract entities and relations, once per
// document. ASKING is much cheaper. Load what will actually be asked about.

export type KnowledgeAnswer = {
  available: boolean;
  answer: string | null;
  /** The engine's own reference block, when it returned one. */
  raw?: unknown;
};

/**
 * Ask the knowledge base a question and get a written answer.
 *
 * `mode` selects how the graph is searched: "hybrid" (default) mixes specific
 * entities with broader themes and is the right choice unless you know better;
 * "local" leans on named things, "global" on themes across the whole corpus.
 */
export async function ask(
  question: string,
  mode: "hybrid" | "local" | "global" | "naive" = "hybrid",
): Promise<KnowledgeAnswer> {
  try {
    const data = await dataJson<{ response?: string; result?: string }>("/service/rag/query", {
      method: "POST",
      body: JSON.stringify({ query: question, mode }),
    });
    const answer = data.response ?? data.result ?? null;
    return { available: true, answer, raw: data };
  } catch {
    // A graph that is switched off is a normal state for a project that does not
    // use it — the caller decides whether that is a problem.
    return { available: false, answer: null };
  }
}

/**
 * Add a document. Returns as soon as it is accepted: the graph is built in the
 * background, so a question asked immediately may not see it yet.
 *
 * `source` is the name the document is remembered by — pass a filename or a
 * stable identifier, or every document becomes "unknown_source".
 */
export async function learn(text: string, source: string): Promise<{ accepted: boolean }> {
  try {
    await dataJson("/service/rag/documents/text", {
      method: "POST",
      body: JSON.stringify({ text, file_source: source }),
    });
    return { accepted: true };
  } catch {
    return { accepted: false };
  }
}

/** What the knowledge base currently holds, and whether each item finished building. */
export async function knowledgeDocuments(): Promise<
  { id: string; status: string; source: string | null; chunks: number }[]
> {
  try {
    const data = await dataJson<{ statuses?: Record<string, Record<string, unknown>[]> }>(
      "/service/rag/documents",
    );
    const buckets = data.statuses ?? {};
    return Object.entries(buckets).flatMap(([status, rows]) =>
      (rows ?? []).map((d) => ({
        id: String(d.id ?? ""),
        status: String(d.status ?? status),
        source: d.file_path && d.file_path !== "unknown_source" ? String(d.file_path) : null,
        chunks: Number(d.chunks_count ?? 0),
      })),
    );
  } catch {
    return [];
  }
}

/** Is the graph engine running and reachable from here. */
export async function knowledgeReady(): Promise<boolean> {
  try {
    await dataJson("/service/rag/health");
    return true;
  } catch {
    return false;
  }
}
