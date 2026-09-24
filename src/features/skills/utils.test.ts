import { describe, expect, test } from "bun:test";
import { SKILL_GROUPS, SkillName } from "./constants";
import { SKILL_ICONS } from "./icons";
import {
  bagCapacity,
  inlayColor,
  layoutOffset,
  liftColor,
  relativeLuminance,
  tiltToward,
} from "./utils";

describe("bagCapacity", () => {
  test.each([
    { itemCount: 0, expected: 5 },
    { itemCount: 4, expected: 5 },
    { itemCount: 5, expected: 10 },
    { itemCount: 9, expected: 10 },
    { itemCount: 10, expected: 15 },
    { itemCount: 18, expected: 20 },
  ])(
    "$itemCount items in rows of 5 gives $expected slots",
    ({ itemCount, expected }) => {
      expect(bagCapacity(itemCount, 5)).toBe(expected);
    },
  );
});

describe("relativeLuminance", () => {
  test.each([
    { hex: "#000000", expected: 0 },
    { hex: "#ffffff", expected: 1 },
    { hex: "#808080", expected: 0.2159 },
  ])("$hex gives $expected", ({ hex, expected }) => {
    expect(relativeLuminance(hex)).toBeCloseTo(expected, 3);
  });
});

describe("inlayColor", () => {
  test.each([
    {
      name: "JavaScript yellow gets dark letters",
      hex: "#F7DF1E",
      expected: "#15110d",
    },
    {
      name: "CSS purple gets light letters",
      hex: "#663399",
      expected: "#f4ede4",
    },
    {
      name: "just above the threshold is dark",
      hex: "#9b9b9b",
      expected: "#15110d",
    },
    {
      name: "just below the threshold is light",
      hex: "#929292",
      expected: "#f4ede4",
    },
  ])("$name", ({ hex, expected }) => {
    expect(inlayColor(hex)).toBe(expected);
  });
});

describe("liftColor", () => {
  test.each([
    {
      name: "a bright colour is kept",
      hex: "#ffc83d",
      minLuminance: 0.2,
      isSame: true,
    },
    {
      name: "black is lifted",
      hex: "#000000",
      minLuminance: 0.2,
      isSame: false,
    },
    {
      name: "a dark green is lifted",
      hex: "#092e20",
      minLuminance: 0.2,
      isSame: false,
    },
  ])("$name", ({ hex, minLuminance, isSame }) => {
    const lifted = liftColor({ hex, minLuminance });
    expect(relativeLuminance(lifted)).toBeGreaterThanOrEqual(minLuminance);
    expect(lifted === hex).toBe(isSame);
  });

  test("an unreachable target falls back to the mix colour", () => {
    expect(
      liftColor({ hex: "#000000", minLuminance: 2, towards: "#ffffff" }),
    ).toBe("#ffffff");
  });
});

describe("SKILL_ICONS", () => {
  test("every skill shown in a bag has an icon", () => {
    const names = new Set<string>(Object.values(SkillName));
    for (const group of SKILL_GROUPS) {
      for (const skill of group.skills) {
        expect(names.has(skill.label)).toBe(true);
        expect(SKILL_ICONS[skill.label]).toBeDefined();
      }
    }
  });
});

describe("tiltToward", () => {
  test.each([
    { name: "on the item", dx: 0, dy: 0, expected: { x: 0, y: 0 } },
    {
      name: "half reach to the right",
      dx: 50,
      dy: 0,
      expected: { x: 0, y: 0.25 },
    },
    { name: "at reach, below", dx: 0, dy: 100, expected: { x: 0.5, y: 0 } },
    {
      name: "past reach, up left",
      dx: -300,
      dy: -300,
      expected: { x: -0.5, y: -0.5 },
    },
  ])("$name", ({ dx, dy, expected }) => {
    const tilt = tiltToward({ dx, dy, reach: 100, maxAngle: 0.5 });
    expect(tilt.x).toBeCloseTo(expected.x);
    expect(tilt.y).toBeCloseTo(expected.y);
  });
});

describe("layoutOffset", () => {
  const board = { offsetLeft: 100, offsetTop: 50, offsetParent: null };
  const bag = { offsetLeft: 20, offsetTop: 10, offsetParent: board };
  const slot = { offsetLeft: 5, offsetTop: 7, offsetParent: bag };
  test.each([
    {
      name: "the ancestor itself is at its origin",
      element: board,
      expected: { x: 0, y: 0 },
    },
    { name: "a direct child", element: bag, expected: { x: 20, y: 10 } },
    {
      name: "offsets add up through the chain",
      element: slot,
      expected: { x: 25, y: 17 },
    },
  ])("$name", ({ element, expected }) => {
    expect(layoutOffset(element, board)).toEqual(expected);
  });

  test("an ancestor outside the chain sums up to the root", () => {
    expect(layoutOffset(slot, {})).toEqual({ x: 125, y: 67 });
  });
});
