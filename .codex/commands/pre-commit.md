---
name: pre-commit
description: Read-only audit before committing — reports READY or NOT READY
---

# Pre-Commit Audit

Before anything else:
1. Re-read `AGENTS.md` in full.
2. Read `docs/status.md` and `docs/versions.md`.

**This command NEVER stages or commits anything.** It only reports. The user runs git commands.

## Audit Steps (sequential)

### 1. Lint Check
- Run `cd frontend && pnpm lint` (or check if linting passes)
- Report: PASS / FAIL with details

### 2. Test Check
- Run `cd frontend && pnpm test -- --coverage`
- Report: PASS / FAIL
- Report coverage percentage for `src/utils/scoring/`
- Flag if below 100% threshold

### 3. Type Check
- Run `cd frontend && pnpm tsc --noEmit`
- Report: PASS / FAIL with error details

### 4. Build Check
- Run `cd frontend && pnpm build`
- Report: PASS / FAIL

### 5. Code Review (abbreviated)
- Check for `any` types
- Check for magic numbers in scoring logic
- Check for unused imports
- Check for dead code
- Report findings

### 6. Scoring Formula Validation
- Verify all 5 formulas in `src/utils/scoring/` match AGENTS.md Section 5
- Verify all constants match `scoringConstants.ts`
- Report any discrepancies

### 7. Data Contract Integrity
- Verify interfaces in `src/types/` match AGENTS.md Section 4
- Report any drift

### 8. Documentation Check
- Verify `docs/status.md` reflects current state
- Verify `docs/versions.md` has entry for this work
- Report if outdated

## Verdict Table

| Check | Status |
|-------|--------|
| Lint | PASS/FAIL |
| Tests | PASS/FAIL |
| Types | PASS/FAIL |
| Build | PASS/FAIL |
| Code Review | PASS/WARN/FAIL |
| Scoring Formulas | PASS/FAIL |
| Data Contracts | PASS/FAIL |
| Documentation | PASS/WARN |

**Final verdict: READY TO COMMIT / NOT READY**

If NOT READY, list the specific blockers.