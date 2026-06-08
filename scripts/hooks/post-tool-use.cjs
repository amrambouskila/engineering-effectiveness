const { emit, getToolFilePath, readHookPayload, toPosixPath } = require("./hookUtils.cjs");

const RULES = [
  {
    test: (p) => p.includes("/scoring/"),
    context:
      "SCORING LOGIC EDITED. Verify: (1) all constants come from scoringConstants.ts (no magic numbers), (2) formula matches CLAUDE.md Section 5 exactly, (3) clamp applied correctly (0–100 range), (4) corresponding test updated in tests/unit/scoring/, (5) pure function — no side effects, no state access.",
  },
  {
    test: (p) => p.includes("/types/"),
    context:
      "TYPE DEFINITION EDITED. Data contract change detected. Verify: (1) change approved per CLAUDE.md Section 4, (2) master plan updated if interface shape changed, (3) all consumers updated to match.",
  },
  {
    test: (p) => p.includes("/stores/"),
    context:
      "STORE EDITED. Verify: (1) localStorage persistence still works, (2) no derived state stored — compute from source data, (3) Zustand middleware chain intact.",
  },
];

async function main() {
  const payload = await readHookPayload();
  const f = toPosixPath(getToolFilePath(payload));
  if (!f) return;
  const m = RULES.find((r) => r.test(f));
  if (m) emit({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: m.context } });
}

main().catch((e) => {
  process.stderr.write(`[hook] post-tool-use failed: ${e.message}\n`);
  process.exitCode = 0;
});
