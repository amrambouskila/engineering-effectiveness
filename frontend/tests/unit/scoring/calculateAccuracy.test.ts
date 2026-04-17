import { describe, it, expect } from "vitest";
import { calculateAccuracy } from "../../../src/utils/scoring/calculateAccuracy.ts";

describe("calculateAccuracy", () => {
  it("returns 100 when revenue and phases match exactly", () => {
    expect(calculateAccuracy(500_000, 500_000, 5, 5)).toBe(100);
  });

  it("penalizes revenue deviation", () => {
    // |1 - 490000/500000| = 0.02, * 200 = 4 → revAccuracy = 96
    // phases match → phaseAccuracy = 100
    // accuracy = 0.5 * 96 + 0.5 * 100 = 98
    expect(calculateAccuracy(500_000, 490_000, 5, 5)).toBe(98);
  });

  it("penalizes phase deviation", () => {
    // revenue matches → revAccuracy = 100
    // |9 - 8| / 8 = 0.125, * 150 = 18.75 → phaseAccuracy = 81.25
    // accuracy = 0.5 * 100 + 0.5 * 81.25 = 90.625 → 91
    expect(calculateAccuracy(100_000, 100_000, 8, 9)).toBe(91);
  });

  it("clamps revAccuracy to 0 when revenue is wildly off", () => {
    // |1 - 1000000/100000| = 9, * 200 = 1800 → revAccuracy = 0
    // phases match → phaseAccuracy = 100
    // accuracy = 0.5 * 0 + 0.5 * 100 = 50
    expect(calculateAccuracy(100_000, 1_000_000, 1, 1)).toBe(50);
  });

  it("handles zero expected revenue gracefully", () => {
    // Division by zero case: actualRevenue / 0 → Infinity
    // |1 - Infinity| = Infinity → clamped to 0
    // phaseAccuracy = 100 (1,1)
    // accuracy = 0.5 * 0 + 0.5 * 100 = 50
    expect(calculateAccuracy(0, 100_000, 1, 1)).toBe(50);
  });
});
