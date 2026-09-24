import dayjs from "dayjs";
import type { TimelineItem } from "./types";

/** Whole months between the two dates; an open-ended item runs until `now`. */
export const durationInMonths = (
  startDate: string,
  endDate: string | undefined,
  now = dayjs(),
): number => {
  const end = endDate ? dayjs(endDate) : now;
  return Math.max(0, end.diff(dayjs(startDate), "month"));
};

export const formatDuration = (
  startDate: string,
  endDate?: string,
  now = dayjs(),
): string => {
  const totalMonths = durationInMonths(startDate, endDate, now);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year(s)`);
  if (months > 0) parts.push(`${months} month(s)`);
  return parts.length > 0 ? parts.join(" and ") : "less than a month";
};

export const formatPeriod = (startDate: string, endDate?: string): string => {
  const start = dayjs(startDate).format("MMM YYYY");
  return `${start} – ${endDate ? dayjs(endDate).format("MMM YYYY") : "now"}`;
};

/** Oldest first: the map starts at level 1. */
export const sortChronologically = (items: TimelineItem[]) =>
  [...items].sort(
    (a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf(),
  );

/**
 * Index of the last stop whose top is above `anchorY`, or -1 when none is reached yet.
 * `stopTops` are viewport coordinates, in the order the stops appear.
 */
export const reachedStopIndex = (stopTops: number[], anchorY: number) => {
  let reached = -1;
  stopTops.forEach((top, i) => {
    if (top <= anchorY) reached = i;
  });
  return reached;
};

/** How much of the trail is filled, from 0 to 1, as the anchor line moves down the track. */
export const trailProgress = ({
  trackTop,
  trackHeight,
  anchorY,
}: {
  trackTop: number;
  trackHeight: number;
  anchorY: number;
}) => {
  if (trackHeight <= 0) return 0;
  return Math.min(1, Math.max(0, (anchorY - trackTop) / trackHeight));
};
