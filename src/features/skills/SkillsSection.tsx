import { Wrench } from "lucide-solid";
import { createSignal, For } from "solid-js";
import { Section } from "@/components/layout";
import { CategoryLegend } from "./components/CategoryLegend";
import { SkillCard } from "./components/SkillCard";
import { SKILL_GROUPS, type SkillCategory } from "./constants";

export const SkillsSection = () => {
  const [highlightedCategory, setHighlightedCategory] =
    createSignal<SkillCategory | null>(null);

  return (
    <Section id="skills" title="Skills" icon={Wrench}>
      <div class="flex flex-col gap-6">
        <CategoryLegend
          highlightedCategory={highlightedCategory}
          onHover={setHighlightedCategory}
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <For each={SKILL_GROUPS}>
            {(group) => (
              <SkillCard
                group={group}
                highlightedCategory={highlightedCategory}
                onHover={setHighlightedCategory}
              />
            )}
          </For>
        </div>
      </div>
    </Section>
  );
};
