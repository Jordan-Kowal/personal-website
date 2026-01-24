import type { Component } from "solid-js";
import { For } from "solid-js";

type SkillCardProps = {
  title: string;
  skills: string[];
};

export const SkillCard: Component<SkillCardProps> = (props) => {
  return (
    <div class="card card-border bg-base-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div class="card-body">
        <h3 class="card-title justify-center !mt-0 mb-2 text-xl">
          {props.title}
        </h3>
        <div class="flex flex-wrap gap-2 justify-center">
          <For each={props.skills}>
            {(skill) => (
              <span class="badge badge-outline badge-md">{skill}</span>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
