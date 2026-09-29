<script lang="ts">
  import Confetti from "./Confetti.svelte";
  import KineticText from "./KineticText.svelte";
  import {
    easeOutBack,
    easeOutExpo,
    INTRO_BURST_AT,
    progress,
    STAGE,
    typedText,
  } from "./timeline";

  let { t }: { t: number } = $props();

  const ROLE = "Fullstack engineer · product mindset";
  const CENTER = { x: STAGE.width / 2, y: STAGE.height / 2 };
  const BURST = {
    ...CENTER,
    start: INTRO_BURST_AT,
    count: 44,
    reachInPx: 520,
    seed: 1,
  };
  const PHOTO = { x: 420, y: 330, size: 420 };

  // The idle cursor the outro collapses into: blinking until it bursts.
  const cursorOn = $derived(Math.floor(t * 4) % 2 === 0);
  const ring = $derived(easeOutExpo(progress(t, INTRO_BURST_AT, 1.1)));
  const photo = $derived(easeOutBack(progress(t, 0.7, 1.15)));
  const brackets = $derived(easeOutExpo(progress(t, 0.9, 1.4)));
  const underline = $derived(easeOutExpo(progress(t, 1.35, 1.8)));
  const caretOn = $derived(Math.floor(t * 3) % 2 === 0);
</script>

{#if t < INTRO_BURST_AT}
  <span
    class="absolute top-1/2 left-1/2 -translate-1/2 font-display text-[140px] leading-none text-accent"
    style:opacity={cursorOn ? 1 : 0}>▌</span
  >
{/if}

{#if ring > 0 && ring < 1}
  <div
    class="absolute rounded-full border-4 border-accent"
    style:left="{CENTER.x}px"
    style:top="{CENTER.y}px"
    style:width="{ring * 1400}px"
    style:height="{ring * 1400}px"
    style:transform="translate(-50%, -50%)"
    style:opacity={1 - ring}
  ></div>
{/if}
<Confetti burst={BURST} {t} />

<div
  class="absolute"
  style:left="{PHOTO.x}px"
  style:top="{PHOTO.y}px"
  style:width="{PHOTO.size}px"
  style:height="{PHOTO.size}px"
>
  <div
    class="size-full overflow-hidden rounded-card border-4 border-accent bg-surface"
    style:transform="scale({photo}) rotate({(1 - photo) * -8}deg)"
    style:box-shadow="0 30px 80px rgb(0 0 0 / 0.5)"
  >
    <img src="/images/jordan-wttj.webp" alt="" class="size-full object-cover" />
  </div>
  <!-- Corner brackets slide in from outside, framing the portrait like a character select. -->
  {#each [0, 1, 2, 3] as corner (corner)}
    {@const right = corner % 2 === 1}
    {@const bottom = corner > 1}
    <div
      class="absolute size-14 border-accent"
      class:border-t-8={!bottom}
      class:border-b-8={bottom}
      class:border-l-8={!right}
      class:border-r-8={right}
      style:left={right ? "auto" : "-36px"}
      style:right={right ? "-36px" : "auto"}
      style:top={bottom ? "auto" : "-36px"}
      style:bottom={bottom ? "-36px" : "auto"}
      style:transform="translate({(1 - brackets) * (right ? 60 : -60)}px, {(1 -
        brackets) *
        (bottom ? 60 : -60)}px)"
      style:opacity={brackets}
    ></div>
  {/each}
</div>

<div class="absolute flex flex-col gap-3" style:left="960px" style:top="330px">
  <KineticText
    text="PLAYER 1 · READY"
    {t}
    start={0.85}
    staggerInS={0.02}
    class="font-display text-3xl tracking-[0.3em] text-accent"
  />
  <KineticText
    text="JORDAN"
    {t}
    start={0.95}
    staggerInS={0.05}
    class="font-display text-[150px] leading-[0.95] text-ink"
  />
  <KineticText
    text="KOWAL"
    {t}
    start={1.1}
    staggerInS={0.05}
    class="font-display text-[150px] leading-[0.95] text-accent"
  />
  <div
    class="h-1.5 w-[560px] origin-left bg-accent"
    style:transform="scaleX({underline})"
  ></div>
  <p class="m-0 mt-2 text-4xl text-muted">
    {typedText(ROLE, progress(t, 1.5, 2.1))}<span
      class="text-accent"
      style:opacity={t > 1.45 && caretOn ? 1 : 0}>|</span
    >
  </p>
</div>
