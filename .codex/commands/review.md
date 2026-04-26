---
name: review
description: Review changed code against project standards
---

# Code Review Command

Before anything else:
1. Re-read `AGENTS.md` in full.
2. Read `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` for scoring formulas and data contracts.
3. Read `docs/status.md` for current state.

## Review Process

1. **Run `git diff`** to identify all changed files.

2. **Read every changed file in full** — not just the diff hunks.

3. **Produce a checklist-style report** with the following categories:

### Scoring Accuracy (Critical)
- [ ] All scoring formulas match AGENTS.md Section 5 exactly
- [ ] All constants come from `scoringConstants.ts` (no magic numbers)
- [ ] `clamp` applied correctly at boundaries
- [ ] Division-by-zero protected (`max(denominator, 1)`)
- [ ] Integer rounding applied where specified

### Type Safety (Critical)
- [ ] No `any` or `@ts-ignore`
- [ ] All function signatures fully typed
- [ ] Interfaces match AGENTS.md Section 4 data contracts
- [ ] No implicit type coercion

### Code Quality (Should-Fix)
- [ ] One concept per file
- [ ] No dead code, unused imports, commented-out blocks
- [ ] No duplicated logic (search for existing utilities first)
- [ ] Names are precise and domain-specific
- [ ] No magic numbers or magic strings

### Testing (Should-Fix)
- [ ] New scoring logic has corresponding tests
- [ ] Tests use known analytical values (not tautological)
- [ ] Boundary values tested (0, 44, 45, 74, 75, 100)
- [ ] Edge cases covered (zero inputs, negative slip, etc.)

### Documentation (Minor)
- [ ] `docs/status.md` updated
- [ ] `docs/versions.md` updated with computed next version
- [ ] Comments only where WHY is non-obvious

### Forward Compatibility (Critical)
- [ ] Data contracts unchanged (or change approved)
- [ ] No Phase 2+ features introduced
- [ ] Scoring functions remain pure (no side effects, portable to Python)

4. **Report format:** File:line references with severity (critical / should-fix / minor).

5. **Do NOT fix anything automatically.** Report only. The user decides what to act on.