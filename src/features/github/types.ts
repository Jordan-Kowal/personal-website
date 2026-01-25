export type GitHubContribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no contributions, 4 = max
};

export type GitHubContributionsData = {
  contributions: GitHubContribution[];
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
};
