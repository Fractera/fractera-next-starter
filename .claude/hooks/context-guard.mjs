// Context guard — measures how full the window is and demands the handoff.
//
// Runs on every tool call (PostToolUse), which is the natural clock of a working
// session: no timer to install, and the check costs one tail read of a file.
//
// WHY THE THRESHOLDS ARE LOW (50 / 65 / 75, owner 2026-08-10). The demand has to
// arrive while there is still room to obey it. At 90% a model has no space left
// to close a step cleanly, and the "write the handoff" instruction competes with
// the work itself. Fifty percent feels early — that is the point.
//
// Each band fires ONCE per session. A message repeated on every tool call stops
// being read by the third time, and it would burn the very context it is trying
// to protect.
//
// The message goes to stderr with exit code 2, which is how a PostToolUse hook
// speaks TO the model rather than to the log. That is the whole mechanism: a
// hook cannot force anything, it can only put a sentence where the model cannot
// miss it.

import fs from "node:fs";
import path from "node:path";
import {
  isEnabled, contextPercent, gitFacts, readHandoff, isEmptyHandoff, HANDOFF_FILE,
} from "./context-lib.mjs";

const BANDS = [
  {
    at: 50,
    text: (pct) => `CONTEXT ${pct}% — HALF THE WINDOW IS GONE.
Write ${HANDOFF_FILE} NOW, in this turn: what you are doing, where it stands, and the very next
physical action. Then tell the architect plainly that the window is half spent and ask which sub-step
to close. Writing it later is exactly the plan that fails, because the ending gives no warning.`,
  },
  {
    at: 65,
    text: (pct) => `CONTEXT ${pct}% — CLOSE, DO NOT OPEN.
Finish the sub-step in your hands and start nothing new. Refresh ${HANDOFF_FILE} so its "next action"
line matches reality right now. Tell the architect the step has to end in this window.`,
  },
  {
    at: 75,
    text: (pct) => `CONTEXT ${pct}% — STOP TAKING WORK.
From here: close what is open, refresh ${HANDOFF_FILE}, and REQUIRE the architect to end the step or
sub-step. Do not begin a new file, a new investigation or a new build. Everything not written into the
handoff by now will be lost when this window ends, and it can end without notice.`,
  },
];

function statePath(cwd) {
  return path.join(cwd, ".claude", ".context-guard.json");
}

function readBand(cwd, session) {
  try {
    const s = JSON.parse(fs.readFileSync(statePath(cwd), "utf-8"));
    return s.session === session ? Number(s.band ?? 0) : 0;
  } catch {
    return 0;
  }
}

function writeBand(cwd, session, band) {
  try {
    fs.mkdirSync(path.dirname(statePath(cwd)), { recursive: true });
    fs.writeFileSync(statePath(cwd), JSON.stringify({ session, band }), "utf-8");
  } catch { /* не смогли запомнить — хуже только повтор сообщения */ }
}

// A compaction is the last moment this session exists in full. If nothing was
// handed over by now, leave at least the facts a script CAN know: where the
// repository stood and when. Prose is the model's job; coordinates are ours.
function recordCompaction(cwd, trigger) {
  const file = path.join(cwd, HANDOFF_FILE);
  const text = readHandoff(cwd);
  if (!isEmptyHandoff(text)) return;
  const { head, dirty } = gitFacts(cwd);
  const stamp = new Date().toISOString();
  const note = `
> ⚠️ A ${trigger} compaction happened at ${stamp} with no handoff written.
> Repository at that moment: HEAD ${head}, ${dirty} uncommitted file(s).
> Nothing else was recorded — treat the commits as the only account of where the work stands.
`;
  try {
    fs.appendFileSync(file, note, "utf-8");
  } catch { /* файла нет — механизм не установлен в этом проекте */ }
}

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let input = {};
  try { input = JSON.parse(raw || "{}"); } catch { /* поехали с пустым */ }

  const cwd = input.cwd || process.cwd();
  if (!isEnabled(cwd)) process.exit(0);

  if (input.hook_event_name === "PreCompact") {
    recordCompaction(cwd, input.trigger === "manual" ? "manual" : "automatic");
    process.exit(0);
  }

  const pct = contextPercent(input.transcript_path);
  if (pct === null) process.exit(0);

  const session = String(input.session_id ?? "");
  const seen = readBand(cwd, session);
  const band = BANDS.filter((b) => pct >= b.at).pop();
  if (!band || band.at <= seen) process.exit(0);

  writeBand(cwd, session, band.at);

  const empty = isEmptyHandoff(readHandoff(cwd));
  const tail = empty
    ? `\n${HANDOFF_FILE} is still empty — nothing would survive this window ending.`
    : `\n${HANDOFF_FILE} already holds a handoff — make sure it still describes THIS moment.`;

  process.stderr.write(band.text(pct) + tail + "\n");
  process.exit(2);
});
