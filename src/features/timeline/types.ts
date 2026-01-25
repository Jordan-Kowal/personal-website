export type TimelineItem = {
  id: number;
  title: string;
  entity: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
};

export type TimelineView = "education" | "experience";
