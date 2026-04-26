---
name: validate
description: Validate scoring engine for correctness and completeness
---

# Scoring Validation Command

Before anything else:
1. Re-read `AGENTS.md` in full — especially Section 5 (Required Calculations).
2. Re-read `ENGINEERING_EFFECTIVENESS_MASTER_PLAN.md` — especially "The Five Axes" section.
3. Read `docs/status.md`.

## Validation Layers

### Layer 1: Structural Completeness
- [ ] All 5 scoring functions exist: calculateSpeed, calculateAccuracy, calculateDefense, calculateStrength, calculateEndurance
- [ ] All constants defined in scoringConstants.ts
- [ ] classifyTier function exists
- [ ] computeProjectScores aggregator exists
- [ ] computeAggregateScores aggregator exists
- [ ] clamp utility exists

### Layer 2: Formula Correctness
For each scoring function, verify against the master plan:

**Speed:**
- [ ] Uses `max(0, daysBetween(targetDate, actualDate))` for slip
- [ ] Uses planned duration (not hardcoded)
- [ ] Multiplier is `SPEED_SENSITIVITY_MULTIPLIER` (2.5)
- [ ] Result clamped to [0, 100]

**Accuracy:**
- [ ] Revenue accuracy: `100 - |1 - actual/expected| * 200`
- [ ] Phase accuracy: `100 - |actual - expected| / expected * 150`
- [ ] Weighted 50/50
- [ ] Both sub-scores clamped before weighting

**Defense:**
- [ ] Breach weight: `expectedBreachCost / 500000`
- [ ] Raw: `100 - vulns * 18`
- [ ] Penalty only applied when vulns > 0
- [ ] Result clamped to [0, 100]

**Strength:**
- [ ] `actual / expected * 100`
- [ ] Division protected
- [ ] Clamped to [0, 100]

**Endurance:**
- [ ] Reuse: `(components / 8) * 50`, clamped to [0, 50]
- [ ] Cross: `(intersections / 5) * 50`, clamped to [0, 50]
- [ ] Sum of both

### Layer 3: Data-Driven Compliance
- [ ] No hardcoded scoring constants in formula functions (all from scoringConstants.ts)
- [ ] No hardcoded project data (all from store/props)
- [ ] Tier thresholds from constants (75, 45)

### Layer 4: Reference Validation
Using the sample data from `effectiveness.jsx`, manually compute expected scores for at least 2 projects and verify the scoring engine produces matching results.

### Layer 5: Boundary Testing
Verify behavior at:
- Zero revenue (both expected and actual)
- Zero vulnerabilities
- Early delivery (actual before target)
- Exact on-time delivery
- Maximum endurance (8+ components, 5+ intersections)
- Score boundaries (44/45, 74/75)

## Report

Produce a table:

| Layer | Status | Details |
|-------|--------|---------|
| Structural | PASS/FAIL | Missing: ... |
| Formula | PASS/FAIL | Discrepancies: ... |
| Data-Driven | PASS/FAIL | Hardcoded values: ... |
| Reference | PASS/FAIL | Expected vs actual: ... |
| Boundary | PASS/FAIL | Failing cases: ... |