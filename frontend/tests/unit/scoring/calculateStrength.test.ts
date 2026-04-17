import { describe, it, expect } from "vitest";
import { calculateStrength } from "../../../src/utils/scoring/calculateStrength.ts";

describe("calculateStrength", () => {
  it("returns 100 when actual meets expected", () => {
    expect(calculateStrength(500_000, 500_000)).toBe(100);
  });

  it("returns proportional score for partial revenue", () => {
    // 250000 / 500000 * 100 = 50
    expect(calculateStrength(500_000, 250_000)).toBe(50);
  });

  it("caps at 100 when actual exceeds expected", () => {
    expect(calculateStrength(100_000, 200_000)).toBe(100);
  });

  it("returns 0 when actual revenue is zero", () => {
    expect(calculateStrength(500_000, 0)).toBe(0);
  });

  it("handles zero expected revenue", () => {
    // 100000 / max(0, 1) * 100 = 10_000_000 → clamped to 100
    expect(calculateStrength(0, 100_000)).toBe(100);
  });
});
