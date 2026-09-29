<script lang="ts">
  import { type Burst, burstParticles } from "./particles";

  let { burst, t }: { burst: Burst; t: number } = $props();

  const particles = $derived(burstParticles(burst, t));
</script>

{#if particles.length > 0}
  <svg
    class="pointer-events-none absolute inset-0 size-full overflow-visible"
    aria-hidden="true"
  >
    {#each particles as particle, i (i)}
      <g
        transform="translate({particle.x} {particle.y}) rotate({particle.rotation}) scale({particle.size /
          12})"
        opacity={particle.opacity}
      >
        {#if particle.shape === "pixel"}
          <rect x="-4" y="-4" width="8" height="8" fill={particle.color} />
        {:else if particle.shape === "plus"}
          <path d="M-1.5 -6h3v12h-3zM-6 -1.5h12v3h-12z" fill={particle.color} />
        {:else if particle.shape === "ring"}
          <circle
            r="4.5"
            fill="none"
            stroke={particle.color}
            stroke-width="2"
          />
        {:else}
          <rect x="-7" y="-1.5" width="14" height="3" fill={particle.color} />
        {/if}
      </g>
    {/each}
  </svg>
{/if}
