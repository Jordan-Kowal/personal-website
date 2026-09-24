<script lang="ts">
  import { Canvas } from "@threlte/core";
  import type { ComponentProps } from "svelte";
  import Skyline from "./Skyline.svelte";

  const MAX_PIXEL_RATIO = 1.75;

  let {
    contributions,
    view,
    isAnimated,
    onHover,
  }: ComponentProps<typeof Skyline> = $props();
</script>

<Canvas renderMode="on-demand" dpr={[1, MAX_PIXEL_RATIO]}>
  <Skyline {contributions} {view} {isAnimated} {onHover} />
</Canvas>
