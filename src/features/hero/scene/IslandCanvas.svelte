<script lang="ts">
  import { Canvas } from "@threlte/core";
  import type { ComponentProps } from "svelte";
  import { PCFShadowMap } from "three";
  import Scene from "./Scene.svelte";

  const MAX_PIXEL_RATIO = 1.75;

  let { pointer, anchor, isAnimated }: ComponentProps<typeof Scene> = $props();
</script>

<!-- On-demand: frames only render while a task runs, so a paused or offscreen scene costs nothing. -->
<Canvas
  renderMode="on-demand"
  dpr={[1, MAX_PIXEL_RATIO]}
  shadows={PCFShadowMap}
>
  <Scene {pointer} {anchor} {isAnimated} />
</Canvas>
