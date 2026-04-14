# Effectiveness Radar

A measurement framework for ranking team delivery capability across five axes: **Speed**, **Accuracy**, **Defense**, **Strength**, and **Endurance**.

---

## What This Is

The Effectiveness Radar compresses project delivery history into five composite scores derived from raw project-level data — not surveys, not gut feel, not manager opinion. Each project provides exactly 10 input fields; the scoring engine transforms them into a radar chart that shows team capability at a glance.

```mermaid
graph TD
    subgraph "Raw Project Data (10 Fields)"
        TD["Target Delivery Date"]
        AD["Actual Delivery Date"]
        ER["Expected Revenue"]
        AR["Actual Revenue"]
        BC["Expected Breach Cost"]
        SV["Vulnerabilities"]
        EP["Expected Phases"]
        AP["Actual Phases"]
        IP["Intersecting Projects"]
        RC["Reusable Components"]
    end

    subgraph "Scoring Engine"
        SE["5 Formulas + Tunable Constants"]
    end

    subgraph "Five Axes"
        SPD["Speed"]
        ACC["Accuracy"]
        DEF["Defense"]
        STR["Strength"]
        END["Endurance"]
    end

    TD --> SE
    AD --> SE
    ER --> SE
    AR --> SE
    BC --> SE
    SV --> SE
    EP --> SE
    AP --> SE
    IP --> SE
    RC --> SE

    SE --> SPD
    SE --> ACC
    SE --> DEF
    SE --> STR
    SE --> END
```

---

## The Five Axes

| Axis | What It Measures | Inputs |
|------|-----------------|--------|
| **Speed** | Delivery punctuality relative to committed timelines | Target date, actual date |
| **Accuracy** | How closely the outcome matched the plan (financial + scope) | Expected/actual revenue, expected/actual phases |
| **Defense** | Security posture weighted by breach risk | Breach cost, vulnerabilities |
| **Strength** | Raw value delivered vs. promised | Expected/actual revenue |
| **Endurance** | Compound effect on future deliveries | Intersecting projects, reusable components |

### Tier Classification

| Tier | Range | Meaning |
|------|-------|---------|
| HIGH | 75-100 | Consistent strength |
| MID | 45-74 | Functional but not reliable |
| LOW | 0-44 | Structural weakness |

---

## Architecture

```mermaid
graph LR
    subgraph "Phase 1 (Current)"
        UI["React + TypeScript"]
        CHART["Chart.js Radar"]
        STORE["Zustand Store"]
        LS["localStorage"]
        SCORE["Scoring Engine (TS)"]

        UI --> CHART
        UI --> STORE
        STORE --> LS
        STORE --> SCORE
        SCORE --> CHART
    end

    subgraph "Phase 2"
        API["FastAPI Backend"]
        DB["PostgreSQL"]
        PY["Scoring Engine (Python)"]

        API --> DB
        API --> PY
    end

    subgraph "Phase 3+"
        JIRA["Jira / ADO"]
        SEC["Security Scanners"]
        FIN["Finance / BI"]

        JIRA --> API
        SEC --> API
        FIN --> API
    end

    UI -.->|"Phase 2"| API
```

---

## Data Flow

```mermaid
flowchart TD
    INPUT["Manual Project Entry (10 fields)"] --> VALIDATE["Input Validation"]
    VALIDATE --> STORE["Zustand Store"]
    STORE --> PERSIST["localStorage"]
    STORE --> COMPUTE["Scoring Engine"]
    COMPUTE --> PER["Per-Project Scores"]
    COMPUTE --> AGG["Aggregate Scores"]
    PER --> RADAR["Radar Chart (Chart.js)"]
    AGG --> RADAR
    PER --> TABLE["Score Derivation Panel"]
    AGG --> TABLE
    PER --> TIER["Tier Classification"]
    AGG --> TIER
```

---

## Phased Delivery

```mermaid
gantt
    title Effectiveness Radar — Delivery Phases
    dateFormat YYYY-MM-DD
    axisFormat %b %Y

    section Phase 1 — Frontend MVP
    React + TS + Chart.js radar          :p1a, 2026-05-01, 21d
    Manual data entry + scoring engine   :p1b, after p1a, 14d
    Docker + CI/CD                       :p1c, after p1b, 7d

    section Phase 2 — Backend
    FastAPI + PostgreSQL                 :p2a, after p1c, 14d
    REST API + server scoring            :p2b, after p2a, 14d
    Connect frontend to API              :p2c, after p2b, 7d

    section Phase 3 — Integrations
    Jira/ADO connector                   :p3a, after p2c, 14d
    Security scanner webhooks            :p3b, after p2c, 10d
    Finance CSV import                   :p3c, after p2c, 7d

    section Phase 4 — Analytics
    Historical snapshots + trends        :p4a, after p3a, 10d
    Team comparison views                :p4b, after p4a, 10d
    Threshold alerts                     :p4c, after p4b, 7d

    section Phase 5 — Full Automation
    Full pipeline automation             :p5a, after p4c, 21d
    Embeddable widget                    :p5b, after p5a, 10d
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript strict + Vite |
| UI Framework | react-bootstrap + Bootstrap 5 |
| Charting | Chart.js via react-chartjs-2 |
| State | Zustand |
| Testing | Vitest + React Testing Library |
| Package Manager | pnpm |
| Container | Docker (multi-stage node + nginx) |
| CI/CD | GitLab CI |
| Backend (Phase 2) | FastAPI + SQLAlchemy + Pydantic |
| Database (Phase 2) | PostgreSQL 16 |

---

## Quick Start

### With Docker
```bash
./run_engineering_effectiveness.sh    # macOS/Linux
run_engineering_effectiveness.bat     # Windows
# Opens http://localhost:5173
# Interactive menu: [k] stop, [q] stop+cleanup, [v] full cleanup, [r] restart
```

### Without Docker
```bash
cd frontend
pnpm install
pnpm dev
# http://localhost:5173
```

---

## Scoring Formulas

All scores are 0-100 integers with tunable constants.

- **Speed:** `clamp(100 * (1 - (slipDays / plannedDuration) * 2.5))` — 40% slip zeroes out the score
- **Accuracy:** `0.5 * revAccuracy + 0.5 * phaseAccuracy` — revenue and scope discipline weighted equally
- **Defense:** `100 - vulns * 18 - breachWeight * 10` — breach cost amplifies vulnerability penalty
- **Strength:** `clamp(actualRevenue / expectedRevenue * 100)` — linear value delivery
- **Endurance:** `(reuse/8 * 50) + (intersections/5 * 50)` — reuse + cross-pollination

See `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` for full formula details, constants, and calibration guidance.

---

## Project Structure

```
engineering-effectiveness/
├── CLAUDE.md                           # AI operational guidelines
├── ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md
├── README.md                           # This file
├── effectiveness.jsx                   # Original prototype (reference)
├── docs/                               # Project documentation
├── .claude/                            # Claude Code hooks + commands
├── frontend/                           # React + TypeScript app
├── docker-compose.yml
├── run_engineering_effectiveness.sh
├── run_engineering_effectiveness.bat
├── .gitignore
└── .gitlab-ci.yml
```

---

## Documentation

- `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` — Comprehensive spec: scoring algorithms, data dictionary, integration architecture, phased delivery plan
- `CLAUDE.md` — AI development guidelines, data contracts, phase constraints
- `docs/status.md` — Current project state
- `docs/versions.md` — Version changelog