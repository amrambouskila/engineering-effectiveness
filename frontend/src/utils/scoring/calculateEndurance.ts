import { clamp } from "./clamp.ts";
import {
  ENDURANCE_REUSE_CAP,
  ENDURANCE_INTERSECTION_CAP,
  ENDURANCE_REUSE_MAX_POINTS,
  ENDURANCE_INTERSECTION_MAX_POINTS,
} from "./scoringConstants.ts";

export function calculateEndurance(
  reusableComponents: number,
  intersectingProjects: number
): number {
  const reuse = clamp(
    (reusableComponents / ENDURANCE_REUSE_CAP) * ENDURANCE_REUSE_MAX_POINTS,
    0,
    ENDURANCE_REUSE_MAX_POINTS
  );
  const cross = clamp(
    (intersectingProjects / ENDURANCE_INTERSECTION_CAP) *
      ENDURANCE_INTERSECTION_MAX_POINTS,
    0,
    ENDURANCE_INTERSECTION_MAX_POINTS
  );
  return Math.round(reuse + cross);
}
