# Versions

## v0.2.0 — Frontend Scaffold + Scoring Engine

**Type:** Minor (new feature — frontend directory with full scoring implementation)

- Initialized `frontend/` directory with pnpm + Vite + React 18 + TypeScript strict
- Added all production dependencies: react-bootstrap, chart.js, react-chartjs-2, zustand
- Added all dev tooling: ESLint (flat config), Vitest, React Testing Library, coverage-v8
- TypeScript config: strict mode, project references (app/node/test), bundler module resolution
- Implemented all 5 scoring formulas as pure typed functions: calculateSpeed, calculateAccuracy, calculateDefense, calculateStrength, calculateEndurance
- Implemented calculateOverall (5-axis average), classifyTier (HIGH/MID/LOW), computeProjectScores, computeAggregateScores
- Named scoring constants in `scoringConstants.ts` — no magic numbers
- Type interfaces: ProjectData, RadarScores, Tier, ProjectScores, AggregateScores
- Zustand project store with localStorage persistence (`ee-project-store`)
- Minimal App shell with react-bootstrap Container
- Vitest config with jsdom, setup file with RTL cleanup, v8 coverage
- 32 unit tests across 7 test files covering all scoring functions with analytical reference values
- CI pipeline now passes all stages: lint, test, build, docker-build

## v0.1.0 — Project Infrastructure

**Type:** Minor (initial scaffolding)

- Project infrastructure scaffolded: CLAUDE.md, README.md with Mermaid diagrams, docs/status.md, docs/versions.md
- .claude/ directory with settings.json (hooks), commands (scaffold, review, pre-commit, validate, phase-status), skills (phase-awareness, validation-protocol)
- Docker configuration: Dockerfile (multi-stage node + nginx), docker-compose.yml, nginx.conf placeholder
- Launcher scripts: run_engineering_effectiveness.sh and .bat with [k]/[q]/[v]/[r] menu
- CI/CD: .github/workflows/ci.yml with lint, test, build, docker stages
- .gitignore configured for Node, Python, Docker, IDE, OS artifacts
- Master plan document referenced at project root (not moved — existing file)
- Original effectiveness.jsx preserved as reference for scoring logic and UI layout
