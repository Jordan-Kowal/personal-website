# Project Cards Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace placeholder project data with 14 real projects, update card layout with links/thumbnails/modal, and add deprecated filtering.

**Architecture:** Feature-scoped data + types files following existing patterns (see `src/features/reviews/`). Card component with conditional thumbnail strip. New screenshot modal component. Section keeps carousel layout with a deprecated toggle filter that controls which projects are shown.

**Tech Stack:** SolidJS, Tailwind CSS + DaisyUI, lucide-solid icons

---

### Task 1: Create Project type and data

**Files:**
- Create: `src/features/projects/types.ts`
- Create: `src/features/projects/data.ts`

**Step 1: Create the type**

Create `src/features/projects/types.ts`:

```ts
export type Project = {
  id: number;
  name: string;
  description: string;
  githubUrl: string | undefined;
  websiteUrl: string | undefined;
  screenshots: string[];
  deprecated: boolean;
  skills: string[];
};
```

**Step 2: Create the data file**

Create `src/features/projects/data.ts` with all 14 projects. Order: active projects first, then deprecated. Screenshot paths are relative to `public/` (e.g. `"screenshots/starter-login.png"`).

```ts
import type { Project } from "./types";

export const projectsData: Project[] = [
  {
    id: 14,
    name: "click-launch",
    description:
      "Desktop app for managing your local dev stack — configure once, launch everything with a click.",
    githubUrl: "https://github.com/Jordan-Kowal/click-launch",
    websiteUrl: undefined,
    screenshots: [],
    deprecated: false,
    skills: ["TypeScript", "Solid", "Wails", "Go"],
  },
  {
    id: 11,
    name: "pipe-operator",
    description: "Elixir's pipe operator in Python.",
    githubUrl: "https://github.com/Jordan-Kowal/pipe-operator",
    websiteUrl: "https://pypi.org/project/pipe-operator/",
    screenshots: [],
    deprecated: false,
    skills: ["Python"],
  },
  {
    id: 5,
    name: "personal-website",
    description:
      "You are viewing it right now. My personal static website made with Vite, SolidJS, and DaisyUI.",
    githubUrl: "https://github.com/Jordan-Kowal/personal-website",
    websiteUrl: "https://jordan-kowal.github.io/personal-website/",
    screenshots: [],
    deprecated: false,
    skills: ["TypeScript", "SolidJS"],
  },
  {
    id: 3,
    name: "django-react-starter",
    description:
      "Django-React starter with Docker support for fast and easy web development.",
    githubUrl: "https://github.com/Jordan-Kowal/django-react-starter",
    websiteUrl: undefined,
    screenshots: [
      "screenshots/starter-login.png",
      "screenshots/starter-homepage.png",
      "screenshots/starter-settings.png",
    ],
    deprecated: true,
    skills: ["Python", "Django", "TypeScript", "React", "PostgreSQL", "Docker"],
  },
  {
    id: 12,
    name: "django-utils-kit",
    description: "Various utilities for working with Django and DRF.",
    githubUrl: "https://github.com/Jordan-Kowal/django-utils-kit",
    websiteUrl: "https://pypi.org/project/django-utils-kit/",
    screenshots: [],
    deprecated: true,
    skills: ["Python", "Django"],
  },
  {
    id: 13,
    name: "django-meilisearch-indexer",
    description: "Meilisearch indexer for django models and related utilities.",
    githubUrl: "https://github.com/Jordan-Kowal/django-meilisearch-indexer",
    websiteUrl: "https://pypi.org/project/django-meilisearch-indexer/",
    screenshots: [],
    deprecated: true,
    skills: ["Python", "Django"],
  },
  {
    id: 2,
    name: "jkscript",
    description: "Personal library with ES6 JavaScript utilities.",
    githubUrl: "https://github.com/Jordan-Kowal/jkscript",
    websiteUrl: "https://www.npmjs.com/package/jcscript",
    screenshots: [],
    deprecated: true,
    skills: ["TypeScript"],
  },
  {
    id: 6,
    name: "challenges",
    description:
      "Snippets from various challenges, hackathons, and competitions.",
    githubUrl: "https://github.com/Jordan-Kowal/challenges",
    websiteUrl: undefined,
    screenshots: [],
    deprecated: true,
    skills: ["Python", "Elixir"],
  },
  {
    id: 1,
    name: "jklib",
    description:
      "Package with useful snippets for Django and general Python development.",
    githubUrl: "https://github.com/Jordan-Kowal/jklib",
    websiteUrl: "https://pypi.org/project/jklib/",
    screenshots: [],
    deprecated: true,
    skills: ["Python", "Django"],
  },
  {
    id: 4,
    name: "enseirb-schedule-notifier",
    description:
      "School schedule with improved UI and automatic notifications on schedule changes.",
    githubUrl: undefined,
    websiteUrl: undefined,
    screenshots: [
      "screenshots/enseirb-schedule-notifier-1.png",
      "screenshots/enseirb-schedule-notifier-2.png",
      "screenshots/enseirb-schedule-notifier-3.png",
    ],
    deprecated: true,
    skills: ["Python", "Django", "JavaScript", "React", "PostgreSQL", "Docker"],
  },
  {
    id: 10,
    name: "world-map",
    description:
      "World map with location markers of my travels and places I lived in.",
    githubUrl: undefined,
    websiteUrl: undefined,
    screenshots: ["screenshots/world-map-1.png"],
    deprecated: true,
    skills: ["Python", "Django", "JavaScript", "React", "PostgreSQL", "Docker"],
  },
  {
    id: 7,
    name: "discord-dice-roller",
    description:
      "An open-source, lightweight, and easy-to-use dice-roller bot for discord.",
    githubUrl: "https://github.com/Jordan-Kowal/discord-dice-roller",
    websiteUrl: "https://jordan-kowal.github.io/discord-dice-roller/",
    screenshots: ["screenshots/discord-dice-roller-1.png"],
    deprecated: true,
    skills: ["Python"],
  },
  {
    id: 8,
    name: "django-database-translation",
    description:
      "Package for handling database translation in a website with multiple languages.",
    githubUrl: "https://github.com/Jordan-Kowal/django-database-translation",
    websiteUrl: "https://pypi.org/project/django-database-translation/",
    screenshots: [],
    deprecated: true,
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: 9,
    name: "sudoku-manager",
    description:
      "My first project. Sudoku solver (and generator) using brute force algorithm.",
    githubUrl: "https://github.com/Jordan-Kowal/sudoku-manager",
    websiteUrl: "https://pypi.org/project/sudoku-manager/",
    screenshots: [],
    deprecated: true,
    skills: ["Python"],
  },
];
```

**Step 3: Run quality check**

Run: `bun quality`
Expected: PASS

**Step 4: Commit**

```bash
git add src/features/projects/types.ts src/features/projects/data.ts
git commit -m "feat: add real project data and type definition"
```

---

### Task 2: Create ScreenshotModal component

**Files:**
- Create: `src/features/projects/components/ScreenshotModal.tsx`

**Step 1: Create the modal**

Create `src/features/projects/components/ScreenshotModal.tsx`:

Uses SolidJS `<Show>` for conditional rendering. DaisyUI `modal` class for overlay. `ChevronLeft`/`ChevronRight`/`X` from lucide-solid. Navigation with `createSignal` for current index. Closes on backdrop click or X button.

```tsx
import { ChevronLeft, ChevronRight, X } from "lucide-solid";
import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";

type ScreenshotModalProps = {
  screenshots: string[];
  initialIndex: number;
  onClose: () => void;
};

export const ScreenshotModal: Component<ScreenshotModalProps> = (props) => {
  const [currentIndex, setCurrentIndex] = createSignal(props.initialIndex);

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + props.screenshots.length) % props.screenshots.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % props.screenshots.length);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        class="btn btn-circle btn-ghost btn-sm absolute top-4 right-4 text-white"
        onClick={props.onClose}
      >
        <X size={24} />
      </button>

      <Show when={props.screenshots.length > 1}>
        <button
          type="button"
          class="btn btn-circle btn-ghost absolute left-4 text-white"
          onClick={goToPrev}
        >
          <ChevronLeft size={32} />
        </button>
      </Show>

      <img
        src={props.screenshots[currentIndex()]}
        alt={`Screenshot ${currentIndex() + 1}`}
        class="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
      />

      <Show when={props.screenshots.length > 1}>
        <button
          type="button"
          class="btn btn-circle btn-ghost absolute right-4 text-white"
          onClick={goToNext}
        >
          <ChevronRight size={32} />
        </button>
      </Show>
    </div>
  );
};
```

**Step 2: Run quality check**

Run: `bun quality`
Expected: PASS

**Step 3: Commit**

```bash
git add src/features/projects/components/ScreenshotModal.tsx
git commit -m "feat: add screenshot modal with navigation"
```

---

### Task 3: Update ProjectCard component

**Files:**
- Modify: `src/features/projects/components/ProjectCard.tsx`

**Step 1: Rewrite ProjectCard**

Replace entire file. New layout: title + deprecated badge, GitHub/Website icon links, description, thumbnail strip (conditional), skill badges. The card receives a `Project` and an `onThumbnailClick` callback. Uses `<Show>` for conditional sections, `<For>` for lists.

```tsx
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
```

**Step 2: Run quality check**

Run: `bun quality`
Expected: PASS

**Step 3: Commit**

```bash
git add src/features/projects/components/ProjectCard.tsx
git commit -m "feat: update project card with links, thumbnails, and deprecated badge"
```

---

### Task 4: Update ProjectsSection with filter and modal integration

**Files:**
- Modify: `src/features/projects/ProjectsSection.tsx`

**Step 1: Rewrite ProjectsSection**

Replace entire file. Adds:
- `showDeprecated` signal (default: false) with toggle button
- `filteredProjects` memo derived from `projectsData` + `showDeprecated`
- `currentIndex` reset when filter changes
- Modal state signals (`modalScreenshots`, `modalIndex`)
- Carousel uses `filteredProjects()` instead of static array
- Pass `onThumbnailClick` to `ProjectCard`
- Render `<ScreenshotModal>` conditionally with `<Show>`

```tsx
import { Briefcase } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import { Section } from "@/components/layout";
import { ProjectCard } from "./components/ProjectCard";
import { ScreenshotModal } from "./components/ScreenshotModal";
import { projectsData } from "./data";

export const ProjectsSection = () => {
  const [showDeprecated, setShowDeprecated] = createSignal(false);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [modalScreenshots, setModalScreenshots] = createSignal<string[]>([]);
  const [modalIndex, setModalIndex] = createSignal(0);

  const filteredProjects = createMemo(() => {
    if (showDeprecated()) return projectsData;
    return projectsData.filter((p) => !p.deprecated);
  });

  const toggleDeprecated = () => {
    setShowDeprecated((prev) => !prev);
    setCurrentIndex(0);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProjects().length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + filteredProjects().length) % filteredProjects().length
    );
  };

  const openModal = (screenshots: string[], index: number) => {
    setModalScreenshots(screenshots);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalScreenshots([]);
  };

  return (
    <Section id="projects" title="Projects" alternate icon={Briefcase}>
      {/* Filter toggle */}
      <div class="mb-6 flex justify-center">
        <label class="label cursor-pointer gap-2">
          <span class="label-text">Show deprecated</span>
          <input
            type="checkbox"
            class="toggle toggle-sm"
            checked={showDeprecated()}
            onChange={toggleDeprecated}
          />
        </label>
      </div>

      {/* Carousel */}
      <div class="relative flex h-[450px] items-center justify-center overflow-hidden">
        <For each={filteredProjects()}>
          {(project, index) => {
            const relativePosition = () => {
              const current = currentIndex();
              const total = filteredProjects().length;
              let pos = index() - current;
              if (pos > total / 2) pos -= total;
              else if (pos < -total / 2) pos += total;
              return pos;
            };

            const style = () => {
              const pos = relativePosition();
              const baseOffset = 150;
              const offset = pos * baseOffset;
              let scale = 1;
              let zIndex = 20;

              if (pos === 0) {
                scale = 1;
                zIndex = 20;
              } else if (Math.abs(pos) === 1) {
                scale = 0.9;
                zIndex = 10;
              } else if (Math.abs(pos) === 2) {
                scale = 0.8;
                zIndex = 0;
              } else {
                scale = 0;
                zIndex = -1;
              }

              return {
                transform: `translateX(calc(-50% + ${offset}px)) scale(${scale})`,
                "z-index": zIndex,
                opacity: scale > 0 ? 1 : 0,
              };
            };

            return (
              <div
                class="absolute left-1/2 h-[450px] w-[300px] origin-center transition-all duration-500 ease-in-out"
                style={style()}
              >
                <ProjectCard
                  project={project}
                  isActive={relativePosition() === 0}
                  onThumbnailClick={openModal}
                />
              </div>
            );
          }}
        </For>
      </div>

      {/* Navigation */}
      <div class="mt-8 flex justify-center gap-4">
        <button
          onclick={goToPrev}
          class="btn btn-outline btn-primary"
          aria-label="Previous project"
          type="button"
        >
          ← Previous
        </button>
        <div class="flex items-center gap-2">
          <span class="text-sm">
            {currentIndex() + 1} / {filteredProjects().length}
          </span>
        </div>
        <button
          onclick={goToNext}
          class="btn btn-outline btn-primary"
          type="button"
          aria-label="Next project"
        >
          Next →
        </button>
      </div>

      {/* Screenshot Modal */}
      <Show when={modalScreenshots().length > 0}>
        <ScreenshotModal
          screenshots={modalScreenshots()}
          initialIndex={modalIndex()}
          onClose={closeModal}
        />
      </Show>
    </Section>
  );
};
```

**Step 2: Run quality check**

Run: `bun quality`
Expected: PASS

**Step 3: Verify in browser**

Run: `bun start`
Check:
- Projects carousel shows 3 active projects by default
- Toggle shows all 14 projects
- Deprecated projects are dimmed with badge
- Thumbnail strip visible on projects with screenshots
- Clicking thumbnail opens modal
- Modal navigation works
- Modal closes on backdrop/X

**Step 4: Commit**

```bash
git add src/features/projects/ProjectsSection.tsx
git commit -m "feat: integrate filter, modal, and real project data into carousel"
```
