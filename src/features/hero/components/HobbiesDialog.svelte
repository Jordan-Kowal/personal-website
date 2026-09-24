<script lang="ts">
  import { X } from "@lucide/svelte";
  import { HOBBIES } from "../scene/hobbies";

  type Props = {
    /** Each hobby's spot on screen in px, in `HOBBIES` order. Missing ones are not drawn. */
    spots: { left: number; top: number; isInSight: boolean }[];
    /** How far the island is turned, in radians. Dragging and the arrow keys change it. */
    turn: number;
    onClose: () => void;
  };

  const DRAG_RADIANS_PER_PX = 0.003;
  const KEY_TURN_RADIANS = 0.3;

  let { spots, turn = $bindable(), onClose }: Props = $props();
  let dragX: number | null = $state(null);

  const handlePointerDown = (
    event: PointerEvent & { currentTarget: HTMLElement },
  ) => {
    dragX = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (dragX === null) return;
    turn += (event.clientX - dragX) * DRAG_RADIANS_PER_PX;
    dragX = event.clientX;
  };

  const endDrag = () => {
    dragX = null;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") turn -= KEY_TURN_RADIANS;
    if (event.key === "ArrowRight") turn += KEY_TURN_RADIANS;
  };
  let dialog: HTMLDialogElement | undefined = $state();
  let innerWidth = $state(0);

  // Modal: the page behind goes inert, Escape closes, focus comes back to the opener.
  $effect(() => {
    dialog?.showModal();
  });
</script>

<svelte:window bind:innerWidth />

<dialog
  bind:this={dialog}
  class="hobbies-view"
  aria-labelledby="hobbies-title"
  onclose={onClose}
  onkeydown={handleKeydown}
>
  <!-- Behind the markers: anywhere else, a drag turns the island. -->
  <div
    class="drag-surface"
    class:dragging={dragX !== null}
    aria-hidden="true"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={endDrag}
    onpointercancel={endDrag}
  ></div>
  <div class="absolute top-20 left-5 sm:left-8">
    <span class="font-display text-xs tracking-[0.25em] text-accent uppercase">
      Player 1 · Off duty
    </span>
    <h2 id="hobbies-title" class="m-0 font-display text-3xl text-ink">
      Hobbies
    </h2>
  </div>
  <button
    type="button"
    class="absolute top-20 right-5 flex items-center gap-2 rounded-full border border-line bg-page/60 px-4 py-2 font-display text-sm text-ink backdrop-blur-sm transition-colors duration-150 hover:border-accent hover:text-accent sm:right-8"
    onclick={() => dialog?.close()}
  >
    <X size={16} /> Back
  </button>

  <ul class="m-0 list-none p-0">
    {#each HOBBIES as hobby, i (hobby.id)}
      {@const spot = spots[i]}
      {#if spot}
        <li
          class="spot"
          class:flip={spot.left > innerWidth / 2}
          class:out-of-sight={!spot.isInSight}
          style:left="{spot.left}px"
          style:top="{spot.top}px"
          style:--i={i}
        >
          <button type="button" class="marker">
            <span class="brackets" aria-hidden="true"></span>
            <svg
              class="leader"
              viewBox="0 0 96 40"
              width="96"
              height="40"
              aria-hidden="true"
            >
              <polyline points="0,40 32,8 96,8" pathLength="1" />
            </svg>
            <span class="label">{hobby.title}</span>
          </button>
        </li>
      {/if}
    {/each}
  </ul>

  <p
    class="absolute bottom-8 left-1/2 m-0 -translate-x-1/2 font-display text-xs tracking-[0.3em] whitespace-nowrap text-muted uppercase"
  >
    Drag to turn · point at a marker
  </p>
</dialog>

<style>
  .hobbies-view {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    background: transparent;
    color: var(--color-ink);
  }
  .hobbies-view::backdrop {
    background: transparent;
  }
  :global(html:has(.hobbies-view[open])) {
    overflow: hidden;
  }

  .drag-surface {
    position: absolute;
    inset: 0;
    cursor: grab;
    touch-action: none;
  }
  .drag-surface.dragging {
    cursor: grabbing;
  }

  /* Markers pop in once the camera has landed, one after the other. */
  .spot {
    position: absolute;
    translate: -50% -50%;
    animation: pop 420ms var(--ease-spring) both;
    animation-delay: calc(700ms + var(--i) * 70ms);
  }
  /* Behind a tree, a rock or the tent: out of sight and out of reach until the view clears. */
  .spot.out-of-sight {
    opacity: 0;
    visibility: hidden;
  }
  .spot {
    transition:
      opacity var(--t-control) var(--ease-soft),
      visibility var(--t-control);
  }
  .spot:has(.marker:is(:hover, :focus)) {
    z-index: 1;
  }
  @keyframes pop {
    from {
      opacity: 0;
      scale: 0.4;
    }
  }

  .marker {
    position: relative;
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
  }
  .marker::before {
    content: "";
    width: 0.6rem;
    height: 0.6rem;
    rotate: 45deg;
    background: var(--color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--color-page) 60%, transparent),
      0 0 14px var(--color-accent);
  }
  .marker::after {
    content: "";
    position: absolute;
    inset: 0.35rem;
    border: 1.5px solid var(--color-accent);
    border-radius: 999px;
    animation: pulse 1.8s var(--ease-soft) infinite;
  }
  @keyframes pulse {
    from {
      opacity: 0.9;
      scale: 0.6;
    }
    to {
      opacity: 0;
      scale: 1.6;
    }
  }

  /* The scan: corner brackets close in on the spot, a leader line draws out, the label slides in. */
  .brackets {
    position: absolute;
    inset: -0.2rem;
    --c: var(--color-accent);
    background:
      linear-gradient(var(--c) 0 0) top left / 0.55rem 2px,
      linear-gradient(var(--c) 0 0) top left / 2px 0.55rem,
      linear-gradient(var(--c) 0 0) top right / 0.55rem 2px,
      linear-gradient(var(--c) 0 0) top right / 2px 0.55rem,
      linear-gradient(var(--c) 0 0) bottom left / 0.55rem 2px,
      linear-gradient(var(--c) 0 0) bottom left / 2px 0.55rem,
      linear-gradient(var(--c) 0 0) bottom right / 0.55rem 2px,
      linear-gradient(var(--c) 0 0) bottom right / 2px 0.55rem;
    background-repeat: no-repeat;
    opacity: 0;
    scale: 1.7;
    transition:
      opacity var(--t-control) var(--ease-soft),
      scale var(--t-surface) var(--ease-soft);
  }
  .leader {
    position: absolute;
    left: 50%;
    bottom: 50%;
    overflow: visible;
    pointer-events: none;
    transform-origin: left bottom;
  }
  .leader polyline {
    fill: none;
    stroke: var(--color-accent);
    stroke-width: 1.5;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset var(--t-surface) var(--ease-soft);
  }
  .label {
    position: absolute;
    left: calc(50% + 96px);
    top: calc(50% - 32px);
    translate: -0.4rem -50%;
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--color-accent);
    border-radius: 0.4rem;
    background: color-mix(in oklab, var(--color-page) 85%, transparent);
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--color-ink);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition:
      opacity var(--t-control) var(--ease-soft),
      translate var(--t-surface) var(--ease-soft);
  }
  .flip .leader {
    scale: -1 1;
  }
  .flip .label {
    left: auto;
    right: calc(50% + 96px);
    translate: 0.4rem -50%;
  }

  .marker:is(:hover, :focus) .brackets {
    opacity: 1;
    scale: 1;
  }
  .marker:is(:hover, :focus) .leader polyline {
    stroke-dashoffset: 0;
  }
  .marker:is(:hover, :focus) .label {
    opacity: 1;
    translate: 0 -50%;
    transition-delay: 120ms;
  }
</style>
