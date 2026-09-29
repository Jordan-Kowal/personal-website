import { describe, expect, test } from "bun:test";
import {
  BAR_IN_STEPS,
  buildScore,
  climb,
  FINAL_CHORD_IN_S,
  frequencyOf,
  LOOP_START_IN_S,
  midiOf,
  type Note,
  notesFrom,
  pentatonicLadder,
  STEP_IN_S,
  stepTimes,
} from "./music";
import { END_CARD_IN_S } from "./timeline";

describe("midiOf", () => {
  test.each([
    { name: "C4", expected: 60 },
    { name: "A4", expected: 69 },
    { name: "C#4", expected: 61 },
    { name: "Bb3", expected: 58 },
    { name: "C0", expected: 12 },
  ])("$name → $expected", ({ name, expected }) => {
    expect(midiOf(name)).toBe(expected);
  });

  test.each(["H4", "C", "c4", "C#"])("rejects %p", (name) => {
    expect(() => midiOf(name)).toThrow();
  });
});

describe("frequencyOf", () => {
  test.each([
    { midi: 69, expected: 440 },
    { midi: 81, expected: 880 },
    { midi: 57, expected: 220 },
  ])("$midi → $expected Hz", ({ midi, expected }) => {
    expect(frequencyOf(midi)).toBeCloseTo(expected);
  });
});

describe("stepTimes", () => {
  test.each([
    { from: 1, to: 1.3, stepInS: 0.1, expected: [1, 1.1, 1.2] },
    { from: 1, to: 1.31, stepInS: 0.1, expected: [1, 1.1, 1.2, 1.3] },
    { from: 1, to: 1, stepInS: 0.1, expected: [] },
    { from: 2, to: 1, stepInS: 0.1, expected: [] },
  ])("$from → $to every $stepInS", ({ from, to, stepInS, expected }) => {
    const times = stepTimes(from, to, stepInS);
    expect(times).toHaveLength(expected.length);
    times.forEach((time, i) => {
      expect(time).toBeCloseTo(expected[i] ?? Number.NaN);
    });
  });
});

describe("pentatonicLadder", () => {
  test.each([
    { count: 0, expected: [] },
    { count: 5, expected: [60, 62, 64, 67, 69] },
    { count: 7, expected: [60, 62, 64, 67, 69, 72, 74] },
  ])("$count rungs from C4", ({ count, expected }) => {
    expect(pentatonicLadder(60, count)).toEqual([...expected]);
  });
});

describe("climb", () => {
  const ladder = [60, 62, 64, 67];
  test.each([
    { i: 0, expected: 60 },
    { i: 3, expected: 67 },
    { i: 4, expected: 64 },
    { i: 5, expected: 67 },
    { i: 6, expected: 64 },
  ])("rung $i → $expected", ({ i, expected }) => {
    expect(climb(ladder, i)).toBe(expected);
  });
});

describe("notesFrom", () => {
  const note = (at: number): Note => ({
    voice: "hat",
    at,
    lengthInS: 0.05,
    frequency: 8000,
    volume: 1,
  });
  const score = [note(1), note(2), note(3)];
  test.each([
    { t: 0, expected: [1, 2, 3] },
    { t: 1.99, expected: [2, 3] },
    { t: 2, expected: [2, 3] },
    { t: 3.01, expected: [] },
  ])("from $t", ({ t, expected }) => {
    expect(notesFrom(score, t).map((kept) => kept.at)).toEqual([...expected]);
  });
});

describe("buildScore", () => {
  const score = buildScore({ skills: 20, projects: 12 });

  test("sorted by time", () => {
    expect(score.map((note) => note.at)).toEqual(
      score.map((note) => note.at).toSorted((a, b) => a - b),
    );
  });

  test("every note starts within a single play and is audible", () => {
    for (const note of score) {
      expect(note.at).toBeGreaterThanOrEqual(0);
      expect(note.at).toBeLessThan(END_CARD_IN_S);
      expect(note.lengthInS).toBeGreaterThan(0);
      expect(note.frequency).toBeGreaterThan(0);
    }
  });

  test("the fanfare ends by the end card", () => {
    const last = Math.max(...score.map((note) => note.at + note.lengthInS));
    expect(last).toBeLessThanOrEqual(END_CARD_IN_S);
  });

  // The loop never drops out on a cut: the bass plays twice a beat, from the burst to the final chord.
  test("the bass never stops between the burst and the final chord", () => {
    const bassTimes = score
      .filter((note) => note.voice === "bass" && note.at < FINAL_CHORD_IN_S)
      .map((note) => note.at);
    const expected = stepTimes(
      LOOP_START_IN_S,
      FINAL_CHORD_IN_S,
      2 * STEP_IN_S,
    );
    expect(bassTimes).toHaveLength(expected.length);
    bassTimes.forEach((time, i) => {
      expect(time).toBeCloseTo(expected[i] ?? Number.NaN);
    });
  });

  test("the final chord lands on a downbeat before the end card", () => {
    const bars =
      (FINAL_CHORD_IN_S - LOOP_START_IN_S) / (BAR_IN_STEPS * STEP_IN_S);
    expect(bars).toBeCloseTo(Math.round(bars));
    expect(FINAL_CHORD_IN_S).toBeLessThan(END_CARD_IN_S);
  });

  test("one pop per skill", () => {
    const more = buildScore({ skills: 21, projects: 12 });
    expect(more.length - score.length).toBe(1);
  });
});
