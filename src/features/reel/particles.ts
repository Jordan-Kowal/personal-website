import { DURATION_IN_S, easeOutExpo, random, STAGE, wrap } from "./timeline";

export type ParticleShape = "pixel" | "plus" | "ring" | "bar";

export type Particle = {
  x: number;
  y: number;
  rotation: number;
  size: number;
  opacity: number;
  shape: ParticleShape;
  color: string;
};

export type Burst = {
  x: number;
  y: number;
  start: number;
  count: number;
  reachInPx: number;
  seed: number;
};

export type Mote = { x: number; y: number; size: number; opacity: number };

export const BURST_LIFE_IN_S = 1.6;
const GRAVITY_IN_PX = 90;
const SHAPES: readonly ParticleShape[] = ["pixel", "plus", "ring", "bar"];
const COLORS: readonly string[] = [
  "var(--color-accent)",
  "var(--color-accent)",
  "var(--color-accent-deep)",
  "var(--color-star)",
  "var(--color-training)",
  "var(--color-ink)",
];

/** Confetti flung out of one point, slowing down, sagging, then fading. Empty outside its life. */
export const burstParticles = (burst: Burst, t: number): Particle[] => {
  const age = t - burst.start;
  if (age < 0 || age >= BURST_LIFE_IN_S) return [];
  const life = age / BURST_LIFE_IN_S;
  const travel = easeOutExpo(Math.min(1, life * 1.6));
  return Array.from({ length: burst.count }, (_, i) => {
    const seed = burst.seed * 1000 + i * 10;
    const angle = random(seed + 1) * Math.PI * 2;
    const distance = burst.reachInPx * (0.3 + 0.7 * random(seed + 2));
    return {
      x: burst.x + Math.cos(angle) * distance * travel,
      y:
        burst.y +
        Math.sin(angle) * distance * travel +
        life ** 2 * GRAVITY_IN_PX,
      rotation: (random(seed + 3) - 0.5) * 720 * life,
      size: 8 + random(seed + 4) * 14,
      opacity: life < 0.55 ? 1 : 1 - (life - 0.55) / 0.45,
      shape: SHAPES[Math.floor(random(seed + 5) * SHAPES.length)] ?? "pixel",
      color:
        COLORS[Math.floor(random(seed + 6) * COLORS.length)] ?? COLORS[0] ?? "",
    };
  });
};

/**
 * Specks drifting up behind every scene.
 * Each travels a whole number of stage heights and twinkles a whole number of times per reel, so the last frame joins the first.
 */
export const driftingMotes = (count: number, t: number): Mote[] =>
  Array.from({ length: count }, (_, i) => {
    const seed = i * 7;
    const loops = 1 + Math.floor(random(seed + 1) * 2);
    const twinkles = 3 + Math.floor(random(seed + 2) * 4);
    const phase = random(seed + 3) * Math.PI * 2;
    const rise = (t / DURATION_IN_S) * loops * STAGE.height;
    return {
      x: random(seed + 4) * STAGE.width,
      y: wrap(random(seed + 5) * STAGE.height - rise, STAGE.height),
      size: 3 + Math.floor(random(seed + 6) * 3) * 2,
      opacity:
        0.15 +
        0.25 *
          (1 + Math.sin((t / DURATION_IN_S) * twinkles * Math.PI * 2 + phase)),
    };
  });
