<script lang="ts">
  import { easeInOutCubic, progress, STAGE } from "./timeline";

  type Props = {
    t: number;
    /** The moment the stage is fully covered, where the scene underneath switches. */
    at: number;
    halfInS: number;
  };

  let { t, at, halfInS }: Props = $props();

  const STAGGER_IN_S = 0.035;
  const COLORS = [
    "var(--color-accent)",
    "var(--color-raised)",
    "var(--color-accent-deep)",
    "var(--color-accent)",
    "var(--color-star)",
    "var(--color-raised)",
  ];
  const BANDS = COLORS.length;

  // Bands sweep in from the left one after another, all cover the stage at `at`, then carry on out to the right.
  const first = $derived(at - halfInS - (BANDS - 1) * STAGGER_IN_S);
  const last = $derived(at + halfInS + (BANDS - 1) * STAGGER_IN_S);
</script>

{#if t >= first && t < last}
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    {#each COLORS as color, i (i)}
      {@const coverEnd = at - (BANDS - 1 - i) * STAGGER_IN_S}
      {@const uncoverStart = at + i * STAGGER_IN_S}
      {@const cover = easeInOutCubic(progress(t, coverEnd - halfInS, coverEnd))}
      {@const uncover = easeInOutCubic(
        progress(t, uncoverStart, uncoverStart + halfInS),
      )}
      <div
        class="absolute left-0 w-full"
        style:top="{(i * STAGE.height) / BANDS}px"
        style:height="{STAGE.height / BANDS + 1}px"
        style:background={color}
        style:transform="translateX({(cover - 1 + uncover) * 100}%)"
      ></div>
    {/each}
  </div>
{/if}
