#!/usr/bin/env node
// Skill parity check (step 162) — guard against per-agent duplication drift.
//
// Capabilities are duplicated by hand-copy into every agent's skill folder (the iron rule of
// self-sufficiency: copies > symlinks on Windows). With no integrity check this drifts silently —
// step 161 hit exactly that: a skill landed in a stray components/.gemini/ instead of the canon,
// and one skill was missing from .gemini. This script asserts the invariant so it can't recur.
//
// INVARIANT: the three CODER skill sets are IDENTICAL —
//   .agents/skills  (canon; codex + kimi + gemini read it directly)
//   .claude/skills · .qwen/skills  (per-agent copies for CLIs that read only their own folder)
// .gemini/skills must stay EMPTY: gemini-cli natively reads .agents/skills and it takes precedence
// over .gemini/skills (docs/platforms/gemini-cli/agent-skills.md), so a copy there is dead weight
// that only produces "Skill conflict detected" warnings at startup (step 182.5).
// Each skill = a folder containing SKILL.md. A skill's sidecar files (e.g. *.mjs) must match too.
// Stray ".gemini" (or other agent) dirs anywhere but the slot root are flagged (never read/shipped).
// The Hermes substrate (../ai-workspace/services/hermes-skills) is a CURATED set, checked as a
// subset-style INFO report, not equality.
//
// Usage:  node scripts/skill-parity-check.mjs        (exit 1 on any mismatch)
// npm:    npm run check:skills

import { readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CODER_DIRS = [".agents", ".claude", ".qwen"];
let failed = false;
const fail = (m) => { failed = true; console.error("  ✗ " + m); };

// A skill folder = a subdir of <agent>/skills that contains SKILL.md. Returns Map<name, sidecars[]>.
function readSkills(agentDir) {
  const base = join(ROOT, agentDir, "skills");
  const out = new Map();
  if (!existsSync(base)) return out;
  for (const name of readdirSync(base)) {
    const dir = join(base, name);
    if (!statSync(dir).isDirectory()) continue;
    const files = readdirSync(dir);
    if (!files.includes("SKILL.md")) continue;
    out.set(name, files.filter((f) => f !== "SKILL.md").sort());
  }
  return out;
}

const sets = Object.fromEntries(CODER_DIRS.map((d) => [d, readSkills(d)]));
const canon = sets[".agents"];

console.log("Skill parity check\n==================");
for (const d of CODER_DIRS) console.log(`  ${d}/skills: ${sets[d].size} skills`);
console.log("");

// 1) Name-set equality against the canon (.agents).
console.log("1) Skill-set equality (vs .agents canon)");
const canonNames = new Set(canon.keys());
for (const d of CODER_DIRS) {
  if (d === ".agents") continue;
  const names = new Set(sets[d].keys());
  const missing = [...canonNames].filter((n) => !names.has(n));
  const extra = [...names].filter((n) => !canonNames.has(n));
  if (missing.length) fail(`${d}/skills MISSING: ${missing.join(", ")}`);
  if (extra.length) fail(`${d}/skills has EXTRA (not in canon): ${extra.join(", ")}`);
}
// Canon must also not be short of any name another dir has (covers a skill absent from .agents).
for (const d of CODER_DIRS) {
  for (const n of sets[d].keys()) {
    if (!canonNames.has(n)) fail(`'${n}' present in ${d} but absent from .agents canon`);
  }
}
if (!failed) console.log("  ✓ all three coder skill sets identical");

// 1b) .gemini/skills must hold no skill copies — gemini reads the .agents canon natively;
// a copy here only triggers startup "Skill conflict detected" warnings (step 182.5).
const geminiCopies = readSkills(".gemini");
if (geminiCopies.size) fail(`.gemini/skills has ${geminiCopies.size} skill copies (gemini reads .agents natively — delete them): ${[...geminiCopies.keys()].join(", ")}`);
else console.log("  ✓ .gemini/skills empty (gemini reads .agents canon natively)");

// 2) Sidecar (e.g. .mjs) parity per skill across dirs that have the skill.
console.log("\n2) Sidecar-file parity per skill");
let sidecarBad = false;
for (const name of canonNames) {
  const present = CODER_DIRS.filter((d) => sets[d].has(name));
  const ref = sets[present[0]].get(name).join(",");
  for (const d of present) {
    const got = sets[d].get(name).join(",");
    if (got !== ref) { fail(`'${name}' sidecar mismatch: ${present[0]}=[${ref}] vs ${d}=[${got}]`); sidecarBad = true; }
  }
}
if (!sidecarBad) console.log("  ✓ sidecar files consistent across copies");

// 3) Stray agent-config dirs (the components/.gemini trap) — anything but the slot-root agent dirs.
console.log("\n3) Stray agent dirs (must live only at slot root)");
const STRAY = ["components/.gemini", "components/.claude", "components/.qwen", "components/.codex", "components/.kimi"];
let stray = false;
for (const s of STRAY) {
  if (existsSync(join(ROOT, s))) { fail(`stray agent dir exists: ${s} (never read at cwd=slot root, never shipped → delete)`); stray = true; }
}
if (!stray) console.log("  ✓ no stray agent dirs");

// 4) Hermes substrate — INFO only (curated set in the sibling ai-workspace repo, not equality).
console.log("\n4) Hermes substrate (info — curated set, not equality)");
const HERMES = resolve(ROOT, "..", "ai-workspace", "services", "hermes-skills");
if (existsSync(HERMES)) {
  const h = new Set(readdirSync(HERMES).filter((n) => existsSync(join(HERMES, n, "SKILL.md"))));
  const canonOnly = [...canonNames].filter((n) => !h.has(n));
  console.log(`  hermes-skills: ${h.size} skills. Coder-canon skills NOT in Hermes (expected — curated): ${canonOnly.join(", ") || "none"}`);
} else {
  console.log("  (sibling ai-workspace not found — skipped)");
}

console.log("\n" + (failed ? "RESULT: FAIL — fix the drift above." : "RESULT: PASS — skill parity holds."));
process.exit(failed ? 1 : 0);
