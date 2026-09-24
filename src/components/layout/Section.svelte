<script lang="ts">
  import type { Snippet } from "svelte";
  import { PixelIcon } from "@/components/ui";
  import type { PixelIconName } from "@/components/ui/pixelIcons";

  type Props = {
    id: string;
    title: string;
    /** Small label above the title, in the game register ("Inventory", "Adventure map"). */
    eyebrow: string;
    /** Pixel icon shown before the eyebrow. */
    icon: PixelIconName;
    intro?: string;
    children: Snippet;
  };

  let { id, title, eyebrow, icon, intro, children }: Props = $props();
</script>

<section
  {id}
  class="relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 md:py-20"
>
  <header class="reveal mb-12 flex flex-col items-center gap-3 text-center">
    <span
      class="flex items-center gap-2 font-display text-sm tracking-[0.2em] text-accent uppercase"
    >
      <PixelIcon name={icon} />
      {eyebrow}
    </span>
    <h2 class="m-0 font-display text-4xl font-semibold text-ink md:text-5xl">
      {title}
    </h2>
    {#if intro}
      <p class="m-0 max-w-xl text-balance text-muted">{intro}</p>
    {/if}
  </header>
  {@render children()}
</section>
