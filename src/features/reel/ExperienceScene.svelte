<script lang="ts">
  import { educationData, experienceData } from "@/features/timeline/data";
  import type { TimelineItem } from "@/features/timeline/types";
  import Confetti from "./Confetti.svelte";
  import KineticText from "./KineticText.svelte";
  import {
    clamp01,
    easeInOutCubic,
    easeOutExpo,
    lerp,
    MERGE_AT,
    progress,
    SCENES,
    STAGE,
  } from "./timeline";

  let { t }: { t: number } = $props();

  const TICKER = { start: 12.6, end: 14.8 };
  const WHIP_IN_S = 0.4;
  const CURRENT_YEAR = new Date().getFullYear();

  const yearOf = (date: string): number => Number(date.slice(0, 4));
  const byStart = (a: TimelineItem, b: TimelineItem): number =>
    a.startDate.localeCompare(b.startDate);
  const isProduct = (item: TimelineItem): boolean =>
    item.title.includes("Project Manager");

  const productRoles = experienceData.filter(isProduct).toSorted(byStart);
  // The dev track starts with self-training, before the first dev job.
  const devRoles = [
    ...educationData.filter((item) => item.title.startsWith("Self-training")),
    ...experienceData.filter((item) => !isProduct(item)),
  ].toSorted(byStart);
  const firstYear = yearOf(productRoles[0]?.startDate ?? "2011");
  const productEndYear = Math.max(
    ...productRoles.map((item) => yearOf(item.endDate ?? `${CURRENT_YEAR}`)),
  );
  const devStartYear = yearOf(devRoles[0]?.startDate ?? "2018");

  // When the ticker passes a year: roles appear as it reaches their start.
  const tickerTimeOf = (year: number): number =>
    lerp(
      TICKER.start,
      TICKER.end,
      (year - firstYear) / (CURRENT_YEAR - firstYear),
    );

  const tracks = [
    {
      label: "PRODUCT",
      from: firstYear,
      to: productEndYear,
      range: `${firstYear} → ${productEndYear}`,
      roles: productRoles,
      left: 150,
      titleAt: 12.45,
    },
    {
      label: "DEV",
      from: devStartYear,
      to: CURRENT_YEAR,
      range: `${devStartYear} → now`,
      roles: devRoles,
      left: 1030,
      titleAt: 12.55,
    },
  ];
  const burst = {
    x: STAGE.width / 2,
    y: STAGE.height / 2,
    start: MERGE_AT + 0.2,
    count: 50,
    reachInPx: 700,
    seed: 4,
  };

  const enter = $derived(
    easeInOutCubic(
      progress(t, SCENES.experience.start, SCENES.experience.start + WHIP_IN_S),
    ),
  );
  // Continuous for the bars, so they fill smoothly; the counter shows it floored.
  const year = $derived(
    lerp(firstYear, CURRENT_YEAR, progress(t, TICKER.start, TICKER.end)),
  );
  const merge = $derived(easeOutExpo(progress(t, MERGE_AT, MERGE_AT + 0.4)));
</script>

<div
  class="absolute inset-0"
  style:transform="translateX({(1 - enter) * STAGE.width}px)"
  style:filter="blur({Math.sin(enter * Math.PI) * 14}px)"
>
  <div
    class="absolute top-[130px] left-0 flex w-full flex-col items-center gap-2"
    style:opacity={1 - merge}
    style:transform="translateY({-merge * 60}px)"
  >
    <KineticText
      text="04 · EXPERIENCE"
      {t}
      start={12.4}
      staggerInS={0.02}
      class="font-display text-3xl tracking-[0.3em] text-accent"
    />
    <span class="font-display text-[170px] leading-none text-ink tabular-nums">
      {Math.floor(year)}
    </span>
  </div>

  {#each tracks as track (track.label)}
    {@const fill = clamp01((year - track.from) / (track.to - track.from))}
    <div
      class="absolute top-[430px] flex w-[740px] flex-col gap-5"
      style:left="{track.left}px"
      style:opacity={1 - merge}
      style:transform="translateY({merge * 80}px)"
    >
      <div class="flex items-baseline justify-between">
        <KineticText
          text={track.label}
          {t}
          start={track.titleAt}
          staggerInS={0.04}
          class="font-display text-8xl text-ink"
        />
        <KineticText
          text={track.range}
          {t}
          start={track.titleAt + 0.2}
          staggerInS={0.015}
          class="font-display text-3xl text-muted"
        />
      </div>
      <div
        class="h-9 overflow-hidden rounded-slot border-2 border-line bg-surface"
      >
        <div
          class="h-full origin-left bg-accent"
          style:transform="scaleX({fill})"
        ></div>
      </div>
      <div class="flex flex-col gap-2">
        {#each track.roles as role (role.id)}
          {@const appearAt = Math.max(
            track.titleAt + 0.3,
            tickerTimeOf(yearOf(role.startDate)),
          )}
          <div class="flex items-baseline gap-4 text-3xl">
            <KineticText
              text={String(yearOf(role.startDate))}
              {t}
              start={appearAt}
              staggerInS={0.02}
              class="font-display text-accent"
            />
            <KineticText
              text="{role.title} · {role.entity}"
              {t}
              start={appearAt + 0.05}
              staggerInS={0.008}
              class="text-ink"
            />
          </div>
        {/each}
      </div>
    </div>
  {/each}

  {#if merge > 0}
    <div
      class="absolute top-1/2 left-0 flex w-full -translate-y-1/2 flex-col items-center gap-4"
    >
      <KineticText
        text="{CURRENT_YEAR - firstYear} YEARS"
        {t}
        start={MERGE_AT + 0.1}
        staggerInS={0.04}
        class="font-display text-[210px] leading-none text-ink"
      />
      <KineticText
        text="OF EXPERIENCE"
        {t}
        start={MERGE_AT + 0.3}
        staggerInS={0.03}
        class="font-display text-8xl leading-none text-ink"
      />
      <KineticText
        text="PRODUCT + DEV"
        {t}
        start={MERGE_AT + 0.55}
        staggerInS={0.03}
        class="font-display text-6xl tracking-[0.2em] text-accent"
      />
    </div>
  {/if}
  <Confetti {burst} {t} />
</div>
