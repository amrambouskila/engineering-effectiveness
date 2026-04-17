import { describe, it, expect } from "vitest";
import { calculateSpeed } from "../../../src/utils/scoring/calculateSpeed.ts";

describe("calculateSpeed", () => {
  it("returns 100 when delivered on time", () => {
    expect(calculateSpeed("2025-06-01", "2025-06-01")).toBe(100);
  });

  it("returns 100 when delivered early", () => {
    expect(calculateSpeed("2025-06-01", "2025-05-15")).toBe(100);
  });

  it("penalizes late delivery proportionally", () => {
    // 80 days late, plannedDuration=180
    // speed = 100 * (1 - (80/180) * 2.5) = 100 * (1 - 1.111) = clamped to 0
    // Actually: 80/180 = 0.4444, * 2.5 = 1.111, 1 - 1.111 = -0.111, * 100 = -11.1 → clamped to 0
    expect(calculateSpeed("2025-03-01", "2025-05-20")).toBe(0);
  });

  it("returns intermediate score for moderate slip", () => {
    // 30 days late, plannedDuration=180
    // speed = 100 * (1 - (30/180) * 2.5) = 100 * (1 - 0.4167) = 58.33 → 58
    expect(calculateSpeed("2025-06-01", "2025-07-01")).toBe(58);
  });

  it("clamps to 0 for extreme slip", () => {
    expect(calculateSpeed("2025-01-01", "2025-12-31")).toBe(0);
  });
});
