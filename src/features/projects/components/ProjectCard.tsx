import { ExternalLink, Github } from "lucide-solid";
import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import type { Project } from "../types";

type ProjectCardProps = {
  project: Project;
  isActive?: boolean;
  onThumbnailClick: (screenshots: string[], index: number) => void;
};

export const ProjectCard: Component<ProjectCardProps> = (props) => {
  return (
    <div
      class={`card card-border h-full bg-base-200 transition-all duration-300 ${
        props.isActive ? "shadow-xl" : "opacity-75"
      } ${props.project.deprecated ? "opacity-60" : ""}`}
    >
      <div class="card-body gap-3">
        {/* Title + deprecated badge */}
        <div class="flex items-center gap-2">
          <h3 class="card-title text-base">{props.project.name}</h3>
          <Show when={props.project.deprecated}>
            <span class="badge badge-warning badge-sm">Deprecated</span>
          </Show>
        </div>

        {/* Links */}
        <div class="flex gap-2">
          <Show when={props.project.githubUrl}>
            <a
              href={props.project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-xs"
            >
              <Github size={14} />
            </a>
          </Show>
          <Show when={props.project.websiteUrl}>
            <a
              href={props.project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-ghost btn-xs"
            >
              <ExternalLink size={14} />
            </a>
          </Show>
        </div>

        {/* Description */}
        <p class="text-sm">{props.project.description}</p>

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
                    class="h-full w-full object-cover"
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
              {(skill) => (
                <span class="badge badge-outline badge-sm">{skill}</span>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};
