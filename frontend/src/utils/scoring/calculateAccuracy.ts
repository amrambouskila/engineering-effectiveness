import { clamp } from "./clamp.ts";
import {
  ACCURACY_REVENUE_WEIGHT,
  ACCURACY_PHASE_WEIGHT,
  ACCURACY_REVENUE_SENSITIVITY,
  ACCURACY_PHASE_SENSITIVITY,
} from "./scoringConstants.ts";

export function calculateAccuracy(
  expectedRevenue: number,
  actualRevenue: number,
  expectedPhases: number,
  actualPhases: number
): number {
  const revAccuracy = clamp(
    100 -
      Math.abs(1 - actualRevenue / expectedRevenue) *
        ACCURACY_REVENUE_SENSITIVITY,
    0,
    100
  );
  const phaseAccuracy = clamp(
    100 -
      (Math.abs(actualPhases - expectedPhases) / Math.max(expectedPhases, 1)) *
        ACCURACY_PHASE_SENSITIVITY,
    0,
    100
  );
  return Math.round(
    ACCURACY_REVENUE_WEIGHT * revAccuracy +
      ACCURACY_PHASE_WEIGHT * phaseAccuracy
  );
}
