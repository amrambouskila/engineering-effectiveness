import { describe, it, expect } from "vitest";
import { calculateEndurance } from "../../../src/utils/scoring/calculateEndurance.ts";

describe("calculateEndurance", () => {
  it("returns 0 with no reuse or intersection", () => {
    expect(calculateEndurance(0, 0)).toBe(0);
  });

  it("scores reuse and intersection proportionally", () => {
    // reuse: (2/8) * 50 = 12.5
    // cross: (1/5) * 50 = 10
    // endurance = 12.5 + 10 = 22.5 → 23
    expect(calculateEndurance(2, 1)).toBe(23);
  });

  it("caps at 100 when both maxed", () => {
    // reuse: (8/8) * 50 = 50
    // cross: (5/5) * 50 = 50
    expect(calculateEndurance(8, 5)).toBe(100);
  });

  it("caps each component independently", () => {
    // reuse: (20/8) * 50 = 125 → clamped to 50
    // cross: (0/5) * 50 = 0
    expect(calculateEndurance(20, 0)).toBe(50);
  });
});
