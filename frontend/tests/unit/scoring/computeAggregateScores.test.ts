import { describe, it, expect } from "vitest";
import { computeAggregateScores } from "../../../src/utils/scoring/computeAggregateScores.ts";
import type { ProjectScores } from "../../../src/types/ProjectScores.ts";

function projectScores(
  projectId: string,
  speed: number,
  accuracy: number,
  defense: number,
  strength: number,
  endurance: number
): ProjectScores {
  const scores = { speed, accuracy, defense, strength, endurance };
  return { projectId, scores, overall: 0, tier: "LOW" };
}

describe("computeAggregateScores", () => {
  it("returns a zeroed LOW aggregate for an empty portfolio", () => {
    expect(computeAggregateScores([])).toEqual({
      scores: { speed: 0, accuracy: 0, defense: 0, strength: 0, endurance: 0 },
      overall: 0,
      tier: "LOW",
      projectCount: 0,
    });
  });

  it("passes a single project's axis scores through unchanged", () => {
    const result = computeAggregateScores([projectScores("a", 80, 70, 90, 60, 100)]);

    expect(result.scores).toEqual({
      speed: 80,
      accuracy: 70,
      defense: 90,
      strength: 60,
      endurance: 100,
    });
    expect(result.projectCount).toBe(1);
  });

  it("averages each axis independently across projects", () => {
    const result = computeAggregateScores([
      projectScores("a", 100, 0, 50, 20, 80),
      projectScores("b", 0, 100, 50, 40, 20),
    ]);

    expect(result.scores).toEqual({
      speed: 50,
      accuracy: 50,
      defense: 50,
      strength: 30,
      endurance: 50,
    });
    expect(result.projectCount).toBe(2);
  });

  it("rounds a fractional axis average to the nearest integer", () => {
    const result = computeAggregateScores([
      projectScores("a", 1, 1, 1, 1, 1),
      projectScores("b", 2, 2, 2, 2, 2),
    ]);

    // 3 / 2 = 1.5 -> 2
    expect(result.scores.speed).toBe(2);
  });

  it("derives overall as the mean of the averaged axes and tiers it", () => {
    const result = computeAggregateScores([projectScores("a", 90, 90, 90, 90, 90)]);

    expect(result.overall).toBe(90);
    expect(result.tier).toBe("HIGH");
  });

  it("ignores each project's own overall and tier, recomputing from the axes", () => {
    const misleading: ProjectScores = {
      projectId: "a",
      scores: { speed: 10, accuracy: 10, defense: 10, strength: 10, endurance: 10 },
      overall: 100,
      tier: "HIGH",
    };
    const result = computeAggregateScores([misleading]);

    expect(result.overall).toBe(10);
    expect(result.tier).toBe("LOW");
  });
});
