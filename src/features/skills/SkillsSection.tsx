import { Section } from "@/components/layout";
import { SkillCard } from "./components/SkillCard";

const skills = {
  languages: ["Python", "TypeScript", "JavaScript", "Java"],
  frameworks: ["Solid.js", "React", "Vue.js", "Node.js"],
  tools: ["Git", "Docker", "PostgreSQL", "MongoDB"],
};

export const SkillsSection = () => {
  return (
    <Section id="skills" title="Skills">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Colonne 1 - Languages */}
        <SkillCard title="Languages" skills={skills.languages} />

        {/* Colonne 2 - Frameworks */}
        <SkillCard title="Frameworks" skills={skills.frameworks} />

        {/* Colonne 3 - Tools */}
        <SkillCard title="Tools" skills={skills.tools} />
      </div>
    </Section>
  );
};
