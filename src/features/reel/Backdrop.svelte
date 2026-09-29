<script lang="ts">
  import { driftingMotes } from "./particles";
  import { DURATION_IN_S, wrap } from "./timeline";

  let { t }: { t: number } = $props();

  const GRID_IN_PX = 64;
  const MOTE_COUNT = 48;

  // Whole grid cells and whole turns per reel, so the loop point is invisible.
  const turn = $derived((t / DURATION_IN_S) * Math.PI * 2);
  const gridX = $derived((t / DURATION_IN_S) * GRID_IN_PX * 2);
  const gridY = $derived((t / DURATION_IN_S) * GRID_IN_PX * 3);
  const motes = $derived(driftingMotes(MOTE_COUNT, t));
</script>

<div class="absolute inset-0 overflow-hidden bg-page">
  <!-- Everything here moves by transform only, so the layers are composited instead of repainted each frame. -->
  <div
    class="absolute opacity-[0.06]"
    style:inset="-{GRID_IN_PX}px"
    style:background-image={"linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)"}
    style:background-size="{GRID_IN_PX}px {GRID_IN_PX}px"
    style:transform="translate({wrap(gridX, GRID_IN_PX)}px, {wrap(
      gridY,
      GRID_IN_PX,
    )}px)"
    style:will-change="transform"
  ></div>
  <div
    class="absolute top-[-260px] left-[380px] size-[1100px] rounded-full"
    style:background={"radial-gradient(circle, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent 65%)"}
    style:transform="translate({Math.cos(turn) * 260}px, {Math.sin(turn * 2) *
      120}px)"
    style:will-change="transform"
  ></div>
  <div
    class="absolute top-[380px] left-[900px] size-[1000px] rounded-full"
    style:background={"radial-gradient(circle, color-mix(in oklab, var(--color-star) 10%, transparent), transparent 65%)"}
    style:transform="translate({Math.sin(turn) * 300}px, {Math.cos(turn * 2) *
      140}px)"
    style:will-change="transform"
  ></div>
  <svg class="absolute inset-0 size-full" aria-hidden="true">
    {#each motes as mote, i (i)}
      <rect
        x={mote.x}
        y={mote.y}
        width={mote.size}
        height={mote.size}
        fill="var(--color-accent)"
        opacity={mote.opacity * 0.6}
      />
    {/each}
  </svg>
  <div
    class="absolute inset-0"
    style:background={"radial-gradient(ellipse at center, transparent 50%, rgb(0 0 0 / 0.6))"}
  ></div>
</div>
