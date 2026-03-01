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

export enum SkillName {
  Python = "Python",
  Flask = "Flask",
  Django = "Django",
  Erlang = "Erlang",
  Elixir = "Elixir",
  Phoenix = "Phoenix",
  JavaScript = "JavaScript",
  TypeScript = "TypeScript",
  React = "React",
  Solid = "Solid",
  SolidJS = "SolidJS",
  HTML = "HTML",
  CSS = "CSS",
  Electron = "Electron",
  Go = "Go",
  Wails = "Wails",
  Scala = "Scala",
  PostgreSQL = "PostgreSQL",
  Redis = "Redis",
  Metabase = "Metabase",
  Git = "Git",
  Docker = "Docker",
  CICD = "CI/CD",
  DevboxNix = "Devbox/Nix",
  Meilisearch = "Meilisearch",
  Algolia = "Algolia",
  AIEnhanced = "AI-enhanced",
  PromptEngineering = "Prompt engineering",
  AIAgents = "AI agents",
  Communication = "Communication",
  Ownership = "Ownership",
  Collaboration = "Collaboration",
  Mentoring = "Mentoring",
  ProblemSolving = "Problem solving",
  SelfTaught = "Self-taught",
  CriticalThinking = "Critical thinking",
}

export const SKILLS: Record<SkillName, Skill> = {
  [SkillName.Python]: {
    label: "Python",
    category: SkillCategory.PythonEcosystem,
  },
  [SkillName.Flask]: {
    label: "Flask",
    category: SkillCategory.PythonEcosystem,
  },
  [SkillName.Django]: {
    label: "Django",
    category: SkillCategory.PythonEcosystem,
  },
  [SkillName.Erlang]: {
    label: "Erlang",
    category: SkillCategory.ErlangEcosystem,
  },
  [SkillName.Elixir]: {
    label: "Elixir",
    category: SkillCategory.ErlangEcosystem,
  },
  [SkillName.Phoenix]: {
    label: "Phoenix",
    category: SkillCategory.ErlangEcosystem,
  },
  [SkillName.JavaScript]: {
    label: "JavaScript",
    category: SkillCategory.WebFrontend,
  },
  [SkillName.TypeScript]: {
    label: "TypeScript",
    category: SkillCategory.WebFrontend,
  },
  [SkillName.React]: { label: "React", category: SkillCategory.WebFrontend },
  [SkillName.Solid]: { label: "Solid", category: SkillCategory.WebFrontend },
  [SkillName.SolidJS]: {
    label: "SolidJS",
    category: SkillCategory.WebFrontend,
  },
  [SkillName.HTML]: { label: "HTML", category: SkillCategory.WebFrontend },
  [SkillName.CSS]: { label: "CSS", category: SkillCategory.WebFrontend },
  [SkillName.Electron]: {
    label: "Electron",
    category: SkillCategory.WebFrontend,
  },
  [SkillName.Go]: { label: "Go", category: SkillCategory.GoEcosystem },
  [SkillName.Wails]: { label: "Wails", category: SkillCategory.GoEcosystem },
  [SkillName.Scala]: { label: "Scala", category: SkillCategory.JvmEcosystem },
  [SkillName.PostgreSQL]: {
    label: "PostgreSQL",
    category: SkillCategory.Databases,
  },
  [SkillName.Redis]: { label: "Redis", category: SkillCategory.Databases },
  [SkillName.Metabase]: {
    label: "Metabase",
    category: SkillCategory.Databases,
  },
  [SkillName.Git]: { label: "Git", category: SkillCategory.DevOps },
  [SkillName.Docker]: { label: "Docker", category: SkillCategory.DevOps },
  [SkillName.CICD]: { label: "CI/CD", category: SkillCategory.DevOps },
  [SkillName.DevboxNix]: {
    label: "Devbox/Nix",
    category: SkillCategory.DevOps,
  },
  [SkillName.Meilisearch]: {
    label: "Meilisearch",
    category: SkillCategory.Search,
  },
  [SkillName.Algolia]: { label: "Algolia", category: SkillCategory.Search },
  [SkillName.AIEnhanced]: { label: "AI-enhanced", category: SkillCategory.AI },
  [SkillName.PromptEngineering]: {
    label: "Prompt engineering",
    category: SkillCategory.AI,
  },
  [SkillName.AIAgents]: { label: "AI agents", category: SkillCategory.AI },
  [SkillName.Communication]: {
    label: "Communication",
    category: SkillCategory.SoftSkills,
  },
  [SkillName.Ownership]: {
    label: "Ownership",
    category: SkillCategory.SoftSkills,
  },
  [SkillName.Collaboration]: {
    label: "Collaboration",
    category: SkillCategory.SoftSkills,
  },
  [SkillName.Mentoring]: {
    label: "Mentoring",
    category: SkillCategory.SoftSkills,
  },
  [SkillName.ProblemSolving]: {
    label: "Problem solving",
    category: SkillCategory.SoftSkills,
  },
  [SkillName.SelfTaught]: {
    label: "Self-taught",
    category: SkillCategory.SoftSkills,
  },
  [SkillName.CriticalThinking]: {
    label: "Critical thinking",
    category: SkillCategory.SoftSkills,
  },
};

const sortSkills = (skills: Skill[]) =>
  skills.sort((a, b) => a.label.localeCompare(b.label));

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages & Frameworks",
    skills: sortSkills([
      SKILLS[SkillName.Python],
      SKILLS[SkillName.Flask],
      SKILLS[SkillName.Django],
      SKILLS[SkillName.Erlang],
      SKILLS[SkillName.Elixir],
      SKILLS[SkillName.Phoenix],
      SKILLS[SkillName.JavaScript],
      SKILLS[SkillName.TypeScript],
      SKILLS[SkillName.React],
      SKILLS[SkillName.Solid],
      SKILLS[SkillName.HTML],
      SKILLS[SkillName.CSS],
      SKILLS[SkillName.Electron],
      SKILLS[SkillName.Go],
      SKILLS[SkillName.Wails],
      SKILLS[SkillName.Scala],
    ]),
  },
  {
    title: "Tools & Infrastructure",
    skills: sortSkills([
      SKILLS[SkillName.PostgreSQL],
      SKILLS[SkillName.Redis],
      SKILLS[SkillName.Metabase],
      SKILLS[SkillName.Git],
      SKILLS[SkillName.Docker],
      SKILLS[SkillName.CICD],
      SKILLS[SkillName.DevboxNix],
      SKILLS[SkillName.Meilisearch],
      SKILLS[SkillName.Algolia],
    ]),
  },
  {
    title: "Strengths & Approach",
    skills: sortSkills([
      SKILLS[SkillName.AIEnhanced],
      SKILLS[SkillName.PromptEngineering],
      SKILLS[SkillName.AIAgents],
      SKILLS[SkillName.Communication],
      SKILLS[SkillName.Ownership],
      SKILLS[SkillName.Collaboration],
      SKILLS[SkillName.Mentoring],
      SKILLS[SkillName.ProblemSolving],
      SKILLS[SkillName.SelfTaught],
      SKILLS[SkillName.CriticalThinking],
    ]),
  },
];
