<script lang="ts">
  import { Canvas } from "@threlte/core";
  import type { ComponentProps } from "svelte";
  import InventoryIcons from "./InventoryIcons.svelte";

  const MAX_PIXEL_RATIO = 1.75;

  let {
    items,
    spinning,
    dimmed,
    pointer,
    isAnimated,
  }: ComponentProps<typeof InventoryIcons> = $props();
</script>

<Canvas renderMode="on-demand" dpr={[1, MAX_PIXEL_RATIO]}>
  <InventoryIcons {items} {spinning} {dimmed} {pointer} {isAnimated} />
</Canvas>
