/** Deterministic noise in [-1, 1] from a 3D position, so vertices sharing a position move together. */
export const hashNoise = (x: number, y: number, z: number, seed: number) => {
  const value =
    Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.19) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

/**
 * Offsets every vertex of a position buffer by up to `amount` on each axis, in place.
 * Positions are rounded before hashing: the duplicated seam vertices of a three.js primitive then
 * get the same offset and the mesh stays closed. Vertices for which `isPinned(y)` holds stay put.
 */
export const jitterPositions = ({
  positions,
  amount,
  seed,
  isPinned = () => false,
}: {
  positions: Float32Array;
  amount: number;
  seed: number;
  isPinned?: (y: number) => boolean;
}) => {
  for (let i = 0; i < positions.length; i += 3) {
    const x = Math.round(positions[i] * 1000) / 1000;
    const y = Math.round(positions[i + 1] * 1000) / 1000;
    const z = Math.round(positions[i + 2] * 1000) / 1000;
    if (isPinned(y)) continue;
    positions[i] += hashNoise(x, y, z, seed) * amount;
    positions[i + 1] += hashNoise(y, z, x, seed + 1) * amount;
    positions[i + 2] += hashNoise(z, x, y, seed + 2) * amount;
  }
};

export type Lean = { x: number; z: number };

/**
 * Tilt that makes a tree bend away from the pointer, as rotations around x and z.
 * Full `maxAngle` when the pointer is on the tree, fading to zero at `radius`.
 */
export const computeLean = ({
  treeX,
  treeZ,
  pointerX,
  pointerZ,
  radius,
  maxAngle,
}: {
  treeX: number;
  treeZ: number;
  pointerX: number;
  pointerZ: number;
  radius: number;
  maxAngle: number;
}): Lean => {
  const dx = treeX - pointerX;
  const dz = treeZ - pointerZ;
  const distance = Math.hypot(dx, dz);
  if (distance >= radius || distance === 0) return { x: 0, z: 0 };
  const strength = (1 - distance / radius) * maxAngle;
  // Leaning toward +x is a negative rotation around z; toward +z is positive around x.
  return { x: (dz / distance) * strength, z: -(dx / distance) * strength };
};

export const WIDE_ASPECT = 1.2;
const MAX_DISTANCE_FACTOR = 1.9;

/** Camera distance that keeps the island framed: constant on wide screens, further back on tall ones. */
export const cameraDistance = (aspect: number, baseDistance: number) => {
  if (aspect >= WIDE_ASPECT) return baseDistance;
  const factor = Math.min(MAX_DISTANCE_FACTOR, (WIDE_ASPECT / aspect) ** 0.85);
  return baseDistance * factor;
};

/** Half the width the camera sees at `depth` units in front of it. */
export const visibleHalfWidth = ({
  fovDegrees,
  depth,
  aspect,
}: {
  fovDegrees: number;
  depth: number;
  aspect: number;
}) => Math.tan(((fovDegrees / 2) * Math.PI) / 180) * depth * aspect;

/** Folds any x back into [-halfSpan, halfSpan), so something drifting right comes back from the left. */
export const wrapAround = (x: number, halfSpan: number) => {
  const span = halfSpan * 2;
  return ((((x + halfSpan) % span) + span) % span) - halfSpan;
};

/**
 * A point on the side of an upright cone whose base is centred on the origin.
 * `offset` pushes it out from the surface, so what sits there is not swallowed by the slope.
 */
export const pointOnCone = ({
  radius,
  height,
  angle,
  y,
  offset = 0,
}: {
  radius: number;
  height: number;
  angle: number;
  y: number;
  offset?: number;
}): [number, number, number] => {
  const distance = radius * (1 - y / height) + offset;
  return [Math.cos(angle) * distance, y, Math.sin(angle) * distance];
};

/**
 * Pose of a cylinder bridging two points of a flat side view (x, y): its centre, its length, and
 * the turn around z that lays three's upright cylinder along the segment.
 */
export const segmentBetween = (
  from: [number, number],
  to: [number, number],
) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  return {
    center: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2] as [number, number],
    length: Math.hypot(dx, dy),
    rotationZ: Math.atan2(dy, dx) - Math.PI / 2,
  };
};

/** Turns from `from` to `to` by `progress` in [0, 1], the short way round, in radians. */
export const blendAngle = (from: number, to: number, progress: number) => {
  const turn = Math.PI * 2;
  const gap = ((((to - from + Math.PI) % turn) + turn) % turn) - Math.PI;
  return from + gap * progress;
};

/** Normalized device coordinates, [-1, 1] with y up, to pixels from the top left of a box. */
export const ndcToPixels = (
  point: { x: number; y: number },
  box: { width: number; height: number },
) => ({
  left: ((point.x + 1) / 2) * box.width,
  top: ((1 - point.y) / 2) * box.height,
});
