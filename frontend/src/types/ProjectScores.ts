import type { RadarScores } from "./RadarScores.ts";
import type { Tier } from "./Tier.ts";

export interface ProjectScores {
  projectId: string;
  scores: RadarScores;
  overall: number;
  tier: Tier;
}
