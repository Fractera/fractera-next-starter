// Context resume — hands the baton to a new session, then destroys it.
//
// TWO JOBS, AND THE SECOND MATTERS MORE.
//
// The first: put the previous window's handoff into the new session's context
// automatically. Relying on the model to remember to open a file is the weakest
// link in the chain, and it breaks precisely when the session is confused —
// which is exactly when this file is needed.
//
// The second: make a stale baton impossible. The moment the content is handed
// over, this hook resets the file to empty and files the old copy under
// CONTEXT-STATE.archive/. Without that step the mechanism eventually does the
// damage it was built to prevent: a session reads "we are on step 123" while the
// repository has long since passed 126, and confidently rebuilds finished work.
//
// The reset happens ONLY on a genuinely new window (startup / clear). After a
// compaction or a resume the same session continues and still owns its handoff —
// wiping it there would throw away the note mid-flight.

import fs from "node:fs";
import path from "node:path";
import {
  isEnabled, readHandoff, isEmptyHandoff, readHeadField, gitFacts,
  handoffPath, ARCHIVE_DIR, HANDOFF_FILE, MARKER,
} from "./context-lib.mjs";

const EMPTY_TEMPLATE = (archived) => `# CONTEXT-STATE.md — the handoff between two context windows

<!-- ${MARKER} v1 -->

**state:** empty
**written_at:** —
**session:** —
**git_head:** —
**git_dirty:** —
**step:** —
**substep:** —
**next_action:** —

---

*(Empty. The previous handoff was delivered to a new session and archived${archived ? ` as \`${ARCHIVE_DIR}/${archived}\`` : ""}.
A baton is handed over once — see the laws in the project documentation. Write this file again as soon
as the window reaches 50%.)*
`;

function archive(cwd, text) {
  try {
    const dir = path.join(cwd, ARCHIVE_DIR);
    fs.mkdirSync(dir, { recursive: true });
    const name = `${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
    fs.writeFileSync(path.join(dir, name), text, "utf-8");
    return name;
  } catch {
    return "";
  }
}

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input = {};
  try { input = JSON.parse(raw || "{}"); } catch { /* поехали с пустым */ }

  const cwd = input.cwd || process.cwd();
  if (!isEnabled(cwd)) process.exit(0);

  const text = readHandoff(cwd);
  if (isEmptyHandoff(text)) process.exit(0);

  // The one comparison that decides how much of the record can be trusted: the
  // repository moved on ⇒ the record is older than the work, and it becomes a
  // lead to verify rather than a position to resume from.
  const recorded = readHeadField(text, "git_head");
  const { head, dirty } = gitFacts(cwd);
  const stale = recorded && recorded !== "—" && head !== "—" && recorded !== head;

  const verdict = stale
    ? `⚠️ THE RECORD IS OLDER THAN THE REPOSITORY. It was written at HEAD ${recorded}; the repository is now at
${head} (${dirty} uncommitted file(s)). The work continued after this note was taken, so treat every line
below as a LEAD, not as your position. Run \`git log --oneline -10\` and re-derive where things actually
stand before touching anything, and say out loud which account you are following.`
    : `The record was written at HEAD ${recorded || "—"} and the repository is still at ${head} (${dirty} uncommitted
file(s)) — they agree. Verify with \`git log --oneline -10\` anyway before continuing: agreement of two
numbers is not proof that the described work was finished.`;

  const fresh = input.source === "startup" || input.source === "clear";
  const archived = fresh ? archive(cwd, text) : "";
  if (fresh) {
    try {
      fs.writeFileSync(handoffPath(cwd), EMPTY_TEMPLATE(archived), "utf-8");
    } catch { /* не смогли обнулить — скажем об этом ниже */ }
  }

  const housekeeping = fresh
    ? `This handoff has now been consumed: ${HANDOFF_FILE} is back to empty${archived ? ` and the original is kept as ${ARCHIVE_DIR}/${archived}` : ""}.
Write it again yourself once the window reaches 50%.`
    : `The same session continues, so ${HANDOFF_FILE} was left as it is. Keep it current.`;

  const context = `## Handoff from the previous context window

${verdict}

${housekeeping}

--- BEGIN RECORDED HANDOFF ---
${text.trim()}
--- END RECORDED HANDOFF ---`;

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context },
  }));
  process.exit(0);
});
