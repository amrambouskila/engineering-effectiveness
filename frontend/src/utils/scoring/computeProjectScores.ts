import type { ProjectData } from "../../types/ProjectData.ts";
import type { ProjectScores } from "../../types/ProjectScores.ts";
import { calculateSpeed } from "./calculateSpeed.ts";
import { calculateAccuracy } from "./calculateAccuracy.ts";
import { calculateDefense } from "./calculateDefense.ts";
import { calculateStrength } from "./calculateStrength.ts";
import { calculateEndurance } from "./calculateEndurance.ts";
import { calculateOverall } from "./calculateOverall.ts";
import { classifyTier } from "./classifyTier.ts";

export function computeProjectScores(project: ProjectData): ProjectScores {
  const scores = {
    speed: calculateSpeed(
      project.targetDeliveryDate,
      project.actualDeliveryDate
    ),
    accuracy: calculateAccuracy(
      project.expectedRevenue,
      project.actualRevenue,
      project.expectedPhases,
      project.actualPhases
    ),
    defense: calculateDefense(
      project.vulnerabilities,
      project.expectedBreachCost
    ),
    strength: calculateStrength(
      project.expectedRevenue,
      project.actualRevenue
    ),
    endurance: calculateEndurance(
      project.reusableComponents,
      project.intersectingProjects
    ),
  };
  const overall = calculateOverall(scores);
  return {
    projectId: project.id,
    scores,
    overall,
    tier: classifyTier(overall),
  };
}
