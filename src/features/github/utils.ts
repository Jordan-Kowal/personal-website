import type { GitHubContribution, GitHubContributionsData } from "./types";

const GITHUB_USERNAME = "Jordan-Kowal";
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
const MAX_LEVEL = 4;

/**
 * Current and longest runs of days with at least one contribution, from oldest-first data.
 * `today` is not over yet, so a 0 on it does not break the current streak.
 */
export const computeStreaks = (
  contributions: GitHubContribution[],
  today: string,
) => {
  let streakStart = contributions.length - 1;
  const last = contributions[streakStart];
  if (last && last.date === today && last.count === 0) streakStart--;
  let currentStreak = 0;
  for (let i = streakStart; i >= 0; i--) {
    if (contributions[i].count === 0) break;
    currentStreak++;
  }

  let longestStreak = 0;
  let runningStreak = 0;
  for (const contribution of contributions) {
    runningStreak = contribution.count > 0 ? runningStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, runningStreak);
  }
  return { currentStreak, longestStreak };
};

export const clampLevel = (level: number) =>
  Math.min(MAX_LEVEL, Math.max(0, level)) as GitHubContribution["level"];

const isApiDay = (
  value: unknown,
): value is { date: string; count: number; level: number } =>
  typeof value === "object" &&
  value !== null &&
  "date" in value &&
  typeof value.date === "string" &&
  "count" in value &&
  typeof value.count === "number" &&
  "level" in value &&
  typeof value.level === "number";

/** The third-party API's payload, narrowed field by field: a day of the wrong shape is dropped. */
export const parseContributions = (
  payload: unknown,
): { contributions: GitHubContribution[]; totalContributions: number } => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("contributions" in payload) ||
    !Array.isArray(payload.contributions)
  ) {
    throw new Error("Unexpected response from the contributions API");
  }
  const contributions = payload.contributions.filter(isApiDay).map((day) => ({
    date: day.date,
    count: day.count,
    level: clampLevel(day.level),
  }));
  const total =
    "total" in payload &&
    typeof payload.total === "object" &&
    payload.total !== null &&
    "lastYear" in payload.total &&
    typeof payload.total.lastYear === "number"
      ? payload.total.lastYear
      : 0;
  return { contributions, totalContributions: total };
};

export const fetchGitHubContributions =
  async (): Promise<GitHubContributionsData> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch GitHub contributions: ${response.statusText}`,
      );
    }
    const { contributions, totalContributions } = parseContributions(
      await response.json(),
    );
    const today = new Date().toISOString().split("T")[0];
    return {
      contributions,
      totalContributions,
      ...computeStreaks(contributions, today),
    };
  };

/** Splits oldest-first days into weeks of 7, the first week padded so columns start on Sunday. */
export const toWeeks = (contributions: GitHubContribution[]) => {
  const weeks: (GitHubContribution | null)[][] = [];
  const firstDay = contributions[0]
    ? new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay()
    : 0;
  let week: (GitHubContribution | null)[] = Array(firstDay).fill(null);
  for (const contribution of contributions) {
    week.push(contribution);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type MonthStart = { label: string; column: number; row: number };

/**
 * Where each month begins on the week grid: the cell holding its 1st.
 * A month whose 1st falls before the data starts gets no marker.
 */
export const monthStarts = (
  weeks: (GitHubContribution | null)[][],
): MonthStart[] =>
  weeks.flatMap((week, column) =>
    week.flatMap((day, row) =>
      day?.date.endsWith("-01")
        ? [
            {
              label: MONTH_LABELS[Number(day.date.slice(5, 7)) - 1],
              column,
              row,
            },
          ]
        : [],
    ),
  );

/**
 * A camera position on a sphere around the origin.
 * `polar` is measured from straight above (0) down to the horizon (π/2); `azimuth` 0 looks from +z.
 */
export const orbitPosition = ({
  azimuth,
  polar,
  radius,
}: {
  azimuth: number;
  polar: number;
  radius: number;
}): [number, number, number] => {
  const horizontal = Math.sin(polar) * radius;
  return [
    Math.sin(azimuth) * horizontal,
    Math.cos(polar) * radius,
    Math.cos(azimuth) * horizontal,
  ];
};
