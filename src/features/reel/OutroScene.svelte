<script lang="ts">
  import Confetti from "./Confetti.svelte";
  import KineticText from "./KineticText.svelte";
  import {
    easeInOutCubic,
    easeOutBack,
    easeOutExpo,
    END_CARD_IN_S,
    progress,
    SCENES,
    STAGE,
  } from "./timeline";

  let { t }: { t: number } = $props();

  // Times are offsets from the scene start, so the outro moves as one block.
  const AT = SCENES.outro.start;
  const AVATAR = { start: AT + 0.25, land: AT + 0.6, y: 260, size: 200 };
  const COLLAPSE = { start: END_CARD_IN_S, end: END_CARD_IN_S + 0.4 };
  const burst = {
    x: STAGE.width / 2,
    y: AVATAR.y + AVATAR.size / 2,
    start: AVATAR.land,
    count: 48,
    reachInPx: 560,
    seed: 5,
  };

  const drop = $derived(progress(t, AVATAR.start, AVATAR.land));
  const ring = $derived(
    easeOutExpo(progress(t, AVATAR.land, AVATAR.land + 0.6)),
  );
  const pill = $derived(easeOutBack(progress(t, AT + 1.15, AT + 1.45)));
  const collapse = $derived(
    easeInOutCubic(progress(t, COLLAPSE.start, COLLAPSE.end)),
  );
  // Once the card is gone only the idle cursor is left, the reel's first frame.
  const cursorOn = $derived(Math.floor(t * 4) % 2 === 0);
</script>

<div
  class="absolute inset-0"
  style:transform="scale({1 - collapse})"
  style:transform-origin="50% 50%"
>
  {#if ring > 0 && ring < 1}
    <div
      class="absolute rounded-full border-4 border-accent"
      style:left="{burst.x}px"
      style:top="{burst.y}px"
      style:width="{ring * 900}px"
      style:height="{ring * 900}px"
      style:transform="translate(-50%, -50%)"
      style:opacity={1 - ring}
    ></div>
  {/if}
  {#if drop > 0}
    <div
      class="absolute overflow-hidden rounded-full border-[6px] border-accent bg-surface"
      style:left="{(STAGE.width - AVATAR.size) / 2}px"
      style:top="{-AVATAR.size + (AVATAR.y + AVATAR.size) * drop ** 2}px"
      style:width="{AVATAR.size}px"
      style:height="{AVATAR.size}px"
      style:box-shadow={"0 0 60px color-mix(in oklab, var(--color-accent) 50%, transparent)"}
    >
      <img
        src="/images/jordan-wttj.webp"
        alt=""
        class="size-full object-cover"
      />
    </div>
  {/if}
  <div
    class="absolute top-[510px] left-0 flex w-full flex-col items-center gap-5"
  >
    <KineticText
      text="JORDAN KOWAL"
      {t}
      start={AT + 0.7}
      staggerInS={0.035}
      class="font-display text-[120px] leading-none text-ink"
    />
    <KineticText
      text="Fullstack engineer · product mindset"
      {t}
      start={AT + 0.95}
      staggerInS={0.012}
      class="text-5xl text-muted"
    />
    <span
      class="mt-6 rounded-full bg-accent px-10 py-4 font-display text-5xl text-on-accent"
      style:transform="scale({pill})"
      style:box-shadow={"0 0 50px color-mix(in oklab, var(--color-accent) 50%, transparent)"}
    >
      jordankowal.com
    </span>
  </div>
  <Confetti {burst} {t} />
</div>

{#if collapse >= 1}
  <span
    class="absolute top-1/2 left-1/2 -translate-1/2 font-display text-[140px] leading-none text-accent"
    style:opacity={cursorOn ? 1 : 0}>▌</span
  >
{/if}
