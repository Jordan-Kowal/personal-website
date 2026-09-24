<script lang="ts">
  import { PIXEL_ICONS, type PixelIconName, pixelPath } from "./pixelIcons";

  let { name, size = 16 }: { name: PixelIconName; size?: number } = $props();

  let rows = $derived(PIXEL_ICONS[name]);
</script>

<!-- crispEdges keeps every pixel square at any size, like the font. -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 12 12"
  fill="currentColor"
  shape-rendering="crispEdges"
  aria-hidden="true"
>
  <path d={pixelPath(rows, "#")} />
  <path d={pixelPath(rows, "+")} opacity="0.45" />
</svg>
