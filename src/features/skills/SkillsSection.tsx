import { ContentContainer } from "@/components/layout";
import { SkillCard } from "./components/SkillCard";

const skills = {
  languages: ["Python", "TypeScript", "JavaScript", "Java"],
  frameworks: ["Solid.js", "React", "Vue.js", "Node.js"],
  tools: ["Git", "Docker", "PostgreSQL", "MongoDB"],
};

export const SkillsSection = () => {
  return (
    <section class="py-16">
      <ContentContainer>
        <h2 class="mb-8 text-center text-4xl font-bold">Skills</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Colonne 1 - Languages */}
          <SkillCard title="Languages" skills={skills.languages} />

          {/* Colonne 2 - Frameworks */}
          <SkillCard title="Frameworks" skills={skills.frameworks} />

          {/* Colonne 3 - Tools */}
          <SkillCard title="Tools" skills={skills.tools} />
        </div>
      </ContentContainer>
    </section>
  );
};
