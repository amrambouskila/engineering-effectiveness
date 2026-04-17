import { clamp } from "./clamp.ts";

export function calculateStrength(
  expectedRevenue: number,
  actualRevenue: number
): number {
  return Math.round(
    clamp((actualRevenue / Math.max(expectedRevenue, 1)) * 100, 0, 100)
  );
}
