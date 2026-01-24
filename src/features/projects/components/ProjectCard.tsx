import type { Component } from "solid-js";
import { For } from "solid-js";

type ProjectCardProps = {
  title: string;
  description: string;
  technologies: string[];
  isActive?: boolean;
};

export const ProjectCard: Component<ProjectCardProps> = (props) => {
  return (
    <div
      class={`card card-border h-full bg-base-200 transition-all duration-300 ${
        props.isActive ? "shadow-xl" : "opacity-75"
      }`}
    >
      <div class="card-body">
        <h3 class="card-title">{props.title}</h3>
        <p class="text-sm">{props.description}</p>
        <div class="card-actions justify-end">
          <div class="flex flex-wrap gap-2">
            <For each={props.technologies}>
              {(tech) => (
                <span class="badge badge-outline badge-sm">{tech}</span>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};
