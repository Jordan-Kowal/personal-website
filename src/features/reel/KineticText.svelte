<script lang="ts">
  import { easeOutExpo, progress } from "./timeline";

  type Props = {
    text: string;
    t: number;
    /** When the first letter starts rising. */
    start: number;
    /** When the letters start leaving upward. Stays on screen without it. */
    exitAt?: number;
    staggerInS?: number;
    class?: string;
  };

  let {
    text,
    t,
    start,
    exitAt,
    staggerInS = 0.03,
    class: className = "",
  }: Props = $props();

  const ENTER_IN_S = 0.55;
  const EXIT_IN_S = 0.35;

  const letters = $derived([...text]);
</script>

<!-- Each letter rises out of the line's own box, which clips it like a mask. -->
<span class="inline-flex overflow-hidden pb-[0.1em] {className}">
  {#each letters as letter, i (i)}
    {@const letterStart = start + i * staggerInS}
    {@const enter = easeOutExpo(
      progress(t, letterStart, letterStart + ENTER_IN_S),
    )}
    {@const leave =
      exitAt === undefined
        ? 0
        : easeOutExpo(
            progress(
              t,
              exitAt + (i * staggerInS) / 2,
              exitAt + (i * staggerInS) / 2 + EXIT_IN_S,
            ),
          )}
    <span
      class="inline-block whitespace-pre"
      style:transform="translateY({(1 - enter) * 110 - leave * 110}%)"
      >{letter}</span
    >
  {/each}
</span>
