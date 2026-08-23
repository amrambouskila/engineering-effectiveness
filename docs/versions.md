# Versions

## v0.2.2 — Security Documentation

**Type:** Patch (documentation, CI, and lint/static-serving configuration — no application runtime behavior change)

- Added `<security>` section (9a) to CLAUDE.md/AGENTS.md: mandatory `sast` CI stage between `lint` and `test` (Semgrep + CodeQL + `pnpm audit` + gitleaks; Trivy in `docker-build`), input-boundary inventory with injection classes and required defenses, Phase 2 ruff `S` rules, local SAST parity commands, Security check added to the self-audit
- Master plan: Security section with `lint → sast → test → build → docker-build` Mermaid diagram and tool matrix; SAST gate line + injection-safety gate line added to every phase's gate criteria
- CLAUDE.md/AGENTS.md CI section and Phase 1 completion gate now list `sast` and the SAST/injection-safety gate items
- Corrected CI provider references from `.gitlab-ci.yml` / GitLab CI to `.github/workflows/ci.yml` / GitHub Actions in CLAUDE.md, AGENTS.md, README.md, and `.codex/commands/phase-status.md`
- `.codex/commands/pre-commit.md`: SAST audit step (Semgrep, gitleaks, `pnpm audit`, boundary-inventory check) and SAST verdict-table row
- `.codex/commands/phase-status.md`: pipeline row lists all five stages; SAST gate and injection-safety gate rows added to the Phase 1 table
- `docs/status.md`: Security section, rewritten into Wired / Pending once the wiring landed

### Security wiring (same patch)

- `.github/workflows/ci.yml`: new `sast` job (`needs: lint`, `permissions: security-events: write`) running CodeQL `javascript-typescript`, `pipx run semgrep scan --config auto --config p/owasp-top-ten --config p/typescript --config p/react --config p/docker --severity ERROR --error` with SARIF upload plus a fail-on-findings step, `gitleaks/gitleaks-action@v2`, and `pnpm audit --audit-level=high`. `test` now carries `needs: sast`. `docker-build` builds with `load: true` as `engineering-effectiveness:ci` and runs `aquasecurity/trivy-action@0.28.0` (`HIGH,CRITICAL`, `exit-code: 1`, `ignore-unfixed: true`)
- `frontend/eslint.config.js`: added `eslint-plugin-security` + `eslint-plugin-no-unsanitized` (recommended configs); `pnpm lint` reports 0 errors
- `nginx.conf`: added `Content-Security-Policy` (`script-src 'self'`; `style-src 'self' 'unsafe-inline'` for react-bootstrap/Chart.js inline style attributes; `frame-ancestors 'self'` to match the existing `X-Frame-Options: SAMEORIGIN` until the Phase 5 embed allowlist lands), keeping the existing `nosniff` / `Referrer-Policy` / `X-XSS-Protection` headers
  - **Correction (same version): the headers above were dropped on static assets.** nginx inherits `add_header` only when the current level declares none of its own, and the static-asset regex location declares its own `add_header Cache-Control`, which removed all four security headers from those responses. They are now repeated inside that block. `nginx -t` passes on the repaired config.
- `frontend/package.json`: added a `sast` script for local parity
- Pending: `.semgrep/` rules; `ProjectData` rehydration type guard.

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
