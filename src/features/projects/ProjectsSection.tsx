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
        (prev - 1 + filteredProjects().length) % filteredProjects().length,
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
