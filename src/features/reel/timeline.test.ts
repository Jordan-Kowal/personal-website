import { describe, expect, test } from "bun:test";
import {
  clamp01,
  easeInOutCubic,
  easeOutBack,
  easeOutExpo,
  lerp,
  type Pace,
  PROJECT_PINS,
  popTimes,
  progress,
  projectPinTimes,
  random,
  reachedCount,
  type Scene,
  sceneAt,
  typedText,
  visibleScenes,
  wrap,
} from "./timeline";

describe("clamp01", () => {
  test.each([
    { x: -0.1, expected: 0 },
    { x: 0, expected: 0 },
    { x: 0.4, expected: 0.4 },
    { x: 1, expected: 1 },
    { x: 1.1, expected: 1 },
  ])("$x → $expected", ({ x, expected }) => {
    expect(clamp01(x)).toBe(expected);
  });
});

describe("lerp", () => {
  test.each([
    { from: 2011, to: 2026, x: 0, expected: 2011 },
    { from: 2011, to: 2026, x: 1, expected: 2026 },
    { from: 0, to: 10, x: 0.5, expected: 5 },
  ])("$from → $to at $x", ({ from, to, x, expected }) => {
    expect(lerp(from, to, x)).toBe(expected);
  });
});

describe("progress", () => {
  test.each([
    { t: 1.9, expected: 0 },
    { t: 2, expected: 0 },
    { t: 3, expected: 0.5 },
    { t: 4, expected: 1 },
    { t: 4.1, expected: 1 },
  ])("t=$t in 2 → 4 is $expected", ({ t, expected }) => {
    expect(progress(t, 2, 4)).toBe(expected);
  });
});

describe("easings", () => {
  test.each([
    { name: "easeOutExpo", ease: easeOutExpo },
    { name: "easeOutBack", ease: easeOutBack },
    { name: "easeInOutCubic", ease: easeInOutCubic },
  ])("$name starts at 0 and ends at 1", ({ ease }) => {
    expect(ease(0)).toBeCloseTo(0);
    expect(ease(1)).toBeCloseTo(1);
  });

  test("easeOutBack overshoots before settling", () => {
    expect(easeOutBack(0.7)).toBeGreaterThan(1);
  });

  test("easeInOutCubic is symmetric around the middle", () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
});

describe("sceneAt", () => {
  test.each([
    { t: 0, expected: "intro" },
    { t: 3.04, expected: "intro" },
    { t: 3.05, expected: "skills" },
    { t: 8.15, expected: "projects" },
    { t: 11.99, expected: "projects" },
    { t: 12, expected: "experience" },
    { t: 17.89, expected: "experience" },
    { t: 17.9, expected: "outro" },
    { t: 21, expected: "outro" },
  ])("t=$t is $expected", ({ t, expected }) => {
    expect(sceneAt(t)).toBe(expected);
  });
});

describe("visibleScenes", () => {
  test.each<{ t: number; expected: Scene[] }>([
    { t: 0, expected: ["intro"] },
    { t: 3.05, expected: ["skills"] },
    { t: 11.99, expected: ["projects"] },
    { t: 12, expected: ["projects", "experience"] },
    { t: 12.4, expected: ["experience"] },
    { t: 20.99, expected: ["outro"] },
    { t: 21, expected: [] },
  ])("t=$t shows $expected", ({ t, expected }) => {
    expect(visibleScenes(t)).toEqual(expected);
  });
});

describe("popTimes", () => {
  const pace: Pace = { firstGapInS: 0.4, decay: 0.5, minGapInS: 0.1 };

  test.each<{ count: number; expected: number[] }>([
    { count: 0, expected: [] },
    { count: 1, expected: [2] },
    { count: 2, expected: [2, 2.4] },
    { count: 3, expected: [2, 2.4, 2.6] },
    // Third gap would be 0.05, floored to 0.1.
    { count: 4, expected: [2, 2.4, 2.6, 2.7] },
  ])("$count item(s)", ({ count, expected }) => {
    const times = popTimes(count, 2, pace);
    expect(times).toHaveLength(expected.length);
    for (const [i, time] of times.entries()) {
      expect(time).toBeCloseTo(expected[i] ?? Number.NaN);
    }
  });
});

describe("reachedCount", () => {
  const times = [1, 2, 3];
  test.each([
    { t: 0.9, expected: 0 },
    { t: 1, expected: 1 },
    { t: 2.5, expected: 2 },
    { t: 3, expected: 3 },
  ])("t=$t reached $expected", ({ t, expected }) => {
    expect(reachedCount(t, times)).toBe(expected);
  });
});

describe("typedText", () => {
  test.each([
    { x: -1, expected: "" },
    { x: 0, expected: "" },
    { x: 0.5, expected: "PLA" },
    { x: 1, expected: "PLAYER" },
    { x: 2, expected: "PLAYER" },
  ])("x=$x is '$expected'", ({ x, expected }) => {
    expect(typedText("PLAYER", x)).toBe(expected);
  });
});

describe("wrap", () => {
  test.each([
    { value: -1, expected: 9 },
    { value: 0, expected: 0 },
    { value: 9.5, expected: 9.5 },
    { value: 10, expected: 0 },
    { value: 23, expected: 3 },
  ])("$value in 10 is $expected", ({ value, expected }) => {
    expect(wrap(value, 10)).toBe(expected);
  });
});

describe("random", () => {
  test("is stable for a seed and stays in 0-1", () => {
    for (let seed = 0; seed < 200; seed++) {
      expect(random(seed)).toBe(random(seed));
      expect(random(seed)).toBeGreaterThanOrEqual(0);
      expect(random(seed)).toBeLessThan(1);
    }
  });
});

describe("projectPinTimes", () => {
  test.each([
    { olderCount: 0, expectedOlder: 0 },
    { olderCount: 1, expectedOlder: 1 },
    { olderCount: 12, expectedOlder: 12 },
  ])("$olderCount older projects", ({ olderCount, expectedOlder }) => {
    const { older, newest } = projectPinTimes(olderCount);
    expect(older).toHaveLength(expectedOlder);
    expect(older[0] ?? PROJECT_PINS.start).toBe(PROJECT_PINS.start);
    expect(newest).toBeCloseTo((older.at(-1) ?? PROJECT_PINS.start) + 0.45);
  });
});
