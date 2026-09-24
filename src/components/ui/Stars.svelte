<script lang="ts">
  import { Star } from "@lucide/svelte";

  type Props = {
    rating: number;
    /** Stars pop in one after another each time this flips to true. */
    isLit?: boolean;
    size?: number;
  };

  const MAX_RATING = 5;
  const STARS = Array.from({ length: MAX_RATING }, (_, i) => i);

  let { rating, isLit = true, size = 16 }: Props = $props();
</script>

<span
  class="flex gap-0.5"
  role="img"
  aria-label="Rated {rating} out of {MAX_RATING}"
>
  {#each STARS as i (i)}
    <span
      class="star"
      class:filled={i < rating}
      class:lit={isLit}
      style:--i={i}
      aria-hidden="true"
    >
      <Star {size} fill="currentColor" strokeWidth={0} />
    </span>
  {/each}
</span>

<style>
  .star {
    display: inline-flex;
    color: color-mix(in oklab, var(--color-muted) 30%, transparent);
  }
  .star.filled {
    color: var(--color-star);
  }
  .star.filled.lit {
    animation: star-pop 420ms var(--ease-spring) both;
    animation-delay: calc(var(--i) * 70ms);
  }
</style>
