import type { RadarScores } from "../../types/RadarScores.ts";

export function calculateOverall(scores: RadarScores): number {
  const { speed, accuracy, defense, strength, endurance } = scores;
  return Math.round((speed + accuracy + defense + strength + endurance) / 5);
}
