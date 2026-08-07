// One place that answers "where is the data layer, and what proves me to it".
//
// The same code runs in two places and must not care which:
//   • On the server, next to the data service — the address is loopback and the
//     secret is DATA_SECRET, written by the installer.
//   • On a developer's machine — the address and key come from the file the
//     admin panel generates (Env Variables → download), where they are called
//     REMOTE_DATA_URL and DATA_API_KEY.
//
// Both names are accepted so a project cloned from GitHub behaves exactly as it
// does in production. That is the whole point of the local-development loop:
// the repository carries code, the server keeps the data, and a laptop reads the
// server's data rather than an empty copy of its own.

export type DataService = { url: string; key: string };

export function dataService(): DataService {
  const url = process.env.REMOTE_DATA_URL || "http://localhost:3300";
  const key = process.env.DATA_API_KEY || process.env.DATA_SECRET || "";
  return { url, key };
}

/** True when this process can actually reach the data layer with credentials. */
export function dataServiceReady(): boolean {
  const { url, key } = dataService();
  return Boolean(url && key);
}

export async function dataFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { url, key } = dataService();
  if (!key) {
    throw new Error(
      "No data-service key. On the server this is DATA_SECRET; on your machine, download .env.local from Admin → Env Variables.",
    );
  }
  return fetch(`${url}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Data-Secret": key,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

/** Read a JSON answer, turning a failure into a message that names the cause. */
export async function dataJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await dataFetch(path, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Data service ${res.status} on ${path}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Data service returned something that is not JSON on ${path}`);
  }
}
