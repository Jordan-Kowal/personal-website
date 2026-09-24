<script lang="ts">
  import { Diamond, GraduationCap, MapPin, Swords } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { Section } from "@/components/layout";
  import { educationData, experienceData } from "./data";
  import {
    formatDuration,
    formatPeriod,
    reachedStopIndex,
    sortChronologically,
    trailProgress,
  } from "./utils";

  // The trail fills up to this line, as a fraction of the viewport height.
  const ANCHOR_RATIO = 0.6;

  const STOPS = sortChronologically([...experienceData, ...educationData]);

  let track: HTMLElement | undefined = $state();
  let nodes: HTMLElement[] = $state([]);
  let progress = $state(0);
  let reached = $state(-1);
  let isTracking = $state(false);
  let frame = 0;

  const measure = () => {
    frame = 0;
    if (!track) return;
    const anchorY = window.innerHeight * ANCHOR_RATIO;
    const rect = track.getBoundingClientRect();
    progress = trailProgress({
      trackTop: rect.top,
      trackHeight: rect.height,
      anchorY,
    });
    reached = reachedStopIndex(
      nodes.map((node) => node.getBoundingClientRect().top),
      anchorY,
    );
  };

  const scheduleMeasure = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  onMount(() => {
    measure();
    isTracking = true;
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
    };
  });
</script>

<Section
  id="timeline"
  eyebrow="Adventure map"
  icon="map"
  title="Timeline"
  intro="All the adventures I've been through, from school to work."
>
  <div bind:this={track} class="relative mx-auto max-w-4xl">
    <!-- The trail: a dashed path, and the lit part that follows your scroll. -->
    <div class="trail" aria-hidden="true">
      <div class="trail-fill" style:transform="scaleY({progress})"></div>
    </div>

    <ol
      class="m-0 flex list-none flex-col gap-10 p-0 md:gap-14"
      class:tracking={isTracking}
    >
      {#each STOPS as stop, i (stop.id)}
        {@const isTraining = stop.category === "education"}
        {@const isReached = i <= reached}
        {@const isCurrent = i === reached}
        {@const isOngoing = !stop.endDate}
        <li
          class="stop"
          class:right={i % 2 === 1}
          class:training={isTraining}
          class:reached={isReached}
          class:current={isCurrent}
        >
          <span bind:this={nodes[i]} class="node" aria-hidden="true">
            <span class="grid place-items-center">
              {#if isTraining}
                <GraduationCap size={16} />
              {:else}
                <Swords size={16} />
              {/if}
            </span>
          </span>
          <article class="panel">
            <div class="flex items-center justify-between gap-3">
              <span class="kind font-display text-xs tracking-widest uppercase">
                {#if isTraining}
                  <GraduationCap size={14} /> Training
                {:else}
                  <Swords size={14} /> {isOngoing ? "Current quest" : "Quest"}
                {/if}
              </span>
              <span class="text-xs text-muted">
                {formatPeriod(stop.startDate, stop.endDate)}
              </span>
            </div>
            <div class="flex items-center gap-3">
              {#if typeof stop.logo === "string"}
                <img
                  src={stop.logo}
                  alt=""
                  loading="lazy"
                  class="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              {:else if stop.logo}
                <span
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-raised text-accent"
                >
                  <stop.logo size={20} />
                </span>
              {/if}
              <div class="min-w-0">
                <h3 class="m-0 text-base leading-tight font-bold text-ink">
                  {stop.title}
                </h3>
                <p class="m-0 text-sm text-muted">
                  {stop.entity}
                  <span
                    class="inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    · <MapPin size={12} />
                    {stop.location}
                  </span>
                </p>
              </div>
            </div>
            <p class="m-0 text-sm text-ink/85">{stop.description}</p>
            <!-- The reward: what the stop gave, for how long. -->
            <div
              class="flex items-center justify-between gap-3 border-t border-line pt-3"
            >
              <span class="gain text-sm font-semibold">
                <Diamond size={14} fill="currentColor" />
                +{isTraining ? "Intellect" : "Experience"}
              </span>
              <span class="text-xs text-muted">
                {formatDuration(stop.startDate, stop.endDate)}
              </span>
            </div>
          </article>
        </li>
      {/each}
    </ol>
  </div>
</Section>

<style>
  .trail {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.25rem;
    width: 4px;
    translate: -50% 0;
    border-radius: 999px;
    background: repeating-linear-gradient(
      to bottom,
      var(--color-line) 0 10px,
      transparent 10px 18px
    );
  }
  .trail-fill {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--color-accent);
    box-shadow: 0 0 16px rgb(255 200 61 / 0.5);
    transform-origin: top;
  }
  /* Each stop takes its kind's colour: yellow for work quests, blue for training. */
  .stop {
    --kind: var(--color-accent);
    --kind-glow: rgb(255 200 61 / 0.35);
    position: relative;
    padding-left: 3.5rem;
  }
  .stop.training {
    --kind: var(--color-training);
    --kind-glow: rgb(108 184 255 / 0.35);
  }
  .node {
    position: absolute;
    top: 1.1rem;
    left: 1.25rem;
    translate: -50% 0;
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 10px;
    rotate: 45deg;
    border: 2px solid var(--color-line);
    background: var(--color-page);
    color: var(--color-muted);
    font-size: 0.8rem;
    transition:
      background-color var(--t-surface),
      border-color var(--t-surface),
      color var(--t-surface),
      scale var(--t-signature) var(--ease-spring);
  }
  .node > span {
    rotate: -45deg;
  }
  .reached .node {
    border-color: var(--kind);
    background: var(--kind);
    color: var(--color-on-accent);
    box-shadow: 0 0 14px var(--kind-glow);
  }
  .current .node {
    scale: 1.2;
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-line);
    background: var(--color-surface);
    transition:
      opacity var(--t-signature) var(--ease-soft),
      border-color var(--t-surface);
  }
  /* Stops ahead of the trail wait dimmed, only once the script can light them up. */
  .tracking .stop:not(.reached) .panel {
    opacity: 0.45;
  }
  .current .panel {
    border-color: color-mix(in oklab, var(--kind) 60%, transparent);
  }
  .kind,
  .gain {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--kind);
  }
  /* Wide screens: the trail runs down the middle and stops alternate sides. */
  @media (min-width: 768px) {
    .trail,
    .node {
      left: 50%;
    }
    .stop {
      width: 50%;
      padding-left: 0;
      padding-right: 3rem;
    }
    .stop .node {
      left: 100%;
    }
    .stop.right {
      margin-left: 50%;
      padding-left: 3rem;
      padding-right: 0;
    }
    .stop.right .node {
      left: 0;
    }
  }
</style>
