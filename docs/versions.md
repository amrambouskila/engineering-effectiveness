# Versions

## v0.2.2 — Security Documentation

### `docker-build` CI job fixed -- unresolvable Trivy action ref (2026-08-27)

- **`aquasecurity/trivy-action@0.28.0` -> `@v0.36.0` in `.github/workflows/ci.yml`.** The
  `docker-build` job had failed on every run since 2026-08-23 with
  `Unable to resolve action aquasecurity/trivy-action@0.28.0, unable to find version 0.28.0`,
  dying at "Set up job" in ~2s -- before buildx, the image build, or the scan ever ran. The ref is
  not a typo: Aqua **deleted every unprefixed tag** when migrating the repo to a `v` prefix as part
  of their response to the trivy-action supply-chain attack, keeping only `0.35.0` as a
  compatibility shim. `refs/tags/0.28.0` now 404s; `refs/tags/v0.36.0` resolves.
- **Why v0.36.0 rather than v0.28.0.** v0.28.0 pins Trivy v0.56.1, whose only vulnerability-DB
  source is `ghcr.io/aquasecurity/trivy-db` -- the endpoint behind the well-documented
  `TOOMANYREQUESTS` CI failures. v0.36.0 ships Trivy v0.70.0, which defaults to a priority list
  (`mirror.gcr.io/aquasec/trivy-db:2`, then GHCR); the verification runs below pulled from the GCR
  mirror. Re-pinning to `v0.28.0` would have been the smaller diff and the worse choice.
- **Nothing else needed to change.** All four inputs (`image-ref`, `severity`, `exit-code`,
  `ignore-unfixed`) remain current and non-deprecated at v0.36.0, so the `with:` block is untouched.
  No `permissions:` block is required: the repo default is `read`, the composite action's only token
  consumer (`setup-trivy`) checks out the public `aquasecurity/trivy` repo, and `actions/cache`
  authenticates via `ACTIONS_RUNTIME_TOKEN` rather than `GITHUB_TOKEN`.
- **Verified, not assumed.** Built from a pristine `git archive HEAD` export, which -- unlike the
  working tree -- has no `frontend/node_modules`, matching the CI checkout. The image builds through
  both the plain builder and the buildx `docker-container` driver with `--load` (the exact path
  `docker/build-push-action@v6` takes), including a `--no-cache --pull` cold build matching the cold
  GHA cache the first corrected run will have. Trivy **v0.70.0**, the exact version the action
  installs, reports **0 vulnerabilities** at `HIGH,CRITICAL` with `--ignore-unfixed --exit-code 1`,
  exit 0, on all three images.
  The same scan of the `nginx:alpine` base reports **2 HIGH** (`CVE-2026-14456`), which confirms the
  `apk upgrade --no-cache` layer is what clears them -- now measured on the shipped image rather than
  only on the base. The container serves `/` with HTTP 200. Every `uses:` ref in `ci.yml` was
  re-resolved against the GitHub API; all nine resolve.
- **Point-in-time caveat.** Alpine advisories change daily, so `exit-code: 1` can turn `docker-build`
  red in a future run with no repo change. That is the cost of the gate, not a defect.

**Semver reasoning:** Patch. A CI configuration fix plus its documentation. No application code,
dependency, host port, API or data contract, and no test changed.


### Base-image security patch for the alpine runtime stage (2026-08-26)

- **`RUN apk upgrade --no-cache` added to `Dockerfile`.** The `nginx:alpine` base currently ships
  `libcrypto3`/`libssl3` 3.5.7-r0, which Trivy flags HIGH (`CVE-2026-14456`, an OpenSSL QUIC-server
  DoS, fixed in 3.5.8-r0). The packages come from the base layer, so nothing in the Dockerfile
  installs them and nothing below can remediate them -- the upgrade has to happen at build time.
  Measured directly against the base image: **2 HIGH before the layer, 0 after**.
- **Why this needed a change at all.** `nginx:alpine` measured clean during the 2026-08-24
  base-image sweep. The advisory landed afterwards. A base image being clean is a point-in-time
  observation, not a property, which is precisely why the patch layer belongs in the Dockerfile
  rather than being skipped on the strength of a past scan. This is the alpine counterpart to the
  `apt-get upgrade` layer the Debian bases already carry.
- **Not gated by CI at the time** -- and the stated reason was wrong. This entry claimed the
  pipeline had no `trivy image` step; in fact one had been added on 2026-08-23, but its action ref
  did not resolve, so it had never executed and nothing was gating. Corrected in the 2026-08-27
  entry above, where the layer is measured against the built image.

**Semver reasoning:** Patch. A build-time base-image security patch. No application code,
dependency, host port, API or data contract, and no test changed.


### CI hardening + dependency remediation (2026-08-24)

- **Semgrep invocation corrected.** The job used `semgrep ci` with `--severity` and `--error`, which that subcommand does not accept — it exits 2 with a usage error before scanning. Switched to `semgrep scan`, which supports both.
- **Release workflow hardened against script injection.** `${{ inputs.bump }}` and `${{ steps.bump.outputs.new_version }}` were interpolated directly into `run:` blocks, where the value becomes shell code. Both now pass through `env:` and are read as quoted shell variables. The input is `type: choice`, so this was not exploitable today — it is the pattern that breaks the moment the input type changes.
- **Security headers now actually delivered.** nginx inherits `add_header` from an enclosing level only when the current level declares none of its own, and the cache-control `location` blocks declared their own — silently dropping CSP, `nosniff`, `X-Frame-Options` and `Referrer-Policy` there. Because the SPA resolves through `try_files ... /index.html`, the document itself was served with **zero** security headers. Verified by serving the config in `nginx:alpine` and curling `/`: 0 headers before, 4 after. They are now repeated in each affected block, with a comment explaining why the duplication must stay.
- **Dockerfile `missing-user` suppressed with written justification**, per global CLAUDE.md section 9 (non-root is not required for personal local-dev containers). The nginx images additionally cannot run as non-root without the unprivileged image and a port change. Revisit before any deployment beyond localhost.
- **Dependency remediation.** 25 bounded overrides in `frontend/package.json`; audit clean, build and the 43-test suite pass.
- **vitest pair realigned** `^2.1.9 -> ^3.2.6` (with `@vitest/coverage-v8`), redundant override dropped. The 100% coverage threshold on `src/utils/scoring/**` was re-verified under vitest 3 and still enforces.

**On the override bounding.** `pnpm audit --fix` emits one override per advisory with an open-ended target, which lets the resolver jump majors — `>=3.2.6` pulled vitest 4.1.11 and broke its `@vitest/coverage-v8` peer. Each target is therefore capped at its own compatibility line (next major, or next minor for 0.x where semver treats the minor as breaking). The advisory-derived keys are kept verbatim rather than merged: esbuild had two disjoint ranges (`<=0.24.2` and `0.27.3-0.28.0`), and collapsing them to the highest target forced 0.28.2, which cannot lower destructuring to the configured browser targets.


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
