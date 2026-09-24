<script lang="ts">
  import { RotateCcw, RotateCw } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { prefersReducedMotion, Spring } from "svelte/motion";
  import { experienceData } from "@/features/timeline/data";

  const TILT_MAX_DEGREES = 14;
  // Only the year ships, so the page never exposes the real birth date.
  // The level ticks over on January 1st, not on the birthday.
  const BIRTH_YEAR = 1989;
  const CURRENT_JOB = experienceData[0];

  // The page is prerendered: without the refresh on mount, the level stays at the build's year.
  let level = $state(new Date().getFullYear() - BIRTH_YEAR);
  let sheet = $derived([
    { label: "Level", value: String(level) },
    { label: "Class", value: "Fullstack engineer" },
    { label: "Guild", value: CURRENT_JOB.entity },
    { label: "Location", value: "Toulouse, France" },
    { label: "Specialization", value: "Python · TypeScript · AI" },
  ]);

  onMount(() => {
    level = new Date().getFullYear() - BIRTH_YEAR;
  });

  let isFlipped = $state(false);
  let isHovered = $state(false);
  let shine = $state({ x: 50, y: 50 });

  const tilt = new Spring({ x: 0, y: 0 }, { stiffness: 0.12, damping: 0.5 });
  const flip = new Spring(0, { stiffness: 0.08, damping: 0.45 });

  $effect(() => {
    flip.set(isFlipped ? 180 : 0, { instant: prefersReducedMotion.current });
  });

  const handlePointerMove = (
    event: PointerEvent & { currentTarget: HTMLElement },
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    shine = { x: px * 100, y: py * 100 };
    if (prefersReducedMotion.current) return;
    tilt.target = {
      x: (0.5 - py) * TILT_MAX_DEGREES * 2,
      y: (px - 0.5) * TILT_MAX_DEGREES * 2,
    };
  };

  const handlePointerLeave = () => {
    isHovered = false;
    tilt.target = { x: 0, y: 0 };
  };
</script>

<div class="card-stage">
  <button
    type="button"
    class="card"
    aria-pressed={isFlipped}
    aria-label={isFlipped
      ? "Flip the card back to the photo"
      : "Flip the card to read the character sheet"}
    onclick={() => (isFlipped = !isFlipped)}
    onpointerenter={() => (isHovered = true)}
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    style:transform="rotateX({tilt.current.x}deg) rotateY({tilt.current.y +
      flip.current}deg)"
    style:--mx="{shine.x}%"
    style:--my="{shine.y}%"
    class:hovered={isHovered}
  >
    <!-- Front: the portrait -->
    <span class="face front">
      <span class="flex items-center justify-between px-4 pt-3">
        <span class="font-display text-lg text-ink">Jordan Kowal</span>
        <span class="font-display text-sm text-accent">LV {level}</span>
      </span>
      <span class="portrait mx-3 mt-2">
        <img
          src="/images/jordan-wttj.webp"
          alt=""
          fetchpriority="high"
          decoding="async"
          class="h-full w-full object-cover object-top"
        />
      </span>
      <span
        class="flex items-center justify-between px-4 pt-3 text-xs text-muted"
      >
        <span class="font-display tracking-widest text-accent uppercase">
          Software Engineer
        </span>
        <span>#001</span>
      </span>
      <span
        class="flex items-center justify-center gap-2 px-3 pt-3 pb-4 text-xs text-muted"
      >
        <RotateCw size={12} /> Click to flip the card
      </span>
      <span class="holo"></span>
    </span>

    <!-- Back: the character sheet -->
    <span class="face back">
      <span class="px-5 pt-5 font-display text-xl text-accent">
        Character sheet
      </span>
      <span class="flex flex-col gap-3 px-5 pt-4 text-left">
        {#each sheet as row (row.label)}
          <span class="flex flex-col">
            <span class="text-[0.7rem] tracking-wider text-muted uppercase">
              {row.label}
            </span>
            <span class="text-sm font-semibold text-ink">{row.value}</span>
          </span>
        {/each}
      </span>
      <span
        class="mt-auto flex items-center justify-center gap-2 pb-4 text-xs text-muted"
      >
        <RotateCcw size={12} /> Click to flip back
      </span>
      <span class="holo"></span>
    </span>
  </button>
</div>

<style>
  .card-stage {
    perspective: 1100px;
    width: min(300px, 60vw, 34svh);
    aspect-ratio: 5 / 7;
  }
  .card {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    transform-style: preserve-3d;
    border-radius: var(--radius-card);
    will-change: transform;
  }
  .card:focus-visible {
    outline-offset: 6px;
  }
  .face {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--radius-card);
    backface-visibility: hidden;
    background: linear-gradient(
      160deg,
      var(--color-raised),
      var(--color-surface) 60%
    );
    border: 1px solid var(--color-line);
    box-shadow:
      0 30px 60px -20px rgb(0 0 0 / 0.7),
      0 0 0 1px rgb(255 200 61 / 0.08) inset;
    transition: box-shadow var(--t-surface) var(--ease-soft);
  }
  .card.hovered .face {
    box-shadow:
      0 40px 70px -20px rgb(0 0 0 / 0.75),
      0 0 0 1px rgb(255 200 61 / 0.35) inset;
  }
  .back {
    transform: rotateY(180deg);
  }
  .portrait {
    position: relative;
    flex: 1;
    overflow: hidden;
    border-radius: 12px;
    background: radial-gradient(
      circle at 50% 30%,
      #ffcf7a,
      #e0892f 55%,
      #7a3f1c
    );
  }
  /* Holographic foil: a rainbow sheen and a hot spot that both follow the pointer. */
  .holo {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    mix-blend-mode: color-dodge;
    opacity: 0;
    transition: opacity var(--t-surface) var(--ease-soft);
    background:
      radial-gradient(
        circle at var(--mx) var(--my),
        rgb(255 255 255 / 0.55),
        transparent 38%
      ),
      linear-gradient(
        115deg,
        transparent 20%,
        rgb(255 120 180 / 0.35) calc(var(--mx) - 10%),
        rgb(120 220 255 / 0.35) var(--mx),
        rgb(255 230 120 / 0.35) calc(var(--mx) + 10%),
        transparent 80%
      );
  }
  .card.hovered .holo {
    opacity: 0.55;
  }
</style>
