import { describe, expect, test } from "bun:test";
import {
  BURST_LIFE_IN_S,
  type Burst,
  burstParticles,
  driftingMotes,
} from "./particles";
import { DURATION_IN_S } from "./timeline";

describe("burstParticles", () => {
  const burst: Burst = {
    x: 100,
    y: 100,
    start: 2,
    count: 12,
    reachInPx: 300,
    seed: 1,
  };

  test.each([
    { t: 1.99, expected: 0 },
    { t: 2, expected: 12 },
    { t: 2 + BURST_LIFE_IN_S - 0.01, expected: 12 },
    { t: 2 + BURST_LIFE_IN_S, expected: 0 },
  ])("t=$t has $expected particle(s)", ({ t, expected }) => {
    expect(burstParticles(burst, t)).toHaveLength(expected);
  });

  test("starts on its origin, fully visible", () => {
    for (const particle of burstParticles(burst, 2)) {
      expect(particle.x).toBeCloseTo(100);
      expect(particle.y).toBeCloseTo(100);
      expect(particle.opacity).toBe(1);
    }
  });

  test("renders the same frame twice", () => {
    expect(burstParticles(burst, 2.7)).toEqual(burstParticles(burst, 2.7));
  });
});

describe("driftingMotes", () => {
  test("the last frame joins the first", () => {
    const first = driftingMotes(20, 0);
    const last = driftingMotes(20, DURATION_IN_S);
    for (const [i, mote] of first.entries()) {
      expect(last[i]?.x).toBeCloseTo(mote.x);
      expect(last[i]?.y).toBeCloseTo(mote.y);
      expect(last[i]?.opacity).toBeCloseTo(mote.opacity);
    }
  });

  test("stays on the stage", () => {
    for (const mote of driftingMotes(40, 7.3)) {
      expect(mote.y).toBeGreaterThanOrEqual(0);
      expect(mote.y).toBeLessThan(1080);
    }
  });
});
