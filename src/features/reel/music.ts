import { projectsData } from "@/features/projects/constants";
import { SKILLS, SkillCategory } from "@/features/skills/constants";
import {
  END_CARD_IN_S,
  INTRO_BURST_AT,
  LATEST_BADGE_DELAY_IN_S,
  MERGE_AT,
  ORB_DROP,
  popTimes,
  projectPinTimes,
  SCENES,
  SKILL_POPS,
} from "./timeline";

// The soundtrack as data: each note sits on the reel's clock in seconds, so the music follows `t`
// like the frames do. A loop plays from the first burst to the end card on one unbroken grid,
// and a few quiet effects sit on top of the moments worth hearing.

export type Voice =
  | "lead"
  | "arp"
  | "bass"
  | "kick"
  | "snare"
  | "hat"
  | "crash"
  | "whoosh";

export type Note = {
  voice: Voice;
  at: number;
  lengthInS: number;
  /** Pitch in Hz; for the noise voices, the cutoff of the filter shaping the noise. */
  frequency: number;
  /** The frequency it glides to by the end of the note. */
  slideTo?: number;
  /** 0-1, on top of the voice's own level. */
  volume: number;
};

type Drum = "kick" | "snare" | "hat" | "crash";
type Chord = readonly string[];

// A sixteenth note at 150 BPM: a bar lasts 1.6s.
export const STEP_IN_S = 0.1;
export const BAR_IN_STEPS = 16;
// The loop starts on the intro's burst, and its twelfth bar lands the final chord before the end card.
export const LOOP_START_IN_S = INTRO_BURST_AT;
export const FINAL_CHORD_IN_S = LOOP_START_IN_S + 12 * BAR_IN_STEPS * STEP_IN_S;
// The first bar is bass and arpeggio alone, the drums join on the second.
const DRUMS_START_IN_S = LOOP_START_IN_S + BAR_IN_STEPS * STEP_IN_S;
const KICK_STEPS = [0, 6, 8];
const SNARE_STEPS = [4, 12];
const PENTATONIC = [0, 2, 4, 7, 9];
const PITCH_CLASSES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const DRUMS: Record<Drum, Omit<Note, "voice" | "at" | "volume">> = {
  kick: { lengthInS: 0.14, frequency: 160, slideTo: 40 },
  snare: { lengthInS: 0.12, frequency: 1800 },
  hat: { lengthInS: 0.035, frequency: 8000 },
  crash: { lengthInS: 0.9, frequency: 5000 },
};
// I-vi-IV-V, one chord per bar, round and round.
const CHORDS: readonly Chord[] = [
  ["C4", "E4", "G4"],
  ["A3", "C4", "E4"],
  ["F3", "A3", "C4"],
  ["G3", "B3", "D4"],
];
const EFFECT_VOLUME = 0.4;

// Each wipe covers the stage fully on its cut; the whoosh swells up to it.
const WHOOSH_IN_S = 0.3;

export type ScoreCounts = { skills: number; projects: number };

/** MIDI number of a note name such as `C4` (60), `F#5` or `Bb3`. */
export const midiOf = (name: string): number => {
  const match = /^([A-G])([#b]?)(\d)$/.exec(name);
  if (!match) throw new Error(`Not a note name: ${name}`);
  const [, letter = "C", accidental, octave] = match;
  const shift = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  return 12 * (Number(octave) + 1) + (PITCH_CLASSES[letter] ?? 0) + shift;
};

export const frequencyOf = (midi: number): number =>
  440 * 2 ** ((midi - 69) / 12);

/** Every `stepInS` from `from` (included) up to `to` (excluded). */
export const stepTimes = (
  from: number,
  to: number,
  stepInS: number,
): number[] =>
  Array.from(
    { length: Math.max(0, Math.ceil((to - from) / stepInS - 1e-9)) },
    (_, i) => from + i * stepInS,
  );

/** `count` MIDI notes climbing the major pentatonic scale from `root`. */
export const pentatonicLadder = (root: number, count: number): number[] =>
  Array.from(
    { length: count },
    (_, i) =>
      root +
      12 * Math.floor(i / PENTATONIC.length) +
      (PENTATONIC[i % PENTATONIC.length] ?? 0),
  );

/** The `i`th rung of a climb: up the ladder, then trilling on its two top rungs. */
export const climb = (ladder: readonly number[], i: number): number => {
  const top = ladder.length - 1;
  const rung = i <= top ? i : top - ((i - top) % 2);
  return ladder[Math.max(0, rung)] ?? 0;
};

/** Notes starting at or after `t`, the ones to schedule when playback starts there. */
export const notesFrom = (score: readonly Note[], t: number): Note[] =>
  score.filter((note) => note.at >= t);

const hit = (voice: Drum, at: number, volume = 1): Note => ({
  voice,
  at,
  volume,
  ...DRUMS[voice],
});

const tone = ({
  voice,
  at,
  midi,
  lengthInS,
  volume = 1,
}: {
  voice: Voice;
  at: number;
  midi: number;
  lengthInS: number;
  volume?: number;
}): Note => ({
  voice,
  at,
  lengthInS,
  volume,
  frequency: frequencyOf(midi),
});

const whoosh = (cut: number): Note => ({
  voice: "whoosh",
  at: cut - WHOOSH_IN_S,
  lengthInS: WHOOSH_IN_S,
  frequency: 300,
  slideTo: 4000,
  volume: EFFECT_VOLUME,
});

/** The loop's step count at `at`: the one grid every layer of the loop is read from. */
const stepAt = (at: number): number =>
  Math.round((at - LOOP_START_IN_S) / STEP_IN_S);

const chordAt = (step: number): Chord =>
  CHORDS[Math.floor(step / BAR_IN_STEPS) % CHORDS.length] ?? [];

/** The root bouncing between two octaves, twice a beat. */
const bassLine = (): Note[] =>
  stepTimes(LOOP_START_IN_S, FINAL_CHORD_IN_S, 2 * STEP_IN_S).map((at) => {
    const step = stepAt(at);
    const root = midiOf(chordAt(step)[0] ?? "C4");
    return tone({
      voice: "bass",
      at,
      midi: root - (step % 4 === 0 ? 24 : 12),
      lengthInS: STEP_IN_S * 1.8,
    });
  });

/** The chord's notes cycled every step: the chiptune stand-in for a held chord. */
const arpeggio = (): Note[] =>
  stepTimes(LOOP_START_IN_S, FINAL_CHORD_IN_S, STEP_IN_S).map((at) => {
    const step = stepAt(at);
    const chord = chordAt(step);
    return tone({
      voice: "arp",
      at,
      midi: midiOf(chord[step % chord.length] ?? "C4") + 12,
      lengthInS: STEP_IN_S * 0.9,
    });
  });

const drums = (): Note[] =>
  stepTimes(DRUMS_START_IN_S, FINAL_CHORD_IN_S, STEP_IN_S).flatMap((at) => {
    const step = stepAt(at) % BAR_IN_STEPS;
    return [
      ...(KICK_STEPS.includes(step) ? [hit("kick", at, 0.6)] : []),
      ...(SNARE_STEPS.includes(step) ? [hit("snare", at, 0.5)] : []),
      ...(step % 2 === 0 ? [hit("hat", at, step % 4 === 0 ? 0.5 : 0.3)] : []),
    ];
  });

/** The home chord held from its downbeat to the end card, where a single play stops. */
const finalChord = (): Note[] => {
  const lengthInS = END_CARD_IN_S - FINAL_CHORD_IN_S - 0.05;
  const chord = CHORDS[0] ?? [];
  return [
    hit("kick", FINAL_CHORD_IN_S, 0.6),
    { ...hit("crash", FINAL_CHORD_IN_S, EFFECT_VOLUME), lengthInS },
    tone({
      voice: "bass",
      at: FINAL_CHORD_IN_S,
      midi: midiOf(chord[0] ?? "C4") - 24,
      lengthInS,
    }),
    ...chord.map((name) =>
      tone({
        voice: "arp",
        at: FINAL_CHORD_IN_S,
        midi: midiOf(name) + 12,
        lengthInS,
      }),
    ),
  ];
};

const effects = ({ skills, projects }: ScoreCounts): Note[] => {
  const popAt = popTimes(skills, SKILL_POPS.start, SKILL_POPS.pace);
  const ladder = pentatonicLadder(midiOf("C5"), 12);
  // The "LATEST" badge on the newest polaroid.
  const badgeAt =
    projectPinTimes(projects - 1).newest + LATEST_BADGE_DELAY_IN_S;
  return [
    hit("crash", LOOP_START_IN_S, EFFECT_VOLUME),
    whoosh(SCENES.skills.start),
    ...popAt.map((at, i) =>
      tone({
        voice: "lead",
        at,
        midi: climb(ladder, i),
        lengthInS: 0.06,
        volume: EFFECT_VOLUME,
      }),
    ),
    hit("crash", ORB_DROP.end, EFFECT_VOLUME),
    whoosh(SCENES.projects.start),
    tone({
      voice: "lead",
      at: badgeAt,
      midi: midiOf("C6"),
      lengthInS: 0.08,
      volume: EFFECT_VOLUME,
    }),
    tone({
      voice: "lead",
      at: badgeAt + 0.08,
      midi: midiOf("G6"),
      lengthInS: 0.2,
      volume: EFFECT_VOLUME,
    }),
    whoosh(SCENES.experience.start),
    hit("crash", MERGE_AT, EFFECT_VOLUME),
    whoosh(SCENES.outro.start),
  ];
};

/** The whole soundtrack, sorted by time. Counts drive the pops, as they drive the icons and polaroids. */
export const buildScore = (counts: ScoreCounts): Note[] =>
  [
    ...bassLine(),
    ...arpeggio(),
    ...drums(),
    ...finalChord(),
    ...effects(counts),
  ].toSorted((a, b) => a.at - b.at);

export const SCORE: readonly Note[] = buildScore({
  skills: Object.values(SKILLS).filter(
    (skill) => skill.category !== SkillCategory.AI,
  ).length,
  projects: projectsData.length,
});
