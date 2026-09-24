<script lang="ts">
  import { Sparkles } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import { Section } from "@/components/layout";
  import { Stars } from "@/components/ui";
  import { onceVisible } from "@/utils";
  import { reviewsData } from "./data";
  import {
    bringToFront,
    type CardSpot,
    clampToTable,
    scatterLayout,
  } from "./utils";

  const CARD_WIDTH_PX = 272;
  // Layout estimate: most reviews fit, a long one just overlaps the row below a little, like on a real table.
  const CARD_HEIGHT_PX = 200;
  const POP_STAGGER_MS = 130;
  // How much a card leans into the direction it's dragged, and how fast a thrown one slows down.
  const DRAG_TILT_PER_PX = 0.4;
  const MAX_DRAG_TILT_DEGREES = 12;
  const GLIDE_FRICTION = 0.9;
  const GLIDE_STOP_PX = 0.3;
  const TIDY_DURATION_MS = 550;

  type Drag = {
    index: number;
    pointerId: number;
    startX: number;
    startY: number;
    origin: CardSpot;
    velocityX: number;
    velocityY: number;
  };

  let tableWidth = $state(0);
  let spots: CardSpot[] = $state([]);
  let order = $state(reviewsData.map((_, i) => i));
  let hasPopped = $state(false);
  let isArmed = $state(false);
  let isTidying = $state(false);
  let draggedIndex: number | null = $state(null);
  let dragTilt = $state(0);
  let cards: HTMLElement[] = $state([]);
  let drag: Drag | null = null;
  let glideFrame = 0;

  let layout = $derived(
    scatterLayout({
      count: reviewsData.length,
      width: tableWidth,
      cardWidth: Math.min(CARD_WIDTH_PX, tableWidth),
      cardHeight: CARD_HEIGHT_PX,
    }),
  );

  // A new table width deals the cards again, so none is stranded off the edge after a resize.
  $effect(() => {
    spots = layout.spots.map((spot) => ({ ...spot }));
  });

  const clampSpot = (index: number, x: number, y: number) =>
    clampToTable({
      x,
      y,
      cardWidth: cards[index]?.offsetWidth ?? CARD_WIDTH_PX,
      cardHeight: cards[index]?.offsetHeight ?? CARD_HEIGHT_PX,
      tableWidth,
      tableHeight: layout.height,
    });

  // A thrown card keeps sliding, slowing down, and stops at the table's edge.
  const glide = () => {
    if (!drag) return;
    const { index } = drag;
    drag.velocityX *= GLIDE_FRICTION;
    drag.velocityY *= GLIDE_FRICTION;
    const next = clampSpot(
      index,
      spots[index].x + drag.velocityX,
      spots[index].y + drag.velocityY,
    );
    spots[index] = { ...spots[index], ...next };
    const isMoving = Math.hypot(drag.velocityX, drag.velocityY) > GLIDE_STOP_PX;
    if (isMoving) {
      glideFrame = requestAnimationFrame(glide);
      return;
    }
    drag = null;
  };

  const handlePointerDown = (
    event: PointerEvent & { currentTarget: HTMLElement },
    index: number,
  ) => {
    // Touch keeps scrolling the page: on a phone the table is a readable column, not a toy.
    if (event.pointerType === "touch" || event.button !== 0) return;
    cancelAnimationFrame(glideFrame);
    event.currentTarget.setPointerCapture(event.pointerId);
    drag = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...spots[index] },
      velocityX: 0,
      velocityY: 0,
    };
    draggedIndex = index;
    order = bringToFront(order, index);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!drag || draggedIndex === null || event.pointerId !== drag.pointerId) {
      return;
    }
    const { index, origin } = drag;
    const next = clampSpot(
      index,
      origin.x + event.clientX - drag.startX,
      origin.y + event.clientY - drag.startY,
    );
    drag.velocityX = next.x - spots[index].x;
    drag.velocityY = next.y - spots[index].y;
    dragTilt = Math.max(
      -MAX_DRAG_TILT_DEGREES,
      Math.min(MAX_DRAG_TILT_DEGREES, drag.velocityX * DRAG_TILT_PER_PX),
    );
    spots[index] = { ...spots[index], ...next };
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    draggedIndex = null;
    dragTilt = 0;
    if (prefersReducedMotion.current) {
      drag = null;
      return;
    }
    glideFrame = requestAnimationFrame(glide);
  };

  const tidyUp = () => {
    cancelAnimationFrame(glideFrame);
    drag = null;
    isTidying = true;
    spots = layout.spots.map((spot) => ({ ...spot }));
    setTimeout(() => (isTidying = false), TIDY_DURATION_MS);
  };

  onMount(() => {
    isArmed = true;
    return () => cancelAnimationFrame(glideFrame);
  });
</script>

<Section
  id="reviews"
  eyebrow="Player reviews"
  title="Reviews"
  intro="Unfiltered feedback from people who definitely exist. Push the cards around, nobody's keeping score."
>
  <div class="reveal flex flex-col items-center gap-6">
    <div class="felt">
      <div
        class="table"
        class:laid-out={tableWidth > 0 && spots.length > 0}
        class:armed={isArmed}
        class:popped={hasPopped}
        class:tidying={isTidying}
        style:height={tableWidth > 0 ? `${layout.height}px` : undefined}
        style:--stagger="{POP_STAGGER_MS}ms"
        style:--tidy="{TIDY_DURATION_MS}ms"
        bind:clientWidth={tableWidth}
        {@attach onceVisible(() => (hasPopped = true))}
      >
        {#each reviewsData as review, i (review.id)}
          {@const spot = spots[i]}
          {@const isDragged = draggedIndex === i}
          <article
            bind:this={cards[i]}
            class="review"
            class:dragged={isDragged}
            style:--i={i}
            style:z-index={order.indexOf(i) + 1}
            style:translate={spot ? `${spot.x}px ${spot.y}px` : undefined}
            style:rotate={spot
              ? `${spot.rotation + (isDragged ? dragTilt : 0)}deg`
              : undefined}
            onpointerdown={(event) => handlePointerDown(event, i)}
            onpointermove={handlePointerMove}
            onpointerup={handlePointerUp}
            onpointercancel={handlePointerUp}
          >
            <Stars rating={review.rating} isLit={hasPopped} size={18} />
            <p class="m-0 leading-snug text-ink">“{review.comment}”</p>
            <span class="font-display text-sm text-accent">{review.name}</span>
          </article>
        {/each}
      </div>
    </div>

    <button type="button" class="tidy" onclick={tidyUp}>
      <Sparkles size={16} /> Tidy up the table
    </button>
  </div>
</Section>

<style>
  /* The table's edge is invisible: it only keeps the cards from sliding off. */
  .felt {
    width: 100%;
    padding: 1.5rem;
  }
  /* Without layout (no JS yet), the cards simply wrap; once measured, they're scattered by hand. */
  .table {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
  }
  .table.laid-out {
    display: block;
  }
  .review {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
    width: min(17rem, 100%);
    min-height: 11rem;
    padding: 1.5rem 1.25rem;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-line);
    background: linear-gradient(
      170deg,
      var(--color-raised),
      var(--color-surface)
    );
    text-align: center;
    box-shadow: 0 18px 36px -22px rgb(0 0 0 / 0.9);
    user-select: none;
    transition:
      box-shadow var(--t-surface),
      scale var(--t-surface) var(--ease-spring);
  }
  .laid-out .review {
    position: absolute;
    top: 0;
    left: 0;
  }
  @media (hover: hover) {
    .laid-out .review {
      cursor: grab;
    }
  }
  /* Picked up: it lifts off the table, a bigger shadow under it. */
  .review.dragged {
    cursor: grabbing;
    scale: 1.05;
    box-shadow: 0 34px 60px -24px rgb(0 0 0 / 0.95);
    border-color: color-mix(
      in oklab,
      var(--color-accent) 40%,
      var(--color-line)
    );
  }
  /* Waiting to be dealt: hidden only once the script is there to deal them. */
  .armed:not(.popped) .review {
    opacity: 0;
    scale: 0.4;
  }
  .popped .review {
    animation: pop 560ms var(--ease-spring) both;
    animation-delay: calc(var(--i) * var(--stagger));
  }
  @keyframes pop {
    from {
      opacity: 0;
      scale: 0.4;
    }
  }
  .tidying .review {
    transition:
      translate var(--tidy) var(--ease-spring),
      rotate var(--tidy) var(--ease-spring);
  }
  .tidy {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--color-line);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-muted);
    transition:
      border-color var(--t-control),
      color var(--t-control);
  }
  .tidy:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  @media (prefers-reduced-motion: reduce) {
    .armed:not(.popped) .review {
      opacity: 1;
      scale: 1;
    }
    .popped .review {
      animation: none;
    }
  }
</style>
