<script lang="ts">
  import { Canvas } from "@threlte/core";
  import type { ComponentProps } from "svelte";
  import { NoToneMapping } from "three";
  import ProjectModel from "./ProjectModel.svelte";

  const MAX_PIXEL_RATIO = 2;

  let { kind, t, seed, aspect }: ComponentProps<typeof ProjectModel> = $props();
</script>

<!-- No tone mapping: the default AgX greys out the flat token colours. -->
<Canvas
  renderMode="on-demand"
  dpr={[1, MAX_PIXEL_RATIO]}
  toneMapping={NoToneMapping}
>
  <ProjectModel {kind} {t} {seed} {aspect} />
</Canvas>
