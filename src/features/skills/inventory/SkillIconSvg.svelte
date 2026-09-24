<script lang="ts">
  import type { SkillIcon } from "../icons";

  type Props = { icon: SkillIcon; color: string };

  let { icon, color }: Props = $props();
</script>

<!-- The flat twin of the 3D item: shown before three.js loads, and for good without WebGL. -->
{#if icon.kind === "logo"}
  <svg viewBox="0 0 24 24" class="h-full w-full" aria-hidden="true">
    <path d={icon.path} fill={color} />
  </svg>
{:else}
  <svg
    viewBox="0 0 24 24"
    class="h-full w-full"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    {#each icon.nodes as [tag, attributes], i (i)}
      <svelte:element
        this={tag}
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      />
    {/each}
  </svg>
{/if}
