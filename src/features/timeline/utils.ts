import type { TimelineItem } from "./types";

export const getTimelineBounds = (items: TimelineItem[]) => {
  let minYear = Number.POSITIVE_INFINITY;
  let maxYear = Number.NEGATIVE_INFINITY;
  for (const item of items) {
    const startYear = new Date(item.startDate).getFullYear();
    const endYear = item.endDate
      ? new Date(item.endDate).getFullYear()
      : new Date().getFullYear();
    if (startYear < minYear) minYear = startYear;
    if (endYear > maxYear) maxYear = endYear;
  }
  return { startYear: minYear, endYear: maxYear };
};

export const dateToPosition = (
  dateString: string,
  startYear: number,
  endYear: number,
): number => {
  const date = new Date(dateString);
  const startOfStartYear = new Date(startYear, 0, 1).getTime();
  const endOfEndYear = new Date(endYear + 1, 0, 1).getTime();
  const dateTime = date.getTime();
  const totalDuration = endOfEndYear - startOfStartYear;
  const positionFromStart = dateTime - startOfStartYear;
  return (positionFromStart / totalDuration) * 100;
};

export const getMidpointPosition = (
  item: TimelineItem,
  startYear: number,
  endYear: number,
): number => {
  const startPos = dateToPosition(item.startDate, startYear, endYear);
  const endDate = item.endDate || new Date().toISOString().split("T")[0];
  const endPos = dateToPosition(endDate, startYear, endYear);
  return (startPos + endPos) / 2;
};
