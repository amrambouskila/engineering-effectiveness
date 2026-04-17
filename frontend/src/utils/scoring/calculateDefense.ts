import { clamp } from "./clamp.ts";
import {
  DEFENSE_VULN_PENALTY,
  DEFENSE_BREACH_DIVISOR,
  DEFENSE_BREACH_PENALTY_FACTOR,
} from "./scoringConstants.ts";

export function calculateDefense(
  vulnerabilities: number,
  expectedBreachCost: number
): number {
  const breachWeight = expectedBreachCost / DEFENSE_BREACH_DIVISOR;
  const rawDefense = 100 - vulnerabilities * DEFENSE_VULN_PENALTY;
  return Math.round(
    clamp(
      rawDefense -
        (vulnerabilities > 0
          ? breachWeight * DEFENSE_BREACH_PENALTY_FACTOR
          : 0),
      0,
      100
    )
  );
}
