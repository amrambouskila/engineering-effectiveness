import { clamp } from "./clamp.ts";
import { SPEED_SENSITIVITY_MULTIPLIER } from "./scoringConstants.ts";

const DEFAULT_PLANNED_DURATION_DAYS = 180;
const MIN_PLANNED_DURATION_DAYS = 30;

function daysBetween(dateA: string, dateB: string): number {
  const msPerDay = 86_400_000;
  return Math.round(
    (new Date(dateB).getTime() - new Date(dateA).getTime()) / msPerDay
  );
}

export function calculateSpeed(
  targetDeliveryDate: string,
  actualDeliveryDate: string
): number {
  const plannedDuration = Math.max(
    DEFAULT_PLANNED_DURATION_DAYS,
    MIN_PLANNED_DURATION_DAYS
  );
  const slipDays = Math.max(
    0,
    daysBetween(targetDeliveryDate, actualDeliveryDate)
  );
  return Math.round(
    clamp(
      100 * (1 - (slipDays / plannedDuration) * SPEED_SENSITIVITY_MULTIPLIER),
      0,
      100
    )
  );
}
