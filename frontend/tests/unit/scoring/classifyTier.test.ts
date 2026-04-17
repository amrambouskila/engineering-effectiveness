import { describe, it, expect } from "vitest";
import { classifyTier } from "../../../src/utils/scoring/classifyTier.ts";

describe("classifyTier", () => {
  it("classifies 75 as HIGH", () => {
    expect(classifyTier(75)).toBe("HIGH");
  });

  it("classifies 100 as HIGH", () => {
    expect(classifyTier(100)).toBe("HIGH");
  });

  it("classifies 74 as MID", () => {
    expect(classifyTier(74)).toBe("MID");
  });

  it("classifies 45 as MID", () => {
    expect(classifyTier(45)).toBe("MID");
  });

  it("classifies 44 as LOW", () => {
    expect(classifyTier(44)).toBe("LOW");
  });

  it("classifies 0 as LOW", () => {
    expect(classifyTier(0)).toBe("LOW");
  });
});
