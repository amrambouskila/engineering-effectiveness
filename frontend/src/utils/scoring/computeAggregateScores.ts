import type { RadarScores } from "../../types/RadarScores.ts";
import type { AggregateScores } from "../../types/AggregateScores.ts";
import type { ProjectScores } from "../../types/ProjectScores.ts";
import { calculateOverall } from "./calculateOverall.ts";
import { classifyTier } from "./classifyTier.ts";

export function computeAggregateScores(
  projectScores: ProjectScores[]
): AggregateScores {
  const count = projectScores.length;
  if (count === 0) {
    return {
      scores: { speed: 0, accuracy: 0, defense: 0, strength: 0, endurance: 0 },
      overall: 0,
      tier: "LOW",
      projectCount: 0,
    };
  }

  const axes: (keyof RadarScores)[] = [
    "speed",
    "accuracy",
    "defense",
    "strength",
    "endurance",
  ];
  const scores = {} as RadarScores;
  for (const axis of axes) {
    const sum = projectScores.reduce((acc, ps) => acc + ps.scores[axis], 0);
    scores[axis] = Math.round(sum / count);
  }

  const overall = calculateOverall(scores);
  return {
    scores,
    overall,
    tier: classifyTier(overall),
    projectCount: count,
  };
}
