import type { Skill } from "@/data/skills";

type SkillFilter = {
  isCore: (skill: Skill) => boolean;
  isBackend: (skill: Skill) => boolean;
  isFrontend: (skill: Skill) => boolean;
  isOther: (skill: Skill) => boolean;
};

export const skillFilter: SkillFilter = {
  isCore: (skill) => skill.isCore,
  isBackend: (skill) => skill.isBackend,
  isFrontend: (skill) => skill.isFrontend,
  isOther: (skill) => skill.isOther,
};
