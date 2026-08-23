import { describe, it, expect } from "vitest";
import { computeProjectScores } from "../../../src/utils/scoring/computeProjectScores.ts";
import { calculateSpeed } from "../../../src/utils/scoring/calculateSpeed.ts";
import { calculateAccuracy } from "../../../src/utils/scoring/calculateAccuracy.ts";
import { calculateDefense } from "../../../src/utils/scoring/calculateDefense.ts";
import { calculateStrength } from "../../../src/utils/scoring/calculateStrength.ts";
import { calculateEndurance } from "../../../src/utils/scoring/calculateEndurance.ts";
import { calculateOverall } from "../../../src/utils/scoring/calculateOverall.ts";
import { classifyTier } from "../../../src/utils/scoring/classifyTier.ts";
import type { ProjectData } from "../../../src/types/ProjectData.ts";

const project: ProjectData = {
  id: "proj-1",
  name: "Delivered on time, on budget",
  targetDeliveryDate: "2026-01-31",
  actualDeliveryDate: "2026-01-31",
  expectedRevenue: 100_000,
  actualRevenue: 100_000,
  expectedBreachCost: 0,
  vulnerabilities: 0,
  expectedPhases: 4,
  actualPhases: 4,
  intersectingProjects: 5,
  reusableComponents: 8,
};

describe("computeProjectScores", () => {
  it("carries the project id through to the result", () => {
    expect(computeProjectScores(project).projectId).toBe("proj-1");
  });

  it("delegates each axis to its own calculator with the matching project fields", () => {
    const result = computeProjectScores(project);

    expect(result.scores).toEqual({
      speed: calculateSpeed(project.targetDeliveryDate, project.actualDeliveryDate),
      accuracy: calculateAccuracy(
        project.expectedRevenue,
        project.actualRevenue,
        project.expectedPhases,
        project.actualPhases
      ),
      defense: calculateDefense(project.vulnerabilities, project.expectedBreachCost),
      strength: calculateStrength(project.expectedRevenue, project.actualRevenue),
      endurance: calculateEndurance(project.reusableComponents, project.intersectingProjects),
    });
  });

  it("derives overall and tier from the computed axis scores", () => {
    const result = computeProjectScores(project);
    const expectedOverall = calculateOverall(result.scores);

    expect(result.overall).toBe(expectedOverall);
    expect(result.tier).toBe(classifyTier(expectedOverall));
  });

  it("scores a perfect project as HIGH", () => {
    const result = computeProjectScores(project);

    expect(result.overall).toBe(100);
    expect(result.tier).toBe("HIGH");
  });

  it("drops a late, over-budget, vulnerable project to a lower tier", () => {
    const struggling: ProjectData = {
      ...project,
      id: "proj-2",
      actualDeliveryDate: "2026-06-30",
      actualRevenue: 10_000,
      expectedBreachCost: 5_000_000,
      vulnerabilities: 6,
      actualPhases: 12,
      intersectingProjects: 0,
      reusableComponents: 0,
    };
    const result = computeProjectScores(struggling);

    expect(result.overall).toBeLessThan(computeProjectScores(project).overall);
    expect(result.tier).toBe("LOW");
  });
});
