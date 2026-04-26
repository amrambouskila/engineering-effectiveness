# AGENTS.md - Engineering Effectiveness (Effectiveness Radar)

---

> **MANDATORY WORKFLOW: READ THIS ENTIRE FILE BEFORE EVERY CHANGE.** Every time. No skimming, no assuming prior-session context carries over — it does not.
>
> **Why:** This project spans multiple sessions and months of development. Skipping the re-read produces decisions that contradict the architecture, duplicate existing patterns, break data contracts, or introduce tech debt that compounds.
>
> **The workflow, every time:**
> 1. Read this entire file in full.
> 2. Read the master plan document: `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` (project root).
> 3. Read `docs/status.md` — current state / what was just built.
> 4. Read `docs/versions.md` — recent version history.
> 5. Read the source files you plan to modify — understand existing patterns first.
> 6. Then implement, following the rules and contracts defined here.

---

## 0. Critical Context

**This is a measurement framework, not an opinion tool.** Every score the Effectiveness Radar produces must be mathematically defensible — derived from raw project data through documented formulas with tunable constants. If a score cannot be explained by pointing to an input field, a formula, and a constant, it does not belong.

The radar compresses project delivery history into five composite scores. Each score is derived from raw project-level data — not surveys, not gut feel, not manager opinion. The radar is a function of what actually happened.

**What this project is NOT:**
- Not a project management tool (no task tracking, no sprint boards)
- Not a performance review system (scores are team-level, not individual)
- Not a dashboard framework (it has one purpose: the radar)

**Current phase: Phase 1 — React frontend with Chart.js radar, manual data entry, client-side scoring.**

---

## 1. Project Identity

- **Project:** Engineering Effectiveness (Effectiveness Radar)
- **Purpose:** Measure and visualize team delivery capability across five axes: Speed, Accuracy, Defense, Strength, Endurance
- **Master plan:** `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` (project root)
- **Location:** `engineering-effectiveness/`
- **Existing artifact:** `effectiveness.jsx` — Phase 1 prototype visualization (JSX, pre-TypeScript). Reference for scoring logic and UI layout, but will be rewritten in TypeScript strict.

---

## 2. Phase Constraints

### Phase 1 — Frontend MVP (Current)
**In scope:**
- React 18 + TypeScript strict frontend
- Chart.js radar chart via `react-chartjs-2`
- Manual project data entry (10 fields per project)
- Client-side scoring engine (all 5 axes)
- Tier classification display (HIGH/MID/LOW)
- Score derivation panel showing formulas and inputs
- Project data table with per-project isolation
- react-bootstrap UI
- Zustand for state management
- `localStorage` persistence
- Docker containerization (multi-stage node + nginx)

**Explicitly deferred:**
- Do NOT add backend API, database, or server-side scoring — Phase 2
- Do NOT add Jira/Azure DevOps connectors — Phase 3
- Do NOT add security scanner webhooks — Phase 3
- Do NOT add historical snapshots or trend lines — Phase 4
- Do NOT add team comparison views — Phase 4
- Do NOT add threshold alerts — Phase 4

### Phase 2 — Structured Storage
- FastAPI backend + PostgreSQL
- REST API for CRUD operations
- Server-side scoring engine (Python reimplementation of TS formulas)
- Project entry form connected to API
- SQLAlchemy 2.0 async + Pydantic v2

### Phase 3 — Semi-Automated Ingestion
- Jira/Azure DevOps connectors for dates and phases
- Security scanner webhook integration (SonarQube, Snyk)
- Finance data CSV import pipeline
- Validation UI for auto-populated fields

### Phase 4 — Analytics & Comparison
- Historical score snapshots with trend lines
- Team-vs-team comparison (overlay radars)
- Per-project drill-down radar
- Configurable threshold alerts

### Phase 5 — Full Automation
- Full Jira/ADO pipeline
- Revenue attribution model integration
- Service catalog integration
- Embeddable widget for executive dashboards

---

## 3. Architecture & Code Rules

### Stack
- **React 18+** with **TypeScript strict** (`"strict": true`, no `any`, no implicit any)
- **Vite** as dev/build tool
- **pnpm** as package manager
- **Chart.js** via **react-chartjs-2** for the radar chart
- **react-bootstrap** + Bootstrap 5 for UI components
- **Zustand** for application state (project data, scores, selected project)
- **ESLint** with recommended TypeScript + React configs
- **Vitest** + **React Testing Library** for testing
- **`localStorage`** for data persistence (Phase 1 only)

### Code rules
- **File isolation (OOP rule):** One component, hook, type, or utility per file. No god files.
- **TypeScript strict:** No `any`. No `@ts-ignore` without justification. Full type annotations.
- **`const` by default**, `let` only when reassignment is necessary, never `var`.
- **Prefer `interface` over `type`** for object shapes.
- **No dead code.** No commented-out blocks, no unused imports, no unused functions.
- **No magic numbers.** Scoring constants (multipliers, caps, divisors) are named constants in a dedicated file, not inline literals.
- **Search before writing.** Before creating any new function, component, or hook, grep the codebase for existing ones.
- **Name things precisely.** `calculateSpeedScore` not `calcScore`. `ProjectDataEntryForm` not `Form`.
- **Charts behind components.** Never couple app logic to Chart.js internals. A chart library swap should touch only chart component files.

### State management
- **Zustand** for all application state: project list, selected project, computed scores, UI preferences.
- **React state** only for component-local UI concerns (modal open/closed, form field values).
- **`localStorage`** for persistence — Zustand middleware handles serialization.

### Error handling
- Validate at system boundaries only: form input, localStorage loads.
- Do NOT defensively validate internal function calls between typed modules.
- No bare `catch` clauses. Catch specific types.
- No swallowing errors silently.

---

## 4. Domain Model & Data Contracts

### Project Data (10 input fields)

```typescript
interface ProjectData {
  id: string;                        // crypto.randomUUID()
  name: string;                      // project name
  targetDeliveryDate: string;        // ISO date "YYYY-MM-DD"
  actualDeliveryDate: string;        // ISO date "YYYY-MM-DD"
  expectedRevenue: number;           // USD integer
  actualRevenue: number;             // USD integer
  expectedBreachCost: number;        // USD integer
  vulnerabilities: number;           // integer >= 0
  expectedPhases: number;            // integer >= 1
  actualPhases: number;              // integer >= 1
  intersectingProjects: number;      // integer >= 0
  reusableComponents: number;        // integer >= 0
}
```

### Radar Scores (5 axes)

```typescript
interface RadarScores {
  speed: number;      // 0-100, integer
  accuracy: number;   // 0-100, integer
  defense: number;    // 0-100, integer
  strength: number;   // 0-100, integer
  endurance: number;  // 0-100, integer
}
```

### Tier Classification

```typescript
type Tier = "HIGH" | "MID" | "LOW";

// HIGH: 75-100 — Consistent strength in this axis
// MID:  45-74  — Functional but not reliable
// LOW:  0-44   — Structural weakness, needs intervention
```

### Overall Score

```typescript
// Simple average of all 5 axes (unweighted in Phase 1)
// Phase 4 may introduce weighted averages — keep this as a named function
interface OverallScore {
  value: number;       // 0-100, integer
  tier: Tier;
}
```

### Per-Project Scores (for drill-down)

```typescript
interface ProjectScores {
  projectId: string;
  scores: RadarScores;
  overall: number;
  tier: Tier;
}
```

### Aggregate Scores (team-level)

```typescript
interface AggregateScores {
  scores: RadarScores;        // averaged across all projects
  overall: number;
  tier: Tier;
  projectCount: number;
}
```

**Data contract rule:** These interfaces define the Phase 2 API contract. `ProjectData` maps to the `PROJECT` database table. `RadarScores` maps to the `SCORE_SNAPSHOT` table. Do NOT simplify or rename fields — they match the backend schema by design.

---

## 5. Required Calculations — Scoring Formulas

All five scoring formulas are defined in the master plan. These are the exact implementations. Every constant is a named tunable.

### Constants (all in a single `scoringConstants.ts`)

```typescript
const SPEED_SENSITIVITY_MULTIPLIER = 2.5;
const ACCURACY_REVENUE_WEIGHT = 0.5;
const ACCURACY_PHASE_WEIGHT = 0.5;
const ACCURACY_REVENUE_SENSITIVITY = 200;
const ACCURACY_PHASE_SENSITIVITY = 150;
const DEFENSE_VULN_PENALTY = 18;
const DEFENSE_BREACH_DIVISOR = 500_000;
const DEFENSE_BREACH_PENALTY_FACTOR = 10;
const ENDURANCE_REUSE_CAP = 8;
const ENDURANCE_INTERSECTION_CAP = 5;
const ENDURANCE_REUSE_MAX_POINTS = 50;
const ENDURANCE_INTERSECTION_MAX_POINTS = 50;
const TIER_HIGH_THRESHOLD = 75;
const TIER_MID_THRESHOLD = 45;
```

### Speed

```
plannedDuration = daysBetween(projectStartBaseline, targetDate)
slipDays        = max(0, daysBetween(targetDate, actualDate))
speed           = clamp(100 * (1 - (slipDays / plannedDuration) * SPEED_SENSITIVITY_MULTIPLIER), 0, 100)
```

Note: `projectStartBaseline` is a fixed reference date for planned duration calculation. In the existing `effectiveness.jsx`, this is hardcoded to `2024-06-01`. Phase 2 should make this configurable per project. For Phase 1, use 180 days before `targetDeliveryDate` as a reasonable default planned duration when no explicit start date is available, OR accept a minimum planned duration of 30 days.

### Accuracy

```
revAccuracy   = clamp(100 - |1 - actualRevenue / expectedRevenue| * ACCURACY_REVENUE_SENSITIVITY, 0, 100)
phaseAccuracy = clamp(100 - |actualPhases - expectedPhases| / max(expectedPhases, 1) * ACCURACY_PHASE_SENSITIVITY, 0, 100)
accuracy      = ACCURACY_REVENUE_WEIGHT * revAccuracy + ACCURACY_PHASE_WEIGHT * phaseAccuracy
```

### Defense

```
breachWeight = expectedBreachCost / DEFENSE_BREACH_DIVISOR
rawDefense   = 100 - vulnerabilities * DEFENSE_VULN_PENALTY
defense      = clamp(rawDefense - (vulnerabilities > 0 ? breachWeight * DEFENSE_BREACH_PENALTY_FACTOR : 0), 0, 100)
```

### Strength

```
strength = clamp(actualRevenue / max(expectedRevenue, 1) * 100, 0, 100)
```

### Endurance

```
reuse     = clamp((reusableComponents / ENDURANCE_REUSE_CAP) * ENDURANCE_REUSE_MAX_POINTS, 0, ENDURANCE_REUSE_MAX_POINTS)
cross     = clamp((intersectingProjects / ENDURANCE_INTERSECTION_CAP) * ENDURANCE_INTERSECTION_MAX_POINTS, 0, ENDURANCE_INTERSECTION_MAX_POINTS)
endurance = reuse + cross
```

### Aggregation

```
axisAggregate = round(sum(perProjectScores[axis]) / projectCount)
overall       = round(sum(allAxes) / 5)
```

### Tier Classification

```
tier(score) =
  score >= TIER_HIGH_THRESHOLD ? "HIGH" :
  score >= TIER_MID_THRESHOLD  ? "MID"  :
  "LOW"
```

**Testing requirement:** Every formula above must have at least one test against a known analytical value. The sample data in `effectiveness.jsx` provides reference scores that can be used as test fixtures.

---

## 6. Containerization

### Files in project root:
- `Dockerfile` — Multi-stage: stage 1 (`node:20-alpine`) installs deps + builds Vite prod bundle; stage 2 (`nginx:alpine`) copies `dist/` and serves via `nginx.conf`.
- `docker-compose.yml` — Single service (`engineering-effectiveness`) with port from `${EE_PORT:-5173}`.
- `run_engineering_effectiveness.sh` / `run_engineering_effectiveness.bat` — Launcher scripts with `[k]/[q]/[v]/[r]` menu.

### Phase 1 Docker notes:
- Single container serving static frontend (no backend dependency).
- Phase 2+: `docker-compose.yml` gains backend, PostgreSQL, Redis services with healthchecks and `depends_on`.

---

## 7. CI/CD

**File:** `.gitlab-ci.yml`

**Stages:**
1. **lint** — `pnpm lint`. Fail on errors.
2. **test** — `pnpm test -- --coverage`. Coverage gated at 100% for scoring utilities.
3. **build** — `pnpm build`. Must compile without errors. Gated on test passing.
4. **docker-build** — `docker build` to verify Dockerfile.

**Requirements:**
- All MRs must pass CI before merging.
- Conventional commits for semver bumps.
- Release pipeline triggered manually on `main` with `BUMP` variable.

---

## 8. Environment Configuration

```
VITE_PORT=5173                                    # local dev server
EE_PORT=5173                                      # Docker-exposed port
# VITE_API_BASE_URL=http://localhost:8000/api     # Phase 2 — forward-compat
```

---

## 9. Testing Requirements

- **Framework:** Vitest + React Testing Library
- **Coverage target:** 100% on scoring math (`src/utils/scoring/`). 100% overall target.
- **What must be tested:**
  - All 5 scoring formulas against known analytical values
  - Tier classification at boundary values (44, 45, 74, 75)
  - Aggregation logic (single project, multiple projects, zero projects)
  - Edge cases: zero revenue, zero phases, zero vulnerabilities, early delivery (negative slip)
  - `clamp` behavior at boundaries
  - Project data validation (required fields, type constraints)
- **What does NOT need mocking:** Scoring math. Test against real computations.
- **Reference test data:** The `SAMPLE_PROJECTS` array in `effectiveness.jsx` provides 8 projects with known characteristics. Compute expected scores manually and use as test fixtures.

**Known testing pitfalls:**
- Vitest does NOT auto-cleanup like Jest. `tests/setup.ts` must import `cleanup` from `@testing-library/react` and call it in `afterEach`.
- React Bootstrap Modal renders portal duplicates in jsdom. Use `within(screen.getByRole("dialog"))` to scope queries.

---

## 10. Directory Structure & Key Entrypoints

```
engineering-effectiveness/
├── AGENTS.md                           # This file
├── ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md  # Comprehensive spec (root level)
├── README.md                           # Human-facing overview
├── effectiveness.jsx                   # Original prototype (reference only)
├── docs/
│   ├── status.md                       # Current project state
│   └── versions.md                     # Semver changelog
├── .codex/
│   ├── settings.json                   # Hooks, permissions
│   ├── commands/                       # Slash commands
│   │   ├── scaffold.md
│   │   ├── review.md
│   │   ├── pre-commit.md
│   │   ├── validate.md
│   │   └── phase-status.md
│   └── skills/                         # Proactive protocol skills
│       ├── phase-awareness/SKILL.md
│       └── validation-protocol/SKILL.md
├── frontend/                           # React + TypeScript app (Phase 1)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── .eslintrc.cjs
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/
│       │   └── ui/                     # Reusable UI (panels, controls)
│       ├── features/
│       │   ├── radar/                  # RadarChart component (Chart.js)
│       │   ├── projects/               # Project table, entry form
│       │   └── scores/                 # Score derivation panel
│       ├── hooks/                      # Custom hooks
│       ├── stores/                     # Zustand stores
│       │   └── projectStore.ts         # Project data + scoring state
│       ├── types/                      # TypeScript interfaces
│       │   ├── ProjectData.ts
│       │   ├── RadarScores.ts
│       │   └── Tier.ts
│       └── utils/
│           └── scoring/                # All scoring logic
│               ├── scoringConstants.ts
│               ├── calculateSpeed.ts
│               ├── calculateAccuracy.ts
│               ├── calculateDefense.ts
│               ├── calculateStrength.ts
│               ├── calculateEndurance.ts
│               ├── calculateOverall.ts
│               ├── classifyTier.ts
│               ├── computeProjectScores.ts
│               └── computeAggregateScores.ts
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   └── scoring/                    # One test file per scoring function
│   └── integration/
├── docker-compose.yml
├── run_engineering_effectiveness.sh
├── run_engineering_effectiveness.bat
├── .env
├── .gitignore
├── .gitlab-ci.yml
└── .dockerignore
```

---

## 11. Local Commands

**Without Docker:**
```bash
cd frontend
pnpm install
pnpm dev              # dev server at http://localhost:5173
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm test -- --coverage
pnpm build            # production build
```

**With Docker:**
```bash
docker compose up --build         # build + start
docker compose down               # stop
./run_engineering_effectiveness.sh # full launcher with [k]/[q]/[v]/[r] menu
```

---

## 12. Change Policy

1. **Before writing:** Re-read this file (mandatory).
2. **Code changes:** Update `docs/status.md` and `docs/versions.md`.
3. **Scoring formula changes:** Update this file (Section 5), the master plan, and all affected tests.
4. **Data contract changes:** Require explicit approval. Update this file (Section 4) and the master plan.
5. **New dependencies:** Document in a `docs/dependencies.md` when created.

---

## 13. Versioning

- **Source of truth:** `frontend/package.json` `version` field.
- **Semver rules:** Patch for bug fixes, minor for new features, major for breaking contract changes.
- **Do NOT modify `package.json` version directly** — the release pipeline handles bumps.
- **Document computed next version in `docs/versions.md`.**
- **Only ONE unreleased version at a time.**

---

## 14. Phase 1 Completion Gate

Phase 1 is done when:

**Functional:**
- All 10 project fields can be entered via a form
- Radar chart displays all 5 axes correctly via Chart.js
- Scores computed client-side using documented formulas
- Tier classification (HIGH/MID/LOW) displays with correct color coding
- Score derivation panel shows formulas, inputs, and computed values per axis
- Project table with row selection for per-project isolation
- Aggregate view (all projects) and per-project view work correctly
- Data persists via localStorage

**Infrastructure:**
- Dockerfile builds a valid production image
- `docker-compose.yml` starts the container
- Launcher scripts work (`run_engineering_effectiveness.{sh,bat}`)
- `.gitlab-ci.yml` runs lint, test, build, docker-build
- Tests cover all scoring formulas at 100%
- All `docs/` files current

**Post-Phase 1:** Frontend connects to FastAPI + PostgreSQL backend (Phase 2). `localStorage` replaced with API calls. Scoring engine reimplemented in Python. Data contracts from Section 4 become the API contract.

---

## 15. Phase 2 Integration Strategy

When Phase 2 lands:
1. Create `src/api/` client layer with base URL from `VITE_API_BASE_URL`.
2. Replace Zustand localStorage persistence with API calls.
3. Keep client-side scoring for optimistic UI; server scores are authoritative.
4. `ProjectData` interface becomes the `POST /api/projects` request body.
5. `RadarScores` interface becomes the `GET /api/scores/{teamId}` response shape.
6. Python scoring engine must produce identical results to TS engine for the same inputs.

---

## 16. Output & Completion Expectations

When completing a task, include:
1. **Summary** — What changed and why.
2. **Reuse check** — Confirm you searched for existing components/hooks/utilities before writing new ones.
3. **Tech-debt check** — No shortcuts, no hacks, no duplicated logic, no `any`, no dead code.
4. **File-organization check** — One concept per file.
5. **Data-contract check** — No typed interfaces changed without approval.
6. **Docs check** — List every `docs/` file updated.
7. **Test check** — Tests added or updated for logic changes.
8. **Forward-compatibility check** — Alignment with Phase 2+ requirements.
9. **Git state** — Report changed files. Suggest commit message.

---

## 17. Reminder

**Re-read this file before the next change.** Re-read the master plan if the task involves scoring formulas, data contracts, or architecture. Check `docs/status.md` for current state. This frontend is Phase 1 of a 5-phase system; every decision must be compatible with what comes next.