---
name: scaffold
description: Scaffold a new module or component directory with correct structure
---

# Scaffold Command

Before anything else:
1. Re-read `AGENTS.md` in full.
2. Re-read `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md`.
3. Read `docs/status.md` for current state.
4. Confirm the scope of what's being scaffolded.

## Steps

1. **Identify what's being scaffolded** — a new feature module, a new utility, a new component directory, or a new test suite.

2. **Check existing structure** — grep the codebase to ensure this module/component doesn't already exist under a different name.

3. **Create the directory structure** following the project conventions:
   - One file per concept (component, hook, type, utility)
   - TypeScript strict — every file has proper type annotations
   - No logic during scaffolding — signatures, type annotations, and docstrings only
   - Export barrel files (`index.ts`) for directory-level public APIs

4. **For scoring utilities** — follow the pattern in `src/utils/scoring/`:
   - Named constants in `scoringConstants.ts`
   - Pure functions with explicit input/output types
   - Corresponding test file in `tests/unit/scoring/`

5. **For components** — follow the pattern:
   - Component in `src/components/` or `src/features/`
   - Props interface in the same file (tightly coupled)
   - Shared types in `src/types/`

6. **Report** the full file tree created and wait for review.

Do NOT implement logic during scaffolding. Stubs with correct signatures and types only.