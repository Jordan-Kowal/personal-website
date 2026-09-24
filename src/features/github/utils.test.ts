import { describe, expect, test } from "bun:test";
import type { GitHubContribution } from "./types";
import {
  clampLevel,
  computeStreaks,
  monthStarts,
  orbitPosition,
  parseContributions,
  toWeeks,
} from "./utils";

const days = (counts: readonly number[], lastDate = "2026-09-24") => {
  const last = new Date(`${lastDate}T00:00:00Z`).getTime();
  const DAY_IN_MS = 86_400_000;
  return counts.map(
    (count, i): GitHubContribution => ({
      date: new Date(last - (counts.length - 1 - i) * DAY_IN_MS)
        .toISOString()
        .split("T")[0],
      count,
      level: clampLevel(count),
    }),
  );
};

describe("computeStreaks", () => {
  test.each([
    { name: "no data", counts: [], current: 0, longest: 0 },
    { name: "all zeros", counts: [0, 0, 0], current: 0, longest: 0 },
    {
      name: "active through today",
      counts: [0, 1, 2, 3],
      current: 3,
      longest: 3,
    },
    {
      name: "empty today keeps the streak",
      counts: [0, 1, 2, 0],
      current: 2,
      longest: 2,
    },
    {
      name: "empty yesterday breaks it",
      counts: [1, 1, 0, 1],
      current: 1,
      longest: 2,
    },
    {
      name: "longest run is in the past",
      counts: [1, 1, 1, 0, 1],
      current: 1,
      longest: 3,
    },
  ])("$name", ({ counts, current, longest }) => {
    expect(computeStreaks(days(counts), "2026-09-24")).toEqual({
      currentStreak: current,
      longestStreak: longest,
    });
  });

  test("a zero on a past last day still breaks the streak", () => {
    expect(computeStreaks(days([1, 1, 0], "2026-09-20"), "2026-09-24")).toEqual(
      {
        currentStreak: 0,
        longestStreak: 2,
      },
    );
  });
});

describe("clampLevel", () => {
  test.each([
    [-1, 0],
    [0, 0],
    [4, 4],
    [5, 4],
  ])("%p → %p", (input, expected) => {
    expect(clampLevel(input)).toBe(expected as GitHubContribution["level"]);
  });
});

describe("toWeeks", () => {
  test("pads the first week so it starts on Sunday", () => {
    // 2026-09-23 is a Wednesday: three empty slots first.
    const weeks = toWeeks(days([1, 2], "2026-09-24"));
    expect(weeks).toHaveLength(1);
    expect(weeks[0].slice(0, 3)).toEqual([null, null, null]);
    expect(weeks[0][3]?.date).toBe("2026-09-23");
  });

  test.each([
    { count: 7, weeks: 1 },
    { count: 8, weeks: 2 },
    { count: 14, weeks: 2 },
  ])("$count days from a Sunday make $weeks week(s)", ({ count, weeks }) => {
    // 2026-09-20 is a Sunday.
    const start = new Date("2026-09-20T00:00:00Z").getTime();
    const lastDate = new Date(start + (count - 1) * 86_400_000)
      .toISOString()
      .split("T")[0];
    expect(toWeeks(days(Array(count).fill(1), lastDate))).toHaveLength(weeks);
  });

  test("no data gives no weeks", () => {
    expect(toWeeks([])).toEqual([]);
  });
});

describe("monthStarts", () => {
  const day = (date: string) => ({ date, count: 1, level: 1 as const });

  test.each([
    { name: "no data", weeks: [], expected: [] },
    {
      name: "a month starting mid-week",
      weeks: [
        [null, day("2026-01-31")],
        [day("2026-02-01"), day("2026-02-02")],
      ],
      expected: [{ label: "Feb", column: 1, row: 0 }],
    },
    {
      name: "data starting on a 1st",
      weeks: [[day("2025-12-01")], [day("2026-01-01")]],
      expected: [
        { label: "Dec", column: 0, row: 0 },
        { label: "Jan", column: 1, row: 0 },
      ],
    },
    {
      name: "the 10th and 11th are not month starts",
      weeks: [[day("2026-03-10"), day("2026-03-11")]],
      expected: [],
    },
  ])("$name", ({ weeks, expected }) => {
    expect(monthStarts(weeks.map((week) => [...week]))).toEqual([...expected]);
  });
});

describe("orbitPosition", () => {
  test.each([
    { name: "straight above", azimuth: 0, polar: 0, expected: [0, 10, 0] },
    {
      name: "horizon, from +z",
      azimuth: 0,
      polar: Math.PI / 2,
      expected: [0, 0, 10],
    },
    {
      name: "horizon, from +x",
      azimuth: Math.PI / 2,
      polar: Math.PI / 2,
      expected: [10, 0, 0],
    },
    {
      name: "a full turn is back home",
      azimuth: Math.PI * 2,
      polar: Math.PI / 2,
      expected: [0, 0, 10],
    },
    {
      name: "below the board",
      azimuth: 0,
      polar: Math.PI,
      expected: [0, -10, 0],
    },
  ])("$name", ({ azimuth, polar, expected }) => {
    const position = orbitPosition({ azimuth, polar, radius: 10 });
    position.forEach((value, i) => {
      expect(value).toBeCloseTo(expected[i]);
    });
  });
});

describe("parseContributions", () => {
  const DAY: GitHubContribution = { date: "2026-09-24", count: 3, level: 2 };
  const CASES: {
    name: string;
    payload: unknown;
    expected: ReturnType<typeof parseContributions>;
  }[] = [
    {
      name: "keeps the used fields",
      payload: {
        contributions: [{ ...DAY, extra: 1 }],
        total: { lastYear: 7 },
      },
      expected: { contributions: [DAY], totalContributions: 7 },
    },
    {
      name: "clamps an out-of-range level",
      payload: {
        contributions: [{ ...DAY, level: 9 }],
        total: { lastYear: 3 },
      },
      expected: {
        contributions: [{ ...DAY, level: 4 }],
        totalContributions: 3,
      },
    },
    {
      name: "drops a malformed day",
      payload: {
        contributions: [DAY, { date: 1, count: "3", level: 2 }, null],
        total: { lastYear: 3 },
      },
      expected: { contributions: [DAY], totalContributions: 3 },
    },
    {
      name: "missing total counts as zero",
      payload: { contributions: [] },
      expected: { contributions: [], totalContributions: 0 },
    },
  ];

  test.each(CASES)("$name", ({ payload, expected }) => {
    expect(parseContributions(payload)).toEqual(expected);
  });

  test.each([
    { name: "null", payload: null },
    { name: "a string", payload: "oops" },
    { name: "no contributions", payload: { total: { lastYear: 1 } } },
    { name: "contributions not a list", payload: { contributions: {} } },
  ])("throws on $name", ({ payload }) => {
    expect(() => parseContributions(payload)).toThrow();
  });
});
