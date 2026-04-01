import { ExternalLink } from "lucide-solid";
import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { GithubIcon } from "@/components/ui/icons";
import { SkillTag } from "@/features/skills/components/SkillTag";
import { SKILLS, type SkillCategory } from "@/features/skills/constants";
import type { Project } from "../types";

const NO_HIGHLIGHT: () => SkillCategory | null = () => null;

type ProjectCardProps = {
  project: Project;
  isActive?: boolean;
  onThumbnailClick: (screenshots: string[], index: number) => void;
};

export const ProjectCard: Component<ProjectCardProps> = (props) => {
  return (
    <div
      class={`card card-border h-full bg-white text-black transition-all duration-300 ${
        props.isActive
          ? `shadow-xl border ${props.project.deprecated ? "border-error" : "border-primary"}`
          : ""
      }`}
    >
      <div class="card-body gap-1">
        {/* Title */}
        <h3 class="card-title text-base my-0!">{props.project.name}</h3>
        <Show when={props.project.deprecated}>
          <span class="badge badge-error badge-sm">Deprecated</span>
        </Show>

        {/* Links */}
        <div class="flex gap-0">
          <Show when={props.project.githubUrl}>
            <div class="tooltip" data-tip="GitHub">
              <a
                href={props.project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost btn-xs"
              >
                <GithubIcon size={14} />
              </a>
            </div>
          </Show>
          <Show when={props.project.websiteUrl}>
            <div class="tooltip" data-tip="Official website">
              <a
                href={props.project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-ghost btn-xs"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </Show>
        </div>

        {/* Description */}
        <p class="text-sm mt-1!">{props.project.description}</p>

        {/* Thumbnail strip */}
        <Show when={props.project.screenshots.length > 0}>
          <div class="flex gap-2 overflow-x-auto py-1">
            <For each={props.project.screenshots}>
              {(screenshot, index) => (
                <button
                  type="button"
                  class="h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded border border-base-300 transition-opacity hover:opacity-80"
                  onClick={() =>
                    props.onThumbnailClick(props.project.screenshots, index())
                  }
                >
                  <img
                    src={screenshot}
                    alt={`${props.project.name} screenshot ${index() + 1}`}
                    class="m-0!"
                  />
                </button>
              )}
            </For>
          </div>
        </Show>

        {/* Skills */}
        <div class="card-actions mt-auto justify-end">
          <div class="flex flex-wrap gap-1">
            <For each={props.project.skills}>
              {(skillName) => (
                <SkillTag
                  skill={SKILLS[skillName]}
                  highlightedCategory={
                    props.isActive ? undefined : NO_HIGHLIGHT
                  }
                />
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};
