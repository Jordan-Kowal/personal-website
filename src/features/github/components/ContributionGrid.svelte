<script lang="ts">
  import type { GitHubContribution } from "../types";
  import { toWeeks } from "../utils";

  type Props = { contributions: GitHubContribution[] };

  const LEVEL_OPACITY = [0.08, 0.3, 0.5, 0.75, 1];

  let { contributions }: Props = $props();
  let weeks = $derived(toWeeks(contributions));
</script>

<!-- The flat version of the skyline, for devices without WebGL. -->
<div class="overflow-x-auto">
  <div class="mx-auto flex w-max gap-[3px]">
    {#each weeks as week, x (x)}
      <div class="flex flex-col gap-[3px]">
        {#each week as day, y (y)}
          {#if day}
            <span
              class="h-2.5 w-2.5 rounded-[2px] bg-accent"
              style:opacity={LEVEL_OPACITY[day.level]}
              title="{day.count} contribution(s) on {day.date}"
            ></span>
          {:else}
            <span class="h-2.5 w-2.5"></span>
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>
