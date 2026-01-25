import type { GitHubContribution, GitHubContributionsData } from "./types";

const GITHUB_USERNAME = "Jordan-Kowal";
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

export const fetchGitHubContributions =
  async (): Promise<GitHubContributionsData | null> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch GitHub contributions: ${response.statusText}`,
        );
      }
      const data = await response.json();

      // Transformer les données de l'API en format attendu
      // Cette API retourne directement level (0-4) et le format est différent
      const contributions: GitHubContribution[] = data.contributions.map(
        (item: { date: string; count: number; level: number }) => ({
          date: item.date,
          count: item.count,
          level: Math.min(4, Math.max(0, item.level)) as 0 | 1 | 2 | 3 | 4,
        }),
      );

      // Calculer les streaks depuis les contributions
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Calculer la série actuelle en partant de la fin (dernière contribution)
      for (let i = contributions.length - 1; i >= 0; i--) {
        if (contributions[i].count > 0) {
          currentStreak++;
        } else {
          break; // Arrêter dès qu'on trouve un jour sans contribution
        }
      }

      // Calculer la plus longue série en parcourant toutes les contributions
      for (const contribution of contributions) {
        if (contribution.count > 0) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      return {
        contributions,
        totalContributions: data.total?.lastYear || 0,
        longestStreak,
        currentStreak,
      };
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      return null;
    }
  };

export const getContributionLevelClass = (level: number): string => {
  const levelClasses = [
    "bg-base-300", // 0 - no contributions
    "bg-primary/20", // 1 - low
    "bg-primary/40", // 2 - medium
    "bg-primary/60", // 3 - high
    "bg-primary", // 4 - very high
  ];
  return levelClasses[Math.min(4, Math.max(0, level))] || levelClasses[0];
};
