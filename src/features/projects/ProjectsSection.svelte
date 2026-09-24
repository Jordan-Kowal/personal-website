<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { prefersReducedMotion, Spring } from "svelte/motion";
  import type { Attachment } from "svelte/attachments";
  import { Section } from "@/components/layout";
  import ProjectCard from "./components/ProjectCard.svelte";
  import ScreenshotModal from "./components/ScreenshotModal.svelte";
  import { projectsData } from "./constants";
  import { carouselPose, snapIndex, sortProjects } from "./utils";

  // Below this, a press is a click; past it, it becomes a drag and the click is swallowed.
  const DRAG_THRESHOLD_PX = 6;
  // How far the carousel stretches past its first and last card before springing back.
  const OVERSCROLL_CARDS = 0.4;
  const MIN_SPACING_PX = 140;
  const MAX_SPACING_PX = 240;
  const SPACING_SHARE = 0.24;
  // The second card opens centred, so the first one fills the left of the stage.
  const START_INDEX = 1;
  // Weight of the newest pointer sample in the release speed, so one jittery event can't fling it.
  const VELOCITY_SMOOTHING = 0.6;

  type Drag = {
    startX: number;
    startOffset: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    isDragging: boolean;
  };

  let showArchived = $state(true);
  let flippedId: number | null = $state(null);
  let openScreenshots: string[] = $state([]);
  let stageWidth = $state(0);
  let drag: Drag | null = null;
  let isClickSwallowed = false;

  // Fractional index of the card at the centre: 2.5 sits half way between the third and fourth.
  const offset = new Spring(START_INDEX, { stiffness: 0.1, damping: 0.75 });

  let projects = $derived(sortProjects(projectsData, showArchived));
  let spacing = $derived(
    Math.min(
      MAX_SPACING_PX,
      Math.max(MIN_SPACING_PX, stageWidth * SPACING_SHARE),
    ),
  );
  let centered = $derived(
    Math.min(projects.length - 1, Math.max(0, Math.round(offset.current))),
  );

  const goTo = (index: number) => {
    const next = Math.min(projects.length - 1, Math.max(0, index));
    if (next !== Math.round(offset.target)) flippedId = null;
    offset.set(next, { instant: prefersReducedMotion.current });
  };

  const activate = (index: number, id: number) => {
    if (index !== centered) goTo(index);
    else flippedId = flippedId === id ? null : id;
  };

  const toggleArchived = () => {
    showArchived = !showArchived;
    flippedId = null;
    offset.set(START_INDEX, { instant: true });
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    drag = {
      startX: event.clientX,
      startOffset: offset.current,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      isDragging: false,
    };
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    if (!drag.isDragging && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
    drag.isDragging = true;
    const next = Math.min(
      projects.length - 1 + OVERSCROLL_CARDS,
      Math.max(-OVERSCROLL_CARDS, drag.startOffset - dx / spacing),
    );
    offset.set(next, { instant: true });
    const elapsedSeconds = (event.timeStamp - drag.lastTime) / 1000;
    if (elapsedSeconds > 0) {
      const sample = -(event.clientX - drag.lastX) / spacing / elapsedSeconds;
      drag.velocity =
        sample * VELOCITY_SMOOTHING + drag.velocity * (1 - VELOCITY_SMOOTHING);
    }
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
  };

  const handlePointerUp = () => {
    if (!drag) return;
    if (drag.isDragging) {
      // A drag ending on another card fires no click at all: the flag must not outlive this gesture.
      isClickSwallowed = true;
      setTimeout(() => (isClickSwallowed = false));
      goTo(
        snapIndex({
          offset: offset.current,
          velocity: drag.velocity,
          count: projects.length,
        }),
      );
    }
    drag = null;
  };

  // The click that ends a drag lands on whatever card is under the pointer: it must not flip it.
  const swallowDragClick = (event: MouseEvent) => {
    if (!isClickSwallowed) return;
    isClickSwallowed = false;
    event.stopPropagation();
    event.preventDefault();
  };

  // Listeners go on through an attachment: the stage is a plain region, not a control of its own.
  const dragArea: Attachment<HTMLElement> = (node) => {
    node.addEventListener("pointerdown", handlePointerDown);
    node.addEventListener("click", swallowDragClick, { capture: true });
    return () => {
      node.removeEventListener("pointerdown", handlePointerDown);
      node.removeEventListener("click", swallowDragClick, { capture: true });
    };
  };
</script>

<svelte:window
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
/>

<Section
  id="projects"
  eyebrow="Side quests"
  icon="quest"
  title="Projects"
  intro="Every project is a side quest. The main story can wait."
>
  <div class="reveal mb-6 flex flex-wrap items-center justify-between gap-4">
    <label class="flex cursor-pointer items-center gap-3 text-sm text-muted">
      <input
        type="checkbox"
        class="switch"
        checked={showArchived}
        onchange={toggleArchived}
      />
      Show retired cards
    </label>
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="step-button"
        aria-label="Previous project"
        onclick={() => goTo(centered - 1)}
        disabled={centered === 0}
      >
        <ChevronLeft size={18} />
      </button>
      <span class="font-display text-sm text-muted" aria-live="polite">
        {String(centered + 1).padStart(2, "0")} / {String(
          projects.length,
        ).padStart(2, "0")}
      </span>
      <button
        type="button"
        class="step-button"
        aria-label="Next project"
        onclick={() => goTo(centered + 1)}
        disabled={centered === projects.length - 1}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>

  <div
    class="reveal stage"
    role="region"
    aria-roledescription="carousel"
    aria-label="Projects"
    bind:clientWidth={stageWidth}
    {@attach dragArea}
  >
    <ul class="cards m-0 list-none p-0">
      {#each projects as project, i (project.id)}
        {@const pose = carouselPose(i - offset.current)}
        <li
          class="slot"
          style:transform="translate3d(calc(-50% + {pose.x * spacing}px), 0, {pose.z}px)
          rotateY({pose.rotateY}deg) scale({pose.scale})"
          style:opacity={pose.opacity}
          style:z-index={100 - Math.round(Math.abs(i - offset.current) * 10)}
          style:visibility={pose.opacity === 0 ? "hidden" : undefined}
          aria-hidden={i !== centered && pose.opacity === 0}
          onfocusin={() => goTo(i)}
        >
          <ProjectCard
            {project}
            isCentered={i === centered}
            isFlipped={flippedId === project.id}
            onActivate={() => activate(i, project.id)}
            onFlipBack={() => (flippedId = null)}
            onOpenScreenshots={(screenshots) => (openScreenshots = screenshots)}
          />
        </li>
      {/each}
    </ul>
  </div>
</Section>

{#if openScreenshots.length > 0}
  <ScreenshotModal
    screenshots={openScreenshots}
    onClose={() => (openScreenshots = [])}
  />
{/if}

<style>
  /* The far cards run past the section: clipped sideways only, so a lifted card's shadow still shows,
     and faded out at both edges instead of cut. */
  .stage {
    position: relative;
    height: 25rem;
    overflow-x: clip;
    mask-image: linear-gradient(
      90deg,
      transparent,
      black 12%,
      black 88%,
      transparent
    );
    touch-action: pan-y;
    user-select: none;
    cursor: grab;
  }
  /* One perspective for the whole row, on the cards' direct parent, so they share a vanishing point. */
  .cards {
    position: relative;
    height: 100%;
    perspective: 1400px;
  }
  .stage:active {
    cursor: grabbing;
  }
  .slot {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    width: min(17rem, 72vw);
    height: 23rem;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .step-button {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    border: 1px solid var(--color-line);
    color: var(--color-ink);
    transition:
      border-color var(--t-control),
      color var(--t-control);
  }
  .step-button:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  .step-button:disabled {
    opacity: 0.4;
  }
  .switch {
    appearance: none;
    position: relative;
    width: 2.5rem;
    height: 1.4rem;
    border-radius: 999px;
    background: var(--color-raised);
    border: 1px solid var(--color-line);
    cursor: pointer;
    transition: background-color var(--t-control);
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
    background: var(--color-muted);
    transition:
      translate var(--t-surface) var(--ease-spring),
      background-color var(--t-control);
  }
  .switch:checked {
    background: color-mix(in oklab, var(--color-accent) 30%, transparent);
  }
  .switch:checked::after {
    translate: 1.1rem 0;
    background: var(--color-accent);
  }
</style>
