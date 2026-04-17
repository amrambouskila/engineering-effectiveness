import type { RadarScores } from "./RadarScores.ts";
import type { Tier } from "./Tier.ts";

export interface AggregateScores {
  scores: RadarScores;
  overall: number;
  tier: Tier;
  projectCount: number;
}
