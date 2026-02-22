export enum SkillCategory {
  PythonEcosystem = "Python",
  ErlangEcosystem = "Erlang",
  WebFrontend = "Web",
  GoEcosystem = "Go",
  JvmEcosystem = "JVM",
  Databases = "Databases",
  Search = "Search",
  DevOps = "DevOps",
  AI = "AI",
  SoftSkills = "Soft Skills",
}

export type Skill = {
  label: string;
  category: SkillCategory;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export type CategoryColor = {
  background: string;
  text: string;
  border: string;
};

export const CATEGORY_COLORS: Record<SkillCategory, CategoryColor> = {
  [SkillCategory.PythonEcosystem]: {
    background: "#dbeafe",
    text: "#1e40af",
    border: "#93c5fd",
  },
  [SkillCategory.ErlangEcosystem]: {
    background: "#f3e8ff",
    text: "#6b21a8",
    border: "#d8b4fe",
  },
  [SkillCategory.WebFrontend]: {
    background: "#fef3c7",
    text: "#92400e",
    border: "#fcd34d",
  },
  [SkillCategory.GoEcosystem]: {
    background: "#cffafe",
    text: "#155e75",
    border: "#67e8f9",
  },
  [SkillCategory.JvmEcosystem]: {
    background: "#fee2e2",
    text: "#991b1b",
    border: "#fca5a5",
  },
  [SkillCategory.Databases]: {
    background: "#d1fae5",
    text: "#065f46",
    border: "#6ee7b7",
  },
  [SkillCategory.Search]: {
    background: "#ccfbf1",
    text: "#115e59",
    border: "#5eead4",
  },
  [SkillCategory.DevOps]: {
    background: "#ecfccb",
    text: "#3f6212",
    border: "#bef264",
  },
  [SkillCategory.AI]: {
    background: "#ffedd5",
    text: "#9a3412",
    border: "#fdba74",
  },
  [SkillCategory.SoftSkills]: {
    background: "#fce7f3",
    text: "#9d174d",
    border: "#f9a8d4",
  },
};

const {
  PythonEcosystem,
  ErlangEcosystem,
  WebFrontend,
  GoEcosystem,
  JvmEcosystem,
  Databases,
  Search,
  DevOps,
  AI,
  SoftSkills,
} = SkillCategory;

const sortSkills = (skills: Skill[]) =>
  skills.sort((a, b) => a.label.localeCompare(b.label));

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages & Frameworks",
    skills: sortSkills([
      { label: "Python", category: PythonEcosystem },
      { label: "Flask", category: PythonEcosystem },
      { label: "Django", category: PythonEcosystem },
      { label: "Erlang", category: ErlangEcosystem },
      { label: "Elixir", category: ErlangEcosystem },
      { label: "Phoenix", category: ErlangEcosystem },
      { label: "JavaScript", category: WebFrontend },
      { label: "TypeScript", category: WebFrontend },
      { label: "React", category: WebFrontend },
      { label: "Solid", category: WebFrontend },
      { label: "HTML", category: WebFrontend },
      { label: "CSS", category: WebFrontend },
      { label: "Electron", category: WebFrontend },
      { label: "Go", category: GoEcosystem },
      { label: "Wails", category: GoEcosystem },
      { label: "Scala", category: JvmEcosystem },
    ]),
  },
  {
    title: "Tools & Infrastructure",
    skills: sortSkills([
      { label: "PostgreSQL", category: Databases },
      { label: "Redis", category: Databases },
      { label: "Metabase", category: Databases },
      { label: "Git", category: DevOps },
      { label: "Docker", category: DevOps },
      { label: "CI/CD", category: DevOps },
      { label: "Devbox/Nix", category: DevOps },
      { label: "Meilisearch", category: Search },
      { label: "Algolia", category: Search },
    ]),
  },
  {
    title: "Strengths & Approach",
    skills: sortSkills([
      { label: "AI-enhanced", category: AI },
      { label: "Prompt engineering", category: AI },
      { label: "AI agents", category: AI },
      { label: "Communication", category: SoftSkills },
      { label: "Ownership", category: SoftSkills },
      { label: "Collaboration", category: SoftSkills },
      { label: "Mentoring", category: SoftSkills },
      { label: "Problem solving", category: SoftSkills },
      { label: "Self-taught", category: SoftSkills },
      { label: "Critical thinking", category: SoftSkills },
    ]),
  },
];
