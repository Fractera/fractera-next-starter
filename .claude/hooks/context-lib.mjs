// Shared plumbing for the context-window hooks (see CONTEXT-STATE.md).
//
// Kept in one place because the guard and the resume hook must agree on three
// things exactly: where the handoff file is, whether the mechanism is switched
// on, and how "how full is the window" is measured. Two copies of that would
// drift, and the failure would be silent — the worst kind here.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const HANDOFF_FILE = "CONTEXT-STATE.md";
export const ARCHIVE_DIR = "CONTEXT-STATE.archive";
export const MARKER = "fractera:context-state";

/**
 * Is the mechanism switched on?
 *
 * The single source of truth is the control panel's own store —
 * PLATFORM-CONFIG/platform-config.json, branch `instructions`, keyed by the same
 * document ids the panel uses. The capability is EXPERIMENTAL and therefore OFF
 * by default: a missing file, a missing branch or an unreadable one all mean off.
 * Never guess "probably on" — a hook that starts shouting on a project that never
 * asked for it is worse than one that sleeps.
 */
export function isEnabled(cwd) {
  try {
    const p = path.join(cwd, "PLATFORM-CONFIG", "platform-config.json");
    const cfg = JSON.parse(fs.readFileSync(p, "utf-8"));
    return cfg?.instructions?.["doc-context-state"] === true;
  } catch {
    return false;
  }
}

/**
 * How full is the context window, in percent.
 *
 * There is no field for this: hooks receive a path to the session transcript,
 * and the transcript records what each request cost. So the last assistant
 * message's usage IS the current occupancy — prompt plus everything cached and
 * replayed into it. It is an honest estimate, not an instrument reading, which
 * is exactly why the thresholds sit low.
 *
 * Only the tail of the file is read: a long session's transcript reaches
 * megabytes, and the answer lives in its last lines.
 */
export function contextPercent(transcriptPath) {
  try {
    const size = fs.statSync(transcriptPath).size;
    const window = Math.min(size, 512 * 1024);
    const fd = fs.openSync(transcriptPath, "r");
    const buf = Buffer.alloc(window);
    fs.readSync(fd, buf, 0, window, size - window);
    fs.closeSync(fd);

    const lines = buf.toString("utf-8").split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line.startsWith("{")) continue;
      let row;
      try { row = JSON.parse(line); } catch { continue; }
      const u = row?.message?.usage;
      if (!u) continue;
      const used =
        (u.input_tokens ?? 0) +
        (u.cache_read_input_tokens ?? 0) +
        (u.cache_creation_input_tokens ?? 0) +
        (u.output_tokens ?? 0);
      if (used <= 0) continue;
      const limit = Number(process.env.CLAUDE_CONTEXT_LIMIT ?? 200000);
      return Math.round((used / limit) * 100);
    }
  } catch { /* нет расшифровки — считать нечего */ }
  return null;
}

/** Ground truth about the repository, the part prose cannot fake. */
export function gitFacts(cwd) {
  const run = (args) => {
    try {
      return execFileSync("git", args, { cwd, encoding: "utf-8", timeout: 5000 }).trim();
    } catch {
      return "";
    }
  };
  const head = run(["rev-parse", "--short", "HEAD"]);
  const status = run(["status", "--porcelain"]);
  return {
    head: head || "—",
    dirty: status ? status.split("\n").filter(Boolean).length : 0,
  };
}

export function handoffPath(cwd) {
  return path.join(cwd, HANDOFF_FILE);
}

export function readHandoff(cwd) {
  try {
    return fs.readFileSync(handoffPath(cwd), "utf-8");
  } catch {
    return null;
  }
}

/** An empty file is the normal resting state, and it must never read as a handoff. */
export function isEmptyHandoff(text) {
  if (!text) return true;
  if (!text.includes(MARKER)) return false;
  return /\*\*state:\*\*\s*empty/i.test(text);
}

export function readHeadField(text, field) {
  const m = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`).exec(text ?? "");
  return m ? m[1].trim() : "";
}
