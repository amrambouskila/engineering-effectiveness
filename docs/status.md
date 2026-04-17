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

### Architectural Decisions
- Zustand chosen over React Context for state — better devtools, middleware for localStorage, simpler API
- Chart.js radar via react-chartjs-2 chosen over custom SVG — standardized, maintained, easier to theme
- Scoring constants extracted to dedicated file for Phase 2 parity (Python reimplementation must use identical values)
- All scoring math in pure functions under `src/utils/scoring/` — no side effects, easily testable, easily portable to Python
- GitHub Actions CI (not GitLab) — project uses `.github/workflows/ci.yml`
