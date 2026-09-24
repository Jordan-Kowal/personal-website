<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";

  type Props = {
    text: string;
    /** Shown instead of `text` while `isActive` is true. */
    activeText?: string;
    isActive?: boolean;
    /** Shuffle once when the component mounts. */
    playOnMount?: boolean;
    class?: string;
  };

  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?!<>";
  const SHUFFLE_DURATION_MS = 650;

  let {
    text,
    activeText,
    isActive = false,
    playOnMount = false,
    class: className = "",
  }: Props = $props();

  let target = $derived(isActive && activeText ? activeText : text);
  let shown = $state("");
  let hasMounted = false;
  let startedAt = 0;
  let frame = 0;

  const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

  // Characters settle left to right; the unsettled tail keeps flipping through glyphs.
  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / SHUFFLE_DURATION_MS);
    const settledCount = Math.floor(progress * target.length);
    shown = [...target]
      .map((char, i) =>
        i < settledCount || char === " " ? char : randomGlyph(),
      )
      .join("");
    if (progress < 1) frame = requestAnimationFrame(step);
  };

  const play = () => {
    cancelAnimationFrame(frame);
    if (prefersReducedMotion.current) {
      shown = target;
      return;
    }
    startedAt = performance.now();
    frame = requestAnimationFrame(step);
  };

  $effect(() => {
    target;
    if (hasMounted) untrack(play);
  });

  onMount(() => {
    hasMounted = true;
    if (playOnMount) play();
    return () => cancelAnimationFrame(frame);
  });
</script>

<!-- The real text stays readable to screen readers and before hydration; only the glyphs move. -->
<span class={className}>
  <span class="sr-only">{target}</span>
  <span aria-hidden="true">{shown || target}</span>
</span>
