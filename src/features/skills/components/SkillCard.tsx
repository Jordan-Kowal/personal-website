import type { Accessor, Component } from "solid-js";
import { For } from "solid-js";
import type { SkillCategory, SkillGroup } from "../constants";
import { SkillTag } from "./SkillTag";

type SkillCardProps = {
  group: SkillGroup;
  highlightedCategory: Accessor<SkillCategory | null>;
  onHover: (category: SkillCategory | null) => void;
};

export const SkillCard: Component<SkillCardProps> = (props) => {
  return (
    <div class="rounded-box border border-base-200 bg-base-200 p-6">
      <div class="flex flex-col gap-2">
        <h3 class="mb-2 text-center text-xl font-semibold mt-0!">
          {props.group.title}
        </h3>
        <div class="flex flex-wrap justify-center gap-2">
          <For each={props.group.skills}>
            {(skill) => (
              <SkillTag
                skill={skill}
                highlightedCategory={props.highlightedCategory}
                onHover={props.onHover}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
