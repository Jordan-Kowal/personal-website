<script lang="ts">
  import { Canvas } from "@threlte/core";
  import type { ComponentProps } from "svelte";
  import { NoToneMapping } from "three";
  import ProjectModels from "./ProjectModels.svelte";

  const MAX_PIXEL_RATIO = 2;

  let { models, t, aspect }: ComponentProps<typeof ProjectModels> = $props();
</script>

<!-- No auto render: ProjectModels renders each model itself. No tone mapping: the default AgX greys out the flat token colours. -->
<Canvas
  renderMode="on-demand"
  autoRender={false}
  dpr={[1, MAX_PIXEL_RATIO]}
  toneMapping={NoToneMapping}
>
  <ProjectModels {models} {t} {aspect} />
</Canvas>
