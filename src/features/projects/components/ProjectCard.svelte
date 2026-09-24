<script lang="ts">
  import { ExternalLink, Images, RotateCcw } from "@lucide/svelte";
  import { GithubIcon } from "@/components/ui/icons";
  import type { Project } from "../types";
  import { toThumbnailUrl } from "../utils";

  type Props = {
    project: Project;
    isCentered: boolean;
    isFlipped: boolean;
    /** A click on the front: brings the card to the centre, or flips it once it is there. */
    onActivate: () => void;
    onFlipBack: () => void;
    onOpenScreenshots: (screenshots: string[]) => void;
  };

  const FRONT_SKILL_COUNT = 3;

  let {
    project,
    isCentered,
    isFlipped,
    onActivate,
    onFlipBack,
    onOpenScreenshots,
  }: Props = $props();
  let card: HTMLElement | undefined = $state();
  let flipBackButton: HTMLButtonElement | undefined = $state();
  let flipButton: HTMLButtonElement | undefined = $state();

  let thumbnail = $derived(
    project.screenshots[0] ? toThumbnailUrl(project.screenshots[0]) : null,
  );

  // Focus follows the flip, so keyboard users land on the face they just turned to.
  // Only when focus was already on this card: a flip triggered elsewhere must not steal it.
  $effect(() => {
    const target = isFlipped ? flipBackButton : flipButton;
    if (!card?.contains(document.activeElement)) return;
    requestAnimationFrame(() => target?.focus());
  });
</script>

<article
  bind:this={card}
  class="sleeve"
  class:centered={isCentered}
  class:flipped={isFlipped}
  class:archived={project.archived}
>
  <div class="inner">
    <div class="face front" inert={isFlipped}>
      <div class="art">
        {#if thumbnail}
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover object-top"
          />
        {:else}
          <span
            class="font-display text-6xl text-on-accent/70"
            aria-hidden="true"
          >
            {project.name.charAt(0).toUpperCase()}
          </span>
        {/if}
        {#if project.archived}
          <span class="stamp font-display">Retired</span>
        {/if}
      </div>
      <div class="flex flex-1 flex-col gap-2 p-4">
        <h3 class="m-0 font-display text-lg leading-tight text-ink">
          {project.name}
        </h3>
        <p class="m-0 line-clamp-2 text-sm text-muted">{project.description}</p>
        <div class="mt-auto flex flex-wrap gap-1.5">
          {#each project.skills.slice(0, FRONT_SKILL_COUNT) as skill (skill)}
            <span class="rounded-md bg-raised px-2 py-0.5 text-xs text-muted">
              {skill}
            </span>
          {/each}
        </div>
      </div>
      <button
        bind:this={flipButton}
        type="button"
        class="absolute inset-0 z-2 cursor-pointer rounded-(--radius-card)"
        aria-label={isCentered
          ? `Show details of ${project.name}`
          : `Bring ${project.name} to the front`}
        aria-expanded={isFlipped}
        onclick={onActivate}
      ></button>
    </div>

    <div class="face back" inert={!isFlipped}>
      <!-- The whole back flips the card again; links and buttons sit above it and keep their own click. -->
      <button
        bind:this={flipBackButton}
        type="button"
        class="absolute inset-0 z-1 cursor-pointer rounded-(--radius-card)"
        aria-label="Flip {project.name} back"
        onclick={onFlipBack}
      ></button>
      <div
        class="pointer-events-none relative z-2 flex h-full flex-col gap-3 p-5"
      >
        <div class="flex items-start justify-between gap-2">
          <h3 class="m-0 font-display text-lg leading-tight text-accent">
            {project.name}
          </h3>
          <span class="p-1.5 text-muted" aria-hidden="true">
            <RotateCcw size={16} />
          </span>
        </div>
        <p class="m-0 text-sm text-ink/90">{project.description}</p>
        <div class="flex flex-wrap gap-1.5">
          {#each project.skills as skill (skill)}
            <span class="rounded-md bg-raised px-2 py-0.5 text-xs text-muted">
              {skill}
            </span>
          {/each}
        </div>
        <div class="mt-auto flex flex-wrap gap-2">
          {#if project.githubUrl}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="action"
            >
              <GithubIcon size={14} /> Code
            </a>
          {/if}
          {#if project.websiteUrl}
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="action"
            >
              <ExternalLink size={14} /> Website
            </a>
          {/if}
          {#if project.screenshots.length > 0}
            <button
              type="button"
              class="action"
              onclick={() => onOpenScreenshots(project.screenshots)}
            >
              <Images size={14} /> Screenshots ({project.screenshots.length})
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</article>

<style>
  .sleeve {
    perspective: 1000px;
    height: 100%;
  }
  .inner {
    position: relative;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform var(--t-signature) var(--ease-spring);
  }
  /* The lift: the card rises out of its sleeve toward the reader. */
  .sleeve.centered:hover .inner,
  .sleeve.centered:focus-within .inner {
    transform: translateY(-6px) rotateX(4deg);
  }
  .sleeve.flipped .inner {
    transform: rotateY(180deg);
  }
  /* The lift is more specific than the flip: without this, hovering a flipped card turns it back,
     and the back (visible from both sides once flipped) shows mirrored over the front. */
  .sleeve.centered.flipped:hover .inner,
  .sleeve.centered.flipped:focus-within .inner {
    transform: translateY(-6px) rotateY(180deg) rotateX(-4deg);
  }
  .face {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-line);
    background: var(--color-surface);
    backface-visibility: hidden;
    box-shadow: 0 18px 40px -24px rgb(0 0 0 / 0.8);
    transition: box-shadow var(--t-surface) var(--ease-soft);
  }
  .sleeve.centered:hover .face {
    box-shadow: 0 30px 50px -24px rgb(0 0 0 / 0.9);
  }
  /* The face turned away must let clicks through to the other. */
  .sleeve.flipped .front,
  .sleeve:not(.flipped) .back {
    pointer-events: none;
  }
  /* Chrome never hit-tests a hidden-backface element nested this deep in 3D, even facing the reader.
     Once flipped, the back faces the reader anyway, so showing its backface changes nothing on screen. */
  .sleeve.flipped .back {
    backface-visibility: visible;
  }
  .back {
    transform: rotateY(180deg);
    background: linear-gradient(
      170deg,
      var(--color-raised),
      var(--color-surface)
    );
  }
  .art {
    position: relative;
    display: grid;
    place-items: center;
    height: 9.5rem;
    overflow: hidden;
    background:
      repeating-linear-gradient(
        45deg,
        rgb(0 0 0 / 0.06) 0 8px,
        transparent 8px 16px
      ),
      linear-gradient(135deg, var(--color-accent), var(--color-accent-deep));
  }
  /* Foil sheen that sweeps across the art while the card is lifted. */
  .art::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      115deg,
      transparent 30%,
      rgb(255 255 255 / 0.28) 45%,
      transparent 60%
    );
    translate: -100% 0;
    transition: translate 700ms var(--ease-soft);
  }
  .sleeve.centered:hover .art::after {
    translate: 100% 0;
  }
  .archived .art img {
    filter: grayscale(0.7) brightness(0.8);
  }
  .archived .art {
    background:
      repeating-linear-gradient(
        45deg,
        rgb(0 0 0 / 0.08) 0 8px,
        transparent 8px 16px
      ),
      linear-gradient(135deg, #6b6158, #4a423b);
  }
  .stamp {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    rotate: 8deg;
    padding: 0.1rem 0.5rem;
    border: 2px solid var(--color-ink);
    border-radius: 6px;
    color: var(--color-ink);
    background: rgb(20 17 14 / 0.6);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .action {
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    border: 1px solid var(--color-line);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-ink);
    transition:
      border-color var(--t-control),
      color var(--t-control);
  }
  .action:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  @media (prefers-reduced-motion: reduce) {
    .sleeve.centered:hover .inner,
    .sleeve.centered:focus-within .inner {
      transform: none;
    }
    .sleeve.flipped .inner,
    .sleeve.centered.flipped:hover .inner,
    .sleeve.centered.flipped:focus-within .inner {
      transform: rotateY(180deg);
    }
  }
</style>
