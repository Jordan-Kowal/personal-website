<script lang="ts">
  import { progress, random, STAGE } from "./timeline";

  type Props = {
    t: number;
    /** The moment the stage is fully covered, where the scene underneath switches. */
    at: number;
    halfInS: number;
  };

  let { t, at, halfInS }: Props = $props();

  const CELL_IN_PX = 120;
  const COLUMNS = STAGE.width / CELL_IN_PX;
  const ROWS = STAGE.height / CELL_IN_PX;
  const COLORS = [
    "var(--color-accent)",
    "var(--color-accent-deep)",
    "var(--color-raised)",
  ];

  // Each cell flips on at its own random moment, then off at another: the stage turns to pixels and back.
  const cells = Array.from({ length: COLUMNS * ROWS }, (_, i) => ({
    x: (i % COLUMNS) * CELL_IN_PX,
    y: Math.floor(i / COLUMNS) * CELL_IN_PX,
    onAt: random(i + 500) * 0.95,
    offAt: random(i + 900) * 0.95,
    color: COLORS[Math.floor(random(i + 700) * COLORS.length)],
  }));

  const cover = $derived(progress(t, at - halfInS, at));
  const uncover = $derived(progress(t, at, at + halfInS));
</script>

{#if t >= at - halfInS && t < at + halfInS}
  <svg
    class="pointer-events-none absolute inset-0 size-full"
    aria-hidden="true"
  >
    {#each cells as cell, i (i)}
      {#if cover > cell.onAt && uncover <= cell.offAt}
        <rect
          x={cell.x}
          y={cell.y}
          width={CELL_IN_PX + 1}
          height={CELL_IN_PX + 1}
          fill={cell.color}
        />
      {/if}
    {/each}
  </svg>
{/if}
