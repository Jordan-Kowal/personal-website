import { describe, expect, test } from "bun:test";
import { PIXEL_ICONS, pixelPath } from "./pixelIcons";

describe("pixelPath", () => {
  test.each([
    { name: "empty grid", rows: ["...", "..."], expected: "" },
    { name: "one pixel", rows: [".#."], expected: "M1 0h1v1h-1z" },
    {
      name: "a run is one rectangle",
      rows: ["###."],
      expected: "M0 0h3v1h-3z",
    },
    {
      name: "two runs on a row",
      rows: ["#.##"],
      expected: "M0 0h1v1h-1zM2 0h2v1h-2z",
    },
    {
      name: "rows stack down",
      rows: ["#", "#"],
      expected: "M0 0h1v1h-1zM0 1h1v1h-1z",
    },
    {
      name: "other marks are skipped",
      rows: ["#+#"],
      expected: "M0 0h1v1h-1zM2 0h1v1h-1z",
    },
  ])("$name", ({ rows, expected }) => {
    expect(pixelPath(rows, "#")).toBe(expected);
  });

  test("the lighter tone has its own mark", () => {
    expect(pixelPath(["#++"], "+")).toBe("M1 0h2v1h-2z");
  });
});

describe("PIXEL_ICONS", () => {
  test.each(Object.entries(PIXEL_ICONS))("%s is a 12×12 grid", (_, rows) => {
    expect(rows).toHaveLength(12);
    for (const row of rows) expect(row).toMatch(/^[#+.]{12}$/);
  });
});
