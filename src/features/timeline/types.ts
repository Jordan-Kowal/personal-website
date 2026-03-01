import type { LucideIcon } from "lucide-solid";

export type TimelineView = "education" | "experience";

export type TimelineItem = {
  id: number;
  title: string;
  entity: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  category: TimelineView;
  logo?: string | LucideIcon;
};
