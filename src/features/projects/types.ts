export type Project = {
  id: number;
  name: string;
  description: string;
  githubUrl: string | undefined;
  websiteUrl: string | undefined;
  screenshots: string[];
  deprecated: boolean;
  skills: string[];
};
