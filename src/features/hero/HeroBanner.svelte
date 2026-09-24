<script lang="ts">
  import { FileText, Gamepad2 } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import { ShuffleText } from "@/components/ui";
  import { hasWebGL } from "@/utils";
  import PlayerCard from "./components/PlayerCard.svelte";
  // Type-only, so three.js stays out of the main bundle until the dynamic import below.
  import type IslandCanvasComponent from "./scene/IslandCanvas.svelte";

  let IslandCanvas: typeof IslandCanvasComponent | undefined = $state();
  let hero: HTMLElement | undefined = $state();
  let cardSlot: HTMLElement | undefined = $state();
  // Bottom centre of the player card in the hero's normalized coordinates: the island's spot.
  const anchor = $state({ x: 0.4, y: -0.5 });
  let isHeroVisible = $state(true);
  let isPageVisible = $state(true);
  const pointer = $state({ x: 0, y: 0, isInside: false });

  let isAnimated = $derived(
    isHeroVisible && isPageVisible && !prefersReducedMotion.current,
  );

  // Listened on the window so the scene still hears the pointer over the text and the card.
  const handlePointerMove = (event: PointerEvent) => {
    if (!hero || !isHeroVisible) return;
    const rect = hero.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointer.isInside = Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1;
  };

  const measureAnchor = () => {
    if (!hero || !cardSlot) return;
    const heroRect = hero.getBoundingClientRect();
    const cardRect = cardSlot.getBoundingClientRect();
    const centreX = cardRect.left + cardRect.width / 2 - heroRect.left;
    const bottomY = cardRect.bottom - heroRect.top;
    anchor.x = (centreX / heroRect.width) * 2 - 1;
    anchor.y = -(bottomY / heroRect.height) * 2 + 1;
  };

  const handleVisibilityChange = () => {
    isPageVisible = document.visibilityState === "visible";
  };

  onMount(() => {
    // three.js only loads on devices that can draw it, after the HTML is already on screen.
    if (hasWebGL()) {
      import("./scene/IslandCanvas.svelte").then((module) => {
        IslandCanvas = module.default;
      });
    }
    const observer = new IntersectionObserver(([entry]) => {
      isHeroVisible = entry.isIntersecting;
    });
    const resizeObserver = new ResizeObserver(measureAnchor);
    if (hero) {
      observer.observe(hero);
      resizeObserver.observe(hero);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });
</script>

<svelte:window onpointermove={handlePointerMove} />

<header
  id="home"
  bind:this={hero}
  class="hero relative flex min-h-svh w-full items-center overflow-hidden"
>
  <div class="absolute inset-0" aria-hidden="true">
    {#if IslandCanvas}
      <div class="scene-fade-in h-full w-full">
        <IslandCanvas {pointer} {anchor} {isAnimated} />
      </div>
    {/if}
  </div>

  <div
    class="pointer-events-none relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-28 pb-20 sm:px-8 lg:grid-cols-2"
  >
    <div
      class="pointer-events-auto flex flex-col items-center gap-5 text-center lg:items-start lg:text-left"
    >
      <span
        class="arrive font-display text-sm tracking-[0.25em] text-accent uppercase"
        style:--i={0}
      >
        Player 1 · Software Engineer
      </span>
      <h1
        class="arrive m-0 font-display text-5xl leading-none font-bold text-ink sm:text-7xl"
        style:--i={1}
      >
        <ShuffleText text="Jordan Kowal" playOnMount />
      </h1>
      <p
        class="arrive m-0 max-w-md text-lg text-balance text-muted"
        style:--i={2}
      >
        Fullstack engineer with a product mindset, leveraging AI to ship faster
        and smarter.
      </p>
      <div
        class="arrive flex flex-wrap items-center justify-center gap-3"
        style:--i={3}
      >
        <a
          href="#skills"
          class="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-lg text-on-accent transition-[background-color,scale] duration-150 hover:bg-accent-deep active:scale-[0.97]"
        >
          <Gamepad2 size={20} /> Press start
        </a>
        <a
          href="/files/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 rounded-full border border-line px-5 py-3 font-semibold text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          <FileText size={18} /> Resume
        </a>
      </div>
    </div>

    <div class="flex justify-center">
      <!-- Measured untransformed: the arrival animation must not skew the island's spot. -->
      <div bind:this={cardSlot} class="pointer-events-auto">
        <div class="arrive" style:--i={2}>
          <PlayerCard />
        </div>
      </div>
    </div>
  </div>

  <a
    href="#skills"
    class="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 font-display text-xs tracking-[0.3em] text-muted uppercase transition-colors hover:text-accent sm:block"
  >
    Scroll to explore ↓
  </a>
</header>

<style>
  /* The low sun behind the island. It is also the whole backdrop when WebGL is off. */
  .hero {
    background:
      radial-gradient(
        ellipse 60% 55% at 72% 42%,
        rgb(255 170 70 / 0.28),
        transparent 70%
      ),
      radial-gradient(
        ellipse 90% 70% at 50% 110%,
        rgb(255 120 40 / 0.12),
        transparent 70%
      ),
      var(--color-page);
  }
  @media (max-width: 1023px) {
    .hero {
      background:
        radial-gradient(
          ellipse 90% 45% at 50% 70%,
          rgb(255 170 70 / 0.28),
          transparent 70%
        ),
        var(--color-page);
    }
  }
  /* The island dissolves into the page instead of ending on the hero's edge. */
  .hero::after {
    content: "";
    position: absolute;
    inset: auto 0 0 0;
    height: 22%;
    pointer-events: none;
    background: linear-gradient(transparent, var(--color-page));
  }
  .scene-fade-in {
    animation: fade 1.2s var(--ease-soft) both;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
  }
</style>
