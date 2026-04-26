---
name: phase-awareness
description: Proactively applied at session start and before any implementation work; orients Codex to the current phase and its explicit scope constraints
---

# Phase Awareness Skill

## When to Apply
- At the start of every session
- Before implementing any feature or making any architectural decision
- When a request might cross phase boundaries

## Protocol

### 1. Identify Current Phase
Read `AGENTS.md` Section 2 to determine the current phase. As of project scaffolding, this is **Phase 1 — Frontend MVP**.

### 2. Scope Check
Before implementing anything, verify the request is within the current phase's scope:

**Phase 1 allows:**
- React + TypeScript frontend code
- Chart.js radar chart
- Client-side scoring engine
- Manual project data entry
- Zustand state management
- localStorage persistence
- Docker containerization
- CI/CD pipeline

**Phase 1 prohibits:**
- Backend API endpoints (Phase 2)
- Database connections (Phase 2)
- Server-side scoring (Phase 2)
- Jira/ADO connectors (Phase 3)
- Security scanner webhooks (Phase 3)
- Historical snapshots (Phase 4)
- Team comparison views (Phase 4)
- Threshold alerts (Phase 4)
- Embeddable widgets (Phase 5)

### 3. Forward Compatibility
Even within Phase 1, every decision must be forward-compatible:
- Data contracts match the Phase 2 database schema
- Scoring functions are pure and portable to Python
- Chart components are isolated (Phase 5 may swap Chart.js for WebGL)
- State management supports future API integration

### 4. Flag Phase Violations
If a request would introduce Phase 2+ features, stop and flag it before proceeding. Suggest the Phase 1-appropriate alternative if one exists, or confirm the phase constraint should be relaxed.