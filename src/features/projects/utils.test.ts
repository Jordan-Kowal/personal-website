import { describe, expect, test } from "bun:test";
import type { Project } from "./types";
import {
  carouselPose,
  snapIndex,
  sortProjects,
  toScreenshotUrl,
  toThumbnailUrl,
} from "./utils";

const makeProject = (id: number, archived: boolean): Project => ({
  id,
  name: `project-${id}`,
  description: "",
  githubUrl: undefined,
  websiteUrl: undefined,
  screenshots: [],
  archived,
  skills: [],
});

describe("sortProjects", () => {
  const projects = [
    makeProject(1, true),
    makeProject(2, false),
    makeProject(3, true),
    makeProject(4, false),
  ];

  test.each([
    { showArchived: true, expected: [2, 4, 1, 3] },
    { showArchived: false, expected: [2, 4] },
  ])(
    "showArchived=$showArchived gives $expected",
    ({ showArchived, expected }) => {
      expect(sortProjects(projects, showArchived).map((p) => p.id)).toEqual([
        ...expected,
      ]);
    },
  );

  test("does not mutate the input", () => {
    const input = [...projects];
    sortProjects(input, true);
    expect(input.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });
});

describe("carouselPose", () => {
  test.each([
    { distance: 0, expected: { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 1 } },
    {
      distance: 1,
      expected: { x: 1, z: -140, rotateY: -40, scale: 0.92, opacity: 1 },
    },
    {
      distance: -1,
      expected: { x: -1, z: -140, rotateY: 40, scale: 0.92, opacity: 1 },
    },
    {
      distance: 0.5,
      expected: { x: 0.5, z: -70, rotateY: -20, scale: 0.96, opacity: 1 },
    },
    {
      distance: 2,
      expected: { x: 1.55, z: -280, rotateY: -40, scale: 0.84, opacity: 1 },
    },
    {
      distance: 3,
      expected: { x: 2.1, z: -420, rotateY: -40, scale: 0.76, opacity: 0.4 },
    },
    {
      distance: 3.49,
      expected: {
        x: 2.3695,
        z: -420,
        rotateY: -40,
        scale: 0.76,
        opacity: 0.106,
      },
    },
    {
      distance: -3.5,
      expected: { x: -2.375, z: -420, rotateY: 40, scale: 0.76, opacity: 0 },
    },
  ])("$distance cards away", ({ distance, expected }) => {
    const pose = carouselPose(distance);
    for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
      expect(pose[key]).toBeCloseTo(expected[key]);
    }
  });
});

describe("snapIndex", () => {
  test.each([
    { name: "at rest on a card", offset: 2, velocity: 0, expected: 2 },
    { name: "just under half way", offset: 2.49, velocity: 0, expected: 2 },
    { name: "half way rounds up", offset: 2.5, velocity: 0, expected: 3 },
    {
      name: "a flick coasts one card on",
      offset: 2.1,
      velocity: 3,
      expected: 3,
    },
    { name: "a flick back", offset: 2.1, velocity: -3, expected: 1 },
    { name: "never before the first", offset: 0.2, velocity: -20, expected: 0 },
    { name: "never past the last", offset: 4.8, velocity: 20, expected: 5 },
  ])("$name", ({ offset, velocity, expected }) => {
    expect(snapIndex({ offset, velocity, count: 6 })).toBe(expected);
  });

  test("an empty carousel stays on 0", () => {
    expect(snapIndex({ offset: 0, velocity: 5, count: 0 })).toBe(0);
  });
});

describe("screenshot urls", () => {
  test.each([
    {
      input: "screenshots/grove-1.webp",
      thumb: "/screenshots/grove-1-thumb.webp",
    },
    {
      input: "screenshots/a.webp.webp",
      thumb: "/screenshots/a.webp-thumb.webp",
    },
  ])("$input", ({ input, thumb }) => {
    expect(toThumbnailUrl(input)).toBe(thumb);
    expect(toScreenshotUrl(input)).toBe(`/${input}`);
  });
});
