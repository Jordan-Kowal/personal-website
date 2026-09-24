<script lang="ts">
  import { RotateCcw, ZoomIn, ZoomOut } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import { Section } from "@/components/layout";
  import { RollingNumber } from "@/components/ui";
  import { hasWebGL, onceVisible } from "@/utils";
  import ContributionGrid from "./components/ContributionGrid.svelte";
  // Type-only, so three.js stays out of the main bundle until the dynamic import below.
  import type SkylineCanvasComponent from "./skyline/SkylineCanvas.svelte";
  import type { SkylineView } from "./skyline/types";
  import type { GitHubContribution, GitHubContributionsData } from "./types";
  import { fetchGitHubContributions } from "./utils";

  const DRAG_RADIANS_PER_PX = 0.006;
  const KEY_TURN_RADIANS = 0.2;
  const ZOOM_STEP = 1.25;
  // A mouse notch is about 100 px of wheel delta: this makes one notch a ×1.28 zoom, like a button press.
  const WHEEL_ZOOM_PER_PX = 0.0025;
  const MIN_ZOOM = 0.7;
  const MAX_ZOOM = 3.5;
  // From nearly straight above to under the board, so it can be turned over.
  const MIN_POLAR = 0.12;
  const MAX_POLAR = 2.6;
  // The opening view: three quarters from the front, high enough to read the whole year.
  const DEFAULT_VIEW: SkylineView = { azimuth: 0, polar: 0.91, zoom: 1 };
  const FULL_TURN = Math.PI * 2;

  let data: Promise<GitHubContributionsData> | undefined = $state();
  let SkylineCanvas: typeof SkylineCanvasComponent | undefined = $state();
  let canUseWebGL = $state(true);
  const view: SkylineView = $state({ ...DEFAULT_VIEW });
  let hovered: GitHubContribution | null = $state(null);
  let isDragging = $state(false);
  let drag: { x: number; y: number; pointerType: string } | null = null;

  const clampPolar = (polar: number) =>
    Math.min(MAX_POLAR, Math.max(MIN_POLAR, polar));

  const zoomBy = (factor: number) => {
    view.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * factor));
  };

  const resetView = () => {
    // Unwinds to the nearest full turn, so the reset doesn't spin back through every lap.
    const turns = Math.round(view.azimuth / FULL_TURN);
    Object.assign(view, { ...DEFAULT_VIEW, azimuth: turns * FULL_TURN });
  };

  const loadSkyline = () => {
    if (!canUseWebGL) return;
    import("./skyline/SkylineCanvas.svelte").then((module) => {
      SkylineCanvas = module.default;
    });
  };

  const handlePointerDown = (
    event: PointerEvent & { currentTarget: HTMLElement },
  ) => {
    drag = {
      x: event.clientX,
      y: event.clientY,
      pointerType: event.pointerType,
    };
    isDragging = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!drag) return;
    view.azimuth -= (event.clientX - drag.x) * DRAG_RADIANS_PER_PX;
    // On touch, vertical swipes stay the page's scroll: only mouse and pen tilt the board.
    if (drag.pointerType !== "touch") {
      view.polar = clampPolar(
        view.polar - (event.clientY - drag.y) * DRAG_RADIANS_PER_PX,
      );
    }
    drag.x = event.clientX;
    drag.y = event.clientY;
  };

  const endDrag = () => {
    drag = null;
    isDragging = false;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        view.azimuth += KEY_TURN_RADIANS;
        break;
      case "ArrowRight":
        view.azimuth -= KEY_TURN_RADIANS;
        break;
      case "ArrowUp":
        view.polar = clampPolar(view.polar - KEY_TURN_RADIANS);
        break;
      case "ArrowDown":
        view.polar = clampPolar(view.polar + KEY_TURN_RADIANS);
        break;
      case "+":
      case "=":
        zoomBy(ZOOM_STEP);
        break;
      case "-":
        zoomBy(1 / ZOOM_STEP);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // Ctrl (or ⌘) + wheel zooms, and a trackpad pinch arrives as a wheel event with ctrlKey. A plain wheel keeps scrolling the page.
  const handleWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    zoomBy(Math.exp(-event.deltaY * WHEEL_ZOOM_PER_PX));
  };

  // Registered by hand: Svelte's onwheel is passive, and a passive listener can't keep the page from zooming.
  const pinchZoom = (node: HTMLElement) => {
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  };

  onMount(() => {
    canUseWebGL = hasWebGL();
    data = fetchGitHubContributions();
  });
</script>

<Section
  id="github"
  eyebrow="Stats screen"
  icon="stats"
  title="GitHub Activity"
  intro="Taller and brighter skyscrapers mean a busier day."
>
  {#if data}
    {#await data}
      <p class="py-16 text-center font-display text-muted">
        Loading save file…
      </p>
    {:then stats}
      <div class="reveal mb-8 grid grid-cols-3 gap-2 sm:gap-4">
        <div class="stat">
          <span class="stat-label">Total contributions</span>
          <RollingNumber value={stats.totalContributions} class="stat-value" />
          <span class="stat-hint">in the last year</span>
        </div>
        <div class="stat">
          <span class="stat-label">Current streak</span>
          <RollingNumber value={stats.currentStreak} class="stat-value" />
          <span class="stat-hint">
            consecutive day(s), best {stats.longestStreak}
          </span>
        </div>
        <div class="stat">
          <span class="stat-label">Days since last incident</span>
          <span class="stat-value">??</span>
          <span class="stat-hint">it's gonna be fine...</span>
        </div>
      </div>

      <div
        class="reveal overflow-hidden rounded-(--radius-card) border border-line bg-surface"
        {@attach onceVisible(loadSkyline, "200px")}
      >
        {#if canUseWebGL}
          <!-- Turning is the main control, so the board is exposed as a slider over its turn. -->
          <div class="relative">
            <div
              class="skyline"
              class:dragging={isDragging}
              class:pointing={hovered !== null}
              role="slider"
              aria-label="Turn the 3D chart of {stats.totalContributions} contributions over the last year. Up and down tilt it, plus and minus zoom."
              aria-valuemin={0}
              aria-valuemax={359}
              aria-valuenow={Math.round(
                ((((view.azimuth * 180) / Math.PI) % 360) + 360) % 360,
              )}
              tabindex="0"
              onpointerdown={handlePointerDown}
              onpointermove={handlePointerMove}
              onpointerup={endDrag}
              onpointercancel={endDrag}
              onkeydown={handleKeydown}
              {@attach pinchZoom}
            >
              {#if SkylineCanvas}
                <SkylineCanvas
                  contributions={stats.contributions}
                  {view}
                  isAnimated={!prefersReducedMotion.current}
                  onHover={(day) => (hovered = day)}
                />
              {/if}
            </div>
            <div class="absolute top-3 right-3 flex gap-1.5">
              <button
                type="button"
                class="view-button"
                aria-label="Zoom in"
                onclick={() => zoomBy(ZOOM_STEP)}
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                class="view-button"
                aria-label="Zoom out"
                onclick={() => zoomBy(1 / ZOOM_STEP)}
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                class="view-button"
                aria-label="Reset the view"
                onclick={resetView}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        {:else}
          <div class="p-5">
            <ContributionGrid contributions={stats.contributions} />
          </div>
        {/if}
        <p
          class="m-0 border-t border-line px-5 py-3 text-center text-sm text-muted"
        >
          {#if hovered}
            <span class="font-semibold text-accent">
              {hovered.count} contribution(s)
            </span>
            <!-- Local midnight: a bare YYYY-MM-DD parses as UTC and shows the day before west of it. -->
            on {new Date(`${hovered.date}T00:00:00`).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            )}
          {:else if canUseWebGL}
            Drag to turn · Ctrl + scroll to zoom · Hover a building to read the
            day
          {:else}
            Hover a square to read the day
          {/if}
        </p>
      </div>
    {:catch error}
      <p
        class="rounded-(--radius-card) border border-line bg-surface p-6 text-center text-muted"
      >
        Couldn't load the save file from GitHub ({error.message}). Try again
        later.
      </p>
    {/await}
  {/if}
</Section>

<style>
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 1.25rem;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-line);
    background: var(--color-surface);
    text-align: center;
  }
  .stat-label {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-muted);
  }
  .stat :global(.stat-value) {
    font-family: var(--font-display);
    font-size: 2.5rem;
    line-height: 1;
    color: var(--color-accent);
  }
  .stat-hint {
    font-size: 0.8rem;
    color: var(--color-muted);
  }
  .skyline {
    height: clamp(260px, 42vw, 440px);
    cursor: grab;
    touch-action: pan-y;
  }
  .skyline.pointing {
    cursor: pointer;
  }
  .skyline.dragging {
    cursor: grabbing;
  }
  .view-button {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 999px;
    border: 1px solid var(--color-line);
    background: rgb(20 17 14 / 0.7);
    color: var(--color-muted);
    transition:
      border-color var(--t-control),
      color var(--t-control);
  }
  .view-button:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
