import { describe, expect, test } from "bun:test";
import dayjs from "dayjs";
import type { TimelineItem } from "./types";
import {
  durationInMonths,
  formatDuration,
  formatPeriod,
  reachedStopIndex,
  sortChronologically,
  trailProgress,
} from "./utils";

const NOW = dayjs("2026-09-24");

describe("durationInMonths", () => {
  test.each([
    { start: "2020-01-01", end: "2020-01-31", expected: 0 },
    { start: "2020-01-01", end: "2020-02-01", expected: 1 },
    { start: "2020-01-01", end: "2021-01-01", expected: 12 },
    { start: "2026-01-01", end: undefined, expected: 8 },
    { start: "2021-01-01", end: "2020-01-01", expected: 0 },
  ])("$start → $end is $expected month(s)", ({ start, end, expected }) => {
    expect(durationInMonths(start, end, NOW)).toBe(expected);
  });
});

describe("formatDuration", () => {
  test.each([
    { start: "2020-01-01", end: "2020-01-15", expected: "less than a month" },
    { start: "2020-01-01", end: "2020-02-01", expected: "1 month(s)" },
    { start: "2020-01-01", end: "2020-12-01", expected: "11 month(s)" },
    { start: "2020-01-01", end: "2021-01-01", expected: "1 year(s)" },
    {
      start: "2020-01-01",
      end: "2021-03-01",
      expected: "1 year(s) and 2 month(s)",
    },
  ])("$start → $end", ({ start, end, expected }) => {
    expect(formatDuration(start, end, NOW)).toBe(expected);
  });
});

describe("formatPeriod", () => {
  test.each([
    { start: "2011-07-01", end: "2012-07-01", expected: "Jul 2011 – Jul 2012" },
    { start: "2025-05-01", end: undefined, expected: "May 2025 – now" },
  ])("$start → $end", ({ start, end, expected }) => {
    expect(formatPeriod(start, end)).toBe(expected);
  });
});

describe("sortChronologically", () => {
  const item = (id: number, startDate: string): TimelineItem => ({
    id,
    title: "",
    entity: "",
    location: "",
    startDate,
    description: "",
    category: "experience",
  });

  test("orders by start date, oldest first, without mutating", () => {
    const input = [
      item(1, "2020-01-01"),
      item(2, "2009-09-01"),
      item(3, "2020-01-02"),
    ];
    expect(sortChronologically(input).map((i) => i.id)).toEqual([2, 1, 3]);
    expect(input.map((i) => i.id)).toEqual([1, 2, 3]);
  });
});

describe("reachedStopIndex", () => {
  const tops = [100, 300, 500];

  test.each([
    { anchorY: 50, expected: -1 },
    { anchorY: 99, expected: -1 },
    { anchorY: 100, expected: 0 },
    { anchorY: 299, expected: 0 },
    { anchorY: 300, expected: 1 },
    { anchorY: 900, expected: 2 },
  ])("anchor at $anchorY reaches stop $expected", ({ anchorY, expected }) => {
    expect(reachedStopIndex(tops, anchorY)).toBe(expected);
  });

  test("no stops reaches nothing", () => {
    expect(reachedStopIndex([], 500)).toBe(-1);
  });
});

describe("trailProgress", () => {
  test.each([
    { anchorY: 50, expected: 0 },
    { anchorY: 100, expected: 0 },
    { anchorY: 150, expected: 0.25 },
    { anchorY: 300, expected: 1 },
    { anchorY: 400, expected: 1 },
  ])("anchor at $anchorY gives $expected", ({ anchorY, expected }) => {
    expect(trailProgress({ trackTop: 100, trackHeight: 200, anchorY })).toBe(
      expected,
    );
  });

  test("a zero-height track is empty", () => {
    expect(trailProgress({ trackTop: 0, trackHeight: 0, anchorY: 10 })).toBe(0);
  });
});
