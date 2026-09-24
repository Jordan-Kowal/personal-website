<script lang="ts">
  import { onceVisible } from "@/utils";

  type Props = { value: number; class?: string };

  const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let { value, class: className = "" }: Props = $props();
  let hasEntered = $state(false);

  // Each slot rolls from 0 to its digit once the number scrolls into view.
  let slots = $derived(String(value).split(""));
</script>

<span
  class="odometer {className}"
  role="img"
  aria-label={value.toLocaleString()}
  {@attach onceVisible(() => (hasEntered = true))}
>
  {#each slots as digit, i (i)}
    <span class="slot" aria-hidden="true">
      <span
        class="column"
        style:--n={hasEntered ? Number(digit) : 0}
        style:--i={i}
      >
        {#each DIGITS as glyph (glyph)}
          <span>{glyph}</span>
        {/each}
      </span>
    </span>
  {/each}
</span>

<style>
  .odometer {
    display: inline-flex;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .slot {
    height: 1em;
    overflow: hidden;
  }
  .column {
    display: flex;
    flex-direction: column;
    transform: translateY(calc(var(--n) * -1em));
    transition: transform 1.1s var(--ease-spring);
    transition-delay: calc(var(--i) * 80ms);
  }
  .column > span {
    height: 1em;
  }
</style>
