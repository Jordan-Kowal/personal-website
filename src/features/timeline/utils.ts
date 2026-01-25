import { experienceData } from "./data";
import type { TimelineItem } from "./types";

const calculateYearsBetween = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.round((diffDays / 365) * 10) / 10; // Arrondi à 1 décimale
};

export const calculateExperienceStats = () => {
  // Calculer les années de Software Developer
  const softwareDeveloperYears = experienceData
    .filter((exp) => exp.title.toLowerCase().includes("developer"))
    .reduce((total, exp) => {
      return total + calculateYearsBetween(exp.startDate, exp.endDate);
    }, 0);

  // Calculer les années de Product Management
  const productManagementYears = experienceData
    .filter(
      (exp) =>
        exp.title.toLowerCase().includes("product") ||
        exp.title.toLowerCase().includes("project manager"),
    )
    .reduce((total, exp) => {
      return total + calculateYearsBetween(exp.startDate, exp.endDate);
    }, 0);

  // Calculer les années de Backend (basé sur les technologies backend)
  // On compte les expériences qui utilisent des technologies backend
  const backendYears = experienceData
    .filter((exp) =>
      exp.technologies?.some((tech) =>
        [
          "Python",
          "Django",
          "Node.js",
          "PostgreSQL",
          "Erlang",
          "Scala",
        ].includes(tech),
      ),
    )
    .reduce((total, exp) => {
      return total + calculateYearsBetween(exp.startDate, exp.endDate);
    }, 0);

  // Total années d'expérience professionnelle (sans chevauchement)
  // On prend la date de début la plus ancienne et la date de fin la plus récente
  const sortedByStart = [...experienceData].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
  const earliestStart = sortedByStart[0]?.startDate;
  const latestEnd =
    experienceData.find((exp) => !exp.endDate)?.startDate ||
    experienceData
      .filter((exp) => exp.endDate)
      .sort(
        (a, b) =>
          new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime(),
      )[0]?.endDate;

  const totalYears =
    earliestStart && latestEnd
      ? calculateYearsBetween(earliestStart, latestEnd)
      : experienceData.reduce((total, exp) => {
          return total + calculateYearsBetween(exp.startDate, exp.endDate);
        }, 0);

  return {
    backendYears: Math.round(backendYears * 10) / 10,
    productManagementYears: Math.round(productManagementYears * 10) / 10,
    softwareDeveloperYears: Math.round(softwareDeveloperYears * 10) / 10,
    totalYears: Math.round(totalYears * 10) / 10,
  };
};

// Nouveaux utilitaires pour la timeline horizontale
export const getTimelineBounds = (_items: TimelineItem[]) => {
  const startYear = 2010; // Année de départ fixe
  const endYear = new Date().getFullYear(); // Année actuelle arrondie
  return { startYear, endYear };
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

export const getItemDuration = (item: TimelineItem): number => {
  const start = new Date(item.startDate);
  const end = item.endDate ? new Date(item.endDate) : new Date();
  return end.getTime() - start.getTime();
};

export const itemsOverlap = (
  item1: TimelineItem,
  item2: TimelineItem,
): boolean => {
  const start1 = new Date(item1.startDate).getTime();
  const end1 = item1.endDate ? new Date(item1.endDate).getTime() : Date.now();
  const start2 = new Date(item2.startDate).getTime();
  const end2 = item2.endDate ? new Date(item2.endDate).getTime() : Date.now();

  return !(end1 < start2 || end2 < start1);
};

export type TimelineItemWithPosition = TimelineItem & {
  left: number;
  width: number;
  level: number;
};

export const assignLevels = (
  items: TimelineItem[],
  startYear: number,
  endYear: number,
): TimelineItemWithPosition[] => {
  // Trier les items par date de début
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const positionedItems: TimelineItemWithPosition[] = [];
  const levels: TimelineItem[][] = []; // Chaque niveau contient les items qui ne se chevauchent pas

  for (const item of sortedItems) {
    const left = dateToPosition(item.startDate, startYear, endYear);
    const endDate = item.endDate || new Date().toISOString().split("T")[0];
    const right = dateToPosition(endDate, startYear, endYear);
    const width = Math.max(right - left, 0.5); // Minimum 0.5% pour visibilité

    // Trouver le premier niveau où cet item ne chevauche pas
    let assignedLevel = -1;
    for (let i = 0; i < levels.length; i++) {
      const levelItems = levels[i];
      const overlaps = levelItems.some((existingItem) =>
        itemsOverlap(item, existingItem),
      );

      if (!overlaps) {
        assignedLevel = i;
        levels[i].push(item);
        break;
      }
    }

    // Si aucun niveau n'est disponible, créer un nouveau niveau
    if (assignedLevel === -1) {
      assignedLevel = levels.length;
      levels.push([item]);
    }

    positionedItems.push({
      ...item,
      left,
      width,
      level: assignedLevel,
    });
  }

  return positionedItems;
};
