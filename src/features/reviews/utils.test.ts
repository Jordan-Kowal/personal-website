import { describe, expect, test } from "bun:test";
import { bringToFront, clampToTable, scatterLayout, wobble } from "./utils";

describe("wobble", () => {
  test.each([
    { index: 0, salt: 1 },
    { index: 5, salt: 2 },
    { index: 42, salt: 3 },
  ])("stays in [-1, 1] and is stable for $index/$salt", ({ index, salt }) => {
    const value = wobble(index, salt);
    expect(value).toBeGreaterThanOrEqual(-1);
    expect(value).toBeLessThanOrEqual(1);
    expect(wobble(index, salt)).toBe(value);
  });
});

describe("scatterLayout", () => {
  test.each([
    {
      name: "wide table, 3 columns",
      width: 1000,
      count: 6,
      columns: 3,
      rows: 2,
    },
    {
      name: "just too narrow for 3",
      width: 863,
      count: 6,
      columns: 2,
      rows: 3,
    },
    { name: "exactly 3 cards wide", width: 864, count: 6, columns: 3, rows: 2 },
    { name: "phone, 1 column", width: 350, count: 6, columns: 1, rows: 6 },
    {
      name: "narrower than a card still gets 1 column",
      width: 200,
      count: 2,
      columns: 1,
      rows: 2,
    },
    {
      name: "never past 3 columns",
      width: 3000,
      count: 6,
      columns: 3,
      rows: 2,
    },
  ])("$name", ({ width, count, columns, rows }) => {
    const { spots, height } = scatterLayout({
      count,
      width,
      cardWidth: 272,
      cardHeight: 200,
    });
    expect(spots).toHaveLength(count);
    expect(new Set(spots.map((spot) => Math.round(spot.y / 228))).size).toBe(
      rows,
    );
    expect(height).toBe(rows * 228 + 32);
    const firstRow = spots.filter((spot) => Math.round(spot.y / 228) === 0);
    expect(firstRow).toHaveLength(Math.min(columns, count));
  });

  test("a short last row is centred", () => {
    const { spots } = scatterLayout({
      count: 4,
      width: 900,
      cardWidth: 272,
      cardHeight: 200,
    });
    const lastCentre = spots[3].x + 136;
    expect(Math.abs(lastCentre - 450)).toBeLessThanOrEqual(26);
  });

  test("tilts stay within 6 degrees", () => {
    const { spots } = scatterLayout({
      count: 12,
      width: 1000,
      cardWidth: 272,
      cardHeight: 200,
    });
    for (const spot of spots)
      expect(Math.abs(spot.rotation)).toBeLessThanOrEqual(6);
  });
});

describe("clampToTable", () => {
  const table = {
    cardWidth: 100,
    cardHeight: 50,
    tableWidth: 500,
    tableHeight: 300,
  };

  test.each([
    { name: "inside stays", x: 120, y: 80, expected: { x: 120, y: 80 } },
    { name: "past the left and top", x: -40, y: -10, expected: { x: 0, y: 0 } },
    { name: "right edge flush", x: 400, y: 250, expected: { x: 400, y: 250 } },
    {
      name: "past the right and bottom",
      x: 401,
      y: 251,
      expected: { x: 400, y: 250 },
    },
  ])("$name", ({ x, y, expected }) => {
    expect(clampToTable({ x, y, ...table })).toEqual(expected);
  });

  test("a table smaller than the card pins it to the corner", () => {
    expect(
      clampToTable({
        x: 30,
        y: 30,
        cardWidth: 100,
        cardHeight: 50,
        tableWidth: 80,
        tableHeight: 40,
      }),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe("bringToFront", () => {
  test.each([
    { order: [0, 1, 2], index: 0, expected: [1, 2, 0] },
    { order: [0, 1, 2], index: 2, expected: [0, 1, 2] },
    { order: [2, 0, 1], index: 0, expected: [2, 1, 0] },
  ])(
    "$order with $index on top gives $expected",
    ({ order, index, expected }) => {
      expect(bringToFront([...order], index)).toEqual([...expected]);
    },
  );
});
