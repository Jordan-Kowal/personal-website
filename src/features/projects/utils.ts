import type { Project } from "./types";

/** Active projects first, archived after, each group keeping its data order. */
export const sortProjects = (projects: Project[], showArchived: boolean) =>
  projects
    .filter((project) => showArchived || !project.archived)
    .sort((a, b) => Number(a.archived) - Number(b.archived));

/** Screenshots ship with a `-thumb` sibling; paths in the data are relative to the site root. */
export const toThumbnailUrl = (screenshot: string) =>
  `/${screenshot.replace(/\.webp$/, "-thumb.webp")}`;

export const toScreenshotUrl = (screenshot: string) => `/${screenshot}`;

// Past the first neighbour, cards bunch up: each further one only moves this share of a spacing.
const FAR_SPACING_SHARE = 0.55;
const TURN_DEGREES = 40;
const DEPTH_PER_CARD_PX = 140;
const SCALE_LOSS_PER_CARD = 0.08;
const DEPTH_CAP = 3;
const FADE_START = 2;
const HIDDEN_BEYOND = 3.5;

export type CarouselPose = {
  /** Horizontal shift, in card spacings. */
  x: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
};

/**
 * Where a card sits in the carousel, `distance` cards away from the centre (negative is left).
 * Neighbours turn their face toward the centre card and sink back, like a hand of cards seen side on.
 */
export const carouselPose = (distance: number): CarouselPose => {
  const away = Math.abs(distance);
  const side = Math.sign(distance);
  const reach = away <= 1 ? away : 1 + (away - 1) * FAR_SPACING_SHARE;
  const depth = Math.min(away, DEPTH_CAP);
  return {
    x: side * reach,
    z: -depth * DEPTH_PER_CARD_PX,
    rotateY: -side * Math.min(away, 1) * TURN_DEGREES,
    scale: 1 - depth * SCALE_LOSS_PER_CARD,
    opacity:
      away >= HIDDEN_BEYOND ? 0 : 1 - Math.max(0, away - FADE_START) * 0.6,
  };
};

// How far a released drag keeps coasting, in seconds of its release speed.
const COAST_SECONDS = 0.25;

/**
 * The card a released drag settles on: where the carousel is, plus a coast in the direction it was thrown.
 * `velocity` is in cards per second.
 */
export const snapIndex = ({
  offset,
  velocity,
  count,
}: {
  offset: number;
  velocity: number;
  count: number;
}) => {
  const projected = Math.round(offset + velocity * COAST_SECONDS);
  return Math.min(Math.max(0, projected), Math.max(0, count - 1));
};
