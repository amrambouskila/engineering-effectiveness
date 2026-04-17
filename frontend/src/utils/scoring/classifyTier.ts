import type { Tier } from "../../types/Tier.ts";
import {
  TIER_HIGH_THRESHOLD,
  TIER_MID_THRESHOLD,
} from "./scoringConstants.ts";

export function classifyTier(score: number): Tier {
  if (score >= TIER_HIGH_THRESHOLD) return "HIGH";
  if (score >= TIER_MID_THRESHOLD) return "MID";
  return "LOW";
}
