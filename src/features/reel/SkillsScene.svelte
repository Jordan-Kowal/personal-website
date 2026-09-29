<script lang="ts">
  import {
    CATEGORY_COLORS,
    SKILLS,
    type Skill,
    SkillCategory,
  } from "@/features/skills/constants";
  import { SKILL_ICONS } from "@/features/skills/icons";
  import SkillIconSvg from "@/features/skills/inventory/SkillIconSvg.svelte";
  import { liftColor } from "@/features/skills/utils";
  import Confetti from "./Confetti.svelte";
  import KineticText from "./KineticText.svelte";
  import {
    easeOutBack,
    easeOutExpo,
    ORB_DROP,
    popTimes,
    progress,
    reachedCount,
    SKILL_POPS,
  } from "./timeline";

  let { t }: { t: number } = $props();

  const COLUMNS = 7;
  const SLOT_IN_PX = 104;
  const GAP_IN_PX = 14;
  const GRID = { left: 958, top: 170 };
  // Dark brand colours (Three.js black, Django green) are lifted to stay visible, as on the site.
  const MIN_ICON_LUMINANCE = 0.12;
  const RING_DURATION_IN_S = 0.6;
  const RING_MAX_RADIUS_IN_PX = 1100;

  const iconColor = (skill: Skill): string => {
    const icon = SKILL_ICONS[skill.label];
    return icon.kind === "logo"
      ? liftColor({ hex: icon.color, minLuminance: MIN_ICON_LUMINANCE })
      : CATEGORY_COLORS[skill.category].border;
  };

  const allSkills = Object.values(SKILLS);
  const baseSkills = allSkills.filter(
    (skill) => skill.category !== SkillCategory.AI,
  );
  const aiSkills = allSkills.filter(
    (skill) => skill.category === SkillCategory.AI,
  );
  const rows = Math.ceil(baseSkills.length / COLUMNS);
  const gridWidth = COLUMNS * (SLOT_IN_PX + GAP_IN_PX) - GAP_IN_PX;
  const gridHeight = rows * (SLOT_IN_PX + GAP_IN_PX) - GAP_IN_PX;
  const impact = {
    x: GRID.left + gridWidth / 2,
    y: GRID.top + gridHeight / 2,
  };

  const popAt = popTimes(baseSkills.length, SKILL_POPS.start, SKILL_POPS.pace);
  const slots = baseSkills.map((skill, i) => {
    const x = GRID.left + (i % COLUMNS) * (SLOT_IN_PX + GAP_IN_PX);
    const y = GRID.top + Math.floor(i / COLUMNS) * (SLOT_IN_PX + GAP_IN_PX);
    const distance = Math.hypot(
      x + SLOT_IN_PX / 2 - impact.x,
      y + SLOT_IN_PX / 2 - impact.y,
    );
    return {
      skill,
      x,
      y,
      color: iconColor(skill),
      popAt: popAt[i] ?? SKILL_POPS.start,
      // The ring glints each slot as it sweeps past it: it grows linearly, so time follows distance.
      glintAt:
        ORB_DROP.end + (distance / RING_MAX_RADIUS_IN_PX) * RING_DURATION_IN_S,
    };
  });
  const aiSlots = aiSkills.map((skill, i) => ({
    skill,
    color: "var(--color-accent)",
    landAt: ORB_DROP.end + 0.15 + i * 0.12,
  }));
  const burst = {
    ...impact,
    start: ORB_DROP.end,
    count: 60,
    reachInPx: 760,
    seed: 2,
  };

  const count = $derived(reachedCount(t, popAt));
  const latest = $derived(slots[count - 1]);
  const orb = $derived(progress(t, ORB_DROP.start, ORB_DROP.end));
  const ring = $derived(
    progress(t, ORB_DROP.end, ORB_DROP.end + RING_DURATION_IN_S),
  );
  const flash = $derived(
    t >= ORB_DROP.end ? 1 - progress(t, ORB_DROP.end, ORB_DROP.end + 0.4) : 0,
  );
  const empowered = $derived(t >= ORB_DROP.end);
  const stamp = $derived(easeOutBack(progress(t, 6.75, 7.05)));
</script>

<div class="absolute top-[200px] left-[150px] flex w-[720px] flex-col">
  <KineticText
    text="02 · INVENTORY"
    {t}
    start={3.2}
    staggerInS={0.02}
    class="font-display text-3xl tracking-[0.3em] text-accent"
  />
  <div class="flex items-end gap-6">
    <span
      class="font-display text-[260px] leading-[0.85] text-ink tabular-nums"
      style:transform="scale({1 +
        (latest && t - latest.popAt < 0.1 ? 0.03 : 0)})"
    >
      {String(count).padStart(2, "0")}
    </span>
    <span class="pb-6 font-display text-6xl tracking-[0.15em] text-muted">
      SKILLS
    </span>
  </div>
  <!-- The newest skill's name, readable while pops are slow, a blur once they race. -->
  <div class="h-16 overflow-hidden">
    {#if latest}
      <span
        class="block text-5xl font-bold"
        style:color={latest.color}
        style:transform="translateY({(1 -
          easeOutExpo(progress(t, latest.popAt, latest.popAt + 0.15))) *
          100}%)"
      >
        {latest.skill.label}
      </span>
    {/if}
  </div>
  {#if stamp > 0}
    <div class="mt-10 flex items-center gap-6">
      <span
        class="rounded-slot bg-accent px-5 py-2 font-display text-7xl text-on-accent"
        style:transform="scale({2 - stamp}) rotate({(1 - stamp) * -12}deg)"
        style:opacity={Math.min(1, stamp)}
        style:box-shadow="0 0 60px var(--color-accent)"
      >
        + AI
      </span>
      <KineticText
        text="AI-ENHANCED"
        {t}
        start={6.95}
        staggerInS={0.03}
        class="font-display text-6xl text-accent"
      />
    </div>
  {/if}
</div>

{#each slots as slot, i (slot.skill.label)}
  {@const appear = easeOutBack(progress(t, 3.15 + i * 0.008, 3.45 + i * 0.008))}
  {@const pop = easeOutBack(progress(t, slot.popAt, slot.popAt + 0.22))}
  {@const hit = t >= slot.popAt && t < slot.popAt + 0.15}
  {@const glint =
    t >= slot.glintAt ? 1 - progress(t, slot.glintAt, slot.glintAt + 0.4) : 0}
  <div
    class="absolute flex items-center justify-center rounded-slot border-2"
    style:left="{slot.x}px"
    style:top="{slot.y}px"
    style:width="{SLOT_IN_PX}px"
    style:height="{SLOT_IN_PX}px"
    style:transform="scale({appear})"
    style:background={hit ? "var(--color-raised)" : "var(--color-surface)"}
    style:border-color={hit
      ? "var(--color-accent)"
      : empowered
        ? "color-mix(in oklab, var(--color-accent) 45%, var(--color-line))"
        : "var(--color-line)"}
    style:box-shadow="inset 0 -6px 0 rgb(0 0 0 / 0.35)"
  >
    <!-- Only the glint's opacity moves: re-blurring 35 shadows every frame is what made the sweep stutter. -->
    <div
      class="absolute -inset-0.5 rounded-slot border-2 border-accent bg-raised"
      style:box-shadow="0 0 36px var(--color-accent)"
      style:opacity={glint}
      style:will-change="opacity"
    ></div>
    <div
      class="relative size-[60%]"
      style:transform="scale({pop})"
      style:filter={empowered
        ? "drop-shadow(0 0 6px color-mix(in oklab, var(--color-accent) 70%, transparent))"
        : "none"}
    >
      <SkillIconSvg icon={SKILL_ICONS[slot.skill.label]} color={slot.color} />
    </div>
  </div>
{/each}

<div
  class="absolute flex justify-center gap-10"
  style:left="{GRID.left}px"
  style:top="{GRID.top + gridHeight + 50}px"
  style:width="{gridWidth}px"
>
  {#each aiSlots as slot (slot.skill.label)}
    {@const land = easeOutBack(progress(t, slot.landAt, slot.landAt + 0.3))}
    <div
      class="flex flex-col items-center gap-3"
      style:transform="translateY({(1 - land) * -80}px) scale({land})"
      style:opacity={Math.min(1, land * 2)}
    >
      <div
        class="flex size-[104px] items-center justify-center rounded-slot border-4 border-accent bg-raised"
        style:box-shadow={"0 0 50px color-mix(in oklab, var(--color-accent) 60%, transparent)"}
      >
        <div class="size-[60%]">
          <SkillIconSvg
            icon={SKILL_ICONS[slot.skill.label]}
            color={slot.color}
          />
        </div>
      </div>
      <span class="font-display text-xl text-accent">{slot.skill.label}</span>
    </div>
  {/each}
</div>

{#if orb > 0 && t < ORB_DROP.end}
  <div
    class="absolute size-14 rounded-full bg-accent"
    style:left="{impact.x}px"
    style:top="{-80 + (impact.y + 80) * orb ** 2}px"
    style:transform="translate(-50%, -50%)"
    style:box-shadow="0 0 90px 30px var(--color-accent)"
  ></div>
{/if}
{#if ring > 0 && ring < 1}
  <div
    class="absolute rounded-full border-8 border-accent"
    style:left="{impact.x - RING_MAX_RADIUS_IN_PX}px"
    style:top="{impact.y - RING_MAX_RADIUS_IN_PX}px"
    style:width="{RING_MAX_RADIUS_IN_PX * 2}px"
    style:height="{RING_MAX_RADIUS_IN_PX * 2}px"
    style:transform="scale({ring})"
    style:opacity={1 - ring}
    style:will-change="transform, opacity"
  ></div>
{/if}
{#if flash > 0}
  <div
    class="pointer-events-none absolute inset-0"
    style:background="radial-gradient(circle at {impact.x}px {impact.y}px,
    color-mix(in oklab, var(--color-accent) 45%, transparent), transparent 70%)"
    style:opacity={flash}
    style:will-change="opacity"
  ></div>
{/if}
<Confetti {burst} {t} />
