import { describe, expect, test } from "bun:test";
import {
  cameraDistance,
  computeLean,
  hashNoise,
  jitterPositions,
  pointOnCone,
  segmentBetween,
  visibleHalfWidth,
  wrapAround,
} from "./islandMath";

describe("hashNoise", () => {
  test.each([
    [0, 0, 0, 1],
    [1.5, -2, 3, 7],
    [100, 200, 300, 42],
  ])(
    "stays in [-1, 1] and is stable for (%p, %p, %p, seed %p)",
    (x, y, z, seed) => {
      const value = hashNoise(x, y, z, seed);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
      expect(hashNoise(x, y, z, seed)).toBe(value);
    },
  );
});

describe("jitterPositions", () => {
  const cases: {
    name: string;
    amount: number;
    isPinned?: (y: number) => boolean;
    expectMoved: boolean;
  }[] = [
    {
      name: "zero amount leaves positions untouched",
      amount: 0,
      expectMoved: false,
    },
    { name: "positive amount moves positions", amount: 0.2, expectMoved: true },
    {
      name: "pinned vertices stay put",
      amount: 0.2,
      isPinned: () => true,
      expectMoved: false,
    },
  ];

  test.each(cases)("$name", ({ amount, isPinned, expectMoved }) => {
    const original = [1, 2, 3, -1, 0.5, 4];
    const positions = new Float32Array(original);
    jitterPositions({ positions, amount, seed: 3, isPinned });
    expect([...positions].some((value, i) => value !== original[i])).toBe(
      expectMoved,
    );
  });

  test("duplicated vertices get the same offset so seams stay closed", () => {
    const positions = new Float32Array([1, 2, 3, 1, 2, 3]);
    jitterPositions({ positions, amount: 0.3, seed: 5 });
    expect([...positions.slice(0, 3)]).toEqual([...positions.slice(3, 6)]);
  });

  test("never moves a vertex further than the amount on any axis", () => {
    const positions = new Float32Array([0.3, -1.2, 2.7]);
    jitterPositions({ positions, amount: 0.1, seed: 9 });
    [0.3, -1.2, 2.7].forEach((value, i) => {
      expect(Math.abs(positions[i] - value)).toBeLessThanOrEqual(0.1 + 1e-6);
    });
  });
});

describe("computeLean", () => {
  const base = { treeX: 0, treeZ: 0, radius: 2, maxAngle: 0.4 };
  const cases = [
    {
      name: "pointer on the tree",
      pointerX: 0,
      pointerZ: 0,
      expected: { x: 0, z: 0 },
    },
    {
      name: "pointer at the radius",
      pointerX: 2,
      pointerZ: 0,
      expected: { x: 0, z: 0 },
    },
    {
      name: "pointer beyond the radius",
      pointerX: 3,
      pointerZ: 0,
      expected: { x: 0, z: 0 },
    },
    {
      name: "pointer just inside the radius on +x",
      pointerX: 1.9,
      pointerZ: 0,
      expected: { x: 0, z: 0.02 },
    },
    {
      name: "pointer halfway on +x leans toward -x",
      pointerX: 1,
      pointerZ: 0,
      expected: { x: 0, z: 0.2 },
    },
    {
      name: "pointer halfway on +z leans toward -z",
      pointerX: 0,
      pointerZ: 1,
      expected: { x: -0.2, z: 0 },
    },
  ];

  test.each(cases)("$name", ({ pointerX, pointerZ, expected }) => {
    const lean = computeLean({ ...base, pointerX, pointerZ });
    expect(lean.x).toBeCloseTo(expected.x, 5);
    expect(lean.z).toBeCloseTo(expected.z, 5);
  });
});

describe("cameraDistance", () => {
  test.each([
    { aspect: 2, expected: 10 },
    { aspect: 1.2, expected: 10 },
    { aspect: 1.19, expected: 10 * (1.2 / 1.19) ** 0.85 },
    { aspect: 0.6, expected: 10 * 2 ** 0.85 },
    { aspect: 0.2, expected: 19 },
  ])("aspect $aspect gives $expected", ({ aspect, expected }) => {
    expect(cameraDistance(aspect, 10)).toBeCloseTo(expected, 5);
  });
});

describe("visibleHalfWidth", () => {
  test.each([
    { fovDegrees: 90, depth: 10, aspect: 1, expected: 10 },
    { fovDegrees: 90, depth: 10, aspect: 2, expected: 20 },
    { fovDegrees: 90, depth: 0, aspect: 2, expected: 0 },
  ])(
    "fov $fovDegrees at depth $depth, aspect $aspect gives $expected",
    ({ fovDegrees, depth, aspect, expected }) => {
      expect(visibleHalfWidth({ fovDegrees, depth, aspect })).toBeCloseTo(
        expected,
      );
    },
  );
});

describe("wrapAround", () => {
  test.each([
    { x: 0, expected: 0 },
    { x: 9.99, expected: 9.99 },
    { x: 10, expected: -10 },
    { x: 12, expected: -8 },
    { x: -10, expected: -10 },
    { x: -10.5, expected: 9.5 },
    { x: 45, expected: 5 },
  ])("$x in a half span of 10 gives $expected", ({ x, expected }) => {
    expect(wrapAround(x, 10)).toBeCloseTo(expected);
  });
});

describe("pointOnCone", () => {
  test.each([
    { name: "base, facing +x", angle: 0, y: 0, offset: 0, expected: [2, 0, 0] },
    { name: "half way up", angle: 0, y: 2, offset: 0, expected: [1, 2, 0] },
    { name: "apex", angle: 0, y: 4, offset: 0, expected: [0, 4, 0] },
    {
      name: "facing +z, pushed out",
      angle: Math.PI / 2,
      y: 0,
      offset: 0.5,
      expected: [0, 0, 2.5],
    },
  ])("$name", ({ angle, y, offset, expected }) => {
    const point = pointOnCone({ radius: 2, height: 4, angle, y, offset });
    point.forEach((value, i) => {
      expect(value).toBeCloseTo(expected[i]);
    });
  });
});

describe("segmentBetween", () => {
  test.each([
    {
      name: "upright segment needs no turn",
      from: [0, 0],
      to: [0, 2],
      expected: { center: [0, 1], length: 2, rotationZ: 0 },
    },
    {
      name: "segment along +x turns a quarter clockwise",
      from: [-1, 0],
      to: [1, 0],
      expected: { center: [0, 0], length: 2, rotationZ: -Math.PI / 2 },
    },
    {
      name: "diagonal segment",
      from: [0, 0],
      to: [3, 4],
      expected: {
        center: [1.5, 2],
        length: 5,
        rotationZ: Math.atan2(4, 3) - Math.PI / 2,
      },
    },
    {
      name: "zero-length segment",
      from: [1, 1],
      to: [1, 1],
      expected: { center: [1, 1], length: 0, rotationZ: -Math.PI / 2 },
    },
  ] as const)("$name", ({ from, to, expected }) => {
    const segment = segmentBetween([...from], [...to]);
    expect(segment.center[0]).toBeCloseTo(expected.center[0]);
    expect(segment.center[1]).toBeCloseTo(expected.center[1]);
    expect(segment.length).toBeCloseTo(expected.length);
    expect(segment.rotationZ).toBeCloseTo(expected.rotationZ);
  });
});
