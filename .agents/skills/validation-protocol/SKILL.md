---
name: validation-protocol
description: Proactively applied when writing or modifying tests; enforces real assertions, reference values, and no-mocking rules for scoring formula accuracy
---

# Validation Protocol Skill

## When to Apply
- When creating or modifying test files
- When modifying scoring functions
- When reviewing test coverage

## Protocol

### 1. No Tautological Tests
Every test must assert against a known, independently-computed value. Do NOT write tests that compute the expected value using the same function being tested.

**Wrong:**
```typescript
const expected = calculateSpeed(project);
expect(calculateSpeed(project)).toBe(expected);
```

**Right:**
```typescript
// Manually computed: planned=180d, slip=80d, speed=100*(1-(80/180)*2.5)=clamp(-11.11)=0
expect(calculateSpeed(project)).toBe(0);
```

### 2. Reference Values Required
At least one test per scoring function must use data from `effectiveness.jsx`'s `SAMPLE_PROJECTS` array with manually computed expected scores. Document the hand calculation in a comment.

### 3. Boundary Value Testing
Every scoring function must be tested at:
- **Lower bound:** Input that produces score = 0
- **Upper bound:** Input that produces score = 100
- **Tier boundaries:** Inputs producing scores of 44, 45, 74, 75
- **Edge cases:** Zero denominators, negative values where possible

### 4. No Mocking of Scoring Math
Never mock `clamp`, `daysBetween`, or any scoring constant. Tests run against real computations with real constants.

### 5. Tolerance Rules
- Integer scores: exact equality (`toBe`)
- Intermediate floating-point values: `toBeCloseTo(expected, 2)` with documented justification
- Never use approximate matching for final integer scores

### 6. Test File Structure
```
tests/unit/scoring/
├── calculateSpeed.test.ts
├── calculateAccuracy.test.ts
├── calculateDefense.test.ts
├── calculateStrength.test.ts
├── calculateEndurance.test.ts
├── classifyTier.test.ts
├── computeProjectScores.test.ts
└── computeAggregateScores.test.ts
```

Each test file corresponds to exactly one source file. No combined test files.

### 7. Aggregation Tests
- Single project: aggregate scores equal per-project scores
- Multiple projects: aggregate is the rounded mean
- Zero projects: all scores are 0

### 8. Constants Consistency
If a scoring constant changes in `scoringConstants.ts`, every test that depends on it must be reviewed. Tests should import constants from the same source to stay in sync, but expected values in assertions must be recomputed manually.