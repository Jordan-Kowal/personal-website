// Every frame of the reel is a pure function of `t` (seconds), so a given `t` always renders the
// same picture: the player can scrub, and a recorder can capture frame by frame.

export const DURATION_IN_S = 21;
export const FPS = 30;
export const STAGE = { width: 1920, height: 1080 } as const;

export type Scene = "intro" | "skills" | "projects" | "experience" | "outro";

// Windows may overlap: during a whip pan both scenes are on screen at once.
export const SCENES: Record<Scene, { start: number; end: number }> = {
  intro: { start: 0, end: 3.05 },
  skills: { start: 3.05, end: 8.15 },
  projects: { start: 8.15, end: 12.4 },
  experience: { start: 12, end: 17.9 },
  outro: { start: 17.9, end: DURATION_IN_S },
};
// The end card in full, just before it collapses back into the first frame: a single play stops here.
export const END_CARD_IN_S = SCENES.outro.start + 2.4;

// Moments both a scene and the soundtrack land on: set once here, so moving one moves its sound too.
export const INTRO_BURST_AT = 0.45;
export const SKILL_POPS: { start: number; pace: Pace } = {
  start: 3.6,
  // "1 ... 2 .. 3 . 456789": slow enough to read the first names, one per frame by the end.
  pace: { firstGapInS: 0.42, decay: 0.72, minGapInS: 1 / 30 },
};
export const ORB_DROP = { start: 6.15, end: 6.45 };
export const PROJECT_PINS: { start: number; pace: Pace } = {
  start: 8.75,
  pace: { firstGapInS: 0.3, decay: 0.8, minGapInS: 0.07 },
};
// The newest project drops this long after the last older one, and its badge pops this long after that.
export const NEWEST_PIN_DELAY_IN_S = 0.45;
export const LATEST_BADGE_DELAY_IN_S = 0.35;
// A full second after the experience ticker ends, so the finished role lists can be read.
export const MERGE_AT = 15.8;

export const SCENE_ORDER: readonly Scene[] = [
  "intro",
  "skills",
  "projects",
  "experience",
  "outro",
];

export type Pace = {
  firstGapInS: number;
  /** Each gap is the previous one times this. */
  decay: number;
  minGapInS: number;
};

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

export const lerp = (from: number, to: number, x: number): number =>
  from + (to - from) * x;

/** Where `t` sits between `start` and `end`, clamped to 0-1. */
export const progress = (t: number, start: number, end: number): number =>
  clamp01((t - start) / (end - start));

/** Matches `--ease-arrive`: fast start, long settle. */
export const easeOutExpo = (x: number): number =>
  x >= 1 ? 1 : 1 - 2 ** (-10 * x);

/** Matches `--ease-spring`: slight overshoot past 1 before settling. */
export const easeOutBack = (x: number): number => {
  const overshoot = 1.70158;
  return 1 + (overshoot + 1) * (x - 1) ** 3 + overshoot * (x - 1) ** 2;
};

export const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;

/** The scene the HUD names: the last one to have started. */
export const sceneAt = (t: number): Scene =>
  SCENE_ORDER.findLast((scene) => SCENES[scene].start <= t) ?? "intro";

/** Every scene on screen at `t`, more than one during an overlap. */
export const visibleScenes = (t: number): Scene[] =>
  SCENE_ORDER.filter(
    (scene) => SCENES[scene].start <= t && t < SCENES[scene].end,
  );

/** Times at which `count` items appear from `start`, each gap shorter than the previous one. */
export const popTimes = (
  count: number,
  start: number,
  pace: Pace,
): number[] => {
  const times: number[] = [];
  let time = start;
  let gap = pace.firstGapInS;
  for (let i = 0; i < count; i++) {
    times.push(time);
    time += gap;
    gap = Math.max(pace.minGapInS, gap * pace.decay);
  }
  return times;
};

/** When each of `olderCount` projects is pinned, then the newest one, a beat after the rest. */
export const projectPinTimes = (
  olderCount: number,
): { older: number[]; newest: number } => {
  const older = popTimes(olderCount, PROJECT_PINS.start, PROJECT_PINS.pace);
  return {
    older,
    newest: (older.at(-1) ?? PROJECT_PINS.start) + NEWEST_PIN_DELAY_IN_S,
  };
};

/** How many of the sorted `times` have been reached at `t`. */
export const reachedCount = (t: number, times: readonly number[]): number =>
  times.filter((time) => time <= t).length;

/** The first `x` share of `text`, as typed out by a cursor. */
export const typedText = (text: string, x: number): string =>
  text.slice(0, Math.round(text.length * clamp01(x)));

/** `value` wrapped into 0 to `size`, negatives included. */
export const wrap = (value: number, size: number): number =>
  ((value % size) + size) % size;

/** Stable pseudo-random in 0-1: the same seed always gives the same value, frame after frame. */
export const random = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
