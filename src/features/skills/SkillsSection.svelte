<script lang="ts">
  import { Backpack } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import { Section } from "@/components/layout";
  import { hasWebGL, onceVisible } from "@/utils";
  import { CATEGORY_COLORS, SKILL_GROUPS, SkillCategory } from "./constants";
  import { SKILL_ICONS } from "./icons";
  // Type-only, so three.js stays out of the main bundle until the dynamic import below.
  import type InventoryCanvasComponent from "./inventory/InventoryCanvas.svelte";
  import SkillIconSvg from "./inventory/SkillIconSvg.svelte";
  import type { InventoryItem } from "./inventory/types";
  import { bagCapacity, inlayColor, layoutOffset, liftColor } from "./utils";

  const COLUMNS = 5;
  // Share of the slot the item fills, leaving the bevel visible around it.
  const ICON_FILL = 0.6;
  // Dark brand colours (Three.js black, Django green) are lifted to stay visible on the page.
  const MIN_ICON_LUMINANCE = 0.12;

  // Every item of every bag in one list: the 3D board indexes items the same way.
  const ITEMS = SKILL_GROUPS.flatMap((group) =>
    group.skills.map((skill) => {
      const icon = SKILL_ICONS[skill.label];
      const color =
        icon.kind === "logo"
          ? liftColor({ hex: icon.color, minLuminance: MIN_ICON_LUMINANCE })
          : CATEGORY_COLORS[skill.category].border;
      const bodyColors =
        icon.kind === "logo" && icon.shapeColors
          ? icon.shapeColors.map((hex) =>
              liftColor({ hex, minLuminance: MIN_ICON_LUMINANCE }),
            )
          : [color];
      return { skill, icon, color, bodyColors, inlayColor: inlayColor(color) };
    }),
  );
  const CATEGORIES = Object.values(SkillCategory).sort((a, b) =>
    a.localeCompare(b),
  );
  const BAGS = SKILL_GROUPS.map((group, g) => {
    const offset = SKILL_GROUPS.slice(0, g).reduce(
      (total, previous) => total + previous.skills.length,
      0,
    );
    return {
      title: group.title,
      offset,
      count: group.skills.length,
    };
  });

  // Every bag gets the fullest one's rows, so they line up as a set.
  const BAG_CAPACITY = Math.max(
    ...SKILL_GROUPS.map((group) => bagCapacity(group.skills.length, COLUMNS)),
  );

  let InventoryCanvas: typeof InventoryCanvasComponent | undefined = $state();
  let board: HTMLElement | undefined = $state();
  let slots: HTMLElement[] = $state([]);
  let placements: InventoryItem[] = $state([]);
  let hovered: number | null = $state(null);
  let previewedCategory: SkillCategory | null = $state(null);
  let pinnedCategory: SkillCategory | null = $state(null);
  let isBoardVisible = $state(false);
  const pointer = $state({ x: 0, y: 0, isInside: false });

  // Hovering a chip shows its items; a click keeps them shown, for touch and to compare bags.
  let filter = $derived(previewedCategory ?? pinnedCategory);
  let dimmed = $derived(
    ITEMS.map((item) => filter !== null && item.skill.category !== filter),
  );
  // Only the item under the pointer spins; a category just lights up its slots.
  let spinning = $derived(ITEMS.map((_, i) => i === hovered));
  let isAnimated = $derived(isBoardVisible && !prefersReducedMotion.current);

  const measure = () => {
    if (!board) return;
    const container = board;
    // Layout offsets, not screen rects: the reveal animation scales and shifts the board while it
    // scrolls in, and a rect measured mid-animation put every item a little off, more toward the edges.
    placements = ITEMS.map((item, i) => {
      const slot = slots[i];
      const offset = slot ? layoutOffset(slot, container) : { x: 0, y: 0 };
      const width = slot?.offsetWidth ?? 0;
      return {
        icon: item.icon,
        color: item.color,
        bodyColors: item.bodyColors,
        inlayColor: item.inlayColor,
        x: offset.x + width / 2,
        y: offset.y + width / 2,
        size: width * ICON_FILL,
      };
    });
  };

  const loadBoard = () => {
    if (!hasWebGL()) return;
    import("./inventory/InventoryCanvas.svelte").then((module) => {
      measure();
      InventoryCanvas = module.default;
    });
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!board || !isBoardVisible) return;
    const rect = board.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.isInside =
      pointer.x >= 0 &&
      pointer.y >= 0 &&
      pointer.x <= rect.width &&
      pointer.y <= rect.height;
  };

  const toggleFilter = (category: SkillCategory) => {
    pinnedCategory = pinnedCategory === category ? null : category;
  };

  onMount(() => {
    const resizeObserver = new ResizeObserver(measure);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isBoardVisible = entry.isIntersecting;
    });
    if (board) {
      resizeObserver.observe(board);
      visibilityObserver.observe(board);
    }
    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  });
</script>

<svelte:window onpointermove={handlePointerMove} />

<Section
  id="skills"
  eyebrow="Inventory"
  icon="chest"
  title="Skills"
  intro="Everything I've picked up along the way."
>
  <div class="reveal mb-6 flex flex-wrap justify-center gap-2">
    {#each CATEGORIES as category (category)}
      <button
        type="button"
        class="chip"
        style:--rarity={CATEGORY_COLORS[category].border}
        class:previewed={filter === category}
        aria-pressed={pinnedCategory === category}
        onpointerenter={() => (previewedCategory = category)}
        onpointerleave={() => (previewedCategory = null)}
        onfocus={() => (previewedCategory = category)}
        onblur={() => (previewedCategory = null)}
        onclick={() => toggleFilter(category)}
      >
        {category}
      </button>
    {/each}
  </div>

  <div
    bind:this={board}
    class="reveal relative"
    {@attach onceVisible(loadBoard, "300px")}
  >
    {#if InventoryCanvas}
      <div class="board-3d pointer-events-none absolute inset-0 z-10">
        <InventoryCanvas
          items={placements}
          {spinning}
          {dimmed}
          {pointer}
          {isAnimated}
        />
      </div>
    {/if}

    <div class="flex flex-wrap items-start justify-center gap-4">
      {#each BAGS as bag (bag.title)}
        <section class="bag" aria-label={bag.title}>
          <header class="mb-3 flex items-center gap-2 px-1">
            <Backpack size={16} class="text-accent" />
            <h3 class="m-0 flex-1 text-sm font-bold text-ink">{bag.title}</h3>
            <span class="font-display text-xs text-muted">
              {bag.count}/{BAG_CAPACITY}
            </span>
          </header>
          <ul class="slots m-0 list-none p-0" style:--columns={COLUMNS}>
            {#each ITEMS.slice(bag.offset, bag.offset + bag.count) as item, i (item.skill.label)}
              {@const index = bag.offset + i}
              {@const column = i % COLUMNS}
              <li class="relative">
                <!-- Inspected by hovering only: a slot is a picture, not a control. -->
                <div
                  bind:this={slots[index]}
                  class="slot"
                  class:active={spinning[index] ||
                    (filter !== null && !dimmed[index])}
                  class:dimmed={dimmed[index]}
                  style:--rarity={CATEGORY_COLORS[item.skill.category].border}
                  role="img"
                  aria-label="{item.skill.label}, {item.skill.category}"
                  onpointerenter={() => (hovered = index)}
                  onpointerleave={() => (hovered = null)}
                >
                  <span class="icon-2d" class:hidden-by-3d={InventoryCanvas}>
                    <SkillIconSvg icon={item.icon} color={item.color} />
                  </span>
                </div>
                {#if hovered === index}
                  <span
                    style:--rarity={CATEGORY_COLORS[item.skill.category].border}
                    class={[
                      "tooltip",
                      column === 0 && "left",
                      column === COLUMNS - 1 && "right",
                    ]}
                    aria-hidden="true"
                  >
                    {item.skill.label}
                  </span>
                {/if}
              </li>
            {/each}
            {#each { length: BAG_CAPACITY - bag.count } as _, i (i)}
              <li class="slot empty" aria-hidden="true"></li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>
  </div>
</Section>

<style>
  .bag {
    --slot: clamp(46px, calc((100vw - 5.5rem) / 5.4), 58px);
    padding: 0.9rem;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-line);
    background: linear-gradient(
      170deg,
      var(--color-raised),
      var(--color-surface) 70%
    );
    box-shadow:
      0 24px 50px -30px rgb(0 0 0 / 0.9),
      inset 0 1px 0 rgb(255 255 255 / 0.04);
  }
  .slots {
    display: grid;
    grid-template-columns: repeat(var(--columns), var(--slot));
    gap: 0.4rem;
  }
  /* A sunken cell with a thin edge in the category's colour, like an item's rarity. */
  .slot {
    display: grid;
    place-items: center;
    width: var(--slot);
    height: var(--slot);
    padding: 0;
    border-radius: var(--radius-slot);
    border: 1px solid
      color-mix(
        in oklab,
        var(--rarity, var(--color-line)) 35%,
        var(--color-line)
      );
    background: radial-gradient(circle at 50% 35%, #2a231c, #15110d 75%);
    box-shadow:
      inset 0 3px 6px rgb(0 0 0 / 0.55),
      inset 0 -1px 0 rgb(255 255 255 / 0.04);
    transition:
      border-color var(--t-control),
      box-shadow var(--t-surface),
      opacity var(--t-surface);
  }
  .slot.active {
    border-color: var(--rarity);
    box-shadow:
      inset 0 3px 6px rgb(0 0 0 / 0.55),
      0 0 14px color-mix(in oklab, var(--rarity) 45%, transparent);
  }
  .slot.dimmed:not(.active) {
    opacity: 0.35;
  }
  .slot.empty {
    cursor: default;
    border-color: color-mix(in oklab, var(--color-line) 70%, transparent);
    background: #15110d;
  }
  .icon-2d {
    width: 60%;
    height: 60%;
    transition: opacity 400ms var(--ease-soft);
  }
  /* The 3D item takes over the same spot; the flat one stays in the DOM for no-WebGL visitors. */
  .icon-2d.hidden-by-3d {
    opacity: 0;
  }
  .board-3d {
    animation: fade-in 400ms var(--ease-soft) both;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }
  /* A one-line label with a pointer down to its slot, so it can't pass for the slot above. */
  .tooltip {
    position: absolute;
    bottom: calc(100% + 0.45rem);
    left: 50%;
    translate: -50% 0;
    z-index: 20;
    width: max-content;
    max-width: 12rem;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    border: 1px solid var(--rarity);
    background: rgb(12 10 8 / 0.96);
    box-shadow: 0 10px 24px -8px rgb(0 0 0 / 0.9);
    color: var(--color-ink);
    font-size: 0.85rem;
    font-weight: 700;
    line-height: 1.2;
    pointer-events: none;
  }
  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: calc(var(--slot) / 2);
    translate: -50% -50%;
    width: 0.5rem;
    height: 0.5rem;
    rotate: 45deg;
    border-right: 1px solid var(--rarity);
    border-bottom: 1px solid var(--rarity);
    background: rgb(12 10 8);
  }
  .tooltip:not(.left, .right)::after {
    left: 50%;
  }
  /* Edge columns anchor their tooltip inward, so it never leaves a narrow screen; the pointer stays on the slot. */
  .tooltip.left {
    left: 0;
    translate: 0 0;
  }
  .tooltip.right {
    left: auto;
    right: 0;
    translate: 0 0;
  }
  .tooltip.right::after {
    left: auto;
    right: calc(var(--slot) / 2);
    translate: 50% -50%;
  }
  .chip {
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    border: 1px solid color-mix(in oklab, var(--rarity) 40%, var(--color-line));
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-muted);
    transition:
      background-color var(--t-control),
      border-color var(--t-control),
      color var(--t-control);
  }
  .chip:hover {
    border-color: var(--rarity);
    color: var(--color-ink);
  }
  .chip.previewed,
  .chip[aria-pressed="true"] {
    border-color: var(--rarity);
    background: color-mix(in oklab, var(--rarity) 22%, transparent);
    color: var(--rarity);
  }
</style>
