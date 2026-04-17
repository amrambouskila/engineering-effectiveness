import { describe, it, expect } from "vitest";
import { calculateDefense } from "../../../src/utils/scoring/calculateDefense.ts";

describe("calculateDefense", () => {
  it("returns 100 with zero vulnerabilities", () => {
    expect(calculateDefense(0, 500_000)).toBe(100);
  });

  it("penalizes vulnerabilities and breach cost", () => {
    // 3 vulns, breachCost=220000
    // breachWeight = 220000 / 500000 = 0.44
    // rawDefense = 100 - 3*18 = 46
    // penalty = 0.44 * 10 = 4.4
    // defense = clamp(46 - 4.4, 0, 100) = 41.6 → 42
    expect(calculateDefense(3, 220_000)).toBe(42);
  });

  it("clamps to 0 with many vulnerabilities", () => {
    expect(calculateDefense(10, 1_000_000)).toBe(0);
  });

  it("skips breach penalty when zero vulnerabilities", () => {
    // rawDefense = 100 - 0 = 100, no breach penalty applied
    expect(calculateDefense(0, 1_000_000)).toBe(100);
  });
});
