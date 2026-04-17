import { describe, it, expect } from "vitest";
import { calculateOverall } from "../../../src/utils/scoring/calculateOverall.ts";

describe("calculateOverall", () => {
  it("averages all five axes", () => {
    expect(
      calculateOverall({
        speed: 80,
        accuracy: 90,
        defense: 70,
        strength: 60,
        endurance: 50,
      })
    ).toBe(70);
  });

  it("rounds to nearest integer", () => {
    // (81 + 82 + 83 + 84 + 85) / 5 = 415 / 5 = 83
    expect(
      calculateOverall({
        speed: 81,
        accuracy: 82,
        defense: 83,
        strength: 84,
        endurance: 85,
      })
    ).toBe(83);
  });

  it("returns 0 when all axes are 0", () => {
    expect(
      calculateOverall({
        speed: 0,
        accuracy: 0,
        defense: 0,
        strength: 0,
        endurance: 0,
      })
    ).toBe(0);
  });
});
