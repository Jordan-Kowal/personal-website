import type { SkillName } from "@/features/skills/constants";

export type Project = {
  id: number;
  name: string;
  description: string;
  githubUrl: string | undefined;
  websiteUrl: string | undefined;
  screenshots: string[];
  archived: boolean;
  skills: SkillName[];
};
