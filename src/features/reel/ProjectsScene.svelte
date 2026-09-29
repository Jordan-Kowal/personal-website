<script lang="ts">
  import { onMount } from "svelte";
  import { projectsData } from "@/features/projects/constants";
  import { CATEGORY_COLORS, SKILLS } from "@/features/skills/constants";
  import { SKILL_ICONS } from "@/features/skills/icons";
  import SkillIconSvg from "@/features/skills/inventory/SkillIconSvg.svelte";
  import { hasWebGL } from "@/utils";
  import Confetti from "./Confetti.svelte";
  import KineticText from "./KineticText.svelte";
  // Type-only, so three.js stays out of the bundle until the dynamic import below.
  import type ProjectModelCanvasComponent from "./models/ProjectModelCanvas.svelte";
  import { PROJECT_MODELS } from "./models/projectModels";
  import {
    easeInOutCubic,
    easeOutBack,
    LATEST_BADGE_DELAY_IN_S,
    PROJECT_PINS,
    progress,
    projectPinTimes,
    random,
    SCENES,
    STAGE,
  } from "./timeline";

  let { t }: { t: number } = $props();

  const POLAROID = { width: 250, height: 290, photoHeight: 200, padding: 12 };
  const WALL = {
    left: 700,
    top: 150,
    columns: 5,
    cellWidth: 230,
    cellHeight: 270,
  };
  const NEWEST = { x: 1250, y: 560, scale: 1.45 };
  const DROP_IN_S = 0.32;
  const WHIP_IN_S = 0.4;

  // Oldest first, so the reel lands on the latest project. Ids grow with each new project.
  const projects = projectsData.toSorted((a, b) => a.id - b.id);
  const older = projects.slice(0, -1);
  const { older: pinAt, newest: newestAt } = projectPinTimes(older.length);

  const polaroids = projects.map((project, i) => {
    const isNewest = i === projects.length - 1;
    const mainSkill = project.skills[0];
    return {
      project,
      isNewest,
      screenshot: project.screenshots[0],
      model: PROJECT_MODELS[project.name],
      // Last resort without a screenshot, a model, or WebGL: the main skill's icon.
      icon: mainSkill ? SKILL_ICONS[mainSkill] : undefined,
      iconColor: mainSkill
        ? CATEGORY_COLORS[SKILLS[mainSkill].category].border
        : "var(--color-accent)",
      // Jittered grid: every photo overlaps its neighbours a little, none hides another.
      x: isNewest
        ? NEWEST.x
        : WALL.left +
          (i % WALL.columns) * WALL.cellWidth +
          (random(i + 40) - 0.5) * 70,
      y: isNewest
        ? NEWEST.y
        : WALL.top +
          Math.floor(i / WALL.columns) * WALL.cellHeight +
          (random(i + 60) - 0.5) * 60,
      rotation: isNewest ? -3 : (random(i + 80) - 0.5) * 18,
      scale: isNewest ? NEWEST.scale : 1,
      pinAt: isNewest ? newestAt : (pinAt[i] ?? PROJECT_PINS.start),
      tapeRotation: (random(i + 100) - 0.5) * 20,
    };
  });
  const burst = {
    x: NEWEST.x + POLAROID.width / 2,
    y: NEWEST.y + POLAROID.height / 2,
    start: newestAt + DROP_IN_S * 0.8,
    count: 50,
    reachInPx: 620,
    seed: 3,
  };

  const PHOTO = {
    width: POLAROID.width - 2 * POLAROID.padding,
    height: POLAROID.photoHeight,
  };

  let ProjectModelCanvas: typeof ProjectModelCanvasComponent | undefined =
    $state();
  // 2D canvases, by project id: one WebGL context draws every model, Android Chrome allows only 8 per page.
  const modelTargets: Record<number, HTMLCanvasElement | undefined> = $state(
    {},
  );
  const models = $derived(
    polaroids.flatMap((polaroid) =>
      !polaroid.screenshot && polaroid.model
        ? [
            {
              kind: polaroid.model,
              seed: polaroid.project.id,
              target: modelTargets[polaroid.project.id],
            },
          ]
        : [],
    ),
  );

  onMount(() => {
    if (!hasWebGL()) return;
    import("./models/ProjectModelCanvas.svelte").then((module) => {
      ProjectModelCanvas = module.default;
    });
  });

  const whip = $derived(
    easeInOutCubic(
      progress(t, SCENES.projects.end - WHIP_IN_S, SCENES.projects.end),
    ),
  );
</script>

<div
  class="absolute inset-0"
  style:transform="translateX({-whip * STAGE.width}px)"
  style:filter="blur({Math.sin(whip * Math.PI) * 14}px)"
>
  <div class="absolute top-[330px] left-[150px] flex flex-col gap-2">
    <KineticText
      text="03 · QUESTS"
      {t}
      start={8.3}
      staggerInS={0.02}
      class="font-display text-3xl tracking-[0.3em] text-accent"
    />
    <KineticText
      text="LOTS OF"
      {t}
      start={8.35}
      staggerInS={0.04}
      class="font-display text-[120px] leading-[0.95] text-ink"
    />
    <KineticText
      text="PROJECTS"
      {t}
      start={8.5}
      staggerInS={0.04}
      class="font-display text-[120px] leading-[0.95] text-accent"
    />
  </div>

  <!-- Hidden rather than unmounted before its pin time, so a 3D polaroid's model is already drawn when it drops in. -->
  {#each polaroids as polaroid (polaroid.project.id)}
    {@const drop = easeOutBack(
      progress(t, polaroid.pinAt, polaroid.pinAt + DROP_IN_S),
    )}
    <div
      class="absolute flex flex-col rounded-[6px]"
      style:padding="{POLAROID.padding}px"
      style:left="{polaroid.x}px"
      style:top="{polaroid.y}px"
      style:width="{POLAROID.width}px"
      style:height="{POLAROID.height}px"
      style:visibility={t >= polaroid.pinAt ? "visible" : "hidden"}
      style:background="var(--color-ink)"
      style:transform="scale({polaroid.scale * (1.7 - 0.7 * drop)}) rotate({polaroid.rotation +
        (1 - drop) * 14}deg)"
      style:opacity={Math.min(1, drop * 3)}
      style:box-shadow="0 {6 + drop * 14}px {18 + drop * 30}px rgb(0 0 0 / {0.25 +
        drop * 0.35})"
    >
      <div
        class="relative w-full overflow-hidden rounded-[2px] bg-surface"
        style:height="{POLAROID.photoHeight}px"
      >
        {#if polaroid.screenshot}
          <img
            src="/{polaroid.screenshot}"
            alt=""
            class="size-full object-cover object-top"
          />
        {:else if polaroid.model && ProjectModelCanvas}
          <canvas
            bind:this={modelTargets[polaroid.project.id]}
            class="size-full"
            style:background={"radial-gradient(circle at 50% 40%, #4a3a2c, var(--color-surface) 75%)"}
          ></canvas>
        {:else if polaroid.icon}
          <div
            class="flex size-full items-center justify-center"
            style:background={"repeating-linear-gradient(135deg, var(--color-surface) 0 14px, var(--color-raised) 14px 28px)"}
          >
            <div class="size-24">
              <SkillIconSvg icon={polaroid.icon} color={polaroid.iconColor} />
            </div>
          </div>
        {/if}
      </div>
      <span
        class="mt-auto truncate text-center font-display text-2xl text-on-accent"
      >
        {polaroid.project.name}
      </span>
      <div
        class="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2"
        style:background={"color-mix(in oklab, var(--color-accent) 55%, transparent)"}
        style:rotate="{polaroid.tapeRotation}deg"
      ></div>
      {#if polaroid.isNewest}
        <span
          class="absolute -top-6 -right-8 rotate-12 rounded-full bg-accent px-3 py-1 font-display text-lg text-on-accent"
          style:transform="scale({easeOutBack(
            progress(
              t,
              newestAt + LATEST_BADGE_DELAY_IN_S,
              newestAt + LATEST_BADGE_DELAY_IN_S + 0.25,
            ),
          )})"
        >
          LATEST
        </span>
      {/if}
    </div>
  {/each}
  <Confetti {burst} {t} />
</div>

{#if ProjectModelCanvas}
  <!-- Never shown: each 3D polaroid copies its frame from this canvas. -->
  <div
    class="invisible absolute top-0 left-0"
    style:width="{PHOTO.width}px"
    style:height="{PHOTO.height}px"
  >
    <ProjectModelCanvas {models} {t} aspect={PHOTO.width / PHOTO.height} />
  </div>
{/if}
