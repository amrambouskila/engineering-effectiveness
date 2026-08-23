# Status

## Current Phase: 1 — Frontend MVP

### What Exists
- `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` — comprehensive spec with scoring formulas, data dictionary, Mermaid diagrams, phased delivery plan (31KB)
- `effectiveness.jsx` — React JSX prototype with SVG radar chart, scoring engine, project table, score derivation panel, 8 sample projects (15KB)
- Project infrastructure scaffolded: CLAUDE.md, README.md, docs/, .claude/ hooks/commands/skills, Docker, launchers, .gitignore, CI workflows
- `frontend/` directory initialized: pnpm + Vite + React 18 + TypeScript strict + Chart.js + react-bootstrap + Zustand
- All 5 scoring formulas implemented as pure functions in `src/utils/scoring/`
- Type interfaces defined: ProjectData, RadarScores, Tier, ProjectScores, AggregateScores
- Zustand project store with localStorage persistence
- Vitest + React Testing Library configured with 32 passing tests across all scoring functions
- ESLint configured with TypeScript + React hooks plugins
- CI pipeline verified: lint passes, tests pass, build compiles, Docker image builds

### What's Next
- Port radar chart from `effectiveness.jsx` to Chart.js via react-chartjs-2
- Build project data entry form with react-bootstrap
- Build project data table with row selection for per-project isolation
- Implement score derivation panel showing formulas, inputs, and computed values
- Implement tier classification display with color coding
- Wire scoring engine to radar chart and UI components
- Add aggregate view (all projects averaged)

### Security
- Security requirements are documented (CLAUDE.md Section 9a `<security>`, master plan Security section, per-phase gate lines) **and wired**:
  - `sast` job in `.github/workflows/ci.yml` (`needs: lint`; `test` carries `needs: sast`): CodeQL `javascript-typescript`, `pipx run semgrep scan` with SARIF upload + fail-on-findings, `gitleaks/gitleaks-action@v2`, `pnpm audit --audit-level=high`
  - Trivy (`aquasecurity/trivy-action@0.28.0`, `HIGH,CRITICAL`, `exit-code: 1`) against `engineering-effectiveness:ci` in `docker-build`, which now builds with `load: true`
  - `eslint-plugin-security` + `eslint-plugin-no-unsanitized` in `frontend/eslint.config.js` (0 errors); `pnpm sast` script in `frontend/package.json`
  - CSP in `nginx.conf` (`frame-ancestors 'self'`, matching the existing `X-Frame-Options: SAMEORIGIN`; the Phase 5 embed allowlist replaces it later), alongside the existing `nosniff` / `Referrer-Policy` headers
- Still pending:
  - `.semgrep/` repo rules directory
  - The `ProjectData` type guard on zustand `persist` rehydration and form-boundary validation when the entry form lands
  - Phase 2: ruff select gains `S`; `pip-audit` joins `sast`; CodeQL/Semgrep add Python

### Architectural Decisions
- Zustand chosen over React Context for state — better devtools, middleware for localStorage, simpler API
- Chart.js radar via react-chartjs-2 chosen over custom SVG — standardized, maintained, easier to theme
- Scoring constants extracted to dedicated file for Phase 2 parity (Python reimplementation must use identical values)
- All scoring math in pure functions under `src/utils/scoring/` — no side effects, easily testable, easily portable to Python
- GitHub Actions CI (not GitLab) — project uses `.github/workflows/ci.yml`
